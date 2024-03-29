/*
 jSmart Javascript template engine, a port of Smarty PHP to Javascript

 https://github.com/miroshnikov/jsmart

 Copyright 2016, Max Miroshnikov <miroshnikov at gmail dot com> 

 jSmart is licensed under the MIT license
*/
(function() {
    function H(a, c) {
        for (var b = 1; b < arguments.length; ++b)
            for (var d in arguments[b])
                a[d] = arguments[b][d];
        return a
    }
    function L(a) {
        var c = 0, b;
        for (b in a)
            a.hasOwnProperty(b) && c++;
        return c
    }
    function I(a, c) {
        if (Array.prototype.indexOf)
            return a.indexOf(c);
        for (var b = 0; b < a.length; ++b)
            if (a[b] === c)
                return b;
        return -1
    }
    function Q(a) {
        return a.replace(/\\t/, "\t").replace(/\\n/, "\n").replace(/\\(['"\\])/g, "$1")
    }
    function F(a) {
        return Q(a.replace(/^['"](.*)['"]$/, "$1")).replace(/^\s+|\s+$/g, "")
    }
    function C(a, c) {
        for (var b = 0, d = 0, e = h.prototype.left_delimiter, f = h.prototype.right_delimiter, g = h.prototype.auto_literal, m = /^\s*(.+)\s*$/i, m = a ? RegExp("^\\s*(" + a + ")\\s*$", "i") : m, l = 0; l < c.length; ++l)
            if (c.substr(l, e.length) == e)
                g && l + 1 < c.length && c.substr(l + 1, 1).match(/\s/) || (b || (c = c.slice(l),
                d += parseInt(l),
                l = 0),
                ++b);
            else if (c.substr(l, f.length) == f && !(g && 0 <= l - 1 && c.substr(l - 1, 1).match(/\s/))) {
                if (!--b) {
                    var k = c.slice(e.length, l).replace(/[\r\n]/g, " ").match(m);
                    if (k)
                        return k.index = d,
                        k[0] = c.slice(0, l + f.length),
                        k
                }
                0 > b && (b = 0)
            }
        return null
    }
    function R(a, c, b) {
        var d = ""
          , e = null
          , f = null
          , g = 0;
        do {
            e && (g += e[0].length);
            e = C(a, b);
            if (!e)
                throw Error("Unclosed {" + c + "}");
            d += b.slice(0, e.index);
            g += e.index;
            b = b.slice(e.index + e[0].length);
            (f = C(c, d)) && (d = d.slice(f.index + f[0].length))
        } while (f);
        e.index = g;
        return e
    }
    function M(a, c, b, d) {
        for (var e = 0, f = C(b, d); f; f = C(b, d)) {
            var g = C(a, d);
            if (!g || g.index > f.index)
                return f.index += e,
                f;
            d = d.slice(g.index + g[0].length);
            e += g.index + g[0].length;
            f = R(c, a, d);
            d = d.slice(f.index + f[0].length);
            e += f.index + f[0].length
        }
        return null
    }
    function S(a, c) {
        if ("string" == typeof a)
            with ({
                __code: a
            })
                with (J)
                    with (c)
                        try {
                            return eval(__code)
                        } catch (b) {
                            throw Error(b.message + " in \n" + a);
                        }
        return a
    }
    function y(a, c, b) {
        a.match(/\[\]$/) ? b[a.replace(/\[\]$/, "")].push(c) : b[a] = c
    }
    function r(a, c) {
        for (var b = C("", a); b; b = C("", a)) {
            b.index && x(a.slice(0, b.index), c);
            a = a.slice(b.index + b[0].length);
            var d = b[1].match(/^\s*(\w+)(.*)$/);
            if (d) {
                var e = d[1]
                  , d = 2 < d.length ? d[2].replace(/^\s+|\s+$/g, "") : "";
                if (e in G) {
                    var f = G[e]
                      , d = ("parseParams"in f ? f.parseParams : A)(d);
                    "block" == f.type ? (a = a.replace(/^\n/, ""),
                    b = R("/" + e, e + " +[^}]*", a),
                    f.parse(d, c, a.slice(0, b.index)),
                    a = a.slice(b.index + b[0].length)) : (f.parse(d, c),
                    "extends" == e && (c = []));
                    a = a.replace(/^\n/, "")
                } else if (e in B) {
                    if (b = B[e],
                    "block" == b.type ? (b = R("/" + e, e + " +[^}]*", a),
                    d = A(d),
                    f = a.slice(0, b.index),
                    c.push({
                        type: "plugin",
                        name: e,
                        params: d,
                        subTree: r(f, [])
                    }),
                    a = a.slice(b.index + b[0].length)) : "function" == b.type && (b = A(d),
                    c.push({
                        type: "plugin",
                        name: e,
                        params: b
                    })),
                    "append" == e || "assign" == e || "capture" == e || "eval" == e || "include" == e)
                        a = a.replace(/^\n/, "")
                } else
                    G.expression.parse(b[1], c)
            } else
                e = G.expression.parse(b[1], c),
                "build-in" == e.type && "operator" == e.name && "=" == e.op && (a = a.replace(/^\n/, ""))
        }
        a && x(a, c);
        return c
    }
    function x(a, c) {
        if (x.parseEmbeddedVars)
            for (var b = /([$][\w@]+)|`([^`]*)`/, d = a.match(b); d; d = a.match(b))
                c.push({
                    type: "text",
                    data: a.slice(0, d.index)
                }),
                c.push(K(d[1] ? d[1] : d[2]).tree),
                a = a.slice(d.index + d[0].length);
        c.push({
            type: "text",
            data: a
        });
        return c
    }
    function Z(a, c, b) {
        c.__parsed.name = x(a, [])[0];
        b.push({
            type: "plugin",
            name: "__func",
            params: c
        });
        return b
    }
    function t(a, c, b, d) {
        d.push({
            type: "build-in",
            name: "operator",
            op: a,
            optype: c,
            precedence: b,
            params: {}
        })
    }
    function T(a, c, b) {
        var d = c.token;
        b = [{
            type: "text",
            data: b.replace(/^(\w+)@(key|index|iteration|first|last|show|total)/gi, "$1__$2")
        }];
        for (var e = /^(?:\.|\s*->\s*|\[\s*)/, f = a.match(e); f; f = a.match(e)) {
            c.token += f[0];
            a = a.slice(f[0].length);
            var g = {
                value: "",
                tree: []
            };
            if (f[0].match(/\[/)) {
                if (g = K(a))
                    c.token += g.value,
                    b.push(g.tree),
                    a = a.slice(g.value.length);
                if (f = a.match(/\s*\]/))
                    c.token += f[0],
                    a = a.slice(f[0].length)
            } else {
                f = v.stop;
                v.stop = !0;
                if (U(a, g)) {
                    c.token += g.value;
                    var m = g.tree[0];
                    "plugin" == m.type && "__func" == m.name && (m.hasOwner = !0);
                    b.push(m);
                    a = a.slice(g.value.length)
                } else
                    g = !1;
                v.stop = f
            }
            g || b.push({
                type: "text",
                data: ""
            })
        }
        c.tree.push({
            type: "var",
            parts: b
        });
        c.value += c.token.substr(d.length);
        V(c.token);
        return a
    }
    function V(a) {}
    function v(a, c) {
        if (!v.stop) {
            var b = a.match(/^\|(\w+)/);
            if (b) {
                c.value += b[0];
                var d = "default" == b[1] ? "__defaultValue" : "__" + b[1];
                a = a.slice(b[0].length).replace(/^\s+/, "");
                v.stop = !0;
                for (var b = [], e = a.match(/^\s*:\s*/); e; e = a.match(/^\s*:\s*/))
                    c.value += a.slice(0, e[0].length),
                    a = a.slice(e[0].length),
                    e = {
                        value: "",
                        tree: []
                    },
                    U(a, e) ? (c.value += e.value,
                    b.push(e.tree[0]),
                    a = a.slice(e.value.length)) : x("", b);
                v.stop = !1;
                b.unshift(c.tree.pop());
                c.tree.push(Z(d, {
                    __parsed: b
                }, [])[0]);
                v(a, c)
            }
        }
    }
    function U(a, c) {
        if (!a)
            return !1;
        if (a.substr(0, h.prototype.left_delimiter.length) == h.prototype.left_delimiter) {
            var b = C("", a);
            if (b)
                return c.token = b[0],
                c.value += b[0],
                r(b[0], c.tree),
                v(a.slice(c.value.length), c),
                !0
        }
        for (b = 0; b < N.length; ++b)
            if (a.match(N[b].re))
                return c.token = RegExp.lastMatch,
                c.value += RegExp.lastMatch,
                N[b].parse(c, a.slice(c.token.length)),
                !0;
        return !1
    }
    function $(a, c, b) {
        var d = c[a];
        if ("operator" == d.name && d.precedence == b && !d.params.__parsed) {
            if ("binary" == d.optype)
                return d.params.__parsed = [c[a - 1], c[a + 1]],
                c.splice(a - 1, 3, d),
                !0;
            if ("post-unary" == d.optype)
                return d.params.__parsed = [c[a - 1]],
                c.splice(a - 1, 2, d),
                !0;
            d.params.__parsed = [c[a + 1]];
            c.splice(a, 2, d)
        }
        return !1
    }
    function aa(a) {
        for (var c = 0, c = 0; c < a.length; ++c)
            a[c]instanceof Array && (a[c] = aa(a[c]));
        for (var b = 1; 14 > b; ++b)
            if (2 == b || 10 == b)
                for (c = a.length; 0 < c; --c)
                    c -= $(c - 1, a, b);
            else
                for (c = 0; c < a.length; ++c)
                    c -= $(c, a, b);
        return a[0]
    }
    function K(a) {
        for (var c = {
            value: "",
            tree: []
        }; U(a.slice(c.value.length), c); )
            ;
        if (!c.tree.length)
            return !1;
        c.tree = aa(c.tree);
        return c
    }
    function A(a, c, b) {
        var d = a.replace(/\n/g, " ").replace(/^\s+|\s+$/g, "")
          , e = [];
        e.__parsed = [];
        a = "";
        if (!d)
            return e;
        c || (c = /^\s+/,
        b = /^(\w+)\s*=\s*/);
        for (; d; ) {
            var f = null;
            if (b) {
                var g = d.match(b);
                g && (f = F(g[1]),
                a += d.slice(0, g[0].length),
                d = d.slice(g[0].length))
            }
            g = K(d);
            if (!g)
                break;
            f ? (e[f] = g.value,
            e.__parsed[f] = g.tree) : (e.push(g.value),
            e.__parsed.push(g.tree));
            a += d.slice(0, g.value.length);
            d = d.slice(g.value.length);
            if (f = d.match(c))
                a += d.slice(0, f[0].length),
                d = d.slice(f[0].length);
            else
                break
        }
        e.toString = function() {
            return a
        }
        ;
        return e
    }
    function z(a, c) {
        var b = [], d;
        for (d in a.__parsed)
            if (a.__parsed.hasOwnProperty(d)) {
                var e = q([a.__parsed[d]], c);
                "string" == typeof e && e.match(/^[1-9]\d{0,14}$/) && !isNaN(e) && (e = parseInt(e, 10));
                b[d] = e
            }
        b.__get = function(a, c, d) {
            if (a in b && "undefined" != typeof b[a] && "function" != typeof b[a])
                return b[a];
            if ("undefined" != typeof d && "undefined" != typeof b[d])
                return b[d];
            if (null === c)
                throw Error("The required attribute '" + a + "' is missing");
            return c
        }
        ;
        return b
    }
    function D(a, c, b) {
        for (var d = c, e = "", f = 0; f < a.parts.length; ++f) {
            var g = a.parts[f];
            if ("plugin" == g.type && "__func" == g.name && g.hasOwner)
                c.__owner = d,
                d = q([a.parts[f]], c),
                delete c.__owner;
            else {
                e = q([g], c);
                e in c.smarty.section && "text" == g.type && "smarty" != q([a.parts[0]], c) && (e = c.smarty.section[e].index);
                !e && "undefined" != typeof b && d instanceof Array && (e = d.length);
                "undefined" != typeof b && f == a.parts.length - 1 && (d[e] = b);
                if (!("object" == typeof d && null !== d && e in d)) {
                    if ("undefined" == typeof b)
                        return b;
                    d[e] = {}
                }
                d = d[e]
            }
        }
        return d
    }
    function q(a, c) {
        for (var b = "", d = 0; d < a.length; ++d) {
            var e = ""
              , f = a[d];
            if ("text" == f.type)
                e = f.data;
            else if ("var" == f.type)
                e = D(f, c);
            else if ("build-in" == f.type)
                e = G[f.name].process(f, c);
            else if ("plugin" == f.type) {
                var g = B[f.name];
                if ("block" == g.type) {
                    var m = {
                        value: !0
                    };
                    for (g.process(z(f.params, c), "", c, m); m.value; )
                        m.value = !1,
                        e += g.process(z(f.params, c), q(f.subTree, c), c, m)
                } else
                    "function" == g.type && (e = g.process(z(f.params, c), c))
            }
            "boolean" == typeof e && (e = e ? "1" : "");
            if (1 == a.length)
                return e;
            b += null !== e ? e : "";
            if (c.smarty["continue"] || c.smarty["break"])
                break
        }
        return b
    }
    function ba(a, c, b) {
        if (!b && a in W)
            c.length = 0,
            H(c, W[a]);
        else {
            var d = h.prototype.getTemplate(a);
            if ("string" != typeof d)
                throw Error("No template for " + a);
            r(O(h.prototype.filters_global.pre, ca(d.replace(/\r\n/g, "\n"))), c);
            b || (W[a] = c)
        }
        return c
    }
    function ca(a) {
        for (var c = "", b = RegExp(h.prototype.left_delimiter + "\\*"), d = RegExp("\\*" + h.prototype.right_delimiter), e = a.match(b); e; e = a.match(b)) {
            c += a.slice(0, e.index);
            a = a.slice(e.index + e[0].length);
            e = a.match(d);
            if (!e)
                throw Error("Unclosed " + h.left_delimiter + "*");
            a = a.slice(e.index + e[0].length)
        }
        return c + a
    }
    function O(a, c) {
        for (var b = 0; b < a.length; ++b)
            c = a[b](c);
        return c
    }
    var G = {
        expression: {
            parse: function(a, c) {
                var b = K(a);
                c.push({
                    type: "build-in",
                    name: "expression",
                    expression: b.tree,
                    params: A(a.slice(b.value.length).replace(/^\s+|\s+$/g, ""))
                });
                return b.tree
            },
            process: function(a, c) {
                var b = z(a.params, c)
                  , d = q([a.expression], c);
                if (0 > I(b, "nofilter")) {
                    for (b = 0; b < default_modifiers.length; ++b) {
                        var e = default_modifiers[b];
                        e.params.__parsed[0] = {
                            type: "text",
                            data: d
                        };
                        d = q([e], c)
                    }
                    escape_html && (d = J.__escape(d));
                    d = O(varFilters, d);
                    P.length && (__t = function() {
                        return d
                    }
                    ,
                    d = q(P, c))
                }
                return d
            }
        },
        operator: {
            process: function(a, c) {
                var b = z(a.params, c)
                  , d = b[0];
                if ("binary" == a.optype) {
                    b = b[1];
                    if ("=" == a.op)
                        return D(a.params.__parsed[0], c, b),
                        "";
                    if (a.op.match(/(\+=|-=|\*=|\/=|%=)/)) {
                        d = D(a.params.__parsed[0], c);
                        switch (a.op) {
                        case "+=":
                            d += b;
                            break;
                        case "-=":
                            d -= b;
                            break;
                        case "*=":
                            d *= b;
                            break;
                        case "/=":
                            d /= b;
                            break;
                        case "%=":
                            d %= b
                        }
                        return D(a.params.__parsed[0], c, d)
                    }
                    if (a.op.match(/div/))
                        return "div" != a.op ^ 0 == d % b;
                    if (a.op.match(/even/))
                        return "even" != a.op ^ 0 == d / b % 2;
                    if (a.op.match(/xor/))
                        return (d || b) && !(d && b);
                    switch (a.op) {
                    case "==":
                        return d == b;
                    case "!=":
                        return d != b;
                    case "+":
                        return d + b;
                    case "-":
                        return d - b;
                    case "*":
                        return d * b;
                    case "/":
                        return d / b;
                    case "%":
                        return d % b;
                    case "&&":
                        return d && b;
                    case "||":
                        return d || b;
                    case "<":
                        return d < b;
                    case "<=":
                        return d <= b;
                    case ">":
                        return d > b;
                    case ">=":
                        return d >= b;
                    case "===":
                        return d === b;
                    case "!==":
                        return d !== b
                    }
                } else {
                    if ("!" == a.op)
                        return d instanceof Array ? !d.length : "object" == typeof d ? !L(d) : "0" === d ? !0 : !d;
                    (b = "var" == a.params.__parsed[0].type) && (d = D(a.params.__parsed[0], c));
                    var e = d;
                    if ("pre-unary" == a.optype) {
                        switch (a.op) {
                        case "-":
                            e = -d;
                            break;
                        case "++":
                            e = ++d;
                            break;
                        case "--":
                            e = --d
                        }
                        b && D(a.params.__parsed[0], c, d)
                    } else {
                        switch (a.op) {
                        case "++":
                            d++;
                            break;
                        case "--":
                            d--
                        }
                        D(a.params.__parsed[0], c, d)
                    }
                    return e
                }
            }
        },
        section: {
            type: "block",
            parse: function(a, c, b) {
                var d = []
                  , e = [];
                c.push({
                    type: "build-in",
                    name: "section",
                    params: a,
                    subTree: d,
                    subTreeElse: e
                });
                (a = M("section [^}]+", "/section", "sectionelse", b)) ? (r(b.slice(0, a.index), d),
                r(b.slice(a.index + a[0].length).replace(/^[\r\n]/, ""), e)) : r(b, d)
            },
            process: function(a, c) {
                var b = z(a.params, c)
                  , d = {};
                c.smarty.section[b.__get("name", null, 0)] = d;
                var e = b.__get("show", !0);
                d.show = e;
                if (!e)
                    return q(a.subTreeElse, c);
                var e = parseInt(b.__get("start", 0))
                  , f = b.loop instanceof Object ? L(b.loop) : isNaN(b.loop) ? 0 : parseInt(b.loop)
                  , g = parseInt(b.__get("step", 1))
                  , b = parseInt(b.__get("max"));
                isNaN(b) && (b = Number.MAX_VALUE);
                0 > e ? (e += f,
                0 > e && (e = 0)) : e >= f && (e = f ? f - 1 : 0);
                for (var m = 0, l = e; 0 <= l && l < f && m < b; l += g,
                ++m)
                    ;
                d.total = m;
                d.loop = m;
                for (var m = 0, k = "", l = e; 0 <= l && l < f && m < b && !c.smarty["break"]; l += g,
                ++m)
                    d.first = l == e,
                    d.last = 0 > l + g || l + g >= f,
                    d.index = l,
                    d.index_prev = l - g,
                    d.index_next = l + g,
                    d.iteration = d.rownum = m + 1,
                    k += q(a.subTree, c),
                    c.smarty["continue"] = !1;
                c.smarty["break"] = !1;
                return m ? k : q(a.subTreeElse, c)
            }
        },
        setfilter: {
            type: "block",
            parseParams: function(a) {
                return [K("__t()|" + a).tree]
            },
            parse: function(a, c, b) {
                c.push({
                    type: "build-in",
                    name: "setfilter",
                    params: a,
                    subTree: r(b, [])
                })
            },
            process: function(a, c) {
                P = a.params;
                var b = q(a.subTree, c);
                P = [];
                return b
            }
        },
        "for": {
            type: "block",
            parseParams: function(a) {
                var c = a.match(/^\s*\$(\w+)\s*=\s*([^\s]+)\s*to\s*([^\s]+)\s*(?:step\s*([^\s]+))?\s*(.*)$/);
                if (!c)
                    throw Error("Invalid {for} parameters: " + a);
                return A("varName='" + c[1] + "' from=" + c[2] + " to=" + c[3] + " step=" + (c[4] ? c[4] : "1") + " " + c[5])
            },
            parse: function(a, c, b) {
                var d = []
                  , e = [];
                c.push({
                    type: "build-in",
                    name: "for",
                    params: a,
                    subTree: d,
                    subTreeElse: e
                });
                (a = M("for\\s[^}]+", "/for", "forelse", b)) ? (r(b.slice(0, a.index), d),
                r(b.slice(a.index + a[0].length), e)) : r(b, d)
            },
            process: function(a, c) {
                var b = z(a.params, c)
                  , d = parseInt(b.__get("from"))
                  , e = parseInt(b.__get("to"))
                  , f = parseInt(b.__get("step"));
                isNaN(f) && (f = 1);
                var g = parseInt(b.__get("max"));
                isNaN(g) && (g = Number.MAX_VALUE);
                for (var m = 0, l = "", d = Math.min(Math.ceil(((0 < f ? e - d : d - e) + 1) / Math.abs(f)), g), e = parseInt(b.from); m < d && !c.smarty["break"]; e += f,
                ++m)
                    c[b.varName] = e,
                    l += q(a.subTree, c),
                    c.smarty["continue"] = !1;
                c.smarty["break"] = !1;
                m || (l = q(a.subTreeElse, c));
                return l
            }
        },
        "if": {
            type: "block",
            parse: function(a, c, b) {
                var d = []
                  , e = [];
                c.push({
                    type: "build-in",
                    name: "if",
                    params: a,
                    subTreeIf: d,
                    subTreeElse: e
                });
                (a = M("if\\s+[^}]+", "/if", "else[^}]*", b)) ? (r(b.slice(0, a.index), d),
                b = b.slice(a.index + a[0].length),
                (d = a[1].match(/^else\s*if(.*)/)) ? G["if"].parse(A(d[1]), e, b.replace(/^\n/, "")) : r(b.replace(/^\n/, ""), e)) : r(b, d)
            },
            process: function(a, c) {
                var b = z(a.params, c)[0];
                return !b || b instanceof Array && !b.length || b instanceof Object && !L(b) ? q(a.subTreeElse, c) : q(a.subTreeIf, c)
            }
        },
        foreach: {
            type: "block",
            parseParams: function(a) {
                var c = a.match(/^\s*([$].+)\s*as\s*[$](\w+)\s*(=>\s*[$](\w+))?\s*$/i);
                c && (a = "from=" + c[1] + " item=" + (c[4] || c[2]),
                c[4] && (a += " key=" + c[2]));
                return A(a)
            },
            parse: function(a, c, b) {
                var d = []
                  , e = [];
                c.push({
                    type: "build-in",
                    name: "foreach",
                    params: a,
                    subTree: d,
                    subTreeElse: e
                });
                (a = M("foreach\\s[^}]+", "/foreach", "foreachelse", b)) ? (r(b.slice(0, a.index), d),
                r(b.slice(a.index + a[0].length).replace(/^[\r\n]/, ""), e)) : r(b, d)
            },
            process: function(a, c) {
                var b = z(a.params, c)
                  , d = b.from;
                "undefined" == typeof d && (d = []);
                "object" != typeof d && (d = [d]);
                var e = L(d);
                c[b.item + "__total"] = e;
                "name"in b && (c.smarty.foreach[b.name] = {},
                c.smarty.foreach[b.name].total = e);
                var f = "", g = 0, m;
                for (m in d)
                    if (d.hasOwnProperty(m)) {
                        if (c.smarty["break"])
                            break;
                        c[b.item + "__key"] = isNaN(m) ? m : parseInt(m);
                        "key"in b && (c[b.key] = c[b.item + "__key"]);
                        c[b.item] = d[m];
                        c[b.item + "__index"] = parseInt(g);
                        c[b.item + "__iteration"] = parseInt(g + 1);
                        c[b.item + "__first"] = 0 === g;
                        c[b.item + "__last"] = g == e - 1;
                        "name"in b && (c.smarty.foreach[b.name].index = parseInt(g),
                        c.smarty.foreach[b.name].iteration = parseInt(g + 1),
                        c.smarty.foreach[b.name].first = 0 === g ? 1 : "",
                        c.smarty.foreach[b.name].last = g == e - 1 ? 1 : "");
                        ++g;
                        f += q(a.subTree, c);
                        c.smarty["continue"] = !1
                    }
                c.smarty["break"] = !1;
                c[b.item + "__show"] = 0 < g;
                b.name && (c.smarty.foreach[b.name].show = 0 < g ? 1 : "");
                return 0 < g ? f : q(a.subTreeElse, c)
            }
        },
        "function": {
            type: "block",
            parse: function(a, c, b) {
                c = [];
                B[F(a.name ? a.name : a[0])] = {
                    type: "function",
                    subTree: c,
                    defautParams: a,
                    process: function(a, b) {
                        var c = z(this.defautParams, b);
                        delete c.name;
                        return q(this.subTree, H({}, b, c, a))
                    }
                };
                r(b, c)
            }
        },
        php: {
            type: "block",
            parse: function(a, c, b) {}
        },
        "extends": {
            type: "function",
            parse: function(a, c) {
                c.splice(0, c.length);
                ba(F(a.file ? a.file : a[0]), c)
            }
        },
        block: {
            type: "block",
            parse: function(a, c, b) {
                c.push({
                    type: "build-in",
                    name: "block",
                    params: a
                });
                a.append = 0 <= I(a, "append");
                a.prepend = 0 <= I(a, "prepend");
                a.hide = 0 <= I(a, "hide");
                a.hasChild = a.hasParent = !1;
                V = function(b) {
                    b.match(/^\s*[$]smarty.block.child\s*$/) && (a.hasChild = !0);
                    b.match(/^\s*[$]smarty.block.parent\s*$/) && (a.hasParent = !0)
                }
                ;
                c = r(b, []);
                V = function(a) {}
                ;
                b = F(a.name ? a.name : a[0]);
                b in E || (E[b] = []);
                E[b].push({
                    tree: c,
                    params: a
                })
            },
            process: function(a, c) {
                c.smarty.block.parent = c.smarty.block.child = "";
                var b = F(a.params.name ? a.params.name : a.params[0]);
                this.processBlocks(E[b], E[b].length - 1, c);
                return c.smarty.block.child
            },
            processBlocks: function(a, c, b) {
                if (!c && a[c].params.hide)
                    b.smarty.block.child = "";
                else
                    for (var d = !0, e = !1; 0 <= c; --c) {
                        if (a[c].params.hasParent) {
                            var f = b.smarty.block.child;
                            b.smarty.block.child = "";
                            this.processBlocks(a, c - 1, b);
                            b.smarty.block.parent = b.smarty.block.child;
                            b.smarty.block.child = f
                        }
                        var f = b.smarty.block.child
                          , g = q(a[c].tree, b);
                        b.smarty.block.child = f;
                        a[c].params.hasChild ? b.smarty.block.child = g : d ? b.smarty.block.child = g + b.smarty.block.child : e && (b.smarty.block.child += g);
                        d = a[c].params.append;
                        e = a[c].params.prepend
                    }
            }
        },
        strip: {
            type: "block",
            parse: function(a, c, b) {
                r(b.replace(/[ \t]*[\r\n]+[ \t]*/g, ""), c)
            }
        },
        literal: {
            type: "block",
            parse: function(a, c, b) {
                x(b, c)
            }
        },
        ldelim: {
            type: "function",
            parse: function(a, c) {
                x(h.prototype.left_delimiter, c)
            }
        },
        rdelim: {
            type: "function",
            parse: function(a, c) {
                x(h.prototype.right_delimiter, c)
            }
        },
        "while": {
            type: "block",
            parse: function(a, c, b) {
                c.push({
                    type: "build-in",
                    name: "while",
                    params: a,
                    subTree: r(b, [])
                })
            },
            process: function(a, c) {
                for (var b = ""; z(a.params, c)[0] && !c.smarty["break"]; )
                    b += q(a.subTree, c),
                    c.smarty["continue"] = !1;
                c.smarty["break"] = !1;
                return b
            }
        }
    }
      , B = {}
      , J = {}
      , W = {}
      , E = null
      , X = null
      , P = []
      , N = [{
        re: /^\$([\w@]+)/,
        parse: function(a, c) {
            v(T(c, a, RegExp.$1), a)
        }
    }, {
        re: /^(true|false)/i,
        parse: function(a, c) {
            x(a.token.match(/true/i) ? "1" : "", a.tree)
        }
    }, {
        re: /^'([^'\\]*(?:\\.[^'\\]*)*)'/,
        parse: function(a, c) {
            x(Q(RegExp.$1), a.tree);
            v(c, a)
        }
    }, {
        re: /^"([^"\\]*(?:\\.[^"\\]*)*)"/,
        parse: function(a, c) {
            var b = Q(RegExp.$1)
              , d = b.match(N[0].re);
            if (d) {
                var e = {
                    token: d[0],
                    tree: []
                };
                T(b, e, d[1]);
                if (e.token.length == b.length) {
                    a.tree.push(e.tree[0]);
                    return
                }
            }
            x.parseEmbeddedVars = !0;
            a.tree.push({
                type: "plugin",
                name: "__quoted",
                params: {
                    __parsed: r(b, [])
                }
            });
            x.parseEmbeddedVars = !1;
            v(c, a)
        }
    }, {
        re: /^(\w+)\s*[(]([)]?)/,
        parse: function(a, c) {
            var b = RegExp.$1
              , d = A(RegExp.$2 ? "" : c, /^\s*,\s*/);
            Z(b, d, a.tree);
            a.value += d.toString();
            v(c.slice(d.toString().length), a)
        }
    }, {
        re: /^\s*\(\s*/,
        parse: function(a, c) {
            var b = [];
            a.tree.push(b);
            b.parent = a.tree;
            a.tree = b
        }
    }, {
        re: /^\s*\)\s*/,
        parse: function(a, c) {
            a.tree.parent && (a.tree = a.tree.parent)
        }
    }, {
        re: /^\s*(\+\+|--)\s*/,
        parse: function(a, c) {
            a.tree.length && "var" == a.tree[a.tree.length - 1].type ? t(RegExp.$1, "post-unary", 1, a.tree) : t(RegExp.$1, "pre-unary", 1, a.tree)
        }
    }, {
        re: /^\s*(===|!==|==|!=)\s*/,
        parse: function(a, c) {
            t(RegExp.$1, "binary", 6, a.tree)
        }
    }, {
        re: /^\s+(eq|ne|neq)\s+/i,
        parse: function(a, c) {
            var b = RegExp.$1.replace(/ne(q)?/, "!=").replace(/eq/, "==");
            t(b, "binary", 6, a.tree)
        }
    }, {
        re: /^\s*!\s*/,
        parse: function(a, c) {
            t("!", "pre-unary", 2, a.tree)
        }
    }, {
        re: /^\s+not\s+/i,
        parse: function(a, c) {
            t("!", "pre-unary", 2, a.tree)
        }
    }, {
        re: /^\s*(=|\+=|-=|\*=|\/=|%=)\s*/,
        parse: function(a, c) {
            t(RegExp.$1, "binary", 10, a.tree)
        }
    }, {
        re: /^\s*(\*|\/|%)\s*/,
        parse: function(a, c) {
            t(RegExp.$1, "binary", 3, a.tree)
        }
    }, {
        re: /^\s+mod\s+/i,
        parse: function(a, c) {
            t("%", "binary", 3, a.tree)
        }
    }, {
        re: /^\s*(\+|-)\s*/,
        parse: function(a, c) {
            a.tree.length && "operator" != a.tree[a.tree.length - 1].name ? t(RegExp.$1, "binary", 4, a.tree) : t(RegExp.$1, "pre-unary", 4, a.tree)
        }
    }, {
        re: /^\s*(<=|>=|<>|<|>)\s*/,
        parse: function(a, c) {
            t(RegExp.$1.replace(/<>/, "!="), "binary", 5, a.tree)
        }
    }, {
        re: /^\s+(lt|lte|le|gt|gte|ge)\s+/i,
        parse: function(a, c) {
            var b = RegExp.$1.replace(/lt/, "<").replace(/l(t)?e/, "<=").replace(/gt/, ">").replace(/g(t)?e/, ">=");
            t(b, "binary", 5, a.tree)
        }
    }, {
        re: /^\s+(is\s+(not\s+)?div\s+by)\s+/i,
        parse: function(a, c) {
            t(RegExp.$2 ? "div_not" : "div", "binary", 7, a.tree)
        }
    }, {
        re: /^\s+is\s+(not\s+)?(even|odd)(\s+by\s+)?\s*/i,
        parse: function(a, c) {
            t(RegExp.$1 ? "odd" == RegExp.$2 ? "even" : "even_not" : "odd" == RegExp.$2 ? "even_not" : "even", "binary", 7, a.tree);
            RegExp.$3 || x("1", a.tree)
        }
    }, {
        re: /^\s*(&&)\s*/,
        parse: function(a, c) {
            t(RegExp.$1, "binary", 8, a.tree)
        }
    }, {
        re: /^\s*(\|\|)\s*/,
        parse: function(a, c) {
            t(RegExp.$1, "binary", 9, a.tree)
        }
    }, {
        re: /^\s+and\s+/i,
        parse: function(a, c) {
            t("&&", "binary", 11, a.tree)
        }
    }, {
        re: /^\s+xor\s+/i,
        parse: function(a, c) {
            t("xor", "binary", 12, a.tree)
        }
    }, {
        re: /^\s+or\s+/i,
        parse: function(a, c) {
            t("||", "binary", 13, a.tree)
        }
    }, {
        re: /^#(\w+)#/,
        parse: function(a, c) {
            var b = {
                token: "$smarty",
                tree: []
            };
            T(".config." + RegExp.$1, b, "smarty");
            a.tree.push(b.tree[0]);
            v(c, a)
        }
    }, {
        re: /^\s*\[\s*/,
        parse: function(a, c) {
            var b = A(c, /^\s*,\s*/, /^('[^'\\]*(?:\\.[^'\\]*)*'|"[^"\\]*(?:\\.[^"\\]*)*"|\w+)\s*=>\s*/);
            a.tree.push({
                type: "plugin",
                name: "__array",
                params: b
            });
            a.value += b.toString();
            if (b = c.slice(b.toString().length).match(/\s*\]/))
                a.value += b[0]
        }
    }, {
        re: /^[\d.]+/,
        parse: function(a, c) {
            x(a.token, a.tree);
            v(c, a)
        }
    }, {
        re: /^\w+/,
        parse: function(a, c) {
            x(a.token, a.tree);
            v(c, a)
        }
    }]
      , h = function(a) {
        this.tree = [];
        this.tree.blocks = {};
        this.scripts = {};
        this.default_modifiers = [];
        this.filters = {
            variable: [],
            post: []
        };
        this.smarty = {
            smarty: {
                block: {},
                "break": !1,
                capture: {},
                "continue": !1,
                counter: {},
                cycle: {},
                foreach: {},
                section: {},
                now: Math.floor((new Date).getTime() / 1E3),
                "const": {},
                config: {},
                current_dir: "/",
                template: "",
                ldelim: h.prototype.left_delimiter,
                rdelim: h.prototype.right_delimiter,
                version: "3.2"
            }
        };
        E = this.tree.blocks;
        r(O(h.prototype.filters_global.pre, ca((new String(a ? a : "")).replace(/\r\n/g, "\n"))), this.tree)
    };
    h.prototype.fetch = function(a) {
        E = this.tree.blocks;
        X = this.scripts;
        escape_html = this.escape_html;
        default_modifiers = h.prototype.default_modifiers_global.concat(this.default_modifiers);
        this.data = H("object" == typeof a ? a : {}, this.smarty);
        varFilters = h.prototype.filters_global.variable.concat(this.filters.variable);
        a = q(this.tree, this.data);
        h.prototype.debugging && B.debug.process([], this.data);
        return O(h.prototype.filters_global.post.concat(this.filters.post), a)
    }
    ;
    h.prototype.escape_html = !1;
    h.prototype.registerPlugin = function(a, c, b) {
        "modifier" == a ? J["__" + c] = b : B[c] = {
            type: a,
            process: b
        }
    }
    ;
    h.prototype.registerFilter = function(a, c) {
        (this.tree ? this.filters : h.prototype.filters_global)["output" == a ? "post" : a].push(c)
    }
    ;
    h.prototype.filters_global = {
        pre: [],
        variable: [],
        post: []
    };
    h.prototype.configLoad = function(a, c, b) {
        b = b ? b : this.data;
        a = a.replace(/\r\n/g, "\n").replace(/^\s+|\s+$/g, "");
        for (var d = /^\s*(?:\[([^\]]+)\]|(?:(\w+)[ \t]*=[ \t]*("""|'[^'\\\n]*(?:\\.[^'\\\n]*)*'|"[^"\\\n]*(?:\\.[^"\\\n]*)*"|[^\n]*)))/m, e = "", f = a.match(d); f; f = a.match(d)) {
            a = a.slice(f.index + f[0].length);
            if (f[1])
                e = f[1];
            else if ((!e || e == c) && "." != e.substr(0, 1))
                if ('"""' == f[3]) {
                    var g = a.match(/"""/);
                    g && (b.smarty.config[f[2]] = a.slice(0, g.index),
                    a = a.slice(g.index + g[0].length))
                } else
                    b.smarty.config[f[2]] = F(f[3]);
            if (f = a.match(/\n+/))
                a = a.slice(f.index + f[0].length);
            else
                break
        }
    }
    ;
    h.prototype.clearConfig = function(a) {
        a ? delete this.data.smarty.config[a] : this.data.smarty.config = {}
    }
    ;
    h.prototype.addDefaultModifier = function(a) {
        a instanceof Array || (a = [a]);
        for (var c = 0; c < a.length; ++c) {
            var b = {
                value: "",
                tree: [0]
            };
            v("|" + a[c], b);
            (this.tree ? this.default_modifiers : this.default_modifiers_global).push(b.tree[0])
        }
    }
    ;
    h.prototype.default_modifiers_global = [];
    h.prototype.getTemplate = function(a) {
        throw Error("No template for " + a);
    }
    ;
    h.prototype.getFile = function(a) {
        throw Error("No file for " + a);
    }
    ;
    h.prototype.getJavascript = function(a) {
        throw Error("No Javascript for " + a);
    }
    ;
    h.prototype.getConfig = function(a) {
        throw Error("No config for " + a);
    }
    ;
    h.prototype.auto_literal = !0;
    h.prototype.left_delimiter = "{";
    h.prototype.right_delimiter = "}";
    h.prototype.debugging = !1;
    h.prototype.registerPlugin("function", "__array", function(a, c) {
        var b = [], d;
        for (d in a)
            a.hasOwnProperty(d) && a[d] && "function" != typeof a[d] && (b[d] = a[d]);
        return b
    });
    h.prototype.registerPlugin("function", "__func", function(a, c) {
        for (var b = [], d = {}, e = 0; e < a.length; ++e)
            b.push(a.name + "__p" + e),
            d[a.name + "__p" + e] = a[e];
        return S(("__owner"in c && a.name in c.__owner ? "__owner." + a.name : a.name) + "(" + b.join(",") + ")", H({}, c, d))
    });
    h.prototype.registerPlugin("function", "__quoted", function(a, c) {
        return a.join("")
    });
    h.prototype.registerPlugin("function", "break", function(a, c) {
        c.smarty["break"] = !0;
        return ""
    });
    h.prototype.registerPlugin("function", "continue", function(a, c) {
        c.smarty["continue"] = !0;
        return ""
    });
    h.prototype.registerPlugin("function", "call", function(a, c) {
        var b = a.__get("name", null, 0);
        delete a.name;
        var d = a.__get("assign", !1);
        delete a.assign;
        b = B[b].process(a, c);
        return d ? (y(d, b, c),
        "") : b
    });
    h.prototype.registerPlugin("function", "append", function(a, c) {
        var b = a.__get("var", null, 0);
        b in c && c[b]instanceof Array || (c[b] = []);
        var d = a.__get("index", !1)
          , e = a.__get("value", null, 1);
        !1 === d ? c[b].push(e) : c[b][d] = e;
        return ""
    });
    h.prototype.registerPlugin("function", "assign", function(a, c) {
        y(a.__get("var", null, 0), a.__get("value", null, 1), c);
        return ""
    });
    h.prototype.registerPlugin("block", "capture", function(a, c, b, d) {
        c && (c = c.replace(/^\n/, ""),
        b.smarty.capture[a.__get("name", "default", 0)] = c,
        "assign"in a && y(a.assign, c, b),
        (a = a.__get("append", !1)) && (a in b ? b[a]instanceof Array && b[a].push(c) : b[a] = [c]));
        return ""
    });
    h.prototype.registerPlugin("function", "eval", function(a, c) {
        var b = [];
        r(a.__get("var", "", 0), b);
        b = q(b, c);
        return "assign"in a ? (y(a.assign, b, c),
        "") : b
    });
    h.prototype.registerPlugin("function", "include", function(a, c) {
        var b = a.__get("file", null, 0)
          , d = H({}, c, a);
        d.smarty.template = b;
        b = q(ba(b, [], 0 <= I(a, "nocache")), d);
        return "assign"in a ? (y(a.assign, b, c),
        "") : b
    });
    h.prototype.registerPlugin("block", "nocache", function(a, c, b, d) {
        return c
    });
    h.prototype.registerPlugin("block", "javascript", function(a, c, b, d) {
        b.$this = b;
        S(c, b);
        delete b.$this;
        return ""
    });
    h.prototype.registerPlugin("function", "config_load", function(a, c) {
        h.prototype.configLoad(h.prototype.getConfig(a.__get("file", null, 0)), a.__get("section", "", 1), c);
        return ""
    });
    h.prototype.registerPlugin("modifier", "defaultValue", function(a, c) {
        return a && "null" != a && "undefined" != a ? a : c ? c : ""
    });
    var n = {
        window: "object" == typeof window ? window : {
            document: {}
        }
    };
    (function(a, c) {
        "function" === typeof define && define.amd ? define([], c) : "object" === typeof module && module.exports ? module.exports = c() : a.jSmart = c()
    }
    )(this, function() {
        return h
    });
    h.prototype.registerPlugin("function", "counter", function(a, c) {
        var b = a.__get("name", "default");
        if (b in c.smarty.counter) {
            var d = c.smarty.counter[b];
            "start"in a ? d.value = parseInt(a.start) : (d.value = parseInt(d.value),
            d.skip = parseInt(d.skip),
            d.value = "down" == d.direction ? d.value - d.skip : d.value + d.skip);
            d.skip = a.__get("skip", d.skip);
            d.direction = a.__get("direction", d.direction);
            d.assign = a.__get("assign", d.assign)
        } else
            c.smarty.counter[b] = {
                value: parseInt(a.__get("start", 1)),
                skip: parseInt(a.__get("skip", 1)),
                direction: a.__get("direction", "up"),
                assign: a.__get("assign", !1)
            };
        return c.smarty.counter[b].assign ? (c[c.smarty.counter[b].assign] = c.smarty.counter[b].value,
        "") : a.__get("print", !0) ? c.smarty.counter[b].value : ""
    });
    h.prototype.registerPlugin("function", "cycle", function(a, c) {
        var b = a.__get("name", "default")
          , d = a.__get("reset", !1);
        b in c.smarty.cycle || (c.smarty.cycle[b] = {
            arr: [""],
            delimiter: a.__get("delimiter", ","),
            index: 0
        },
        d = !0);
        a.__get("delimiter", !1) && (c.smarty.cycle[b].delimiter = a.delimiter);
        var e = a.__get("values", !1);
        if (e) {
            var f = [];
            if (e instanceof Object)
                for (nm in e)
                    f.push(e[nm]);
            else
                f = e.split(c.smarty.cycle[b].delimiter);
            if (f.length != c.smarty.cycle[b].arr.length || f[0] != c.smarty.cycle[b].arr[0])
                c.smarty.cycle[b].arr = f,
                c.smarty.cycle[b].index = 0,
                d = !0
        }
        a.__get("advance", "true") && (c.smarty.cycle[b].index += 1);
        if (c.smarty.cycle[b].index >= c.smarty.cycle[b].arr.length || d)
            c.smarty.cycle[b].index = 0;
        return a.__get("assign", !1) ? (y(a.assign, c.smarty.cycle[b].arr[c.smarty.cycle[b].index], c),
        "") : a.__get("print", !0) ? c.smarty.cycle[b].arr[c.smarty.cycle[b].index] : ""
    });
    h.prototype.print_r = function(a, c) {
        if (a instanceof Object) {
            var b = (a instanceof Array ? "Array[" + a.length + "]" : "Object") + "<br>", d;
            for (d in a)
                a.hasOwnProperty(d) && (b += c + "&nbsp;&nbsp;<strong>" + d + "</strong> : " + h.prototype.print_r(a[d], c + "&nbsp;&nbsp;&nbsp;") + "<br>");
            return b
        }
        return a
    }
    ;
    h.prototype.registerPlugin("function", "debug", function(a, c) {
        "undefined" != typeof dbgWnd && dbgWnd.close();
        dbgWnd = window.open("", "", "width=680,height=600,resizable,scrollbars=yes");
        var b = "", d = 0, e;
        for (e in c)
            b += "<tr class=" + (++d % 2 ? "odd" : "even") + "><td><strong>" + e + "</strong></td><td>" + h.prototype.print_r(c[e], "") + "</td></tr>";
        dbgWnd.document.write("            <html xmlns='http://www.w3.org/1999/xhtml' xml:lang='en'>            <head> \t            <title>jSmart Debug Console</title>               <style type='text/css'>                  table {width: 100%;}                  td {vertical-align:top;width: 50%;}                  .even td {background-color: #fafafa;}               </style>            </head>            <body>               <h1>jSmart Debug Console</h1>               <h2>assigned template variables</h2>               <table>" + b + "</table>            </body>            </html>         ");
        return ""
    });
    h.prototype.registerPlugin("function", "fetch", function(a, c) {
        var b = h.prototype.getFile(a.__get("file", null, 0));
        return "assign"in a ? (y(a.assign, b, c),
        "") : b
    });
    h.prototype.registerPlugin("function", "insert", function(a, c) {
        var b = {}, d;
        for (d in a)
            a.hasOwnProperty(d) && isNaN(d) && a[d] && "string" == typeof a[d] && "name" != d && "assign" != d && "script" != d && (b[d] = a[d]);
        d = "insert_";
        "script"in a && (eval(h.prototype.getJavascript(a.script)),
        d = "smarty_insert_");
        b = eval(d + a.__get("name", null, 0))(b, c);
        return "assign"in a ? (y(a.assign, b, c),
        "") : b
    });
    h.prototype.registerPlugin("function", "html_checkboxes", function(a, c) {
        var b = a.__get("type", "checkbox")
          , d = a.__get("name", b);
        "checkbox" == b && (d += "[]");
        var e = a.__get("values", a.options), f = a.__get("options", []), g = "options"in a, m;
        if (!g)
            for (m in a.output)
                f.push(a.output[m]);
        var l = a.__get("selected", !1)
          , k = a.__get("separator", "")
          , h = Boolean(a.__get("labels", !0))
          , p = []
          , Y = 0
          , w = "";
        for (m in e)
            e.hasOwnProperty(m) && (w = h ? "<label>" : "",
            w += '<input type="' + b + '" name="' + d + '" value="' + (g ? m : e[m]) + '" ',
            l == (g ? m : e[m]) && (w += 'checked="checked" '),
            w += "/>" + f[g ? m : Y++],
            w += h ? "</label>" : "",
            w += k,
            p.push(w));
        return "assign"in a ? (y(a.assign, p, c),
        "") : p.join("\n")
    });
    h.prototype.registerPlugin("function", "html_image", function(a, c) {
        var b = a.__get("file", null), d = a.__get("width", !1), e = a.__get("height", !1), f = a.__get("alt", ""), g = a.__get("href", !1), m = {
            file: 1,
            width: 1,
            height: 1,
            alt: 1,
            href: 1,
            basedir: 1,
            path_prefix: 1
        }, b = '<img src="' + a.__get("path_prefix", "") + b + '" alt="' + f + '"' + (d ? ' width="' + d + '"' : "") + (e ? ' height="' + e + '"' : ""), l;
        for (l in a)
            a.hasOwnProperty(l) && "string" == typeof a[l] && (l in m || (b += " " + l + '="' + a[l] + '"'));
        b += " />";
        return g ? '<a href="' + g + '">' + b + "</a>" : b
    });
    h.prototype.registerPlugin("function", "html_options", function(a, c) {
        var b = a.__get("values", a.options), d = a.__get("options", []), e = "options"in a, f;
        if (!e)
            for (f in a.output)
                d.push(a.output[f]);
        var g = a.__get("selected", !1);
        !g || g instanceof Array || (g = [g]);
        var m = []
          , l = ""
          , k = 0;
        for (f in b)
            if (b.hasOwnProperty(f)) {
                l = '<option value="' + (e ? f : b[f]) + '"';
                if (g)
                    for (k = 0; k < g.length; ++k)
                        if (g[k] == (e ? f : b[f])) {
                            l += ' selected="selected"';
                            break
                        }
                l += ">" + d[e ? f : k++] + "</option>";
                m.push(l)
            }
        b = a.__get("name", !1);
        return (b ? '<select name="' + b + '">\n' + m.join("\n") + "\n</select>" : m.join("\n")) + "\n"
    });
    h.prototype.registerPlugin("function", "html_radios", function(a, c) {
        a.type = "radio";
        return B.html_checkboxes.process(a, c)
    });
    h.prototype.registerPlugin("function", "html_select_date", function(a, c) {
        var b = a.__get("prefix", "Date_"), d = "January February March April May June July August September October November December".split(" "), e;
        e = "" + ('<select name="' + b + 'Month">\n');
        for (var f = 0, f = 0; f < d.length; ++f)
            e += '<option value="' + f + '">' + d[f] + "</option>\n";
        e = e + "</select>\n" + ('<select name="' + b + 'Day">\n');
        for (f = 0; 31 > f; ++f)
            e += '<option value="' + f + '">' + f + "</option>\n";
        return e += "</select>\n"
    });
    h.prototype.registerPlugin("function", "html_table", function(a, c) {
        var b = [], d;
        if (a.loop instanceof Array)
            b = a.loop;
        else
            for (d in a.loop)
                a.loop.hasOwnProperty(d) && b.push(a.loop[d]);
        var e = a.__get("rows", !1)
          , f = a.__get("cols", !1);
        f || (f = e ? Math.ceil(b.length / e) : 3);
        var g = [];
        if (isNaN(f)) {
            if ("object" == typeof f)
                for (d in f)
                    f.hasOwnProperty(d) && g.push(f[d]);
            else
                g = f.split(/\s*,\s*/);
            f = g.length
        }
        var e = e ? e : Math.ceil(b.length / f)
          , m = a.__get("inner", "cols");
        d = a.__get("caption", "");
        var l = a.__get("table_attr", 'border="1"')
          , k = a.__get("th_attr", !1);
        k && "object" != typeof k && (k = [k]);
        var h = a.__get("tr_attr", !1);
        h && "object" != typeof h && (h = [h]);
        var p = a.__get("td_attr", !1);
        p && "object" != typeof p && (p = [p]);
        for (var Y = a.__get("trailpad", "&nbsp;"), w = a.__get("hdir", "right"), n = a.__get("vdir", "down"), q = "", r = 0; r < e; ++r) {
            for (var q = q + ("<tr" + (h ? " " + h[r % h.length] : "") + ">\n"), t = 0; t < f; ++t)
                var v = "cols" == m ? ("down" == n ? r : e - 1 - r) * f + ("right" == w ? t : f - 1 - t) : ("right" == w ? t : f - 1 - t) * e + ("down" == n ? r : e - 1 - r)
                  , q = q + ("<td" + (p ? " " + p[t % p.length] : "") + ">" + (v < b.length ? b[v] : Y) + "</td>\n");
            q += "</tr>\n"
        }
        b = "";
        if (g.length) {
            b = "\n<thead><tr>";
            for (e = 0; e < g.length; ++e)
                b += "\n<th" + (k ? " " + k[e % k.length] : "") + ">" + g["right" == w ? e : g.length - 1 - e] + "</th>";
            b += "\n</tr></thead>"
        }
        return "<table " + l + ">" + (d ? "\n<caption>" + d + "</caption>" : "") + b + "\n<tbody>\n" + q + "</tbody>\n</table>\n"
    });
    h.prototype.registerPlugin("function", "include_javascript", function(a, c) {
        var b = a.__get("file", null, 0);
        if (a.__get("once", !0) && b in X)
            return "";
        X[b] = !0;
        b = S(h.prototype.getJavascript(b), {
            $this: c
        });
        return "assign"in a ? (y(a.assign, b, c),
        "") : b
    });
    h.prototype.registerPlugin("function", "include_php", function(a, c) {
        return B.include_javascript.process(a, c)
    });
    n.rawurlencode = function(a) {
        a = (a + "").toString();
        return encodeURIComponent(a).replace(/!/g, "%21").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A")
    }
    ;
    n.bin2hex = function(a) {
        var c, b, d = "", e;
        a += "";
        c = 0;
        for (b = a.length; c < b; c++)
            e = a.charCodeAt(c).toString(16),
            d += 2 > e.length ? "0" + e : e;
        return d
    }
    ;
    n.ord = function(a) {
        var c = a + "";
        a = c.charCodeAt(0);
        if (55296 <= a && 56319 >= a) {
            if (1 === c.length)
                return a;
            c = c.charCodeAt(1);
            return 1024 * (a - 55296) + (c - 56320) + 65536
        }
        return a
    }
    ;
    h.prototype.registerPlugin("function", "mailto", function(a, c) {
        var b = a.__get("address", null)
          , d = a.__get("encode", "none")
          , e = a.__get("text", b)
          , f = n.rawurlencode(a.__get("cc", "")).replace("%40", "@")
          , g = n.rawurlencode(a.__get("bcc", "")).replace("%40", "@")
          , h = n.rawurlencode(a.__get("followupto", "")).replace("%40", "@")
          , l = n.rawurlencode(a.__get("subject", ""))
          , k = n.rawurlencode(a.__get("newsgroups", ""))
          , u = a.__get("extra", "")
          , b = b + (f ? "?cc=" + f : "") + (g ? (f ? "&" : "?") + "bcc=" + g : "")
          , b = b + (l ? (f || g ? "&" : "?") + "subject=" + l : "")
          , b = b + (k ? (f || g || l ? "&" : "?") + "newsgroups=" + k : "")
          , b = b + (h ? (f || g || l || k ? "&" : "?") + "followupto=" + h : "");
        s = '<a href="mailto:' + b + '" ' + u + ">" + e + "</a>";
        if ("javascript" == d) {
            s = "document.write('" + s + "');";
            e = "";
            for (d = 0; d < s.length; ++d)
                e += "%" + n.bin2hex(s.substr(d, 1));
            return '<script type="text/javascript">eval(unescape(\'' + e + "'))\x3c/script>"
        }
        if ("javascript_charcode" == d) {
            e = [];
            for (d = 0; d < s.length; ++d)
                e.push(n.ord(s.substr(d, 1)));
            return '<script type="text/javascript" language="javascript">\n\x3c!--\n{document.write(String.fromCharCode(' + e.join(",") + "))}\n//--\x3e\n\x3c/script>\n"
        }
        if ("hex" == d) {
            if (b.match(/^.+\?.+$/))
                throw Error("mailto: hex encoding does not work with extra attributes. Try javascript.");
            f = "";
            for (d = 0; d < b.length; ++d)
                f = b.substr(d, 1).match(/\w/) ? f + ("%" + n.bin2hex(b.substr(d, 1))) : f + b.substr(d, 1);
            b = "";
            for (d = 0; d < e.length; ++d)
                b += "&#x" + n.bin2hex(e.substr(d, 1)) + ";";
            return '<a href="&#109;&#97;&#105;&#108;&#116;&#111;&#58;' + f + '" ' + u + ">" + b + "</a>"
        }
        return s
    });
    n.sprintf = function() {
        var a = arguments
          , c = 0
          , b = function(a, b, c, d) {
            c || (c = " ");
            b = a.length >= b ? "" : Array(1 + b - a.length >>> 0).join(c);
            return d ? a + b : b + a
        }
          , d = function(a, c, d, e, k, h) {
            var p = e - a.length;
            0 < p && (a = d || !k ? b(a, e, h, d) : a.slice(0, c.length) + b("", p, "0", !0) + a.slice(c.length));
            return a
        }
          , e = function(a, c, e, l, k, h, p) {
            a >>>= 0;
            e = e && a && {
                2: "0b",
                8: "0",
                16: "0x"
            }[c] || "";
            a = e + b(a.toString(c), h || 0, "0", !1);
            return d(a, e, l, k, p)
        };
        return a[c++].replace(/%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g, function(f, g, h, l, k, u, p) {
            var n, w;
            if ("%%" === f)
                return "%";
            var q = !1;
            w = "";
            var r = k = !1;
            n = " ";
            for (var t = h.length, v = 0; h && v < t; v++)
                switch (h.charAt(v)) {
                case " ":
                    w = " ";
                    break;
                case "+":
                    w = "+";
                    break;
                case "-":
                    q = !0;
                    break;
                case "'":
                    n = h.charAt(v + 1);
                    break;
                case "0":
                    k = !0;
                    n = "0";
                    break;
                case "#":
                    r = !0
                }
            l = l ? "*" === l ? +a[c++] : "*" == l.charAt(0) ? +a[l.slice(1, -1)] : +l : 0;
            0 > l && (l = -l,
            q = !0);
            if (!isFinite(l))
                throw Error("sprintf: (minimum-)width must be finite");
            u = u ? "*" === u ? +a[c++] : "*" == u.charAt(0) ? +a[u.slice(1, -1)] : +u : -1 < "fFeE".indexOf(p) ? 6 : "d" === p ? 0 : void 0;
            g = g ? a[g.slice(0, -1)] : a[c++];
            switch (p) {
            case "s":
                return p = String(g),
                null != u && (p = p.slice(0, u)),
                d(p, "", q, l, k, n);
            case "c":
                return p = String.fromCharCode(+g),
                null != u && (p = p.slice(0, u)),
                d(p, "", q, l, k, void 0);
            case "b":
                return e(g, 2, r, q, l, u, k);
            case "o":
                return e(g, 8, r, q, l, u, k);
            case "x":
                return e(g, 16, r, q, l, u, k);
            case "X":
                return e(g, 16, r, q, l, u, k).toUpperCase();
            case "u":
                return e(g, 10, r, q, l, u, k);
            case "i":
            case "d":
                return n = +g || 0,
                n = Math.round(n - n % 1),
                f = 0 > n ? "-" : w,
                g = f + b(String(Math.abs(n)), u, "0", !1),
                d(g, f, q, l, k);
            case "e":
            case "E":
            case "f":
            case "F":
            case "g":
            case "G":
                return n = +g,
                f = 0 > n ? "-" : w,
                w = ["toExponential", "toFixed", "toPrecision"]["efg".indexOf(p.toLowerCase())],
                p = ["toString", "toUpperCase"]["eEfFgG".indexOf(p) % 2],
                g = f + Math.abs(n)[w](u),
                d(g, f, q, l, k)[p]();
            default:
                return f
            }
        })
    }
    ;
    h.prototype.registerPlugin("function", "math", function(a, c) {
        with (Math)
            with (a)
                var b = eval(a.__get("equation", null).replace(/pi\(\s*\)/g, "PI"));
        "format"in a && (b = n.sprintf(a.format, b));
        return "assign"in a ? (y(a.assign, b, c),
        "") : b
    });
    h.prototype.registerPlugin("modifier", "wordwrap", function(a, c, b, d) {
        c = c || 80;
        b = b || "\n";
        a = (new String(a)).split("\n");
        for (var e = 0; e < a.length; ++e) {
            for (var f = a[e], g = ""; f.length > c; ) {
                for (var h = 0, l = f.slice(h).match(/\s+/); l && h + l.index <= c; l = f.slice(h).match(/\s+/))
                    h += l.index + l[0].length;
                h = h || (d ? c : l ? l.index + l[0].length : f.length);
                g += f.slice(0, h).replace(/\s+$/, "");
                h < f.length && (g += b);
                f = f.slice(h)
            }
            a[e] = g + f
        }
        return a.join("\n")
    });
    h.prototype.registerPlugin("block", "textformat", function(a, c, b, d) {
        if (!c)
            return "";
        c = new String(c);
        d = a.__get("wrap", 80);
        var e = a.__get("wrap_char", "\n")
          , f = a.__get("wrap_cut", !1)
          , g = a.__get("indent_char", " ")
          , h = a.__get("indent", 0)
          , l = Array(h + 1).join(g)
          , k = a.__get("indent_first", 0)
          , g = Array(k + 1).join(g);
        "email" == a.__get("style", "") && (d = 72);
        c = c.split("\n");
        for (var u = 0; u < c.length; ++u) {
            var p = c[u];
            p && (p = p.replace(/^\s+|\s+$/, "").replace(/\s+/g, " "),
            k && (p = g + p),
            p = J.__wordwrap(p, d - h, e, f),
            h && (p = p.replace(/^/mg, l)),
            c[u] = p)
        }
        d = c.join(e + e);
        return "assign"in a ? (y(a.assign, d, b),
        "") : d
    });
    h.prototype.registerPlugin("modifier", "capitalize", function(a, c) {
        if ("string" != typeof a)
            return a;
        for (var b = RegExp(c ? "[\\W\\d]+" : "\\W+"), d = null, e = "", d = a.match(b); d; d = a.match(b)) {
            var f = a.slice(0, d.index)
              , e = f.match(/\d/) ? e + f : e + (f.charAt(0).toUpperCase() + f.slice(1))
              , e = e + a.slice(d.index, d.index + d[0].length);
            a = a.slice(d.index + d[0].length)
        }
        return a.match(/\d/) ? e + a : e + a.charAt(0).toUpperCase() + a.slice(1)
    });
    h.prototype.registerPlugin("modifier", "cat", function(a, c) {
        c = c ? c : "";
        return new String(a) + c
    });
    h.prototype.registerPlugin("modifier", "count", function(a, c) {
        if (null === a || "undefined" === typeof a)
            return 0;
        if (a.constructor !== Array && a.constructor !== Object)
            return 1;
        c = Boolean(c);
        var b, d = 0;
        for (b in a)
            a.hasOwnProperty(b) && (d++,
            c && a[b] && (a[b].constructor === Array || a[b].constructor === Object) && (d += J.__count(a[b], !0)));
        return d
    });
    h.prototype.registerPlugin("modifier", "count_characters", function(a, c) {
        a = new String(a);
        return c ? a.length : a.replace(/\s/g, "").length
    });
    h.prototype.registerPlugin("modifier", "count_paragraphs", function(a) {
        return (a = (new String(a)).match(/\n+/g)) ? a.length + 1 : 1
    });
    h.prototype.registerPlugin("modifier", "count_sentences", function(a) {
        return "string" == typeof a && (a = a.match(/[^\s]\.(?!\w)/g)) ? a.length : 0
    });
    h.prototype.registerPlugin("modifier", "count_words", function(a) {
        return "string" == typeof a && (a = a.match(/\w+/g)) ? a.length : 0
    });
    n.getenv = function(a) {
        return this.php_js && this.php_js.ENV && this.php_js.ENV[a] ? this.php_js.ENV[a] : !1
    }
    ;
    n.setlocale = function(a, c) {
        var b = ""
          , d = []
          , e = 0
          , e = this.window.document
          , f = function p(a) {
            if (a instanceof RegExp)
                return RegExp(a);
            if (a instanceof Date)
                return new Date(a);
            var b = {}, c;
            for (c in a)
                b[c] = "object" === typeof a[c] ? p(a[c]) : a[c];
            return b
        }
          , g = function(a) {
            return 1 !== a ? 1 : 0
        }
          , h = function(a) {
            return 1 < a ? 1 : 0
        };
        try {
            this.php_js = this.php_js || {}
        } catch (l) {
            this.php_js = {}
        }
        var k = this.php_js;
        k.locales || (k.locales = {},
        k.locales.en = {
            LC_COLLATE: function(a, b) {
                return a == b ? 0 : a > b ? 1 : -1
            },
            LC_CTYPE: {
                an: /^[A-Za-z\d]+$/g,
                al: /^[A-Za-z]+$/g,
                ct: /^[\u0000-\u001F\u007F]+$/g,
                dg: /^[\d]+$/g,
                gr: /^[\u0021-\u007E]+$/g,
                lw: /^[a-z]+$/g,
                pr: /^[\u0020-\u007E]+$/g,
                pu: /^[\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]+$/g,
                sp: /^[\f\n\r\t\v ]+$/g,
                up: /^[A-Z]+$/g,
                xd: /^[A-Fa-f\d]+$/g,
                CODESET: "UTF-8",
                lower: "abcdefghijklmnopqrstuvwxyz",
                upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            },
            LC_TIME: {
                a: "Sun Mon Tue Wed Thu Fri Sat".split(" "),
                A: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
                b: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
                B: "January February March April May June July August September October November December".split(" "),
                c: "%a %d %b %Y %r %Z",
                p: ["AM", "PM"],
                P: ["am", "pm"],
                r: "%I:%M:%S %p",
                x: "%m/%d/%Y",
                X: "%r",
                alt_digits: "",
                ERA: "",
                ERA_YEAR: "",
                ERA_D_T_FMT: "",
                ERA_D_FMT: "",
                ERA_T_FMT: ""
            },
            LC_MONETARY: {
                int_curr_symbol: "USD",
                currency_symbol: "$",
                mon_decimal_point: ".",
                mon_thousands_sep: ",",
                mon_grouping: [3],
                positive_sign: "",
                negative_sign: "-",
                int_frac_digits: 2,
                frac_digits: 2,
                p_cs_precedes: 1,
                p_sep_by_space: 0,
                n_cs_precedes: 1,
                n_sep_by_space: 0,
                p_sign_posn: 3,
                n_sign_posn: 0
            },
            LC_NUMERIC: {
                decimal_point: ".",
                thousands_sep: ",",
                grouping: [3]
            },
            LC_MESSAGES: {
                YESEXPR: "^[yY].*",
                NOEXPR: "^[nN].*",
                YESSTR: "",
                NOSTR: ""
            },
            nplurals: g
        },
        k.locales.en_US = f(k.locales.en),
        k.locales.en_US.LC_TIME.c = "%a %d %b %Y %r %Z",
        k.locales.en_US.LC_TIME.x = "%D",
        k.locales.en_US.LC_TIME.X = "%r",
        k.locales.en_US.LC_MONETARY.int_curr_symbol = "USD ",
        k.locales.en_US.LC_MONETARY.p_sign_posn = 1,
        k.locales.en_US.LC_MONETARY.n_sign_posn = 1,
        k.locales.en_US.LC_MONETARY.mon_grouping = [3, 3],
        k.locales.en_US.LC_NUMERIC.thousands_sep = "",
        k.locales.en_US.LC_NUMERIC.grouping = [],
        k.locales.en_GB = f(k.locales.en),
        k.locales.en_GB.LC_TIME.r = "%l:%M:%S %P %Z",
        k.locales.en_AU = f(k.locales.en_GB),
        k.locales.C = f(k.locales.en),
        k.locales.C.LC_CTYPE.CODESET = "ANSI_X3.4-1968",
        k.locales.C.LC_MONETARY = {
            int_curr_symbol: "",
            currency_symbol: "",
            mon_decimal_point: "",
            mon_thousands_sep: "",
            mon_grouping: [],
            p_cs_precedes: 127,
            p_sep_by_space: 127,
            n_cs_precedes: 127,
            n_sep_by_space: 127,
            p_sign_posn: 127,
            n_sign_posn: 127,
            positive_sign: "",
            negative_sign: "",
            int_frac_digits: 127,
            frac_digits: 127
        },
        k.locales.C.LC_NUMERIC = {
            decimal_point: ".",
            thousands_sep: "",
            grouping: []
        },
        k.locales.C.LC_TIME.c = "%a %b %e %H:%M:%S %Y",
        k.locales.C.LC_TIME.x = "%m/%d/%y",
        k.locales.C.LC_TIME.X = "%H:%M:%S",
        k.locales.C.LC_MESSAGES.YESEXPR = "^[yY]",
        k.locales.C.LC_MESSAGES.NOEXPR = "^[nN]",
        k.locales.fr = f(k.locales.en),
        k.locales.fr.nplurals = h,
        k.locales.fr.LC_TIME.a = "dim lun mar mer jeu ven sam".split(" "),
        k.locales.fr.LC_TIME.A = "dimanche lundi mardi mercredi jeudi vendredi samedi".split(" "),
        k.locales.fr.LC_TIME.b = "jan f\u00e9v mar avr mai jun jui ao\u00fb sep oct nov d\u00e9c".split(" "),
        k.locales.fr.LC_TIME.B = "janvier f\u00e9vrier mars avril mai juin juillet ao\u00fbt septembre octobre novembre d\u00e9cembre".split(" "),
        k.locales.fr.LC_TIME.c = "%a %d %b %Y %T %Z",
        k.locales.fr.LC_TIME.p = ["", ""],
        k.locales.fr.LC_TIME.P = ["", ""],
        k.locales.fr.LC_TIME.x = "%d.%m.%Y",
        k.locales.fr.LC_TIME.X = "%T",
        k.locales.fr_CA = f(k.locales.fr),
        k.locales.fr_CA.LC_TIME.x = "%Y-%m-%d");
        k.locale || (k.locale = "en_US",
        e.getElementsByTagNameNS && e.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "html")[0] ? e.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "html")[0].getAttributeNS && e.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "html")[0].getAttributeNS("http://www.w3.org/XML/1998/namespace", "lang") ? k.locale = e.getElementsByTagName("http://www.w3.org/1999/xhtml", "html")[0].getAttributeNS("http://www.w3.org/XML/1998/namespace", "lang") : e.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "html")[0].lang && (k.locale = e.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "html")[0].lang) : e.getElementsByTagName("html")[0] && e.getElementsByTagName("html")[0].lang && (k.locale = e.getElementsByTagName("html")[0].lang));
        k.locale = k.locale.replace("-", "_");
        !(k.locale in k.locales) && k.locale.replace(/_[a-zA-Z]+$/, "")in k.locales && (k.locale = k.locale.replace(/_[a-zA-Z]+$/, ""));
        k.localeCategories || (k.localeCategories = {
            LC_COLLATE: k.locale,
            LC_CTYPE: k.locale,
            LC_MONETARY: k.locale,
            LC_NUMERIC: k.locale,
            LC_TIME: k.locale,
            LC_MESSAGES: k.locale
        });
        if (null === c || "" === c)
            c = this.getenv(a) || this.getenv("LANG");
        else if ("[object Array]" === Object.prototype.toString.call(c))
            for (e = 0; e < c.length; e++)
                if (c[e]in this.php_js.locales) {
                    c = c[e];
                    break
                } else if (e === c.length - 1)
                    return !1;
        if ("0" === c || 0 === c) {
            if ("LC_ALL" === a) {
                for (b in this.php_js.localeCategories)
                    d.push(b + "=" + this.php_js.localeCategories[b]);
                return d.join(";")
            }
            return this.php_js.localeCategories[a]
        }
        if (!(c in this.php_js.locales))
            return !1;
        if ("LC_ALL" === a)
            for (b in this.php_js.localeCategories)
                this.php_js.localeCategories[b] = c;
        else
            this.php_js.localeCategories[a] = c;
        return c
    }
    ;
    n.strftime = function(a, c) {
        this.php_js = this.php_js || {};
        this.setlocale("LC_ALL", 0);
        for (var b = this.php_js, d = function(a, b, c) {
            for ("undefined" === typeof c && (c = 10); parseInt(a, 10) < c && 1 < c; c /= 10)
                a = b.toString() + a;
            return a.toString()
        }, e = b.locales[b.localeCategories.LC_TIME].LC_TIME, f = {
            a: function(a) {
                return e.a[a.getDay()]
            },
            A: function(a) {
                return e.A[a.getDay()]
            },
            b: function(a) {
                return e.b[a.getMonth()]
            },
            B: function(a) {
                return e.B[a.getMonth()]
            },
            C: function(a) {
                return d(parseInt(a.getFullYear() / 100, 10), 0)
            },
            d: ["getDate", "0"],
            e: ["getDate", " "],
            g: function(a) {
                return d(parseInt(this.G(a) / 100, 10), 0)
            },
            G: function(a) {
                var b = a.getFullYear()
                  , c = parseInt(f.V(a), 10);
                a = parseInt(f.W(a), 10);
                a > c ? b++ : 0 === a && 52 <= c && b--;
                return b
            },
            H: ["getHours", "0"],
            I: function(a) {
                a = a.getHours() % 12;
                return d(0 === a ? 12 : a, 0)
            },
            j: function(a) {
                var b = a - new Date("" + a.getFullYear() + "/1/1 GMT")
                  , b = b + 6E4 * a.getTimezoneOffset();
                a = parseInt(b / 6E4 / 60 / 24, 10) + 1;
                return d(a, 0, 100)
            },
            k: ["getHours", "0"],
            l: function(a) {
                a = a.getHours() % 12;
                return d(0 === a ? 12 : a, " ")
            },
            m: function(a) {
                return d(a.getMonth() + 1, 0)
            },
            M: ["getMinutes", "0"],
            p: function(a) {
                return e.p[12 <= a.getHours() ? 1 : 0]
            },
            P: function(a) {
                return e.P[12 <= a.getHours() ? 1 : 0]
            },
            s: function(a) {
                return Date.parse(a) / 1E3
            },
            S: ["getSeconds", "0"],
            u: function(a) {
                a = a.getDay();
                return 0 === a ? 7 : a
            },
            U: function(a) {
                var b = parseInt(f.j(a), 10);
                a = 6 - a.getDay();
                b = parseInt((b + a) / 7, 10);
                return d(b, 0)
            },
            V: function(a) {
                var b = parseInt(f.W(a), 10)
                  , c = (new Date("" + a.getFullYear() + "/1/1")).getDay()
                  , b = b + (4 < c || 1 >= c ? 0 : 1);
                53 === b && 4 > (new Date("" + a.getFullYear() + "/12/31")).getDay() ? b = 1 : 0 === b && (b = f.V(new Date("" + (a.getFullYear() - 1) + "/12/31")));
                return d(b, 0)
            },
            w: "getDay",
            W: function(a) {
                var b = parseInt(f.j(a), 10);
                a = 7 - f.u(a);
                b = parseInt((b + a) / 7, 10);
                return d(b, 0, 10)
            },
            y: function(a) {
                return d(a.getFullYear() % 100, 0)
            },
            Y: "getFullYear",
            z: function(a) {
                a = a.getTimezoneOffset();
                var b = d(parseInt(Math.abs(a / 60), 10), 0)
                  , c = d(a % 60, 0);
                return (0 < a ? "-" : "+") + b + c
            },
            Z: function(a) {
                return a.toString().replace(/^.*\(([^)]+)\)$/, "$1")
            },
            "%": function(a) {
                return "%"
            }
        }, g = "undefined" === typeof c ? new Date : "object" === typeof c ? new Date(c) : new Date(1E3 * c), h = {
            c: "locale",
            D: "%m/%d/%y",
            F: "%y-%m-%d",
            h: "%b",
            n: "\n",
            r: "locale",
            R: "%H:%M",
            t: "\t",
            T: "%H:%M:%S",
            x: "locale",
            X: "locale"
        }; a.match(/%[cDFhnrRtTxX]/); )
            a = a.replace(/%([cDFhnrRtTxX])/g, function(a, b) {
                var c = h[b];
                return "locale" === c ? e[b] : c
            });
        return a.replace(/%([aAbBCdegGHIjklmMpPsSuUVwWyYzZ%])/g, function(a, b) {
            var c = f[b];
            return "string" === typeof c ? g[c]() : "function" === typeof c ? c(g) : "object" === typeof c && "string" === typeof c[0] ? d(g[c[0]](), c[1]) : b
        })
    }
    ;
    n.strtotime = function(a, c) {
        function b(a) {
            var b = a.split(" ");
            a = b[0];
            var c = b[1].substring(0, 3)
              , d = /\d+/.test(a)
              , e = ("last" === a ? -1 : 1) * ("ago" === b[2] ? -1 : 1);
            d && (e *= parseInt(a, 10));
            if (h.hasOwnProperty(c) && !b[1].match(/^mon(day|\.)?$/i))
                return f["set" + h[c]](f["get" + h[c]]() + e);
            if ("wee" === c)
                return f.setDate(f.getDate() + 7 * e);
            if ("next" === a || "last" === a)
                b = e,
                c = g[c],
                "undefined" !== typeof c && (c -= f.getDay(),
                0 === c ? c = 7 * b : 0 < c && "last" === a ? c -= 7 : 0 > c && "next" === a && (c += 7),
                f.setDate(f.getDate() + c));
            else if (!d)
                return !1;
            return !0
        }
        var d, e, f, g, h, l;
        if (!a)
            return !1;
        a = a.replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " ").replace(/[\t\r\n]/g, "").toLowerCase();
        if ((d = a.match(/^(\d{1,4})([\-\.\/\:])(\d{1,2})([\-\.\/\:])(\d{1,4})(?:\s(\d{1,2}):(\d{2})?:?(\d{2})?)?(?:\s([A-Z]+)?)?$/)) && d[2] === d[4])
            if (1901 < d[1])
                switch (d[2]) {
                case "-":
                    return 12 < d[3] || 31 < d[5] ? !1 : new Date(d[1],parseInt(d[3], 10) - 1,d[5],d[6] || 0,d[7] || 0,d[8] || 0,d[9] || 0) / 1E3;
                case ".":
                    return !1;
                case "/":
                    return 12 < d[3] || 31 < d[5] ? !1 : new Date(d[1],parseInt(d[3], 10) - 1,d[5],d[6] || 0,d[7] || 0,d[8] || 0,d[9] || 0) / 1E3
                }
            else if (1901 < d[5])
                switch (d[2]) {
                case "-":
                    return 12 < d[3] || 31 < d[1] ? !1 : new Date(d[5],parseInt(d[3], 10) - 1,d[1],d[6] || 0,d[7] || 0,d[8] || 0,d[9] || 0) / 1E3;
                case ".":
                    return 12 < d[3] || 31 < d[1] ? !1 : new Date(d[5],parseInt(d[3], 10) - 1,d[1],d[6] || 0,d[7] || 0,d[8] || 0,d[9] || 0) / 1E3;
                case "/":
                    return 12 < d[1] || 31 < d[3] ? !1 : new Date(d[5],parseInt(d[1], 10) - 1,d[3],d[6] || 0,d[7] || 0,d[8] || 0,d[9] || 0) / 1E3
                }
            else
                switch (d[2]) {
                case "-":
                    if (12 < d[3] || 31 < d[5] || 70 > d[1] && 38 < d[1])
                        return !1;
                    e = 0 <= d[1] && 38 >= d[1] ? +d[1] + 2E3 : d[1];
                    return new Date(e,parseInt(d[3], 10) - 1,d[5],d[6] || 0,d[7] || 0,d[8] || 0,d[9] || 0) / 1E3;
                case ".":
                    if (70 <= d[5])
                        return 12 < d[3] || 31 < d[1] ? !1 : new Date(d[5],parseInt(d[3], 10) - 1,d[1],d[6] || 0,d[7] || 0,d[8] || 0,d[9] || 0) / 1E3;
                    if (60 > d[5] && !d[6]) {
                        if (23 < d[1] || 59 < d[3])
                            return !1;
                        e = new Date;
                        return new Date(e.getFullYear(),e.getMonth(),e.getDate(),d[1] || 0,d[3] || 0,d[5] || 0,d[9] || 0) / 1E3
                    }
                    return !1;
                case "/":
                    if (12 < d[1] || 31 < d[3] || 70 > d[5] && 38 < d[5])
                        return !1;
                    e = 0 <= d[5] && 38 >= d[5] ? +d[5] + 2E3 : d[5];
                    return new Date(e,parseInt(d[1], 10) - 1,d[3],d[6] || 0,d[7] || 0,d[8] || 0,d[9] || 0) / 1E3;
                case ":":
                    if (23 < d[1] || 59 < d[3] || 59 < d[5])
                        return !1;
                    e = new Date;
                    return new Date(e.getFullYear(),e.getMonth(),e.getDate(),d[1] || 0,d[3] || 0,d[5] || 0) / 1E3
                }
        if ("now" === a)
            return null === c || isNaN(c) ? (new Date).getTime() / 1E3 | 0 : c | 0;
        if (!isNaN(d = Date.parse(a)))
            return d / 1E3 | 0;
        f = c ? new Date(1E3 * c) : new Date;
        g = {
            sun: 0,
            mon: 1,
            tue: 2,
            wed: 3,
            thu: 4,
            fri: 5,
            sat: 6
        };
        h = {
            yea: "FullYear",
            mon: "Month",
            day: "Date",
            hou: "Hours",
            min: "Minutes",
            sec: "Seconds"
        };
        d = a.match(RegExp("([+-]?\\d+\\s(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)|(last|next)\\s(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?))(\\sago)?", "gi"));
        if (!d)
            return !1;
        l = 0;
        for (e = d.length; l < e; l++)
            if (!b(d[l]))
                return !1;
        return f.getTime() / 1E3
    }
    ;
    makeTimeStamp = function(a) {
        if (!a)
            return Math.floor((new Date).getTime() / 1E3);
        if (isNaN(a))
            return a = n.strtotime(a),
            -1 == a || !1 === a ? Math.floor((new Date).getTime() / 1E3) : a;
        a = new String(a);
        return 14 == a.length ? Math.floor((new Date(a.substr(0, 4),a.substr(4, 2) - 1,a.substr(6, 2),a.substr(8, 2),a.substr(10, 2))).getTime() / 1E3) : parseInt(a)
    }
    ;
    h.prototype.registerPlugin("modifier", "date_format", function(a, c, b) {
        return a ? n.strftime(c ? c : "%b %e, %Y", makeTimeStamp(a ? a : b)) : ""
    });
    n.get_html_translation_table = function(a, c) {
        var b = {}, d = {}, e, f = {}, g = {}, h = {}, l = {};
        f[0] = "HTML_SPECIALCHARS";
        f[1] = "HTML_ENTITIES";
        g[0] = "ENT_NOQUOTES";
        g[2] = "ENT_COMPAT";
        g[3] = "ENT_QUOTES";
        h = isNaN(a) ? a ? a.toUpperCase() : "HTML_SPECIALCHARS" : f[a];
        l = isNaN(c) ? c ? c.toUpperCase() : "ENT_COMPAT" : g[c];
        if ("HTML_SPECIALCHARS" !== h && "HTML_ENTITIES" !== h)
            throw Error("Table: " + h + " not supported");
        b["38"] = "&amp;";
        "HTML_ENTITIES" === h && (b["160"] = "&nbsp;",
        b["161"] = "&iexcl;",
        b["162"] = "&cent;",
        b["163"] = "&pound;",
        b["164"] = "&curren;",
        b["165"] = "&yen;",
        b["166"] = "&brvbar;",
        b["167"] = "&sect;",
        b["168"] = "&uml;",
        b["169"] = "&copy;",
        b["170"] = "&ordf;",
        b["171"] = "&laquo;",
        b["172"] = "&not;",
        b["173"] = "&shy;",
        b["174"] = "&reg;",
        b["175"] = "&macr;",
        b["176"] = "&deg;",
        b["177"] = "&plusmn;",
        b["178"] = "&sup2;",
        b["179"] = "&sup3;",
        b["180"] = "&acute;",
        b["181"] = "&micro;",
        b["182"] = "&para;",
        b["183"] = "&middot;",
        b["184"] = "&cedil;",
        b["185"] = "&sup1;",
        b["186"] = "&ordm;",
        b["187"] = "&raquo;",
        b["188"] = "&frac14;",
        b["189"] = "&frac12;",
        b["190"] = "&frac34;",
        b["191"] = "&iquest;",
        b["192"] = "&Agrave;",
        b["193"] = "&Aacute;",
        b["194"] = "&Acirc;",
        b["195"] = "&Atilde;",
        b["196"] = "&Auml;",
        b["197"] = "&Aring;",
        b["198"] = "&AElig;",
        b["199"] = "&Ccedil;",
        b["200"] = "&Egrave;",
        b["201"] = "&Eacute;",
        b["202"] = "&Ecirc;",
        b["203"] = "&Euml;",
        b["204"] = "&Igrave;",
        b["205"] = "&Iacute;",
        b["206"] = "&Icirc;",
        b["207"] = "&Iuml;",
        b["208"] = "&ETH;",
        b["209"] = "&Ntilde;",
        b["210"] = "&Ograve;",
        b["211"] = "&Oacute;",
        b["212"] = "&Ocirc;",
        b["213"] = "&Otilde;",
        b["214"] = "&Ouml;",
        b["215"] = "&times;",
        b["216"] = "&Oslash;",
        b["217"] = "&Ugrave;",
        b["218"] = "&Uacute;",
        b["219"] = "&Ucirc;",
        b["220"] = "&Uuml;",
        b["221"] = "&Yacute;",
        b["222"] = "&THORN;",
        b["223"] = "&szlig;",
        b["224"] = "&agrave;",
        b["225"] = "&aacute;",
        b["226"] = "&acirc;",
        b["227"] = "&atilde;",
        b["228"] = "&auml;",
        b["229"] = "&aring;",
        b["230"] = "&aelig;",
        b["231"] = "&ccedil;",
        b["232"] = "&egrave;",
        b["233"] = "&eacute;",
        b["234"] = "&ecirc;",
        b["235"] = "&euml;",
        b["236"] = "&igrave;",
        b["237"] = "&iacute;",
        b["238"] = "&icirc;",
        b["239"] = "&iuml;",
        b["240"] = "&eth;",
        b["241"] = "&ntilde;",
        b["242"] = "&ograve;",
        b["243"] = "&oacute;",
        b["244"] = "&ocirc;",
        b["245"] = "&otilde;",
        b["246"] = "&ouml;",
        b["247"] = "&divide;",
        b["248"] = "&oslash;",
        b["249"] = "&ugrave;",
        b["250"] = "&uacute;",
        b["251"] = "&ucirc;",
        b["252"] = "&uuml;",
        b["253"] = "&yacute;",
        b["254"] = "&thorn;",
        b["255"] = "&yuml;");
        "ENT_NOQUOTES" !== l && (b["34"] = "&quot;");
        "ENT_QUOTES" === l && (b["39"] = "&#39;");
        b["60"] = "&lt;";
        b["62"] = "&gt;";
        for (e in b)
            b.hasOwnProperty(e) && (d[String.fromCharCode(e)] = b[e]);
        return d
    }
    ;
    n.htmlentities = function(a, c, b, d) {
        var e = this.get_html_translation_table("HTML_ENTITIES", c);
        a = null == a ? "" : a + "";
        if (!e)
            return !1;
        c && "ENT_QUOTES" === c && (e["'"] = "&#039;");
        d = null == d || !!d;
        c = RegExp("&(?:#\\d+|#x[\\da-f]+|[a-zA-Z][\\da-z]*);|[" + Object.keys(e).join("").replace(/([()[\]{}\-.*+?^$|\/\\])/g, "\\$1") + "]", "g");
        return a.replace(c, function(a) {
            return 1 < a.length ? d ? e["&"] + a.substr(1) : a : e[a]
        })
    }
    ;
    h.prototype.registerPlugin("modifier", "escape", function(a, c, b, d) {
        a = new String(a);
        b = b || "UTF-8";
        d = "undefined" != typeof d ? Boolean(d) : !0;
        switch (c || "html") {
        case "html":
            return d && (a = a.replace(/&/g, "&amp;")),
            a.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#039;").replace(/"/g, "&quot;");
        case "htmlall":
            return n.htmlentities(a, 3, b);
        case "url":
            return n.rawurlencode(a);
        case "urlpathinfo":
            return n.rawurlencode(a).replace(/%2F/g, "/");
        case "quotes":
            return a.replace(/(^|[^\\])'/g, "$1\\'");
        case "hex":
            c = "";
            for (b = 0; b < a.length; ++b)
                c += "%" + n.bin2hex(a.substr(b, 1));
            return c;
        case "hexentity":
            c = "";
            for (b = 0; b < a.length; ++b)
                c += "&#x" + n.bin2hex(a.substr(b, 1)).toUpperCase() + ";";
            return c;
        case "decentity":
            c = "";
            for (b = 0; b < a.length; ++b)
                c += "&#" + n.ord(a.substr(b, 1)) + ";";
            return c;
        case "mail":
            return a.replace(/@/g, " [AT] ").replace(/[.]/g, " [DOT] ");
        case "nonstd":
            c = "";
            for (b = 0; b < a.length; ++b)
                d = n.ord(a.substr(b, 1)),
                c = 126 <= d ? c + ("&#" + d + ";") : c + a.substr(b, 1);
            return c;
        case "javascript":
            return a.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/<\//g, "</")
        }
        return a
    });
    h.prototype.registerPlugin("modifier", "indent", function(a, c, b) {
        a = new String(a);
        c = c ? c : 4;
        b = b ? b : " ";
        for (var d = ""; c--; )
            d += b;
        c = a.match(/\n+$/);
        return d + a.replace(/\n+$/, "").replace(/\n/g, "\n" + d) + (c ? c[0] : "")
    });
    h.prototype.registerPlugin("modifier", "lower", function(a) {
        return (new String(a)).toLowerCase()
    });
    h.prototype.registerPlugin("modifier", "nl2br", function(a) {
        return (new String(a)).replace(/\n/g, "<br />\n")
    });
    h.prototype.registerPlugin("modifier", "regex_replace", function(a, c, b) {
        c = c.match(/^ *\/(.*)\/(.*) *$/);
        return (new String(a)).replace(RegExp(c[1], "g" + (1 < c.length ? c[2] : "")), b)
    });
    h.prototype.registerPlugin("modifier", "replace", function(a, c, b) {
        if (!c)
            return a;
        a = new String(a);
        c = new String(c);
        b = new String(b);
        for (var d = "", e = -1, e = a.indexOf(c); 0 <= e; e = a.indexOf(c))
            d += a.slice(0, e) + b,
            e += c.length,
            a = a.slice(e);
        return d + a
    });
    h.prototype.registerPlugin("modifier", "spacify", function(a, c) {
        c || (c = " ");
        return (new String(a)).replace(/(\n|.)(?!$)/g, "$1" + c)
    });
    h.prototype.registerPlugin("modifier", "string_format", function(a, c) {
        return n.sprintf(c, a)
    });
    h.prototype.registerPlugin("modifier", "strip", function(a, c) {
        c = c ? c : " ";
        return (new String(a)).replace(/[\s]+/g, c)
    });
    h.prototype.registerPlugin("modifier", "strip_tags", function(a, c) {
        c = null == c ? !0 : c;
        return (new String(a)).replace(/<[^>]*?>/g, c ? " " : "")
    });
    h.prototype.registerPlugin("modifier", "truncate", function(a, c, b, d, e) {
        a = new String(a);
        c = c ? c : 80;
        b = null != b ? b : "...";
        if (a.length <= c)
            return a;
        c -= Math.min(c, b.length);
        if (e)
            return a.slice(0, Math.floor(c / 2)) + b + a.slice(a.length - Math.floor(c / 2));
        d || (a = a.slice(0, c + 1).replace(/\s+?(\S+)?$/, ""));
        return a.slice(0, c) + b
    });
    h.prototype.registerPlugin("modifier", "upper", function(a) {
        return (new String(a)).toUpperCase()
    })
}
)();
jSmart.prototype.registerPlugin('modifier', 'abs', function(nums) {

    return Math.abs(nums);
});

jSmart.prototype.registerPlugin('modifier', 'stop_words_handler', function(str) {

    return str;
});
jSmart.prototype.registerPlugin('modifier', 'money', function(value, sign) {
    switch (sign) {
    case '$':
        return sign + ' ' + value;
    case '₴':
        return value + ' ' + sign;
    default:
        return sign + ' ' + value;
    }
});
jSmart.prototype.registerPlugin('modifier', 'in_array', function(value, array) {
    return array.indexOf(value) > -1 ? true : false;
});
jSmart.prototype.registerPlugin('modifier', 'strstr', function(full_str, find_str) {
    var pos = 0;

    full_str += '';
    pos = full_str.toLowerCase().indexOf((find_str + '').toLowerCase());

    if (pos == -1) {
        return false;
    } else {
        /*if (bool) {
                return haystack.substr(0, pos);
            } else {*/
        return full_str.slice(pos);
        /*}*/
    }
});

jSmart.prototype.registerPlugin('modifier', 'ucfirst', function(str) {
    var f = str.charAt(0).toUpperCase();
    return f + str.substr(1, str.length - 1);
});
