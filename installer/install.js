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

// ANSI Terminal Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[94m',
  magenta: '\x1b[35m'
};

const UI = {
  banner: () => {
    console.clear();
    console.log(`${colors.cyan}${colors.bright}====================================================================`);
    console.log('    📅   CALENDAR FILTER CHART PLUGIN FOR APACHE SUPERSET   📅');
    console.log('====================================================================');
    console.log('       _____      _                _             ');
    console.log('      /  __ \\    | |              | |            ');
    console.log('      | /  \\/ ___| |  _ __  _   _ | | ___  _   _ ');
    console.log('      | |    / _ \\ | | \'_ \\| | | || |/ _ \\| | | |');
    console.log('      | \\__/\\  __/ | | | | | |_| || |  __/| |_| |');
    console.log('       \\____/\\___|_| |_| |_|\\__,_||_|\\___| \\__,_|');
    console.log('                                                 ');
    console.log('                🚀  STREAMLINED AUTO-INSTALLER  🚀');
    console.log(`====================================================================${colors.reset}\n`);
  },
  step: (num, title) => {
    console.log(`\n${colors.cyan}${colors.bright}▶ Step ${num}: ${title}${colors.reset}`);
    console.log(`${colors.dim}--------------------------------------------------------------------${colors.reset}`);
  },
  success: (msg) => {
    console.log(`  ${colors.green}✔ ${msg}${colors.reset}`);
  },
  info: (msg) => {
    console.log(`  ${colors.blue}ℹ ${msg}${colors.reset}`);
  },
  warn: (msg) => {
    console.log(`  ${colors.yellow}⚠ ${msg}${colors.reset}`);
  },
  error: (msg) => {
    console.log(`  ${colors.red}✘ ${msg}${colors.reset}`);
  }
};

// Print the banner immediately
UI.banner();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const pluginDirName = path.basename(__dirname);
let pluginDir = '';
let supersetDir = '';

// Check if this script is running inside the plugin repository
const localPackageJsonPath = path.resolve(__dirname, '..', 'package.json');
let isRunningInPluginRepo = false;
if (fs.existsSync(localPackageJsonPath)) {
  try {
    const pkg = JSON.parse(fs.readFileSync(localPackageJsonPath, 'utf8'));
    if (pkg.name === 'superset-plugin-chart-calendar-filter') {
      isRunningInPluginRepo = true;
    }
  } catch (e) { }
}

if (isRunningInPluginRepo) {
  // Mode 1: Running from the plugin repository
  pluginDir = path.resolve(__dirname, '..');
  UI.info('Running directly from the plugin repository.');

  // Command line argument for Superset path
  const args = process.argv.slice(2);
  if (args.length > 0) {
    supersetDir = path.resolve(args[0]);
    startInstallation();
  } else {
    discoverSuperset();
  }
} else {
  // Mode 2: Running from Superset repository (copied installer folder)
  UI.info('Running from a copied folder inside the Apache Superset repository.');
  if (pluginDirName === 'installer') {
    supersetDir = path.resolve(__dirname, '..');
  } else {
    supersetDir = __dirname;
  }

  // Dynamically search for the plugin repository
  const home = process.env.USERPROFILE || process.env.HOME || '';
  const pluginNames = ['Calendar-Filter-Superset', 'superset-plugin-chart-calendar-filter'];
  
  // Build search roots dynamically:
  // 1. Sibling folders next to Superset root
  // 2. Common project/dev folders inside user's home
  // 3. Desktop / Downloads (common clone targets)
  const searchRoots = [
    path.resolve(supersetDir, '..'),            // sibling to Superset
    home,                                       // home root
    path.join(home, 'Desktop'),
    path.join(home, 'Documents'),
    path.join(home, 'Downloads'),
    path.join(home, 'Projects'),
    path.join(home, 'repos'),
    path.join(home, 'dev'),
    path.join(home, 'src'),
    path.join(home, 'code'),
    path.join(home, 'git'),
  ].filter(Boolean);
  
  // Also scan all OneDrive-like directories in home (OneDrive, OneDrive - CompanyName, etc.)
  if (home && fs.existsSync(home)) {
    try {
      const homeDirs = fs.readdirSync(home);
      for (const d of homeDirs) {
        if (d.toLowerCase().startsWith('onedrive')) {
          searchRoots.push(path.join(home, d));
        }
      }
    } catch (e) {}
  }
  
  // Build full candidate paths
  const searchPaths = [];
  if (process.env.SUPERSET_PLUGIN_PATH) {
    searchPaths.push(process.env.SUPERSET_PLUGIN_PATH);
  }
  for (const root of searchRoots) {
    for (const name of pluginNames) {
      searchPaths.push(path.join(root, name));
    }
  }

  for (const p of searchPaths) {
    const pkgPath = path.join(p, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (pkg.name === 'superset-plugin-chart-calendar-filter') {
          pluginDir = path.resolve(p);
          break;
        }
      } catch (e) { }
    }
  }

  if (pluginDir) {
    startInstallation();
  } else {
    promptPluginPath();
  }
}

