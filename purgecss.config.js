module.exports = {
  content: ['./dist/apps/naris/index.html', './dist/apps/naris/*.js'],
  css: ['./dist/apps/naris/*.css'],
  output: './dist/apps/naris/',
  /*
    By default, PurgeCSS will remove unused CSS selectors.
    In ng-zorro-antd library certain selectors are used in media queries and are not detected by PurgeCSS.
    To prevent these selectors from being removed, we need to add them to the safelist option.
  */
  safelist: { greedy: [/ant-col/] },
};
