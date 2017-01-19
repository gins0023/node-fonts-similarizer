

const symbolWidth = (symbol, font, size) => {
    let glyph = font.charToGlyph(symbol);
    return glyph.advanceWidth / (glyph.path.unitsPerEm * size);
};

const textWidth = (text, font, size) => {
    if (1 == text.length) {
        return symbolWidth(text, font, size);
    }

    let path = font.getPath(text, 0, 0, size);
    let box = path.getBoundingBox();
    return box.x2 - box.x1;
};

module.exports = textWidth;