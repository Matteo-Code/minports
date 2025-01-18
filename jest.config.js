// jest.config.js
export default {
  // Tell Jest to look for tests in these directories
  testEnvironment: 'node',
  roots: ['./src', './tests'],
  testMatch: [
    '**/?(*.)+(test).[tj]s?(x)'
  ],
  transform: {
    '^.+\\.[tj]s?$': 'babel-jest'
  },
};
