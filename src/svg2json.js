/**
*
*   SVG2JSON Parse SVG string or nodes into a JSON
*   https://github.com/foo123/svg2json
*   @VERSION 1.0.1
*
**/
!function(root, name, factory) {
"use strict";
if (('object' === typeof module) && module.exports) /* CommonJS */
    (module.$deps = module.$deps||{}) && (module.exports = module.$deps[name] = factory.call(root));
else if (('function' === typeof define) && define.amd && ('function' === typeof require) && ('function' === typeof require.specified) && require.specified(name) /*&& !require.defined(name)*/) /* AMD */
    define(name, ['module'], function(module) {factory.moduleUri = module.uri; return factory.call(root);});
else if (!(name in root)) /* Browser/WebWorker/.. */
    (root[name] = factory.call(root)||1) && ('function' === typeof(define)) && define.amd && define(function() {return root[name];});
}(  /* current root */          'undefined' !== typeof self ? self : this,
    /* module name */           "svg2json",
    /* module factory */        function ModuleFactory__svg2json(undef) {
"use strict";

var VERSION = "1.0.1",
    COMMENT = /<!--.*?-->/m,
    TAG = /<(\/)?([a-z0-9_:\-]+)\b\s*([^<>]*)\/?>/im,
    ATT = /([a-z0-9_:\-]+)\b\s*(?:=\s*"([^"]*)")?/im,
    COMMAND = /[MLHVCSQTAZ]/gi,
    TRANSFORM = /(matrix|scale|rotate|translate|skewX|skewY)\s*\(([^\(\)]*)\)/im,
    NUMBER = /-?(?:(?:\d+\.\d+)|(?:\.\d+)|(?:\d+))/g,
    HAS = Object.prototype.hasOwnProperty, stdMath = Math,
    EMPTY_OBJ = {}
;
function trim(s)
{
    return s.trim();
}
function strip_comments(s)
{
    var m;
    while (m=s.match(COMMENT)) s = s.slice(0, m.index) + s.slice(m.index + m[0].length);
    return s;
}
function parse_number(s)
{
    return parseFloat(s || '') || 0;
}
function parse_style(atts)
{
    var styleProperties = {
    'stroke-width':1,
    'stroke':1,
    'stroke-opacity':1,
    'stroke-linecap':1,
    'stroke-linejoin':1,
    'fill':1,
    'fill-opacity':1,
    'fill-rule':1
    };
    var style = trim(atts['style'] ? String(atts['style'].cssText || atts['style']) : '').split(';').reduce(function(s, e) {
        var kv = trim(e).split(':'), k = trim(kv[0]), v = trim(kv.slice(1).join(':'));
        if (HAS.call(styleProperties, k)) s[k] = v;
        return s;
    }, {});
    Object.keys(styleProperties).forEach(function(k) {
        if (HAS.call(atts, k)) style[k] = atts[k];
    });
    return style;
}
function parse_transform(atts)
{
    var m, s = trim(atts.transform || ''), tr = [];
    while (m=s.match(TRANSFORM))
    {
        tr.push([trim(m[1]).toLowerCase(), (trim(m[2]).match(NUMBER) || []).map(parse_number)]);
        s = s.slice(m.index + m[0].length);
    }
    return tr.length ? tr : null;
}
function parse_path(d, curr)
{
    curr = curr || [0, 0];
    d = trim(String(d));
    var c = d.match(COMMAND), p = d.split(COMMAND), start = [curr[0], curr[1]];
    return c ? c.reduce(function(a, c, i) {
        var isRelative = c === c.toLowerCase(),
            pp = (trim(p[i+1] || '').match(NUMBER) || []).map(parse_number),
            p1, p2, p3, p4, tmp;
        switch (c.toUpperCase())
        {
            case 'M':
            if (2 <= pp.length)
            {
                start = [isRelative ? [pp[0], pp[1]] : [pp[0] - curr[0], pp[1] - curr[1]]];
                curr[0] = (isRelative ? curr[0] : 0) + pp[0];
                curr[1] = (isRelative ? curr[1] : 0) + pp[1];
                a.push({
                type: 'Move',
                points: [curr.slice()],
                pointsrel: start
                });
                start = [curr[0], curr[1]];
            }
            break;
            case 'H':
            while (1 <= pp.length)
            {
                p1 = [curr[0], curr[1]];
                p2 = [
                (isRelative ? p1[0] : 0) + pp.shift(),
                p1[1]
                ];
                curr[0] = p2[0];
                curr[1] = p2[1];
                if (a.length && ('Line' === a[a.length-1].type || 'Polyline' === a[a.length-1].type) && !a[a.length-1].Z)
                {
                    a[a.length-1].type = 'Polyline';
                    a[a.length-1].points.push(p2);
                    a[a.length-1].pointsrel.push([p2[0] - p1[0], p2[1] - p1[1]]);
                    if (a[a.length-1].H) delete a[a.length-1].H;
                    if (a[a.length-1].V) delete a[a.length-1].V;
                }
                else
                {
                    a.push({
                    type: 'Line',
                    points: [p1, p2],
                    pointsrel: [[p2[0] - p1[0], p2[1] - p1[1]]],
                    H: true
                    });
                }
            }
            break;
            case 'V':
            while (1 <= pp.length)
            {
                p1 = [curr[0], curr[1]];
                p2 = [
                p1[0],
                (isRelative ? p1[1] : 0) + pp.shift()
                ];
                curr[0] = p2[0];
                curr[1] = p2[1];
                if (a.length && ('Line' === a[a.length-1].type || 'Polyline' === a[a.length-1].type) && !a[a.length-1].Z)
                {
                    a[a.length-1].type = 'Polyline';
                    a[a.length-1].points.push(p2);
                    a[a.length-1].pointsrel.push([p2[0] - p1[0], p2[1] - p1[1]]);
                    if (a[a.length-1].H) delete a[a.length-1].H;
                    if (a[a.length-1].V) delete a[a.length-1].V;
                }
                else
                {
                    a.push({
                    type: 'Line',
                    points: [p1, p2],
                    pointsrel: [[p2[0] - p1[0], p2[1] - p1[1]]],
                    V: true
                    });
                }
            }
            break;
            case 'L':
            while (2 <= pp.length)
            {
                p1 = [curr[0], curr[1]];
                p2 = [
                (isRelative ? p1[0] : 0) + pp.shift(),
                (isRelative ? p1[1] : 0) + pp.shift()
                ];
                curr[0] = p2[0];
                curr[1] = p2[1];
                if (a.length && ('Line' === a[a.length-1].type || 'Polyline' === a[a.length-1].type) && !a[a.length-1].Z)
                {
                    a[a.length-1].type = 'Polyline';
                    a[a.length-1].points.push(p2);
                    a[a.length-1].pointsrel.push([p2[0] - p1[0], p2[1] - p1[1]]);
                    if (a[a.length-1].H) delete a[a.length-1].H;
                    if (a[a.length-1].V) delete a[a.length-1].V;
                }
                else
                {
                    a.push({
                    type: 'Line',
                    points: [p1, p2],
                    pointsrel: [[p2[0] - p1[0], p2[1] - p1[1]]]
                    });
                }
            }
            break;
            case 'A':
            while (7 <= pp.length)
            {
                tmp = {
                    start: null,
                    end: null,
                    endrel: null,
                    radiusX: pp.shift(),
                    radiusY: pp.shift(),
                    angle: pp.shift(),
                    largeArc: pp.shift(),
                    sweep: pp.shift()
                };
                p1 = [curr[0], curr[1]];
                p2 = [
                (isRelative ? p1[0] : 0) + pp.shift(),
                (isRelative ? p1[1] : 0) + pp.shift()
                ];
                curr[0] = p2[0];
                curr[1] = p2[1];
                tmp.start = p1;
                tmp.end = p2;
                tmp.endrel = [p2[0] - p1[0], p2[1] - p1[1]];
                a.push({
                type: 'Arc',
                params: tmp
                });
            }
            break;
            case 'Q':
            while (4 <= pp.length)
            {
                p1 = [curr[0], curr[1]];
                p2 = [
                (isRelative ? p1[0] : 0) + pp.shift(),
                (isRelative ? p1[1] : 0) + pp.shift()
                ];
                p3 = [
                (isRelative ? p1[0] : 0) + pp.shift(),
                (isRelative ? p1[1] : 0) + pp.shift()
                ];
                curr[0] = p3[0];
                curr[1] = p3[1];
                a.push({
                type: 'Quadratic',
                points: [p1, p2, p3],
                pointsrel: [[p2[0] - p1[0], p2[1] - p1[1]], [p3[0] - p1[0], p3[1] - p1[1]]]
                });
            }
            break;
            case 'T':
            while (2 <= pp.length)
            {
                tmp = a.length ? a[a.length-1] : EMPTY_OBJ;
                p1 = [curr[0], curr[1]];
                p3 = [
                (isRelative ? p1[0] : 0) + pp.shift(),
                (isRelative ? p1[1] : 0) + pp.shift()
                ];
                p2 = 'Quadratic' === tmp.type ? [
                2*p1[0] - tmp.points[1][0],
                2*p1[1] - tmp.points[1][1],
                ] : [p1[0], p1[1]];
                curr[0] = p3[0];
                curr[1] = p3[1];
                a.push({
                type: 'Quadratic',
                points: [p1, p2, p3],
                pointsrel: [[p2[0] - p1[0], p2[1] - p1[1]], [p3[0] - p1[0], p3[1] - p1[1]]],
                T: true
                });
            }
            break;
            case 'C':
            while (6 <= pp.length)
            {
                p1 = [curr[0], curr[1]];
                p2 = [
                (isRelative ? p1[0] : 0) + pp.shift(),
                (isRelative ? p1[1] : 0) + pp.shift()
                ];
                p3 = [
                (isRelative ? p1[0] : 0) + pp.shift(),
                (isRelative ? p1[1] : 0) + pp.shift()
                ];
                p4 = [
                (isRelative ? p1[0] : 0) + pp.shift(),
                (isRelative ? p1[1] : 0) + pp.shift()
                ];
                curr[0] = p4[0];
                curr[1] = p4[1];
                a.push({
                type: 'Cubic',
                points: [p1, p2, p3, p4],
                pointsrel: [[p2[0] - p1[0], p2[1] - p1[1]], [p3[0] - p1[0], p3[1] - p1[1]], [p4[0] - p1[0], p4[1] - p1[1]]]
                });
            }
            break;
            case 'S':
            while (4 <= pp.length)
            {
                tmp = a.length ? a[a.length-1] : EMPTY_OBJ;
                p1 = [curr[0], curr[1]];
                p3 = [
                (isRelative ? p1[0] : 0) + pp.shift(),
                (isRelative ? p1[1] : 0) + pp.shift()
                ];
                p4 = [
                (isRelative ? p1[0] : 0) + pp.shift(),
                (isRelative ? p1[1] : 0) + pp.shift()
                ];
                p2 = 'Cubic' === tmp.type ? [
                2*p1[0] - tmp.points[2][0],
                2*p1[1] - tmp.points[2][1],
                ] : [p1[0], p1[1]];
                curr[0] = p4[0];
                curr[1] = p4[1];
                a.push({
                type: 'Cubic',
                points: [p1, p2, p3, p4],
                pointsrel: [[p2[0] - p1[0], p2[1] - p1[1]], [p3[0] - p1[0], p3[1] - p1[1]], [p4[0] - p1[0], p4[1] - p1[1]]],
                S: true
                });
            }
            break;
            case 'Z':
            p1 = [curr[0], curr[1]],
            p2 = [start[0], start[1]];
            curr[0] = p2[0];
            curr[1] = p2[1];
            start = [curr[0], curr[1]];
            a.push({
            type: 'Line',
            points: [p1, p2],
            pointsrel: [[p2[0] - p1[0], p2[1] - p1[1]]],
            Z: true
            });
            break;
        }
        return a;
    }, []) : [];
}
function parse_node_atts(n)
{
    var atts = {}, i, l;
    if (n.attributes)
    {
        for (i=0,l=n.attributes.length; i<l; ++i)
        {
            atts[n.attributes[i].name.toLowerCase()] = n.attributes[i].value;
        }
    }
    return atts;
}
function parse_atts(s)
{
    var m, atts = {};
    while (m=s.match(ATT))
    {
        atts[m[1].toLowerCase()] = m[2] ? trim(m[2]) : true;
        s = s.slice(m.index + m[0].length);
    }
    return atts;
}
function parse_tag(s, cursor)
{
    if (cursor && cursor.parsed) return;
    if (s.tagName && s.children)
    {
        var atts = parse_node_atts(s);
        atts.style = parse_style(atts);
        atts.transform = parse_transform(atts);
        cursor.parsed = true;
        return {
            tag: s.tagName.toLowerCase(),
            atts: atts,
            children: s.children
        };
    }
    else if (s.nodeType)
    {
        return;
    }
    var i = cursor.index || 0, m;
    s = s.slice(i);
    if (m=s.match(TAG))
    {
        cursor.index = i + m.index + m[0].length;
        if ('/' === m[1])
        {
            return {
                tag: m[2].toLowerCase(),
                end: true
            };
        }
        else
        {
            var atts = parse_atts(m[3]);
            atts.style = parse_style(atts);
            atts.transform = parse_transform(atts);
            return {
                tag: m[2].toLowerCase(),
                atts: atts
            };
        }
    }
}
function parse(s, cursor, expectEndTag, curr)
{
    curr = curr || [0, 0];
    var el, p, objects = [], matchEndTag = expectEndTag ? 1 : 0;
    while (el=parse_tag(s, cursor))
    {
        switch (el.tag)
        {
            case 'line':
            if (!el.end)
            {
                p = [
                    [parse_number(el.atts.x1), parse_number(el.atts.y1)],
                    [parse_number(el.atts.x2), parse_number(el.atts.y2)]
                ];
                curr[0] = p[1][0];
                curr[1] = p[1][1];
                objects.push({
                    type: 'Line',
                    style: el.atts.style,
                    transform: el.atts.transform,
                    points: p,
                    pointsrel: p.slice(1).map(function(pt) {return [pt[0] - p[0][0], pt[1] - p[0][1]]})
                });
            }
            break;
            case 'polyline':
            if (!el.end)
            {
                p = ((el.atts.points || '').match(NUMBER) || []).map(parse_number).reduce(function(points, p, i) {
                    if (i % 2)
                    {
                        points[(i - 1)/2][1] = p;
                    }
                    else
                    {
                        points.push([p, 0]);
                    }
                    return points;
                }, []);
                curr[0] = p[p.length-1][0];
                curr[1] = p[p.length-1][1];
                objects.push({
                    type: 'Polyline',
                    style: el.atts.style,
                    transform: el.atts.transform,
                    points: p,
                    pointsrel: p.slice(1).map(function(pt) {return [pt[0] - p[0][0], pt[1] - p[0][1]]})
                });
            }
            break;
            case 'polygon':
            if (!el.end)
            {
                p = ((el.atts.points || '').match(NUMBER) || []).map(parse_number).reduce(function(points, p, i) {
                    if (i % 2)
                    {
                        points[(i - 1)/2][1] = p;
                    }
                    else
                    {
                        points.push([p, 0]);
                    }
                    return points;
                }, []);
                curr[0] = p[0][0];
                curr[1] = p[0][1];
                objects.push({
                    type: 'Polygon',
                    style: el.atts.style,
                    transform: el.atts.transform,
                    points: p,
                    pointsrel: p.slice(1).map(function(pt) {return [pt[0] - p[0][0], pt[1] - p[0][1]]})
                });
            }
            break;
            case 'rect':
            if (!el.end)
            {
                var x = parse_number(el.atts.x), y = parse_number(el.atts.y),
                    w = parse_number(el.atts.width), h = parse_number(el.atts.height);
                p = [[x,y],[x+w,y],[x+w,y+h],[x,y+h]];
                curr[0] = p[0][0];
                curr[1] = p[0][1];
                objects.push({
                    type: 'Polygon',
                    style: el.atts.style,
                    transform: el.atts.transform,
                    rect: [x, y, w, h],
                    points: p,
                    pointsrel: p.slice(1).map(function(pt) {return [pt[0] - p[0][0], pt[1] - p[0][1]]})
                });
            }
            break;
            case 'circle':
            if (!el.end)
            {
                objects.push({
                    type: 'Circle',
                    style: el.atts.style,
                    transform: el.atts.transform,
                    center: [parse_number(el.atts.cx), parse_number(el.atts.cy)],
                    radius: parse_number(el.atts.r)
                });
            }
            break;
            case 'ellipse':
            if (!el.end)
            {
                objects.push({
                    type: 'Ellipse',
                    style: el.atts.style,
                    transform: el.atts.transform,
                    center: [parse_number(el.atts.cx), parse_number(el.atts.cy)],
                    radiusX: parse_number(el.atts.rx),
                    radiusY: parse_number(el.atts.ry),
                    angle: 0
                });
            }
            break;
            case 'path':
            if (!el.end)
            {
                objects.push({
                    type: 'Path',
                    style: el.atts.style,
                    transform: el.atts.transform,
                    d: parse_path(el.atts.d || '', curr)
                });
            }
            break;
            case 'g':
            if (el.end)
            {
                if ('g' === expectEndTag)
                {
                    --matchEndTag;
                    if (0 === matchEndTag) return objects;
                }
            }
            else
            {
                if ('g' === expectEndTag) ++matchEndTag;
                objects.push({
                    type: 'Group',
                    style: el.atts.style,
                    transform: el.atts.transform,
                    nodes: el.children ? [].reduce.call(el.children, function(objects, s) {
                        objects.push.apply(objects, parse(s, {index:0}, 'g', curr));
                        return objects;
                    }, []) : parse(s, cursor, 'g', curr)
                });
            }
            break;
            case 'svg':
            if (el.end)
            {
                if ('svg' === expectEndTag)
                {
                    --matchEndTag;
                    if (0 === matchEndTag) return objects;
                }
            }
            else
            {
                if ('svg' === expectEndTag) ++matchEndTag;
                objects.push({
                    type: 'SVG',
                    viewBox: el.atts.viewbox ? (el.atts.viewbox.match(NUMBER) || []).map(parse_number) : null,
                    width: el.atts.width || null,
                    height: el.atts.height || null,
                    nodes: el.children ? [].reduce.call(el.children, function(objects, s) {
                        objects.push.apply(objects, parse(s, {index:0}, 'svg'));
                        return objects;
                    }, []) : parse(s, cursor, 'svg')
                });
            }
            break;
            default:
            // ignore
            break;
        }
    }
    return objects;
}
function svg2json(svg)
{
    return svg ? parse(svg.tagName ? svg : strip_comments(trim(String(svg))), {index:0}) : [];
}
svg2json.parsePath = parse_path;
svg2json.VERSION = VERSION;

// export it
return svg2json;
});
