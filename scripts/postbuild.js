const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');

const PATH_TO_BUNDLE = './dist/apps/naris';
const ABSOLUTE_PATH_TO_BUNDLE = path.join(__dirname, '../', PATH_TO_BUNDLE);

// Find the styles css file
const files = getFilesFromPath(ABSOLUTE_PATH_TO_BUNDLE, '.css');
const parsedFiles = [];

if (!files && files.length <= 0) {
  console.log('Cannot find style files to purge');
  return;
}

for (let file of files) {
  // Get original file size
  const filepath = path.join(ABSOLUTE_PATH_TO_BUNDLE, file);
  const originalSize = getFilesizeInKiloBytes(filepath);
  const info = { filename: file, originalSize, newSize: '' };
  parsedFiles.push(info);
}

console.log('Run PurgeCSS...');

const command = `npx purgecss -css ${PATH_TO_BUNDLE}/*.css --content ${PATH_TO_BUNDLE}/index.html ${PATH_TO_BUNDLE}/*.js -o ${PATH_TO_BUNDLE}/`;

exec(command, function (_error, _stdout, _stderr) {
  console.log('PurgeCSS done');

  for (let file of parsedFiles) {
    // Show new file size
    const filepath = path.join(ABSOLUTE_PATH_TO_BUNDLE, file.filename);
    const newSize = getFilesizeInKiloBytes(filepath);
    file.newSize = newSize;
  }

  console.table(parsedFiles);
});

function getFilesizeInKiloBytes(filename) {
  const stats = fs.statSync(filename);
  const fileSizeInBytes = stats.size / 1024;
  return fileSizeInBytes.toFixed(2) + 'kb';
}

function getFilesFromPath(dir, extension) {
  const files = fs.readdirSync(dir);
  return files.filter((e) => path.extname(e).toLowerCase() === extension);
}
