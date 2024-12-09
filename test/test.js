"use strict";

const svg2json = require('../src/svg2json.js');

const svg = String(require('fs').readFileSync(require('path').join(__dirname, process.argv[2] || 'test.svg'), {encoding: 'ascii'}));
console.log(svg);

const json = svg2json(svg);
console.log(JSON.stringify(json, null, 2));