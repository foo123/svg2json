# svg2json

Simple utility to parse SVG to JSON

**version: 2.0.0** (10 kB minified)


Example (see tests):

```javascript
const svg2json = require('../src/svg2json.js');

const svg = String(require('fs').readFileSync(__dirname + '/test.svg', {encoding: 'ascii'}));
console.log(svg);

const json = svg2json(svg);
console.log(JSON.stringify(json, null, 2));
```

output:

```html
<svg
  viewBox="0 0 10 10"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="myGradient" gradientTransform="rotate(90)">
      <stop offset="5%" stop-color="gold" />
      <stop offset="95%" stop-color="red" />
    </linearGradient>
  </defs>

  <!-- using my linear gradient -->
  <circle cx="5" cy="5" r="4" fill="url('#myGradient')" />
</svg>
```

```json
[
  {
    "type": "SVG",
    "viewBox": [
      0,
      0,
      10,
      10
    ],
    "width": null,
    "height": null,
    "nodes": [
      {
        "type": "Defs",
        "nodes": [
          {
            "type": "linearGradient",
            "atts": {
              "id": "myGradient",
              "gradienttransform": [
                [
                  "rotate",
                  [
                    90
                  ]
                ]
              ]
            },
            "id": "myGradient",
            "stops": [
              {
                "type": "Stop",
                "atts": {
                  "offset": "5%",
                  "stop-color": "gold"
                }
              },
              {
                "type": "Stop",
                "atts": {
                  "offset": "95%",
                  "stop-color": "red"
                }
              }
            ]
          }
        ]
      },
      {
        "type": "Circle",
        "atts": {
          "cx": "5",
          "cy": "5",
          "r": "4",
          "fill": "url('#myGradient')"
        },
        "center": [
          5,
          5
        ],
        "radius": 4
      }
    ]
  }
]
```

**see also:**

* [CanvasLite](https://github.com/foo123/CanvasLite) an html canvas implementation in pure JavaScript
* [Rasterizer](https://github.com/foo123/Rasterizer) stroke and fill lines, rectangles, curves and paths, without canvaσ
* [Gradient](https://github.com/foo123/Gradient) create linear, radial, conic and elliptic gradients and image patterns without canvas
* [Geometrize](https://github.com/foo123/Geometrize) Computational Geometry and Rendering Library for JavaScript
* [Plot.js](https://github.com/foo123/Plot.js) simple and small library which can plot graphs of functions and various simple charts and can render to Canvas, SVG and plain HTML
* [MOD3](https://github.com/foo123/MOD3) 3D Modifier Library in JavaScript
* [HAAR.js](https://github.com/foo123/HAAR.js) image feature detection based on Haar Cascades in JavaScript (Viola-Jones-Lienhart et al Algorithm)
* [HAARPHP](https://github.com/foo123/HAARPHP) image feature detection based on Haar Cascades in PHP (Viola-Jones-Lienhart et al Algorithm)
* [FILTER.js](https://github.com/foo123/FILTER.js) video and image processing and computer vision Library in pure JavaScript (browser and node)
* [css-color](https://github.com/foo123/css-color) simple class to parse and manipulate colors in various formats
* [img2svg](https://github.com/foo123/img2svg) vectorize image data to svg
* [svg2json](https://github.com/foo123/svg2json) parse svg to json

