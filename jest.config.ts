import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
  },
  roots: ['<rootDir>/tests'],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(babel-runtime|@babel/traverse)/)", // Allow Jest to transform @babel/traverse
  ],
  verbose: true,
};

export default config;
