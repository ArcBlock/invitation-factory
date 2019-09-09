/* eslint-disable no-console */
/* eslint-disable arrow-parens */
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const generate = require('./lib');

const stream = fs
  .createReadStream(path.join(__dirname, 'guests.csv'))
  .pipe(csv.parse({ headers: true }));

stream.on('data', async ({ name, title }) => {
  stream.pause();
  try {
    const resultPath = await generate({ name, title });
    const targetPath = path.join(__dirname, `batch/${name}-${title}.jpg`);
    fs.copyFileSync(resultPath, targetPath);
    console.log('Success', targetPath);
  } catch (err) {
    console.error('Failed', { name, title });
  }
  stream.resume();
});
