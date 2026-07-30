const { getConfig } = require('@airbnb/config-babel');

const config = getConfig({
  library: true,
  react: true,
  next: true,
  esm: process.env.BABEL_OUTPUT === 'esm',
  node: process.env.NODE_ENV === 'test',
  typescript: true,
  env: {
    targets: { esmodules: true },
  },
});

config.plugins = [];

// Do not ignore @superset-ui modules when running tests via Jest
if (process.env.NODE_ENV === 'test') {
  config.ignore = undefined;
  config.only = undefined;
}

module.exports = config;
