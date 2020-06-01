module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: "./__test__",
  moduleNameMapper: {
    "react$": "<rootDir>/__mocks__/reactMock.js",
  }
}
