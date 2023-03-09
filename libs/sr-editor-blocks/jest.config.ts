export default {
  displayName: 'sr-editor-blocks',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
      // fix for import.meta.url usage in jest
      diagnostics: { ignoreCodes: [1343] },
      astTransformers: { before: [{ path: 'ts-jest-mock-import-meta' }] },
    },
  },
  coverageDirectory: '../../coverage/libs/sr-editor-blocks',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': 'jest-preset-angular',
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
