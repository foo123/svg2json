# svg2json

Simple utility to parse SVG to JSON

**version: 1.1.0** (9 kB minified)


Example (see tests):

```javascript
const svg2json = require('../src/svg2json.js');

const svg = String(require('fs').readFileSync(__dirname + '/Peace_sign.svg', {encoding: 'ascii'}));
console.log(svg);

const json = svg2json(svg);
console.log(JSON.stringify(json, null, 2));
```

output:

```html
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- (PD) January 26, 2006 - _Crotalus horridus_  -->
<svg xmlns="http://www.w3.org/2000/svg" width="250" height="250">
<defs><style>.circ{stroke:red}/*.foo{fill:none}*/#p,.circ{stroke-width:2}</style></defs>
<g fill="none" stroke="#000" stroke-width="21" transform="scale(1.1 1.1)">
<circle class="circ" cx="125" cy="125" r="106"/>
<path id="p" class="pth" d="M125,19 v212 M125,125 l-75,75 M125,125 l75,75"/>
</g>
</svg>
```

```json
[
  {
    "type": "SVG",
    "viewBox": null,
    "width": "250",
    "height": "250",
    "nodes": [
      {
        "type": "Defs",
        "nodes": [
          {
            "type": "Style",
            "rules": [
              {
                "selector": ".circ",
                "style": {
                  "stroke": "red"
                }
              },
              {
                "selector": "#p,.circ",
                "style": {
                  "stroke-width": "2"
                }
              }
            ]
          }
        ]
      },
      {
        "type": "Group",
        "transform": [
          [
            "scale",
            [
              1.1,
              1.1
            ]
          ]
        ],
        "nodes": [
          {
            "type": "Circle",
            "class": "circ",
            "center": [
              125,
              125
            ],
            "radius": 106
          },
          {
            "type": "Path",
            "id": "p",
            "class": "pth",
            "d": [
              {
                "type": "Move",
                "points": [
                  [
                    125,
                    19
                  ]
                ],
                "pointsrel": [
                  [
                    125,
                    19
                  ]
                ]
              },
              {
                "type": "Line",
                "points": [
                  [
                    125,
                    19
                  ],
                  [
                    125,
                    231
                  ]
                ],
                "pointsrel": [
                  [
                    0,
                    212
                  ]
                ],
                "V": true
              },
              {
                "type": "Move",
                "points": [
                  [
                    125,
                    125
                  ]
                ],
                "pointsrel": [
                  [
                    0,
                    -106
                  ]
                ]
              },
              {
                "type": "Line",
                "points": [
                  [
                    125,
                    125
                  ],
                  [
                    50,
                    200
                  ]
                ],
                "pointsrel": [
                  [
                    -75,
                    75
                  ]
                ]
              },
              {
                "type": "Move",
                "points": [
                  [
                    125,
                    125
                  ]
                ],
                "pointsrel": [
                  [
                    75,
                    -75
                  ]
                ]
              },
              {
                "type": "Line",
                "points": [
                  [
                    125,
                    125
                  ],
                  [
                    200,
                    200
                  ]
                ],
                "pointsrel": [
                  [
                    75,
                    75
                  ]
                ]
              }
            ]
          }
        ]
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

