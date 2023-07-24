/**
После перехода с overview на blocks нужно синхронизировать цели
*/

const mariadb = require('mariadb');
function addslashes(string) {
  return string
    .replace(/\\/g, '\\\\')
    .replace(/\u0008/g, '\\b')
    .replace(/\t/g, '\\t')
    .replace(/\n/g, '\\n')
    .replace(/\f/g, '\\f')
    .replace(/\r/g, '\\r')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"');
}
function convertOverviewToBlocks(target) {
  if (target.overview && !target.blocks) {
    target.blocks = [{ text: target.overview, type: 'markdown' }];

    if (target.tasks && target.tasks.length) {
      for (let i = 0; i < target.tasks.length; i++) {
        convertOverviewToBlocks(target.tasks[i]);
      }
    }
  }
}

(async function asyncFunction() {
  const conn = await mariadb.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 's0er',
    password: 'z3QiLW5x6YYF97lV',
    database: 'naris',
  });

  try {
    const rows = await conn.query("select * from documents  where namespace in ('targets', 'templates')");
    for (let i = 0; i < rows.length; i++) {
      const element = rows[i];
      let json = JSON.parse(element.json);
      convertOverviewToBlocks(json);
      const r = await conn.query(
        'update documents set json="' + addslashes(JSON.stringify(json)) + '" where id=' + element.id
      );
      console.log(r);
    }
  } finally {
    if (conn) conn.end(); //release to pool
  }
})();
