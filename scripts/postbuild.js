const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');

const ROOT_PATH_TO_DIST = './dist/apps/naris';
const RELATIVE_PATH_TO_DIST = path.join('../', ROOT_PATH_TO_DIST);
const ABSOLUTE_PATH_TO_DIST = path.join(__dirname, RELATIVE_PATH_TO_DIST);

// Find the styles css file
const files = getFilesFromPath(ABSOLUTE_PATH_TO_DIST, '.css');
let data = [];

if (!files && files.length <= 0) {
  console.log('Cannot find style files to purge');
  return;
}

for (let f of files) {
  // Get original file size
  const filepath = path.join(__dirname, RELATIVE_PATH_TO_DIST, f);
  const originalSize = getFilesizeInKiloBytes(filepath) + 'kb';
  var o = { file: f, originalSize: originalSize, newSize: '' };
  data.push(o);
}

console.log('Run PurgeCSS...');

const command = `npx purgecss -css ${ROOT_PATH_TO_DIST}/*.css --content ${ROOT_PATH_TO_DIST}/index.html ${ROOT_PATH_TO_DIST}/*.js -o ${ROOT_PATH_TO_DIST}/`;

exec(command, function (_error, _stdout, _stderr) {
  console.log('PurgeCSS done');

  for (let d of data) {
    // Show new file size
    const filepath = path.join(__dirname, RELATIVE_PATH_TO_DIST, d.file);
    const newSize = getFilesizeInKiloBytes(filepath) + 'kb';
    d.newSize = newSize;
  }

  console.table(data);
});

function getFilesizeInKiloBytes(filename) {
  var stats = fs.statSync(filename);
  var fileSizeInBytes = stats.size / 1024;
  return fileSizeInBytes.toFixed(2);
}

function getFilesFromPath(dir, extension) {
  let files = fs.readdirSync(dir);
  return files.filter((e) => path.extname(e).toLowerCase() === extension);
}
