const nxPreset = require('@nrwl/jest/preset');

module.exports = {
  ...nxPreset,
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '@soer/soer-components': '<rootDir>/../../libs/soer-components/src/index.ts',
    '@soer/sr-auth-nest': '<rootDir>/../../libs/sr-auth-nest/src/index.ts',
    '@soer/sr-auth': '<rootDir>/../../libs/sr-auth/src/index.ts',
    '@soer/mixed-bus': '<rootDir>/../../libs/mixed-bus/src/index.ts',
    '@soer/sr-dto': '<rootDir>/../../libs/sr-dto/src/index.ts',
    '@soer/sr-url-builder': '<rootDir>/../../libs/sr-url-builder/src/index.ts',
    '@soer/sr-local-storage': '<rootDir>/../../libs/sr-local-storage/src/index.ts',
    '@soer/sr-editor': '<rootDir>/../../libs/sr-editor/src/index.ts',
    '@soer/sr-common-interfaces': '<rootDir>/../../libs/sr-common-interfaces/src/index.ts',
    '@soer/sr-code-runner': '<rootDir>/../../libs/sr-code-runner/src/index.ts',
    '@soer/sr-feature-flags': '<rootDir>/../../libs/sr-feature-flags/src/index.ts',
  },
  /* TODO: Update to latest Jest snapshotFormat
   * By default Nx has kept the older style of Jest Snapshot formats
   * to prevent breaking of any existing tests with snapshots.
   * It's recommend you update to the latest format.
   * You can do this by removing snapshotFormat property
   * and running tests with --update-snapshot flag.
   * Example: "nx affected --targets=test --update-snapshot"
   * More info: https://jestjs.io/docs/upgrading-to-jest29#snapshot-format
   */
  snapshotFormat: { escapeString: true, printBasicPrototype: true },
};
