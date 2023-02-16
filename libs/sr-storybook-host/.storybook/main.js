const rootMain = require('../../../.storybook/main');
const narisMain = require('../../../apps/naris/.storybook/main');

module.exports = {
  ...rootMain,

  core: { ...rootMain.core, builder: 'webpack5' },
  staticDirs: [
    { from: '../../../apps/naris/src/assets', to: '/assets' },
    { from: '../../../node_modules/@ant-design/icons-angular/src/inline-svg/', to: '/assets' },
  ],

  stories: [
    ...rootMain.stories,
    // list of all stories in the monorepo
    '../../../apps/naris/**/*.stories.@(js|jsx|ts|tsx)',
    '../../../libs/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [...rootMain.addons],
  webpackFinal: async (config, { configType }) => {
    if (narisMain.webpackFinal) {
      config = await narisMain.webpackFinal(config, { configType });
    }

    return config;
  },
};