function promptPluginPath() {
  console.log(`\n${colors.yellow}Could not locate the plugin repository in standard locations.${colors.reset}`);
  rl.question('Please enter the absolute path to your "Calendar-Filter-Superset" plugin folder: ', (answer) => {
    if (!answer.trim()) {
      UI.error('Path cannot be empty.');
      promptPluginPath();
      return;
    }
    const target = path.resolve(answer.trim());
    const pkgPath = path.join(target, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (pkg.name === 'superset-plugin-chart-calendar-filter') {
          pluginDir = target;
          startInstallation();
          return;
        }
      } catch (e) { }
    }
    UI.error('Invalid plugin path (must contain the original package.json with name "superset-plugin-chart-calendar-filter").');
    promptPluginPath();
  });
}

function discoverSuperset() {
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
    rl.question(`Discovered target Apache Superset at [${colors.bright}${discovered}${colors.reset}]. Use this path? (Y/n): `, (answer) => {
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
  rl.question('Please enter the absolute path to your target Apache Superset folder: ', (answer) => {
    if (!answer.trim()) {
      UI.error('Path cannot be empty.');
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
    console.error(`\n${colors.red}${colors.bright}[ERROR] 'superset-frontend/package.json' not found in: ${supersetDir}${colors.reset}`);
    UI.error('Please make sure you provided the path to the root folder of Apache Superset.\n');
    rl.close();
    process.exit(1);
  }

  UI.banner();
  UI.info(`Plugin Folder:   ${colors.bright}${pluginDir}${colors.reset}`);
  UI.info(`Superset Folder: ${colors.bright}${supersetDir}${colors.reset}`);

  try {
    cleanPreviousInstallation(frontendDir);

    UI.step(2, 'Building Plugin Artifacts');
    buildPluginIfNeeded();

    UI.step(3, 'Registering File Dependency');
    installDependency(frontendDir);

    UI.step(4, 'Patching Preset Registrations');
    registerPreset(frontendDir);

    UI.step(5, 'Advanced Options & Configuration');
    promptAdvancedSteps(frontendDir);
  } catch (error) {
    console.error(`\n${colors.red}${colors.bright}[ERROR] Installation failed: ${error.message}${colors.reset}`);
    rl.close();
    process.exit(1);
  }
}

function cleanPreviousInstallation(frontendDir) {
  UI.step(1, 'Cleaning Previous Installations & Resolving Conflicts');

  // 1. Remove plugin directory
  const targetPluginDir = path.join(frontendDir, 'plugins', 'superset-plugin-chart-calendar-filter');
  if (fs.existsSync(targetPluginDir)) {
    try {
      fs.rmSync(targetPluginDir, { recursive: true, force: true });
      UI.info('Removed old plugin directory to ensure a fresh copy.');
    } catch (e) {
      UI.warn('Could not remove old plugin directory: ' + e.message);
    }
  }

  // 2. Remove from package.json
  const pkgPath = path.join(frontendDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (pkg.dependencies && pkg.dependencies['superset-plugin-chart-calendar-filter']) {
        delete pkg.dependencies['superset-plugin-chart-calendar-filter'];
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
        UI.info('Removed plugin from package.json to rebuild dependency tree.');
      }
    } catch (e) {
      UI.warn('Could not remove plugin from package.json: ' + e.message);
    }
  }

  // 3. Remove from MainPreset.ts / MainPreset.js
  const presetDir = path.join(frontendDir, 'src', 'visualizations', 'presets');
  for (const ext of ['ts', 'js']) {
    const presetFile = path.join(presetDir, `MainPreset.${ext}`);
    if (fs.existsSync(presetFile)) {
      try {
        let content = fs.readFileSync(presetFile, 'utf8');
        const originalContent = content;
        
        // Match ANY import for SupersetPluginChartCalendarFilter
        content = content.replace(/import\s+SupersetPluginChartCalendarFilter\s+from\s+['"].*?['"];?\n?/g, '');
        
        // Match ANY instantiation
        content = content.replace(/[ \t]*new\s+SupersetPluginChartCalendarFilter\(\)\.configure\(\{[\s\S]*?\}\),?\n?/g, '');

        if (content !== originalContent) {
          fs.writeFileSync(presetFile, content, 'utf8');
          UI.info(`Cleaned up previous registrations in MainPreset.${ext}.`);
        }
      } catch (e) {
        UI.warn(`Could not clean MainPreset.${ext}: ` + e.message);
      }
    }
  }
  
  UI.success('Cleanup completed.');
}

function buildPluginIfNeeded() {
  const libDir = path.join(pluginDir, 'lib');
  if (!fs.existsSync(libDir)) {
    UI.warn('Plugin build artifacts (lib/) are missing. Building now...');
    try {
      const nodeModulesDir = path.join(pluginDir, 'node_modules');
      if (!fs.existsSync(nodeModulesDir)) {
        UI.info('Installing plugin dependencies first...');
        execSync('npm install', { cwd: pluginDir, stdio: 'inherit' });
      }
      execSync('npm run build', { cwd: pluginDir, stdio: 'inherit' });
      UI.success('Plugin build completed successfully.');
    } catch (err) {
      throw new Error(`Failed to build plugin: ${err.message}`);
    }
  } else {
    UI.success('Pre-compiled plugin build artifacts (lib/) found.');
  }
}

function installDependency(frontendDir) {
  const targetPluginDir = path.join(frontendDir, 'plugins', 'superset-plugin-chart-calendar-filter');
  
  UI.info('Copying plugin files into superset-frontend/plugins/superset-plugin-chart-calendar-filter...');
  fs.mkdirSync(targetPluginDir, { recursive: true });

  // Copy plugin contents (skipping node_modules and .git)
  const itemsToCopy = ['src', 'lib', 'esm', 'images', 'package.json', 'tsconfig.json', 'README.md', 'LICENSE'];
  for (const item of itemsToCopy) {
    const srcPath = path.join(pluginDir, item);
    const destPath = path.join(targetPluginDir, item);
    if (fs.existsSync(srcPath)) {
      const stat = fs.statSync(srcPath);
      if (stat.isDirectory()) {
        fs.cpSync(srcPath, destPath, { recursive: true });
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  const pkgPath = path.join(frontendDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  const relPath = 'file:./plugins/superset-plugin-chart-calendar-filter';
  pkg.dependencies = pkg.dependencies || {};
  pkg.dependencies['superset-plugin-chart-calendar-filter'] = relPath;
  
  // Inject core peer dependencies that are occasionally lost in Docker fresh lockfile builds
  const missingDeps = {
    "@fontsource/inter": "^5.2.6",
    "lodash.isequal": "^4.5.0",
    "lodash.get": "^4.4.2",
    "diff-match-patch": "^1.0.5"
  };

  // Fix Storybook peer dependency conflict in superset-frontend/package.json
  const storybookDeps = [
    '@storybook/addon-actions',
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    '@storybook/addon-controls',
    '@storybook/components',
    '@storybook/core-common',
    '@storybook/preset-react-webpack',
    '@storybook/react',
    '@storybook/react-webpack5',
    '@storybook/theming',
    'storybook'
  ];
  let sbFixed = false;
  for (const dep of storybookDeps) {
    if (pkg.devDependencies && pkg.devDependencies[dep] && pkg.devDependencies[dep] !== '8.6.17') {
      pkg.devDependencies[dep] = '8.6.17';
      sbFixed = true;
    }
    if (pkg.dependencies && pkg.dependencies[dep] && pkg.dependencies[dep] !== '8.6.17') {
      pkg.dependencies[dep] = '8.6.17';
      sbFixed = true;
    }
  }
  if (sbFixed) {
    UI.success('Fixed Storybook peer dependency mismatch in superset-frontend/package.json (aligned to 8.6.17)');
  }

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
  UI.success(`Copied plugin into superset-frontend/plugins & registered dependency: "${relPath}"`);

  // Ensure .npmrc in superset-frontend has legacy-peer-deps=true for Docker build compatibility
  const npmrcPath = path.join(frontendDir, '.npmrc');
  let npmrcContent = '';
  if (fs.existsSync(npmrcPath)) {
    npmrcContent = fs.readFileSync(npmrcPath, 'utf8');
  }
  if (!npmrcContent.includes('legacy-peer-deps')) {
    npmrcContent += '\nlegacy-peer-deps=true\n';
    fs.writeFileSync(npmrcPath, npmrcContent, 'utf8');
    UI.success('Configured superset-frontend/.npmrc with legacy-peer-deps=true');
  }

  // Regenerate package-lock.json with the new dependency so Docker npm ci succeeds immediately
  ensurePackageLock(frontendDir, true);
}

function registerPreset(frontendDir) {
  const presetDir = path.join(frontendDir, 'src', 'visualizations', 'presets');
  let presetFile = path.join(presetDir, 'MainPreset.ts');
  if (!fs.existsSync(presetFile)) {
    presetFile = path.join(presetDir, 'MainPreset.js');
  }

  if (!fs.existsSync(presetFile)) {
    UI.warn(`MainPreset file not found in ${presetDir}. Skipping registration.`);
    return;
  }

  // Backup file
  fs.copyFileSync(presetFile, `${presetFile}.bak`);
  let content = fs.readFileSync(presetFile, 'utf8');

  const relativeImportLine = "import SupersetPluginChartCalendarFilter from '../../../plugins/superset-plugin-chart-calendar-filter';";

  if (content.includes('SupersetPluginChartCalendarFilter')) {
    UI.success('Plugin already registered in MainPreset.');
    return;
  }

  // Inject import after the last import line
  const lines = content.split('\n');
  let lastImportIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportIdx = i;
    }
  }

  if (lastImportIdx >= 0) {
    lines.splice(lastImportIdx + 1, 0, relativeImportLine);
    content = lines.join('\n');
  } else {
    content = relativeImportLine + '\n' + content;
  }

  // Inject plugin instantiation into plugins array
  const pluginsArrayRe = /new\s+Preset\(\s*\{[\s\S]*?plugins:\s*\[/;
  const match = content.match(pluginsArrayRe);

  if (match) {
    const insertPos = match.index + match[0].length;
    const instantiation = "\n        new SupersetPluginChartCalendarFilter().configure({\n          key: 'superset-plugin-chart-calendar-filter',\n        }),";
    content = content.slice(0, insertPos) + instantiation + content.slice(insertPos);
    fs.writeFileSync(presetFile, content, 'utf8');
    UI.success(`Plugin registered in MainPreset (${path.basename(presetFile)}).`);
  } else {
    // Fallback: look for any new *Plugin(
    const fallbackRe = /new\s+\w+Plugin\(/;
    const fallbackMatch = content.match(fallbackRe);
    if (fallbackMatch) {
      const insertPos = fallbackMatch.index;
      const instantiationFallback = "new SupersetPluginChartCalendarFilter().configure({\n          key: 'superset-plugin-chart-calendar-filter',\n        }),\n        ";
      content = content.slice(0, insertPos) + instantiationFallback + content.slice(insertPos);
      fs.writeFileSync(presetFile, content, 'utf8');
      UI.success(`Plugin registered in MainPreset (${path.basename(presetFile)}) in fallback mode.`);
    } else {
      UI.warn('Could not auto-locate plugins array. Please register manually:');
      console.log(`     Import:  ${relativeImportLine}`);
      console.log(`     Preset:  new SupersetPluginChartCalendarFilter().configure({ key: 'superset-plugin-chart-calendar-filter' }),`);
    }
  }
}

function promptAdvancedSteps(frontendDir) {
  let usingDocker = false;

  rl.question(`   - Apply Docker Compose override? (y/N): `, (ansDocker) => {
    if (ansDocker.trim().toLowerCase() === 'y') {
      usingDocker = true;
      applyDockerOverride();
    } else {
      UI.info('Skipped Docker configuration.');
    }

    rl.question(`   - Apply TS2344 type-check workaround for AceEditor? (y/N): `, (ansAce) => {
      if (ansAce.trim().toLowerCase() === 'y') {
        applyAceFix(frontendDir);
      } else {
        UI.info('Skipped AceEditor fix.');
      }

      rl.question(`   - Whitelist plugin in native filters choice list? (y/N): `, (ansFilter) => {
        if (ansFilter.trim().toLowerCase() === 'y') {
          applyFilterWhitelist(frontendDir);
        } else {
          UI.info('Skipped filters whitelisting.');
        }

        UI.step(6, 'Package Management & Safety Cleanup');

        rl.question(`   - Run frontend safety cleanup (.cache, dist, stale lockfile)? (Y/n): `, (ansClean) => {
          const doSafetyClean = ansClean.trim().toLowerCase() !== 'n';
          if (doSafetyClean) {
            performFrontendSafetyClean(frontendDir, false);
          }

          if (usingDocker) {
            // Docker mode: option to clean host node_modules to avoid cross-OS conflicts
            console.log(`\n   ${colors.cyan}Docker mode detected. The container will compile the frontend inside Docker.${colors.reset}`);
            const nodeModulesPath = path.join(frontendDir, 'node_modules');
            if (fs.existsSync(nodeModulesPath)) {
              rl.question(`   - Remove host node_modules/ to prevent host-container version conflicts? (Y/n): `, (ansCleanModules) => {
                if (ansCleanModules.trim().toLowerCase() !== 'n') {
                  performFrontendSafetyClean(frontendDir, true);
                } else {
                  UI.info('Retained host node_modules/');
                }
                finishInstallation(frontendDir, usingDocker, false);
              });
            } else {
              UI.info('Clean host environment ready for Docker.');
              finishInstallation(frontendDir, usingDocker, false);
            }
          } else {
            // Local dev mode: offer fresh npm install
            rl.question(`   - Run fresh "npm install" in superset-frontend now? (Y/n): `, (ansInstall) => {
              const installRun = ansInstall.trim().toLowerCase() !== 'n';
              if (installRun) {
                console.log(`\n     ${colors.magenta}[NPM] Running 'npm install' with --legacy-peer-deps --ignore-engines...${colors.reset}`);
                console.log('           This might take 1-3 minutes. Please wait.');
                try {
                  execSync('npm install --legacy-peer-deps --ignore-engines', { cwd: frontendDir, stdio: 'inherit' });
                  UI.success('npm install completed successfully.');
                } catch (err) {
                  UI.error('npm install encountered errors. You might need to check your npm packages manually.');
                }
              } else {
                UI.info('Skipped package installation step.');
              }
              finishInstallation(frontendDir, usingDocker, installRun);
            });
          }
        });
      });
    });
  });
}

function performFrontendSafetyClean(frontendDir, deepCleanModules = false) {
  UI.info('Performing cross-platform safety cleanup of superset-frontend...');
  const itemsToClean = [
    { path: path.join(frontendDir, 'node_modules', '.cache'), label: 'node_modules/.cache (Webpack/Babel cache)' },
    { path: path.join(frontendDir, '.temp_cache'), label: '.temp_cache (temporary build cache)' },
    { path: path.join(frontendDir, 'dist'), label: 'dist/ (stale build outputs)' }
  ];

  if (deepCleanModules) {
    itemsToClean.push({ path: path.join(frontendDir, 'node_modules'), label: 'node_modules/ (full dependencies folder)' });
  }

  for (const item of itemsToClean) {
    if (fs.existsSync(item.path)) {
      try {
        fs.rmSync(item.path, { recursive: true, force: true });
        UI.success(`Cleaned: ${item.label}`);
      } catch (err) {
        UI.warn(`Could not clean ${item.label}: ${err.message}`);
      }
    }
  }

  // Clean sub-package build artifacts in packages/ and plugins/
  const subDirs = ['packages', 'plugins'];
  for (const subDir of subDirs) {
    const parentPath = path.join(frontendDir, subDir);
    if (fs.existsSync(parentPath)) {
      try {
        const children = fs.readdirSync(parentPath);
        for (const child of children) {
          const childPath = path.join(parentPath, child);
          if (fs.statSync(childPath).isDirectory()) {
            for (const artifact of ['lib', 'esm', 'tsconfig.tsbuildinfo']) {
              const target = path.join(childPath, artifact);
              if (fs.existsSync(target)) {
                fs.rmSync(target, { recursive: true, force: true });
              }
            }
          }
        }
        UI.success(`Cleaned build artifacts in superset-frontend/${subDir}/*`);
      } catch (e) {}
    }
  }

  // Ensure dependencies & package-lock.json are present and aligned for Docker npm ci
  ensurePackageLock(frontendDir, true);
}

function ensurePackageLock(frontendDir, force = false) {
  const lockFilePath = path.join(frontendDir, 'package-lock.json');
  if (force || !fs.existsSync(lockFilePath)) {
    UI.info('Running "npm install --legacy-peer-deps --ignore-engines" to align frontend dependencies...');
    try {
      execSync('npm install --legacy-peer-deps --ignore-engines', { cwd: frontendDir, stdio: 'inherit' });
      UI.success('NPM dependencies and package-lock.json aligned successfully.');
    } catch (err) {
      UI.warn(`npm install encountered warnings/issues: ${err.message}.`);
    }
  }
}

function finishInstallation(frontendDir, usingDocker, installRun) {
  if (usingDocker) {
    ensurePackageLock(frontendDir);
  }

  console.log(`\n${colors.cyan}${colors.bright}====================================================================`);
  console.log('    🎉   INSTALLATION FINISHED SUCCESSFULLY!   🎉');
  console.log(`====================================================================${colors.reset}\n`);
  console.log(`${colors.bright}Next steps to run the plugin:${colors.reset}`);

  if (usingDocker) {
    console.log(`  1. cd ${path.resolve(frontendDir, '..')}`);
    console.log(`  2. Run: ${colors.green}docker compose -f docker-compose-non-dev.yml -f docker-compose.override.yml up -d --build${colors.reset}`);
    console.log(`  3. Wait for the container to build the frontend (~3-5 min).`);
    console.log(`  4. Open ${colors.cyan}http://localhost:8088${colors.reset} in your browser.\n`);
  } else {
    console.log(`  1. cd ${frontendDir}`);
    if (!installRun) {
      console.log(`  2. Run: ${colors.green}npm install --legacy-peer-deps --ignore-engines${colors.reset}`);
    }
    console.log(`  3. Start dev server: ${colors.green}npm run dev-server${colors.reset}`);
    console.log(`  4. Restart your Flask server or Docker containers.\n`);
  }
  console.log(`${colors.green}${colors.bright}The Calendar Filter plugin is configured and ready to be used!${colors.reset}\n`);
  rl.close();
}

function applyDockerOverride() {
  const overridePath = path.join(supersetDir, 'docker-compose.override.yml');
  const frontendDir = path.join(supersetDir, 'superset-frontend');
  const pluginUnixPath = pluginDir.replace(/\\/g, '/');
  
  // Backup existing override file if present
  if (fs.existsSync(overridePath)) {
    try {
      fs.copyFileSync(overridePath, `${overridePath}.bak`);
      UI.info('Backed up existing docker-compose.override.yml to docker-compose.override.yml.bak');
    } catch (e) {}
  }

  // Dynamically resolve where npm install inside Docker expects to find the plugin
  const relPath = path.relative(frontendDir, pluginDir).replace(/\\/g, '/');
  const parts = relPath.split('/');
  let current = ['app', 'superset-frontend'];
  for (const part of parts) {
    if (part === '..') {
      if (current.length > 0) current.pop();
    } else if (part === '.' || !part) {
      // do nothing
    } else {
      current.push(part);
    }
  }
  const dockerPluginPath = '/' + current.join('/');
  const volumeMount = `${pluginUnixPath}:${dockerPluginPath}:delegated`;

  const services = ['superset', 'superset-node', 'superset-worker', 'superset-worker-beat'];

  let content = `version: '3.7'\n\nservices:\n`;
  for (const svc of services) {
    content += `  ${svc}:\n`;
    content += `    build:\n`;
    content += `      args:\n`;
    content += `        DEV_MODE: 'true'\n`;
    content += `        NPM_CONFIG_LEGACY_PEER_DEPS: 'true'\n`;
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
  UI.success(`Generated & overwritten Docker compose override at: ${overridePath}`);
}

function applyAceFix(frontendDir) {
  let aceFile = path.join(frontendDir, 'src', 'core', 'editors', 'AceEditorProvider.tsx');
  if (!fs.existsSync(aceFile)) {
    aceFile = path.join(frontendDir, 'src', 'core', 'editors', 'AceEditorProvider.jsx');
  }

  if (!fs.existsSync(aceFile)) {
    UI.warn('AceEditorProvider file not found. Skipping fix.');
    return;
  }

  let content = fs.readFileSync(aceFile, 'utf8');
  if (content.includes('type AceEditorComponent')) {
    UI.success('AceEditor type workaround already applied.');
    return;
  }

  const target = "import AceEditor from 'react-ace';";
  const replacement = "import AceEditor from 'react-ace';\n\ntype AceEditorComponent = typeof AceEditor extends any ? any : any;";

  if (content.includes(target)) {
    content = content.replace(target, replacement);
  } else {
    content = content.replace('import AceEditor from "react-ace";', 'import AceEditor from "react-ace";\n\ntype AceEditorComponent = typeof AceEditor extends any ? any : any;');
  }

  fs.writeFileSync(aceFile, content, 'utf8');
  UI.success(`Applied workaround in ${path.basename(aceFile)}`);
}

function applyFilterWhitelist(frontendDir) {
  let constFile = path.join(frontendDir, 'src', 'dashboard', 'components', 'nativeFilters', 'FiltersConfigModal', 'FiltersConfigForm', 'constants.ts');
  if (!fs.existsSync(constFile)) {
    constFile = path.join(frontendDir, 'src', 'dashboard', 'components', 'nativeFilters', 'FiltersConfigModal', 'FiltersConfigForm', 'constants.js');
  }

  if (!fs.existsSync(constFile)) {
    UI.warn('constants.ts/js file for native filters not found. Skipping whitelist.');
    return;
  }

  let content = fs.readFileSync(constFile, 'utf8');
  if (content.includes('superset-plugin-chart-calendar-filter')) {
    UI.success('Plugin already whitelisted in FILTER_SUPPORTED_TYPES.');
    return;
  }

  const target = "FILTER_SUPPORTED_TYPES = {";
  const entry = "\n  'superset-plugin-chart-calendar-filter': [\n    GenericDataType.Temporal,\n    GenericDataType.String,\n    GenericDataType.Numeric,\n    GenericDataType.Boolean,\n  ],";

  if (content.includes(target)) {
    content = content.replace(target, target + entry);
    fs.writeFileSync(constFile, content, 'utf8');
    UI.success(`Whitelisted plugin in ${path.basename(constFile)}`);
  } else {
    const fallbackTarget = "FILTER_SUPPORTED_TYPES: Record<string, GenericDataType[]> = {";
    if (content.includes(fallbackTarget)) {
      content = content.replace(fallbackTarget, fallbackTarget + entry);
      fs.writeFileSync(constFile, content, 'utf8');
      UI.success(`Whitelisted plugin in ${path.basename(constFile)}`);
    } else {
      UI.warn('Could not auto-locate FILTER_SUPPORTED_TYPES object in constants.');
    }
  }
}
