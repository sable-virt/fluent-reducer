module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: "./__test__",
  moduleNameMapper: {
    "^react$": "<rootDir>/../node_modules/react/umd/react.development.js",
  }
}
