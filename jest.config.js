module.exports = {
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  transformIgnorePatterns: ['/node_modules/'],
  testEnvironment: "node",
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
}