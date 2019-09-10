const fs = require('fs');
const path = require('path');
const generate = require('./lib');

(async () => {
  const resultFile = await generate({ name: '肖凤', title: '' });
  fs.copyFileSync(resultFile, path.join(__dirname, 'generated/demo.jpg'));
})();
