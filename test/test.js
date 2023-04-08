"use strict";

const svg2json = require('../src/svg2json.js');

const svg = String(require('fs').readFileSync(__dirname + '/Peace_sign.svg', {encoding: 'ascii'}));
console.log(svg);

const json = svg2json(svg);
console.log(JSON.stringify(json, null, 2));