# svg2json

Simple utility to parse SVG to JSON

**version: 1.0.1** (8 kB minified)


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
<g fill="none" stroke="#000" stroke-width="21" transform="scale(1.1 1.1)">
<circle cx="125" cy="125" r="106"/>
<path d="M125,19 v212 M125,125 l-75,75 M125,125 l75,75"/>
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
        "type": "Group",
        "style": {
          "stroke-width": "21",
          "stroke": "#000",
          "fill": "none"
        },
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
            "style": {},
            "transform": null,
            "center": [
              125,
              125
            ],
            "radius": 106
          },
          {
            "type": "Path",
            "style": {},
            "transform": null,
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

