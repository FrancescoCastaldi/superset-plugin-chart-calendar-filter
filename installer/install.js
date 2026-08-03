#!/usr/bin/env node

/**
 * superset-plugin-chart-calendar-filter - Streamlined Installer
 * 
 * A cross-platform, zero-dependency Node.js installer that registers the plugin
 * in Apache Superset. Safe, modular, and interactive.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

console.log('================================================================');
console.log('  Calendar Filter Chart Plugin - Streamlined Installer');
console.log('================================================================\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const pluginDir = path.resolve(__dirname, '..');
let supersetDir = '';

// Command line argument for Superset path
const args = process.argv.slice(2);
if (args.length > 0) {
  supersetDir = path.resolve(args[0]);
  startInstallation();
} else {
  // Auto-discover standard locations relative to this plugin directory
  const candidates = [
    path.resolve(pluginDir, '..', 'superset-6.1.0'),
    path.resolve(pluginDir, '..', 'superset'),
    path.resolve(pluginDir, '..', 'apache-superset')
  ];
  
  let discovered = '';
  for (const cand of candidates) {
    if (fs.existsSync(path.join(cand, 'superset-frontend', 'package.json'))) {
      discovered = cand;
      break;
    }
  }
  
  if (discovered) {
    rl.question(`Discovered Apache Superset at [${discovered}]. Use this path? (Y/n): `, (answer) => {
      if (answer.trim().toLowerCase() === 'n') {
        promptSupersetPath();
      } else {
        supersetDir = discovered;
        startInstallation();
      }
    });
  } else {
    promptSupersetPath();
  }
}

function promptSupersetPath() {
  rl.question('Enter the absolute path to your Apache Superset repository: ', (answer) => {
    if (!answer.trim()) {
      console.error('[ERROR] Path cannot be empty.');
      promptSupersetPath();
      return;
    }
    supersetDir = path.resolve(answer.trim());
    startInstallation();
  });
}

function startInstallation() {
  const frontendDir = path.join(supersetDir, 'superset-frontend');
  
  if (!fs.existsSync(path.join(frontendDir, 'package.json'))) {
    console.error(`\n[ERROR] 'superset-frontend/package.json' not found in: ${supersetDir}`);
    console.error('Make sure you provided the path to the root folder of Apache Superset.\n');
    rl.close();
    process.exit(1);
  }
  
  console.log(`\n[INFO] Plugin Dir:   ${pluginDir}`);
  console.log(`[INFO] Superset Dir: ${supersetDir}`);
  console.log(`[INFO] Frontend Dir: ${frontendDir}\n`);
  
  try {
    buildPluginIfNeeded();
    installDependency(frontendDir);
    registerPreset(frontendDir);
    
    // Interactive advanced steps
    promptAdvancedSteps(frontendDir);
  } catch (error) {
    console.error(`\n[ERROR] Installation failed: ${error.message}`);
    rl.close();
    process.exit(1);
  }
}

function buildPluginIfNeeded() {
  const libDir = path.join(pluginDir, 'lib');
  if (!fs.existsSync(libDir)) {
    console.log('[BUILD] Plugin build artifacts (lib/) are missing. Building now...');
    try {
      execSync('npm run build', { cwd: pluginDir, stdio: 'inherit' });
      console.log('[OK] Plugin build completed.\n');
    } catch (err) {
      throw new Error(`Failed to build plugin: ${err.message}`);
    }
  } else {
    console.log('[OK] Plugin build artifacts (lib/) found.\n');
  }
}

function installDependency(frontendDir) {
  console.log('1. Registering file dependency in superset-frontend/package.json...');
  const pkgPath = path.join(frontendDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  
  const relPath = `file:${path.relative(frontendDir, pluginDir).replace(/\\/g, '/')}`;
  pkg.dependencies = pkg.dependencies || {};
  pkg.dependencies['superset-plugin-chart-calendar-filter'] = relPath;
  
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
  console.log(`   [OK] Added: "superset-plugin-chart-calendar-filter": "${relPath}"\n`);
}

function registerPreset(frontendDir) {
  const presetDir = path.join(frontendDir, 'src', 'visualizations', 'presets');
  let presetFile = path.join(presetDir, 'MainPreset.ts');
  if (!fs.existsSync(presetFile)) {
    presetFile = path.join(presetDir, 'MainPreset.js');
  }
  
  console.log(`2. Registering in MainPreset (${path.basename(presetFile)})...`);
  if (!fs.existsSync(presetFile)) {
    console.log(`   [WARN] MainPreset file not found in ${presetDir}. Skipping registration.`);
    return;
  }
  
  // Backup file
  fs.copyFileSync(presetFile, `${presetFile}.bak`);
  let content = fs.readFileSync(presetFile, 'utf8');
  
  if (content.includes('SupersetPluginChartCalendarFilter')) {
    console.log('   [INFO] Plugin already registered in MainPreset.\n');
    return;
  }
  
  // Inject import after the last import line
  const importLine = "import SupersetPluginChartCalendarFilter from 'superset-plugin-chart-calendar-filter';";
  const lines = content.split('\n');
  let lastImportIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*import\s/.test(lines[i])) {
      lastImportIdx = i;
    }
  }
  if (lastImportIdx >= 0) {
    lines.splice(lastImportIdx + 1, 0, importLine);
  } else {
    lines.unshift(importLine);
  }
  content = lines.join('\n');
  
  // Inject into plugins list
  const instantiation = "\n        new SupersetPluginChartCalendarFilter().configure({\n          key: 'superset-plugin-chart-calendar-filter',\n        }),";
  
  const pluginsRe = /plugins:\s*\[/;
  const match = content.match(pluginsRe);
  if (match) {
    const insertPos = match.index + match[0].length;
    content = content.slice(0, insertPos) + instantiation + content.slice(insertPos);
    fs.writeFileSync(presetFile, content, 'utf8');
    console.log('   [OK] Plugin registered in MainPreset.\n');
  } else {
    // Fallback: look for any new *Plugin(
    const fallbackRe = /new\s+\w+Plugin\(/;
    const fallbackMatch = content.match(fallbackRe);
    if (fallbackMatch) {
      const insertPos = fallbackMatch.index;
      const instantiationFallback = "new SupersetPluginChartCalendarFilter().configure({\n          key: 'superset-plugin-chart-calendar-filter',\n        }),\n        ";
      content = content.slice(0, insertPos) + instantiationFallback + content.slice(insertPos);
      fs.writeFileSync(presetFile, content, 'utf8');
      console.log('   [OK] Plugin registered in MainPreset (fallback mode).\n');
    } else {
      console.log('   [WARN] Could not auto-locate plugins array. Please register manually:\n');
      console.log(`     Import:  ${importLine}`);
      console.log(`     Preset:  new SupersetPluginChartCalendarFilter().configure({ key: 'superset-plugin-chart-calendar-filter' }),\n`);
    }
  }
}

function promptAdvancedSteps(frontendDir) {
  console.log('3. Options & Workarounds:');
  
  rl.question('   - Configure Docker Compose override? (y/N): ', (ansDocker) => {
    if (ansDocker.trim().toLowerCase() === 'y') {
      applyDockerOverride();
    }
    
    rl.question('   - Apply TS2344 type-check workaround for AceEditor? (y/N): ', (ansAce) => {
      if (ansAce.trim().toLowerCase() === 'y') {
        applyAceFix(frontendDir);
      }
      
      rl.question('   - Register plugin in native filter whitelisted viz_types? (y/N): ', (ansFilter) => {
        if (ansFilter.trim().toLowerCase() === 'y') {
          applyFilterWhitelist(frontendDir);
        }
        
        console.log('\n================================================================');
        console.log('  INSTALLATION FINISHED SUCCESSFULLY!');
        console.log('================================================================\n');
        console.log('Next steps:');
        console.log(`  1. cd ${frontendDir}`);
        console.log('  2. npm install');
        console.log('  3. npm run dev-server (or restart Docker compose containers)');
        console.log('\nThe plugin is registered and ready to use.\n');
        rl.close();
      });
    });
  });
}

function applyDockerOverride() {
  const overridePath = path.join(supersetDir, 'docker-compose.override.yml');
  const pluginUnixPath = pluginDir.replace(/\\/g, '/');
  const volumeMount = `${pluginUnixPath}:/Calendar-Filter-Superset:delegated`;
  
  let content = '';
  if (fs.existsSync(overridePath)) {
    content = fs.readFileSync(overridePath, 'utf8');
    if (content.includes('Calendar-Filter-Superset')) {
      console.log('     [INFO] Docker Compose override already configured.');
      return;
    }
  }
  
  const services = ['superset', 'superset-node', 'superset-worker', 'superset-worker-beat'];
  
  if (!content.trim()) {
    // File doesn't exist or is empty: create new
    content = `version: '3.7'\n\nservices:\n`;
    for (const svc of services) {
      content += `  ${svc}:\n`;
      content += `    volumes:\n`;
      content += `      - ${volumeMount}\n`;
      content += `    environment:\n`;
      if (svc.includes('node')) {
        content += `      NPM_CONFIG_install_links: 'true'\n`;
      } else {
        content += `      DEV_MODE: 'false'\n`;
      }
    }
    fs.writeFileSync(overridePath, content, 'utf8');
    console.log(`     [OK] Created: ${overridePath}`);
  } else {
    // File exists: append services to the existing services block safely
    const servicesIndex = content.indexOf('services:');
    if (servicesIndex >= 0) {
      const insertPos = servicesIndex + 'services:'.length;
      let addition = '';
      for (const svc of services) {
        // Only add if service not already defined in override
        if (!content.includes(`  ${svc}:`)) {
          addition += `\n  ${svc}:\n`;
          addition += `    volumes:\n`;
          addition += `      - ${volumeMount}\n`;
          addition += `    environment:\n`;
          if (svc.includes('node')) {
            addition += `      NPM_CONFIG_install_links: 'true'\n`;
          } else {
            addition += `      DEV_MODE: 'false'\n`;
          }
        } else {
          console.log(`     [INFO] Service '${svc}' is already defined in docker-compose.override.yml.`);
          console.log(`            Please manually add the volume mount: "- ${volumeMount}" to it.`);
        }
      }
      if (addition) {
        content = content.slice(0, insertPos) + addition + content.slice(insertPos);
        fs.writeFileSync(overridePath, content, 'utf8');
        console.log(`     [OK] Safe additions appended to: ${overridePath}`);
      }
    } else {
      // 'services:' block not found in the file, append it safely at the end
      content += `\n\nservices:\n`;
      for (const svc of services) {
        content += `  ${svc}:\n`;
        content += `    volumes:\n`;
        content += `      - ${volumeMount}\n`;
        content += `    environment:\n`;
        if (svc.includes('node')) {
          content += `      NPM_CONFIG_install_links: 'true'\n`;
        } else {
          content += `      DEV_MODE: 'false'\n`;
        }
      }
      fs.writeFileSync(overridePath, content, 'utf8');
      console.log(`     [OK] Services block appended to: ${overridePath}`);
    }
  }
}

function applyAceFix(frontendDir) {
  let aceFile = path.join(frontendDir, 'src', 'core', 'editors', 'AceEditorProvider.tsx');
  if (!fs.existsSync(aceFile)) {
    aceFile = path.join(frontendDir, 'src', 'core', 'editors', 'AceEditorProvider.jsx');
  }
  
  if (!fs.existsSync(aceFile)) {
    console.log('     [INFO] AceEditorProvider file not found. Skipping fix.');
    return;
  }
  
  let content = fs.readFileSync(aceFile, 'utf8');
  if (content.includes('type AceEditorComponent')) {
    console.log('     [INFO] AceEditor workaround is already applied.');
    return;
  }
  
  const target = "import AceEditor from 'react-ace';";
  const replacement = "import AceEditor from 'react-ace';\n\ntype AceEditorComponent = typeof AceEditor extends any ? any : any;";
  
  if (content.includes(target)) {
    content = content.replace(target, replacement);
  } else {
    // Try double quotes
    content = content.replace('import AceEditor from "react-ace";', 'import AceEditor from "react-ace";\n\ntype AceEditorComponent = typeof AceEditor extends any ? any : any;');
  }
  
  fs.writeFileSync(aceFile, content, 'utf8');
  console.log(`     [OK] Applied workaround in ${path.basename(aceFile)}`);
}

function applyFilterWhitelist(frontendDir) {
  let constFile = path.join(frontendDir, 'src', 'dashboard', 'components', 'nativeFilters', 'FiltersConfigModal', 'FiltersConfigForm', 'constants.ts');
  if (!fs.existsSync(constFile)) {
    constFile = path.join(frontendDir, 'src', 'dashboard', 'components', 'nativeFilters', 'FiltersConfigModal', 'FiltersConfigForm', 'constants.js');
  }
  
  if (!fs.existsSync(constFile)) {
    console.log('     [INFO] constants.ts/js file for native filters not found. Skipping whitelist.');
    return;
  }
  
  let content = fs.readFileSync(constFile, 'utf8');
  if (content.includes('superset-plugin-chart-calendar-filter')) {
    console.log('     [INFO] Plugin is already registered in FILTER_SUPPORTED_TYPES.');
    return;
  }
  
  const target = "FILTER_SUPPORTED_TYPES = {";
  const entry = "\n  'superset-plugin-chart-calendar-filter': [\n    GenericDataType.Temporal,\n    GenericDataType.String,\n    GenericDataType.Numeric,\n    GenericDataType.Boolean,\n  ],";
  
  if (content.includes(target)) {
    content = content.replace(target, target + entry);
    fs.writeFileSync(constFile, content, 'utf8');
    console.log(`     [OK] Whitelisted plugin in ${path.basename(constFile)}`);
  } else {
    const fallbackTarget = "FILTER_SUPPORTED_TYPES: Record<string, GenericDataType[]> = {";
    if (content.includes(fallbackTarget)) {
      content = content.replace(fallbackTarget, fallbackTarget + entry);
      fs.writeFileSync(constFile, content, 'utf8');
      console.log(`     [OK] Whitelisted plugin in ${path.basename(constFile)}`);
    } else {
      console.log('     [WARN] Could not auto-locate FILTER_SUPPORTED_TYPES object in constants.');
    }
  }
}
