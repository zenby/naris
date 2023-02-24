const nxPreset = require('@nrwl/jest/preset');

module.exports = {
  ...nxPreset,
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '@soer/soer-components': '<rootDir>/../../libs/soer-components/src/index.ts',
    '@soer/sr-auth': '<rootDir>/../../libs/sr-auth/src/index.ts',
    '@soer/mixed-bus': '<rootDir>/../../libs/mixed-bus/src/index.ts',
    '@soer/sr-dto': '<rootDir>/../../libs/sr-dto/src/index.ts',
    '@soer/sr-url-builder': '<rootDir>/../../libs/sr-url-builder/src/index.ts',
    '@soer/sr-local-storage': '<rootDir>/../../libs/sr-local-storage/src/index.ts',
    '@soer/sr-editor': '<rootDir>/../../libs/sr-editor/src/index.ts',
    '@soer/sr-common-interfaces': '<rootDir>/../../libs/sr-common-interfaces/src/index.ts',
  },
};
