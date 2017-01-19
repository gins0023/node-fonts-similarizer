const opentype = require('opentype.js');
const shuffle = require('shuffle-array');

const config = require('./config.js');
const scale = require('./scale.js');
const visualSimilarity = require('./visualSimilarity.js');
const visualStrokeSimilarity = require('./visualSimilarity.js').visualStrokeSimilarity;
const textWidth = require('./textWidth.js');

class FontsSimilarizer {

    constructor(baseFont, similarFont) {
        this._baseFont = opentype.loadSync(baseFont);
        this._similarFont = opentype.loadSync(similarFont);
        this._letterFrequency = config.defaultLetterFrequency;
    }

    getVisualSimilarity() {
        if (typeof this._visualSimilarity == 'undefined') {

            let avgSimilaritySum = 0;
            let avgSimilarityWeightSum = 0;

            for (let symbol in this._letterFrequency) {
                if (this._letterFrequency.hasOwnProperty(symbol)) {
                    let symbolSimilarity = visualSimilarity(this._baseFont, this._similarFont, symbol, this._getScale());
                    let weight = this._letterFrequency[symbol];

                    avgSimilaritySum += symbolSimilarity * weight;
                    avgSimilarityWeightSum += weight;
                }
            }

            let similarity = avgSimilaritySum / avgSimilarityWeightSum;

            // stroke weight correction (30%)
            let strokeSymbolSimilarity = visualStrokeSimilarity(this._baseFont, this._similarFont, this._getScale());

            this._visualSimilarity = similarity * 0.7 + strokeSymbolSimilarity * 0.3;

        }
        return this._visualSimilarity;
    }

    getSizeSimilarity() {
        if (typeof this._sizeSimilarity == 'undefined') {

            let avgSimilaritySum = 0;
            let avgSimilarityWeightSum = 0;

            const similarFontSize = Math.round(config.fontSize * this._getScale());

            for (let symbol in this._letterFrequency) {
                if (this._letterFrequency.hasOwnProperty(symbol)) {

                    let baseFontWidth = textWidth(symbol, this._baseFont, config.fontSize);
                    let similarFontWidth = textWidth(symbol, this._similarFont, similarFontSize);

                    let symbolSimilarity = baseFontWidth > similarFontWidth ? (similarFontWidth / baseFontWidth) : (baseFontWidth / similarFontWidth);
                    let weight = this._letterFrequency[symbol];

                    avgSimilaritySum += symbolSimilarity * weight;
                    avgSimilarityWeightSum += weight;
                }
            }

            this._sizeSimilarity = avgSimilaritySum / avgSimilarityWeightSum;

        }
        return this._sizeSimilarity;
    }

    setLetterFrequency(letterFrequency) {
        if (typeof letterFrequency != 'object') {
            throw Error('Invalid letter frequency.');
        }
        let sum = 0;
        for (let symbol in letterFrequency) {
            if (letterFrequency.hasOwnProperty(symbol)) {
                sum += letterFrequency[symbol];
            }
        }
        if (sum < 98 || sum > 102) {
            throw Error('Invalid letter frequency.');
        }
        this._letterFrequency = letterFrequency;
    }

    //todo: setLetterFrequencyFromText(text) {}

    getCssAdaptation() {
        return {
            fontSize: this._getScale(),
            letterSpacing: this._getLetterSpacingAdaptation(),
            wordSpacing: this._getWordSpacingAdaptation()
        }
    }

    _getWordSpacingAdaptation() {
        if (typeof this._wordSpacingAdaptation == 'undefined') {
            const textNoSpace = 'oo';
            const textWithSpace = 'o o';
            const similarFontSize = Math.round(config.fontSize * this._getScale());

            let baseFontWidthNoSpace = textWidth(textNoSpace, this._baseFont, config.fontSize);
            let baseFontWidthWithSpace = textWidth(textWithSpace, this._baseFont, config.fontSize);

            let similarFontWidthNoSpace = textWidth(textNoSpace, this._similarFont, similarFontSize);
            let similarFontWidthWithSpace = textWidth(textWithSpace, this._similarFont, similarFontSize);

            let letterSpacingAdaptation = this._getLetterSpacingAdaptation();

            this._wordSpacingAdaptation = ((baseFontWidthWithSpace - baseFontWidthNoSpace) - (similarFontWidthWithSpace - similarFontWidthNoSpace)) / similarFontSize - letterSpacingAdaptation * 2;
        }
        return this._wordSpacingAdaptation;
    }

    _getLetterSpacingAdaptation() {
        if (typeof this._letterSpacingAdaptation == 'undefined') {
            // todo: if text?
            let symbols = [];
            for (let symbol in this._letterFrequency) {
                if (this._letterFrequency.hasOwnProperty(symbol)) {
                    for (let i = 0; i < Math.ceil(this._letterFrequency[symbol] * 10); i++) {
                        symbols.push(symbol);
                    }
                }
            }
            shuffle(symbols);
            let text = symbols.join('');


            const similarFontSize = Math.round(config.fontSize * this._getScale());
            let baseFontWidth = textWidth(text, this._baseFont, config.fontSize);
            let similarFontWidth = textWidth(text, this._similarFont, similarFontSize);

            let spaces = text.length - 1;

            this._letterSpacingAdaptation = (baseFontWidth - similarFontWidth) / spaces / similarFontSize;
        }
        return this._letterSpacingAdaptation;
    }

    _getScale() {
        if (typeof this._scale == 'undefined') {
            this._scale = scale(this._baseFont, this._similarFont);
        }
        return this._scale;
    }

}