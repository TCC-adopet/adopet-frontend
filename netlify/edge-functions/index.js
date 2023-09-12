// dist/index.mjs
var pageResponseInit = {
  status: 200,
  headers: { "content-type": "text/html;charset=UTF-8" }
};
function pageResponse(template, input) {
  return new Response(template.stream(input), pageResponseInit);
}
var NotHandled = Symbol();
var NotMatched = Symbol();
globalThis.MarkoRun ?? (globalThis.MarkoRun = {
  NotHandled,
  NotMatched,
  route(handler) {
    return handler;
  }
});
var serializedGlobals = { params: true, url: true };
function createContext(route, request, platform, url = new URL(request.url)) {
  const context = route ? {
    request,
    url,
    platform,
    meta: route.meta,
    params: route.params,
    route: route.path,
    serializedGlobals
  } : {
    request,
    url,
    platform,
    meta: {},
    params: {},
    route: "",
    serializedGlobals
  };
  let input;
  return [
    context,
    (data) => {
      input ?? (input = {
        $global: context
      });
      return data ? Object.assign(input, data) : input;
    }
  ];
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var encoder = new TextEncoder();
var noop$2 = function() {
};
var indexBrowser = function(data) {
  var transformStream = new TransformStream();
  var writer = transformStream.writable.getWriter();
  var facade = {
    write: function(string) {
      writer.write(encoder.encode(string));
    },
    end: function() {
      writer.close();
    }
  };
  var out = this.createOut(
    data && data.$global,
    facade,
    void 0,
    this._S_
  );
  out.once("error", (err) => {
    facade.write = facade.end = noop$2;
    writer.abort(err);
  });
  this.render(data, out);
  out.end();
  return transformStream.readable;
};
var slice = Array.prototype.slice;
function isFunction(arg) {
  return typeof arg === "function";
}
function checkListener(listener) {
  if (!isFunction(listener)) {
    throw TypeError("Invalid listener");
  }
}
function invokeListener(ee, listener, args) {
  switch (args.length) {
    case 1:
      listener.call(ee);
      break;
    case 2:
      listener.call(ee, args[1]);
      break;
    case 3:
      listener.call(ee, args[1], args[2]);
      break;
    default:
      listener.apply(ee, slice.call(args, 1));
  }
}
function addListener(eventEmitter, type, listener, prepend) {
  checkListener(listener);
  var events = eventEmitter.$e || (eventEmitter.$e = {});
  var listeners = events[type];
  if (listeners) {
    if (isFunction(listeners)) {
      events[type] = prepend ? [listener, listeners] : [listeners, listener];
    } else {
      if (prepend) {
        listeners.unshift(listener);
      } else {
        listeners.push(listener);
      }
    }
  } else {
    events[type] = listener;
  }
  return eventEmitter;
}
function EventEmitter$1() {
  this.$e = this.$e || {};
}
EventEmitter$1.EventEmitter = EventEmitter$1;
EventEmitter$1.prototype = {
  $e: null,
  emit: function(type) {
    var args = arguments;
    var events = this.$e;
    if (!events) {
      return;
    }
    var listeners = events && events[type];
    if (!listeners) {
      if (type === "error") {
        var error = args[1];
        if (!(error instanceof Error)) {
          var context = error;
          error = new Error("Error: " + context);
          error.context = context;
        }
        throw error;
      }
      return false;
    }
    if (isFunction(listeners)) {
      invokeListener(this, listeners, args);
    } else {
      listeners = slice.call(listeners);
      for (var i = 0, len = listeners.length; i < len; i++) {
        var listener = listeners[i];
        invokeListener(this, listener, args);
      }
    }
    return true;
  },
  on: function(type, listener) {
    return addListener(this, type, listener, false);
  },
  prependListener: function(type, listener) {
    return addListener(this, type, listener, true);
  },
  once: function(type, listener) {
    checkListener(listener);
    function g() {
      this.removeListener(type, g);
      if (listener) {
        listener.apply(this, arguments);
        listener = null;
      }
    }
    this.on(type, g);
    return this;
  },
  removeListener: function(type, listener) {
    checkListener(listener);
    var events = this.$e;
    var listeners;
    if (events && (listeners = events[type])) {
      if (isFunction(listeners)) {
        if (listeners === listener) {
          delete events[type];
        }
      } else {
        for (var i = listeners.length - 1; i >= 0; i--) {
          if (listeners[i] === listener) {
            listeners.splice(i, 1);
          }
        }
      }
    }
    return this;
  },
  removeAllListeners: function(type) {
    var events = this.$e;
    if (events) {
      delete events[type];
    }
  },
  listenerCount: function(type) {
    var events = this.$e;
    var listeners = events && events[type];
    return listeners ? isFunction(listeners) ? 1 : listeners.length : 0;
  }
};
var src$1 = EventEmitter$1;
var escapeQuotes = {};
escapeQuotes.d = function(value) {
  return escapeDoubleQuotes$4(value + "", 0);
};
escapeQuotes.m_ = escapeDoubleQuotes$4;
escapeQuotes.br_ = escapeSingleQuotes$2;
function escapeSingleQuotes$2(value, startPos) {
  return escapeQuote(value, startPos, "'", "&#39;");
}
function escapeDoubleQuotes$4(value, startPos) {
  return escapeQuote(value, startPos, '"', "&#34;");
}
function escapeQuote(str, startPos, quote, escaped) {
  var result = "";
  var lastPos = 0;
  for (var i = startPos, len = str.length; i < len; i++) {
    if (str[i] === quote) {
      result += str.slice(lastPos, i) + escaped;
      lastPos = i + 1;
    }
  }
  if (lastPos) {
    return result + str.slice(lastPos);
  }
  return str;
}
var escapeDoubleQuotes$3 = escapeQuotes.m_;
function StringWriter$2() {
  this._content = "";
  this._scripts = "";
  this._data = null;
}
StringWriter$2.prototype = {
  write: function(str) {
    this._content += str;
  },
  script: function(str) {
    if (str) {
      this._scripts += (this._scripts ? ";" : "") + str;
    }
  },
  get: function(key) {
    const extra = this._data = this._data || {};
    return extra[key] = extra[key] || [];
  },
  merge: function(otherWriter) {
    this._content += otherWriter._content;
    if (otherWriter._scripts) {
      this._scripts = this._scripts ? this._scripts + ";" + otherWriter._scripts : otherWriter._scripts;
    }
    if (otherWriter._data) {
      if (this._data) {
        for (const key in otherWriter._data) {
          if (this._data[key]) {
            this._data[key].push.apply(this._data[key], otherWriter._data[key]);
          } else {
            this._data[key] = this._writer[key];
          }
        }
      } else {
        this._data = otherWriter._data;
      }
    }
  },
  clear: function() {
    this._content = "";
    this._scripts = "";
    this._data = null;
  },
  toString: function() {
    this.state.events.emit("c_", this);
    let str = this._content;
    if (this._scripts) {
      const outGlobal = this.state.root.global;
      const cspNonce = outGlobal.cspNonce;
      const nonceAttr = cspNonce ? ' nonce="' + escapeDoubleQuotes$3(cspNonce) + '"' : "";
      str += `<script${nonceAttr}>${this._scripts}<\/script>`;
    }
    return str;
  }
};
var StringWriter_1 = StringWriter$2;
var indexWorker = {};
indexWorker.ab_ = setTimeout;
indexWorker.ac_ = clearTimeout;
var immediate = indexWorker;
var setImmediate$1 = immediate.ab_;
var clearImmediate = immediate.ac_;
var StringWriter$1 = StringWriter_1;
function BufferedWriter$2(wrappedStream) {
  StringWriter$1.call(this);
  this._wrapped = wrappedStream;
  this._scheduled = null;
}
BufferedWriter$2.prototype = Object.assign(
  {
    scheduleFlush() {
      if (!this._scheduled) {
        this._scheduled = setImmediate$1(flush.bind(0, this));
      }
    },
    end: function() {
      flush(this);
      if (!this._wrapped.isTTY) {
        this._wrapped.end();
      }
    }
  },
  StringWriter$1.prototype
);
function flush(writer) {
  const contents = writer.toString();
  if (contents.length !== 0) {
    writer._wrapped.write(contents);
    writer.clear();
    if (writer._wrapped.flush) {
      writer._wrapped.flush();
    }
  }
  clearImmediate(writer._scheduled);
  writer._scheduled = null;
}
var BufferedWriter_1 = BufferedWriter$2;
var extend$3 = function extend(target, source) {
  if (!target) {
    target = {};
  }
  if (source) {
    for (var propName in source) {
      if (source.hasOwnProperty(propName)) {
        target[propName] = source[propName];
      }
    }
  }
  return target;
};
var componentsUtil$3 = {};
var FLAG_WILL_RERENDER_IN_BROWSER$4 = 1;
function nextComponentIdProvider$1(out) {
  var prefix = out.global.componentIdPrefix || out.global.widgetIdPrefix || "s";
  var nextId = 0;
  return function nextComponentId() {
    return prefix + nextId++;
  };
}
function attachBubblingEvent$1(componentDef, handlerMethodName, isOnce, extraArgs) {
  if (handlerMethodName) {
    if (extraArgs) {
      var component = componentDef.r_;
      var eventIndex = component.Y_++;
      if (!(componentDef.t_ & FLAG_WILL_RERENDER_IN_BROWSER$4)) {
        if (eventIndex === 0) {
          component.W_ = [extraArgs];
        } else {
          component.W_.push(extraArgs);
        }
      }
      return handlerMethodName + " " + componentDef.id + " " + isOnce + " " + eventIndex;
    } else {
      return handlerMethodName + " " + componentDef.id + " " + isOnce;
    }
  }
}
componentsUtil$3._P_ = nextComponentIdProvider$1;
componentsUtil$3._F_ = true;
componentsUtil$3._Q_ = attachBubblingEvent$1;
componentsUtil$3._N_ = function noop() {
};
componentsUtil$3._O_ = function noop2() {
};
var helpers$1 = {};
function insertBefore$1(node, referenceNode, parentNode) {
  if (node.insertInto) {
    return node.insertInto(parentNode, referenceNode);
  }
  return parentNode.insertBefore(
    node,
    referenceNode && referenceNode.startNode || referenceNode
  );
}
function insertAfter$1(node, referenceNode, parentNode) {
  return insertBefore$1(
    node,
    referenceNode && referenceNode.nextSibling,
    parentNode
  );
}
function nextSibling(node) {
  var next = node.nextSibling;
  var fragment = next && next.fragment;
  if (fragment) {
    return next === fragment.startNode ? fragment : null;
  }
  return next;
}
function firstChild(node) {
  var next = node.firstChild;
  return next && next.fragment || next;
}
function removeChild$1(node) {
  if (node.remove)
    node.remove();
  else
    node.parentNode.removeChild(node);
}
helpers$1.bd_ = insertBefore$1;
helpers$1.be_ = insertAfter$1;
helpers$1.cj_ = nextSibling;
helpers$1.ay_ = firstChild;
helpers$1.bf_ = removeChild$1;
var extend$2 = extend$3;
var componentsUtil$2 = componentsUtil$3;
var destroyComponentForNode = componentsUtil$2._N_;
var destroyNodeRecursive = componentsUtil$2._O_;
var helpers = helpers$1;
var insertBefore = helpers.bd_;
var insertAfter = helpers.be_;
var removeChild = helpers.bf_;
function resolveEl(el) {
  if (typeof el == "string") {
    var elId = el;
    el = document.getElementById(elId);
    if (!el) {
      throw Error("Not found: " + elId);
    }
  }
  return el;
}
function beforeRemove(referenceEl) {
  destroyNodeRecursive(referenceEl);
  destroyComponentForNode(referenceEl);
}
var domInsert$1 = function(target, getEl2, afterInsert2) {
  extend$2(target, {
    appendTo: function(referenceEl) {
      referenceEl = resolveEl(referenceEl);
      var el = getEl2(this, referenceEl);
      insertBefore(el, null, referenceEl);
      return afterInsert2(this, referenceEl);
    },
    prependTo: function(referenceEl) {
      referenceEl = resolveEl(referenceEl);
      var el = getEl2(this, referenceEl);
      insertBefore(el, referenceEl.firstChild || null, referenceEl);
      return afterInsert2(this, referenceEl);
    },
    replace: function(referenceEl) {
      referenceEl = resolveEl(referenceEl);
      var el = getEl2(this, referenceEl);
      beforeRemove(referenceEl);
      insertBefore(el, referenceEl, referenceEl.parentNode);
      removeChild(referenceEl);
      return afterInsert2(this, referenceEl);
    },
    replaceChildrenOf: function(referenceEl) {
      referenceEl = resolveEl(referenceEl);
      var el = getEl2(this, referenceEl);
      var curChild = referenceEl.firstChild;
      while (curChild) {
        var nextSibling2 = curChild.nextSibling;
        beforeRemove(curChild);
        curChild = nextSibling2;
      }
      referenceEl.innerHTML = "";
      insertBefore(el, null, referenceEl);
      return afterInsert2(this, referenceEl);
    },
    insertBefore: function(referenceEl) {
      referenceEl = resolveEl(referenceEl);
      var el = getEl2(this, referenceEl);
      insertBefore(el, referenceEl, referenceEl.parentNode);
      return afterInsert2(this, referenceEl);
    },
    insertAfter: function(referenceEl) {
      referenceEl = resolveEl(referenceEl);
      var el = getEl2(this, referenceEl);
      insertAfter(el, referenceEl, referenceEl.parentNode);
      return afterInsert2(this, referenceEl);
    }
  });
};
var domInsert = domInsert$1;
function getRootNode(el) {
  var cur = el;
  while (cur.parentNode)
    cur = cur.parentNode;
  return cur;
}
function getComponentDefs(result) {
  var componentDefs = result.b_;
  if (!componentDefs) {
    throw Error("No component");
  }
  return componentDefs;
}
function RenderResult$1(out) {
  this.out = this.q_ = out;
  this.b_ = void 0;
}
var RenderResult_1 = RenderResult$1;
var proto$1 = RenderResult$1.prototype = {
  getComponent: function() {
    return this.getComponents()[0];
  },
  getComponents: function(selector) {
    if (this.b_ === void 0) {
      throw Error("Not added to DOM");
    }
    var componentDefs = getComponentDefs(this);
    var components2 = [];
    componentDefs.forEach(function(componentDef) {
      var component = componentDef.r_;
      if (!selector || selector(component)) {
        components2.push(component);
      }
    });
    return components2;
  },
  afterInsert: function(host) {
    var out = this.q_;
    var componentsContext = out.b_;
    if (componentsContext) {
      this.b_ = componentsContext.ad_(host);
    } else {
      this.b_ = null;
    }
    return this;
  },
  getNode: function(host) {
    return this.q_.ae_(host);
  },
  getOutput: function() {
    return this.q_.af_();
  },
  toString: function() {
    return this.q_.toString();
  },
  document: typeof document === "object" && document
};
Object.defineProperty(proto$1, "html", {
  get: function() {
    return this.toString();
  }
});
Object.defineProperty(proto$1, "context", {
  get: function() {
    return this.q_;
  }
});
domInsert(
  proto$1,
  function getEl(renderResult, referenceEl) {
    return renderResult.getNode(getRootNode(referenceEl));
  },
  function afterInsert(renderResult, referenceEl) {
    return renderResult.afterInsert(getRootNode(referenceEl));
  }
);
var escapeQuoteHelpers$1 = escapeQuotes;
var escapeDoubleQuotes$2 = escapeQuoteHelpers$1.m_;
var escapeSingleQuotes$1 = escapeQuoteHelpers$1.br_;
var attr$2 = maybeEmptyAttr;
maybeEmptyAttr.bp_ = notEmptyAttr$1;
maybeEmptyAttr.bq_ = isEmpty;
function maybeEmptyAttr(name, value) {
  if (isEmpty(value)) {
    return "";
  }
  return notEmptyAttr$1(name, value);
}
function notEmptyAttr$1(name, value) {
  switch (typeof value) {
    case "string":
      return " " + name + guessQuotes(value);
    case "boolean":
      return " " + name;
    case "number":
      return " " + name + "=" + value;
    case "object":
      switch (value.toString) {
        case Object.prototype.toString:
        case Array.prototype.toString:
          return " " + name + singleQuote(JSON.stringify(value), 2);
        case RegExp.prototype.toString:
          return " " + name + guessQuotes(value.source);
      }
  }
  return " " + name + guessQuotes(value + "");
}
function isEmpty(value) {
  return value == null || value === false;
}
function doubleQuote(value, startPos) {
  return '="' + escapeDoubleQuotes$2(value, startPos) + '"';
}
function singleQuote(value, startPos) {
  return "='" + escapeSingleQuotes$1(value, startPos) + "'";
}
function guessQuotes(value) {
  for (var i = 0, len = value.length; i < len; i++) {
    switch (value[i]) {
      case '"':
        return singleQuote(value, i + 1);
      case "'":
      case ">":
      case " ":
      case "	":
      case "\n":
      case "\r":
      case "\f":
        return doubleQuote(value, i + 1);
    }
  }
  return value && "=" + (value[len - 1] === "/" ? value + " " : value);
}
var _marko_attr = /* @__PURE__ */ getDefaultExportFromCjs(attr$2);
var classValue = function classHelper(arg) {
  switch (typeof arg) {
    case "string":
      return arg || null;
    case "object":
      var result = "";
      var sep = "";
      if (Array.isArray(arg)) {
        for (var i = 0, len = arg.length; i < len; i++) {
          var value = classHelper(arg[i]);
          if (value) {
            result += sep + value;
            sep = " ";
          }
        }
      } else {
        for (var key in arg) {
          if (arg[key]) {
            result += sep + key;
            sep = " ";
          }
        }
      }
      return result || null;
    default:
      return null;
  }
};
var attr$1 = attr$2;
var classHelper$1 = classValue;
var classAttr = function classAttr2(value) {
  return attr$1("class", classHelper$1(value));
};
var _changeCase = {};
var camelToDashLookup = /* @__PURE__ */ Object.create(null);
var dashToCamelLookup = /* @__PURE__ */ Object.create(null);
_changeCase.bg_ = function camelToDashCase(name) {
  var nameDashed = camelToDashLookup[name];
  if (!nameDashed) {
    nameDashed = camelToDashLookup[name] = name.replace(/([A-Z])/g, "-$1").toLowerCase();
    if (nameDashed !== name) {
      dashToCamelLookup[nameDashed] = name;
    }
  }
  return nameDashed;
};
_changeCase.bh_ = function dashToCamelCase(name) {
  var nameCamel = dashToCamelLookup[name];
  if (!nameCamel) {
    nameCamel = dashToCamelLookup[name] = name.replace(
      /-([a-z])/g,
      matchToUpperCase
    );
    if (nameCamel !== name) {
      camelToDashLookup[nameCamel] = name;
    }
  }
  return nameCamel;
};
function matchToUpperCase(_, char) {
  return char.toUpperCase();
}
var changeCase$1 = _changeCase;
var styleValue = function styleHelper(style) {
  if (!style) {
    return null;
  }
  var type = typeof style;
  if (type !== "string") {
    var styles = "";
    var sep = "";
    if (Array.isArray(style)) {
      for (var i = 0, len = style.length; i < len; i++) {
        var next = styleHelper(style[i]);
        if (next) {
          styles += sep + next;
          sep = ";";
        }
      }
    } else if (type === "object") {
      for (var name in style) {
        var value = style[name];
        if (value != null && value !== false) {
          if (typeof value === "number" && value) {
            value += "px";
          }
          styles += sep + changeCase$1.bg_(name) + ":" + value;
          sep = ";";
        }
      }
    }
    return styles || null;
  }
  return style;
};
var attr = attr$2;
var styleHelper$1 = styleValue;
var styleAttr = function styleAttr2(value) {
  return attr("style", styleHelper$1(value));
};
var attrHelper = attr$2;
var notEmptyAttr = attrHelper.bp_;
var isEmptyAttrValue = attrHelper.bq_;
var classHelper2 = classAttr;
var styleHelper2 = styleAttr;
var _dynamicAttr = function dynamicAttr(name, value) {
  switch (name) {
    case "class":
      return classHelper2(value);
    case "style":
      return styleHelper2(value);
    case "renderBody":
      return "";
    default:
      return isEmptyAttrValue(value) || isInvalidAttrName(name) ? "" : notEmptyAttr(name, value);
  }
};
function isInvalidAttrName(name) {
  for (let i = name.length; i--; ) {
    if (name[i] === ">") {
      return true;
    }
  }
  return false;
}
var dynamicAttrHelper = _dynamicAttr;
var attrs = function attrs2(arg) {
  switch (typeof arg) {
    case "object":
      var result = "";
      for (var attrName in arg) {
        result += dynamicAttrHelper(attrName, arg[attrName]);
      }
      return result;
    case "string":
      return arg;
    default:
      return "";
  }
};
var escapeQuoteHelpers = escapeQuotes;
var escapeSingleQuotes = escapeQuoteHelpers.br_;
var escapeDoubleQuotes$1 = escapeQuoteHelpers.m_;
var FLAG_WILL_RERENDER_IN_BROWSER$3 = 1;
var dataMarko = function dataMarko2(out, componentDef, props, key) {
  var result = "";
  var willNotRerender = out.b_.u_ || componentDef.s_ && (componentDef.t_ & FLAG_WILL_RERENDER_IN_BROWSER$3) === 0;
  if (willNotRerender) {
    if (props) {
      for (var _ in props) {
        result += " data-marko='" + escapeSingleQuotes(JSON.stringify(props)) + "'";
        break;
      }
    }
    if (key && key[0] === "@") {
      result += ' data-marko-key="' + escapeDoubleQuotes$1(
        componentDef.aK_(key) + " " + componentDef.id
      ) + '"';
    }
  }
  return result;
};
var escapeXml = {};
var x = escapeXml.x = function(value) {
  if (value == null) {
    return "";
  }
  if (value.toHTML) {
    return value.toHTML();
  }
  return escapeXML(value + "");
};
escapeXml.bl_ = escapeXML;
function escapeXML(str) {
  var len = str.length;
  var result = "";
  var lastPos = 0;
  var i = 0;
  var replacement;
  for (; i < len; i++) {
    switch (str[i]) {
      case "<":
        replacement = "&lt;";
        break;
      case "&":
        replacement = "&amp;";
        break;
      default:
        continue;
    }
    result += str.slice(lastPos, i) + replacement;
    lastPos = i + 1;
  }
  if (lastPos) {
    return result + str.slice(lastPos);
  }
  return str;
}
var parseHTML$1 = function(html) {
  var container = document.createElement("template");
  parseHTML$1 = container.content ? function(html2) {
    container.innerHTML = html2;
    return container.content;
  } : function(html2) {
    container.innerHTML = html2;
    return container;
  };
  return parseHTML$1(html);
};
var parseHtml = function(html) {
  return parseHTML$1(html).firstChild;
};
var selfClosingTags$1 = { exports: {} };
var svgElements = [
  "circle",
  "ellipse",
  "line",
  "path",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "use"
];
var voidElements = [
  "area",
  "base",
  "br",
  "col",
  "command",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
];
selfClosingTags$1.exports = voidElements.concat(svgElements);
selfClosingTags$1.exports.voidElements = voidElements;
selfClosingTags$1.exports.svgElements = svgElements;
var selfClosingTagsExports = selfClosingTags$1.exports;
var EventEmitter = src$1;
var StringWriter = StringWriter_1;
var BufferedWriter$1 = BufferedWriter_1;
var RenderResult = RenderResult_1;
var attrsHelper = attrs;
var markoAttr = dataMarko;
var escapeXmlHelper = escapeXml;
var parseHTML = parseHtml;
var escapeXmlOrNullish = escapeXmlHelper.x;
var escapeXmlString = escapeXmlHelper.bl_;
var selfClosingTags = selfClosingTagsExports;
function noop$1() {
}
var voidWriter = {
  write: noop$1,
  script: noop$1,
  merge: noop$1,
  clear: noop$1,
  get: function() {
    return [];
  },
  toString: function() {
    return "";
  }
};
function State(root, stream, writer, events) {
  this.root = root;
  this.stream = stream;
  this.writer = writer;
  this.events = events;
  this.finished = false;
}
function escapeEndingComment(text) {
  return text.replace(/(--!?)>/g, "$1&gt;");
}
function AsyncStream$1(global2, writer, parentOut) {
  if (parentOut === null) {
    throw new Error("illegal state");
  }
  var finalGlobal = this.attributes = global2 || {};
  var originalStream;
  var state;
  if (parentOut) {
    state = parentOut._state;
    originalStream = state.stream;
  } else {
    var events = finalGlobal.events = writer && writer.on ? writer : new EventEmitter();
    if (writer) {
      originalStream = writer;
      writer = new BufferedWriter$1(writer);
    } else {
      writer = originalStream = new StringWriter();
    }
    state = new State(this, originalStream, writer, events);
    writer.state = state;
  }
  finalGlobal.runtimeId = finalGlobal.runtimeId || "M";
  this.global = finalGlobal;
  this.stream = originalStream;
  this._state = state;
  this._ended = false;
  this._remaining = 1;
  this._lastCount = 0;
  this._last = void 0;
  this._parentOut = parentOut;
  this.data = {};
  this.writer = writer;
  writer.stream = this;
  this._sync = false;
  this._stack = void 0;
  this.name = void 0;
  this._timeoutId = void 0;
  this._node = void 0;
  this._elStack = void 0;
  this.b_ = null;
  this._X_ = null;
  this._Y_ = null;
  this.b__ = null;
  this.bm_ = false;
}
AsyncStream$1.DEFAULT_TIMEOUT = 1e4;
AsyncStream$1.INCLUDE_STACK = typeof process !== "undefined" && false;
AsyncStream$1.enableAsyncStackTrace = function() {
  AsyncStream$1.INCLUDE_STACK = true;
};
var proto = AsyncStream$1.prototype = {
  constructor: AsyncStream$1,
  A_: typeof document === "object" && document,
  bn_: true,
  sync: function() {
    this._sync = true;
  },
  isSync: function() {
    return this._sync === true;
  },
  write: function(str) {
    if (str != null) {
      this.writer.write(str.toString());
    }
    return this;
  },
  script: function(str) {
    if (str != null) {
      this.writer.script(str.toString());
    }
    return this;
  },
  af_: function() {
    return this._state.writer.toString();
  },
  getOutput: function() {
    return this.af_();
  },
  toString: function() {
    return this._state.writer.toString();
  },
  bo_: function() {
    this._result = this._result || new RenderResult(this);
    return this._result;
  },
  beginAsync: function(options) {
    if (this._sync) {
      throw new Error("beginAsync() not allowed when using renderSync()");
    }
    var state = this._state;
    var currentWriter = this.writer;
    var newWriter = new StringWriter();
    var newStream = new AsyncStream$1(this.global, currentWriter, this);
    newWriter.state = state;
    this.writer = newWriter;
    newWriter.stream = this;
    newWriter.next = currentWriter.next;
    currentWriter.next = newWriter;
    var timeout;
    var name;
    this._remaining++;
    if (options != null) {
      if (typeof options === "number") {
        timeout = options;
      } else {
        timeout = options.timeout;
        if (options.last === true) {
          if (timeout == null) {
            timeout = 0;
          }
          this._lastCount++;
          newStream.bm_ = true;
        }
        name = options.name;
      }
    }
    if (timeout == null) {
      timeout = AsyncStream$1.DEFAULT_TIMEOUT;
    }
    newStream._stack = AsyncStream$1.INCLUDE_STACK ? new Error() : null;
    newStream.name = name;
    if (timeout > 0) {
      newStream._timeoutId = setTimeout(function() {
        newStream.error(
          new Error(
            "Async fragment " + (name ? "(" + name + ") " : "") + "timed out after " + timeout + "ms"
          )
        );
      }, timeout);
    }
    state.events.emit("beginAsync", {
      out: newStream,
      parentOut: this
    });
    return newStream;
  },
  _doFinish: function() {
    var state = this._state;
    state.finished = true;
    if (state.writer.end) {
      state.writer.end();
    }
    if (state.events !== state.stream) {
      state.events.emit("finish", this.bo_());
    }
  },
  end: function(data) {
    if (this._ended === true) {
      return;
    }
    this._ended = true;
    var remaining = --this._remaining;
    if (data != null) {
      this.write(data);
    }
    var currentWriter = this.writer;
    this.writer = voidWriter;
    currentWriter.stream = null;
    this._flushNext(currentWriter);
    var parentOut = this._parentOut;
    if (parentOut === void 0) {
      if (remaining === 0) {
        this._doFinish();
      } else if (remaining - this._lastCount === 0) {
        this._emitLast();
      }
    } else {
      var timeoutId = this._timeoutId;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (remaining === 0) {
        parentOut._handleChildDone(this);
      } else if (remaining - this._lastCount === 0) {
        this._emitLast();
      }
    }
    return this;
  },
  _handleChildDone: function(childOut) {
    var remaining = --this._remaining;
    if (remaining === 0) {
      var parentOut = this._parentOut;
      if (parentOut === void 0) {
        this._doFinish();
      } else {
        parentOut._handleChildDone(this);
      }
    } else {
      if (childOut.bm_) {
        this._lastCount--;
      }
      if (remaining - this._lastCount === 0) {
        this._emitLast();
      }
    }
  },
  _flushNext: function(currentWriter) {
    var nextWriter = currentWriter.next;
    if (nextWriter) {
      currentWriter.merge(nextWriter);
      currentWriter.next = nextWriter.next;
      var nextStream = nextWriter.stream;
      if (nextStream) {
        nextStream.writer = currentWriter;
        currentWriter.stream = nextStream;
      }
    }
  },
  on: function(event, callback) {
    var state = this._state;
    if (event === "finish" && state.finished === true) {
      callback(this.bo_());
    } else if (event === "last") {
      this.onLast(callback);
    } else {
      state.events.on(event, callback);
    }
    return this;
  },
  once: function(event, callback) {
    var state = this._state;
    if (event === "finish" && state.finished === true) {
      callback(this.bo_());
    } else if (event === "last") {
      this.onLast(callback);
    } else {
      state.events.once(event, callback);
    }
    return this;
  },
  onLast: function(callback) {
    var lastArray = this._last;
    if (lastArray === void 0) {
      this._last = [callback];
    } else {
      lastArray.push(callback);
    }
    return this;
  },
  _emitLast: function() {
    if (this._last) {
      var i = 0;
      var lastArray = this._last;
      this._last = void 0;
      (function next() {
        if (i === lastArray.length) {
          return;
        }
        var lastCallback = lastArray[i++];
        lastCallback(next);
        if (lastCallback.length === 0) {
          next();
        }
      })();
    }
  },
  emit: function(type, arg) {
    var events = this._state.events;
    switch (arguments.length) {
      case 1:
        events.emit(type);
        break;
      case 2:
        events.emit(type, arg);
        break;
      default:
        events.emit.apply(events, arguments);
        break;
    }
    return this;
  },
  removeListener: function() {
    var events = this._state.events;
    events.removeListener.apply(events, arguments);
    return this;
  },
  prependListener: function() {
    var events = this._state.events;
    events.prependListener.apply(events, arguments);
    return this;
  },
  pipe: function(stream) {
    this._state.stream.pipe(stream);
    return this;
  },
  error: function(e) {
    var name = this.name;
    var stack = this._stack;
    if (stack)
      stack = getNonMarkoStack(stack);
    if (!(e instanceof Error)) {
      e = new Error(JSON.stringify(e));
    }
    if (name || stack) {
      e.message += "\nRendered by" + (name ? " " + name : "") + (stack ? ":\n" + stack : "");
    }
    try {
      this.emit("error", e);
    } finally {
      this.end();
    }
    return this;
  },
  flush: function() {
    var state = this._state;
    if (!state.finished) {
      var writer = state.writer;
      if (writer && writer.scheduleFlush) {
        writer.scheduleFlush();
      }
    }
    return this;
  },
  createOut: function() {
    var newOut = new AsyncStream$1(this.global);
    newOut.on("error", this.emit.bind(this, "error"));
    this._state.events.emit("beginDetachedAsync", {
      out: newOut,
      parentOut: this
    });
    return newOut;
  },
  bk_: function(tagName, elementAttrs, key, componentDef, props) {
    var str = "<" + tagName + markoAttr(this, componentDef, props, key) + attrsHelper(elementAttrs);
    if (selfClosingTags.voidElements.indexOf(tagName) !== -1) {
      str += ">";
    } else if (selfClosingTags.svgElements.indexOf(tagName) !== -1) {
      str += "/>";
    } else {
      str += "></" + tagName + ">";
    }
    this.write(str);
  },
  element: function(tagName, elementAttrs, openTagOnly) {
    var str = "<" + tagName + attrsHelper(elementAttrs) + ">";
    if (openTagOnly !== true) {
      str += "</" + tagName + ">";
    }
    this.write(str);
  },
  bi_: function(name, elementAttrs, key, componentDef, props) {
    var str = "<" + name + markoAttr(this, componentDef, props, key) + attrsHelper(elementAttrs) + ">";
    this.write(str);
    if (this._elStack) {
      this._elStack.push(name);
    } else {
      this._elStack = [name];
    }
  },
  beginElement: function(name, elementAttrs) {
    var str = "<" + name + attrsHelper(elementAttrs) + ">";
    this.write(str);
    if (this._elStack) {
      this._elStack.push(name);
    } else {
      this._elStack = [name];
    }
  },
  endElement: function() {
    var tagName = this._elStack.pop();
    this.write("</" + tagName + ">");
  },
  comment: function(str) {
    this.write("<!--" + escapeEndingComment(str) + "-->");
  },
  text: function(str) {
    this.write(escapeXmlOrNullish(str));
  },
  bf: function(key, component, preserve) {
    if (preserve) {
      this.write("<!--F#" + escapeXmlString(key) + "-->");
    }
    if (this._elStack) {
      this._elStack.push(preserve);
    } else {
      this._elStack = [preserve];
    }
  },
  ef: function() {
    var preserve = this._elStack.pop();
    if (preserve) {
      this.write("<!--F/-->");
    }
  },
  ae_: function(host) {
    var node = this._node;
    if (!node) {
      var nextEl;
      var fragment;
      var html = this.af_();
      if (!host)
        host = this.A_;
      var doc = host.ownerDocument || host;
      if (html) {
        node = parseHTML(html);
        if (node && node.nextSibling) {
          fragment = doc.createDocumentFragment();
          do {
            nextEl = node.nextSibling;
            fragment.appendChild(node);
          } while (node = nextEl);
          node = fragment;
        }
      }
      this._node = node || doc.createDocumentFragment();
    }
    return node;
  },
  then: function(fn, fnErr) {
    var out = this;
    var promise = new Promise(function(resolve2, reject) {
      out.on("error", reject);
      out.on("finish", function(result) {
        resolve2(result);
      });
    });
    return Promise.resolve(promise).then(fn, fnErr);
  },
  catch: function(fnErr) {
    return this.then(void 0, fnErr);
  },
  c: function(componentDef, key, customEvents) {
    this._X_ = componentDef;
    this._Y_ = key;
    this.b__ = customEvents;
  }
};
proto.w = proto.write;
proto.bj_ = proto.endElement;
var AsyncStream_1 = AsyncStream$1;
function getNonMarkoStack(error) {
  return error.stack.toString().split("\n").slice(1).filter((line) => !/\/node_modules\/marko\//.test(line)).join("\n");
}
var actualCreateOut;
function setCreateOut(createOutFunc) {
  actualCreateOut = createOutFunc;
}
function createOut(globalData) {
  return actualCreateOut(globalData);
}
createOut.bc_ = setCreateOut;
var createOut_1 = createOut;
var defaultCreateOut = createOut_1;
var setImmediate = indexWorker.ab_;
var extend$1 = extend$3;
function safeRender(renderFunc, finalData, finalOut, shouldEnd) {
  try {
    renderFunc(finalData, finalOut);
    if (shouldEnd) {
      finalOut.end();
    }
  } catch (err) {
    var actualEnd = finalOut.end;
    finalOut.end = function() {
    };
    setImmediate(function() {
      finalOut.end = actualEnd;
      finalOut.error(err);
    });
  }
  return finalOut;
}
var renderable = function(target, renderer2) {
  var renderFunc = renderer2 && (renderer2.renderer || renderer2.render || renderer2);
  var createOut3 = target.createOut || renderer2.createOut || defaultCreateOut;
  return extend$1(target, {
    _: renderFunc,
    createOut: createOut3,
    renderToString: function(data, callback) {
      var localData = data || {};
      var render3 = renderFunc || this._;
      var globalData = localData.$global;
      var out = createOut3(globalData);
      out.global.template = this;
      if (globalData) {
        localData.$global = void 0;
      }
      if (callback) {
        out.on("finish", function() {
          callback(null, out.toString(), out);
        }).once("error", callback);
        return safeRender(render3, localData, out, true);
      } else {
        out.sync();
        render3(localData, out);
        return out.toString();
      }
    },
    renderSync: function(data) {
      var localData = data || {};
      var render3 = renderFunc || this._;
      var globalData = localData.$global;
      var out = createOut3(globalData);
      out.sync();
      out.global.template = this;
      if (globalData) {
        localData.$global = void 0;
      }
      render3(localData, out);
      return out.bo_();
    },
    render: function(data, out) {
      var callback;
      var finalOut;
      var finalData;
      var globalData;
      var render3 = renderFunc || this._;
      var shouldBuffer = this._S_;
      var shouldEnd = true;
      if (data) {
        finalData = data;
        if (globalData = data.$global) {
          finalData.$global = void 0;
        }
      } else {
        finalData = {};
      }
      if (out && out.bn_) {
        finalOut = out;
        shouldEnd = false;
        extend$1(out.global, globalData);
      } else if (typeof out == "function") {
        finalOut = createOut3(globalData);
        callback = out;
      } else {
        finalOut = createOut3(
          globalData,
          out,
          void 0,
          shouldBuffer
        );
      }
      if (callback) {
        finalOut.on("finish", function() {
          callback(null, finalOut.bo_(), finalOut);
        }).once("error", callback);
      }
      globalData = finalOut.global;
      globalData.template = globalData.template || this;
      return safeRender(render3, finalData, finalOut, shouldEnd);
    }
  });
};
globalThis.Marko = {
  Component: function() {
  }
};
var t = function createTemplate(typeName) {
  return new Template(typeName);
};
function Template(typeName) {
  this.path = this.Q_ = typeName;
}
Template.prototype.stream = indexBrowser;
var AsyncStream = AsyncStream_1;
createOut_1.bc_(
  Template.prototype.createOut = function createOut2(globalData, writer, parentOut, buffer) {
    return new AsyncStream(globalData, writer, parentOut);
  }
);
renderable(Template.prototype);
var _asset = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAASAAAAEgARslrPgAABiZJREFUWMPtlmuMXVUVx3/7cc69d+bO9N559DGlj6lTqZSmtYJatEnHKKAxMRIoCVGrxbYUyFCCiCbGGD+oIaGZ0sEURII8wkBEDBbpk0psoJa0tqU0CFRKsKXtvOc+zj33nH2WH3rvMGiaxsT4xf6Tk+ysc85a//9ae6294SIu4v8d6r/tsLDsYRCHMs0gjuwr3/jPCGzYvZ8DJ08u755/6Zeb0mlEAEhQ8oxS6sjdS+YB8PPHPkMUqzkrl418q7MtzCSiBNDGJNv/segH+83MsZuBDiABFMLzSql9s1+75/wEOh7oxyWSt7j+z3fOvrqrNY8IKJOQ6Pg3hbi43iob2MN3oX2n4sC/99PzSt/rvrSAUpDSCY02fs2VvJtOr1z1XUx8T10BJC9C9E1QQ3MO3DsR09QXXb/ehpOYhlTjbcr4awqR076NCKVMSRUIkvLHw6T6piBvNBdfwhp9tbbyk5HAZJttTINyZFWEdclMbaJC4fm5DxIFV0F5JgRAZR6EJ33j71/X3sXmM4cBsHUCueY2tGpbXI2ra0XEguJkEEizHURFTgENgtwZJG5fV+PwSDnJbbDCNBE4NpKWuamypFWka3rXdjzSv+Pk9V/ZhBc9DJI5J1Z6wnhob0qrQx/JwPW732dqNudrbX/akGr4UjbdSDadRZv0b0c5dqboip1lF1B2wSVlF4wtsG8tMJZbjIexPgToA0vTY680JvFCIgEnjRKSk/axvupf03MgWAQVoNKqCLXI8M4N0+e53jMnsKv/9D7ONmCN/ppnvRtE6jtD3kuS/C/eHR9oT0QWi9AKkNHRreOZKdU2Pe7V1IaJqE0zkvLeKNDzgSU1cV/NXvHBC4UtrRtVqvpZRDoBBG4Ct00p/dybl1+Ozmen0J72pmWt6cn5fnM+5ZNP+ZLzU1tymcGDw+WBXaW4/FTZlSm7Mm16oL2oMjPxPIxnMZ591vrq9+9Wsyckkj6JJJRIkEg8VeXOGVuOliWuPCRURKggVLJCtCGRsCOlDfov5UYajFrTZPhck4UmC1nDnpTm0UY9A89vdMD9gjoyyyuyKD2EUZogyQDmFJg+hVfsSEoIPI3iBVQti4qFSrPOzqo+Brz8oZnlGll1KD0XfVVDcZkTWT2pJStW8UDaqNMtwSCSOBakx95u1NGmT2YGj87wykdbTHhUK30swd5nifYlokl/YRgCXZRIbUrGzNlkxJCMGJIBs6pt9cBllchuHsMPRvEZxVdDpG+ZGg4stycCKVZFShPtCsZB1ipFsdLA2es2snLPdXR5o48vSI38QStRAIkoBDteoUnuXr4TgNLWJoBmNN6kCVPxPFfaZmdfYpUzdbOCkkFKNsC87hK3BeittaUH9FRF9vp+5u8Afd2/A4iAgfON1NEfzwIVt0qoNpCQn5h0orZs3b7gdE6FfSL4NXPsUJtbVHxQO+cAngB2TPL3KWBNtTyqr9l5lgth5P7p2EShm5LvmBa3wrQ5TJvDtLhXJSOPNki8Lke4NE9InpAc4YtZov5IBPvHFTmu3TE4prTuTZy7ApGpNb83a0nvlEheuhCB9BQhyYVLTKTWipybLQrKSrHx8H2d8/K2+u0PK8ygQ/VqGOk+8mc0QFQoE5VKu+NC8GQ0HlB72qNi0FMdLuRXPHn8vMFL21pxMyNfT3E9uiWeb1pjTGuManH9Q7um7M3Zyl05wml5QloIyVF9JBJ5OS3V+l44hxVPHEeS5GNJ7J5BZGm9VpLI7TaTerAyNMa+O5Z+JPhbTzfT2e7hkBuV8CuEpprX98STr59aP2cZht7avgI46FA3KuSdriOHgElnQfnUMNo3x5XWv5Qk6UMkXXt/R3W0tFfBG/+qfvZUSyzSoaEHRVNNjmDoO3XrnIoyctuk4KGCXq14x4ib8KHri/3fvxJXqeKC8KmoEGytniuDROPBJ+JSZX0wOOot+dGeiR8LO/Oku4fRsBZYNonXruoHtl8puR24DKiX/1mB50SEWUden/j43y4ki3+4G6X0QpArQdVPhnFgO1A69LPucxnbnQeUZxRfBKZTv3hoDpy4ofNtf0Z8LZCrEVAKXkWpv809fOiCXXURF3ER/1P8E+oo2XFV0bPuAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE1LTA4LTI2VDE2OjM2OjAyKzAwOjAwgXV1bQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNS0wOC0yNlQxNjozNjowMiswMDowMPAozdEAAABGdEVYdHNvZnR3YXJlAEltYWdlTWFnaWNrIDYuNy44LTkgMjAxNC0wNS0xMiBRMTYgaHR0cDovL3d3dy5pbWFnZW1hZ2ljay5vcmfchu0AAAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAGHRFWHRUaHVtYjo6SW1hZ2U6OmhlaWdodAAxOTIPAHKFAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OldpZHRoADE5MtOsIQgAAAAZdEVYdFRodW1iOjpNaW1ldHlwZQBpbWFnZS9wbmc/slZOAAAAF3RFWHRUaHVtYjo6TVRpbWUAMTQ0MDYwNjk2MuwEGPsAAAAPdEVYdFRodW1iOjpTaXplADBCQpSiPuwAAABWdEVYdFRodW1iOjpVUkkAZmlsZTovLy9tbnRsb2cvZmF2aWNvbnMvMjAxNS0wOC0yNi9kYWI1YTMzYmM4MDI5OWQ2YmFhNmQ1NGIyZmI5MTEwMy5pY28ucG5nBTJ6eQAAAABJRU5ErkJggg==";
var toString = function(value) {
  return value == null ? "" : value + "";
};
var _marko_to_string = /* @__PURE__ */ getDefaultExportFromCjs(toString);
var ComponentsContext$3 = { exports: {} };
var nextComponentIdProvider = componentsUtil$3._P_;
function GlobalComponentsContext(out) {
  this.p_ = {};
  this.ax_ = void 0;
  this.aL_ = nextComponentIdProvider(out);
}
var GlobalComponentsContext_1 = GlobalComponentsContext;
(function(module, exports) {
  var GlobalComponentsContext2 = GlobalComponentsContext_1;
  function ComponentsContext2(out, parentComponentsContext) {
    var globalComponentsContext;
    var componentDef;
    if (parentComponentsContext) {
      globalComponentsContext = parentComponentsContext.o_;
      componentDef = parentComponentsContext.n_;
      var nestedContextsForParent;
      if (!(nestedContextsForParent = parentComponentsContext._b_)) {
        nestedContextsForParent = parentComponentsContext._b_ = [];
      }
      nestedContextsForParent.push(this);
    } else {
      globalComponentsContext = out.global.b_;
      if (globalComponentsContext === void 0) {
        out.global.b_ = globalComponentsContext = new GlobalComponentsContext2(out);
      }
    }
    this.o_ = globalComponentsContext;
    this.b_ = [];
    this.q_ = out;
    this.n_ = componentDef;
    this._b_ = void 0;
    this.u_ = parentComponentsContext && parentComponentsContext.u_;
  }
  ComponentsContext2.prototype = {
    ad_: function(host) {
      var componentDefs = this.b_;
      ComponentsContext2._E_(componentDefs, host);
      this.q_.emit("aM_");
      this.q_.global.b_ = void 0;
      return componentDefs;
    }
  };
  function getComponentsContext2(out) {
    return out.b_ || (out.b_ = new ComponentsContext2(out));
  }
  module.exports = exports = ComponentsContext2;
  exports.R_ = getComponentsContext2;
})(ComponentsContext$3, ComponentsContext$3.exports);
var ComponentsContextExports = ComponentsContext$3.exports;
var constants$4 = {};
var win = typeof window !== "undefined" ? window : commonjsGlobal;
constants$4.NOOP = win.$W10NOOP = win.$W10NOOP || function() {
};
var constants$3 = constants$4;
var eventDelegation = {};
var componentsUtil$1 = componentsUtil$3;
var runtimeId = componentsUtil$1._M_;
var componentLookup$1 = componentsUtil$1._i_;
var getMarkoPropsFromEl = componentsUtil$1._n_;
var TEXT_NODE = 3;
var listenersAttachedKey = "$MDE" + runtimeId;
var delegatedEvents = {};
function getEventFromEl(el, eventName) {
  var virtualProps = getMarkoPropsFromEl(el);
  var eventInfo = virtualProps[eventName];
  if (typeof eventInfo === "string") {
    eventInfo = eventInfo.split(" ");
    if (eventInfo[2]) {
      eventInfo[2] = eventInfo[2] === "true";
    }
    if (eventInfo.length == 4) {
      eventInfo[3] = parseInt(eventInfo[3], 10);
    }
  }
  return eventInfo;
}
function delegateEvent(node, eventName, target, event) {
  var targetMethod = target[0];
  var targetComponentId = target[1];
  var isOnce = target[2];
  var extraArgs = target[3];
  if (isOnce) {
    var virtualProps = getMarkoPropsFromEl(node);
    delete virtualProps[eventName];
  }
  var targetComponent = componentLookup$1[targetComponentId];
  if (!targetComponent) {
    return;
  }
  var targetFunc = typeof targetMethod === "function" ? targetMethod : targetComponent[targetMethod];
  if (!targetFunc) {
    throw Error("Method not found: " + targetMethod);
  }
  if (extraArgs != null) {
    if (typeof extraArgs === "number") {
      extraArgs = targetComponent.W_[extraArgs];
    }
  }
  if (extraArgs) {
    targetFunc.apply(targetComponent, extraArgs.concat(event, node));
  } else {
    targetFunc.call(targetComponent, event, node);
  }
}
function addDelegatedEventHandler$1(eventType) {
  if (!delegatedEvents[eventType]) {
    delegatedEvents[eventType] = true;
  }
}
function addDelegatedEventHandlerToHost(eventType, host) {
  var listeners = host[listenersAttachedKey] = host[listenersAttachedKey] || {};
  if (!listeners[eventType]) {
    (host.body || host).addEventListener(
      eventType,
      listeners[eventType] = function(event) {
        var curNode = event.target;
        if (!curNode) {
          return;
        }
        curNode = curNode.correspondingUseElement || (curNode.nodeType === TEXT_NODE ? curNode.parentNode : curNode);
        var propName = "on" + eventType;
        var target;
        if (event.bubbles) {
          var propagationStopped = false;
          var oldStopPropagation = event.stopPropagation;
          event.stopPropagation = function() {
            oldStopPropagation.call(event);
            propagationStopped = true;
          };
          do {
            if (target = getEventFromEl(curNode, propName)) {
              delegateEvent(curNode, propName, target, event);
              if (propagationStopped) {
                break;
              }
            }
          } while ((curNode = curNode.parentNode) && curNode.getAttribute);
        } else if (target = getEventFromEl(curNode, propName)) {
          delegateEvent(curNode, propName, target, event);
        }
      },
      true
    );
  }
}
function noop3() {
}
eventDelegation.aS_ = noop3;
eventDelegation.al_ = noop3;
eventDelegation.aP_ = delegateEvent;
eventDelegation.aQ_ = getEventFromEl;
eventDelegation._o_ = addDelegatedEventHandler$1;
eventDelegation._w_ = function(host) {
  Object.keys(delegatedEvents).forEach(function(eventType) {
    addDelegatedEventHandlerToHost(eventType, host);
  });
};
function KeySequence$1() {
  this.aN_ = /* @__PURE__ */ Object.create(null);
}
KeySequence$1.prototype.aK_ = function(key) {
  var lookup = this.aN_;
  if (lookup[key]) {
    return key + "_" + lookup[key]++;
  }
  lookup[key] = 1;
  return key;
};
var KeySequence_1 = KeySequence$1;
var w10Noop = constants$3.NOOP;
var componentUtil = componentsUtil$3;
var attachBubblingEvent = componentUtil._Q_;
var addDelegatedEventHandler = eventDelegation._o_;
var extend2 = extend$3;
var KeySequence = KeySequence_1;
var EMPTY_OBJECT = {};
var FLAG_WILL_RERENDER_IN_BROWSER$2 = 1;
var FLAG_HAS_RENDER_BODY = 2;
var FLAG_IS_LEGACY = 4;
var FLAG_OLD_HYDRATE_NO_CREATE$1 = 8;
function ComponentDef$2(component, componentId, componentsContext) {
  this.aH_ = componentsContext;
  this.r_ = component;
  this.id = componentId;
  this._a_ = void 0;
  this._q_ = false;
  this.s_ = false;
  this.t_ = 0;
  this.aI_ = 0;
  this.aJ_ = null;
}
ComponentDef$2.prototype = {
  aK_: function(key) {
    return (this.aJ_ || (this.aJ_ = new KeySequence())).aK_(
      key
    );
  },
  elId: function(nestedId) {
    var id = this.id;
    if (nestedId == null) {
      return id;
    } else {
      if (typeof nestedId !== "string") {
        nestedId = String(nestedId);
      }
      if (nestedId.indexOf("#") === 0) {
        id = "#" + id;
        nestedId = nestedId.substring(1);
      }
      return id + "-" + nestedId;
    }
  },
  aL_: function() {
    return this.id + "-c" + this.aI_++;
  },
  d: function(eventName, handlerMethodName, isOnce, extraArgs) {
    addDelegatedEventHandler(eventName);
    return attachBubblingEvent(this, handlerMethodName, isOnce, extraArgs);
  },
  get _m_() {
    return this.r_._m_;
  }
};
ComponentDef$2.prototype.nk = ComponentDef$2.prototype.aK_;
ComponentDef$2._z_ = function(o, types, global2, registry2) {
  var id = o[0];
  var typeName = types[o[1]];
  var input = o[2] || null;
  var extra = o[3] || EMPTY_OBJECT;
  var state = extra.s;
  var componentProps = extra.w || EMPTY_OBJECT;
  var flags = extra.f;
  var isLegacy = flags & FLAG_IS_LEGACY;
  var renderBody = flags & FLAG_HAS_RENDER_BODY ? w10Noop : extra.r;
  var component = typeName && registry2._C_(typeName, id, isLegacy);
  component.___ = true;
  if (isLegacy) {
    component.widgetConfig = componentProps;
    component.X_ = renderBody;
  } else if (renderBody) {
    (input || (input = {})).renderBody = renderBody;
  }
  if (!isLegacy && flags & FLAG_WILL_RERENDER_IN_BROWSER$2 && !(flags & FLAG_OLD_HYDRATE_NO_CREATE$1)) {
    if (component.onCreate) {
      component.onCreate(input, { global: global2 });
    }
    if (component.onInput) {
      input = component.onInput(input, { global: global2 }) || input;
    }
  } else {
    if (state) {
      var undefinedPropNames = extra.u;
      if (undefinedPropNames) {
        undefinedPropNames.forEach(function(undefinedPropName) {
          state[undefinedPropName] = void 0;
        });
      }
      component.state = state;
    }
    if (!isLegacy && componentProps) {
      extend2(component, componentProps);
    }
  }
  component.N_ = input;
  if (extra.b) {
    component.W_ = extra.b;
  }
  var scope = extra.p;
  var customEvents = extra.e;
  if (customEvents) {
    component.aB_(customEvents, scope);
  }
  component.ai_ = global2;
  return {
    id,
    r_: component,
    _a_: extra.d,
    t_: extra.f || 0
  };
};
var ComponentDef_1 = ComponentDef$2;
var changeCase = _changeCase;
var ComponentsContext$2 = ComponentsContextExports;
var getComponentsContext$2 = ComponentsContext$2.R_;
var ComponentDef$1 = ComponentDef_1;
var w10NOOP = constants$3.NOOP;
var RENDER_BODY_TO_JSON = function() {
  return w10NOOP;
};
var FLAG_WILL_RERENDER_IN_BROWSER$1 = 1;
var IS_SERVER = typeof document === "undefined";
var dynamicTag = function dynamicTag2(out, tag, getAttrs, renderBody, args, props, componentDef, key, customEvents) {
  if (tag) {
    if (tag.default) {
      tag = tag.default;
    }
    var attrs3 = getAttrs && getAttrs();
    var component = componentDef && componentDef.r_;
    if (typeof tag === "string") {
      if (renderBody) {
        out.bi_(
          tag,
          attrs3,
          key,
          componentDef,
          addEvents(componentDef, customEvents, props)
        );
        renderBody(out);
        out.bj_();
      } else {
        out.bk_(
          tag,
          attrs3,
          key,
          componentDef,
          addEvents(componentDef, customEvents, props)
        );
      }
    } else {
      if (attrs3 == null) {
        attrs3 = { renderBody };
      } else if (typeof attrs3 === "object") {
        attrs3 = attrsToCamelCase(attrs3);
        if (renderBody) {
          attrs3.renderBody = renderBody;
        }
      }
      var renderer2 = tag._ || (tag.renderer ? tag.renderer.renderer || tag.renderer : tag.render);
      if (renderer2) {
        out.c(componentDef, key, customEvents);
        renderer2(attrs3, out);
        out._X_ = null;
      } else {
        var render3 = tag && tag.renderBody || tag;
        var isFn = typeof render3 === "function";
        if (isFn) {
          var flags = componentDef ? componentDef.t_ : 0;
          var willRerender = flags & FLAG_WILL_RERENDER_IN_BROWSER$1;
          var isW10NOOP = render3 === w10NOOP;
          var preserve = IS_SERVER ? willRerender : isW10NOOP;
          out.bf(key, component, preserve);
          if (!isW10NOOP && isFn) {
            var componentsContext = getComponentsContext$2(out);
            var parentComponentDef = componentsContext.n_;
            var globalContext = componentsContext.o_;
            componentsContext.n_ = new ComponentDef$1(
              component,
              parentComponentDef.id + "-" + parentComponentDef.aK_(key),
              globalContext
            );
            render3.toJSON = RENDER_BODY_TO_JSON;
            if (args) {
              render3.apply(null, [out].concat(args, attrs3));
            } else {
              render3(out, attrs3);
            }
            componentsContext.n_ = parentComponentDef;
          }
          out.ef();
        } else {
          out.error("Invalid dynamic tag value");
        }
      }
    }
  } else if (renderBody) {
    out.bf(
      key,
      component,
      IS_SERVER && componentDef && componentDef.t_ & FLAG_WILL_RERENDER_IN_BROWSER$1
    );
    renderBody(out);
    out.ef();
  }
};
function attrsToCamelCase(attrs3) {
  var result = {};
  for (var key in attrs3) {
    result[changeCase.bh_(key)] = attrs3[key];
  }
  return result;
}
function addEvents(componentDef, customEvents, props) {
  var len = customEvents ? customEvents.length : 0;
  if (len === 0) {
    return props;
  }
  var result = props || {};
  var event;
  for (var i = len; i--; ) {
    event = customEvents[i];
    result["on" + event[0]] = componentDef.d(
      event[0],
      event[1],
      event[2],
      event[3]
    );
  }
  return result;
}
var _marko_dynamic_tag = /* @__PURE__ */ getDefaultExportFromCjs(dynamicTag);
var componentsEntry = {};
var src = {};
var constants$2 = constants$4;
var markerKey$1 = Symbol("warp10");
var safePropName = /^[$A-Z_][0-9A-Z_$]*$/i;
var isArray$2 = Array.isArray;
var safeJSONRegExp = /<\/|\u2028|\u2029/g;
function safeJSONReplacer(match2) {
  if (match2 === "</") {
    return "\\u003C/";
  } else {
    return "\\u" + match2.charCodeAt(0).toString(16);
  }
}
function safeJSON(json) {
  return json.replace(safeJSONRegExp, safeJSONReplacer);
}
var Marker$1 = class Marker {
  constructor(path, symbol) {
    this.path = path;
    this.symbol = symbol;
  }
};
function handleProperty$1(clone, key, value, valuePath, serializationSymbol, assignments) {
  if (value === constants$2.NOOP) {
    if (assignments.$W10NOOP) {
      assignments.push(valuePath + "=$w.$W10NOOP");
    } else {
      assignments.$W10NOOP = true;
      assignments.push('var $w=typeof window=="undefined"?global:window');
      assignments.push(valuePath + "=$w.$W10NOOP=$w.$W10NOOP||function(){}");
    }
  } else if (value.constructor === Date) {
    assignments.push(valuePath + "=new Date(" + value.getTime() + ")");
  } else if (value.constructor === URL) {
    assignments.push(valuePath + '=new URL("' + value.href + '")');
  } else if (value.constructor === URLSearchParams) {
    assignments.push(valuePath + '=new URLSearchParams("' + value + '")');
  } else if (isArray$2(value)) {
    const marker = value[markerKey$1];
    if (marker && marker.symbol === serializationSymbol) {
      assignments.push(valuePath + "=" + marker.path);
    } else {
      value[markerKey$1] = new Marker$1(valuePath, serializationSymbol);
      clone[key] = pruneArray$1(value, valuePath, serializationSymbol, assignments);
    }
  } else {
    const marker = value[markerKey$1];
    if (marker && marker.symbol === serializationSymbol) {
      assignments.push(valuePath + "=" + marker.path);
    } else {
      value[markerKey$1] = new Marker$1(valuePath, serializationSymbol);
      clone[key] = pruneObject$1(value, valuePath, serializationSymbol, assignments);
    }
  }
}
function pruneArray$1(array, path, serializationSymbol, assignments) {
  let len = array.length;
  var clone = new Array(len);
  for (let i = 0; i < len; i++) {
    var value = array[i];
    if (value == null) {
      continue;
    }
    var type = typeof value;
    if (type === "function" && value.toJSON) {
      value = value.toJSON();
      type = typeof value;
    }
    if (value && (value === constants$2.NOOP || type === "object")) {
      let valuePath = path + "[" + i + "]";
      handleProperty$1(clone, i, value, valuePath, serializationSymbol, assignments);
    } else {
      clone[i] = value;
    }
  }
  return clone;
}
function pruneObject$1(obj, path, serializationSymbol, assignments) {
  var clone = {};
  for (var key in obj) {
    var value = obj[key];
    if (value === void 0) {
      continue;
    }
    var type = typeof value;
    if (type === "function" && value.toJSON) {
      value = value.toJSON();
      type = typeof value;
    }
    if (value && (value === constants$2.NOOP || type === "object")) {
      let valuePath = path + (safePropName.test(key) ? "." + key : "[" + JSON.stringify(key) + "]");
      handleProperty$1(clone, key, value, valuePath, serializationSymbol, assignments);
    } else {
      clone[key] = value;
    }
  }
  return clone;
}
function serializeHelper(obj, safe, varName, additive) {
  var pruned;
  const assignments = [];
  if (typeof obj === "object") {
    const serializationSymbol = Symbol();
    const path = "$";
    obj[markerKey$1] = new Marker$1(path, serializationSymbol);
    if (obj.constructor === Date) {
      return "(new Date(" + obj.getTime() + "))";
    } else if (obj.constructor === URL) {
      return '(new URL("' + obj.href + '"))';
    } else if (obj.constructor === URLSearchParams) {
      return '(new URLSearchParams("' + obj + '"))';
    } else if (isArray$2(obj)) {
      pruned = pruneArray$1(obj, path, serializationSymbol, assignments);
    } else {
      pruned = pruneObject$1(obj, path, serializationSymbol, assignments);
    }
  } else {
    pruned = obj;
  }
  let json = JSON.stringify(pruned);
  if (safe) {
    json = safeJSON(json);
  }
  if (varName) {
    if (additive) {
      let innerCode = "var $=" + json + "\n";
      if (assignments.length) {
        innerCode += assignments.join("\n") + "\n";
      }
      let code = "(function() {var t=window." + varName + "||(window." + varName + "={})\n" + innerCode;
      for (let key in obj) {
        var prop;
        if (safePropName.test(key)) {
          prop = "." + key;
        } else {
          prop = "[" + JSON.stringify(key) + "]";
        }
        code += "t" + prop + "=$" + prop + "\n";
      }
      return code + "}())";
    } else {
      if (assignments.length) {
        return "(function() {var $=" + json + "\n" + assignments.join("\n") + "\nwindow." + varName + "=$}())";
      } else {
        return "window." + varName + "=" + json;
      }
    }
  } else {
    if (assignments.length) {
      return "(function() {var $=" + json + "\n" + assignments.join("\n") + "\nreturn $}())";
    } else {
      return "(" + json + ")";
    }
  }
}
var serialize = function serialize2(obj, options) {
  if (obj == null) {
    return "null";
  }
  var safe;
  var varName;
  var additive;
  if (options) {
    safe = options.safe !== false;
    varName = options.var;
    additive = options.additive === true;
  } else {
    safe = true;
    additive = false;
  }
  return serializeHelper(obj, safe, varName, additive);
};
var constants$1 = constants$4;
var markerKey = Symbol("warp10");
var isArray$1 = Array.isArray;
var Marker2 = class {
  constructor(path, symbol) {
    this.path = path;
    this.symbol = symbol;
  }
};
function append(array, el) {
  var len = array.length;
  var clone = new Array(len + 1);
  for (var i = 0; i < len; i++) {
    clone[i] = array[i];
  }
  clone[len] = el;
  return clone;
}
var Assignment = class {
  constructor(lhs, rhs) {
    this.l = lhs;
    this.r = rhs;
  }
};
function handleProperty(clone, key, value, valuePath, serializationSymbol, assignments) {
  if (value === constants$1.NOOP) {
    assignments.push(new Assignment(valuePath, { type: "NOOP" }));
  } else if (value.constructor === Date) {
    assignments.push(new Assignment(valuePath, { type: "Date", value: value.getTime() }));
  } else if (value.constructor === URL) {
    assignments.push(new Assignment(valuePath, { type: "URL", value: value.href }));
  } else if (value.constructor === URLSearchParams) {
    assignments.push(new Assignment(valuePath, { type: "URLSearchParams", value: value.toString() }));
  } else if (isArray$1(value)) {
    const marker = value[markerKey];
    if (marker && marker.symbol === serializationSymbol) {
      assignments.push(new Assignment(valuePath, marker.path));
    } else {
      value[markerKey] = new Marker2(valuePath, serializationSymbol);
      clone[key] = pruneArray(value, valuePath, serializationSymbol, assignments);
    }
  } else {
    const marker = value[markerKey];
    if (marker && marker.symbol === serializationSymbol) {
      assignments.push(new Assignment(valuePath, marker.path));
    } else {
      value[markerKey] = new Marker2(valuePath, serializationSymbol);
      clone[key] = pruneObject(value, valuePath, serializationSymbol, assignments);
    }
  }
}
function pruneArray(array, path, serializationSymbol, assignments) {
  let len = array.length;
  var clone = new Array(len);
  for (let i = 0; i < len; i++) {
    var value = array[i];
    if (value == null) {
      continue;
    }
    var type = typeof value;
    if (type === "function" && value.toJSON) {
      value = value.toJSON();
      type = typeof value;
    }
    if (value && (value === constants$1.NOOP || type === "object")) {
      handleProperty(clone, i, value, append(path, i), serializationSymbol, assignments);
    } else {
      clone[i] = value;
    }
  }
  return clone;
}
function pruneObject(obj, path, serializationSymbol, assignments) {
  var clone = {};
  if (obj.toJSON && obj.constructor != Date && obj.constructor != URL) {
    obj = obj.toJSON();
  }
  if (typeof obj !== "object") {
    return obj;
  }
  var keys = Object.keys(obj);
  var len = keys.length;
  for (var i = 0; i < len; i++) {
    var key = keys[i];
    var value = obj[key];
    if (value === void 0) {
      continue;
    }
    var type = typeof value;
    if (type === "function" && value.toJSON) {
      value = value.toJSON();
      type = typeof value;
    }
    if (value && (value === constants$1.NOOP || type === "object")) {
      handleProperty(clone, key, value, append(path, key), serializationSymbol, assignments);
    } else {
      clone[key] = value;
    }
  }
  return clone;
}
var stringifyPrepare$1 = function stringifyPrepare(obj) {
  if (!obj) {
    return obj;
  }
  var pruned;
  const assignments = [];
  if (typeof obj === "object") {
    if (obj.toJSON && obj.constructor != Date && obj.constructor != URL) {
      obj = obj.toJSON();
      if (!obj.hasOwnProperty || typeof obj !== "object") {
        return obj;
      }
    }
    const serializationSymbol = Symbol();
    const path = [];
    obj[markerKey] = new Marker2(path, serializationSymbol);
    if (obj.constructor === Date) {
      pruned = null;
      assignments.push(new Assignment([], { type: "Date", value: obj.getTime() }));
    } else if (obj.constructor === URL) {
      pruned = null;
      assignments.push(new Assignment([], { type: "URL", value: obj.href }));
    } else if (obj.constructor === URLSearchParams) {
      pruned = null;
      assignments.push(new Assignment([], { type: "URLSearchParams", value: obj.toString() }));
    } else if (isArray$1(obj)) {
      pruned = pruneArray(obj, path, serializationSymbol, assignments);
    } else {
      pruned = pruneObject(obj, path, serializationSymbol, assignments);
    }
  } else {
    pruned = obj;
  }
  if (assignments.length) {
    return {
      o: pruned,
      $$: assignments
    };
  } else {
    return pruned;
  }
};
var stringifyPrepare2 = stringifyPrepare$1;
var escapeEndingScriptTagRegExp = /<\//g;
var stringify = function stringify2(obj, options) {
  var safe;
  if (options) {
    safe = options.safe === true;
  } else {
    safe = false;
  }
  var final = stringifyPrepare2(obj);
  let json = JSON.stringify(final);
  if (safe) {
    json = json.replace(escapeEndingScriptTagRegExp, "\\u003C/");
  }
  return json;
};
var constants = constants$4;
var isArray = Array.isArray;
function resolve(object, path, len) {
  var current = object;
  for (var i = 0; i < len; i++) {
    current = current[path[i]];
  }
  return current;
}
function resolveType(info) {
  if (info.type === "Date") {
    return new Date(info.value);
  } else if (info.type === "URL") {
    return new URL(info.value);
  } else if (info.type === "URLSearchParams") {
    return new URLSearchParams(info.value);
  } else if (info.type === "NOOP") {
    return constants.NOOP;
  } else {
    throw new Error("Bad type");
  }
}
var finalize$1 = function finalize(outer) {
  if (!outer) {
    return outer;
  }
  var assignments = outer.$$;
  if (assignments) {
    var object = outer.o;
    var len;
    if (assignments && (len = assignments.length)) {
      for (var i = 0; i < len; i++) {
        var assignment = assignments[i];
        var rhs = assignment.r;
        var rhsValue;
        if (isArray(rhs)) {
          rhsValue = resolve(object, rhs, rhs.length);
        } else {
          rhsValue = resolveType(rhs);
        }
        var lhs = assignment.l;
        var lhsLast = lhs.length - 1;
        if (lhsLast === -1) {
          object = outer.o = rhsValue;
          break;
        } else {
          var lhsParent = resolve(object, lhs, lhsLast);
          lhsParent[lhs[lhsLast]] = rhsValue;
        }
      }
    }
    assignments.length = 0;
    return object == null ? null : object;
  } else {
    return outer;
  }
};
var finalize2 = finalize$1;
var parse = function parse2(json) {
  if (json === void 0) {
    return void 0;
  }
  var outer = JSON.parse(json);
  return finalize2(outer);
};
src.serialize = serialize;
src.stringify = stringify;
src.parse = parse;
src.finalize = finalize$1;
src.stringifyPrepare = stringifyPrepare$1;
(function(exports) {
  var warp10 = src;
  var safeJSONRegExp2 = /<\/|\u2028|\u2029/g;
  var IGNORE_GLOBAL_TYPES = /* @__PURE__ */ new Set(["undefined", "function", "symbol"]);
  var DEFAULT_RUNTIME_ID = "M";
  var FLAG_WILL_RERENDER_IN_BROWSER2 = 1;
  var FLAG_HAS_RENDER_BODY2 = 2;
  var FLAG_IS_LEGACY2 = 4;
  var FLAG_OLD_HYDRATE_NO_CREATE2 = 8;
  function safeJSONReplacer2(match2) {
    if (match2 === "</") {
      return "\\u003C/";
    } else {
      return "\\u" + match2.charCodeAt(0).toString(16);
    }
  }
  function isNotEmpty(obj) {
    var keys = Object.keys(obj);
    for (var i = keys.length; i--; ) {
      if (obj[keys[i]] !== void 0) {
        return true;
      }
    }
    return false;
  }
  function safeStringify(data) {
    return JSON.stringify(warp10.stringifyPrepare(data)).replace(
      safeJSONRegExp2,
      safeJSONReplacer2
    );
  }
  function getSerializedGlobals($global) {
    let serializedGlobalsLookup = $global.serializedGlobals;
    if (serializedGlobalsLookup) {
      let serializedGlobals2;
      let keys = Object.keys(serializedGlobalsLookup);
      for (let i = keys.length; i--; ) {
        let key = keys[i];
        if (serializedGlobalsLookup[key]) {
          let value = $global[key];
          if (!IGNORE_GLOBAL_TYPES.has(typeof value)) {
            if (serializedGlobals2 === void 0) {
              serializedGlobals2 = {};
            }
            serializedGlobals2[key] = value;
          }
        }
      }
      return serializedGlobals2;
    }
  }
  function addComponentsFromContext2(componentsContext, componentsToHydrate) {
    var components2 = componentsContext.b_;
    var len = components2.length;
    for (var i = 0; i < len; i++) {
      var componentDef = components2[i];
      var id = componentDef.id;
      var component = componentDef.r_;
      var flags = componentDef.t_;
      var isLegacy = componentDef.x_;
      var state = component.state;
      var input = component.input || 0;
      var typeName = component.typeName;
      var customEvents = component.U_;
      var scope = component.V_;
      var bubblingDomEvents = component.W_;
      var needsState;
      var serializedProps;
      var renderBody;
      if (isLegacy) {
        flags |= FLAG_IS_LEGACY2;
        renderBody = component.X_;
        if (component.widgetConfig && isNotEmpty(component.widgetConfig)) {
          serializedProps = component.widgetConfig;
        }
        needsState = true;
      } else {
        if (input && input.renderBody) {
          renderBody = input.renderBody;
          input.renderBody = void 0;
        }
        if (!(flags & FLAG_WILL_RERENDER_IN_BROWSER2) || flags & FLAG_OLD_HYDRATE_NO_CREATE2) {
          component.y_ = void 0;
          component.N_ = void 0;
          component.typeName = void 0;
          component.id = void 0;
          component.U_ = void 0;
          component.V_ = void 0;
          component.W_ = void 0;
          component.Y_ = void 0;
          component.Z_ = void 0;
          component.___ = void 0;
          needsState = true;
          if (isNotEmpty(component)) {
            serializedProps = component;
          }
        }
      }
      var undefinedPropNames = void 0;
      if (needsState && state) {
        const stateKeys = Object.keys(state);
        for (let i2 = stateKeys.length; i2--; ) {
          const stateKey = stateKeys[i2];
          if (state[stateKey] === void 0) {
            if (undefinedPropNames) {
              undefinedPropNames.push(stateKey);
            } else {
              undefinedPropNames = [stateKey];
            }
          }
        }
      }
      if (typeof renderBody === "function") {
        flags |= FLAG_HAS_RENDER_BODY2;
        renderBody = void 0;
      }
      var extra = {
        b: bubblingDomEvents,
        d: componentDef._a_,
        e: customEvents,
        f: flags || void 0,
        p: customEvents && scope,
        s: needsState && state,
        u: undefinedPropNames,
        w: serializedProps,
        r: renderBody
      };
      var parts = [id, typeName];
      var hasExtra = isNotEmpty(extra);
      if (input) {
        parts.push(input);
        if (hasExtra) {
          parts.push(extra);
        }
      } else if (hasExtra) {
        parts.push(0, extra);
      }
      componentsToHydrate.push(parts);
    }
    components2.length = 0;
    var nestedContexts = componentsContext._b_;
    if (nestedContexts !== void 0) {
      nestedContexts.forEach(function(nestedContext) {
        addComponentsFromContext2(nestedContext, componentsToHydrate);
      });
    }
  }
  function getInitComponentsData(out, componentDefs) {
    const len = componentDefs.length;
    const $global = out.global;
    const isLast = $global.d_;
    const didSerializeComponents = $global._c_;
    const prefix = $global.componentIdPrefix || $global.widgetIdPrefix;
    if (len === 0) {
      if (isLast && didSerializeComponents) {
        return { p: prefix, l: 1 };
      }
      return;
    }
    const TYPE_INDEX = 1;
    const typesLookup = $global._d_ || ($global._d_ = /* @__PURE__ */ new Map());
    let newTypes;
    for (let i = 0; i < len; i++) {
      const componentDef = componentDefs[i];
      const typeName = componentDef[TYPE_INDEX];
      let typeIndex = typesLookup.get(typeName);
      if (typeIndex === void 0) {
        typeIndex = typesLookup.size;
        typesLookup.set(typeName, typeIndex);
        if (newTypes) {
          newTypes.push(typeName);
        } else {
          newTypes = [typeName];
        }
      }
      componentDef[TYPE_INDEX] = typeIndex;
    }
    let serializedGlobals2;
    if (!didSerializeComponents) {
      $global._c_ = true;
      serializedGlobals2 = getSerializedGlobals($global);
    }
    return {
      p: prefix,
      l: isLast && 1,
      g: serializedGlobals2,
      w: componentDefs,
      t: newTypes
    };
  }
  function getInitComponentsDataFromOut(out) {
    const componentsContext = out.b_;
    if (componentsContext === null) {
      return;
    }
    const $global = out.global;
    const runtimeId2 = $global.runtimeId;
    const componentsToHydrate = [];
    addComponentsFromContext2(componentsContext, componentsToHydrate);
    $global.d_ = true;
    const data = getInitComponentsData(out, componentsToHydrate);
    $global.d_ = void 0;
    if (runtimeId2 !== DEFAULT_RUNTIME_ID && data) {
      data.r = runtimeId2;
    }
    return data;
  }
  function writeInitComponentsCode(out) {
    out.script(exports.a_(out));
  }
  exports.a_ = function getInitComponentsCode2(out, componentDefs) {
    const initComponentsData = arguments.length === 2 ? getInitComponentsData(out, componentDefs) : getInitComponentsDataFromOut(out);
    if (initComponentsData === void 0) {
      return "";
    }
    const runtimeId2 = out.global.runtimeId;
    const componentGlobalKey = runtimeId2 === DEFAULT_RUNTIME_ID ? "MC" : runtimeId2 + "_C";
    return `$${componentGlobalKey}=(window.$${componentGlobalKey}||[]).concat(${safeStringify(
      initComponentsData
    )})`;
  };
  exports.__ = addComponentsFromContext2;
  exports.writeInitComponentsCode = writeInitComponentsCode;
  exports.getRenderedComponents = function(out) {
    return warp10.stringifyPrepare(getInitComponentsDataFromOut(out));
  };
})(componentsEntry);
var components = componentsEntry;
var INIT_COMPONENTS_KEY = Symbol();
var addComponentsFromContext = components.__;
var getInitComponentsCode = components.a_;
function addComponentsFromOut(source, target) {
  const sourceOut = source.out || source;
  const targetOut = target || sourceOut;
  const componentsContext = sourceOut.b_;
  const componentDefs = targetOut.writer.get("componentDefs");
  addComponentsFromContext(componentsContext, componentDefs);
}
function addInitScript(writer) {
  const out = writer.state.root;
  const componentDefs = writer.get("componentDefs");
  writer.script(getInitComponentsCode(out, componentDefs));
}
var initComponentsTag = function render(input, out) {
  const $global = out.global;
  if ($global[INIT_COMPONENTS_KEY] === void 0) {
    $global[INIT_COMPONENTS_KEY] = true;
    out.on("await:finish", addComponentsFromOut);
    out.on("c_", addInitScript);
    if (out.isSync() === true) {
      addComponentsFromOut(out);
    } else {
      const asyncOut = out.beginAsync({ last: true, timeout: -1 });
      out.onLast(function(next) {
        let rootOut = out;
        while (rootOut._parentOut) {
          rootOut = rootOut._parentOut;
        }
        addComponentsFromOut(rootOut, asyncOut);
        asyncOut.end();
        next();
      });
    }
  }
};
var _initComponents = /* @__PURE__ */ getDefaultExportFromCjs(initComponentsTag);
var renderTag = function renderTagHelper(handler, input, out, componentDef, key, customEvents) {
  out.c(componentDef, key, customEvents);
  (handler._ || (handler._ = handler.render || handler.renderer || handler))(
    input,
    out
  );
  out._X_ = null;
};
var _marko_tag = /* @__PURE__ */ getDefaultExportFromCjs(renderTag);
var escapeDoubleQuotes = escapeQuotes.m_;
var reordererRenderer = function(input, out) {
  if (out.isSync()) {
    return;
  }
  var global2 = out.global;
  if (global2.__awaitReordererInvoked) {
    return;
  }
  global2.__awaitReordererInvoked = true;
  if (out.global.l_) {
    out.flush();
  }
  var asyncOut = out.beginAsync({
    last: true,
    timeout: -1,
    name: "await-reorderer"
  });
  out.onLast(function(next) {
    var awaitContext = global2.l_;
    var remaining;
    if (!awaitContext || !awaitContext.instances || !(remaining = awaitContext.instances.length)) {
      asyncOut.end();
      next();
      return;
    }
    function handleAwait(awaitInfo) {
      awaitInfo.out.on("c_", out.emit.bind(out, "c_")).on("finish", function(result) {
        if (!global2._afRuntime) {
          asyncOut.script(
            `function $af(d,a,e,l,g,h,k,b,f,c){c=$af;if(a&&!c[a])(c[a+="$"]||(c[a]=[])).push(d);else{e=document;l=e.getElementById("af"+d);g=e.getElementById("afph"+d);h=e.createDocumentFragment();k=l.childNodes;b=0;for(f=k.length;b<f;b++)h.appendChild(k.item(0));g&&g.parentNode.replaceChild(h,g);c[d]=1;if(a=c[d+"$"])for(b=0,f=a.length;b<f;b++)c(a[b])}}`
          );
          global2._afRuntime = true;
        }
        if (global2.cspNonce) {
          asyncOut.write(
            '<style nonce="' + escapeDoubleQuotes(global2.cspNonce) + '">#af' + awaitInfo.id + '{display:none;}</style><div id="af' + awaitInfo.id + '">' + result.toString() + "</div>"
          );
        } else {
          asyncOut.write(
            '<div id="af' + awaitInfo.id + '" style="display:none">' + result.toString() + "</div>"
          );
        }
        asyncOut.script(
          "$af(" + (typeof awaitInfo.id === "number" ? awaitInfo.id : '"' + awaitInfo.id + '"') + (awaitInfo.after ? ',"' + awaitInfo.after + '"' : "") + ")"
        );
        awaitInfo.out.writer = asyncOut.writer;
        out.emit("await:finish", awaitInfo);
        out.flush();
        if (--remaining === 0) {
          asyncOut.end();
          next();
        }
      }).on("error", function(err) {
        asyncOut.error(err);
      });
    }
    awaitContext.instances.forEach(handleAwait);
    out.on("await:clientReorder", function(awaitInfo) {
      remaining++;
      handleAwait(awaitInfo);
    });
    delete awaitContext.instances;
  });
};
var _awaitReorderer = /* @__PURE__ */ getDefaultExportFromCjs(reordererRenderer);
function forceScriptTagAtThisPoint(out) {
  const writer = out.writer;
  out.global.d_ = true;
  const htmlSoFar = writer.toString();
  out.global.d_ = void 0;
  writer.clear();
  writer.write(htmlSoFar);
}
var preferredScriptLocationTag = function render2(input, out) {
  if (out.isSync() === true) {
    forceScriptTagAtThisPoint(out);
  } else {
    const asyncOut = out.beginAsync({ last: true, timeout: -1 });
    out.onLast(function(next) {
      forceScriptTagAtThisPoint(asyncOut);
      asyncOut.end();
      next();
    });
  }
};
var _preferredScriptLocation = /* @__PURE__ */ getDefaultExportFromCjs(preferredScriptLocationTag);
var componentsRegistry = {};
var copyProps$2 = function copyProps(from, to) {
  Object.getOwnPropertyNames(from).forEach(function(name) {
    var descriptor = Object.getOwnPropertyDescriptor(from, name);
    Object.defineProperty(to, name, descriptor);
  });
};
var ServerComponent = class {
  constructor(id, input, out, typeName, customEvents, scope) {
    this.id = id;
    this.U_ = customEvents;
    this.V_ = scope;
    this.typeName = typeName;
    this.W_ = void 0;
    this.Y_ = 0;
    this.onCreate(input, out);
    this.Z_ = this.onInput(input, out) || input;
    if (this.N_ === void 0) {
      this.N_ = this.Z_;
    }
    this.onRender(out);
  }
  set input(newInput) {
    this.N_ = newInput;
  }
  get input() {
    return this.N_;
  }
  set state(newState) {
    this.y_ = newState;
  }
  get state() {
    return this.y_;
  }
  get aA_() {
    return this.y_;
  }
  elId(nestedId) {
    var id = this.id;
    if (nestedId == null) {
      return id;
    } else {
      if (typeof nestedId !== "string") {
        nestedId = String(nestedId);
      }
      if (nestedId.indexOf("#") === 0) {
        id = "#" + id;
        nestedId = nestedId.substring(1);
      }
      return id + "-" + nestedId;
    }
  }
  onCreate() {
  }
  onInput() {
  }
  onRender() {
  }
};
ServerComponent.prototype.getElId = ServerComponent.prototype.elId;
var ServerComponent_1 = ServerComponent;
var copyProps$1 = copyProps$2;
var constructorCache = /* @__PURE__ */ new Map();
var BaseServerComponent = ServerComponent_1;
function createServerComponentClass(renderingLogic) {
  var renderingLogicProps = typeof renderingLogic === "function" ? renderingLogic.prototype : renderingLogic;
  class ServerComponent2 extends BaseServerComponent {
  }
  copyProps$1(renderingLogicProps, ServerComponent2.prototype);
  return ServerComponent2;
}
function createComponent(renderingLogic, id, input, out, typeName, customEvents, scope) {
  let ServerComponent2;
  if (renderingLogic) {
    ServerComponent2 = constructorCache.get(renderingLogic);
    if (!ServerComponent2) {
      ServerComponent2 = createServerComponentClass(renderingLogic);
      constructorCache.set(renderingLogic, ServerComponent2);
    }
  } else {
    ServerComponent2 = BaseServerComponent;
  }
  return new ServerComponent2(id, input, out, typeName, customEvents, scope);
}
componentsRegistry._F_ = true;
componentsRegistry._C_ = createComponent;
var ComponentDef = ComponentDef_1;
var FLAG_WILL_RERENDER_IN_BROWSER = 1;
var FLAG_OLD_HYDRATE_NO_CREATE = 8;
var componentsBeginComponent = function beginComponent(componentsContext, component, key, ownerComponentDef, isSplitComponent, isImplicitComponent, existingComponentDef) {
  var componentId = component.id;
  var componentDef = existingComponentDef || (componentsContext.n_ = new ComponentDef(
    component,
    componentId,
    componentsContext
  ));
  var ownerIsRenderBoundary = ownerComponentDef && ownerComponentDef.s_;
  var ownerWillRerender = ownerComponentDef && ownerComponentDef.t_ & FLAG_WILL_RERENDER_IN_BROWSER;
  if (!componentsContext.u_ && ownerWillRerender) {
    componentDef.t_ |= FLAG_WILL_RERENDER_IN_BROWSER;
    componentDef._wrr = true;
    return componentDef;
  }
  if (isImplicitComponent === true) {
    return componentDef;
  }
  componentsContext.b_.push(componentDef);
  let out = componentsContext.q_;
  let runtimeId2 = out.global.runtimeId;
  componentDef.s_ = true;
  componentDef.v_ = componentsContext.u_;
  if (isSplitComponent === false && out.global.noBrowserRerender !== true) {
    componentDef.t_ |= FLAG_WILL_RERENDER_IN_BROWSER;
    componentDef._wrr = true;
    componentsContext.u_ = false;
  }
  if (out.global.oldHydrateNoCreate === true) {
    componentDef.t_ |= FLAG_OLD_HYDRATE_NO_CREATE;
  }
  if ((ownerIsRenderBoundary || ownerWillRerender) && key != null) {
    out.w(
      "<!--" + runtimeId2 + "^" + componentId + " " + ownerComponentDef.id + " " + key + "-->"
    );
  } else {
    out.w("<!--" + runtimeId2 + "#" + componentId + "-->");
  }
  return componentDef;
};
var ComponentsContext$1 = ComponentsContextExports;
var getComponentsContext$1 = ComponentsContext$1.R_;
var componentsEndComponent = function endComponent(out, componentDef) {
  if (componentDef.s_) {
    out.w("<!--" + out.global.runtimeId + "/-->");
    getComponentsContext$1(out).u_ = componentDef.v_;
  }
};
var componentsUtil = componentsUtil$3;
var componentLookup = componentsUtil._i_;
var ComponentsContext = ComponentsContextExports;
var getComponentsContext = ComponentsContext.R_;
var registry = componentsRegistry;
var copyProps2 = copyProps$2;
var isServer = componentsUtil._F_ === true;
var beginComponent2 = componentsBeginComponent;
var endComponent2 = componentsEndComponent;
var COMPONENT_BEGIN_ASYNC_ADDED_KEY = "$wa";
function resolveComponentKey(key, parentComponentDef) {
  if (key[0] === "#") {
    return key.substring(1);
  } else {
    return parentComponentDef.id + "-" + parentComponentDef.aK_(key);
  }
}
function trackAsyncComponents(out) {
  if (out.isSync() || out.global[COMPONENT_BEGIN_ASYNC_ADDED_KEY]) {
    return;
  }
  out.on("beginAsync", handleBeginAsync);
  out.on("beginDetachedAsync", handleBeginDetachedAsync);
  out.global[COMPONENT_BEGIN_ASYNC_ADDED_KEY] = true;
}
function handleBeginAsync(event) {
  var parentOut = event.parentOut;
  var asyncOut = event.out;
  var componentsContext = parentOut.b_;
  if (componentsContext !== void 0) {
    asyncOut.b_ = new ComponentsContext(asyncOut, componentsContext);
  }
  asyncOut.c(
    parentOut._X_,
    parentOut._Y_,
    parentOut.b__
  );
}
function handleBeginDetachedAsync(event) {
  var asyncOut = event.out;
  handleBeginAsync(event);
  asyncOut.on("beginAsync", handleBeginAsync);
  asyncOut.on("beginDetachedAsync", handleBeginDetachedAsync);
}
function createRendererFunc(templateRenderFunc, componentProps, renderingLogic) {
  var onInput = renderingLogic && renderingLogic.onInput;
  var typeName = componentProps.t;
  var isSplit = componentProps.s === true;
  var isImplicitComponent = componentProps.i === true;
  var shouldApplySplitMixins = renderingLogic && isSplit;
  if (componentProps.d) {
    throw new Error("Runtime/NODE_ENV Mismatch");
  }
  return function renderer2(input, out) {
    trackAsyncComponents(out);
    var componentsContext = getComponentsContext(out);
    var globalComponentsContext = componentsContext.o_;
    var component = globalComponentsContext.ax_;
    var isRerender = component !== void 0;
    var id;
    var isExisting;
    var customEvents;
    var parentComponentDef = componentsContext.n_;
    var ownerComponentDef = out._X_;
    var ownerComponentId = ownerComponentDef && ownerComponentDef.id;
    var key = out._Y_;
    if (component) {
      id = component.id;
      isExisting = true;
      globalComponentsContext.ax_ = null;
    } else {
      if (parentComponentDef) {
        customEvents = out.b__;
        if (key != null) {
          id = resolveComponentKey(key.toString(), parentComponentDef);
        } else {
          id = parentComponentDef.aL_();
        }
      } else {
        id = globalComponentsContext.aL_();
      }
    }
    if (isServer) {
      component = registry._C_(
        renderingLogic,
        id,
        input,
        out,
        typeName,
        customEvents,
        ownerComponentId
      );
      input = component.Z_;
    } else {
      if (!component) {
        if (isRerender && (component = componentLookup[id]) && component._m_ !== typeName) {
          component.destroy();
          component = void 0;
        }
        if (component) {
          isExisting = true;
        } else {
          isExisting = false;
          component = registry._C_(typeName, id);
          if (shouldApplySplitMixins === true) {
            shouldApplySplitMixins = false;
            var renderingLogicProps = typeof renderingLogic == "function" ? renderingLogic.prototype : renderingLogic;
            copyProps2(renderingLogicProps, component.constructor.prototype);
          }
        }
        component.___ = true;
        if (customEvents !== void 0) {
          component.aB_(customEvents, ownerComponentId);
        }
        if (isExisting === false) {
          component.aD_(input, out);
        }
        input = component._g_(input, onInput, out);
        if (isExisting === true) {
          if (component.as_ === false || component.shouldUpdate(input, component.y_) === false) {
            out.ba_(component);
            globalComponentsContext.p_[id] = true;
            component._p_();
            return;
          }
        }
      }
      component.ai_ = out.global;
      component.aE_(out);
    }
    var componentDef = beginComponent2(
      componentsContext,
      component,
      key,
      ownerComponentDef,
      isSplit,
      isImplicitComponent
    );
    componentDef._q_ = isExisting;
    templateRenderFunc(
      input,
      out,
      componentDef,
      component,
      component.aA_,
      out.global
    );
    endComponent2(out, componentDef);
    componentsContext.n_ = parentComponentDef;
  };
}
var renderer = createRendererFunc;
createRendererFunc.aU_ = resolveComponentKey;
createRendererFunc.aY_ = trackAsyncComponents;
var _marko_renderer = /* @__PURE__ */ getDefaultExportFromCjs(renderer);
var _marko_componentType$v = "N7u5zc6D";
var _marko_template$v = t(_marko_componentType$v);
var _marko_component$v = {};
_marko_template$v._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  out.w(`<!doctype html><html lang=en><head>${_marko_to_string(out.global.___viteRenderAssets("head-prepend"))}<meta charset=UTF-8><link rel=icon type=image/png sizes=32x32${_marko_attr("href", _asset)}><meta name=viewport content="width=device-width, initial-scale=1.0"><meta name=description content="A basic Marko app."><link href=https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css rel=stylesheet integrity=sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC crossorigin=anonymous><script src=https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js integrity=sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p crossorigin=anonymous><\/script><script src=https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js integrity=sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF crossorigin=anonymous><\/script><title>${x($global.meta.pageTitle || "Marko")}</title>${_marko_to_string(out.global.___viteRenderAssets("head"))}</head><body>${_marko_to_string(out.global.___viteRenderAssets("body-prepend"))}`);
  _marko_dynamic_tag(out, input.renderBody, null, null, null, null, _componentDef, "11");
  out.w(_marko_to_string(out.global.___viteRenderAssets("body")));
  _marko_tag(_initComponents, {}, out, _componentDef, "12");
  _marko_tag(_awaitReorderer, {}, out, _componentDef, "13");
  _marko_tag(_preferredScriptLocation, {}, out, _componentDef, "14");
  out.w("</body></html>");
}, {
  t: _marko_componentType$v,
  i: true
}, _marko_component$v);
var _marko_componentType$u = "L5zSetlG";
var _marko_template$u = t(_marko_componentType$u);
var _marko_component$u = {};
_marko_template$u._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  out.w('<nav class="navbar navbar-expand-lg navbar-dark bg-primary"><div class=container-fluid><a class=navbar-brand href=dashboard><img src=https://w7.pngwing.com/pngs/18/910/png-transparent-paw-dog-paw-dog-bone-animals-animal-black.png alt width=50 height=24 class="d-inline-block align-text-top"> Adopet.me</a><button class=navbar-toggler type=button data-bs-toggle=collapse data-bs-target=#navbarNav aria-controls=navbarNav aria-expanded=false aria-label="Toggle navigation"><span class=navbar-toggler-icon></span></button><div class="collapse navbar-collapse" id=navbarNav><ul class=navbar-nav><li class=nav-item><a class="nav-link active" aria-current=page href=dashboard>Pagina Inicial</a></li><li class=nav-item><a class=nav-link href=contatos>Contatos</a></li><li class=nav-item><a class=nav-link href=perfil>Perfil</a></li></ul></div></div></nav>');
}, {
  t: _marko_componentType$u,
  i: true
}, _marko_component$u);
var _marko_componentType$t = "XPCuDkfN";
var _marko_template$t = t(_marko_componentType$t);
var _marko_component$t = {};
_marko_template$t._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  out.w("<main>");
  _marko_tag(_marko_template$u, {}, out, _componentDef, "1");
  out.w("<div class=container-fluid>");
  _marko_dynamic_tag(out, input.renderBody, null, null, null, null, _componentDef, "3");
  out.w("</div></main>");
}, {
  t: _marko_componentType$t,
  i: true
}, _marko_component$t);
var _marko_componentType$s = "0zj6U2M8";
var _marko_template$s = t(_marko_componentType$s);
var _marko_component$s = {};
_marko_template$s._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  _marko_tag(_marko_template$t, {
    "renderBody": (out2) => {
      out2.w("<h1>Contatos</h1>");
    }
  }, out, _componentDef, "0");
}, {
  t: _marko_componentType$s,
  i: true
}, _marko_component$s);
var _marko_componentType$r = "S7JaHCXX";
var _marko_template$r = t(_marko_componentType$r);
var _marko_component$r = {};
_marko_template$r._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  _marko_dynamic_tag(out, _marko_template$v, () => ({
    ...input
  }), (out2) => {
    _marko_dynamic_tag(out2, _marko_template$s, () => input, null, null, null, _componentDef, "1");
  }, null, null, _componentDef, "0");
}, {
  t: _marko_componentType$r,
  i: true
}, _marko_component$r);
var BufferedWriter = BufferedWriter_1;
var __flush_here_and_after__ = function __flushHereAndAfter__(input, out) {
  if (out.isSync()) {
    out._sync = false;
    const asyncOut = out.beginAsync({ last: true });
    out._sync = true;
    asyncOut.sync();
    out.onLast(() => {
      input.renderBody(asyncOut);
      asyncOut.end();
    });
  } else {
    let flushed = false;
    const asyncOut = out.beginAsync({ last: true });
    const nextWriter = out.writer;
    out.on("c_", (writer) => {
      if (writer instanceof BufferedWriter) {
        if (flushed) {
          const detachedOut = out.createOut();
          detachedOut.sync();
          input.renderBody(detachedOut);
          writer._content = detachedOut.toString() + writer._content;
        } else if (writer.next === nextWriter) {
          asyncOut.sync();
          input.renderBody(asyncOut);
          asyncOut.end();
          flushed = true;
        }
      }
    });
    out.onLast(() => {
      if (!flushed) {
        asyncOut.sync();
        input.renderBody(asyncOut);
        asyncOut.end();
        flushed = true;
      }
    });
  }
};
var _flush_here_and_after__ = /* @__PURE__ */ getDefaultExportFromCjs(__flush_here_and_after__);
var _marko_componentType$q = "VTNx1mm9";
var _marko_template$q = t(_marko_componentType$q);
function renderAssets(slot) {
  const entries = this.___viteEntries;
  let html = "";
  if (entries) {
    const slotWrittenEntriesKey = `___viteWrittenEntries-${slot}`;
    const lastWrittenEntry = this[slotWrittenEntriesKey] || 0;
    const writtenEntries = this[slotWrittenEntriesKey] = entries.length;
    for (let i = lastWrittenEntry; i < writtenEntries; i++) {
      let entry = entries[i];
      if (typeof __MARKO_MANIFEST__ === "object") {
        entry = __MARKO_MANIFEST__[entry] || {};
      } else if (slot === "head") {
        const {
          entries: entries2
        } = entry;
        if (entries2) {
          let sep = "";
          html += `<script${this.___viteInjectAttrs}>((root=document.documentElement)=>{`;
          html += "root.style.visibility='hidden';";
          html += "document.currentScript.remove();";
          html += "Promise.allSettled([";
          for (const id of entries2) {
            html += `${sep}import(${JSON.stringify(this.___viteBasePath + id)})`;
            sep = ",";
          }
          html += "]).then(()=>{";
          html += "root.style.visibility='';";
          html += "if(root.getAttribute('style')==='')root.removeAttribute('style')";
          html += "})})()<\/script>";
        }
      }
      const parts = entry[slot];
      if (parts) {
        for (const part of parts) {
          html += part === 0 ? this.___viteInjectAttrs : part === 1 ? this.___viteBasePath : part;
        }
      }
    }
  }
  return html;
}
var _marko_component$q = {};
_marko_template$q._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  if (!out.global.___viteRenderAssets) {
    out.global.___viteInjectAttrs = out.global.cspNonce ? ` nonce="${out.global.cspNonce.replace(/"/g, "&#39;")}"` : "";
    out.global.___viteRenderAssets = renderAssets;
    out.global.___viteBasePath = input.base || "/";
  }
  _marko_tag(_flush_here_and_after__, {
    "renderBody": (out2) => {
      if (input.base && !out2.global.___flushedMBP) {
        out2.global.___flushedMBP = true;
        out2.w(_marko_to_string(`<script${out2.global.___viteInjectAttrs}>${out2.global.___viteBaseVar}=${JSON.stringify(input.base)}<\/script>`));
      }
      out2.w(_marko_to_string(out2.global.___viteRenderAssets(input.slot)));
    }
  }, out, _componentDef, "0");
}, {
  t: _marko_componentType$q,
  i: true
}, _marko_component$q);
var _marko_componentType$p = "gHaWg6Al";
var _marko_template$p = t(_marko_componentType$p);
var _marko_component$p = {};
_marko_template$p._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  out.global.___viteBaseVar = "$mbp";
  (out.global.___viteEntries || (out.global.___viteEntries = [])).push("__marko-run__route__contatos_t-UI");
  _marko_tag(_marko_template$q, {
    "slot": "head-prepend"
  }, out, _componentDef, "0");
  _marko_tag(_marko_template$q, {
    "slot": "head"
  }, out, _componentDef, "1");
  _marko_tag(_marko_template$q, {
    "slot": "body-prepend"
  }, out, _componentDef, "2");
  _marko_tag(_marko_template$r, input, out, _componentDef, "3");
  _marko_tag(_initComponents, {}, out, _componentDef, "4");
  _marko_tag(_awaitReorderer, {}, out, _componentDef, "5");
  _marko_tag(_marko_template$q, {
    "slot": "body"
  }, out, _componentDef, "6");
}, {
  t: _marko_componentType$p,
  i: true
}, _marko_component$p);
async function get1(context, buildInput) {
  return pageResponse(_marko_template$p, buildInput());
}
var _marko_componentType$o = "4PFQbMkC";
var _marko_template$o = t(_marko_componentType$o);
var _marko_component$o = {};
_marko_template$o._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  out.w('<div class=card style="width: 18rem"><img src=https://veja.abril.com.br/wp-content/uploads/2017/01/cao-labrador-3-copy.jpg class="card-img-top text-center img-fluid" alt=...><div class=card-body><h5 class=card-title>Meg</h5><h6 class="card-subtitle mb-2"><a href=institute-details class=link-secondary id=nameOng>Patinhas Caridosas</a></h6><ul class="list-group list-group-flush"><li class=list-group-item>Ra\xE7a: Labrador</li><li class=list-group-item>Sexo: femea</li></ul><div class=card-body><a href=pet-details class="btn btn-outline-primary">Ver Detalhes</a></div></div></div>');
}, {
  t: _marko_componentType$o,
  i: true
}, _marko_component$o);
var _marko_componentType$n = "USE/Xj8P";
var _marko_template$n = t(_marko_componentType$n);
var _marko_component$n = {};
_marko_template$n._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  _marko_tag(_marko_template$t, {
    "renderBody": (out2) => {
      out2.w('<div class=row><div class="col-2 p-5"><div class="d-grid gap-3"><button class="btn btn-outline-secondary">Macho</button><button class="btn btn-outline-secondary" id=sexo>Femea</button><button class="btn btn-outline-secondary">Adulto</button><button class="btn btn-outline-secondary">Filhote</button><button class="btn btn-outline-secondary">Castrado</button></div></div><div class="col p-5"><div class=row><h2 class=m-0>Animais disponiveis para ado\xE7\xE3o</h2></div><hr><div class=row><div class="gap-5 d-flex flex-wrap">');
      _marko_tag(_marko_template$o, {}, out2, _componentDef, "15");
      _marko_tag(_marko_template$o, {}, out2, _componentDef, "16");
      _marko_tag(_marko_template$o, {}, out2, _componentDef, "17");
      _marko_tag(_marko_template$o, {}, out2, _componentDef, "18");
      _marko_tag(_marko_template$o, {}, out2, _componentDef, "19");
      _marko_tag(_marko_template$o, {}, out2, _componentDef, "20");
      out2.w("</div></div></div></div>");
    }
  }, out, _componentDef, "0");
}, {
  t: _marko_componentType$n,
  i: true
}, _marko_component$n);
var _marko_componentType$m = "T1KzUGih";
var _marko_template$m = t(_marko_componentType$m);
var _marko_component$m = {};
_marko_template$m._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  _marko_dynamic_tag(out, _marko_template$v, () => ({
    ...input
  }), (out2) => {
    _marko_dynamic_tag(out2, _marko_template$n, () => input, null, null, null, _componentDef, "1");
  }, null, null, _componentDef, "0");
}, {
  t: _marko_componentType$m,
  i: true
}, _marko_component$m);
var _marko_componentType$l = "WtQytCl9";
var _marko_template$l = t(_marko_componentType$l);
var _marko_component$l = {};
_marko_template$l._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  out.global.___viteBaseVar = "$mbp";
  (out.global.___viteEntries || (out.global.___viteEntries = [])).push("__marko-run__route__dashboard_Jp-l");
  _marko_tag(_marko_template$q, {
    "slot": "head-prepend"
  }, out, _componentDef, "0");
  _marko_tag(_marko_template$q, {
    "slot": "head"
  }, out, _componentDef, "1");
  _marko_tag(_marko_template$q, {
    "slot": "body-prepend"
  }, out, _componentDef, "2");
  _marko_tag(_marko_template$m, input, out, _componentDef, "3");
  _marko_tag(_initComponents, {}, out, _componentDef, "4");
  _marko_tag(_awaitReorderer, {}, out, _componentDef, "5");
  _marko_tag(_marko_template$q, {
    "slot": "body"
  }, out, _componentDef, "6");
}, {
  t: _marko_componentType$l,
  i: true
}, _marko_component$l);
async function get2(context, buildInput) {
  return pageResponse(_marko_template$l, buildInput());
}
var _marko_componentType$k = "1yw/ltwh";
var _marko_template$k = t(_marko_componentType$k);
var _marko_component$k = {};
_marko_template$k._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  _marko_tag(_marko_template$t, {
    "renderBody": (out2) => {
      out2.w('<div class=row><div class="col-2 p-5"><div class="d-grid gap-3"><img src=https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500 height=200 class="rounded float-start" alt="Foto de Perfil"><p><a href=https://www.patinhascarentes.org/home class=link-primary>Quem Somos</a></p></div></div><div class="col p-5"><div class=row><h2 class=m-0>Animais desta ong dispon\xEDveis</h2></div><hr><div class=row><div class="gap-5 d-flex flex-wrap">');
      _marko_tag(_marko_template$o, {}, out2, _componentDef, "13");
      _marko_tag(_marko_template$o, {}, out2, _componentDef, "14");
      _marko_tag(_marko_template$o, {}, out2, _componentDef, "15");
      _marko_tag(_marko_template$o, {}, out2, _componentDef, "16");
      _marko_tag(_marko_template$o, {}, out2, _componentDef, "17");
      _marko_tag(_marko_template$o, {}, out2, _componentDef, "18");
      out2.w("</div></div></div></div>");
    }
  }, out, _componentDef, "0");
}, {
  t: _marko_componentType$k,
  i: true
}, _marko_component$k);
var _marko_componentType$j = "YpqyHm5s";
var _marko_template$j = t(_marko_componentType$j);
var _marko_component$j = {};
_marko_template$j._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  _marko_dynamic_tag(out, _marko_template$v, () => ({
    ...input
  }), (out2) => {
    _marko_dynamic_tag(out2, _marko_template$k, () => input, null, null, null, _componentDef, "1");
  }, null, null, _componentDef, "0");
}, {
  t: _marko_componentType$j,
  i: true
}, _marko_component$j);
var _marko_componentType$i = "0ioie5sK";
var _marko_template$i = t(_marko_componentType$i);
var _marko_component$i = {};
_marko_template$i._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  out.global.___viteBaseVar = "$mbp";
  (out.global.___viteEntries || (out.global.___viteEntries = [])).push("__marko-run__route__institutedetails_-jc4");
  _marko_tag(_marko_template$q, {
    "slot": "head-prepend"
  }, out, _componentDef, "0");
  _marko_tag(_marko_template$q, {
    "slot": "head"
  }, out, _componentDef, "1");
  _marko_tag(_marko_template$q, {
    "slot": "body-prepend"
  }, out, _componentDef, "2");
  _marko_tag(_marko_template$j, input, out, _componentDef, "3");
  _marko_tag(_initComponents, {}, out, _componentDef, "4");
  _marko_tag(_awaitReorderer, {}, out, _componentDef, "5");
  _marko_tag(_marko_template$q, {
    "slot": "body"
  }, out, _componentDef, "6");
}, {
  t: _marko_componentType$i,
  i: true
}, _marko_component$i);
async function get3(context, buildInput) {
  return pageResponse(_marko_template$i, buildInput());
}
var _marko_componentType$h = "MfzYyXj4";
var _marko_template$h = t(_marko_componentType$h);
var _marko_component$h = {};
_marko_template$h._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  out.w('<div class=row><div class="col-2 p-5"><div class="d-grid gap-3"><img src=https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500 height=200 class="rounded float-start" alt="Foto de Perfil"><p><a href=# class=link-primary>Informa\xE7\xF5es</a></p><p><a href=pet-register class=link-primary>Cadastrar Pet</a></p></div></div><div class="col p-5"><div class=row><h2 class=m-0>Nome da Institui\xE7\xE3o</h2></div><hr><div class=row><div class=gap-5><form><div class=row><div class=col><div class=mb-3><label for=instituteName class="form-label form-control-label">Nome da Institui\xE7\xE3o</label><input type=text class=form-control id=instituteName name=instituteName required></div><div class=mb-3><label for=directorName class="form-label form-control-label">Nome do Diretor</label><input type=text class=form-control id=directorName name=directorName required></div></div><div class=col><div class=mb-3><label for=instituteDocument class="form-label form-control-label">CNPJ</label><input type=text class=form-control id=instituteDocument name=instituteDocument required></div><div class=mb-3><label for=instituteAddress class="form-label form-control-label">Endere\xE7o</label><input type=text class=form-control id=instituteAddress name=instituteAddress required></div></div></div><hr><div class=row><div class=col><div class=mb-3><label for=instituteAddressNumber class="form-label form-control-label">N\xFAmero</label><input type=text class=form-control id=instituteAddressNumber name=instituteAddressNumber required></div><div class=mb-3><label for=instituteAddressNumberComplement class="form-label form-control-label">Complemento</label><input type=text class=form-control id=instituteAddressComplement name=instituteAddressNumberComplement required></div></div><div class=col><div class=mb-3><label for=instituteAddressNumberCep class="form-label form-control-label">CEP</label><input type=text class=form-control id=instituteAddressNumberCep name=instituteAddressNumberCep required></div><div class=mb-3><label for=instituteTelephoneSignup class="form-label form-control-label">Telefone</label><input type=text class=form-control id=instituteTelephoneSignup name=instituteTelephoneSignup required></div></div></div><hr><div class=row><div class=col><div class=mb-3><label for=instituteEmailSignup class="form-label form-control-label">E-mail</label><input type=text class=form-control id=instituteEmailSignup name=instituteEmailSignup required></div><div class=mb-3><label for=institutePasswordSignup class="form-label form-control-label">Senha</label><input type=text class=form-control id=institutePasswordSignup name=institutePasswordSignup required></div></div></div><div class="d-flex justify-content-between"><a href=dashboard><button type=button class="btn btn-outline-secondary login-button">Voltar</button></a><button class="btn btn-primary login-button">Editar</button></div></form></div></div></div></div>');
}, {
  t: _marko_componentType$h,
  i: true
}, _marko_component$h);
var _marko_componentType$g = "SIR2DrQ+";
var _marko_template$g = t(_marko_componentType$g);
var _marko_component$g = {};
_marko_template$g._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  _marko_tag(_marko_template$t, {
    "renderBody": (out2) => {
      _marko_tag(_marko_template$h, {}, out2, _componentDef, "1");
    }
  }, out, _componentDef, "0");
}, {
  t: _marko_componentType$g,
  i: true
}, _marko_component$g);
var _marko_componentType$f = "83G6e+ct";
var _marko_template$f = t(_marko_componentType$f);
var _marko_component$f = {};
_marko_template$f._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  _marko_dynamic_tag(out, _marko_template$v, () => ({
    ...input
  }), (out2) => {
    _marko_dynamic_tag(out2, _marko_template$g, () => input, null, null, null, _componentDef, "1");
  }, null, null, _componentDef, "0");
}, {
  t: _marko_componentType$f,
  i: true
}, _marko_component$f);
var _marko_componentType$e = "WNNN5SzK";
var _marko_template$e = t(_marko_componentType$e);
var _marko_component$e = {};
_marko_template$e._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  out.global.___viteBaseVar = "$mbp";
  (out.global.___viteEntries || (out.global.___viteEntries = [])).push("__marko-run__route__perfil_wBQ2");
  _marko_tag(_marko_template$q, {
    "slot": "head-prepend"
  }, out, _componentDef, "0");
  _marko_tag(_marko_template$q, {
    "slot": "head"
  }, out, _componentDef, "1");
  _marko_tag(_marko_template$q, {
    "slot": "body-prepend"
  }, out, _componentDef, "2");
  _marko_tag(_marko_template$f, input, out, _componentDef, "3");
  _marko_tag(_initComponents, {}, out, _componentDef, "4");
  _marko_tag(_awaitReorderer, {}, out, _componentDef, "5");
  _marko_tag(_marko_template$q, {
    "slot": "body"
  }, out, _componentDef, "6");
}, {
  t: _marko_componentType$e,
  i: true
}, _marko_component$e);
async function get4(context, buildInput) {
  return pageResponse(_marko_template$e, buildInput());
}
var _marko_componentType$d = "7JLXKsmp";
var _marko_template$d = t(_marko_componentType$d);
var _marko_component$d = {};
_marko_template$d._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  out.w(`<script>\r
    async function getAnimal() {\r
            var response = await fetch("http://localhost:8080/api/getAllAnimal");\r
            var result = await response.json();\r
            // pet name input\r
            var inputPetName = document.getElementById('petName');\r
            var nomeAnimal = result[0].nomeAnimal;\r
            inputPetName.value = nomeAnimal;\r
\r
            // pet genre input\r
            var inputPetGenre = document.getElementById('petGenre');\r
            var sexo = result[0].sexo;\r
            inputPetGenre.value = sexo;\r
           \r
           // pet race input\r
            var inputPetRace = document.getElementById('petRace');\r
            var race = result[0].tipoRaca\r
            inputPetRace.value = race;\r
                   \r
    }\r
    getAnimal()\r
<\/script>`);
  _marko_tag(_marko_template$t, {
    "renderBody": (out2) => {
      out2.w('<div class="container p-4"><div class="row justify-content-center"><div class=col-4><div class="input-group mb-3"><span class=input-group-text id=inputGroup-sizing-default for=petName>Nome:</span><input type=text class=form-control id=petName aria-label="Sizing example input" aria-describedby=inputGroup-sizing-default disabled></div><div class="input-group mb-3"><span class=input-group-text id=inputGroup-sizing-default for=petGenre>Sexo:</span><input type=text class=form-control id=petGenre aria-label="Sizing example input" aria-describedby=inputGroup-sizing-default disabled></div><div class="input-group mb-3"><span class=input-group-text id=inputGroup-sizing-default for=petAge>Idade:</span><input type=text class=form-control id=petAge aria-label="Sizing example input" aria-describedby=inputGroup-sizing-default></div><div class="input-group mb-3"><span class=input-group-text id=inputGroup-sizing-default for=petType>Tipo:</span><input type=text class=form-control id=petType aria-label="Sizing example input" aria-describedby=inputGroup-sizing-default></div><div class="input-group mb-3"><span class=input-group-text id=inputGroup-sizing-default for=petRace>Ra\xE7a:</span><input type=text class=form-control id=petRace aria-label="Sizing example input" aria-describedby=inputGroup-sizing-default disabled></div><div class="input-group mb-3"><span class=input-group-text id=inputGroup-sizing-default for=petCastration>Castra\xE7\xE3o:</span><input type=text class=form-control id=petCastration aria-label="Sizing example input" aria-describedby=inputGroup-sizing-default></div><div class="row justify-content-center"><div class="col p-2"><div class="d-grid gap-2 mx-auto"><button class="btn btn-outline-primary" type=button id=adoptPetButton>Adotar</button></div></div></div></div><div class=col-1><div class="d-flex opacity-100" style="height: 100px"><div class=vr></div></div></div><div class=col-6><div id=carouselExample class="carousel slide"><div class=carousel-inner><div class="carousel-item active"><img src=https://veja.abril.com.br/wp-content/uploads/2017/01/cao-labrador-3-copy.jpg class="d-block w-100 rounded" alt=...></div><div class=carousel-item><img src=https://veja.abril.com.br/wp-content/uploads/2017/01/cao-labrador-3-copy.jpg class="d-block w-100 rounded" alt=...></div><div class=carousel-item><img src=https://veja.abril.com.br/wp-content/uploads/2017/01/cao-labrador-3-copy.jpg class="d-block w-100 rounded" alt=...></div></div><button class=carousel-control-prev type=button data-bs-target=#carouselExample data-bs-slide=prev><span class=carousel-control-prev-icon aria-hidden=true></span><span class=visually-hidden>Previous</span></button><button class=carousel-control-next type=button data-bs-target=#carouselExample data-bs-slide=next><span class=carousel-control-next-icon aria-hidden=true></span><span class=visually-hidden>Next</span></button></div></div></div></div>');
    }
  }, out, _componentDef, "1");
}, {
  t: _marko_componentType$d,
  i: true
}, _marko_component$d);
var _marko_componentType$c = "fd7Ic736";
var _marko_template$c = t(_marko_componentType$c);
var _marko_component$c = {};
_marko_template$c._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  _marko_dynamic_tag(out, _marko_template$v, () => ({
    ...input
  }), (out2) => {
    _marko_dynamic_tag(out2, _marko_template$d, () => input, null, null, null, _componentDef, "1");
  }, null, null, _componentDef, "0");
}, {
  t: _marko_componentType$c,
  i: true
}, _marko_component$c);
var _marko_componentType$b = "z+xZbGhL";
var _marko_template$b = t(_marko_componentType$b);
var _marko_component$b = {};
_marko_template$b._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  out.global.___viteBaseVar = "$mbp";
  (out.global.___viteEntries || (out.global.___viteEntries = [])).push("__marko-run__route__petdetails_kE5J");
  _marko_tag(_marko_template$q, {
    "slot": "head-prepend"
  }, out, _componentDef, "0");
  _marko_tag(_marko_template$q, {
    "slot": "head"
  }, out, _componentDef, "1");
  _marko_tag(_marko_template$q, {
    "slot": "body-prepend"
  }, out, _componentDef, "2");
  _marko_tag(_marko_template$c, input, out, _componentDef, "3");
  _marko_tag(_initComponents, {}, out, _componentDef, "4");
  _marko_tag(_awaitReorderer, {}, out, _componentDef, "5");
  _marko_tag(_marko_template$q, {
    "slot": "body"
  }, out, _componentDef, "6");
}, {
  t: _marko_componentType$b,
  i: true
}, _marko_component$b);
async function get5(context, buildInput) {
  return pageResponse(_marko_template$b, buildInput());
}
var _marko_componentType$a = "EJWgYZFH";
var _marko_template$a = t(_marko_componentType$a);
var _marko_component$a = {};
_marko_template$a._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  _marko_tag(_marko_template$t, {
    "renderBody": (out2) => {
      out2.w('<div class="container p-4"><div class="row justify-content-center"><div class=col-4><div class="input-group mb-3"><span class=input-group-text id=inputGroup-sizing-default for=petName>Nome:</span><input type=text class=form-control id=petName aria-label="Sizing example input" aria-describedby=inputGroup-sizing-default></div><div class="input-group mb-3"><span class=input-group-text id=inputGroup-sizing-default for=petGenre>Sexo:</span><input type=text class=form-control id=petGenre aria-label="Sizing example input" aria-describedby=inputGroup-sizing-default></div><div class="input-group mb-3"><span class=input-group-text id=inputGroup-sizing-default for=petAge>Idade:</span><input type=number min=1 max=20 class=form-control id=petAge aria-label="Sizing example input" aria-describedby=inputGroup-sizing-default></div><div class="input-group mb-3"><span class=input-group-text id=inputGroup-sizing-default for=petType>Tipo:</span><input type=text class=form-control id=petType aria-label="Sizing example input" aria-describedby=inputGroup-sizing-default></div><div class="input-group mb-3"><span class=input-group-text id=inputGroup-sizing-default for=petRace>Ra\xE7a:</span><input type=text class=form-control id=petRace aria-label="Sizing example input" aria-describedby=inputGroup-sizing-default></div><div class="input-group mb-3"><span class=input-group-text id=inputGroup-sizing-default for=petCastration>Castra\xE7\xE3o:</span><input type=text class=form-control id=petCastration aria-label="Sizing example input" aria-describedby=inputGroup-sizing-default></div><div class="row justify-content-center"><div class="col p-2"><div class="d-grid gap-2"><a href=dashboard><button class="btn btn-primary" type=button id=registerPetButton>Cadastrar Pet</button></a></div></div></div></div><div class=col-2></div><div class=col-6><img src=https://w7.pngwing.com/pngs/509/597/png-transparent-picture-photo-camera-photography-image-gallery-media-instagram-icon-thumbnail.png class=img-fluid alt=...><div class="row justify-content-center"><div class="col p-4"><div class=mb-2><input class="form-control btn btn-outline-primary" type=file id=formFile></div></div></div></div></div></div>');
    }
  }, out, _componentDef, "0");
}, {
  t: _marko_componentType$a,
  i: true
}, _marko_component$a);
var _marko_componentType$9 = "WO/vx7+R";
var _marko_template$9 = t(_marko_componentType$9);
var _marko_component$9 = {};
_marko_template$9._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  _marko_dynamic_tag(out, _marko_template$v, () => ({
    ...input
  }), (out2) => {
    _marko_dynamic_tag(out2, _marko_template$a, () => input, null, null, null, _componentDef, "1");
  }, null, null, _componentDef, "0");
}, {
  t: _marko_componentType$9,
  i: true
}, _marko_component$9);
var _marko_componentType$8 = "ko7soIwY";
var _marko_template$8 = t(_marko_componentType$8);
var _marko_component$8 = {};
_marko_template$8._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  out.global.___viteBaseVar = "$mbp";
  (out.global.___viteEntries || (out.global.___viteEntries = [])).push("__marko-run__route__petregister_46ln");
  _marko_tag(_marko_template$q, {
    "slot": "head-prepend"
  }, out, _componentDef, "0");
  _marko_tag(_marko_template$q, {
    "slot": "head"
  }, out, _componentDef, "1");
  _marko_tag(_marko_template$q, {
    "slot": "body-prepend"
  }, out, _componentDef, "2");
  _marko_tag(_marko_template$9, input, out, _componentDef, "3");
  _marko_tag(_initComponents, {}, out, _componentDef, "4");
  _marko_tag(_awaitReorderer, {}, out, _componentDef, "5");
  _marko_tag(_marko_template$q, {
    "slot": "body"
  }, out, _componentDef, "6");
}, {
  t: _marko_componentType$8,
  i: true
}, _marko_component$8);
async function get6(context, buildInput) {
  return pageResponse(_marko_template$8, buildInput());
}
var _marko_componentType$7 = "em/XjKNS";
var _marko_template$7 = t(_marko_componentType$7);
var _marko_component$7 = {};
_marko_template$7._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  out.w('<form action><div class=main-content><div class=content-login><div class=login-form><div class=col-md-8><div class=login-container><h2 class="login-title text-center">Cadastro</h2><form><div class=row><div class=col><div class=mb-3><label for=instituteName class="form-label form-control-label">Nome da Institui\xE7\xE3o</label><input type=text class=form-control id=instituteName name=instituteName required></div><div class=mb-3><label for=directorName class="form-label form-control-label">Nome do Diretor</label><input type=text class=form-control id=directorName name=directorName required></div></div><div class=col><div class=mb-3><label for=instituteDocument class="form-label form-control-label">CNPJ</label><input type=text class=form-control id=instituteDocument name=instituteDocument required></div><div class=mb-3><label for=instituteAddress class="form-label form-control-label">Endere\xE7o</label><input type=text class=form-control id=instituteAddress name=instituteAddress required></div></div></div><hr><div class=row><div class=col><div class=mb-3><label for=instituteAddressNumber class="form-label form-control-label">N\xFAmero</label><input type=text class=form-control id=instituteAddressNumber name=instituteAddressNumber required></div><div class=mb-3><label for=instituteAddressNumberComplement class="form-label form-control-label">Complemento</label><input type=text class=form-control id=instituteAddressComplement name=instituteAddressNumberComplement required></div></div><div class=col><div class=mb-3><label for=instituteAddressNumberCep class="form-label form-control-label">CEP</label><input type=text class=form-control id=instituteAddressNumberCep name=instituteAddressNumberCep required></div><div class=mb-3><label for=instituteTelephoneSignup class="form-label form-control-label">Telefone</label><input type=text class=form-control id=instituteTelephoneSignup name=instituteTelephoneSignup required></div></div></div><hr><div class=row><div class=col><div class=mb-3><label for=instituteEmailSignup class="form-label form-control-label">E-mail</label><input type=text class=form-control id=instituteEmailSignup name=instituteEmailSignup required></div><div class=mb-3><label for=institutePasswordSignup class="form-label form-control-label">Senha</label><input type=text class=form-control id=institutePasswordSignup name=institutePasswordSignup required></div></div></div><div class="d-flex justify-content-between"><a href=/ ><button type=button class="btn btn-outline-secondary login-button">Voltar</button></a><button class="btn btn-primary login-button">Cadastre-se</button></div></form></div></div></div></div></div></form><style>\r\n    .login-container {\r\n      background-color: #ffff;\r\n      border-radius: 15px;\r\n      box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);\r\n      padding: 30px;\r\n      margin: 0px auto;\r\n      max-width: 700px;\r\n    }\r\n\r\n    .login-title {\r\n      font-size: 28px;\r\n      margin-bottom: 20px;\r\n    }\r\n\r\n    .form-control-label {\r\n      font-weight: bold;\r\n    }\r\n\r\n    .login-button {\r\n      font-size: 18px;\r\n      margin-top: 20px;\r\n    }\r\n\r\n    .login-form{\r\n        display: grid;\r\n        place-items: center;\r\n        height: 100%;\r\n        margin: 0;\r\n    }\r\n\r\n    .main-content{\r\n        /*background: url(https://vetplus.vet.br/wp-content/uploads/2019/04/group-of-nine-dogs-picture-id857174584.jpg) no-repeat;*/\r\n        background-size: cover;\r\n        background-position: center;\r\n        height: 100vh;\r\n    }\r\n    .content-login{\r\n        background-color: rgba(255, 255, 255, .1);\r\n        backdrop-filter: blur(5px);\r\n        height: 100%;\r\n    }\r\n</style>');
}, {
  t: _marko_componentType$7,
  i: true
}, _marko_component$7);
var _marko_componentType$6 = "f7iPi1DM";
var _marko_template$6 = t(_marko_componentType$6);
var _marko_component$6 = {};
_marko_template$6._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  _marko_tag(_marko_template$7, {}, out, _componentDef, "0");
}, {
  t: _marko_componentType$6,
  i: true
}, _marko_component$6);
var _marko_componentType$5 = "GQkRrp/V";
var _marko_template$5 = t(_marko_componentType$5);
var _marko_component$5 = {};
_marko_template$5._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  _marko_dynamic_tag(out, _marko_template$v, () => ({
    ...input
  }), (out2) => {
    _marko_dynamic_tag(out2, _marko_template$6, () => input, null, null, null, _componentDef, "1");
  }, null, null, _componentDef, "0");
}, {
  t: _marko_componentType$5,
  i: true
}, _marko_component$5);
var _marko_componentType$4 = "1eRYQgkd";
var _marko_template$4 = t(_marko_componentType$4);
var _marko_component$4 = {};
_marko_template$4._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  out.global.___viteBaseVar = "$mbp";
  (out.global.___viteEntries || (out.global.___viteEntries = [])).push("__marko-run__route__signup_4Rrz");
  _marko_tag(_marko_template$q, {
    "slot": "head-prepend"
  }, out, _componentDef, "0");
  _marko_tag(_marko_template$q, {
    "slot": "head"
  }, out, _componentDef, "1");
  _marko_tag(_marko_template$q, {
    "slot": "body-prepend"
  }, out, _componentDef, "2");
  _marko_tag(_marko_template$5, input, out, _componentDef, "3");
  _marko_tag(_initComponents, {}, out, _componentDef, "4");
  _marko_tag(_awaitReorderer, {}, out, _componentDef, "5");
  _marko_tag(_marko_template$q, {
    "slot": "body"
  }, out, _componentDef, "6");
}, {
  t: _marko_componentType$4,
  i: true
}, _marko_component$4);
async function get7(context, buildInput) {
  return pageResponse(_marko_template$4, buildInput());
}
var _marko_componentType$3 = "/eEhvXLG";
var _marko_template$3 = t(_marko_componentType$3);
var _marko_component$3 = {};
_marko_template$3._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  out.w('<form action><div class=main-content><div class=content-login><div class=login-form><div class=col-md-8><div class=login-container><h2 class="login-title text-center">Adopet.Me</h2><form><div class=mb-3><label for=email class="form-label form-control-label">E-mail</label><input type=email class=form-control id=email name=email required></div><div class=mb-3><label for=password class="form-label form-control-label">Senha</label><input type=password class=form-control id=password name=password required></div><div class="d-flex justify-content-between"><a href=signup><button type=button class="btn btn-outline-secondary login-button">Cadastre-se</button></a><a href=dashboard><button type=button class="btn btn-outline-primary login-button" onclick=getLogin()>Login</button></a></div></form></div></div></div></div></div></form><style>\r\n     .login-container {\r\n      background-color: #ffff;\r\n      border-radius: 15px;\r\n      box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);\r\n      padding: 30px;\r\n      margin: 0px auto;\r\n      max-width: 500px;\r\n    }\r\n\r\n    .login-title {\r\n      font-size: 28px;\r\n      margin-bottom: 20px;\r\n    }\r\n\r\n    .form-control-label {\r\n      font-weight: bold;\r\n    }\r\n\r\n    .login-button {\r\n      font-size: 18px;\r\n      margin-top: 20px;\r\n    }\r\n\r\n    .login-form{\r\n        display: grid;\r\n        place-items: center;\r\n        height: 100%;\r\n        margin: 0;\r\n    }\r\n\r\n    .main-content{\r\n        /*background: url(https://vetplus.vet.br/wp-content/uploads/2019/04/group-of-nine-dogs-picture-id857174584.jpg) no-repeat;*/\r\n        background-size: cover;\r\n        background-position: center;\r\n        height: 100vh;\r\n    }\r\n    .content-login{\r\n        background-color: rgba(255, 255, 255, .1);\r\n        backdrop-filter: blur(5px);\r\n        height: 100%;\r\n    }\r\n</style>');
}, {
  t: _marko_componentType$3,
  i: true
}, _marko_component$3);
var _marko_componentType$2 = "ThYTq2k4";
var _marko_template$2 = t(_marko_componentType$2);
var _marko_component$2 = {};
_marko_template$2._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  _marko_tag(_marko_template$3, {}, out, _componentDef, "0");
}, {
  t: _marko_componentType$2,
  i: true
}, _marko_component$2);
var _marko_componentType$1 = "MIc/DUZX";
var _marko_template$1 = t(_marko_componentType$1);
var _marko_component$1 = {};
_marko_template$1._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  _marko_dynamic_tag(out, _marko_template$v, () => ({
    ...input
  }), (out2) => {
    _marko_dynamic_tag(out2, _marko_template$2, () => input, null, null, null, _componentDef, "1");
  }, null, null, _componentDef, "0");
}, {
  t: _marko_componentType$1,
  i: true
}, _marko_component$1);
var _marko_componentType = "G/9alKsz";
var _marko_template = t(_marko_componentType);
var _marko_component = {};
_marko_template._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  out.global.___viteBaseVar = "$mbp";
  (out.global.___viteEntries || (out.global.___viteEntries = [])).push("__marko-run__route__index_fMAW");
  _marko_tag(_marko_template$q, {
    "slot": "head-prepend"
  }, out, _componentDef, "0");
  _marko_tag(_marko_template$q, {
    "slot": "head"
  }, out, _componentDef, "1");
  _marko_tag(_marko_template$q, {
    "slot": "body-prepend"
  }, out, _componentDef, "2");
  _marko_tag(_marko_template$1, input, out, _componentDef, "3");
  _marko_tag(_initComponents, {}, out, _componentDef, "4");
  _marko_tag(_awaitReorderer, {}, out, _componentDef, "5");
  _marko_tag(_marko_template$q, {
    "slot": "body"
  }, out, _componentDef, "6");
}, {
  t: _marko_componentType,
  i: true
}, _marko_component);
var pageTitle = "Welcome to qualquer coisa";
var twitter = "@adopet.me";
var meta8 = {
  pageTitle,
  twitter
};
async function get8(context, buildInput) {
  return pageResponse(_marko_template, buildInput());
}
globalThis.__marko_run__ = { match, fetch, invoke };
function match(method, pathname) {
  if (!pathname) {
    pathname = "/";
  } else if (pathname.charAt(0) !== "/") {
    pathname = "/" + pathname;
  }
  switch (method.toLowerCase()) {
    case "get": {
      const len = pathname.length;
      if (len === 1)
        return { handler: get8, params: {}, meta: meta8, path: "/" };
      const i1 = pathname.indexOf("/", 1) + 1;
      if (!i1 || i1 === len) {
        switch (decodeURIComponent(pathname.slice(1, i1 ? -1 : len)).toLowerCase()) {
          case "contatos":
            return { handler: get1, params: {}, meta: {}, path: "/contatos" };
          case "dashboard":
            return { handler: get2, params: {}, meta: {}, path: "/dashboard" };
          case "institute-details":
            return { handler: get3, params: {}, meta: {}, path: "/institute-details" };
          case "perfil":
            return { handler: get4, params: {}, meta: {}, path: "/perfil" };
          case "pet-details":
            return { handler: get5, params: {}, meta: {}, path: "/pet-details" };
          case "pet-register":
            return { handler: get6, params: {}, meta: {}, path: "/pet-register" };
          case "signup":
            return { handler: get7, params: {}, meta: {}, path: "/signup" };
        }
      }
      return null;
    }
  }
  return null;
}
async function invoke(route, request, platform, url) {
  const [context, buildInput] = createContext(route, request, platform, url);
  try {
    if (route) {
      try {
        const response = await route.handler(context, buildInput);
        if (response)
          return response;
      } catch (error) {
        if (error === NotHandled) {
          return;
        } else if (error !== NotMatched) {
          throw error;
        }
      }
    }
  } catch (error) {
    throw error;
  }
}
async function fetch(request, platform) {
  try {
    const url = new URL(request.url);
    let { pathname } = url;
    if (pathname !== "/" && pathname.endsWith("/")) {
      url.pathname = pathname.slice(0, -1);
      return Response.redirect(url);
    }
    const route = match(request.method, pathname);
    return await invoke(route, request, platform, url);
  } catch (error) {
    const body = null;
    return new Response(body, {
      status: 500
    });
  }
}
async function default_edge_entry_default(request, context) {
  const response = await fetch(request, {
    context
  });
  return response || context.next();
}
var __MARKO_MANIFEST__ = { "__marko-run__route__contatos_t-UI": { "head-prepend": null, "head": ["<script", 0, ' async type="module" crossorigin src="', 1, 'assets/_4c9a6662.js"', "><\/script><link", 0, ' rel="stylesheet" href="', 1, 'assets/_60af42d8.css"', ">"], "body-prepend": null, "body": null }, "__marko-run__route__dashboard_Jp-l": { "head-prepend": null, "head": ["<script", 0, ' async type="module" crossorigin src="', 1, 'assets/_4c9a6662.js"', "><\/script><link", 0, ' rel="stylesheet" href="', 1, 'assets/_60af42d8.css"', ">"], "body-prepend": null, "body": null }, "__marko-run__route__institutedetails_-jc4": { "head-prepend": null, "head": ["<script", 0, ' async type="module" crossorigin src="', 1, 'assets/_4c9a6662.js"', "><\/script><link", 0, ' rel="stylesheet" href="', 1, 'assets/_60af42d8.css"', ">"], "body-prepend": null, "body": null }, "__marko-run__route__perfil_wBQ2": { "head-prepend": null, "head": ["<script", 0, ' async type="module" crossorigin src="', 1, 'assets/_4c9a6662.js"', "><\/script><link", 0, ' rel="stylesheet" href="', 1, 'assets/_60af42d8.css"', ">"], "body-prepend": null, "body": null }, "__marko-run__route__petdetails_kE5J": { "head-prepend": null, "head": ["<script", 0, ' async type="module" crossorigin src="', 1, 'assets/_4c9a6662.js"', "><\/script><link", 0, ' rel="stylesheet" href="', 1, 'assets/_60af42d8.css"', ">"], "body-prepend": null, "body": null }, "__marko-run__route__petregister_46ln": { "head-prepend": null, "head": ["<script", 0, ' async type="module" crossorigin src="', 1, 'assets/_4c9a6662.js"', "><\/script><link", 0, ' rel="stylesheet" href="', 1, 'assets/_60af42d8.css"', ">"], "body-prepend": null, "body": null }, "__marko-run__route__signup_4Rrz": { "head-prepend": null, "head": ["<script", 0, ' async type="module" crossorigin src="', 1, 'assets/_4c9a6662.js"', "><\/script><link", 0, ' rel="stylesheet" href="', 1, 'assets/_60af42d8.css"', ">"], "body-prepend": null, "body": null }, "__marko-run__route__index_fMAW": { "head-prepend": null, "head": ["<script", 0, ' async type="module" crossorigin src="', 1, 'assets/_4c9a6662.js"', "><\/script><link", 0, ' rel="stylesheet" href="', 1, 'assets/_60af42d8.css"', ">"], "body-prepend": null, "body": null } };
export {
  default_edge_entry_default as default
};
