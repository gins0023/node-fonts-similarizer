const config = require('./config.js');


function getBoxHeight(box) {
    return box.x2 - box.x1;
}

const scale = (baseFont, similarFont) => {
    const symbol = '0';

    let baseFontPath = baseFont.getPath(symbol, 0, 0, config.fontSize);
    let similarFontPath = similarFont.getPath(symbol, 0, 0, config.fontSize);

    let baseFontHeight = getBoxHeight(baseFontPath.getBoundingBox());
    let similarFontHeight = getBoxHeight(similarFontPath.getBoundingBox());
    return baseFontHeight / similarFontHeight;
};

module.exports = scale;