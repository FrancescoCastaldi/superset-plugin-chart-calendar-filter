import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const externalImages = {
  name: 'external-images',
  setup(pluginBuild) {
    pluginBuild.onResolve({ filter: /\.(png|svg)$/ }, (args) => {
      const abs = path.isAbsolute(args.path) ? args.path : path.resolve(args.resolveDir, args.path);
      return {
        path: `../${path.relative(repoRoot, abs).replace(/\\/g, '/')}`,
        external: true,
      };
    });
  },
};

await build({
  entryPoints: [path.resolve(repoRoot, 'src/index.ts')],
  bundle: true,
  format: 'esm',
  target: ['es2020', 'chrome110', 'firefox110', 'safari16'],
  minify: true,
  sourcemap: 'linked',
  sourcesContent: false,
  outfile: path.resolve(repoRoot, 'dist/index.esm.js'),
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    '@superset-ui/core',
    '@superset-ui/chart-controls',
    '@apache-superset/core',
    '@emotion/react',
    '@emotion/styled',
  ],
  plugins: [externalImages],
  logLevel: 'info',
});
