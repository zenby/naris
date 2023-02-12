/* eslint-disable */

const fixForImportMetaError = {
  diagnostics: {
    ignoreCodes: [1343],
  },
  astTransformers: {
    before: [
      {
        path: 'ts-jest-mock-import-meta',
        // for testing `import.meta`
        // metaObject properties can be replaced here
        // options: { metaObjectReplacement: { url: 'https://www.url.com' } },
      },
    ],
  },
};

export default {
  displayName: 'sr-code-runner',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
      ...fixForImportMetaError,
    },
  },
  coverageDirectory: '../../coverage/libs/sr-code-runner',
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
