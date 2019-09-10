/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable function-paren-newline */
/* eslint-disable comma-dangle */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable arrow-parens */

// https://medium.com/@rossbulat/image-processing-in-nodejs-with-jimp-174f39336153
// https://raw.githubusercontent.com/sxei/pinyinjs/master/other/%E5%B8%B8%E7%94%A86763%E4%B8%AA%E6%B1%89%E5%AD%97%E4%BD%BF%E7%94%A8%E9%A2%91%E7%8E%87%E8%A1%A8.txt
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Jimp = require('jimp');

const FONT_HAN_SANS_BLUE_60 = path.join(__dirname, 'assets/fonts/han-sans-bold/blue-60.fnt');
const FONT_HAN_SANS_BLACK_36 = path.join(__dirname, 'assets/fonts/han-sans-bold/black-36.fnt');

const templateFile = path.join(__dirname, 'assets/templates/2019-shanghai-odyssey.jpg');

const canvasWidth = 1000;

module.exports = ({ name, title = '' }) => {
  const cacheKey = crypto
    .createHash('md5')
    .update(JSON.stringify({ name, title }))
    .digest('hex');

  const tmpFile = path.join(__dirname, `tmp/${cacheKey}.jpg`);
  const resultFile = path.join(__dirname, `generated/${cacheKey}.jpg`);

  if (fs.existsSync(resultFile)) {
    return resultFile;
  }

  return new Promise((resolve, reject) => {
    fs.copyFileSync(templateFile, tmpFile);

    Jimp.read(tmpFile)
      // add name text
      .then(tpl => Jimp.loadFont(FONT_HAN_SANS_BLUE_60).then(font => [tpl, font]))
      .then(([tpl, font]) => {
        const textWidth = Jimp.measureText(font, name);
        const textStart = (canvasWidth - textWidth) / 2;

        const textProps = {
          text: name,
          maxWidth: canvasWidth,
          maxHeight: 60,
          placementX: textStart,
          placementY: title ? 710 : 750,
        };

        return tpl.print(
          font,
          textProps.placementX,
          textProps.placementY,
          {
            text: textProps.text,
            alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
          },
          textProps.maxWidth,
          textProps.maxHeight
        );
      })

      // add title text
      .then(tpl => Jimp.loadFont(FONT_HAN_SANS_BLACK_36).then(font => [tpl, font]))
      .then(([tpl, font]) => {
        if (!title) {
          return Promise.resolve(tpl);
        }

        const textWidth = Jimp.measureText(font, title);
        const textStart = (canvasWidth - textWidth) / 2;

        const textProps = {
          text: title,
          maxWidth: canvasWidth,
          maxHeight: 60,
          placementX: textStart,
          placementY: 780,
        };

        return tpl.print(
          font,
          textProps.placementX,
          textProps.placementY,
          {
            text: textProps.text,
            alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
          },
          textProps.maxWidth,
          textProps.maxHeight
        );
      })

      // export image
      .then(tpl => tpl.quality(100).write(resultFile))

      // log exported filename
      .then(() => {
        console.log(`exported file: ${resultFile} for ${JSON.stringify({ name, title })}`);
        fs.unlinkSync(tmpFile);
        resolve(resultFile);
      })

      // catch errors
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
};
