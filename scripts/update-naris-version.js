const fs = require('fs');
const { exec } = require('child_process');

exec('git describe --tags --abbrev=0', (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }

  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }

  let gitTag = stdout.trim().split('-')[1];

  fs.writeFile(
    './apps/naris/src/environments/version.ts',
    `export const narisVersion = "${gitTag}";\n`,
    function (err) {
      if (err) throw err;
      console.log('Version file is created successfully');
    }
  );
});
