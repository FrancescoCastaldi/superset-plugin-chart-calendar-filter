"use strict";
var CalendarFilter = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require2() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from2, except, desc) => {
    if (from2 && typeof from2 === "object" || typeof from2 === "function") {
      for (let key of __getOwnPropNames(from2))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from2[key], enumerable: !(desc = __getOwnPropDesc(from2, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/@babel/runtime/helpers/esm/extends.js
  function _extends() {
    return _extends = Object.assign ? Object.assign.bind() : function(n) {
      for (var e = 1; e < arguments.length; e++) {
        var t = arguments[e];
        for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
      }
      return n;
    }, _extends.apply(null, arguments);
  }
  var init_extends = __esm({
    "node_modules/@babel/runtime/helpers/esm/extends.js"() {
    }
  });

  // node_modules/@emotion/sheet/dist/emotion-sheet.esm.js
  function sheetForTag(tag) {
    if (tag.sheet) {
      return tag.sheet;
    }
    for (var i = 0; i < document.styleSheets.length; i++) {
      if (document.styleSheets[i].ownerNode === tag) {
        return document.styleSheets[i];
      }
    }
    return void 0;
  }
  function createStyleElement(options) {
    var tag = document.createElement("style");
    tag.setAttribute("data-emotion", options.key);
    if (options.nonce !== void 0) {
      tag.setAttribute("nonce", options.nonce);
    }
    tag.appendChild(document.createTextNode(""));
    tag.setAttribute("data-s", "");
    return tag;
  }
  var isDevelopment, StyleSheet;
  var init_emotion_sheet_esm = __esm({
    "node_modules/@emotion/sheet/dist/emotion-sheet.esm.js"() {
      isDevelopment = false;
      StyleSheet = /* @__PURE__ */ (function() {
        function StyleSheet2(options) {
          var _this = this;
          this._insertTag = function(tag) {
            var before;
            if (_this.tags.length === 0) {
              if (_this.insertionPoint) {
                before = _this.insertionPoint.nextSibling;
              } else if (_this.prepend) {
                before = _this.container.firstChild;
              } else {
                before = _this.before;
              }
            } else {
              before = _this.tags[_this.tags.length - 1].nextSibling;
            }
            _this.container.insertBefore(tag, before);
            _this.tags.push(tag);
          };
          this.isSpeedy = options.speedy === void 0 ? !isDevelopment : options.speedy;
          this.tags = [];
          this.ctr = 0;
          this.nonce = options.nonce;
          this.key = options.key;
          this.container = options.container;
          this.prepend = options.prepend;
          this.insertionPoint = options.insertionPoint;
          this.before = null;
        }
        var _proto = StyleSheet2.prototype;
        _proto.hydrate = function hydrate(nodes) {
          nodes.forEach(this._insertTag);
        };
        _proto.insert = function insert(rule) {
          if (this.ctr % (this.isSpeedy ? 65e3 : 1) === 0) {
            this._insertTag(createStyleElement(this));
          }
          var tag = this.tags[this.tags.length - 1];
          if (this.isSpeedy) {
            var sheet = sheetForTag(tag);
            try {
              sheet.insertRule(rule, sheet.cssRules.length);
            } catch (e) {
            }
          } else {
            tag.appendChild(document.createTextNode(rule));
          }
          this.ctr++;
        };
        _proto.flush = function flush() {
          this.tags.forEach(function(tag) {
            var _tag$parentNode;
            return (_tag$parentNode = tag.parentNode) == null ? void 0 : _tag$parentNode.removeChild(tag);
          });
          this.tags = [];
          this.ctr = 0;
        };
        return StyleSheet2;
      })();
    }
  });

  // node_modules/stylis/src/Enum.js
  var MS, MOZ, WEBKIT, COMMENT, RULESET, DECLARATION, IMPORT, KEYFRAMES, LAYER;
  var init_Enum = __esm({
    "node_modules/stylis/src/Enum.js"() {
      MS = "-ms-";
      MOZ = "-moz-";
      WEBKIT = "-webkit-";
      COMMENT = "comm";
      RULESET = "rule";
      DECLARATION = "decl";
      IMPORT = "@import";
      KEYFRAMES = "@keyframes";
      LAYER = "@layer";
    }
  });

  // node_modules/stylis/src/Utility.js
  function hash(value, length2) {
    return charat(value, 0) ^ 45 ? (((length2 << 2 ^ charat(value, 0)) << 2 ^ charat(value, 1)) << 2 ^ charat(value, 2)) << 2 ^ charat(value, 3) : 0;
  }
  function trim(value) {
    return value.trim();
  }
  function match(value, pattern) {
    return (value = pattern.exec(value)) ? value[0] : value;
  }
  function replace(value, pattern, replacement) {
    return value.replace(pattern, replacement);
  }
  function indexof(value, search) {
    return value.indexOf(search);
  }
  function charat(value, index) {
    return value.charCodeAt(index) | 0;
  }
  function substr(value, begin, end) {
    return value.slice(begin, end);
  }
  function strlen(value) {
    return value.length;
  }
  function sizeof(value) {
    return value.length;
  }
  function append(value, array) {
    return array.push(value), value;
  }
  function combine(array, callback) {
    return array.map(callback).join("");
  }
  var abs, from, assign;
  var init_Utility = __esm({
    "node_modules/stylis/src/Utility.js"() {
      abs = Math.abs;
      from = String.fromCharCode;
      assign = Object.assign;
    }
  });

  // node_modules/stylis/src/Tokenizer.js
  function node(value, root, parent, type, props, children, length2) {
    return { value, root, parent, type, props, children, line, column, length: length2, return: "" };
  }
  function copy(root, props) {
    return assign(node("", null, null, "", null, null, 0), root, { length: -root.length }, props);
  }
  function char() {
    return character;
  }
  function prev() {
    character = position > 0 ? charat(characters, --position) : 0;
    if (column--, character === 10)
      column = 1, line--;
    return character;
  }
  function next() {
    character = position < length ? charat(characters, position++) : 0;
    if (column++, character === 10)
      column = 1, line++;
    return character;
  }
  function peek() {
    return charat(characters, position);
  }
  function caret() {
    return position;
  }
  function slice(begin, end) {
    return substr(characters, begin, end);
  }
  function token(type) {
    switch (type) {
      // \0 \t \n \r \s whitespace token
      case 0:
      case 9:
      case 10:
      case 13:
      case 32:
        return 5;
      // ! + , / > @ ~ isolate token
      case 33:
      case 43:
      case 44:
      case 47:
      case 62:
      case 64:
      case 126:
      // ; { } breakpoint token
      case 59:
      case 123:
      case 125:
        return 4;
      // : accompanied token
      case 58:
        return 3;
      // " ' ( [ opening delimit token
      case 34:
      case 39:
      case 40:
      case 91:
        return 2;
      // ) ] closing delimit token
      case 41:
      case 93:
        return 1;
    }
    return 0;
  }
  function alloc(value) {
    return line = column = 1, length = strlen(characters = value), position = 0, [];
  }
  function dealloc(value) {
    return characters = "", value;
  }
  function delimit(type) {
    return trim(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)));
  }
  function whitespace(type) {
    while (character = peek())
      if (character < 33)
        next();
      else
        break;
    return token(type) > 2 || token(character) > 3 ? "" : " ";
  }
  function escaping(index, count) {
    while (--count && next())
      if (character < 48 || character > 102 || character > 57 && character < 65 || character > 70 && character < 97)
        break;
    return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32));
  }
  function delimiter(type) {
    while (next())
      switch (character) {
        // ] ) " '
        case type:
          return position;
        // " '
        case 34:
        case 39:
          if (type !== 34 && type !== 39)
            delimiter(character);
          break;
        // (
        case 40:
          if (type === 41)
            delimiter(type);
          break;
        // \
        case 92:
          next();
          break;
      }
    return position;
  }
  function commenter(type, index) {
    while (next())
      if (type + character === 47 + 10)
        break;
      else if (type + character === 42 + 42 && peek() === 47)
        break;
    return "/*" + slice(index, position - 1) + "*" + from(type === 47 ? type : next());
  }
  function identifier(index) {
    while (!token(peek()))
      next();
    return slice(index, position);
  }
  var line, column, length, position, character, characters;
  var init_Tokenizer = __esm({
    "node_modules/stylis/src/Tokenizer.js"() {
      init_Utility();
      line = 1;
      column = 1;
      length = 0;
      position = 0;
      character = 0;
      characters = "";
    }
  });

  // node_modules/stylis/src/Parser.js
  function compile(value) {
    return dealloc(parse("", null, null, null, [""], value = alloc(value), 0, [0], value));
  }
  function parse(value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
    var index = 0;
    var offset = 0;
    var length2 = pseudo;
    var atrule = 0;
    var property = 0;
    var previous = 0;
    var variable = 1;
    var scanning = 1;
    var ampersand = 1;
    var character2 = 0;
    var type = "";
    var props = rules;
    var children = rulesets;
    var reference = rule;
    var characters2 = type;
    while (scanning)
      switch (previous = character2, character2 = next()) {
        // (
        case 40:
          if (previous != 108 && charat(characters2, length2 - 1) == 58) {
            if (indexof(characters2 += replace(delimit(character2), "&", "&\f"), "&\f") != -1)
              ampersand = -1;
            break;
          }
        // " ' [
        case 34:
        case 39:
        case 91:
          characters2 += delimit(character2);
          break;
        // \t \n \r \s
        case 9:
        case 10:
        case 13:
        case 32:
          characters2 += whitespace(previous);
          break;
        // \
        case 92:
          characters2 += escaping(caret() - 1, 7);
          continue;
        // /
        case 47:
          switch (peek()) {
            case 42:
            case 47:
              append(comment(commenter(next(), caret()), root, parent), declarations);
              break;
            default:
              characters2 += "/";
          }
          break;
        // {
        case 123 * variable:
          points[index++] = strlen(characters2) * ampersand;
        // } ; \0
        case 125 * variable:
        case 59:
        case 0:
          switch (character2) {
            // \0 }
            case 0:
            case 125:
              scanning = 0;
            // ;
            case 59 + offset:
              if (ampersand == -1) characters2 = replace(characters2, /\f/g, "");
              if (property > 0 && strlen(characters2) - length2)
                append(property > 32 ? declaration(characters2 + ";", rule, parent, length2 - 1) : declaration(replace(characters2, " ", "") + ";", rule, parent, length2 - 2), declarations);
              break;
            // @ ;
            case 59:
              characters2 += ";";
            // { rule/at-rule
            default:
              append(reference = ruleset(characters2, root, parent, index, offset, rules, points, type, props = [], children = [], length2), rulesets);
              if (character2 === 123)
                if (offset === 0)
                  parse(characters2, root, reference, reference, props, rulesets, length2, points, children);
                else
                  switch (atrule === 99 && charat(characters2, 3) === 110 ? 100 : atrule) {
                    // d l m s
                    case 100:
                    case 108:
                    case 109:
                    case 115:
                      parse(value, reference, reference, rule && append(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length2), children), rules, children, length2, points, rule ? props : children);
                      break;
                    default:
                      parse(characters2, reference, reference, reference, [""], children, 0, points, children);
                  }
          }
          index = offset = property = 0, variable = ampersand = 1, type = characters2 = "", length2 = pseudo;
          break;
        // :
        case 58:
          length2 = 1 + strlen(characters2), property = previous;
        default:
          if (variable < 1) {
            if (character2 == 123)
              --variable;
            else if (character2 == 125 && variable++ == 0 && prev() == 125)
              continue;
          }
          switch (characters2 += from(character2), character2 * variable) {
            // &
            case 38:
              ampersand = offset > 0 ? 1 : (characters2 += "\f", -1);
              break;
            // ,
            case 44:
              points[index++] = (strlen(characters2) - 1) * ampersand, ampersand = 1;
              break;
            // @
            case 64:
              if (peek() === 45)
                characters2 += delimit(next());
              atrule = peek(), offset = length2 = strlen(type = characters2 += identifier(caret())), character2++;
              break;
            // -
            case 45:
              if (previous === 45 && strlen(characters2) == 2)
                variable = 0;
          }
      }
    return rulesets;
  }
  function ruleset(value, root, parent, index, offset, rules, points, type, props, children, length2) {
    var post = offset - 1;
    var rule = offset === 0 ? rules : [""];
    var size = sizeof(rule);
    for (var i = 0, j = 0, k = 0; i < index; ++i)
      for (var x = 0, y = substr(value, post + 1, post = abs(j = points[i])), z = value; x < size; ++x)
        if (z = trim(j > 0 ? rule[x] + " " + y : replace(y, /&\f/g, rule[x])))
          props[k++] = z;
    return node(value, root, parent, offset === 0 ? RULESET : type, props, children, length2);
  }
  function comment(value, root, parent) {
    return node(value, root, parent, COMMENT, from(char()), substr(value, 2, -2), 0);
  }
  function declaration(value, root, parent, length2) {
    return node(value, root, parent, DECLARATION, substr(value, 0, length2), substr(value, length2 + 1, -1), length2);
  }
  var init_Parser = __esm({
    "node_modules/stylis/src/Parser.js"() {
      init_Enum();
      init_Utility();
      init_Tokenizer();
    }
  });

  // node_modules/stylis/src/Prefixer.js
  var init_Prefixer = __esm({
    "node_modules/stylis/src/Prefixer.js"() {
    }
  });

  // node_modules/stylis/src/Serializer.js
  function serialize(children, callback) {
    var output = "";
    var length2 = sizeof(children);
    for (var i = 0; i < length2; i++)
      output += callback(children[i], i, children, callback) || "";
    return output;
  }
  function stringify(element, index, children, callback) {
    switch (element.type) {
      case LAYER:
        if (element.children.length) break;
      case IMPORT:
      case DECLARATION:
        return element.return = element.return || element.value;
      case COMMENT:
        return "";
      case KEYFRAMES:
        return element.return = element.value + "{" + serialize(element.children, callback) + "}";
      case RULESET:
        element.value = element.props.join(",");
    }
    return strlen(children = serialize(element.children, callback)) ? element.return = element.value + "{" + children + "}" : "";
  }
  var init_Serializer = __esm({
    "node_modules/stylis/src/Serializer.js"() {
      init_Enum();
      init_Utility();
    }
  });

  // node_modules/stylis/src/Middleware.js
  function middleware(collection) {
    var length2 = sizeof(collection);
    return function(element, index, children, callback) {
      var output = "";
      for (var i = 0; i < length2; i++)
        output += collection[i](element, index, children, callback) || "";
      return output;
    };
  }
  function rulesheet(callback) {
    return function(element) {
      if (!element.root) {
        if (element = element.return)
          callback(element);
      }
    };
  }
  var init_Middleware = __esm({
    "node_modules/stylis/src/Middleware.js"() {
      init_Utility();
    }
  });

  // node_modules/stylis/index.js
  var init_stylis = __esm({
    "node_modules/stylis/index.js"() {
      init_Enum();
      init_Utility();
      init_Parser();
      init_Prefixer();
      init_Tokenizer();
      init_Serializer();
      init_Middleware();
    }
  });

  // node_modules/@emotion/weak-memoize/dist/emotion-weak-memoize.esm.js
  var init_emotion_weak_memoize_esm = __esm({
    "node_modules/@emotion/weak-memoize/dist/emotion-weak-memoize.esm.js"() {
    }
  });

  // node_modules/@emotion/memoize/dist/emotion-memoize.esm.js
  function memoize(fn) {
    var cache = /* @__PURE__ */ Object.create(null);
    return function(arg) {
      if (cache[arg] === void 0) cache[arg] = fn(arg);
      return cache[arg];
    };
  }
  var init_emotion_memoize_esm = __esm({
    "node_modules/@emotion/memoize/dist/emotion-memoize.esm.js"() {
    }
  });

  // node_modules/@emotion/cache/dist/emotion-cache.browser.esm.js
  function prefix(value, length2) {
    switch (hash(value, length2)) {
      // color-adjust
      case 5103:
        return WEBKIT + "print-" + value + value;
      // animation, animation-(delay|direction|duration|fill-mode|iteration-count|name|play-state|timing-function)
      case 5737:
      case 4201:
      case 3177:
      case 3433:
      case 1641:
      case 4457:
      case 2921:
      // text-decoration, filter, clip-path, backface-visibility, column, box-decoration-break
      case 5572:
      case 6356:
      case 5844:
      case 3191:
      case 6645:
      case 3005:
      // mask, mask-image, mask-(mode|clip|size), mask-(repeat|origin), mask-position, mask-composite,
      case 6391:
      case 5879:
      case 5623:
      case 6135:
      case 4599:
      case 4855:
      // background-clip, columns, column-(count|fill|gap|rule|rule-color|rule-style|rule-width|span|width)
      case 4215:
      case 6389:
      case 5109:
      case 5365:
      case 5621:
      case 3829:
        return WEBKIT + value + value;
      // appearance, user-select, transform, hyphens, text-size-adjust
      case 5349:
      case 4246:
      case 4810:
      case 6968:
      case 2756:
        return WEBKIT + value + MOZ + value + MS + value + value;
      // flex, flex-direction
      case 6828:
      case 4268:
        return WEBKIT + value + MS + value + value;
      // order
      case 6165:
        return WEBKIT + value + MS + "flex-" + value + value;
      // align-items
      case 5187:
        return WEBKIT + value + replace(value, /(\w+).+(:[^]+)/, WEBKIT + "box-$1$2" + MS + "flex-$1$2") + value;
      // align-self
      case 5443:
        return WEBKIT + value + MS + "flex-item-" + replace(value, /flex-|-self/, "") + value;
      // align-content
      case 4675:
        return WEBKIT + value + MS + "flex-line-pack" + replace(value, /align-content|flex-|-self/, "") + value;
      // flex-shrink
      case 5548:
        return WEBKIT + value + MS + replace(value, "shrink", "negative") + value;
      // flex-basis
      case 5292:
        return WEBKIT + value + MS + replace(value, "basis", "preferred-size") + value;
      // flex-grow
      case 6060:
        return WEBKIT + "box-" + replace(value, "-grow", "") + WEBKIT + value + MS + replace(value, "grow", "positive") + value;
      // transition
      case 4554:
        return WEBKIT + replace(value, /([^-])(transform)/g, "$1" + WEBKIT + "$2") + value;
      // cursor
      case 6187:
        return replace(replace(replace(value, /(zoom-|grab)/, WEBKIT + "$1"), /(image-set)/, WEBKIT + "$1"), value, "") + value;
      // background, background-image
      case 5495:
      case 3959:
        return replace(value, /(image-set\([^]*)/, WEBKIT + "$1$`$1");
      // justify-content
      case 4968:
        return replace(replace(value, /(.+:)(flex-)?(.*)/, WEBKIT + "box-pack:$3" + MS + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + WEBKIT + value + value;
      // (margin|padding)-inline-(start|end)
      case 4095:
      case 3583:
      case 4068:
      case 2532:
        return replace(value, /(.+)-inline(.+)/, WEBKIT + "$1$2") + value;
      // (min|max)?(width|height|inline-size|block-size)
      case 8116:
      case 7059:
      case 5753:
      case 5535:
      case 5445:
      case 5701:
      case 4933:
      case 4677:
      case 5533:
      case 5789:
      case 5021:
      case 4765:
        if (strlen(value) - 1 - length2 > 6) switch (charat(value, length2 + 1)) {
          // (m)ax-content, (m)in-content
          case 109:
            if (charat(value, length2 + 4) !== 45) break;
          // (f)ill-available, (f)it-content
          case 102:
            return replace(value, /(.+:)(.+)-([^]+)/, "$1" + WEBKIT + "$2-$3$1" + MOZ + (charat(value, length2 + 3) == 108 ? "$3" : "$2-$3")) + value;
          // (s)tretch
          case 115:
            return ~indexof(value, "stretch") ? prefix(replace(value, "stretch", "fill-available"), length2) + value : value;
        }
        break;
      // position: sticky
      case 4949:
        if (charat(value, length2 + 1) !== 115) break;
      // display: (flex|inline-flex)
      case 6444:
        switch (charat(value, strlen(value) - 3 - (~indexof(value, "!important") && 10))) {
          // stic(k)y
          case 107:
            return replace(value, ":", ":" + WEBKIT) + value;
          // (inline-)?fl(e)x
          case 101:
            return replace(value, /(.+:)([^;!]+)(;|!.+)?/, "$1" + WEBKIT + (charat(value, 14) === 45 ? "inline-" : "") + "box$3$1" + WEBKIT + "$2$3$1" + MS + "$2box$3") + value;
        }
        break;
      // writing-mode
      case 5936:
        switch (charat(value, length2 + 11)) {
          // vertical-l(r)
          case 114:
            return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb") + value;
          // vertical-r(l)
          case 108:
            return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb-rl") + value;
          // horizontal(-)tb
          case 45:
            return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "lr") + value;
        }
        return WEBKIT + value + MS + value + value;
    }
    return value;
  }
  var identifierWithPointTracking, toRules, getRules, fixedElements, compat, removeLabel, prefixer, defaultStylisPlugins, createCache;
  var init_emotion_cache_browser_esm = __esm({
    "node_modules/@emotion/cache/dist/emotion-cache.browser.esm.js"() {
      init_emotion_sheet_esm();
      init_stylis();
      init_emotion_weak_memoize_esm();
      init_emotion_memoize_esm();
      identifierWithPointTracking = function identifierWithPointTracking2(begin, points, index) {
        var previous = 0;
        var character2 = 0;
        while (true) {
          previous = character2;
          character2 = peek();
          if (previous === 38 && character2 === 12) {
            points[index] = 1;
          }
          if (token(character2)) {
            break;
          }
          next();
        }
        return slice(begin, position);
      };
      toRules = function toRules2(parsed, points) {
        var index = -1;
        var character2 = 44;
        do {
          switch (token(character2)) {
            case 0:
              if (character2 === 38 && peek() === 12) {
                points[index] = 1;
              }
              parsed[index] += identifierWithPointTracking(position - 1, points, index);
              break;
            case 2:
              parsed[index] += delimit(character2);
              break;
            case 4:
              if (character2 === 44) {
                parsed[++index] = peek() === 58 ? "&\f" : "";
                points[index] = parsed[index].length;
                break;
              }
            // fallthrough
            default:
              parsed[index] += from(character2);
          }
        } while (character2 = next());
        return parsed;
      };
      getRules = function getRules2(value, points) {
        return dealloc(toRules(alloc(value), points));
      };
      fixedElements = /* @__PURE__ */ new WeakMap();
      compat = function compat2(element) {
        if (element.type !== "rule" || !element.parent || // positive .length indicates that this rule contains pseudo
        // negative .length indicates that this rule has been already prefixed
        element.length < 1) {
          return;
        }
        var value = element.value;
        var parent = element.parent;
        var isImplicitRule = element.column === parent.column && element.line === parent.line;
        while (parent.type !== "rule") {
          parent = parent.parent;
          if (!parent) return;
        }
        if (element.props.length === 1 && value.charCodeAt(0) !== 58 && !fixedElements.get(parent)) {
          return;
        }
        if (isImplicitRule) {
          return;
        }
        fixedElements.set(element, true);
        var points = [];
        var rules = getRules(value, points);
        var parentRules = parent.props;
        for (var i = 0, k = 0; i < rules.length; i++) {
          for (var j = 0; j < parentRules.length; j++, k++) {
            element.props[k] = points[i] ? rules[i].replace(/&\f/g, parentRules[j]) : parentRules[j] + " " + rules[i];
          }
        }
      };
      removeLabel = function removeLabel2(element) {
        if (element.type === "decl") {
          var value = element.value;
          if (
            // charcode for l
            value.charCodeAt(0) === 108 && // charcode for b
            value.charCodeAt(2) === 98
          ) {
            element["return"] = "";
            element.value = "";
          }
        }
      };
      prefixer = function prefixer2(element, index, children, callback) {
        if (element.length > -1) {
          if (!element["return"]) switch (element.type) {
            case DECLARATION:
              element["return"] = prefix(element.value, element.length);
              break;
            case KEYFRAMES:
              return serialize([copy(element, {
                value: replace(element.value, "@", "@" + WEBKIT)
              })], callback);
            case RULESET:
              if (element.length) return combine(element.props, function(value) {
                switch (match(value, /(::plac\w+|:read-\w+)/)) {
                  // :read-(only|write)
                  case ":read-only":
                  case ":read-write":
                    return serialize([copy(element, {
                      props: [replace(value, /:(read-\w+)/, ":" + MOZ + "$1")]
                    })], callback);
                  // :placeholder
                  case "::placeholder":
                    return serialize([copy(element, {
                      props: [replace(value, /:(plac\w+)/, ":" + WEBKIT + "input-$1")]
                    }), copy(element, {
                      props: [replace(value, /:(plac\w+)/, ":" + MOZ + "$1")]
                    }), copy(element, {
                      props: [replace(value, /:(plac\w+)/, MS + "input-$1")]
                    })], callback);
                }
                return "";
              });
          }
        }
      };
      defaultStylisPlugins = [prefixer];
      createCache = function createCache2(options) {
        var key = options.key;
        if (key === "css") {
          var ssrStyles = document.querySelectorAll("style[data-emotion]:not([data-s])");
          Array.prototype.forEach.call(ssrStyles, function(node2) {
            var dataEmotionAttribute = node2.getAttribute("data-emotion");
            if (dataEmotionAttribute.indexOf(" ") === -1) {
              return;
            }
            document.head.appendChild(node2);
            node2.setAttribute("data-s", "");
          });
        }
        var stylisPlugins = options.stylisPlugins || defaultStylisPlugins;
        var inserted = {};
        var container;
        var nodesToHydrate = [];
        {
          container = options.container || document.head;
          Array.prototype.forEach.call(
            // this means we will ignore elements which don't have a space in them which
            // means that the style elements we're looking at are only Emotion 11 server-rendered style elements
            document.querySelectorAll('style[data-emotion^="' + key + ' "]'),
            function(node2) {
              var attrib = node2.getAttribute("data-emotion").split(" ");
              for (var i = 1; i < attrib.length; i++) {
                inserted[attrib[i]] = true;
              }
              nodesToHydrate.push(node2);
            }
          );
        }
        var _insert;
        var omnipresentPlugins = [compat, removeLabel];
        {
          var currentSheet;
          var finalizingPlugins = [stringify, rulesheet(function(rule) {
            currentSheet.insert(rule);
          })];
          var serializer = middleware(omnipresentPlugins.concat(stylisPlugins, finalizingPlugins));
          var stylis = function stylis2(styles) {
            return serialize(compile(styles), serializer);
          };
          _insert = function insert(selector, serialized, sheet, shouldCache) {
            currentSheet = sheet;
            stylis(selector ? selector + "{" + serialized.styles + "}" : serialized.styles);
            if (shouldCache) {
              cache.inserted[serialized.name] = true;
            }
          };
        }
        var cache = {
          key,
          sheet: new StyleSheet({
            key,
            container,
            nonce: options.nonce,
            speedy: options.speedy,
            prepend: options.prepend,
            insertionPoint: options.insertionPoint
          }),
          nonce: options.nonce,
          inserted,
          registered: {},
          insert: _insert
        };
        cache.sheet.hydrate(nodesToHydrate);
        return cache;
      };
    }
  });

  // node_modules/hoist-non-react-statics/node_modules/react-is/cjs/react-is.development.js
  var require_react_is_development = __commonJS({
    "node_modules/hoist-non-react-statics/node_modules/react-is/cjs/react-is.development.js"(exports) {
      "use strict";
      if (true) {
        (function() {
          "use strict";
          var hasSymbol = typeof Symbol === "function" && Symbol.for;
          var REACT_ELEMENT_TYPE = hasSymbol ? /* @__PURE__ */ Symbol.for("react.element") : 60103;
          var REACT_PORTAL_TYPE = hasSymbol ? /* @__PURE__ */ Symbol.for("react.portal") : 60106;
          var REACT_FRAGMENT_TYPE = hasSymbol ? /* @__PURE__ */ Symbol.for("react.fragment") : 60107;
          var REACT_STRICT_MODE_TYPE = hasSymbol ? /* @__PURE__ */ Symbol.for("react.strict_mode") : 60108;
          var REACT_PROFILER_TYPE = hasSymbol ? /* @__PURE__ */ Symbol.for("react.profiler") : 60114;
          var REACT_PROVIDER_TYPE = hasSymbol ? /* @__PURE__ */ Symbol.for("react.provider") : 60109;
          var REACT_CONTEXT_TYPE = hasSymbol ? /* @__PURE__ */ Symbol.for("react.context") : 60110;
          var REACT_ASYNC_MODE_TYPE = hasSymbol ? /* @__PURE__ */ Symbol.for("react.async_mode") : 60111;
          var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? /* @__PURE__ */ Symbol.for("react.concurrent_mode") : 60111;
          var REACT_FORWARD_REF_TYPE = hasSymbol ? /* @__PURE__ */ Symbol.for("react.forward_ref") : 60112;
          var REACT_SUSPENSE_TYPE = hasSymbol ? /* @__PURE__ */ Symbol.for("react.suspense") : 60113;
          var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? /* @__PURE__ */ Symbol.for("react.suspense_list") : 60120;
          var REACT_MEMO_TYPE = hasSymbol ? /* @__PURE__ */ Symbol.for("react.memo") : 60115;
          var REACT_LAZY_TYPE = hasSymbol ? /* @__PURE__ */ Symbol.for("react.lazy") : 60116;
          var REACT_BLOCK_TYPE = hasSymbol ? /* @__PURE__ */ Symbol.for("react.block") : 60121;
          var REACT_FUNDAMENTAL_TYPE = hasSymbol ? /* @__PURE__ */ Symbol.for("react.fundamental") : 60117;
          var REACT_RESPONDER_TYPE = hasSymbol ? /* @__PURE__ */ Symbol.for("react.responder") : 60118;
          var REACT_SCOPE_TYPE = hasSymbol ? /* @__PURE__ */ Symbol.for("react.scope") : 60119;
          function isValidElementType(type) {
            return typeof type === "string" || typeof type === "function" || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
            type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === "object" && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
          }
          function typeOf(object) {
            if (typeof object === "object" && object !== null) {
              var $$typeof = object.$$typeof;
              switch ($$typeof) {
                case REACT_ELEMENT_TYPE:
                  var type = object.type;
                  switch (type) {
                    case REACT_ASYNC_MODE_TYPE:
                    case REACT_CONCURRENT_MODE_TYPE:
                    case REACT_FRAGMENT_TYPE:
                    case REACT_PROFILER_TYPE:
                    case REACT_STRICT_MODE_TYPE:
                    case REACT_SUSPENSE_TYPE:
                      return type;
                    default:
                      var $$typeofType = type && type.$$typeof;
                      switch ($$typeofType) {
                        case REACT_CONTEXT_TYPE:
                        case REACT_FORWARD_REF_TYPE:
                        case REACT_LAZY_TYPE:
                        case REACT_MEMO_TYPE:
                        case REACT_PROVIDER_TYPE:
                          return $$typeofType;
                        default:
                          return $$typeof;
                      }
                  }
                case REACT_PORTAL_TYPE:
                  return $$typeof;
              }
            }
            return void 0;
          }
          var AsyncMode = REACT_ASYNC_MODE_TYPE;
          var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
          var ContextConsumer = REACT_CONTEXT_TYPE;
          var ContextProvider = REACT_PROVIDER_TYPE;
          var Element = REACT_ELEMENT_TYPE;
          var ForwardRef = REACT_FORWARD_REF_TYPE;
          var Fragment4 = REACT_FRAGMENT_TYPE;
          var Lazy = REACT_LAZY_TYPE;
          var Memo = REACT_MEMO_TYPE;
          var Portal = REACT_PORTAL_TYPE;
          var Profiler = REACT_PROFILER_TYPE;
          var StrictMode = REACT_STRICT_MODE_TYPE;
          var Suspense = REACT_SUSPENSE_TYPE;
          var hasWarnedAboutDeprecatedIsAsyncMode = false;
          function isAsyncMode(object) {
            {
              if (!hasWarnedAboutDeprecatedIsAsyncMode) {
                hasWarnedAboutDeprecatedIsAsyncMode = true;
                console["warn"]("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.");
              }
            }
            return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
          }
          function isConcurrentMode(object) {
            return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
          }
          function isContextConsumer(object) {
            return typeOf(object) === REACT_CONTEXT_TYPE;
          }
          function isContextProvider(object) {
            return typeOf(object) === REACT_PROVIDER_TYPE;
          }
          function isElement(object) {
            return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
          }
          function isForwardRef(object) {
            return typeOf(object) === REACT_FORWARD_REF_TYPE;
          }
          function isFragment(object) {
            return typeOf(object) === REACT_FRAGMENT_TYPE;
          }
          function isLazy(object) {
            return typeOf(object) === REACT_LAZY_TYPE;
          }
          function isMemo(object) {
            return typeOf(object) === REACT_MEMO_TYPE;
          }
          function isPortal(object) {
            return typeOf(object) === REACT_PORTAL_TYPE;
          }
          function isProfiler(object) {
            return typeOf(object) === REACT_PROFILER_TYPE;
          }
          function isStrictMode(object) {
            return typeOf(object) === REACT_STRICT_MODE_TYPE;
          }
          function isSuspense(object) {
            return typeOf(object) === REACT_SUSPENSE_TYPE;
          }
          exports.AsyncMode = AsyncMode;
          exports.ConcurrentMode = ConcurrentMode;
          exports.ContextConsumer = ContextConsumer;
          exports.ContextProvider = ContextProvider;
          exports.Element = Element;
          exports.ForwardRef = ForwardRef;
          exports.Fragment = Fragment4;
          exports.Lazy = Lazy;
          exports.Memo = Memo;
          exports.Portal = Portal;
          exports.Profiler = Profiler;
          exports.StrictMode = StrictMode;
          exports.Suspense = Suspense;
          exports.isAsyncMode = isAsyncMode;
          exports.isConcurrentMode = isConcurrentMode;
          exports.isContextConsumer = isContextConsumer;
          exports.isContextProvider = isContextProvider;
          exports.isElement = isElement;
          exports.isForwardRef = isForwardRef;
          exports.isFragment = isFragment;
          exports.isLazy = isLazy;
          exports.isMemo = isMemo;
          exports.isPortal = isPortal;
          exports.isProfiler = isProfiler;
          exports.isStrictMode = isStrictMode;
          exports.isSuspense = isSuspense;
          exports.isValidElementType = isValidElementType;
          exports.typeOf = typeOf;
        })();
      }
    }
  });

  // node_modules/hoist-non-react-statics/node_modules/react-is/index.js
  var require_react_is = __commonJS({
    "node_modules/hoist-non-react-statics/node_modules/react-is/index.js"(exports, module) {
      "use strict";
      if (false) {
        module.exports = null;
      } else {
        module.exports = require_react_is_development();
      }
    }
  });

  // node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js
  var require_hoist_non_react_statics_cjs = __commonJS({
    "node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js"(exports, module) {
      "use strict";
      var reactIs = require_react_is();
      var REACT_STATICS = {
        childContextTypes: true,
        contextType: true,
        contextTypes: true,
        defaultProps: true,
        displayName: true,
        getDefaultProps: true,
        getDerivedStateFromError: true,
        getDerivedStateFromProps: true,
        mixins: true,
        propTypes: true,
        type: true
      };
      var KNOWN_STATICS = {
        name: true,
        length: true,
        prototype: true,
        caller: true,
        callee: true,
        arguments: true,
        arity: true
      };
      var FORWARD_REF_STATICS = {
        "$$typeof": true,
        render: true,
        defaultProps: true,
        displayName: true,
        propTypes: true
      };
      var MEMO_STATICS = {
        "$$typeof": true,
        compare: true,
        defaultProps: true,
        displayName: true,
        propTypes: true,
        type: true
      };
      var TYPE_STATICS = {};
      TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
      TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;
      function getStatics(component) {
        if (reactIs.isMemo(component)) {
          return MEMO_STATICS;
        }
        return TYPE_STATICS[component["$$typeof"]] || REACT_STATICS;
      }
      var defineProperty = Object.defineProperty;
      var getOwnPropertyNames = Object.getOwnPropertyNames;
      var getOwnPropertySymbols = Object.getOwnPropertySymbols;
      var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
      var getPrototypeOf = Object.getPrototypeOf;
      var objectPrototype = Object.prototype;
      function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
        if (typeof sourceComponent !== "string") {
          if (objectPrototype) {
            var inheritedComponent = getPrototypeOf(sourceComponent);
            if (inheritedComponent && inheritedComponent !== objectPrototype) {
              hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
            }
          }
          var keys = getOwnPropertyNames(sourceComponent);
          if (getOwnPropertySymbols) {
            keys = keys.concat(getOwnPropertySymbols(sourceComponent));
          }
          var targetStatics = getStatics(targetComponent);
          var sourceStatics = getStatics(sourceComponent);
          for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
              var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
              try {
                defineProperty(targetComponent, key, descriptor);
              } catch (e) {
              }
            }
          }
        }
        return targetComponent;
      }
      module.exports = hoistNonReactStatics;
    }
  });

  // node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js
  function getRegisteredStyles(registered, registeredStyles, classNames) {
    var rawClassName = "";
    classNames.split(" ").forEach(function(className) {
      if (registered[className] !== void 0) {
        registeredStyles.push(registered[className] + ";");
      } else if (className) {
        rawClassName += className + " ";
      }
    });
    return rawClassName;
  }
  var isBrowser, registerStyles, insertStyles;
  var init_emotion_utils_browser_esm = __esm({
    "node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js"() {
      isBrowser = true;
      registerStyles = function registerStyles2(cache, serialized, isStringTag) {
        var className = cache.key + "-" + serialized.name;
        if (
          // we only need to add the styles to the registered cache if the
          // class name could be used further down
          // the tree but if it's a string tag, we know it won't
          // so we don't have to add it to registered cache.
          // this improves memory usage since we can avoid storing the whole style string
          (isStringTag === false || // we need to always store it if we're in compat mode and
          // in node since emotion-server relies on whether a style is in
          // the registered cache to know whether a style is global or not
          // also, note that this check will be dead code eliminated in the browser
          isBrowser === false) && cache.registered[className] === void 0
        ) {
          cache.registered[className] = serialized.styles;
        }
      };
      insertStyles = function insertStyles2(cache, serialized, isStringTag) {
        registerStyles(cache, serialized, isStringTag);
        var className = cache.key + "-" + serialized.name;
        if (cache.inserted[serialized.name] === void 0) {
          var current = serialized;
          do {
            cache.insert(serialized === current ? "." + className : "", current, cache.sheet, true);
            current = current.next;
          } while (current !== void 0);
        }
      };
    }
  });

  // node_modules/@emotion/hash/dist/emotion-hash.esm.js
  function murmur2(str) {
    var h = 0;
    var k, i = 0, len = str.length;
    for (; len >= 4; ++i, len -= 4) {
      k = str.charCodeAt(i) & 255 | (str.charCodeAt(++i) & 255) << 8 | (str.charCodeAt(++i) & 255) << 16 | (str.charCodeAt(++i) & 255) << 24;
      k = /* Math.imul(k, m): */
      (k & 65535) * 1540483477 + ((k >>> 16) * 59797 << 16);
      k ^= /* k >>> r: */
      k >>> 24;
      h = /* Math.imul(k, m): */
      (k & 65535) * 1540483477 + ((k >>> 16) * 59797 << 16) ^ /* Math.imul(h, m): */
      (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
    }
    switch (len) {
      case 3:
        h ^= (str.charCodeAt(i + 2) & 255) << 16;
      case 2:
        h ^= (str.charCodeAt(i + 1) & 255) << 8;
      case 1:
        h ^= str.charCodeAt(i) & 255;
        h = /* Math.imul(h, m): */
        (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
    }
    h ^= h >>> 13;
    h = /* Math.imul(h, m): */
    (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
    return ((h ^ h >>> 15) >>> 0).toString(36);
  }
  var init_emotion_hash_esm = __esm({
    "node_modules/@emotion/hash/dist/emotion-hash.esm.js"() {
    }
  });

  // node_modules/@emotion/unitless/dist/emotion-unitless.esm.js
  var unitlessKeys;
  var init_emotion_unitless_esm = __esm({
    "node_modules/@emotion/unitless/dist/emotion-unitless.esm.js"() {
      unitlessKeys = {
        animationIterationCount: 1,
        aspectRatio: 1,
        borderImageOutset: 1,
        borderImageSlice: 1,
        borderImageWidth: 1,
        boxFlex: 1,
        boxFlexGroup: 1,
        boxOrdinalGroup: 1,
        columnCount: 1,
        columns: 1,
        flex: 1,
        flexGrow: 1,
        flexPositive: 1,
        flexShrink: 1,
        flexNegative: 1,
        flexOrder: 1,
        gridRow: 1,
        gridRowEnd: 1,
        gridRowSpan: 1,
        gridRowStart: 1,
        gridColumn: 1,
        gridColumnEnd: 1,
        gridColumnSpan: 1,
        gridColumnStart: 1,
        msGridRow: 1,
        msGridRowSpan: 1,
        msGridColumn: 1,
        msGridColumnSpan: 1,
        fontWeight: 1,
        lineHeight: 1,
        opacity: 1,
        order: 1,
        orphans: 1,
        scale: 1,
        tabSize: 1,
        widows: 1,
        zIndex: 1,
        zoom: 1,
        WebkitLineClamp: 1,
        // SVG-related properties
        fillOpacity: 1,
        floodOpacity: 1,
        stopOpacity: 1,
        strokeDasharray: 1,
        strokeDashoffset: 1,
        strokeMiterlimit: 1,
        strokeOpacity: 1,
        strokeWidth: 1
      };
    }
  });

  // node_modules/@emotion/serialize/dist/emotion-serialize.esm.js
  function handleInterpolation(mergedProps, registered, interpolation) {
    if (interpolation == null) {
      return "";
    }
    var componentSelector = interpolation;
    if (componentSelector.__emotion_styles !== void 0) {
      return componentSelector;
    }
    switch (typeof interpolation) {
      case "boolean": {
        return "";
      }
      case "object": {
        var keyframes = interpolation;
        if (keyframes.anim === 1) {
          cursor = {
            name: keyframes.name,
            styles: keyframes.styles,
            next: cursor
          };
          return keyframes.name;
        }
        var serializedStyles = interpolation;
        if (serializedStyles.styles !== void 0) {
          var next2 = serializedStyles.next;
          if (next2 !== void 0) {
            while (next2 !== void 0) {
              cursor = {
                name: next2.name,
                styles: next2.styles,
                next: cursor
              };
              next2 = next2.next;
            }
          }
          var styles = serializedStyles.styles + ";";
          return styles;
        }
        return createStringFromObject(mergedProps, registered, interpolation);
      }
      case "function": {
        if (mergedProps !== void 0) {
          var previousCursor = cursor;
          var result = interpolation(mergedProps);
          cursor = previousCursor;
          return handleInterpolation(mergedProps, registered, result);
        }
        break;
      }
    }
    var asString = interpolation;
    if (registered == null) {
      return asString;
    }
    var cached = registered[asString];
    return cached !== void 0 ? cached : asString;
  }
  function createStringFromObject(mergedProps, registered, obj) {
    var string = "";
    if (Array.isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
        string += handleInterpolation(mergedProps, registered, obj[i]) + ";";
      }
    } else {
      for (var key in obj) {
        var value = obj[key];
        if (typeof value !== "object") {
          var asString = value;
          if (registered != null && registered[asString] !== void 0) {
            string += key + "{" + registered[asString] + "}";
          } else if (isProcessableValue(asString)) {
            string += processStyleName(key) + ":" + processStyleValue(key, asString) + ";";
          }
        } else {
          if (key === "NO_COMPONENT_SELECTOR" && isDevelopment2) {
            throw new Error(noComponentSelectorMessage);
          }
          if (Array.isArray(value) && typeof value[0] === "string" && (registered == null || registered[value[0]] === void 0)) {
            for (var _i = 0; _i < value.length; _i++) {
              if (isProcessableValue(value[_i])) {
                string += processStyleName(key) + ":" + processStyleValue(key, value[_i]) + ";";
              }
            }
          } else {
            var interpolated = handleInterpolation(mergedProps, registered, value);
            switch (key) {
              case "animation":
              case "animationName": {
                string += processStyleName(key) + ":" + interpolated + ";";
                break;
              }
              default: {
                string += key + "{" + interpolated + "}";
              }
            }
          }
        }
      }
    }
    return string;
  }
  function serializeStyles(args, registered, mergedProps) {
    if (args.length === 1 && typeof args[0] === "object" && args[0] !== null && args[0].styles !== void 0) {
      return args[0];
    }
    var stringMode = true;
    var styles = "";
    cursor = void 0;
    var strings = args[0];
    if (strings == null || strings.raw === void 0) {
      stringMode = false;
      styles += handleInterpolation(mergedProps, registered, strings);
    } else {
      var asTemplateStringsArr = strings;
      styles += asTemplateStringsArr[0];
    }
    for (var i = 1; i < args.length; i++) {
      styles += handleInterpolation(mergedProps, registered, args[i]);
      if (stringMode) {
        var templateStringsArr = strings;
        styles += templateStringsArr[i];
      }
    }
    labelPattern.lastIndex = 0;
    var identifierName = "";
    var match2;
    while ((match2 = labelPattern.exec(styles)) !== null) {
      identifierName += "-" + match2[1];
    }
    var name = murmur2(styles) + identifierName;
    return {
      name,
      styles,
      next: cursor
    };
  }
  var isDevelopment2, hyphenateRegex, animationRegex, isCustomProperty, isProcessableValue, processStyleName, processStyleValue, noComponentSelectorMessage, labelPattern, cursor;
  var init_emotion_serialize_esm = __esm({
    "node_modules/@emotion/serialize/dist/emotion-serialize.esm.js"() {
      init_emotion_hash_esm();
      init_emotion_unitless_esm();
      init_emotion_memoize_esm();
      isDevelopment2 = false;
      hyphenateRegex = /[A-Z]|^ms/g;
      animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;
      isCustomProperty = function isCustomProperty2(property) {
        return property.charCodeAt(1) === 45;
      };
      isProcessableValue = function isProcessableValue2(value) {
        return value != null && typeof value !== "boolean";
      };
      processStyleName = /* @__PURE__ */ memoize(function(styleName) {
        return isCustomProperty(styleName) ? styleName : styleName.replace(hyphenateRegex, "-$&").toLowerCase();
      });
      processStyleValue = function processStyleValue2(key, value) {
        switch (key) {
          case "animation":
          case "animationName": {
            if (typeof value === "string") {
              return value.replace(animationRegex, function(match2, p1, p2) {
                cursor = {
                  name: p1,
                  styles: p2,
                  next: cursor
                };
                return p1;
              });
            }
          }
        }
        if (unitlessKeys[key] !== 1 && !isCustomProperty(key) && typeof value === "number" && value !== 0) {
          return value + "px";
        }
        return value;
      };
      noComponentSelectorMessage = "Component selectors can only be used in conjunction with @emotion/babel-plugin, the swc Emotion plugin, or another Emotion-aware compiler transform.";
      labelPattern = /label:\s*([^\s;{]+)\s*(;|$)/g;
    }
  });

  // node_modules/@emotion/use-insertion-effect-with-fallbacks/dist/emotion-use-insertion-effect-with-fallbacks.browser.esm.js
  var React, syncFallback, useInsertionEffect2, useInsertionEffectAlwaysWithSyncFallback;
  var init_emotion_use_insertion_effect_with_fallbacks_browser_esm = __esm({
    "node_modules/@emotion/use-insertion-effect-with-fallbacks/dist/emotion-use-insertion-effect-with-fallbacks.browser.esm.js"() {
      React = __toESM(__require("react"));
      syncFallback = function syncFallback2(create) {
        return create();
      };
      useInsertionEffect2 = React["useInsertionEffect"] ? React["useInsertionEffect"] : false;
      useInsertionEffectAlwaysWithSyncFallback = useInsertionEffect2 || syncFallback;
    }
  });

  // node_modules/@emotion/react/dist/emotion-element-f0de968e.browser.esm.js
  var React2, import_react, isDevelopment3, EmotionCacheContext, CacheProvider, withEmotionCache, ThemeContext, hasOwn, typePropName, createEmotionProps, Insertion, Emotion, Emotion$1;
  var init_emotion_element_f0de968e_browser_esm = __esm({
    "node_modules/@emotion/react/dist/emotion-element-f0de968e.browser.esm.js"() {
      React2 = __toESM(__require("react"));
      import_react = __require("react");
      init_emotion_cache_browser_esm();
      init_extends();
      init_emotion_weak_memoize_esm();
      init_emotion_utils_browser_esm();
      init_emotion_serialize_esm();
      init_emotion_use_insertion_effect_with_fallbacks_browser_esm();
      isDevelopment3 = false;
      EmotionCacheContext = /* @__PURE__ */ React2.createContext(
        // we're doing this to avoid preconstruct's dead code elimination in this one case
        // because this module is primarily intended for the browser and node
        // but it's also required in react native and similar environments sometimes
        // and we could have a special build just for that
        // but this is much easier and the native packages
        // might use a different theme context in the future anyway
        typeof HTMLElement !== "undefined" ? /* @__PURE__ */ createCache({
          key: "css"
        }) : null
      );
      CacheProvider = EmotionCacheContext.Provider;
      withEmotionCache = function withEmotionCache2(func) {
        return /* @__PURE__ */ (0, import_react.forwardRef)(function(props, ref) {
          var cache = (0, import_react.useContext)(EmotionCacheContext);
          return func(props, cache, ref);
        });
      };
      ThemeContext = /* @__PURE__ */ React2.createContext({});
      hasOwn = {}.hasOwnProperty;
      typePropName = "__EMOTION_TYPE_PLEASE_DO_NOT_USE__";
      createEmotionProps = function createEmotionProps2(type, props) {
        var newProps = {};
        for (var _key in props) {
          if (hasOwn.call(props, _key)) {
            newProps[_key] = props[_key];
          }
        }
        newProps[typePropName] = type;
        return newProps;
      };
      Insertion = function Insertion2(_ref) {
        var cache = _ref.cache, serialized = _ref.serialized, isStringTag = _ref.isStringTag;
        registerStyles(cache, serialized, isStringTag);
        useInsertionEffectAlwaysWithSyncFallback(function() {
          return insertStyles(cache, serialized, isStringTag);
        });
        return null;
      };
      Emotion = /* @__PURE__ */ withEmotionCache(function(props, cache, ref) {
        var cssProp = props.css;
        if (typeof cssProp === "string" && cache.registered[cssProp] !== void 0) {
          cssProp = cache.registered[cssProp];
        }
        var WrappedComponent = props[typePropName];
        var registeredStyles = [cssProp];
        var className = "";
        if (typeof props.className === "string") {
          className = getRegisteredStyles(cache.registered, registeredStyles, props.className);
        } else if (props.className != null) {
          className = props.className + " ";
        }
        var serialized = serializeStyles(registeredStyles, void 0, React2.useContext(ThemeContext));
        className += cache.key + "-" + serialized.name;
        var newProps = {};
        for (var _key2 in props) {
          if (hasOwn.call(props, _key2) && _key2 !== "css" && _key2 !== typePropName && !isDevelopment3) {
            newProps[_key2] = props[_key2];
          }
        }
        newProps.className = className;
        if (ref) {
          newProps.ref = ref;
        }
        return /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(Insertion, {
          cache,
          serialized,
          isStringTag: typeof WrappedComponent === "string"
        }), /* @__PURE__ */ React2.createElement(WrappedComponent, newProps));
      });
      Emotion$1 = Emotion;
    }
  });

  // node_modules/@emotion/react/dist/emotion-react.browser.esm.js
  var React3, import_hoist_non_react_statics, jsx;
  var init_emotion_react_browser_esm = __esm({
    "node_modules/@emotion/react/dist/emotion-react.browser.esm.js"() {
      init_emotion_element_f0de968e_browser_esm();
      init_emotion_element_f0de968e_browser_esm();
      React3 = __toESM(__require("react"));
      init_emotion_utils_browser_esm();
      init_emotion_use_insertion_effect_with_fallbacks_browser_esm();
      init_emotion_serialize_esm();
      init_emotion_cache_browser_esm();
      init_extends();
      init_emotion_weak_memoize_esm();
      import_hoist_non_react_statics = __toESM(require_hoist_non_react_statics_cjs());
      jsx = function jsx2(type, props) {
        var args = arguments;
        if (props == null || !hasOwn.call(props, "css")) {
          return React3.createElement.apply(void 0, args);
        }
        var argsLength = args.length;
        var createElementArgArray = new Array(argsLength);
        createElementArgArray[0] = Emotion$1;
        createElementArgArray[1] = createEmotionProps(type, props);
        for (var i = 2; i < argsLength; i++) {
          createElementArgArray[i] = args[i];
        }
        return React3.createElement.apply(null, createElementArgArray);
      };
      (function(_jsx) {
        var JSX;
        /* @__PURE__ */ (function(_JSX) {
        })(JSX || (JSX = _jsx.JSX || (_jsx.JSX = {})));
      })(jsx || (jsx = {}));
    }
  });

  // node_modules/@emotion/is-prop-valid/dist/emotion-is-prop-valid.esm.js
  var reactPropsRegex, isPropValid;
  var init_emotion_is_prop_valid_esm = __esm({
    "node_modules/@emotion/is-prop-valid/dist/emotion-is-prop-valid.esm.js"() {
      init_emotion_memoize_esm();
      reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|disableRemotePlayback|download|draggable|encType|enterKeyHint|fetchpriority|fetchPriority|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|popover|popoverTarget|popoverTargetAction|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/;
      isPropValid = /* @__PURE__ */ memoize(
        function(prop) {
          return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111 && prop.charCodeAt(1) === 110 && prop.charCodeAt(2) < 91;
        }
        /* Z+1 */
      );
    }
  });

  // node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.esm.js
  var React4, isDevelopment4, testOmitPropsOnStringTag, testOmitPropsOnComponent, getDefaultShouldForwardProp, composeShouldForwardProps, Insertion3, createStyled;
  var init_emotion_styled_base_browser_esm = __esm({
    "node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.esm.js"() {
      init_extends();
      init_emotion_react_browser_esm();
      init_emotion_serialize_esm();
      init_emotion_use_insertion_effect_with_fallbacks_browser_esm();
      init_emotion_utils_browser_esm();
      React4 = __toESM(__require("react"));
      init_emotion_is_prop_valid_esm();
      isDevelopment4 = false;
      testOmitPropsOnStringTag = isPropValid;
      testOmitPropsOnComponent = function testOmitPropsOnComponent2(key) {
        return key !== "theme";
      };
      getDefaultShouldForwardProp = function getDefaultShouldForwardProp2(tag) {
        return typeof tag === "string" && // 96 is one less than the char code
        // for "a" so this is checking that
        // it's a lowercase character
        tag.charCodeAt(0) > 96 ? testOmitPropsOnStringTag : testOmitPropsOnComponent;
      };
      composeShouldForwardProps = function composeShouldForwardProps2(tag, options, isReal) {
        var shouldForwardProp;
        if (options) {
          var optionsShouldForwardProp = options.shouldForwardProp;
          shouldForwardProp = tag.__emotion_forwardProp && optionsShouldForwardProp ? function(propName) {
            return tag.__emotion_forwardProp(propName) && optionsShouldForwardProp(propName);
          } : optionsShouldForwardProp;
        }
        if (typeof shouldForwardProp !== "function" && isReal) {
          shouldForwardProp = tag.__emotion_forwardProp;
        }
        return shouldForwardProp;
      };
      Insertion3 = function Insertion4(_ref) {
        var cache = _ref.cache, serialized = _ref.serialized, isStringTag = _ref.isStringTag;
        registerStyles(cache, serialized, isStringTag);
        useInsertionEffectAlwaysWithSyncFallback(function() {
          return insertStyles(cache, serialized, isStringTag);
        });
        return null;
      };
      createStyled = function createStyled2(tag, options) {
        var isReal = tag.__emotion_real === tag;
        var baseTag = isReal && tag.__emotion_base || tag;
        var identifierName;
        var targetClassName;
        if (options !== void 0) {
          identifierName = options.label;
          targetClassName = options.target;
        }
        var shouldForwardProp = composeShouldForwardProps(tag, options, isReal);
        var defaultShouldForwardProp = shouldForwardProp || getDefaultShouldForwardProp(baseTag);
        var shouldUseAs = !defaultShouldForwardProp("as");
        return function() {
          var args = arguments;
          var styles = isReal && tag.__emotion_styles !== void 0 ? tag.__emotion_styles.slice(0) : [];
          if (identifierName !== void 0) {
            styles.push("label:" + identifierName + ";");
          }
          if (args[0] == null || args[0].raw === void 0) {
            styles.push.apply(styles, args);
          } else {
            var templateStringsArr = args[0];
            styles.push(templateStringsArr[0]);
            var len = args.length;
            var i = 1;
            for (; i < len; i++) {
              styles.push(args[i], templateStringsArr[i]);
            }
          }
          var Styled = withEmotionCache(function(props, cache, ref) {
            var FinalTag = shouldUseAs && props.as || baseTag;
            var className = "";
            var classInterpolations = [];
            var mergedProps = props;
            if (props.theme == null) {
              mergedProps = {};
              for (var key in props) {
                mergedProps[key] = props[key];
              }
              mergedProps.theme = React4.useContext(ThemeContext);
            }
            if (typeof props.className === "string") {
              className = getRegisteredStyles(cache.registered, classInterpolations, props.className);
            } else if (props.className != null) {
              className = props.className + " ";
            }
            var serialized = serializeStyles(styles.concat(classInterpolations), cache.registered, mergedProps);
            className += cache.key + "-" + serialized.name;
            if (targetClassName !== void 0) {
              className += " " + targetClassName;
            }
            var finalShouldForwardProp = shouldUseAs && shouldForwardProp === void 0 ? getDefaultShouldForwardProp(FinalTag) : defaultShouldForwardProp;
            var newProps = {};
            for (var _key in props) {
              if (shouldUseAs && _key === "as") continue;
              if (finalShouldForwardProp(_key)) {
                newProps[_key] = props[_key];
              }
            }
            newProps.className = className;
            if (ref) {
              newProps.ref = ref;
            }
            return /* @__PURE__ */ React4.createElement(React4.Fragment, null, /* @__PURE__ */ React4.createElement(Insertion3, {
              cache,
              serialized,
              isStringTag: typeof FinalTag === "string"
            }), /* @__PURE__ */ React4.createElement(FinalTag, newProps));
          });
          Styled.displayName = identifierName !== void 0 ? identifierName : "Styled(" + (typeof baseTag === "string" ? baseTag : baseTag.displayName || baseTag.name || "Component") + ")";
          Styled.defaultProps = tag.defaultProps;
          Styled.__emotion_real = Styled;
          Styled.__emotion_base = baseTag;
          Styled.__emotion_styles = styles;
          Styled.__emotion_forwardProp = shouldForwardProp;
          Object.defineProperty(Styled, "toString", {
            value: function value() {
              if (targetClassName === void 0 && isDevelopment4) {
                return "NO_COMPONENT_SELECTOR";
              }
              return "." + targetClassName;
            }
          });
          Styled.withComponent = function(nextTag, nextOptions) {
            var newStyled = createStyled2(nextTag, _extends({}, options, nextOptions, {
              shouldForwardProp: composeShouldForwardProps(Styled, nextOptions, true)
            }));
            return newStyled.apply(void 0, styles);
          };
          return Styled;
        };
      };
    }
  });

  // node_modules/@emotion/styled/dist/emotion-styled.browser.esm.js
  var emotion_styled_browser_esm_exports = {};
  __export(emotion_styled_browser_esm_exports, {
    default: () => styled
  });
  var import_react3, tags, styled;
  var init_emotion_styled_browser_esm = __esm({
    "node_modules/@emotion/styled/dist/emotion-styled.browser.esm.js"() {
      init_emotion_styled_base_browser_esm();
      init_extends();
      init_emotion_serialize_esm();
      init_emotion_use_insertion_effect_with_fallbacks_browser_esm();
      init_emotion_utils_browser_esm();
      import_react3 = __require("react");
      init_emotion_is_prop_valid_esm();
      tags = [
        "a",
        "abbr",
        "address",
        "area",
        "article",
        "aside",
        "audio",
        "b",
        "base",
        "bdi",
        "bdo",
        "big",
        "blockquote",
        "body",
        "br",
        "button",
        "canvas",
        "caption",
        "cite",
        "code",
        "col",
        "colgroup",
        "data",
        "datalist",
        "dd",
        "del",
        "details",
        "dfn",
        "dialog",
        "div",
        "dl",
        "dt",
        "em",
        "embed",
        "fieldset",
        "figcaption",
        "figure",
        "footer",
        "form",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "head",
        "header",
        "hgroup",
        "hr",
        "html",
        "i",
        "iframe",
        "img",
        "input",
        "ins",
        "kbd",
        "keygen",
        "label",
        "legend",
        "li",
        "link",
        "main",
        "map",
        "mark",
        "marquee",
        "menu",
        "menuitem",
        "meta",
        "meter",
        "nav",
        "noscript",
        "object",
        "ol",
        "optgroup",
        "option",
        "output",
        "p",
        "param",
        "picture",
        "pre",
        "progress",
        "q",
        "rp",
        "rt",
        "ruby",
        "s",
        "samp",
        "script",
        "section",
        "select",
        "small",
        "source",
        "span",
        "strong",
        "style",
        "sub",
        "summary",
        "sup",
        "table",
        "tbody",
        "td",
        "textarea",
        "tfoot",
        "th",
        "thead",
        "time",
        "title",
        "tr",
        "track",
        "u",
        "ul",
        "var",
        "video",
        "wbr",
        // SVG
        "circle",
        "clipPath",
        "defs",
        "ellipse",
        "foreignObject",
        "g",
        "image",
        "line",
        "linearGradient",
        "mask",
        "path",
        "pattern",
        "polygon",
        "polyline",
        "radialGradient",
        "rect",
        "stop",
        "svg",
        "text",
        "tspan"
      ];
      styled = createStyled.bind(null);
      tags.forEach(function(tagName) {
        styled[tagName] = styled(tagName);
      });
    }
  });

  // lib/CalendarFilter.js
  var require_CalendarFilter = __commonJS({
    "lib/CalendarFilter.js"(exports) {
      exports.__esModule = true;
      exports.default = CalendarFilter;
      var _react = _interopRequireWildcard(__require("react"));
      var _styled = _interopRequireDefault((init_emotion_styled_browser_esm(), __toCommonJS(emotion_styled_browser_esm_exports)));
      var _templateObject;
      var _templateObject2;
      var _templateObject3;
      var _templateObject4;
      var _templateObject5;
      var _templateObject6;
      var _templateObject7;
      var _templateObject8;
      var _templateObject9;
      var _templateObject0;
      var _templateObject1;
      var _templateObject10;
      var _templateObject11;
      var _templateObject12;
      var _templateObject13;
      var _templateObject14;
      var _templateObject15;
      var _templateObject16;
      var _templateObject17;
      var _templateObject18;
      var _templateObject19;
      var _templateObject20;
      var _templateObject21;
      var _templateObject22;
      var _templateObject23;
      var _templateObject24;
      var _templateObject25;
      var _templateObject26;
      var _templateObject27;
      var _templateObject28;
      var _templateObject29;
      var _templateObject30;
      var _templateObject31;
      function _interopRequireDefault(e) {
        return e && e.__esModule ? e : { default: e };
      }
      function _interopRequireWildcard(e, t) {
        if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
        return (_interopRequireWildcard = function _interopRequireWildcard2(e2, t2) {
          if (!t2 && e2 && e2.__esModule) return e2;
          var o, i, f = { __proto__: null, default: e2 };
          if (null === e2 || "object" != typeof e2 && "function" != typeof e2) return f;
          if (o = t2 ? n : r) {
            if (o.has(e2)) return o.get(e2);
            o.set(e2, f);
          }
          for (var _t in e2) "default" !== _t && {}.hasOwnProperty.call(e2, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e2, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e2[_t]);
          return f;
        })(e, t);
      }
      function _extends2() {
        return _extends2 = Object.assign ? Object.assign.bind() : function(n) {
          for (var e = 1; e < arguments.length; e++) {
            var t = arguments[e];
            for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
          }
          return n;
        }, _extends2.apply(null, arguments);
      }
      function _taggedTemplateLiteralLoose(e, t) {
        return t || (t = e.slice(0)), e.raw = t, e;
      }
      var COLOR_PALETTES = {
        supersetColors: ["#F0F0F0", "#D2E8F4", "#8FD3E4", "#51B5C8", "#20A7C9", "#147C99", "#0E4D64"],
        greens: ["#F0F0F0", "#E5F5E0", "#A1D99B", "#74C476", "#41AB5D", "#238B45", "#005A32"],
        blues: ["#F0F0F0", "#DEEBF7", "#9ECAE1", "#6BAED6", "#4292C6", "#2171B5", "#084594"],
        oranges: ["#F0F0F0", "#FEE6CE", "#FDAE6B", "#FD8D3C", "#F16913", "#D95F0E", "#993404"],
        reds: ["#F0F0F0", "#FEE0D2", "#FCBBA1", "#FC9272", "#FB6A4A", "#EF3B2C", "#99000D"],
        purples: ["#F0F0F0", "#EFEDF5", "#BCBDDC", "#9E9AC8", "#807DBA", "#6A51A3", "#3F007D"]
      };
      var DAY_LABELS_SUNDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      var DAY_LABELS_MONDAY = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      var Styles = _styled.default.div(_templateObject || (_templateObject = _taggedTemplateLiteralLoose(["\n  height: ", "px;\n  width: ", "px;\n  display: flex;\n  flex-direction: column;\n  font-family: ", ";\n  overflow: hidden;\n  position: relative;\n"])), (_ref) => {
        var height = _ref.height;
        return height;
      }, (_ref2) => {
        var width = _ref2.width;
        return width;
      }, (_ref3) => {
        var _theme$typography$fam;
        var theme = _ref3.theme;
        return ((_theme$typography$fam = theme.typography.families) == null ? void 0 : _theme$typography$fam.sansSerif) || "sans-serif";
      });
      var CalendarHeader = _styled.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteralLoose(["\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: ", "px;\n  flex-shrink: 0;\n  flex-wrap: wrap;\n  gap: ", "px;\n"])), (_ref4) => {
        var theme = _ref4.theme;
        return theme.gridUnit * 2;
      }, (_ref5) => {
        var theme = _ref5.theme;
        return theme.gridUnit;
      });
      var HeaderLeft = _styled.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteralLoose(["\n  display: flex;\n  align-items: center;\n  gap: ", "px;\n"])), (_ref6) => {
        var theme = _ref6.theme;
        return theme.gridUnit;
      });
      var HeaderCenter = _styled.default.div(_templateObject4 || (_templateObject4 = _taggedTemplateLiteralLoose(["\n  display: flex;\n  align-items: center;\n  gap: ", "px;\n"])), (_ref7) => {
        var theme = _ref7.theme;
        return theme.gridUnit * 2;
      });
      var HeaderRight = _styled.default.div(_templateObject5 || (_templateObject5 = _taggedTemplateLiteralLoose(["\n  display: flex;\n  align-items: center;\n  gap: ", "px;\n"])), (_ref8) => {
        var theme = _ref8.theme;
        return theme.gridUnit;
      });
      var NavButton = _styled.default.button(_templateObject6 || (_templateObject6 = _taggedTemplateLiteralLoose(["\n  background: none;\n  border: 1px solid ", ";\n  border-radius: ", "px;\n  cursor: pointer;\n  font-size: 16px;\n  padding: ", "px ", "px;\n  line-height: 1;\n  color: ", ";\n  transition: background 0.15s;\n\n  &:hover:not(:disabled) {\n    background: ", ";\n  }\n\n  &:disabled {\n    opacity: 0.35;\n    cursor: not-allowed;\n  }\n"])), (_ref9) => {
        var theme = _ref9.theme;
        return theme.colors.secondary.light2;
      }, (_ref0) => {
        var theme = _ref0.theme;
        return theme.gridUnit;
      }, (_ref1) => {
        var theme = _ref1.theme;
        return theme.gridUnit;
      }, (_ref10) => {
        var theme = _ref10.theme;
        return theme.gridUnit * 2;
      }, (_ref11) => {
        var theme = _ref11.theme;
        return theme.colors.primary.base;
      }, (_ref12) => {
        var theme = _ref12.theme;
        return theme.colors.secondary.light2;
      });
      var TodayButton = _styled.default.button(_templateObject7 || (_templateObject7 = _taggedTemplateLiteralLoose(["\n  background: ", ";\n  border: 1px solid ", ";\n  border-radius: ", "px;\n  cursor: pointer;\n  font-size: 11px;\n  padding: ", "px ", "px;\n  line-height: 1;\n  color: ", ";\n  transition: background 0.15s;\n\n  &:hover {\n    background: ", ";\n  }\n"])), (_ref13) => {
        var theme = _ref13.theme;
        return theme.colors.secondary.light2;
      }, (_ref14) => {
        var theme = _ref14.theme;
        return theme.colors.secondary.light2;
      }, (_ref15) => {
        var theme = _ref15.theme;
        return theme.gridUnit;
      }, (_ref16) => {
        var theme = _ref16.theme;
        return theme.gridUnit;
      }, (_ref17) => {
        var theme = _ref17.theme;
        return theme.gridUnit * 1.5;
      }, (_ref18) => {
        var theme = _ref18.theme;
        return theme.colors.primary.base;
      }, (_ref19) => {
        var theme = _ref19.theme;
        return theme.colors.secondary.light1;
      });
      var MonthTitle = _styled.default.div(_templateObject8 || (_templateObject8 = _taggedTemplateLiteralLoose(["\n  font-size: ", "px;\n  font-weight: ", ";\n  color: ", ";\n  white-space: nowrap;\n"])), (_ref20) => {
        var theme = _ref20.theme;
        return theme.typography.sizes.l;
      }, (_ref21) => {
        var theme = _ref21.theme;
        return theme.typography.weights.bold;
      }, (_ref22) => {
        var _theme$colors$graysca;
        var theme = _ref22.theme;
        return ((_theme$colors$graysca = theme.colors.grayscale) == null ? void 0 : _theme$colors$graysca.dark1) || "#333";
      });
      var SelectionBadge = _styled.default.span(_templateObject9 || (_templateObject9 = _taggedTemplateLiteralLoose(["\n  font-size: ", "px;\n  color: ", ";\n  background: ", ";\n  padding: 0 ", "px;\n  border-radius: ", "px;\n  white-space: nowrap;\n  line-height: 22px;\n"])), (_ref23) => {
        var theme = _ref23.theme;
        return theme.typography.sizes.s;
      }, (_ref24) => {
        var theme = _ref24.theme;
        return theme.colors.primary.base;
      }, (_ref25) => {
        var theme = _ref25.theme;
        return theme.colors.primary.light2;
      }, (_ref26) => {
        var theme = _ref26.theme;
        return theme.gridUnit * 1.5;
      }, (_ref27) => {
        var theme = _ref27.theme;
        return theme.gridUnit * 2;
      });
      var ClearButton = _styled.default.button(_templateObject0 || (_templateObject0 = _taggedTemplateLiteralLoose(["\n  background: none;\n  border: none;\n  cursor: pointer;\n  font-size: 11px;\n  color: ", ";\n  text-decoration: underline;\n  padding: 0;\n  line-height: 1;\n\n  &:hover {\n    color: ", ";\n  }\n"])), (_ref28) => {
        var _theme$colors$error;
        var theme = _ref28.theme;
        return ((_theme$colors$error = theme.colors.error) == null ? void 0 : _theme$colors$error.base) || "#e74c3c";
      }, (_ref29) => {
        var _theme$colors$error2;
        var theme = _ref29.theme;
        return ((_theme$colors$error2 = theme.colors.error) == null ? void 0 : _theme$colors$error2.dark1) || "#c0392b";
      });
      var YearSelect = _styled.default.select(_templateObject1 || (_templateObject1 = _taggedTemplateLiteralLoose(["\n  font-size: 12px;\n  padding: ", "px;\n  border: 1px solid ", ";\n  border-radius: ", "px;\n  background: white;\n  color: ", ";\n  cursor: pointer;\n"])), (_ref30) => {
        var theme = _ref30.theme;
        return theme.gridUnit;
      }, (_ref31) => {
        var theme = _ref31.theme;
        return theme.colors.secondary.light2;
      }, (_ref32) => {
        var theme = _ref32.theme;
        return theme.gridUnit;
      }, (_ref33) => {
        var _theme$colors$graysca2;
        var theme = _ref33.theme;
        return ((_theme$colors$graysca2 = theme.colors.grayscale) == null ? void 0 : _theme$colors$graysca2.dark1) || "#333";
      });
      var ViewToggleButton = _styled.default.button(_templateObject10 || (_templateObject10 = _taggedTemplateLiteralLoose(["\n  background: none;\n  border: 1px solid ", ";\n  border-radius: ", "px;\n  cursor: pointer;\n  font-size: 11px;\n  padding: ", "px ", "px;\n  line-height: 1;\n  color: ", ";\n  transition: background 0.15s;\n  white-space: nowrap;\n\n  &:hover {\n    background: ", ";\n  }\n"])), (_ref34) => {
        var theme = _ref34.theme;
        return theme.colors.secondary.light2;
      }, (_ref35) => {
        var theme = _ref35.theme;
        return theme.gridUnit;
      }, (_ref36) => {
        var theme = _ref36.theme;
        return theme.gridUnit;
      }, (_ref37) => {
        var theme = _ref37.theme;
        return theme.gridUnit * 1.5;
      }, (_ref38) => {
        var theme = _ref38.theme;
        return theme.colors.primary.base;
      }, (_ref39) => {
        var theme = _ref39.theme;
        return theme.colors.secondary.light2;
      });
      var CalendarGrid = _styled.default.div(_templateObject11 || (_templateObject11 = _taggedTemplateLiteralLoose(["\n  display: grid;\n  grid-template-columns: ", ";\n  gap: 2px;\n  padding: 0 ", "px ", "px;\n  flex: 1;\n  align-content: start;\n"])), (_ref40) => {
        var showWeekNumbers = _ref40.showWeekNumbers;
        return showWeekNumbers ? "30px repeat(7, 1fr)" : "repeat(7, 1fr)";
      }, (_ref41) => {
        var theme = _ref41.theme;
        return theme.gridUnit * 2;
      }, (_ref42) => {
        var theme = _ref42.theme;
        return theme.gridUnit * 2;
      });
      var DayHeader = _styled.default.div(_templateObject12 || (_templateObject12 = _taggedTemplateLiteralLoose(["\n  text-align: center;\n  font-size: ", "px;\n  font-weight: ", ";\n  color: ", ";\n  padding: ", "px 0;\n  text-transform: uppercase;\n"])), (_ref43) => {
        var theme = _ref43.theme;
        return theme.typography.sizes.xs;
      }, (_ref44) => {
        var theme = _ref44.theme;
        return theme.typography.weights.bold;
      }, (_ref45) => {
        var _theme$colors$graysca3;
        var theme = _ref45.theme;
        return ((_theme$colors$graysca3 = theme.colors.grayscale) == null ? void 0 : _theme$colors$graysca3.base) || "#666";
      }, (_ref46) => {
        var theme = _ref46.theme;
        return theme.gridUnit;
      });
      var WeekNumberCell = _styled.default.div(_templateObject13 || (_templateObject13 = _taggedTemplateLiteralLoose(["\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 10px;\n  color: ", ";\n  font-weight: ", ";\n"])), (_ref47) => {
        var _theme$colors$graysca4;
        var theme = _ref47.theme;
        return ((_theme$colors$graysca4 = theme.colors.grayscale) == null ? void 0 : _theme$colors$graysca4.light1) || "#bbb";
      }, (_ref48) => {
        var theme = _ref48.theme;
        return theme.typography.weights.bold;
      });
      var DayCell = _styled.default.div(_templateObject14 || (_templateObject14 = _taggedTemplateLiteralLoose(["\n  aspect-ratio: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: ", "px;\n  font-size: ", "px;\n  cursor: ", ";\n  opacity: ", ";\n  transition: all 0.15s ease;\n  position: relative;\n  user-select: none;\n\n  background-color: ", ";\n\n  ", "\n\n  &:hover {\n    transform: ", ";\n    z-index: 1;\n  }\n"])), (_ref49) => {
        var theme = _ref49.theme;
        return theme.gridUnit;
      }, (_ref50) => {
        var theme = _ref50.theme;
        return theme.typography.sizes.xs;
      }, (_ref51) => {
        var isCurrentMonth = _ref51.isCurrentMonth;
        return isCurrentMonth ? "pointer" : "default";
      }, (_ref52) => {
        var isCurrentMonth = _ref52.isCurrentMonth;
        return isCurrentMonth ? 1 : 0.3;
      }, (_ref53) => {
        var intensity = _ref53.intensity, baseColor = _ref53.baseColor;
        if (intensity === 0) return "#f8f9fa";
        var r = parseInt(baseColor.slice(1, 3), 16);
        var g = parseInt(baseColor.slice(3, 5), 16);
        var b = parseInt(baseColor.slice(5, 7), 16);
        var mix = (c1, c2, t) => Math.round(c1 + (c2 - c1) * t);
        var white = 248;
        return "rgb(" + mix(white, r, intensity) + ", " + mix(white, g, intensity) + ", " + mix(white, b, intensity) + ")";
      }, (_ref54) => {
        var isSelected = _ref54.isSelected, baseColor = _ref54.baseColor;
        return isSelected ? "\n    box-shadow: 0 0 0 2px white, 0 0 0 4px " + baseColor + ";\n    font-weight: bold;\n    " : "";
      }, (_ref55) => {
        var isCurrentMonth = _ref55.isCurrentMonth;
        return isCurrentMonth ? "scale(1.15)" : "none";
      });
      var DayNumber = _styled.default.span(_templateObject15 || (_templateObject15 = _taggedTemplateLiteralLoose(["\n  font-size: ", "px;\n  pointer-events: none;\n  line-height: 1;\n"])), (_ref56) => {
        var theme = _ref56.theme;
        return theme.typography.sizes.xs;
      });
      var TooltipContainer = _styled.default.div(_templateObject16 || (_templateObject16 = _taggedTemplateLiteralLoose(["\n  position: absolute;\n  left: ", "px;\n  top: ", "px;\n  background: rgba(0, 0, 0, 0.85);\n  color: white;\n  border-radius: 6px;\n  padding: 8px 12px;\n  font-size: 12px;\n  pointer-events: none;\n  z-index: 1000;\n  white-space: nowrap;\n  line-height: 1.5;\n  font-family: ", ";\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);\n"])), (_ref57) => {
        var x = _ref57.x;
        return Math.min(x, window.innerWidth - 200);
      }, (_ref58) => {
        var y = _ref58.y;
        return Math.max(y - 40, 0);
      }, (_ref59) => {
        var _theme$typography$fam2;
        var theme = _ref59.theme;
        return ((_theme$typography$fam2 = theme.typography.families) == null ? void 0 : _theme$typography$fam2.sansSerif) || "sans-serif";
      });
      var TooltipTitle = _styled.default.div(_templateObject17 || (_templateObject17 = _taggedTemplateLiteralLoose(["\n  font-weight: bold;\n  margin-bottom: 2px;\n"])));
      var TooltipRow = _styled.default.div(_templateObject18 || (_templateObject18 = _taggedTemplateLiteralLoose(["\n  display: flex;\n  justify-content: space-between;\n  gap: 12px;\n"])));
      var TooltipLabel = _styled.default.span(_templateObject19 || (_templateObject19 = _taggedTemplateLiteralLoose(["\n  color: rgba(255, 255, 255, 0.7);\n"])));
      var TooltipValue = _styled.default.span(_templateObject20 || (_templateObject20 = _taggedTemplateLiteralLoose(["\n  font-weight: 600;\n"])));
      var LegendContainer = _styled.default.div(_templateObject21 || (_templateObject21 = _taggedTemplateLiteralLoose(["\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: ", "px;\n  padding: ", "px;\n  flex-shrink: 0;\n"])), (_ref60) => {
        var theme = _ref60.theme;
        return theme.gridUnit;
      }, (_ref61) => {
        var theme = _ref61.theme;
        return theme.gridUnit * 2;
      });
      var LegendGradient = _styled.default.div(_templateObject22 || (_templateObject22 = _taggedTemplateLiteralLoose(["\n  width: 120px;\n  height: 12px;\n  border-radius: ", "px;\n"])), (_ref62) => {
        var theme = _ref62.theme;
        return theme.gridUnit;
      });
      var LegendLabel = _styled.default.span(_templateObject23 || (_templateObject23 = _taggedTemplateLiteralLoose(["\n  font-size: ", "px;\n  color: ", ";\n"])), (_ref63) => {
        var theme = _ref63.theme;
        return theme.typography.sizes.xs;
      }, (_ref64) => {
        var _theme$colors$graysca5;
        var theme = _ref64.theme;
        return ((_theme$colors$graysca5 = theme.colors.grayscale) == null ? void 0 : _theme$colors$graysca5.base) || "#666";
      });
      var EmptyState = _styled.default.div(_templateObject24 || (_templateObject24 = _taggedTemplateLiteralLoose(["\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n  color: ", ";\n  font-size: ", "px;\n"])), (_ref65) => {
        var _theme$colors$graysca6;
        var theme = _ref65.theme;
        return ((_theme$colors$graysca6 = theme.colors.grayscale) == null ? void 0 : _theme$colors$graysca6.light1) || "#999";
      }, (_ref66) => {
        var theme = _ref66.theme;
        return theme.typography.sizes.m;
      });
      var YearOverviewGrid = _styled.default.div(_templateObject25 || (_templateObject25 = _taggedTemplateLiteralLoose(["\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: ", "px;\n  padding: ", "px;\n  flex: 1;\n  overflow-y: auto;\n"])), (_ref67) => {
        var theme = _ref67.theme;
        return theme.gridUnit * 3;
      }, (_ref68) => {
        var theme = _ref68.theme;
        return theme.gridUnit * 2;
      });
      var MiniMonth = _styled.default.div(_templateObject26 || (_templateObject26 = _taggedTemplateLiteralLoose(["\n  display: flex;\n  flex-direction: column;\n"])));
      var MiniMonthTitle = _styled.default.div(_templateObject27 || (_templateObject27 = _taggedTemplateLiteralLoose(["\n  text-align: center;\n  font-size: 11px;\n  font-weight: ", ";\n  color: ", ";\n  margin-bottom: ", "px;\n"])), (_ref69) => {
        var theme = _ref69.theme;
        return theme.typography.weights.bold;
      }, (_ref70) => {
        var _theme$colors$graysca7;
        var theme = _ref70.theme;
        return ((_theme$colors$graysca7 = theme.colors.grayscale) == null ? void 0 : _theme$colors$graysca7.dark1) || "#333";
      }, (_ref71) => {
        var theme = _ref71.theme;
        return theme.gridUnit;
      });
      var MiniMonthGrid = _styled.default.div(_templateObject28 || (_templateObject28 = _taggedTemplateLiteralLoose(["\n  display: grid;\n  grid-template-columns: ", ";\n  gap: 1px;\n"])), (_ref72) => {
        var showWeekNumbers = _ref72.showWeekNumbers;
        return showWeekNumbers ? "18px repeat(7, 1fr)" : "repeat(7, 1fr)";
      });
      var MiniDayHeader = _styled.default.div(_templateObject29 || (_templateObject29 = _taggedTemplateLiteralLoose(["\n  text-align: center;\n  font-size: 7px;\n  font-weight: bold;\n  color: ", ";\n  text-transform: uppercase;\n"])), (_ref73) => {
        var _theme$colors$graysca8;
        var theme = _ref73.theme;
        return ((_theme$colors$graysca8 = theme.colors.grayscale) == null ? void 0 : _theme$colors$graysca8.base) || "#666";
      });
      var MiniWeekNum = _styled.default.div(_templateObject30 || (_templateObject30 = _taggedTemplateLiteralLoose(["\n  font-size: 7px;\n  color: ", ";\n  display: flex;\n  align-items: center;\n  justify-content: center;\n"])), (_ref74) => {
        var _theme$colors$graysca9;
        var theme = _ref74.theme;
        return ((_theme$colors$graysca9 = theme.colors.grayscale) == null ? void 0 : _theme$colors$graysca9.light1) || "#bbb";
      });
      var MiniDayCell = _styled.default.div(_templateObject31 || (_templateObject31 = _taggedTemplateLiteralLoose(["\n  aspect-ratio: 1;\n  border-radius: 2px;\n  cursor: pointer;\n  transition: all 0.1s ease;\n\n  background-color: ", ";\n\n  ", "\n\n  &:hover {\n    transform: scale(1.3);\n    z-index: 1;\n  }\n"])), (_ref75) => {
        var intensity = _ref75.intensity, baseColor = _ref75.baseColor;
        if (intensity === 0) return "#f8f9fa";
        var r = parseInt(baseColor.slice(1, 3), 16);
        var g = parseInt(baseColor.slice(3, 5), 16);
        var b = parseInt(baseColor.slice(5, 7), 16);
        var mix = (c1, c2, t) => Math.round(c1 + (c2 - c1) * t);
        var white = 248;
        return "rgb(" + mix(white, r, intensity) + ", " + mix(white, g, intensity) + ", " + mix(white, b, intensity) + ")";
      }, (_ref76) => {
        var isSelected = _ref76.isSelected, baseColor = _ref76.baseColor;
        return isSelected ? "box-shadow: 0 0 0 1.5px white, 0 0 0 3px " + baseColor + ";" : "";
      });
      function parseDateValue(val) {
        if (!val) return null;
        if (val instanceof Date) return val;
        if (typeof val === "number") return new Date(val);
        var d = new Date(String(val));
        return Number.isNaN(d.getTime()) ? null : d;
      }
      function formatDateKey(d) {
        var y = d.getFullYear();
        var m = String(d.getMonth() + 1).padStart(2, "0");
        var day = String(d.getDate()).padStart(2, "0");
        return y + "-" + m + "-" + day;
      }
      function getFirstDayOfMonth(year, month, firstDayOfWeek) {
        var raw = new Date(year, month - 1, 1).getDay();
        return (raw - firstDayOfWeek + 7) % 7;
      }
      function getDaysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
      }
      function getISOWeekNumber(d) {
        var temp = new Date(d.valueOf());
        var dayNum = (d.getDay() + 6) % 7;
        temp.setDate(temp.getDate() - dayNum + 3);
        var firstThursday = temp.valueOf();
        temp.setMonth(0, 1);
        if (temp.getDay() !== 4) {
          temp.setMonth(0, 1 + (4 - temp.getDay() + 7) % 7);
        }
        return 1 + Math.ceil((firstThursday - temp.valueOf()) / 6048e5);
      }
      function getBaseColor(paletteName) {
        var palette = COLOR_PALETTES[paletteName];
        return palette ? palette[palette.length - 1] : COLOR_PALETTES.supersetColors[COLOR_PALETTES.supersetColors.length - 1];
      }
      function getDatesBetween(start, end) {
        var dates = [];
        var current = new Date(start);
        var endDate = new Date(end);
        var step = current <= endDate ? 1 : -1;
        while (step > 0 ? current <= endDate : current >= endDate) {
          dates.push(formatDateKey(current));
          current.setDate(current.getDate() + step);
        }
        return dates;
      }
      function CalendarFilter(props) {
        var _tooltip$value$toLoca, _tooltip$value;
        var data = props.data, height = props.height, width = props.width, _props$colorScheme = props.colorScheme, colorScheme = _props$colorScheme === void 0 ? "supersetColors" : _props$colorScheme, _props$showLegend = props.showLegend, showLegend = _props$showLegend === void 0 ? true : _props$showLegend, _props$firstDayOfWeek = props.firstDayOfWeek, firstDayOfWeek = _props$firstDayOfWeek === void 0 ? 0 : _props$firstDayOfWeek, _props$showWeekNumber = props.showWeekNumbers, showWeekNumbers = _props$showWeekNumber === void 0 ? false : _props$showWeekNumber, _props$showYearDropdo = props.showYearDropdown, showYearDropdown = _props$showYearDropdo === void 0 ? true : _props$showYearDropdo, _props$enableOverview = props.enableOverview, enableOverview = _props$enableOverview === void 0 ? true : _props$enableOverview, setDataMask = props.setDataMask, filterState = props.filterState;
        var containerRef = (0, _react.useRef)(null);
        var today = (0, _react.useMemo)(() => /* @__PURE__ */ new Date(), []);
        var _useState = (0, _react.useState)(today.getFullYear()), viewYear = _useState[0], setViewYear = _useState[1];
        var _useState2 = (0, _react.useState)(today.getMonth() + 1), viewMonth = _useState2[0], setViewMonth = _useState2[1];
        var _useState3 = (0, _react.useState)("month"), viewMode = _useState3[0], setViewMode = _useState3[1];
        var _useState4 = (0, _react.useState)(null), tooltip = _useState4[0], setTooltip = _useState4[1];
        var _useState5 = (0, _react.useState)(null), lastClickedDate = _useState5[0], setLastClickedDate = _useState5[1];
        var dayLabels = firstDayOfWeek === 0 ? DAY_LABELS_SUNDAY : DAY_LABELS_MONDAY;
        var dataMap = (0, _react.useMemo)(() => {
          if (!data || data.length === 0) return {
            map: /* @__PURE__ */ new Map(),
            min: 0,
            max: 0,
            hasData: false,
            minDate: null,
            maxDate: null
          };
          var map = /* @__PURE__ */ new Map();
          var min = Infinity;
          var max = -Infinity;
          var minDate = null;
          var maxDate = null;
          var firstRow = data[0];
          var keys = Object.keys(firstRow);
          var dateKey = keys.find((k) => {
            var val = firstRow[k];
            return val && (typeof val === "string" || typeof val === "number" || val instanceof Date) && !Number.isNaN(new Date(String(val)).getTime());
          });
          var metricKey = keys.find((k) => k !== dateKey && typeof firstRow[k] === "number");
          data.forEach((row) => {
            var r = row;
            var dateVal = dateKey ? r[dateKey] : null;
            var metricVal = metricKey ? Number(r[metricKey]) : 0;
            var d = parseDateValue(dateVal);
            if (d && metricVal != null && !Number.isNaN(metricVal)) {
              var key = formatDateKey(d);
              map.set(key, metricVal);
              if (metricVal < min) min = metricVal;
              if (metricVal > max) max = metricVal;
              if (minDate === null || key < minDate) minDate = key;
              if (maxDate === null || key > maxDate) maxDate = key;
            }
          });
          return {
            map,
            min,
            max,
            hasData: map.size > 0,
            minDate,
            maxDate
          };
        }, [data]);
        var selectedDates = (0, _react.useMemo)(() => {
          if (filterState != null && filterState.selectedValues) {
            return new Set(Object.keys(filterState.selectedValues));
          }
          if (filterState != null && filterState.value) {
            var vals = Array.isArray(filterState.value) ? filterState.value : [filterState.value];
            return new Set(vals.map(String));
          }
          return /* @__PURE__ */ new Set();
        }, [filterState]);
        var _useMemo = (0, _react.useMemo)(() => {
          if (!dataMap.minDate || !dataMap.maxDate) {
            return {
              minDateBound: null,
              maxDateBound: null
            };
          }
          return {
            minDateBound: dataMap.minDate,
            maxDateBound: dataMap.maxDate
          };
        }, [dataMap.minDate, dataMap.maxDate]), minDateBound = _useMemo.minDateBound, maxDateBound = _useMemo.maxDateBound;
        var availableYears = (0, _react.useMemo)(() => {
          if (!minDateBound || !maxDateBound) {
            var y = today.getFullYear();
            return [y - 2, y - 1, y, y + 1, y + 2];
          }
          var minY = new Date(minDateBound).getFullYear();
          var maxY = new Date(maxDateBound).getFullYear();
          var years = [];
          for (var _y = minY; _y <= maxY; _y++) years.push(_y);
          return years;
        }, [minDateBound, maxDateBound, today]);
        var isPrevDisabled = (0, _react.useMemo)(() => {
          if (!minDateBound) return false;
          if (viewMode === "year") {
            return viewYear <= new Date(minDateBound).getFullYear();
          }
          var firstOfMonth = viewYear + "-" + String(viewMonth).padStart(2, "0") + "-01";
          return firstOfMonth <= minDateBound;
        }, [minDateBound, viewYear, viewMonth, viewMode]);
        var isNextDisabled = (0, _react.useMemo)(() => {
          if (!maxDateBound) return false;
          if (viewMode === "year") {
            return viewYear >= new Date(maxDateBound).getFullYear();
          }
          var lastOfMonth = viewYear + "-" + String(viewMonth).padStart(2, "0") + "-" + String(getDaysInMonth(viewYear, viewMonth)).padStart(2, "0");
          return lastOfMonth >= maxDateBound;
        }, [maxDateBound, viewYear, viewMonth, viewMode]);
        var calendarCells = (0, _react.useMemo)(() => {
          var daysInMonth = getDaysInMonth(viewYear, viewMonth);
          var firstDay = getFirstDayOfMonth(viewYear, viewMonth, firstDayOfWeek);
          var totalCells = Math.ceil((daysInMonth + firstDay) / 7) * 7;
          var cells = [];
          for (var i = 0; i < firstDay; i++) {
            cells.push(null);
          }
          for (var day = 1; day <= daysInMonth; day++) {
            var _dataMap$map$get;
            var dateStr = viewYear + "-" + String(viewMonth).padStart(2, "0") + "-" + String(day).padStart(2, "0");
            var value = (_dataMap$map$get = dataMap.map.get(dateStr)) != null ? _dataMap$map$get : null;
            cells.push({
              date: dateStr,
              value,
              hasData: value !== null
            });
          }
          while (cells.length < totalCells) {
            cells.push(null);
          }
          return cells;
        }, [viewYear, viewMonth, dataMap, firstDayOfWeek]);
        var weekRows = (0, _react.useMemo)(() => {
          if (!showWeekNumbers) return [];
          var rows = [];
          for (var i = 0; i < calendarCells.length; i += 7) {
            var weekCells = calendarCells.slice(i, i + 7);
            var firstRealCell = weekCells.find((c) => c !== null);
            var weekNumber = 1;
            if (firstRealCell) {
              weekNumber = getISOWeekNumber(new Date(firstRealCell.date));
            }
            rows.push({
              weekNumber,
              cells: weekCells,
              startIndex: i,
              endIndex: i + 6
            });
          }
          return rows;
        }, [calendarCells, showWeekNumbers]);
        var _useMemo2 = (0, _react.useMemo)(() => {
          var base = getBaseColor(colorScheme);
          var range = dataMap.max - dataMap.min;
          return {
            baseColor: base,
            intensityScale: (val) => {
              if (val == null || range === 0) return 0;
              return (val - dataMap.min) / range;
            }
          };
        }, [colorScheme, dataMap.min, dataMap.max]), intensityScale = _useMemo2.intensityScale, baseColor = _useMemo2.baseColor;
        var goPrevMonth = (0, _react.useCallback)(() => {
          if (viewMode === "year") {
            setViewYear((y) => y - 1);
            return;
          }
          if (viewMonth === 1) {
            setViewYear(viewYear - 1);
            setViewMonth(12);
          } else {
            setViewMonth(viewMonth - 1);
          }
        }, [viewMonth, viewYear, viewMode]);
        var goNextMonth = (0, _react.useCallback)(() => {
          if (viewMode === "year") {
            setViewYear((y) => y + 1);
            return;
          }
          if (viewMonth === 12) {
            setViewYear(viewYear + 1);
            setViewMonth(1);
          } else {
            setViewMonth(viewMonth + 1);
          }
        }, [viewMonth, viewYear, viewMode]);
        var goToToday = (0, _react.useCallback)(() => {
          var now = /* @__PURE__ */ new Date();
          setViewYear(now.getFullYear());
          setViewMonth(now.getMonth() + 1);
        }, []);
        var handleDayClick = (0, _react.useCallback)((day, event) => {
          if (!setDataMask) return;
          var dateStr = day.date;
          var newSelected = new Set(selectedDates);
          if (event != null && event.shiftKey && lastClickedDate) {
            var range = getDatesBetween(lastClickedDate, dateStr);
            range.forEach((d) => {
              if (dataMap.map.has(d)) {
                newSelected.add(d);
              } else {
                newSelected.add(d);
              }
            });
          } else {
            if (newSelected.has(dateStr)) {
              newSelected.delete(dateStr);
            } else {
              newSelected.add(dateStr);
            }
          }
          setLastClickedDate(dateStr);
          var selectedArray = Array.from(newSelected).sort();
          setDataMask({
            extraFormData: {
              filters: selectedArray.length ? [{
                col: "__time_range",
                op: "IN",
                val: selectedArray
              }] : []
            },
            filterState: {
              value: selectedArray.length ? selectedArray : null,
              selectedValues: selectedArray.length ? selectedArray.reduce((acc, date) => _extends2({}, acc, {
                [date]: date
              }), {}) : null
            }
          });
        }, [setDataMask, selectedDates, lastClickedDate, dataMap.map]);
        var clearSelection = (0, _react.useCallback)(() => {
          if (!setDataMask) return;
          setLastClickedDate(null);
          setDataMask({
            extraFormData: {
              filters: []
            },
            filterState: {
              value: null,
              selectedValues: null
            }
          });
        }, [setDataMask]);
        var monthLabel = (0, _react.useMemo)(() => {
          var date = new Date(viewYear, viewMonth - 1, 1);
          return date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
          });
        }, [viewYear, viewMonth]);
        var selectionCount = selectedDates.size;
        var legendGradient = (0, _react.useMemo)(() => {
          var palette = COLOR_PALETTES[colorScheme] || COLOR_PALETTES.supersetColors;
          var stops = palette.slice(1).map((color, i) => {
            var pct = Math.round(i / (palette.length - 2) * 100);
            return color + " " + pct + "%";
          });
          return "linear-gradient(to right, " + stops.join(", ") + ")";
        }, [colorScheme]);
        var handleMouseEnter = (0, _react.useCallback)((cell, event) => {
          var _containerRef$current, _cell$value;
          if (!cell.hasData) {
            setTooltip(null);
            return;
          }
          var rect = event.currentTarget.getBoundingClientRect();
          var containerRect = (_containerRef$current = containerRef.current) == null ? void 0 : _containerRef$current.getBoundingClientRect();
          var relX = rect.left - ((containerRect == null ? void 0 : containerRect.left) || 0) + rect.width / 2;
          var relY = rect.top - ((containerRect == null ? void 0 : containerRect.top) || 0);
          var pct = dataMap.max > dataMap.min ? (((_cell$value = cell.value) != null ? _cell$value : 0) - dataMap.min) / (dataMap.max - dataMap.min) * 100 : 0;
          setTooltip({
            date: cell.date,
            value: cell.value,
            percentage: Math.round(pct),
            x: relX,
            y: relY
          });
        }, [dataMap]);
        var handleMouseLeave = (0, _react.useCallback)(() => {
          setTooltip(null);
        }, []);
        var yearOverviewMonths = (0, _react.useMemo)(() => {
          if (viewMode !== "year") return [];
          var months = [];
          for (var m = 1; m <= 12; m++) {
            var daysInMonth = getDaysInMonth(viewYear, m);
            var firstDay = getFirstDayOfMonth(viewYear, m, firstDayOfWeek);
            var totalCells = Math.ceil((daysInMonth + firstDay) / 7) * 7;
            var cells = [];
            for (var i = 0; i < firstDay; i++) cells.push(null);
            for (var day = 1; day <= daysInMonth; day++) {
              var _dataMap$map$get2;
              var dateStr = viewYear + "-" + String(m).padStart(2, "0") + "-" + String(day).padStart(2, "0");
              var value = (_dataMap$map$get2 = dataMap.map.get(dateStr)) != null ? _dataMap$map$get2 : null;
              cells.push({
                date: dateStr,
                value,
                hasData: value !== null
              });
            }
            while (cells.length < totalCells) cells.push(null);
            var wRows = [];
            if (showWeekNumbers) {
              for (var _i = 0; _i < cells.length; _i += 7) {
                var weekCells = cells.slice(_i, _i + 7);
                var firstReal = weekCells.find((c) => c !== null);
                var wn = 1;
                if (firstReal) wn = getISOWeekNumber(new Date(firstReal.date));
                wRows.push({
                  weekNumber: wn,
                  cells: weekCells
                });
              }
            }
            var label = new Date(viewYear, m - 1, 1).toLocaleDateString("en-US", {
              month: "short"
            });
            months.push({
              month: m,
              label,
              cells,
              weekRows: wRows
            });
          }
          return months;
        }, [viewYear, viewMode, dataMap, firstDayOfWeek, showWeekNumbers]);
        var handleMiniDayClick = (0, _react.useCallback)((dateStr) => {
          if (!setDataMask) return;
          var newSelected = new Set(selectedDates);
          if (newSelected.has(dateStr)) {
            newSelected.delete(dateStr);
          } else {
            newSelected.add(dateStr);
          }
          var selectedArray = Array.from(newSelected).sort();
          setDataMask({
            extraFormData: {
              filters: selectedArray.length ? [{
                col: "__time_range",
                op: "IN",
                val: selectedArray
              }] : []
            },
            filterState: {
              value: selectedArray.length ? selectedArray : null,
              selectedValues: selectedArray.length ? selectedArray.reduce((acc, date) => _extends2({}, acc, {
                [date]: date
              }), {}) : null
            }
          });
        }, [setDataMask, selectedDates]);
        if (!data || data.length === 0) {
          return /* @__PURE__ */ _react.default.createElement(Styles, {
            height,
            width
          }, /* @__PURE__ */ _react.default.createElement(EmptyState, null, "No data available"));
        }
        return /* @__PURE__ */ _react.default.createElement(Styles, {
          height,
          width,
          ref: containerRef
        }, /* @__PURE__ */ _react.default.createElement(CalendarHeader, null, /* @__PURE__ */ _react.default.createElement(HeaderLeft, null, /* @__PURE__ */ _react.default.createElement(NavButton, {
          onClick: goPrevMonth,
          type: "button",
          "aria-label": "Previous",
          disabled: isPrevDisabled,
          title: isPrevDisabled ? "No data before this date" : "Previous"
        }, "\u2039"), showYearDropdown && /* @__PURE__ */ _react.default.createElement(YearSelect, {
          value: viewYear,
          onChange: (e) => setViewYear(Number(e.target.value)),
          "aria-label": "Select year"
        }, availableYears.map((y) => /* @__PURE__ */ _react.default.createElement("option", {
          key: y,
          value: y
        }, y))), enableOverview && /* @__PURE__ */ _react.default.createElement(ViewToggleButton, {
          type: "button",
          onClick: () => setViewMode(viewMode === "month" ? "year" : "month")
        }, viewMode === "month" ? "Year" : "Month")), /* @__PURE__ */ _react.default.createElement(HeaderCenter, null, /* @__PURE__ */ _react.default.createElement(MonthTitle, null, viewMode === "year" ? viewYear : monthLabel), selectionCount > 0 && /* @__PURE__ */ _react.default.createElement(_react.default.Fragment, null, /* @__PURE__ */ _react.default.createElement(SelectionBadge, null, selectionCount, " selected"), /* @__PURE__ */ _react.default.createElement(ClearButton, {
          type: "button",
          onClick: clearSelection
        }, "Clear"))), /* @__PURE__ */ _react.default.createElement(HeaderRight, null, /* @__PURE__ */ _react.default.createElement(TodayButton, {
          type: "button",
          onClick: goToToday
        }, "Today"), /* @__PURE__ */ _react.default.createElement(NavButton, {
          onClick: goNextMonth,
          type: "button",
          "aria-label": "Next",
          disabled: isNextDisabled,
          title: isNextDisabled ? "No data after this date" : "Next"
        }, "\u203A"))), viewMode === "year" ? /* @__PURE__ */ _react.default.createElement(YearOverviewGrid, null, yearOverviewMonths.map((m) => /* @__PURE__ */ _react.default.createElement(MiniMonth, {
          key: m.month
        }, /* @__PURE__ */ _react.default.createElement(MiniMonthTitle, null, m.label), /* @__PURE__ */ _react.default.createElement(MiniMonthGrid, {
          showWeekNumbers
        }, dayLabels.map((d) => /* @__PURE__ */ _react.default.createElement(MiniDayHeader, {
          key: d
        }, d[0])), showWeekNumbers && m.weekRows.map((wr, wi) => /* @__PURE__ */ _react.default.createElement(_react.default.Fragment, {
          key: "wr-" + wi
        }, /* @__PURE__ */ _react.default.createElement(MiniWeekNum, null, wr.weekNumber), wr.cells.map((cell, ci) => {
          if (!cell) return /* @__PURE__ */ _react.default.createElement("div", {
            key: "e-" + wi + "-" + ci
          });
          return /* @__PURE__ */ _react.default.createElement(MiniDayCell, {
            key: cell.date,
            intensity: intensityScale(cell.value),
            isSelected: selectedDates.has(cell.date),
            baseColor,
            onClick: () => handleMiniDayClick(cell.date),
            title: "" + cell.date + (cell.value != null ? ": " + cell.value : "")
          });
        }))), !showWeekNumbers && m.cells.map((cell, ci) => {
          if (!cell) return /* @__PURE__ */ _react.default.createElement("div", {
            key: "e-" + m.month + "-" + ci
          });
          return /* @__PURE__ */ _react.default.createElement(MiniDayCell, {
            key: cell.date,
            intensity: intensityScale(cell.value),
            isSelected: selectedDates.has(cell.date),
            baseColor,
            onClick: () => handleMiniDayClick(cell.date),
            title: "" + cell.date + (cell.value != null ? ": " + cell.value : "")
          });
        }))))) : /* @__PURE__ */ _react.default.createElement(_react.default.Fragment, null, /* @__PURE__ */ _react.default.createElement(CalendarGrid, {
          showWeekNumbers
        }, showWeekNumbers && /* @__PURE__ */ _react.default.createElement("div", null), dayLabels.map((day) => /* @__PURE__ */ _react.default.createElement(DayHeader, {
          key: day
        }, day)), showWeekNumbers ? weekRows.map((row, rowIdx) => /* @__PURE__ */ _react.default.createElement(_react.default.Fragment, {
          key: "row-" + rowIdx
        }, /* @__PURE__ */ _react.default.createElement(WeekNumberCell, null, row.weekNumber), row.cells.map((cell, cellIdx) => {
          if (!cell) {
            return /* @__PURE__ */ _react.default.createElement("div", {
              key: "e-" + rowIdx + "-" + cellIdx
            });
          }
          return /* @__PURE__ */ _react.default.createElement(DayCell, {
            key: cell.date,
            intensity: intensityScale(cell.value),
            isSelected: selectedDates.has(cell.date),
            isCurrentMonth: true,
            baseColor,
            onClick: (e) => handleDayClick(cell, e),
            onMouseEnter: (e) => handleMouseEnter(cell, e),
            onMouseLeave: handleMouseLeave,
            title: ""
          }, /* @__PURE__ */ _react.default.createElement(DayNumber, null, cell.date.split("-")[2]));
        }))) : calendarCells.map((cell, idx) => {
          if (!cell) {
            return /* @__PURE__ */ _react.default.createElement("div", {
              key: "empty-" + idx
            });
          }
          return /* @__PURE__ */ _react.default.createElement(DayCell, {
            key: cell.date,
            intensity: intensityScale(cell.value),
            isSelected: selectedDates.has(cell.date),
            isCurrentMonth: true,
            baseColor,
            onClick: (e) => handleDayClick(cell, e),
            onMouseEnter: (e) => handleMouseEnter(cell, e),
            onMouseLeave: handleMouseLeave,
            title: ""
          }, /* @__PURE__ */ _react.default.createElement(DayNumber, null, cell.date.split("-")[2]));
        })), tooltip && /* @__PURE__ */ _react.default.createElement(TooltipContainer, {
          x: tooltip.x,
          y: tooltip.y
        }, /* @__PURE__ */ _react.default.createElement(TooltipTitle, null, tooltip.date), /* @__PURE__ */ _react.default.createElement(TooltipRow, null, /* @__PURE__ */ _react.default.createElement(TooltipLabel, null, "Value:"), /* @__PURE__ */ _react.default.createElement(TooltipValue, null, (_tooltip$value$toLoca = (_tooltip$value = tooltip.value) == null ? void 0 : _tooltip$value.toLocaleString()) != null ? _tooltip$value$toLoca : "N/A")), /* @__PURE__ */ _react.default.createElement(TooltipRow, null, /* @__PURE__ */ _react.default.createElement(TooltipLabel, null, "Max:"), /* @__PURE__ */ _react.default.createElement(TooltipValue, null, dataMap.max.toLocaleString())), /* @__PURE__ */ _react.default.createElement(TooltipRow, null, /* @__PURE__ */ _react.default.createElement(TooltipLabel, null, "% of max:"), /* @__PURE__ */ _react.default.createElement(TooltipValue, null, tooltip.percentage, "%")))), showLegend && dataMap.hasData && viewMode === "month" && /* @__PURE__ */ _react.default.createElement(LegendContainer, null, /* @__PURE__ */ _react.default.createElement(LegendLabel, null, dataMap.min.toFixed(1)), /* @__PURE__ */ _react.default.createElement(LegendGradient, {
          style: {
            background: legendGradient
          }
        }), /* @__PURE__ */ _react.default.createElement(LegendLabel, null, dataMap.max.toFixed(1))));
      }
    }
  });
  return require_CalendarFilter();
})();
/*! Bundled license information:

react-is/cjs/react-is.development.js:
  (** @license React v16.13.1
   * react-is.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
