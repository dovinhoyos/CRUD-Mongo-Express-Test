export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'routes/**/*.js',
  ],
  coveragePathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['js'],
  verbose: true,
};
