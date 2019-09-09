/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable function-paren-newline */
/* eslint-disable comma-dangle */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable arrow-parens */

// https://medium.com/@rossbulat/image-processing-in-nodejs-with-jimp-174f39336153
// https://raw.githubusercontent.com/sxei/pinyinjs/master/other/%E5%B8%B8%E7%94%A86763%E4%B8%AA%E6%B1%89%E5%AD%97%E4%BD%BF%E7%94%A8%E9%A2%91%E7%8E%87%E8%A1%A8.txt
const path = require('path');
const Jimp = require('jimp');

// const FONT_HAN_SANS_BLACK_60 = path.join(__dirname, 'assets/fonts/han-sans-bold/black-60.fnt');
const FONT_HAN_SANS_BLUE_60 = path.join(__dirname, 'assets/fonts/han-sans-bold/blue-60.fnt');
const FONT_HAN_SANS_BLACK_36 = path.join(__dirname, 'assets/fonts/han-sans-bold/black-36.fnt');

const imgRaw = path.join(__dirname, 'assets/templates/2019-shanghai-odyssey.jpg');

const imgActive = 'tmp/image.jpg';
const imgExported = 'generated/image1.jpg';

// Jimp.loadFont(FONT_HAN_SANS_BLACK_60).then(font => {
//   try {
//     const result = Jimp.measureText(font, 'wangshijun 王世举');
//     console.log(result);
//   } catch (err) {
//     console.error(err);
//   }
// });
const canvasWidth = 1000;

// read template & clone raw image
Jimp.read(imgRaw)
  .then(tpl => tpl.clone().write(imgActive))

  // read cloned (active) image
  .then(() => Jimp.read(imgActive))

  // add name text
  .then(tpl => Jimp.loadFont(FONT_HAN_SANS_BLUE_60).then(font => [tpl, font]))
  .then(([tpl, font]) => {
    const name = '王仕军';
    const textWidth = Jimp.measureText(font, name);
    const textStart = (canvasWidth - textWidth) / 2;

    const textProps = {
      text: name,
      maxWidth: canvasWidth,
      maxHeight: 60,
      placementX: textStart,
      placementY: 710,
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

  // add position text
  .then(tpl => Jimp.loadFont(FONT_HAN_SANS_BLACK_36).then(font => [tpl, font]))
  .then(([tpl, font]) => {
    const name = 'ArcBlock 前端工程师';
    const textWidth = Jimp.measureText(font, name);
    const textStart = (canvasWidth - textWidth) / 2;

    const textProps = {
      text: name,
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
  .then(tpl => tpl.quality(100).write(imgExported))

  // log exported filename
  .then(() => {
    console.log(`exported file: ${imgExported}`);
  })

  // catch errors
  .catch(err => {
    console.error(err);
  });
