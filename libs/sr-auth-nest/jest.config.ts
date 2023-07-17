export default {
  displayName: 'sr-auth-nest',
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
  moduleNameMapper: {},
  moduleFileExtensions: ['ts', 'js', 'html'],
};
