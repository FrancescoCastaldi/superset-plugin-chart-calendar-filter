module.exports = {
  moduleFileExtensions: ['mock.js', 'ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.(gif|ttf|eot|png|jpg)$': '<rootDir>/test/__mocks__/mockExportString.js',
    '^@emotion/styled$': '<rootDir>/test/__mocks__/emotion-styled.ts',
    '^@apache-superset/core/translation$': '<rootDir>/test/__mocks__/superset-ui-core.ts',
    '^@superset-ui/core$': '<rootDir>/test/__mocks__/superset-ui-core.ts',
    '^@superset-ui/chart-controls$': '<rootDir>/test/__mocks__/superset-ui-chart-controls.ts',
  },
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@superset-ui)/)',
  ],
};
