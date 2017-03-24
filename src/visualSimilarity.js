const Canvas = require('canvas');
const config = require('./config.js');


function getMatrixData(path, width, height, cropBox) {
    let canvas = new Canvas(width, height);
    let ctx = canvas.getContext('2d');
    path.fill = 'red';
    path.draw(ctx);
    if (typeof cropBox == 'undefined') {
        cropBox = {
            left: 0,
            top: 0,
            width: width,
            height: height
        };
    }
    return ctx.getImageData(cropBox.left, cropBox.top, cropBox.width, cropBox.height).data;
}


function getPosition(font1, font2, size1, size2, symbol) {
    let path1 = font1.getPath(symbol, 0, 0, size1);
    let path2 = font2.getPath(symbol, 0, 0, size2);

    let box1 = path1.getBoundingBox();
    let box2 = path2.getBoundingBox();

    let offsetX = 1 - Math.min(box1.x1, box2.x1);
    let offsetY = 1 - Math.min(box1.y1, box2.y1);

    let width = Math.ceil(Math.max(box1.x2 - box1.x1, box2.x2 - box2.x1)) + 2;
    let height = Math.ceil(Math.max(box1.y2 - box1.y1, box2.y2 - box2.y1)) + 2;

    return {
        offsetX: offsetX,
        offsetY: offsetY,
        width: width,
        height: height
    };
}

function getMatrixSimilarity(matrix1, matrix2) {
    let hits = 0;
    let total = 0;

    for (let i = 0; i < matrix1.length; i+= 4) {

        let c1 = matrix1[i] * matrix1[i + 3] / 255;
        let c2 = matrix2[i] * matrix2[i + 3] / 255;

        if (c1 > 200 && c2 > 200) {
            hits++;
        }

        if (c1 > 200 || c2 > 200) {
            total++;
        }
    }

    if (0 == total) {
        return 0;
    }

    return hits / total;
}

const visualSimilarity = (baseFont, similarFont, symbol, scale) => {
    const similarFontSize = Math.round(config.fontSize * scale);

    const position = getPosition(baseFont, similarFont, config.fontSize, similarFontSize, symbol);

    let baseFontPath = baseFont.getPath(symbol, position.offsetX, position.offsetY, config.fontSize);
    let similarFontPath = similarFont.getPath(symbol, position.offsetX, position.offsetY, similarFontSize);

    let baseFontMatrixData = getMatrixData(baseFontPath, position.width, position.height);
    let similarFontMatrixData = getMatrixData(similarFontPath, position.width, position.height);

    return getMatrixSimilarity(baseFontMatrixData, similarFontMatrixData);
};

const visualStrokeSimilarity = (baseFont, similarFont, scale, symbol) => {
    const similarFontSize = Math.round(config.fontSize * scale);
    const position = getPosition(baseFont, similarFont, config.fontSize, similarFontSize, symbol);

    let baseFontPath = baseFont.getPath(symbol, position.offsetX, position.offsetY, config.fontSize);
    let similarFontPath = similarFont.getPath(symbol, position.offsetX, position.offsetY, similarFontSize);

    const height = 4;
    let top = Math.ceil((position.height - height) / 2);
    let cropBox = {
        left: 0,
        top: top,
        width: position.width,
        height: height
    };

    let baseFontMatrixData = getMatrixData(baseFontPath, position.width, position.height, cropBox);
    let similarFontMatrixData = getMatrixData(similarFontPath, position.width, position.height, cropBox);

    return getMatrixSimilarity(baseFontMatrixData, similarFontMatrixData);
};

module.exports = visualSimilarity;
module.exports.visualStrokeSimilarity = visualStrokeSimilarity;