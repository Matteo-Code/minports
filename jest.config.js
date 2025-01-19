/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(chalk)/)",
    "node_modules/(?!(@babel/traverse)/)"
  ],
  extensionsToTreatAsEsm: ['.ts'],
  preset: "ts-jest",
};
