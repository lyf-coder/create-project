module.exports = {
    roots: [
        // config sub package 
      "<rootDir>/packages/project-cli/test"
    ],
    testRegex: 'test/(.+)\\.test\\.(jsx?|tsx?|ts?|)$',
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
  },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testTimeout: 30000
  };