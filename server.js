/* eslint-disable no-console */
const fs = require('fs');
const express = require('express');

const generate = require('./lib');

const app = express();
const port = 3000;

app.get('/generator/2019-shanghai-odyssey', async (req, res) => {
  const { name, title } = req.query;
  if (!name) {
    return res.status(400).send('name 必须提供');
  }
  if (name.length > 10) {
    return res.status(400).send('name 太长');
  }
  if (!title) {
    return res.status(400).send('title 必须提供');
  }
  if (name.length > 20) {
    return res.status(400).send('title 太长');
  }

  try {
    const resultFile = await generate({ name, title });
    res.setHeader('content-type', 'image/jpg');
    fs.createReadStream(resultFile).pipe(res);
  } catch (err) {
    console.error('generate error', { name, title, err });
    res.status(500).send('生成出错');
  }
});

app.listen(port, () => console.log(`Invitation factory listening on port ${port}!`));
