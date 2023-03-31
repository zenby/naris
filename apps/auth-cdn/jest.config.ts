export default {
  displayName: 'auth-cdn',
  preset: '../../jest.preset.js',
  globals: {},
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleNameMapper: {
    /*
      Force module uuid to resolve with the CJS entry point,
      because Jest does not support package.json.exports.
      See https://github.com/uuidjs/uuid/issues/451
    */
    '^uuid$': require.resolve('uuid'),
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/auth-cdn',
};
