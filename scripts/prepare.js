try {
  require('husky').install();
  require('fs').chmodSync('.husky', 0755);
} catch (e) {
  if (e.code !== 'MODULE_NOT_FOUND') throw e;
}
