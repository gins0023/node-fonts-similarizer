# Fonts Similarizer
Defines visual similarity of fonts and calculates CSS properties for better similarity.

# Installation
```
npm i fonts-similarizer
```
# Usage

```js
let FontsSimilarizer = require('fonts-similarizer');

let arial = '/path/to/arial.ttf';
let roboto = '/path/to/roboto.ttf';

let fontsSimilarizer = new FontsSimilarizer(arial, roboto);

console.log(fontsSimilarizer.getSizeSimilarity());
// result: 0.9487533507057297

console.log(fontsSimilarizer.getVisualSimilarity());
// result: 0.6640576052704552

console.log(fontsSimilarizer.getCssAdaptation());
// result: { fontSize: 1.0402611534276387,
//           letterSpacing: -0.02557017786321616,
//           wordSpacing: 0.07072794587066308 }
```
# API

#### `constructor(baseFont, similarFont)`
Creates instance of FontsSimilarizer.
- `baseFont`: Path to a base font file (WOFF, OTF, TTF).
- `similarFont`: Path to a font file that should be adapted (WOFF, OTF, TTF).

#### `getSizeSimilarity()`
Defines similarity based on symbols width.

#### `getVisualSimilarity()`
Defines similarity based on symbols visual similarity.

#### `setLetterFrequency(letterFrequency)`
Sets [letter frequency](https://en.wikipedia.org/wiki/Letter_frequency) for specific language (English by default)
- `letterFrequency`: Object, where keya are symbols and values are symbols usage percent. For example: `{a: 8.167, b: 1.492, ...}`.


