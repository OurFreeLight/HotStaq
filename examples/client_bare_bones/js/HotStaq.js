var HotStaqWeb =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/api-web.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/builtins/builtins.json":
/*!*********************************************!*\
  !*** ./node_modules/builtins/builtins.json ***!
  \*********************************************/
/*! exports provided: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, default */
/***/ (function(module) {

module.exports = JSON.parse("[\"assert\",\"buffer\",\"child_process\",\"cluster\",\"console\",\"constants\",\"crypto\",\"dgram\",\"dns\",\"domain\",\"events\",\"fs\",\"http\",\"https\",\"module\",\"net\",\"os\",\"path\",\"process\",\"punycode\",\"querystring\",\"readline\",\"repl\",\"stream\",\"string_decoder\",\"timers\",\"tls\",\"tty\",\"url\",\"util\",\"v8\",\"vm\",\"zlib\"]");

/***/ }),

/***/ "./node_modules/cross-fetch/dist/browser-ponyfill.js":
/*!***********************************************************!*\
  !*** ./node_modules/cross-fetch/dist/browser-ponyfill.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var global = typeof self !== 'undefined' ? self : this;
var __self__ = (function () {
function F() {
this.fetch = false;
this.DOMException = global.DOMException
}
F.prototype = global;
return new F();
})();
(function(self) {

var irrelevant = (function (exports) {

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob:
      'FileReader' in self &&
      'Blob' in self &&
      (function() {
        try {
          new Blob();
          return true
        } catch (e) {
          return false
        }
      })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  function isDataView(obj) {
    return obj && DataView.prototype.isPrototypeOf(obj)
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ];

    var isArrayBufferView =
      ArrayBuffer.isView ||
      function(obj) {
        return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
      };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift();
        return {done: value === undefined, value: value}
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      };
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ', ' + value : value;
  };

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function(name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null
  };

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  };

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push(name);
    });
    return iteratorFor(items)
  };

  Headers.prototype.values = function() {
    var items = [];
    this.forEach(function(value) {
      items.push(value);
    });
    return iteratorFor(items)
  };

  Headers.prototype.entries = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items)
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function() {
        reject(reader.error);
      };
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function(body) {
      this._bodyInit = body;
      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        this._bodyText = body = Object.prototype.toString.call(body);
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      };

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      };
    }

    this.text = function() {
      var rejected = consumed(this);
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    };

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      };
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    };

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      this.signal = input.signal;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'same-origin';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.signal = options.signal || this.signal;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body);
  }

  Request.prototype.clone = function() {
    return new Request(this, {body: this._bodyInit})
  };

  function decode(body) {
    var form = new FormData();
    body
      .trim()
      .split('&')
      .forEach(function(bytes) {
        if (bytes) {
          var split = bytes.split('=');
          var name = split.shift().replace(/\+/g, ' ');
          var value = split.join('=').replace(/\+/g, ' ');
          form.append(decodeURIComponent(name), decodeURIComponent(value));
        }
      });
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':');
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
    return headers
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = options.status === undefined ? 200 : options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'statusText' in options ? options.statusText : 'OK';
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  };

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''});
    response.type = 'error';
    return response
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  };

  exports.DOMException = self.DOMException;
  try {
    new exports.DOMException();
  } catch (err) {
    exports.DOMException = function(message, name) {
      this.message = message;
      this.name = name;
      var error = Error(message);
      this.stack = error.stack;
    };
    exports.DOMException.prototype = Object.create(Error.prototype);
    exports.DOMException.prototype.constructor = exports.DOMException;
  }

  function fetch(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init);

      if (request.signal && request.signal.aborted) {
        return reject(new exports.DOMException('Aborted', 'AbortError'))
      }

      var xhr = new XMLHttpRequest();

      function abortXhr() {
        xhr.abort();
      }

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.onabort = function() {
        reject(new exports.DOMException('Aborted', 'AbortError'));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false;
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value);
      });

      if (request.signal) {
        request.signal.addEventListener('abort', abortXhr);

        xhr.onreadystatechange = function() {
          // DONE (success or failure)
          if (xhr.readyState === 4) {
            request.signal.removeEventListener('abort', abortXhr);
          }
        };
      }

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    })
  }

  fetch.polyfill = true;

  if (!self.fetch) {
    self.fetch = fetch;
    self.Headers = Headers;
    self.Request = Request;
    self.Response = Response;
  }

  exports.Headers = Headers;
  exports.Request = Request;
  exports.Response = Response;
  exports.fetch = fetch;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
})(__self__);
__self__.fetch.ponyfill = true;
// Remove "polyfill" property added by whatwg-fetch
delete __self__.fetch.polyfill;
// Choose between native implementation (global) or custom implementation (__self__)
// var ctx = global.fetch ? global : __self__;
var ctx = __self__; // this line disable service worker support temporarily
exports = ctx.fetch // To enable: import fetch from 'cross-fetch'
exports.default = ctx.fetch // For TypeScript consumers without esModuleInterop.
exports.fetch = ctx.fetch // To enable: import {fetch} from 'cross-fetch'
exports.Headers = ctx.Headers
exports.Request = ctx.Request
exports.Response = ctx.Response
module.exports = exports


/***/ }),

/***/ "./node_modules/js-cookie/dist/js.cookie.js":
/*!**************************************************!*\
  !*** ./node_modules/js-cookie/dist/js.cookie.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*! js-cookie v3.0.1 | MIT */
;
(function (global, factory) {
   true ? module.exports = factory() :
  undefined;
}(this, (function () { 'use strict';

  /* eslint-disable no-var */
  function assign (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        target[key] = source[key];
      }
    }
    return target
  }
  /* eslint-enable no-var */

  /* eslint-disable no-var */
  var defaultConverter = {
    read: function (value) {
      if (value[0] === '"') {
        value = value.slice(1, -1);
      }
      return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
    },
    write: function (value) {
      return encodeURIComponent(value).replace(
        /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
        decodeURIComponent
      )
    }
  };
  /* eslint-enable no-var */

  /* eslint-disable no-var */

  function init (converter, defaultAttributes) {
    function set (key, value, attributes) {
      if (typeof document === 'undefined') {
        return
      }

      attributes = assign({}, defaultAttributes, attributes);

      if (typeof attributes.expires === 'number') {
        attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
      }
      if (attributes.expires) {
        attributes.expires = attributes.expires.toUTCString();
      }

      key = encodeURIComponent(key)
        .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
        .replace(/[()]/g, escape);

      var stringifiedAttributes = '';
      for (var attributeName in attributes) {
        if (!attributes[attributeName]) {
          continue
        }

        stringifiedAttributes += '; ' + attributeName;

        if (attributes[attributeName] === true) {
          continue
        }

        // Considers RFC 6265 section 5.2:
        // ...
        // 3.  If the remaining unparsed-attributes contains a %x3B (";")
        //     character:
        // Consume the characters of the unparsed-attributes up to,
        // not including, the first %x3B (";") character.
        // ...
        stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
      }

      return (document.cookie =
        key + '=' + converter.write(value, key) + stringifiedAttributes)
    }

    function get (key) {
      if (typeof document === 'undefined' || (arguments.length && !key)) {
        return
      }

      // To prevent the for loop in the first place assign an empty array
      // in case there are no cookies at all.
      var cookies = document.cookie ? document.cookie.split('; ') : [];
      var jar = {};
      for (var i = 0; i < cookies.length; i++) {
        var parts = cookies[i].split('=');
        var value = parts.slice(1).join('=');

        try {
          var foundKey = decodeURIComponent(parts[0]);
          jar[foundKey] = converter.read(value, foundKey);

          if (key === foundKey) {
            break
          }
        } catch (e) {}
      }

      return key ? jar[key] : jar
    }

    return Object.create(
      {
        set: set,
        get: get,
        remove: function (key, attributes) {
          set(
            key,
            '',
            assign({}, attributes, {
              expires: -1
            })
          );
        },
        withAttributes: function (attributes) {
          return init(this.converter, assign({}, this.attributes, attributes))
        },
        withConverter: function (converter) {
          return init(assign({}, this.converter, converter), this.attributes)
        }
      },
      {
        attributes: { value: Object.freeze(defaultAttributes) },
        converter: { value: Object.freeze(converter) }
      }
    )
  }

  var api = init(defaultConverter, { path: '/' });
  /* eslint-enable no-var */

  return api;

})));


/***/ }),

/***/ "./node_modules/node-libs-browser/mock/empty.js":
/*!******************************************************!*\
  !*** ./node_modules/node-libs-browser/mock/empty.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/validate-npm-package-name/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/validate-npm-package-name/index.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var scopedPackagePattern = new RegExp('^(?:@([^/]+?)[/])?([^/]+?)$')
var builtins = __webpack_require__(/*! builtins */ "./node_modules/builtins/builtins.json")
var blacklist = [
  'node_modules',
  'favicon.ico'
]

var validate = module.exports = function (name) {
  var warnings = []
  var errors = []

  if (name === null) {
    errors.push('name cannot be null')
    return done(warnings, errors)
  }

  if (name === undefined) {
    errors.push('name cannot be undefined')
    return done(warnings, errors)
  }

  if (typeof name !== 'string') {
    errors.push('name must be a string')
    return done(warnings, errors)
  }

  if (!name.length) {
    errors.push('name length must be greater than zero')
  }

  if (name.match(/^\./)) {
    errors.push('name cannot start with a period')
  }

  if (name.match(/^_/)) {
    errors.push('name cannot start with an underscore')
  }

  if (name.trim() !== name) {
    errors.push('name cannot contain leading or trailing spaces')
  }

  // No funny business
  blacklist.forEach(function (blacklistedName) {
    if (name.toLowerCase() === blacklistedName) {
      errors.push(blacklistedName + ' is a blacklisted name')
    }
  })

  // Generate warnings for stuff that used to be allowed

  // core module names like http, events, util, etc
  builtins.forEach(function (builtin) {
    if (name.toLowerCase() === builtin) {
      warnings.push(builtin + ' is a core module name')
    }
  })

  // really-long-package-names-------------------------------such--length-----many---wow
  // the thisisareallyreallylongpackagenameitshouldpublishdowenowhavealimittothelengthofpackagenames-poch.
  if (name.length > 214) {
    warnings.push('name can no longer contain more than 214 characters')
  }

  // mIxeD CaSe nAMEs
  if (name.toLowerCase() !== name) {
    warnings.push('name can no longer contain capital letters')
  }

  if (/[~'!()*]/.test(name.split('/').slice(-1)[0])) {
    warnings.push('name can no longer contain special characters ("~\'!()*")')
  }

  if (encodeURIComponent(name) !== name) {
    // Maybe it's a scoped package name, like @user/package
    var nameMatch = name.match(scopedPackagePattern)
    if (nameMatch) {
      var user = nameMatch[1]
      var pkg = nameMatch[2]
      if (encodeURIComponent(user) === user && encodeURIComponent(pkg) === pkg) {
        return done(warnings, errors)
      }
    }

    errors.push('name can only contain URL-friendly characters')
  }

  return done(warnings, errors)
}

validate.scopedPackagePattern = scopedPackagePattern

var done = function (warnings, errors) {
  var result = {
    validForNewPackages: errors.length === 0 && warnings.length === 0,
    validForOldPackages: errors.length === 0,
    warnings: warnings,
    errors: errors
  }
  if (!result.warnings.length) delete result.warnings
  if (!result.errors.length) delete result.errors
  return result
}


/***/ }),

/***/ "./src/Hot.ts":
/*!********************!*\
  !*** ./src/Hot.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hot = exports.DeveloperMode = void 0;
const HotFile_1 = __webpack_require__(/*! ./HotFile */ "./src/HotFile.ts");
const HotStaq_1 = __webpack_require__(/*! ./HotStaq */ "./src/HotStaq.ts");
const HotTestElement_1 = __webpack_require__(/*! ./HotTestElement */ "./src/HotTestElement.ts");
const js_cookie_1 = __importDefault(__webpack_require__(/*! js-cookie */ "./node_modules/js-cookie/dist/js.cookie.js"));
const cross_fetch_1 = __importDefault(__webpack_require__(/*! cross-fetch */ "./node_modules/cross-fetch/dist/browser-ponyfill.js"));
/**
 * The available developer modes.
 */
var DeveloperMode;
(function (DeveloperMode) {
    /**
     * The default developer mode. No tests will be executed and
     * any test related data will be ignored.
     */
    DeveloperMode[DeveloperMode["Production"] = 0] = "Production";
    /**
     * For use during development/debugging. All test data will
     * be collected and executed if necessary.
     */
    DeveloperMode[DeveloperMode["Development"] = 1] = "Development";
})(DeveloperMode = exports.DeveloperMode || (exports.DeveloperMode = {}));
/**
 * The api used during processing.
 */
class Hot {
    /**
     * Retrieve a file and echo out it's contents.
     */
    static include(file, args = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (HotStaq_1.HotStaq.isWeb === true) {
                if (typeof (file) === "string") {
                    const lowerFile = file.toLowerCase();
                    // If the file to be included does not have a nahfam, add it. This 
                    // will ensure the server sends only the file content.
                    if (lowerFile.indexOf(".hott") > -1) {
                        if (lowerFile.indexOf("nahfam") < 0)
                            file += "?hpserve=nahfam";
                    }
                }
            }
            Hot.echo(yield Hot.getFile(file, args));
        });
    }
    /**
     * Run an already loaded file and echo out it's contents.
     */
    static runFile(fileName, args = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let file = Hot.CurrentPage.processor.getFile(fileName);
            /// @fixme Does the file need to be deep cloned first?
            //let clonedFile: HotFile = new HotFile (Object.assign ({}, file));
            let tempFile = file;
            tempFile.page = this.CurrentPage;
            let content = yield tempFile.process(args);
            Hot.echo(content);
        });
    }
    /**
     * Get the content of a file.
     */
    static getFile(path, args = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let tempFile = null;
            if (typeof (path) === "string") {
                tempFile = new HotFile_1.HotFile();
                if (HotStaq_1.HotStaq.isWeb === true)
                    tempFile.url = path;
                else
                    tempFile.localFile = path;
            }
            else
                tempFile = path;
            yield tempFile.load();
            tempFile.page = this.CurrentPage;
            let content = yield tempFile.process(args);
            return (content);
        });
    }
    /**
     * Make an api call.
     */
    static apiCall(route, data = null, httpMethod = "POST") {
        return __awaiter(this, void 0, void 0, function* () {
            let result = null;
            if (Hot.CurrentPage == null)
                throw new Error("Current page is null!");
            if (Hot.CurrentPage.processor == null)
                throw new Error("Current page's processor is null!");
            if (Hot.CurrentPage.processor.api == null)
                throw new Error("Current page's processor api is null!");
            if (Hot.CurrentPage.processor.api != null)
                result = yield Hot.CurrentPage.processor.api.makeCall(route, data, httpMethod);
            return (result);
        });
    }
    /**
     * Make a HTTP JSON request.
     *
     * @param url The full url to make the HTTP call.
     * @param data The data to JSON.stringify and send.
     * @param httpMethod The HTTP method to use to send the data.
     *
     * @returns The parsed JSON object.
     */
    static jsonRequest(url, data = null, httpMethod = "POST") {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield (0, cross_fetch_1.default)(url, {
                    "method": httpMethod,
                    "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    "body": JSON.stringify(data)
                });
                if (res.ok === false)
                    throw new Error(`${res.status}: ${res.statusText}`);
                let result = yield res.json();
                return (result);
            }
            catch (ex) {
                return (JSON.stringify({ "error": `${ex.message} - Could not fetch ${url}` }));
            }
        });
    }
    /**
     * Make a HTTP request. This is basically just a wrapper for fetch.
     *
     * @param url The full url to make the HTTP call.
     * @param requestInit The request parameters to send.
     *
     * @returns The HTTP response.
     */
    static httpRequest(url, requestInit = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield (0, cross_fetch_1.default)(url, requestInit);
            return (res);
        });
    }
    /**
     * Echo out some output.
     */
    static echo(message) {
        Hot.Output += message;
    }
    /**
     * Echo out the CSS for the current page being generated.
     */
    static displayCSS() {
        for (let iIdx = 0; iIdx < Hot.CSS.length; iIdx++) {
            let cssFile = Hot.CSS[iIdx];
            let cssOut = Hot.cssStr;
            cssOut = cssOut.replace(/\%CSS_FILE\%/g, cssFile);
            Hot.echo(cssOut);
        }
    }
    /**
     * Echo out the JS files for the current page being generated.
     */
    static displayJSFiles() {
        for (let iIdx = 0; iIdx < Hot.JSFiles.length; iIdx++) {
            let jsFile = Hot.JSFiles[iIdx];
            let jsFileOut = Hot.jsFileStr;
            jsFileOut = jsFileOut.replace(/\%JS_FILE\%/g, jsFile);
            Hot.echo(jsFileOut);
        }
    }
    /**
     * Echo out the JS scripts for the current page being generated.
     */
    static displayJSScripts() {
        for (let iIdx = 0; iIdx < Hot.JSScripts.length; iIdx++) {
            let jsScript = Hot.JSScripts[iIdx];
            let jsScriptOut = Hot.jsScriptsStr;
            jsScriptOut = jsScriptOut.replace(/\%JS_CODE\%/g, jsScript);
            Hot.echo(jsScriptOut);
        }
    }
}
exports.Hot = Hot;
/**
 * The currently generated page being displayed. This is cleared between every file processed.
 */
Hot.CurrentPage = null;
/**
 * The arguments passed.
 */
Hot.Arguments = null;
/**
 * The mode in which this application is running. If it's set to development mode, all testing
 * related data will be collected, parsed, and executed if necessary.
 */
Hot.DeveloperMode = DeveloperMode;
/**
 * The mode in which this application is running. If it's set to development mode, all testing
 * related data will be collected, parsed, and executed if necessary.
 */
Hot.HotTestElement = HotTestElement_1.HotTestElement;
/**
 * The mode in which this application is running. If it's set to development mode, all testing
 * related data will be collected, parsed, and executed if necessary.
 */
Hot.Mode = DeveloperMode.Production;
/**
 *The current API used on this page. This is cleared between every file processed.
 */
Hot.API = null;
/**
 * The API being used by the tester.
 */
Hot.TesterAPI = null;
/**
 * Contains the buffer to output. This is cleared between every file processed.
 */
Hot.Output = "";
/**
 * The data to share across all the different files and pages. This data will be public.
 */
Hot.Data = {};
/**
 * The cookies to use between pages.
 */
Hot.Cookies = js_cookie_1.default;
/**
 * Any secrets that can be shown publicly. These can be passed from HotSite.json.
 */
Hot.PublicSecrets = {};
/**
 * The CSS string to use when echoing out the CSS files.
 */
Hot.cssStr = `<link rel = "stylesheet" href = "%CSS_FILE%" />`;
/**
 * The CSS files to use in the current page being generated.
 *
 * @todo Make this a "string | CSSObject" data type so it can also include
 * the integrity hashes as well.
 */
Hot.CSS = [];
/**
 * The JavaScript files to use in the current page being generated.
 *
 * @todo Make this a "string | JSFileObject" data type so it can also include
 * the integrity hashes as well.
 */
Hot.JSFiles = [];
/**
 * The JavaScript inline code to use in the current page being generated.
 */
Hot.JSScripts = [];
/**
 * The JavaScript string to use when echoing out the Scripts files.
 */
Hot.jsFileStr = `<script type = "text/javascript" src = "%JS_FILE%"></script>`;
/**
 * The JavaScript string to use when echoing out the Scripts files.
 */
Hot.jsScriptsStr = `<script type = "text/javascript">%JS_CODE%</script>`;


/***/ }),

/***/ "./src/HotAPI.ts":
/*!***********************!*\
  !*** ./src/HotAPI.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotAPI = exports.EventExecutionType = void 0;
const cross_fetch_1 = __importDefault(__webpack_require__(/*! cross-fetch */ "./node_modules/cross-fetch/dist/browser-ponyfill.js"));
const HotServer_1 = __webpack_require__(/*! ./HotServer */ "./src/HotServer.ts");
const HotRoute_1 = __webpack_require__(/*! ./HotRoute */ "./src/HotRoute.ts");
const HotRouteMethod_1 = __webpack_require__(/*! ./HotRouteMethod */ "./src/HotRouteMethod.ts");
/**
 * The type of object to use during event executions.
 */
var EventExecutionType;
(function (EventExecutionType) {
    EventExecutionType[EventExecutionType["HotRoute"] = 0] = "HotRoute";
    EventExecutionType[EventExecutionType["HotMethod"] = 1] = "HotMethod";
    EventExecutionType[EventExecutionType["HotAPI"] = 2] = "HotAPI";
})(EventExecutionType = exports.EventExecutionType || (exports.EventExecutionType = {}));
/**
 * The API to use.
 */
class HotAPI {
    constructor(baseUrl, connection = null, db = null) {
        this.connection = connection;
        this.baseUrl = baseUrl;
        this.createFunctions = true;
        this.executeEventsUsing = EventExecutionType.HotRoute;
        this.db = db;
        this.authCredentials = null;
        this.userAuth = null;
        this.routes = {};
        this.onPreRegister = null;
        this.onPostRegister = null;
    }
    /**
     * Set the database schema for use.
     */
    setDBSchema(schema) {
        if (this.connection.api == null)
            throw new Error(`No API has been set!`);
        if (this.connection.api.db == null)
            throw new Error(`No database has been set for API base url ${this.connection.api.baseUrl}`);
        this.connection.api.db.schema = schema;
    }
    /**
     * Get the database being used.
     */
    getDB() {
        if (this.connection.api.db == null)
            throw new Error(`No database has been set for API base url ${this.connection.api.baseUrl}`);
        return (this.connection.api.db);
    }
    /**
     * Get the database schema being used.
     */
    getDBSchema() {
        if (this.connection.api.db == null)
            throw new Error(`No database has been set for API base url ${this.connection.api.baseUrl}`);
        return (this.connection.api.db.schema);
    }
    /**
     * Add a route. If this.createFunctions is set to true, this will take the incoming
     * route and create an object in this HotAPI object using the name of the route. If there's
     * any HotRouteMethods inside of the incoming HotRoute, it will create the methods
     * and attach them to the newly created HotRoute object.
     *
     * Example:
     * ```
     * export class Users extends HotRoute
     * {
     * 		constructor (api: FreeLightAPI)
     * 		{
     * 			super (api.connection, "user");
     *
     * 			this.addMethod ("create", this._create, HTTPMethod.POST);
     * 		}
     *
     * 		protected async _create (req: any, res: any, authorizedValue: any, jsonObj: any, queryObj: any): Promise<any>
     * 		{
     * 			return (true);
     * 		}
     * }
     * ```
     *
     * This in turn could be used like so:
     * ```
     * Hot.API.user.create ({});
     * ```
     *
     * Additionally it would create the endpoint: ```http://127.0.0.1:8080/v1/user/create```
     *
     * @param route The route to add. Can be either a full HotRoute object, or just
     * the route's name. If a HotRoute object is supplied, the rest of the parameters
     * will be ignored.
     * @param routeMethod The route's method to add. If the route parameter is a string,
     * it will be interpreted as the route's name, and this will be the method added to
     * the new route.
     * @param executeFunction The function to execute when routeMethod is called by the API.
     */
    addRoute(route, routeMethod = null, executeFunction = null) {
        let routeName = "";
        if (route instanceof HotRoute_1.HotRoute) {
            routeName = route.route;
            this.routes[route.route] = route;
        }
        else {
            routeName = route;
            if (this.routes[routeName] == null)
                this.routes[routeName] = new HotRoute_1.HotRoute(this.connection, routeName);
            if (routeMethod instanceof HotRouteMethod_1.HotRouteMethod)
                this.routes[routeName].addMethod(routeMethod);
            else {
                this.routes[routeName].addMethod(new HotRouteMethod_1.HotRouteMethod(this.routes[routeName], routeMethod, executeFunction));
            }
        }
        this.routes[routeName].connection = this.connection;
        // Create the route functions for the server/client.
        if (this.createFunctions === true) {
            // @ts-ignore
            let newRoute = this[routeName];
            if (newRoute == null)
                newRoute = {};
            for (let iIdx = 0; iIdx < this.routes[routeName].methods.length; iIdx++) {
                let currentRoute = this.routes[routeName];
                let newRouteMethod = this.routes[routeName].methods[iIdx];
                /*
                /// @fixme Is this really necessary? A HTTP call is much more preferable,
                /// especially for accruate testing.
                if (this.connection instanceof HotServer)
                {
                    if (newRouteMethod.onServerExecute != null)
                        newRoute[newRouteMethod.name] = newRouteMethod.onServerExecute;
                }
                else*/
                {
                    /*
                    /// @fixme Is onClientExecute necessary? I'm thinking the dev can just simply create
                    /// their own function to call.
                    if (newRouteMethod.onClientExecute != null)
                        newRoute[newRouteMethod.name] = newRouteMethod.onClientExecute;
                    else
                    {*/
                    newRoute[newRouteMethod.name] = (data) => {
                        let httpMethod = newRouteMethod.type;
                        // Construct the url here. Base + route + route method
                        let routeStr = "";
                        if (currentRoute.version !== "")
                            routeStr += `/${currentRoute.version}`;
                        if (currentRoute.route !== "")
                            routeStr += `/${currentRoute.route}`;
                        if (newRouteMethod.name !== "")
                            routeStr += `/${newRouteMethod.name}`;
                        let authCredentials = null;
                        // Getting the authorization credentials from the API is the lowest 
                        // priority for getting credentials. The priorities are in this order: 
                        // 1. HotRouteMethod
                        // 2. HotRoute
                        // 3. HotAPI
                        if (this.authCredentials != null)
                            authCredentials = this.authCredentials;
                        // Find the authorization credentials. Prioritize them when they're 
                        // in the method. Only add the ones from the route if the ones from 
                        // the method are missing.
                        if (newRouteMethod.authCredentials != null)
                            authCredentials = newRouteMethod.authCredentials;
                        else {
                            if (newRouteMethod.parentRoute.authCredentials != null)
                                authCredentials = newRouteMethod.parentRoute.authCredentials;
                        }
                        if (authCredentials == null) {
                            // @ts-ignore
                            if (typeof (Hot) !== "undefined") {
                                // @ts-ignore
                                if (Hot != null) {
                                    // @ts-ignore
                                    if (Hot.API != null) {
                                        // @ts-ignore
                                        if (Hot.API[currentRoute.route] != null) {
                                            // @ts-ignore
                                            if (Hot.API[currentRoute.route].authCredentials != null) {
                                                // @ts-ignore
                                                authCredentials = Hot.API[currentRoute.route].authCredentials;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (authCredentials != null) {
                            // Add the authorization credentials to the data being sent.
                            for (let key in authCredentials) {
                                let authCredential = authCredentials[key];
                                // Do not overwrite any existing keys in the data about 
                                // to be sent.
                                if (data[key] == null)
                                    data[key] = authCredential;
                            }
                        }
                        let args = [routeStr, data, httpMethod];
                        return (this.makeCall.apply(this, args));
                    };
                    //}
                }
            }
            // @ts-ignore
            this[routeName] = newRoute;
        }
    }
    /**
     * Register a route with the server.
     */
    registerRoute(route) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connection instanceof HotServer_1.HotServer)
                yield this.connection.registerRoute(route);
        });
    }
    /**
     * Register all routes with the server.
     */
    registerRoutes() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let key in this.routes) {
                let route = this.routes[key];
                yield this.registerRoute(route);
            }
        });
    }
    /**
     * Make a call to the API.
     */
    makeCall(route, data, httpMethod = "POST") {
        return __awaiter(this, void 0, void 0, function* () {
            let url = this.baseUrl;
            if (url[(url.length - 1)] === "/")
                url = url.substr(0, (url.length - 1));
            if (route[0] !== "/")
                url += "/";
            url += route;
            httpMethod = httpMethod.toUpperCase();
            let fetchObj = {
                method: httpMethod,
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            };
            if ((httpMethod !== "GET") &&
                (httpMethod !== "HEAD")) {
                fetchObj["body"] = JSON.stringify(data);
            }
            let res = null;
            try {
                res = yield (0, cross_fetch_1.default)(url, fetchObj);
            }
            catch (ex) {
                throw ex;
            }
            let jsonObj = yield res.json();
            return (jsonObj);
        });
    }
}
exports.HotAPI = HotAPI;


/***/ }),

/***/ "./src/HotClient.ts":
/*!**************************!*\
  !*** ./src/HotClient.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.HotClient = void 0;
const HotServer_1 = __webpack_require__(/*! ./HotServer */ "./src/HotServer.ts");
/**
 * A client connected to a server.
 */
class HotClient {
    constructor(processor) {
        this.processor = processor;
        this.api = null;
        this.testerAPI = null;
        this.type = HotServer_1.HotServerType.HTTP;
        this.logger = processor.logger;
    }
}
exports.HotClient = HotClient;


/***/ }),

/***/ "./src/HotComponent.ts":
/*!*****************************!*\
  !*** ./src/HotComponent.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotComponent = void 0;
const HotStaq_1 = __webpack_require__(/*! ./HotStaq */ "./src/HotStaq.ts");
/**
 * A component to preprocess.
 */
class HotComponent {
    constructor(copy, api = null) {
        if (copy instanceof HotStaq_1.HotStaq) {
            this.processor = copy;
            this.htmlElement = null;
            this.name = "";
            this.tag = "";
            this.api = null;
            this.elementOptions = undefined;
            this.type = "";
            this.value = null;
            this.events = {};
        }
        else {
            this.processor = copy.processor;
            this.htmlElement = copy.htmlElement || null;
            this.name = copy.name || "";
            this.tag = copy.tag || this.name;
            this.api = copy.api || null;
            this.elementOptions = copy.elementOptions || undefined;
            this.type = copy.type || "";
            this.value = copy.value || null;
            this.events = {};
        }
        if (api != null)
            this.api = api;
    }
    /**
     * Event that's called when this component is created. This is
     * called before output is called. Right after this is called,
     * the attributes from the HTMLElement will be processed. If
     * the functionality of the attributes processing need to be
     * overwritten, use the handleAttributes method to handle them.
     */
    onCreated(element) {
        return __awaiter(this, void 0, void 0, function* () {
            return (element);
        });
    }
}
exports.HotComponent = HotComponent;


/***/ }),

/***/ "./src/HotFile.ts":
/*!************************!*\
  !*** ./src/HotFile.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotFile = void 0;
const fs = __importStar(__webpack_require__(/*! fs */ "./node_modules/node-libs-browser/mock/empty.js"));
const cross_fetch_1 = __importDefault(__webpack_require__(/*! cross-fetch */ "./node_modules/cross-fetch/dist/browser-ponyfill.js"));
const Hot_1 = __webpack_require__(/*! ./Hot */ "./src/Hot.ts");
/**
 * A file to process.
 */
class HotFile {
    constructor(copy = {}) {
        this.page = copy.page || null;
        this.name = copy.name || "";
        this.url = copy.url || "";
        this.localFile = copy.localFile || "";
        this.content = copy.content || "";
        this.throwAllErrors = copy.throwAllErrors || false;
    }
    /**
     * Set the content of this file.
     */
    setContent(content) {
        this.content = content;
    }
    /**
     * Get the content of this file.
     */
    getContent() {
        return (this.content);
    }
    /**
     * Make a HTTP get request.
     */
    static httpGet(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield (0, cross_fetch_1.default)(url);
                if (res.ok === false)
                    throw new Error(`${res.status}: ${res.statusText}`);
                let content = yield res.text();
                return (content);
            }
            catch (ex) {
                return (JSON.stringify({ "error": `${ex.message} - Could not fetch ${url}` }));
            }
        });
    }
    /**
     * Load content from a url.
     */
    loadUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            this.content = yield HotFile.httpGet(this.url);
            return (this.content);
        });
    }
    /**
     * Load content from a local file.
     */
    loadLocalFile() {
        return __awaiter(this, void 0, void 0, function* () {
            let promise = new Promise((resolve, reject) => {
                fs.readFile(this.localFile, (err, data) => {
                    if (err != null)
                        throw err;
                    let content = data.toString();
                    this.content = content;
                    resolve(this.content);
                });
            });
            return (promise);
        });
    }
    /**
     * Load the contents of the file.
     */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            let content = "";
            if (this.url !== "")
                content = yield this.loadUrl();
            if (this.localFile !== "")
                content = yield this.loadLocalFile();
            return (content);
        });
    }
    /**
     * Process string content. This will take in a regular expression and
     * parse the content based on the regex. When the regex content is found
     * contentProcessor will be executed with the regex content found. When
     * the regex content is not found, offContentProcessor will be called with
     * the content outside of the regex.
     *
     * @param content The content to parse.
     * @param contentRegex The regex to use to parse the content.
     * @param contentProcessor The content found inside the regex.
     * @param offContentProcessor The content found outside of the regex.
     * @param numRemoveFromBeginning The number of characters to remove from the
     * beginning of the found content.
     * @param numRemoveFromEnd The number of characters to remove from the end of
     * the found content.
     */
    static processContent(content, contentRegex, contentProcessor, offContentProcessor, numRemoveFromBeginning = 2, numRemoveFromEnd = 2) {
        let result = contentRegex.exec(content);
        let previousIndex = 0;
        let output = "";
        while (result != null) {
            let start = result.index - numRemoveFromBeginning;
            let end = contentRegex.lastIndex + numRemoveFromEnd;
            // Get the previous section.
            let prevContent = content.substr(previousIndex, (start - previousIndex));
            previousIndex = end;
            output += offContentProcessor(prevContent);
            // Process the content found from the regex
            let contentFound = result[0];
            output += contentProcessor(contentFound);
            // Move on to the next section to parse.
            result = contentRegex.exec(content);
        }
        // Append whatever else is after the last parsed section.
        let lastContent = content.substr(previousIndex);
        output += offContentProcessor(lastContent);
        return (output);
    }
    /**
     * Process any content that could have nested values. This will
     * take in a regular expression and
     * parse the content based on the regex. When the regex content is found
     * contentProcessor will be executed with the regex content found. When
     * the regex content is not found, offContentProcessor will be called with
     * the content outside of the regex.
     *
     * @fixme Needs to be able to ignore any characters found inside comments
     * or a string. For example, if the following is used ```${"Test }"}``` It
     * will error out.
     *
     * @param content The content to parse.
     * @param contentRegex The regex to use to parse the content.
     * @param contentProcessor The content found inside the regex.
     * @param offContentProcessor The content found outside of the regex.
     * @param numRemoveFromBeginning The number of characters to remove from the
     * beginning of the found content.
     * @param numRemoveFromEnd The number of characters to remove from the end of
     * the found content.
     */
    static processNestedContent(content, startChars, endChars, triggerChar, contentProcessor, offContentProcessor, numRemoveFromBeginning = 2, numRemoveFromEnd = 1) {
        let pos = content.indexOf(startChars);
        let previousIndex = 0;
        let startTriggerPos = content.indexOf(triggerChar, pos);
        let output = "";
        while (pos > -1) {
            let end = content.indexOf(endChars, pos);
            let nestedCounter = 0;
            if (triggerChar !== "") {
                // Reverse search the trigger characters and count the number of 
                // occurrences.
                let rpos = content.lastIndexOf(triggerChar, end - numRemoveFromEnd);
                while (rpos > -1) {
                    if (rpos === startTriggerPos)
                        break;
                    rpos = content.lastIndexOf(triggerChar, rpos - numRemoveFromEnd);
                    nestedCounter++;
                }
            }
            // If there's nested trigger characters, get the last occurrence of 
            // the end character.
            if (nestedCounter > 0) {
                let epos = content.indexOf(endChars, end + numRemoveFromEnd);
                let tempepos = epos;
                while ((epos > -1) && (nestedCounter > 0)) {
                    if (tempepos < 0)
                        break;
                    // Make sure we aren't discovering endChars that we shouldn't be.
                    let posOutsideOfContent = content.lastIndexOf(startChars, tempepos - numRemoveFromEnd);
                    if (posOutsideOfContent > epos)
                        break;
                    epos = tempepos;
                    tempepos = content.indexOf(endChars, epos + numRemoveFromEnd);
                    nestedCounter--;
                }
                end = epos;
            }
            let offContentStr = content.substr(previousIndex, (pos - previousIndex));
            output += offContentProcessor(offContentStr);
            let foundContent = content.substr(pos + numRemoveFromBeginning, (end - (pos + numRemoveFromBeginning)));
            output += contentProcessor(foundContent);
            // Get the next content
            pos = content.indexOf(startChars, end + numRemoveFromEnd);
            startTriggerPos = content.indexOf(triggerChar, pos);
            previousIndex = end + numRemoveFromEnd;
        }
        // Append whatever else is after the last parsed section.
        let lastContent = content.substr(previousIndex);
        output += offContentProcessor(lastContent);
        return (output);
    }
    /**
     * Process the content in this file. This treats each file as one large JavaScript
     * file. Any text outside of the <* *> areas will be treated as:
     *
     * 		Hot.echo ("text");
     *
     * @fixme The regex's in the offContent functions need to be fixed. There's several
     * test cases where they will fail.
     */
    process(args = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let output = "";
            let thisContent = this.content;
            Hot_1.Hot.Mode = this.page.processor.mode;
            Hot_1.Hot.Arguments = args;
            Hot_1.Hot.CurrentPage = this.page;
            Hot_1.Hot.PublicSecrets = this.page.processor.publicSecrets;
            Hot_1.Hot.API = this.page.getAPI();
            Hot_1.Hot.TesterAPI = this.page.getTesterAPI();
            // Assemble the JS to evaluate. This will take all content outside of 
            // <* and *> and wrap a Hot.echo around it. Any JS found inside of the 
            // <* and *> will be executed as is.
            output = HotFile.processContent(thisContent, new RegExp("(?=\\<\\*)([\\s\\S]*?)(?=\\*\\>)", "g"), (regexFound) => {
                // A little hack, since I suck at Regex :(
                regexFound = regexFound.substr(2);
                return (`${regexFound}`);
            }, (offContent) => {
                if (offContent === "")
                    return ("");
                let tempOutput = HotFile.processNestedContent(offContent, "!{", "}", "{", (regexFound2) => {
                    let out = `*&&%*%@#@!${regexFound2}*&!#%@!@*!`;
                    return (out);
                }, (offContent3) => {
                    return (offContent3);
                });
                let tempOutput2 = HotFile.processNestedContent(tempOutput, "STR{", "}", "{", (regexFound2) => {
                    let out = `*&&%*%@#@!echoOutput (JSON.stringify(${regexFound2}), ${this.throwAllErrors});*&!#%@!@*!`;
                    return (out);
                }, (offContent3) => {
                    return (offContent3);
                }, 4, 1);
                let tempOutput3 = HotFile.processNestedContent(tempOutput2, "${", "}", "{", (regexFound2) => {
                    let out = `*&&%*%@#@!try { Hot.echo (${regexFound2}); }catch (ex){Hot.echo ("");}*&!#%@!@*!`;
                    if (this.throwAllErrors === true)
                        out = `*&&%*%@#@!Hot.echo (${regexFound2});*&!#%@!@*!`;
                    return (out);
                }, (offContent3) => {
                    return (offContent3);
                    /*let escapedContent: string = JSON.stringify (offContent3);
                    let out: string = `echoOutput (${escapedContent}, ${this.throwAllErrors});\n`;

                    return (out);*/
                });
                let tempOutput4 = "";
                if (Hot_1.Hot.Mode === Hot_1.DeveloperMode.Production) {
                    tempOutput4 = HotFile.processNestedContent(tempOutput3, "?(", ")", "(", (regexFound2) => {
                        return ("");
                    }, (offContent3) => {
                        return (offContent3);
                        /*let out: string = `echoOutput (${offContent3}, ${this.throwAllErrors});\n`;

                        return (out);*/
                    });
                }
                if (Hot_1.Hot.Mode === Hot_1.DeveloperMode.Development) {
                    tempOutput4 = HotFile.processNestedContent(tempOutput3, "?(", ")", "(", (regexFound2) => {
                        let foundStr = "";
                        try {
                            // Check to see if it be parsed. If so, stringify it.
                            JSON.parse(regexFound2);
                            foundStr = JSON.stringify(regexFound2);
                        }
                        catch (ex) {
                            // If valid JSON is not received, don't worry about it, pass it 
                            // along to the function below for it to be parsed in the page.
                            // The exception should be thrown there instead.
                            foundStr = `${regexFound2}`;
                        }
                        /// @fixme Make this a callable function and pass foundStr, etc.
                        let out = `*&&%*%@#@!{
const testElm = createTestElement (${foundStr});
Hot.echo (\`data-test-object-name = "\${testElm.name}" data-test-object-func = "\${testElm.func}" data-test-object-value = "\${testElm.value}"\`);
}*&!#%@!@*!\n`;
                        return (out);
                    }, (offContent3) => {
                        return (offContent3);
                        /*let out: string = `echoOutput (${offContent3}, ${this.throwAllErrors});\n`;

                        return (out);*/
                    });
                }
                let tempOutput5 = HotFile.processNestedContent(tempOutput4, "*&&%*%@#@!", "*&!#%@!@*!", "*&&%*%@#@!", (regexFound) => {
                    return (regexFound);
                }, (offContent) => {
                    let escapedContent = JSON.stringify(offContent);
                    let out = `echoOutput (${escapedContent}, ${this.throwAllErrors});\n`;
                    return (out);
                }, "*&&%*%@#@!".length, "*&!#%@!@*!".length);
                /// @fixme Temporary hack. These delimiters should be removed from tempOutput when 
                /// executing processNestedContent.
                tempOutput5 = tempOutput5.replace(/\*\&\&\%\*\%\@\#\@\!/g, "");
                tempOutput5 = tempOutput5.replace(/\*\&\!\#\%\@\!\@\*\!/g, "");
                return (tempOutput5);
            }, 0);
            // Execute the assembled JS file.
            let returnedOutput = null;
            try {
                let executionContent = `
			var Hot = arguments[0];
			var PassedHotFile = arguments[1];

			`;
                if (typeof (args) === "string")
                    throw new Error(`The passing arguments cannot be a string!`);
                for (let key in args) {
                    let newVar = "";
                    let newVarValue = args[key];
                    let newVarValueStr = JSON.stringify(newVarValue);
                    newVar = `var ${key} = ${newVarValueStr};\n`;
                    executionContent += newVar;
                }
                let contentName = this.name;
                if (contentName === "")
                    contentName = this.localFile;
                if (contentName === "")
                    contentName = this.url;
                executionContent += `

			function echoOutput (content, throwErrors)
			{
				if (throwErrors == null)
					throwErrors = true;

				if (throwErrors === true)
				{
					Hot.echo (content);

					return;
				}

				try
				{
					Hot.echo (content);
				}
				catch (ex)
				{
					Hot.echo ("");
				}
			}

			function createTestElement (foundStr)
			{
				let testElm = null;

				try
				{
					let obj = foundStr;

					if (typeof (foundStr) === "string")
						obj = JSON.parse (foundStr);

					if (typeof (obj) === "string")
						testElm = new Hot.HotTestElement (obj);

					if (obj instanceof Array)
						testElm = new Hot.HotTestElement (obj[0], obj[1], obj[2]);

					if (obj["name"] != null)
						testElm = new Hot.HotTestElement (obj);

					if (Hot.CurrentPage.testElements[testElm.name] != null)
						throw new Error (\`Test element \${testElm.name} already exists!\`);

					Hot.CurrentPage.addTestElement (testElm);
				}
				catch (ex)
				{
					throw new Error (
			\`Error processing test element \${foundStr} in \${Hot.CurrentPage.name}. Error: \${ex.message}\`
						);
				}

				return (testElm);
			}

			async function runContent (CurrentHotFile)
			{\n`;
                executionContent += output;
                executionContent += `
			}

			return (runContent (PassedHotFile).then (() =>
			{
				return ({
						hot: Hot,
						output: Hot.Output,
						data: JSON.stringify (Hot.Data)
					});
			}));`;
                /// @fixme Prior to execution compile any TypeScript and make it ES5 compatible.
                let func = new Function(executionContent);
                returnedOutput = yield func.apply(this, [Hot_1.Hot, this]);
            }
            catch (ex) {
                if (ex instanceof SyntaxError) {
                    /// @fixme Put what's in the content variable into a prev content variable?
                    /// Then once there's no longer any syntax errors being thrown, execute the 
                    /// code? This would also require saving any HTML outside of the *> and <* 
                    /// then echoing it out. The throw below would have to be removed as well.
                    throw ex;
                }
                else
                    throw ex;
            }
            Hot_1.Hot.Data = returnedOutput.hot.Data;
            let finalOutput = returnedOutput.output;
            Hot_1.Hot.Output = "";
            return (finalOutput);
        });
    }
}
exports.HotFile = HotFile;


/***/ }),

/***/ "./src/HotLog.ts":
/*!***********************!*\
  !*** ./src/HotLog.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.HotLog = exports.HotLogLevel = void 0;
/**
 * The logging level.
 */
var HotLogLevel;
(function (HotLogLevel) {
    /**
     * Prints only info messages.
     */
    HotLogLevel[HotLogLevel["Info"] = 0] = "Info";
    /**
     * Prints only warning messages.
     */
    HotLogLevel[HotLogLevel["Warning"] = 1] = "Warning";
    /**
     * Prints only error messages.
     */
    HotLogLevel[HotLogLevel["Error"] = 2] = "Error";
    /**
     * Prints all messages.
     */
    HotLogLevel[HotLogLevel["Verbose"] = 3] = "Verbose";
    /**
     * Prints all messages, except verbose.
     */
    HotLogLevel[HotLogLevel["All"] = 4] = "All";
    /**
     * Doesn't print any message.
     */
    HotLogLevel[HotLogLevel["None"] = 5] = "None";
})(HotLogLevel = exports.HotLogLevel || (exports.HotLogLevel = {}));
/**
 * The logger.
 */
class HotLog {
    constructor(logLevel = HotLogLevel.All) {
        this.logLevel = logLevel;
    }
    /**
     * Log a message.
     */
    log(level, message) {
        if (this.logLevel === HotLogLevel.Verbose) {
            if (level === HotLogLevel.Error)
                this.error(message);
            if (level === HotLogLevel.Warning)
                this.warning(message);
            if ((level === HotLogLevel.Info) ||
                (level === HotLogLevel.Verbose)) {
                this.info(message);
            }
        }
        if (this.logLevel === HotLogLevel.All) {
            if (level === HotLogLevel.Error)
                this.error(message);
            if (level === HotLogLevel.Warning)
                this.warning(message);
            if (level === HotLogLevel.Info)
                this.info(message);
        }
        if (this.logLevel === HotLogLevel.Error) {
            if (level === HotLogLevel.Error)
                this.error(message);
        }
        if (this.logLevel === HotLogLevel.Warning) {
            if (level === HotLogLevel.Warning)
                this.warning(message);
        }
        if (this.logLevel === HotLogLevel.Info) {
            if (level === HotLogLevel.Info)
                this.info(message);
        }
    }
    /**
     * Log a verbose message.
     */
    verbose(message) {
        if (this.logLevel === HotLogLevel.Verbose)
            console.info(message);
    }
    /**
     * Log a message.
     */
    info(message) {
        if ((this.logLevel === HotLogLevel.All) ||
            (this.logLevel === HotLogLevel.Verbose) ||
            (this.logLevel === HotLogLevel.Info)) {
            console.info(message);
        }
    }
    /**
     * Log a warning.
     */
    warning(message) {
        if ((this.logLevel === HotLogLevel.All) ||
            (this.logLevel === HotLogLevel.Verbose) ||
            (this.logLevel === HotLogLevel.Warning)) {
            console.warn(message);
        }
    }
    /**
     * Log an error message.
     */
    error(message) {
        if ((this.logLevel === HotLogLevel.All) ||
            (this.logLevel === HotLogLevel.Verbose) ||
            (this.logLevel === HotLogLevel.Error)) {
            let msg = "";
            if (typeof (message) === "string")
                msg = message;
            else {
                if (message.message != null)
                    msg = message.message;
                if (message.stack != null)
                    msg = message.stack;
            }
            console.error(msg);
        }
    }
}
exports.HotLog = HotLog;


/***/ }),

/***/ "./src/HotPage.ts":
/*!************************!*\
  !*** ./src/HotPage.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotPage = void 0;
const Hot_1 = __webpack_require__(/*! ./Hot */ "./src/Hot.ts");
const HotStaq_1 = __webpack_require__(/*! ./HotStaq */ "./src/HotStaq.ts");
/**
 * A page to preprocess.
 */
class HotPage {
    constructor(copy) {
        if (copy instanceof HotStaq_1.HotStaq) {
            this.processor = copy;
            this.name = "";
            this.testerName = "";
            this.testerMap = "";
            this.route = "";
            this.files = [];
            this.testElements = {};
            this.testPaths = {};
        }
        else {
            this.processor = copy.processor;
            this.name = copy.name || "";
            this.testerName = copy.testerName || "";
            this.testerMap = copy.testerMap || "";
            this.route = copy.route || "";
            this.files = copy.files || [];
            this.testElements = copy.testElements || {};
            this.testPaths = copy.testPaths || {};
        }
    }
    /**
     * Add a file to process. It's recommend to load the file prior to
     * adding it to a page if it's about to be used.
     */
    addFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            file.page = this;
            this.files.push(file);
        });
    }
    /**
     * Get the API associated with this page.
     */
    getAPI() {
        return (this.processor.api);
    }
    /**
     * Get the tester API associated with this page.
     */
    getTesterAPI() {
        return (this.processor.testerAPI);
    }
    /**
     * Add all files in the page. Could decrease page loading performance.
     * It's recommend to load the file prior to adding it to a page.
     */
    load(file) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let iIdx = 0; iIdx < this.files.length; iIdx++) {
                let file = this.files[iIdx];
                yield file.load();
            }
        });
    }
    /**
     * Process a page and get the result.
     */
    process(args = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let output = "";
            for (let iIdx = 0; iIdx < this.files.length; iIdx++) {
                let file = this.files[iIdx];
                Hot_1.Hot.Output = "";
                file.page = this;
                output += yield file.process(args);
            }
            return (output);
        });
    }
    /**
     * Add a test element.
     */
    addTestElement(elm) {
        if (this.testElements[elm.name] != null)
            throw new Error(`Test element ${elm.name} already exists!`);
        this.testElements[elm.name] = elm;
    }
    /**
     * Get a test element.
     */
    getTestElement(name) {
        if (this.testElements[name] == null)
            throw new Error(`Test element ${name} doest not exist!`);
        return (this.testElements[name]);
    }
    /**
     * Create a test path.
     */
    createTestPath(pathName, driverFunc) {
        if (this.testPaths[pathName] != null)
            throw new Error(`Test path ${pathName} already exists!`);
        this.testPaths[pathName] = driverFunc;
    }
}
exports.HotPage = HotPage;


/***/ }),

/***/ "./src/HotRoute.ts":
/*!*************************!*\
  !*** ./src/HotRoute.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.HotRoute = void 0;
const HotRouteMethod_1 = __webpack_require__(/*! ./HotRouteMethod */ "./src/HotRouteMethod.ts");
/**
 * The route to use.
 */
class HotRoute {
    constructor(connection, route, methods = []) {
        /**
         * Executes before all routes have been registered.
         */
        this.onPreRegister = null;
        /**
         * Executes when first registering this route with Express. If
         * this returns false, the route will not be registered.
         */
        this.onRegister = null;
        /**
         * Executes after all routes have been registered.
         */
        this.onPostRegister = null;
        /**
         * Executes when authorizing a called method.
         * The value returned from here will be passed to onExecute in the
         * called HotRouteMethod. Undefined returning from here will mean
         * the authorization failed.
         */
        this.onAuthorizeUser = null;
        this.connection = connection;
        this.logger = null;
        if (this.connection != null) {
            if (this.connection.processor != null)
                this.logger = this.connection.processor.logger;
        }
        this.route = route;
        this.version = "v1";
        this.prefix = "";
        this.authCredentials = null;
        this.methods = methods;
        this.errors = {
            "not_authorized": HotRoute.createError("Not authorized.")
        };
    }
    /**
     * Create an error JSON object.
     */
    static createError(message) {
        return ({ error: message });
    }
    /**
     * Add an API method to this route.
     *
     * @param method The name of the method to add. If a HotRouteMethod is supplied, the
     * rest of the arguments supplied will be ignored.
     */
    addMethod(method, executeFunction = null, type = HotRouteMethod_1.HTTPMethod.POST, testCases = null) {
        if (typeof (method) === "string")
            method = new HotRouteMethod_1.HotRouteMethod(this, method, executeFunction, type, null, null, null, testCases);
        this.methods.push(method);
    }
    /**
     * Get a method by it's name.
     */
    getMethod(name) {
        let foundMethod = null;
        for (let iIdx = 0; iIdx < this.methods.length; iIdx++) {
            let method = this.methods[iIdx];
            if (method.name === name) {
                foundMethod = method;
                break;
            }
        }
        return (foundMethod);
    }
}
exports.HotRoute = HotRoute;


/***/ }),

/***/ "./src/HotRouteMethod.ts":
/*!*******************************!*\
  !*** ./src/HotRouteMethod.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.HotRouteMethod = exports.HTTPMethod = void 0;
const Hot_1 = __webpack_require__(/*! ./Hot */ "./src/Hot.ts");
const HotServer_1 = __webpack_require__(/*! ./HotServer */ "./src/HotServer.ts");
/**
 * Available HTTP methods.
 */
var HTTPMethod;
(function (HTTPMethod) {
    HTTPMethod["GET"] = "get";
    HTTPMethod["POST"] = "post";
})(HTTPMethod = exports.HTTPMethod || (exports.HTTPMethod = {}));
/**
 * An API method to make.
 */
class HotRouteMethod {
    constructor(route, name, onExecute = null, type = HTTPMethod.POST, onServerAuthorize = null, onRegister = null, authCredentials = null, testCases = null) {
        this.parentRoute = route;
        this.name = name;
        this.type = type;
        this.isRegistered = false;
        this.executeSetup = false;
        this.authCredentials = authCredentials;
        this.onServerAuthorize = onServerAuthorize;
        this.onRegister = onRegister;
        this.testCases = {};
        if (this.parentRoute.connection.processor.mode === Hot_1.DeveloperMode.Development) {
            if (testCases != null) {
                for (let iIdx = 0; iIdx < testCases.length; iIdx++) {
                    let obj = testCases[iIdx];
                    if (typeof (obj) === "string") {
                        const name = obj;
                        const func = testCases[iIdx + 1];
                        this.addTestCase(name, func);
                        iIdx++;
                    }
                    else
                        this.addTestCase(obj);
                }
            }
        }
        if (this.parentRoute.connection instanceof HotServer_1.HotServer)
            this.onServerExecute = onExecute;
        //else
        //this.onClientExecute = onExecute;
    }
    /**
     * Add a new test case.
     */
    addTestCase(newTestCase, testCaseFunction = null) {
        if (typeof (newTestCase) === "string") {
            const name = newTestCase;
            const func = testCaseFunction;
            this.testCases[name] = {
                name: name,
                func: func
            };
            return;
        }
        if (typeof (newTestCase) === "function") {
            const testCaseId = Object.keys(this.testCases).length;
            const name = `${this.parentRoute.route}/${this.name} test case ${testCaseId}`;
            const func = newTestCase;
            this.testCases[name] = {
                name: name,
                func: func
            };
            return;
        }
        const testCase = newTestCase;
        this.testCases[testCase.name] = testCase;
    }
}
exports.HotRouteMethod = HotRouteMethod;


/***/ }),

/***/ "./src/HotServer.ts":
/*!**************************!*\
  !*** ./src/HotServer.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotServer = exports.HotServerType = void 0;
const HotStaq_1 = __webpack_require__(/*! ./HotStaq */ "./src/HotStaq.ts");
/**
 * The type of server.
 */
var HotServerType;
(function (HotServerType) {
    HotServerType[HotServerType["HTTP"] = 0] = "HTTP";
    HotServerType[HotServerType["WebSockets"] = 1] = "WebSockets";
})(HotServerType = exports.HotServerType || (exports.HotServerType = {}));
/**
 * The server.
 */
class HotServer {
    constructor(processor) {
        if (processor instanceof HotStaq_1.HotStaq) {
            this.processor = processor;
            this.serverType = "Server";
            this.api = null;
            this.listenAddress = "0.0.0.0";
            this.ports = {
                http: 80,
                https: 443
            };
            this.ssl = {
                cert: "",
                key: "",
                ca: ""
            };
            this.redirectHTTPtoHTTPS = true;
            this.type = HotServerType.HTTP;
            this.logger = processor.logger;
            this.secrets = {};
        }
        else {
            this.processor = processor.processor;
            this.serverType = processor.serverType || "Server";
            this.api = processor.api || null;
            this.listenAddress = processor.listenAddress || "0.0.0.0";
            this.ports = processor.ports || {
                http: 80,
                https: 443
            };
            this.ssl = processor.ssl || {
                cert: "",
                key: "",
                ca: ""
            };
            this.redirectHTTPtoHTTPS = processor.redirectHTTPtoHTTPS != null ? processor.redirectHTTPtoHTTPS : true;
            this.type = processor.type || HotServerType.HTTP;
            this.logger = processor.logger;
            this.secrets = processor.secrets || {};
        }
    }
    /**
     * Set an API to this server. This will also set the associated
     * processor to this API as well.
     */
    setAPI(api) {
        return __awaiter(this, void 0, void 0, function* () {
            this.processor.api = api;
            this.api = api;
            //if (registerRoutes === true)
            //await this.api.registerRoutes ();
        });
    }
}
exports.HotServer = HotServer;


/***/ }),

/***/ "./src/HotStaq.ts":
/*!************************!*\
  !*** ./src/HotStaq.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotStaq = void 0;
const fs = __importStar(__webpack_require__(/*! fs */ "./node_modules/node-libs-browser/mock/empty.js"));
const ppath = __importStar(__webpack_require__(/*! path */ "./node_modules/node-libs-browser/mock/empty.js"));
const cross_fetch_1 = __importDefault(__webpack_require__(/*! cross-fetch */ "./node_modules/cross-fetch/dist/browser-ponyfill.js"));
const validate_npm_package_name_1 = __importDefault(__webpack_require__(/*! validate-npm-package-name */ "./node_modules/validate-npm-package-name/index.js"));
const HotPage_1 = __webpack_require__(/*! ./HotPage */ "./src/HotPage.ts");
const HotFile_1 = __webpack_require__(/*! ./HotFile */ "./src/HotFile.ts");
const HotLog_1 = __webpack_require__(/*! ./HotLog */ "./src/HotLog.ts");
const Hot_1 = __webpack_require__(/*! ./Hot */ "./src/Hot.ts");
const HotClient_1 = __webpack_require__(/*! ./HotClient */ "./src/HotClient.ts");
const HotTesterAPI_1 = __webpack_require__(/*! ./HotTesterAPI */ "./src/HotTesterAPI.ts");
const HotTestMap_1 = __webpack_require__(/*! ./HotTestMap */ "./src/HotTestMap.ts");
var HotTesterMocha = null;
var HotTesterMochaSelenium = null;
var HotTestSeleniumDriver = null;
/**
 * The main class that handles all HTML preprocessing, then outputs the
 * results.
 */
class HotStaq {
    constructor(copy = {}) {
        this.api = copy.api || null;
        this.testerAPI = copy.testerAPI || null;
        this.mode = copy.mode || Hot_1.DeveloperMode.Production;
        this.pages = copy.pages || {};
        this.components = copy.components || {};
        this.files = copy.files || {};
        this.hotSite = copy.hotSite || null;
        this.apiContent = `
			var %api_name% = %api_exported_name%.%api_name%;
			var newHotClient = new HotClient (processor);
			var newapi = new %api_name% (%base_url%, newHotClient);
			newHotClient.api = newapi;
			processor.api = newapi;`;
        this.testerApiContent = `
			var HotTesterAPI = HotStaqWeb.HotTesterAPI;
			var newHotTesterClient = new HotClient (processor);
			var newtesterapi = new HotTesterAPI (%base_tester_url%, newHotTesterClient);
			newHotTesterClient.testerAPI = newtesterapi;
			processor.testerAPI = newtesterapi;`;
        this.pageContent =
            `<!DOCTYPE html>
<html>

<head>
	<title>%title%</title>

	<script type = "text/javascript" src = "%hotstaq_js_src%"></script>
	<script type = "text/javascript">
		window.HotStaq = HotStaqWeb.HotStaq;
		window.HotClient = HotStaqWeb.HotClient;
		window.HotAPI = HotStaqWeb.HotAPI;
		window.Hot = HotStaqWeb.Hot;
	</script>

%apis_to_load%

	<script type = "text/javascript">
		function hotstaq_startApp ()
		{
			let tempMode = 0;

			if (window["Hot"] != null)
				tempMode = Hot.Mode;

			%load_hot_site%

			var processor = new HotStaq ();
			var promises = [];
			%developer_mode%

			%api_code%

			%public_secrets%
			%tester_api%
			%load_files%

			processor.mode = tempMode;

			Promise.all (promises).then (function ()
				{
					HotStaq.displayUrl ({
							url: "%url%",
							name: "%title%",
							processor: processor,
							args: %args%,
							testerName: %tester_name%,
							testerMap: %tester_map%,
							testerAPIBaseUrl: %tester_api_base_url%,
							testerLaunchpadUrl: %tester_launchpad_url%
						});
				});
		}

		hotstaq_startApp ();
	</script>
</head>

<body>
</body>

</html>`;
        this.logger = new HotLog_1.HotLog(HotLog_1.HotLogLevel.None);
        this.publicSecrets = {};
        this.testers = {};
    }
    /**
     * Parse a boolean value.
     */
    static parseBoolean(value) {
        value = value.toLowerCase();
        if (value === "true")
            return (true);
        if (value === "false")
            return (false);
        if (value === "yes")
            return (true);
        if (value === "no")
            return (false);
        if (value === "yep")
            return (true);
        if (value === "nah")
            return (false);
        try {
            if (parseInt(value) != 0)
                return (true);
        }
        catch (ex) {
        }
        return (false);
    }
    /**
     * Check if a required parameter exists inside an object. If it exists, return the value.
     */
    static getParam(name, objWithParam, required = true, throwException = true) {
        let value = objWithParam[name];
        if (value == null) {
            if (required === true) {
                if (throwException === true)
                    throw new Error(`Missing required parameter ${name}.`);
            }
        }
        if (typeof (value) === "string") {
            if (required === true) {
                if (value === "") {
                    if (throwException === true)
                        throw new Error(`Missing required parameter ${name}.`);
                }
            }
        }
        return (value);
    }
    /**
     * Check if a required parameter exists inside an object. If it exists, return the value.
     * If it does not exist, return a default value instead.
     */
    static getParamDefault(name, objWithParam, defaultValue) {
        let value = objWithParam[name];
        if (value == null)
            return (defaultValue);
        if (typeof (value) === "string") {
            if (value === "")
                return (defaultValue);
        }
        return (value);
    }
    /**
     * Wait for a number of milliseconds.
     */
    static wait(numMilliseconds) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, numMilliseconds);
            }));
        });
    }
    /**
     * Add a page.
     */
    addPage(page) {
        this.pages[page.name] = page;
    }
    /**
     * Get a page to process.
     */
    getPage(pageName) {
        return (this.pages[pageName]);
    }
    /**
     * Add a file.
     */
    addFile(file) {
        let name = file.name;
        if (name === "")
            name = file.localFile;
        if (name === "")
            name = file.url;
        this.files[name] = file;
    }
    /**
     * Get a file.
     */
    getFile(name) {
        if (this.files[name] == null)
            throw new Error(`Unable to find file ${name}`);
        return (this.files[name]);
    }
    /**
     * Add and register a component.
     */
    addComponent(component) {
        this.components[component.name] = component;
        this.registerComponent(component);
    }
    /**
     * Register a component for use as a HTML tag.
     */
    registerComponent(component) {
        customElements.define(component.tag, class extends HTMLElement {
            constructor() {
                super();
                /// @fixme Is this bad? Could create race conditions.
                (() => __awaiter(this, void 0, void 0, function* () {
                    this.onclick = component.click.bind(component);
                    for (let key in component.events) {
                        let event = component.events[key];
                        // @ts-ignore
                        this.addEventListener(event.type, event.func, event.options);
                    }
                    component.htmlElement = yield component.onCreated(this);
                    if (component.handleAttributes != null)
                        yield component.handleAttributes(this.attributes);
                    else {
                        for (let iIdx = 0; iIdx < this.attributes.length; iIdx++) {
                            let attr = this.attributes[iIdx];
                            let attrName = attr.name.toLowerCase();
                            let attrValue = attr.value;
                            if (attrName === "id")
                                component.name = attrValue;
                            if (attrName === "name")
                                component.name = attrValue;
                            if (attrName === "value")
                                component.value = attrValue;
                        }
                    }
                    let str = yield component.output();
                    let newDOM = new DOMParser().parseFromString(str, "text/html");
                    let shadow = this.attachShadow({ mode: "open" });
                    for (let iIdx = 0; iIdx < newDOM.body.children.length; iIdx++) {
                        let child = newDOM.body.children[iIdx];
                        shadow.appendChild(child);
                    }
                }))();
            }
        }, component.elementOptions);
    }
    /**
     * Get a component to process.
     */
    getComponent(name) {
        return (this.components[name]);
    }
    /**
     * Add a new HTML element(s) to the current document.
     */
    static addHtml(parent, html) {
        let foundParent = null;
        if (typeof (parent) === "string")
            foundParent = document.querySelector(parent);
        else
            foundParent = parent;
        if (foundParent == null)
            throw new Error(`Unable to find parent ${parent}!`);
        let result = null;
        if (typeof (html) === "string") {
            let newDOM = new DOMParser().parseFromString(html, "text/html");
            let results = [];
            for (let iIdx = 0; iIdx < newDOM.body.children.length; iIdx++) {
                let child = newDOM.body.children[iIdx];
                results.push(foundParent.appendChild(child));
            }
            return (results);
        }
        else
            result = foundParent.appendChild(html);
        return (result);
    }
    /**
     * Check if a HotSite's name is valid.
     */
    static checkHotSiteName(hotsiteName, throwException = false) {
        let throwTheException = () => {
            if (throwException === true)
                throw new Error(`HotSite ${hotsiteName} has an invalid name! The name cannot be empty and must have a valid NPM module name.`);
        };
        let results = (0, validate_npm_package_name_1.default)(hotsiteName);
        if (results.errors != null) {
            if (results.errors.length > 0)
                throwTheException();
        }
        return (true);
    }
    /**
     * In the supplied content, replace a key in a ${KEY} with a value.
     *
     * @returns The content with the correct values.
     */
    static replaceKey(content, key, value) {
        const finalStr = content.replace(new RegExp(`\\$\\{${key}\\}`, "g"), value);
        return (finalStr);
    }
    /**
     * Get a value from a HotSite object.
     *
     * @returns Returns the value from the hotsite object. Returns null if it doesn't exist.
     */
    static getValueFromHotSiteObj(hotsite, params) {
        let value = null;
        if (hotsite != null) {
            let prevValue = hotsite;
            // Go through each object in the list of parameters and 
            // get the value of the final parameter.
            for (let iIdx = 0; iIdx < params.length; iIdx++) {
                let param = params[iIdx];
                if (prevValue[param] == null) {
                    prevValue = null;
                    break;
                }
                prevValue = prevValue[param];
            }
            if (prevValue != null)
                value = prevValue;
        }
        return (value);
    }
    /**
     * Load from a HotSite.json file. Be sure to load and attach any testers before
     * loading a HotSite.
     */
    loadHotSite(path) {
        return __awaiter(this, void 0, void 0, function* () {
            let jsonStr = "";
            if (HotStaq.isWeb === true) {
                this.logger.info(`Retrieving HotSite ${path}`);
                let res = yield (0, cross_fetch_1.default)(path);
                this.logger.info(`Retrieved site ${path}`);
                jsonStr = res.text();
            }
            else {
                path = ppath.normalize(path);
                this.logger.info(`Retrieving HotSite ${path}`);
                jsonStr = yield new Promise((resolve, reject) => {
                    fs.readFile(path, (err, data) => {
                        if (err != null)
                            throw err;
                        let content = data.toString();
                        this.logger.info(`Retrieved site ${path}`);
                        resolve(content);
                    });
                });
            }
            this.hotSite = JSON.parse(jsonStr);
            HotStaq.checkHotSiteName(this.hotSite.name, true);
            this.hotSite.hotsitePath = path;
            let routes = this.hotSite.routes;
            let testerUrl = "http://127.0.0.1:8182";
            let tester = null;
            let driver = null;
            if (HotStaq.isWeb === false) {
                if (this.mode === Hot_1.DeveloperMode.Development) {
                    if (this.hotSite.testing != null) {
                        let setupTester = (parentObj) => {
                            let createNewTester = true;
                            if (parentObj.createNewTester != null)
                                createNewTester = parentObj.createNewTester;
                            let testerName = "Tester";
                            if (parentObj.tester != null)
                                testerName = parentObj.tester;
                            if (parentObj.testerName != null)
                                testerName = parentObj.testerName;
                            if (createNewTester === true) {
                                /// @fixme Find a way to securely allow devs to use their own drivers and testers...
                                /// @fixme Hack for dealing with WebPack's bs.
                                HotTesterMocha = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module './HotTesterMocha'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())).HotTesterMocha;
                                HotTesterMochaSelenium = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module './HotTesterMochaSelenium'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())).HotTesterMochaSelenium;
                                HotTestSeleniumDriver = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module './HotTestSeleniumDriver'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())).HotTestSeleniumDriver;
                                if (parentObj.testerAPIUrl === "")
                                    testerUrl = parentObj.testerAPIUrl;
                                if (parentObj.driver === "HotTestSeleniumDriver")
                                    driver = new HotTestSeleniumDriver();
                                if (parentObj.tester === "HotTesterMocha")
                                    tester = new HotTesterMocha(this, testerName, testerUrl, driver);
                                if (parentObj.tester === "HotTesterMochaSelenium")
                                    tester = new HotTesterMochaSelenium(this, testerName, testerUrl);
                            }
                            else
                                tester = this.testers[testerName];
                        };
                        if (this.hotSite.testing.web != null)
                            setupTester(this.hotSite.testing.web);
                        if (this.hotSite.testing.api != null)
                            setupTester(this.hotSite.testing.api);
                    }
                }
            }
            if (routes != null) {
                for (let key in routes) {
                    let route = routes[key];
                    let file = new HotFile_1.HotFile(route);
                    let page = new HotPage_1.HotPage({
                        processor: this,
                        name: route.name || "",
                        route: key,
                        files: [file]
                    });
                    if (tester != null) {
                        if (this.mode === Hot_1.DeveloperMode.Development) {
                            let mapName = route.name;
                            let testMap = null;
                            if (route.map != null) {
                                if (typeof (route.map) === "string") {
                                    if (tester.testMaps[route.map] == null)
                                        throw new Error(`Test map ${route.map} does not exist!`);
                                    tester.testMaps[mapName] = tester.testMaps[route.map];
                                }
                                else {
                                    testMap = new HotTestMap_1.HotTestMap();
                                    let destinations = null;
                                    if (route.map instanceof Array) {
                                        destinations = [];
                                        for (let iIdx = 0; iIdx < route.map.length; iIdx++) {
                                            let dest = route.map[iIdx];
                                            destinations.push(new HotTestMap_1.HotTestDestination(dest));
                                        }
                                    }
                                    else {
                                        destinations = {};
                                        for (let key2 in route.map) {
                                            let dest = route.map[key2];
                                            destinations[key2] = new HotTestMap_1.HotTestDestination(dest);
                                        }
                                    }
                                    testMap.destinations = destinations;
                                }
                                tester.testMaps[mapName] = testMap;
                            }
                            if (route.destinationOrder != null)
                                tester.testMaps[mapName].destinationOrder = route.destinationOrder;
                        }
                    }
                    this.addPage(page);
                }
            }
            if (this.hotSite.apis != null) {
                for (let key in this.hotSite.apis) {
                    let api = this.hotSite.apis[key];
                    if (api.map == null)
                        continue;
                    if (HotStaq.isWeb === false) {
                        if (this.mode === Hot_1.DeveloperMode.Development) {
                            let mapName = key;
                            let testMap = new HotTestMap_1.HotTestMap();
                            testMap.destinations = [];
                            for (let iIdx = 0; iIdx < api.map.length; iIdx++) {
                                let map = api.map[iIdx];
                                testMap.destinations.push(new HotTestMap_1.HotTestDestination(map));
                            }
                            if (tester == null)
                                throw new Error(`A tester was not created first! You must specify one in the CLI or in HotSite.json.`);
                            tester.testMaps[mapName] = testMap;
                        }
                    }
                }
            }
            /// @fixme Allow this to work for server-side as well...
            if (HotStaq.isWeb === true) {
                for (let key in this.hotSite.components) {
                    let component = this.hotSite.components[key];
                    let componentUrl = component.url;
                    /// @fixme Create unit test for fetching, loading, and registering.
                    let res = yield (0, cross_fetch_1.default)(componentUrl);
                    let newComponent = eval(res);
                    this.addComponent(newComponent);
                }
            }
            if (this.hotSite.routes == null)
                this.hotSite.routes = {};
            yield this.loadHotFiles(this.hotSite.files);
            if (tester != null)
                this.addTester(tester);
        });
    }
    /**
     * Load an array of files. If a file already has content, it will not be reloaded
     * unless forceContentLoading is set to true.
     */
    loadHotFiles(files, forceContentLoading = false) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let key in files) {
                let file = files[key];
                let newFile = null;
                if (HotStaq.isWeb === true) {
                    newFile = new HotFile_1.HotFile({
                        "name": key
                    });
                }
                else {
                    newFile = new HotFile_1.HotFile({
                        "name": key
                    });
                }
                if (file.url != null)
                    newFile.url = file.url;
                if (HotStaq.isWeb === false) {
                    if (file.localFile != null)
                        newFile.localFile = file.localFile;
                }
                let loadContent = true;
                if (file.content != null) {
                    newFile.content = file.content;
                    loadContent = false;
                }
                if (forceContentLoading === true)
                    loadContent = true;
                if (loadContent === true)
                    yield newFile.load();
                this.addFile(newFile);
            }
        });
    }
    /**
     * Generate the content to send to a client.
     */
    generateContent(routeKey, name = "", url = "./", jsSrcPath = "./js/HotStaq.js", passArgs = true, args = null) {
        let apiScripts = "";
        let apiCode = "";
        let publicSecrets = "";
        /// @todo Optimize this function as much as possible.
        // Load the API string.
        if (this.hotSite != null) {
            if (this.hotSite.server.globalApi != null) {
                if (this.hotSite.server.globalApi !== "") {
                    const globalApi = this.hotSite.apis[this.hotSite.server.globalApi];
                    if (globalApi == null)
                        this.logger.warning(`API with name ${this.hotSite.server.globalApi} doesn't exist!`);
                    else {
                        let sendJSContent = true;
                        if (globalApi.jsapi == null) {
                            sendJSContent = false;
                            this.logger.warning(`API with name ${this.hotSite.server.globalApi} doesn't have a jsapi set. Will not send js content to client.`);
                        }
                        if (globalApi.libraryName == null) {
                            sendJSContent = false;
                            this.logger.warning(`API with name ${this.hotSite.server.globalApi} doesn't have a libraryName set. Will not send js content to client.`);
                        }
                        if (globalApi.apiName == null) {
                            sendJSContent = false;
                            this.logger.warning(`API with name ${this.hotSite.server.globalApi} doesn't have a apiName set. Will not send js content to client.`);
                        }
                        if (sendJSContent === true) {
                            apiScripts += `\t<script type = "text/javascript" src = "${globalApi.jsapi}"></script>\n`;
                            let baseUrl = "\"\"";
                            if (this.api != null)
                                baseUrl = `\"${this.api.baseUrl}\"`;
                            let tempAPIContent = this.apiContent;
                            tempAPIContent = tempAPIContent.replace(/\%api\_name\%/g, globalApi.apiName);
                            tempAPIContent = tempAPIContent.replace(/\%api\_exported\_name\%/g, globalApi.libraryName);
                            tempAPIContent = tempAPIContent.replace(/\%base\_url\%/g, baseUrl);
                            apiCode += tempAPIContent;
                        }
                    }
                }
            }
            if (this.hotSite.apis != null) {
                let route = this.hotSite.routes[routeKey];
                if (route != null) {
                    if (route.api != null) {
                        let api = this.hotSite.apis[route.api];
                        if (api == null)
                            throw new Error(`Unable to find API ${route.api}`);
                        let sendJSContent = true;
                        if (api.jsapi == null) {
                            sendJSContent = false;
                            this.logger.warning(`API with name ${route.api} doesn't have a jsapi set. Will not send js content to client.`);
                        }
                        if (api.libraryName == null) {
                            sendJSContent = false;
                            this.logger.warning(`API with name ${route.api} doesn't have a libraryName set. Will not send js content to client.`);
                        }
                        if (api.apiName == null) {
                            sendJSContent = false;
                            this.logger.warning(`API with name ${route.api} doesn't have a apiName set. Will not send js content to client.`);
                        }
                        if (sendJSContent === true) {
                            let jsapipath = api.jsapi;
                            apiScripts += `\t<script type = "text/javascript" src = "${jsapipath}"></script>\n`;
                            let baseUrl = "\"\"";
                            if (this.api != null)
                                baseUrl = `\"${this.api.baseUrl}\"`;
                            let tempAPIContent = this.apiContent;
                            tempAPIContent = tempAPIContent.replace(/\%api\_name\%/g, api.apiName);
                            tempAPIContent = tempAPIContent.replace(/\%api\_exported\_name\%/g, api.libraryName);
                            tempAPIContent = tempAPIContent.replace(/\%base\_url\%/g, baseUrl);
                            apiCode += tempAPIContent;
                        }
                    }
                }
            }
            if (this.hotSite.server != null) {
                if (this.hotSite.server.jsSrcPath != null)
                    jsSrcPath = this.hotSite.server.jsSrcPath;
            }
            if (this.hotSite.publicSecrets != null) {
                for (let key in this.hotSite.publicSecrets) {
                    let secret = this.hotSite.publicSecrets[key];
                    let value = undefined;
                    if (typeof (secret) === "string")
                        value = JSON.stringify(secret);
                    else {
                        if (HotStaq.isWeb === false) {
                            if (this.api != null) {
                                if (this.api.connection == null)
                                    throw new Error(`Cannot pass secrets from the API if there's no connection!`);
                                let serverConn = this.api.connection;
                                if (secret.passSecretFromAPI != null)
                                    value = JSON.stringify(serverConn.secrets[key]);
                            }
                            if (secret.env != null) {
                                /// @fixme @secvul Is this a security vulnerability? Need to verify that 
                                /// only the server has access to this. At this point, I think only the 
                                /// server has access.
                                const envKey = secret.env;
                                value = JSON.stringify(process.env[envKey]);
                            }
                        }
                    }
                    publicSecrets += `processor.publicSecrets["${key}"] = ${value};\n`;
                }
            }
        }
        let content = this.pageContent;
        let fixContent = (tempContent) => {
            let developerModeStr = "";
            let testerAPIStr = "";
            if (this.mode === Hot_1.DeveloperMode.Development) {
                developerModeStr = `tempMode = HotStaqWeb.DeveloperMode.Development;`;
                testerAPIStr = this.testerApiContent;
                if (this.hotSite != null) {
                    if (this.hotSite.testing != null) {
                        if (this.hotSite.testing.web.testerAPIUrl == null)
                            this.hotSite.testing.web.testerAPIUrl = "http://127.0.0.1:8182";
                        testerAPIStr = testerAPIStr.replace(/\%base\_tester\_url\%/g, `\"${this.hotSite.testing.web.testerAPIUrl}\"`);
                    }
                }
            }
            let loadFiles = "";
            if (Object.keys(this.files).length > 0) {
                loadFiles += `var files = {};\n\n`;
                for (let key in this.files) {
                    let file = this.files[key];
                    let fileUrl = `"${file.url}"`;
                    let fileContent = "";
                    if (file.content !== "") {
                        let escapedContent = JSON.stringify(file.content);
                        // Find any script tags and interrupt them so the HTML parsers 
                        // don't get confused.
                        escapedContent = escapedContent.replace(new RegExp("\\<script", "gmi"), "<scr\" + \"ipt");
                        escapedContent = escapedContent.replace(new RegExp("\\<\\/script", "gmi"), "</scr\" + \"ipt");
                        fileContent = `, "content": ${escapedContent}`;
                    }
                    loadFiles += `\t\t\tfiles["${key}"] = { "url": ${fileUrl}${fileContent} };\n`;
                }
                loadFiles += `\t\t\tpromises.push (processor.loadHotFiles (files));\n`;
            }
            tempContent = tempContent.replace(/\%title\%/g, name);
            if (passArgs === true)
                tempContent = tempContent.replace(/\%args\%/g, "Hot.Arguments");
            if (args != null)
                tempContent = tempContent.replace(/\%args\%/g, JSON.stringify(args));
            let testerMap = routeKey;
            let testerUrl = "";
            let testerLaunchpadUrl = "";
            let testerName = "Tester";
            if (this.hotSite != null) {
                if (this.hotSite.testing != null) {
                    if (this.hotSite.testing.web.tester != null)
                        testerName = this.hotSite.testing.web.tester;
                    if (this.hotSite.testing.web.testerName != null)
                        testerName = this.hotSite.testing.web.testerName;
                    if (this.hotSite.testing.web.testerAPIUrl != null)
                        testerUrl = this.hotSite.testing.web.testerAPIUrl;
                    if (this.hotSite.testing.web.launchpadUrl != null)
                        testerLaunchpadUrl = this.hotSite.testing.web.launchpadUrl;
                }
                if (this.hotSite.routes != null) {
                    if (this.hotSite.routes[routeKey] != null) {
                        let route = this.hotSite.routes[routeKey];
                        testerMap = route.name;
                    }
                }
            }
            tempContent = tempContent.replace(/\%hotstaq\_js\_src\%/g, jsSrcPath);
            tempContent = tempContent.replace(/\%developer\_mode\%/g, developerModeStr);
            tempContent = tempContent.replace(/\%tester\_api\%/g, testerAPIStr);
            tempContent = tempContent.replace(/\%apis\_to\_load\%/g, apiScripts);
            tempContent = tempContent.replace(/\%load\_hot\_site\%/g, ""); /// @fixme Should this only be done server-side?
            tempContent = tempContent.replace(/\%load\_files\%/g, loadFiles);
            tempContent = tempContent.replace(/\%api\_code\%/g, apiCode);
            tempContent = tempContent.replace(/\%public\_secrets\%/g, publicSecrets);
            tempContent = tempContent.replace(/\%url\%/g, url);
            tempContent = tempContent.replace(/\%tester\_name\%/g, `"${testerName}"`);
            tempContent = tempContent.replace(/\%tester\_map\%/g, `"${testerMap}"`);
            tempContent = tempContent.replace(/\%tester\_api\_base\_url\%/g, `"${testerUrl}"`);
            tempContent = tempContent.replace(/\%tester\_launchpad\_url\%/g, `"${testerLaunchpadUrl}"`);
            return (tempContent);
        };
        content = fixContent(content);
        return (content);
    }
    /**
     * Create the Express routes from the given pages. Be sure to load the
     * pages first before doing this. This method is meant to be used for
     * customized Express applications. If you wish to use the loaded routes
     * from this HotStaq object with HotHTTPServer, be sure to use
     * the loadHotSite method in HotHTTPServer.
     */
    createExpressRoutes(expressApp, jsSrcPath = "./js/HotStaq.js") {
        for (let key in this.pages) {
            let page = this.pages[key];
            const content = this.generateContent(page.route, page.name, page.files[0].url, jsSrcPath);
            expressApp.get(page.route, (req, res) => {
                res.send(content);
            });
        }
    }
    /**
     * Add a tester for use later.
     */
    addTester(tester) {
        this.testers[tester.name] = tester;
    }
    /**
     * Get the list of maps for testing from the HotSite.
     */
    getWebTestingMaps() {
        if (this.hotSite == null)
            throw new Error("No HotSite was loaded!");
        if (this.hotSite.testing == null)
            throw new Error("The HotSite does not have a testing object!");
        if (this.hotSite.testing.web == null)
            throw new Error("The HotSite does not have a testing web object!");
        if (this.hotSite.testing.web.maps == null)
            throw new Error("The HotSite testing object does not have any maps!");
        return (this.hotSite.testing.web.maps);
    }
    /**
     * Get the list of maps for testing from the HotSite.
     */
    getAPITestingMaps() {
        if (this.hotSite == null)
            throw new Error("No HotSite was loaded!");
        if (this.hotSite.testing == null)
            throw new Error("The HotSite does not have a testing object!");
        if (this.hotSite.testing.api == null)
            throw new Error("The HotSite does not have a testing api object!");
        if (this.hotSite.testing.api.maps == null)
            throw new Error("The HotSite testing object does not have any maps!");
        return (this.hotSite.testing.api.maps);
    }
    /**
     * Get a route's key from a route's name.
     */
    getRouteKeyFromName(name) {
        let foundKey = "";
        if (this.hotSite != null) {
            if (this.hotSite.routes != null) {
                for (let key in this.hotSite.routes) {
                    let route = this.hotSite.routes[key];
                    if (route.name === name) {
                        foundKey = key;
                        break;
                    }
                }
            }
        }
        return (foundKey);
    }
    /**
     * Get a route from a route's name.
     */
    getRouteFromName(name) {
        let foundRoute = null;
        let foundKey = this.getRouteKeyFromName(name);
        if (foundKey !== "")
            foundRoute = this.hotSite.routes[foundKey];
        return (foundRoute);
    }
    /**
     * Execute tests.
     *
     * @param testerName The tester to use to execute tests.
     * @param mapName The map or maps to use to navigate through tests.
     */
    executeTests(testerName, mapName) {
        return __awaiter(this, void 0, void 0, function* () {
            let tester = this.testers[testerName];
            if (tester == null)
                throw new Error(`Unable to execute tests. Tester ${testerName} does not exist!`);
            return (tester.execute(mapName));
        });
    }
    /**
     * Execute all web tests from the HotSite testing web object.
     *
     * @param testerName The tester to use to execute tests.
     */
    executeAllWebTests(testerName) {
        return __awaiter(this, void 0, void 0, function* () {
            let maps = this.getWebTestingMaps();
            let tester = this.testers[testerName];
            if (tester == null)
                throw new Error(`Unable to execute tests. Tester ${testerName} does not exist!`);
            for (let iIdx = 0; iIdx < maps.length; iIdx++) {
                let mapName = maps[iIdx];
                yield this.executeTests(testerName, mapName);
            }
        });
    }
    /**
     * Execute all api tests from the HotSite testing api object.
     *
     * @param testerName The tester to use to execute tests.
     */
    executeAllAPITests(testerName) {
        return __awaiter(this, void 0, void 0, function* () {
            let maps = this.getAPITestingMaps();
            let tester = this.testers[testerName];
            if (tester == null)
                throw new Error(`Unable to execute tests. Tester ${testerName} does not exist!`);
            for (let iIdx = 0; iIdx < maps.length; iIdx++) {
                let mapName = maps[iIdx];
                yield this.executeTests(testerName, mapName);
            }
        });
    }
    /**
     * Process a page and get the result.
     */
    process(pageName, args = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = this.getPage(pageName);
            let result = yield page.process(args);
            return (result);
        });
    }
    /**
     * Process a local file and get the result.
     */
    static processLocalFile(localFilepath, name = localFilepath, args = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let processor = new HotStaq();
            let file = new HotFile_1.HotFile({
                "localFile": localFilepath
            });
            yield file.load();
            let page = new HotPage_1.HotPage({
                "processor": processor,
                "name": name,
                "files": [file]
            });
            processor.addPage(page);
            let result = yield processor.process(name, args);
            return (result);
        });
    }
    /**
     * Process a url and get the result.
     */
    static processUrl(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let file = new HotFile_1.HotFile({
                "url": options.url
            });
            yield file.load();
            let page = new HotPage_1.HotPage({
                "processor": options.processor,
                "name": options.name,
                "files": [file],
                "testerName": options.testerName,
                "testerMap": options.testerMap
            });
            options.processor.addPage(page);
            let result = yield options.processor.process(options.name, options.args);
            return (result);
        });
    }
    /**
     * Process content and get the result.
     */
    static processContent(processor, content, name, args = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let file = new HotFile_1.HotFile({
                "content": content
            });
            yield file.load();
            let page = new HotPage_1.HotPage({
                "processor": processor,
                "name": name,
                "files": [file]
            });
            processor.addPage(page);
            let result = yield processor.process(name, args);
            return (result);
        });
    }
    /**
     * When the window has finished loading, execute the function.
     * This is meant for web browser use only.
     */
    static onReady(readyFunc) {
        if ((document.readyState === "complete") || (document.readyState === "interactive"))
            readyFunc();
        else
            window.addEventListener("load", readyFunc);
    }
    /**
     * Replace the current HTML page with the output.
     * This is meant for web browser use only.
     */
    static useOutput(output) {
        document.open();
        document.write(output);
        document.close();
    }
    /**
     * Wait for testers to load.
     *
     * @fixme This does not wait for ALL testers to finish loading. Only
     * the first one.
     */
    static waitForTesters() {
        return __awaiter(this, void 0, void 0, function* () {
            while (HotStaq.isReadyForTesting === false)
                yield HotStaq.wait(10);
            if (HotStaq.onReadyForTesting != null)
                yield HotStaq.onReadyForTesting();
        });
    }
    /**
     * Process and replace the current HTML page with the hott script from the given url.
     * This is meant for web browser use only.
     */
    static displayUrl(url, name = null, processor = null, args = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return (new Promise((resolve, reject) => {
                HotStaq.onReady(() => __awaiter(this, void 0, void 0, function* () {
                    let options = {
                        "url": ""
                    };
                    if (name == null) {
                        if (typeof (url) === "string")
                            options.name = url;
                        else
                            options.name = url.name;
                    }
                    else
                        options.name = name;
                    if (options.name === "") {
                        if (typeof (url) === "string")
                            options.name = url;
                        else
                            options.name = url.name;
                    }
                    if (typeof (url) === "string")
                        options.url = url;
                    else {
                        options.url = url.url;
                        if (processor == null) {
                            if (url.processor != null)
                                processor = url.processor;
                        }
                        if (args == null) {
                            if (url.args != null)
                                args = url.args;
                        }
                        if (url.testerMap != null)
                            options.testerMap = url.testerMap;
                        if (url.testerName != null)
                            options.testerName = url.testerName;
                        if (url.testerAPIBaseUrl != null)
                            options.testerAPIBaseUrl = url.testerAPIBaseUrl;
                    }
                    if (processor == null)
                        processor = new HotStaq();
                    if (processor.mode === Hot_1.DeveloperMode.Development) {
                        if (processor.testerAPI == null) {
                            if (options.testerAPIBaseUrl == null)
                                options.testerAPIBaseUrl = "";
                            if (options.testerAPIBaseUrl === "")
                                options.testerAPIBaseUrl = "http://127.0.0.1:8182";
                            let client = new HotClient_1.HotClient(processor);
                            let testerAPI = new HotTesterAPI_1.HotTesterAPI(options.testerAPIBaseUrl, client);
                            testerAPI.connection.api = testerAPI;
                            processor.testerAPI = testerAPI;
                        }
                    }
                    options.processor = processor;
                    options.args = args;
                    let output = yield HotStaq.processUrl(options);
                    if (processor.mode === Hot_1.DeveloperMode.Development) {
                        output +=
                            `<script type = "text/javascript">
	function hotstaq_isDocumentReady ()
	{
		if (window["Hot"] != null)
		{
			if (Hot.Mode === HotStaqWeb.DeveloperMode.Development)
			{
				let func = function ()
					{
						if (Hot.TesterAPI != null)
						{
							let testPaths = {};
							let testElements = JSON.stringify (Hot.CurrentPage.testElements);
							let testMaps = JSON.stringify (Hot.CurrentPage.testMaps);

							for (let key in Hot.CurrentPage.testPaths)
							{
								let testPath = Hot.CurrentPage.testPaths[key];

								testPaths[key] = testPath.toString ();
							}

							let testPathsStr = JSON.stringify (testPaths);

							Hot.TesterAPI.tester.pageLoaded ({
									testerName: Hot.CurrentPage.testerName,
									testerMap: Hot.CurrentPage.testerMap,
									pageName: Hot.CurrentPage.name,
									testElements: testElements,
									testPaths: testPathsStr
								}).then (function (resp)
									{
										if (resp.error != null)
										{
											if (resp.error !== "")
												throw new Error (resp.error);
										}

										HotStaqWeb.HotStaq.isReadyForTesting = true;
									});
						}
					};

				if ((document.readyState === "complete") || (document.readyState === "interactive"))
					func ();
				else
					document.addEventListener ("DOMContentLoaded", func);
			}
		}
	}

	hotstaq_isDocumentReady ();
</script>`;
                    }
                    HotStaq.useOutput(output);
                    resolve(processor);
                }));
            }));
        });
    }
    /**
     * Process and replace the current HTML page with the hott script.
     * This is meant for web browser use only.
     */
    static displayContent(content, name, processor = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return (new Promise((resolve, reject) => {
                HotStaq.onReady(() => __awaiter(this, void 0, void 0, function* () {
                    if (processor == null)
                        processor = new HotStaq();
                    let output = yield HotStaq.processContent(processor, content, name);
                    HotStaq.useOutput(output);
                    resolve(processor);
                }));
            }));
        });
    }
}
exports.HotStaq = HotStaq;
/**
 * Indicates if this is a web build.
 */
HotStaq.isWeb = false;
/**
 * Indicates if this is ready for testing.
 */
HotStaq.isReadyForTesting = false;
/**
 * Executes this event when this page is ready for testing.
 */
HotStaq.onReadyForTesting = null;
if (typeof (document) !== "undefined") {
    let hotstaqElms = document.getElementsByTagName("hotstaq");
    if (hotstaqElms.length > 0) {
        let tempMode = 0;
        // @ts-ignore
        if (window["Hot"] != null)
            tempMode = Hot_1.Hot.Mode;
        // @ts-ignore
        let hotstaqElm = hotstaqElms[0];
        let processor = new HotStaq();
        let promises = [];
        processor.mode = tempMode;
        Promise.all(promises).then(function () {
            HotStaq.displayUrl({
                url: hotstaqElm.dataset.loadPage,
                name: "",
                processor: processor,
                args: Hot_1.Hot.Arguments
            });
        });
    }
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/HotTestDriver.ts":
/*!******************************!*\
  !*** ./src/HotTestDriver.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotTestDriver = void 0;
const HotTestElement_1 = __webpack_require__(/*! ./HotTestElement */ "./src/HotTestElement.ts");
/**
 * This actually executes the tests.
 */
class HotTestDriver {
    constructor(page = null) {
        this.page = page;
    }
    /**
     * Get a test object by it's name. If a * is used, it will be used as a
     * wildcard for the object's name. If a > is used, then the name will
     * be treated as a CSS selector.
     */
    parseTestObject(name) {
        let pos = name.indexOf("*");
        let wildcard = "";
        if (pos > -1) {
            name = name.replace(/\*/, "");
            wildcard = "*";
        }
        let selector = `[data-test-object-name${wildcard}='${name}']`;
        pos = name.indexOf(">");
        if (pos > -1) {
            name = name.replace(/\>/, "");
            selector = name;
        }
        return (selector);
    }
    /**
     * Wait for a number of milliseconds.
     */
    wait(numMilliseconds) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, numMilliseconds);
            }));
        });
    }
    /**
     * Print a message.
     */
    print(message) {
        return __awaiter(this, void 0, void 0, function* () {
            process.stdout.write(message);
        });
    }
    /**
     * Print a message line.
     */
    println(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.print(`${message}\n`);
        });
    }
    /**
     * An expression to test.
     */
    assert(value, errorMessage = "") {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(value))
                throw new Error(errorMessage);
        });
    }
    /**
     * Run a series of test elements.
     */
    run(executions) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = [];
            for (let iIdx = 0; iIdx < executions.length; iIdx++) {
                let execution = executions[iIdx];
                let testElm = null;
                let func = "";
                let value = "";
                if (typeof (execution) === "string") {
                    testElm = this.page.testElements[execution];
                    /// @fixme This is going to wreck selecting test elements by wildcards.
                    if (testElm == null)
                        throw new Error(`HotTestDriver: Unable to find test element ${execution}`);
                    func = testElm.func;
                    value = testElm.value;
                }
                if (execution instanceof Array) {
                    let name = execution[0];
                    testElm = this.page.testElements[name];
                    // This null catch is specifically to help find wildcard test elements.
                    if (testElm == null) {
                        testElm = new HotTestElement_1.HotTestElement(name);
                        func = execution[1];
                        value = execution[2];
                    }
                    else {
                        func = testElm.func;
                        value = testElm.value;
                        if (execution.length > 1)
                            func = execution[1];
                        if (execution.length > 2)
                            value = execution[2];
                    }
                }
                testElm.func = func;
                testElm.value = value;
                results.push(yield this.runCommand(testElm));
            }
            return (results);
        });
    }
}
exports.HotTestDriver = HotTestDriver;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/HotTestElement.ts":
/*!*******************************!*\
  !*** ./src/HotTestElement.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.HotTestElement = exports.HotTestElementOptions = void 0;
/**
 * Hot test element options.
 */
class HotTestElementOptions {
    constructor(copy = {}) {
        this.mustBeVisible = copy.mustBeVisible || true;
        this.ignoreMissingElementError = copy.ignoreMissingElementError || false;
    }
}
exports.HotTestElementOptions = HotTestElementOptions;
/**
 * A test element.
 */
class HotTestElement {
    constructor(name, func = "", value = null) {
        if (typeof (name) === "string") {
            this.name = name;
            this.func = func;
            this.value = value;
        }
        else {
            this.name = name.name;
            this.func = name.func || func;
            this.value = name.value || value;
        }
    }
}
exports.HotTestElement = HotTestElement;


/***/ }),

/***/ "./src/HotTestMap.ts":
/*!***************************!*\
  !*** ./src/HotTestMap.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.HotTestMap = exports.HotTestDestination = void 0;
/**
 * The destination to take in a map.
 */
class HotTestDestination {
    constructor(destination = "", autoStart = true) {
        if (typeof (destination) === "string") {
            this.destination = destination;
            this.autoStart = autoStart;
        }
        else {
            if (destination instanceof HotTestDestination) {
                this.destination = destination.destination;
                this.autoStart = destination.autoStart;
            }
            else {
                this.destination = destination.path;
                this.autoStart = destination.autoStart;
            }
        }
    }
}
exports.HotTestDestination = HotTestDestination;
/**
 * Maps the paths that are taken to complete a test.
 */
class HotTestMap {
    constructor(destinations = [], pages = {}, destinationOrder = []) {
        // Go through and convert any strings into HotTestDestinations.
        if (destinations instanceof Array) {
            this.destinations = [];
            for (let iIdx = 0; iIdx < destinations.length; iIdx++) {
                let dest = destinations[iIdx];
                this.destinations.push(new HotTestDestination(dest));
            }
        }
        else {
            this.destinations = {};
            for (let key in destinations) {
                let dest = destinations[key];
                this.destinations[key] = new HotTestDestination(dest);
            }
        }
        this.destinationOrder = destinationOrder;
        this.pages = pages;
    }
}
exports.HotTestMap = HotTestMap;


/***/ }),

/***/ "./src/HotTester.ts":
/*!**************************!*\
  !*** ./src/HotTester.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotTester = void 0;
const HotStaq_1 = __webpack_require__(/*! ./HotStaq */ "./src/HotStaq.ts");
/**
 * Executes tests.
 */
class HotTester {
    constructor(processor, name, baseUrl, driver, testMaps = {}) {
        this.processor = processor;
        this.name = name;
        this.baseUrl = baseUrl;
        this.testMaps = testMaps;
        this.driver = driver;
        this.finishedLoading = false;
        this.hasBeenSetup = false;
        this.hasBeenDestroyed = false;
    }
    /**
     * Waits for the API to finish loading all data.
     */
    waitForData() {
        return __awaiter(this, void 0, void 0, function* () {
            while (this.finishedLoading === false)
                yield HotStaq_1.HotStaq.wait(10);
        });
    }
    /**
     * Get a test page.
     */
    getTestPage(destination) {
        let page = this.testMaps[destination.mapName].pages[destination.page];
        return (page);
    }
    /**
     * Get a test path.
     */
    getTestPath(destination, pathName) {
        let page = this.testMaps[destination.mapName].pages[destination.page];
        return (page.testPaths[pathName]);
    }
    /**
     * Get a destination JSON object to use.
     */
    static interpretDestination(mapName, testDest) {
        let destination = testDest.destination;
        let newDestination = {
            mapName: mapName,
            page: "",
            api: "",
            paths: []
        };
        let strs = destination.split(/\-\>/g);
        let type = strs[0];
        let getType = (typeStr, typeDelimiter) => {
            let pos = typeStr.indexOf(typeDelimiter);
            let typeValue = "";
            if (pos > -1) {
                typeValue = typeStr.substr(pos + typeDelimiter.length);
                typeValue = typeValue.trim();
            }
            return (typeValue);
        };
        newDestination.page = getType(type, "page:");
        newDestination.api = getType(type, "api:");
        for (let iIdx = 1; iIdx < strs.length; iIdx++) {
            let newPathStr = strs[iIdx];
            let newPath = {
                cmd: "",
                dest: "",
                path: ""
            };
            newPathStr = newPathStr.trim();
            newPath.dest = getType(newPathStr, "dest:");
            newPath.cmd = getType(newPathStr, "cmd:");
            newPath.path = getType(newPathStr, "path:");
            if ((newPath.dest == "") && (newPath.cmd == "") && (newPath.path == ""))
                newPath.path = newPathStr;
            newDestination.paths.push(newPath);
        }
        return (newDestination);
    }
    /**
     * Execute an API's test path.
     */
    executeTestAPIPath(destination, method, testName, skipEventCalls = false, continueWhenTestIsComplete = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let runTestPath = true;
            // A dumb hack to prevent any recursion that could occur.
            if (skipEventCalls === false) {
                if (this.onTestAPIPathStart != null)
                    runTestPath = yield this.onTestAPIPathStart(destination, method, testName, continueWhenTestIsComplete);
            }
            let result = null;
            if (runTestPath === true) {
                let testCaseObject = method.testCases[testName];
                if (testCaseObject == null)
                    throw new Error(`HotTester: Test case object ${testName} does not exist!`);
                result = yield testCaseObject.func(this.driver);
            }
            if (skipEventCalls === false) {
                if (this.onTestAPIPathEnd != null)
                    yield this.onTestAPIPathEnd(destination, method, testName, result, continueWhenTestIsComplete);
            }
            return (result);
        });
    }
    /**
     * Execute all test paths in an API route.
     *
     * @fixme This needs a better implementation...
     */
    executeTestAPIPaths(destination) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = [];
            let testMap = this.testMaps[destination.mapName];
            if (testMap == null)
                throw new Error(`HotTester: Map ${destination.mapName} does not exist!`);
            if (this.processor.api == null)
                throw new Error(`HotTester: Associated processor does not have an API!`);
            let route = this.processor.api.routes[destination.api];
            if (route == null)
                throw new Error(`HotTester: API does not have route ${destination.api}!`);
            // Iterate through each path in the destination until complete.
            for (let iIdx = 0; iIdx < destination.paths.length; iIdx += 2) {
                let stop = destination.paths[iIdx];
                let pathName = stop.path;
                let method = route.getMethod(pathName);
                let nextStop = destination.paths[iIdx + 1];
                let testName = nextStop.path;
                let result = yield this.executeTestAPIPath(destination, method, testName);
                results.push(result);
            }
            return (results);
        });
    }
    /**
     * Execute a test page path.
     */
    executeTestPagePath(destination, stop, skipEventCalls = false, continueWhenTestIsComplete = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let runTestPath = true;
            let testMap = this.testMaps[destination.mapName];
            /// @fixme For some reason the errors being thrown here are not being thrown.
            if (testMap == null)
                throw new Error(`HotTester: Map ${destination.mapName} does not exist!`);
            let page = testMap.pages[destination.page];
            if (page == null)
                throw new Error(`HotTester: Page ${destination.page} does not exist!`);
            this.driver.page = page;
            let testPathName = stop.path;
            let testPath = page.testPaths[testPathName];
            // A dumb hack to prevent any recursion that could occur.
            if (skipEventCalls === false) {
                if (this.onTestPagePathStart != null)
                    runTestPath = yield this.onTestPagePathStart(destination, page, stop, continueWhenTestIsComplete);
            }
            let result = null;
            if (runTestPath === true) {
                if (testPath == null) {
                    throw new Error(`HotTester: Test path ${testPathName} does not have a function!`);
                }
                result = yield testPath(this.driver);
            }
            if (skipEventCalls === false) {
                if (this.onTestPagePathEnd != null)
                    yield this.onTestPagePathEnd(destination, testPath, result, continueWhenTestIsComplete);
            }
            return (result);
        });
    }
    /**
     * Execute a command.
     */
    executeCommand(destination, page, stop, cmd) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
             * Check if the input command matches.
             */
            let hasCmd = (input, cmd, hasArguments) => {
                let result = false;
                if (stop.cmd === cmd)
                    result = true;
                const pos = stop.cmd.indexOf("(");
                // If there's parenthesis, get the incoming command.
                if (pos > -1) {
                    let inputCmd = stop.cmd.substr(0, pos);
                    if (inputCmd === cmd)
                        result = true;
                }
                return (result);
            };
            /**
             * Get the arguments in a command. This will only return a
             * single argument for now.
             *
             * @fixme Add support for multiple arguments.
             */
            let getCmdArgs = (input) => {
                let results = [];
                let matches = input.match(/(?=\()(.*?)(?=\))/g);
                if (matches != null) {
                    let tempMatch = matches[0];
                    // A little hack, since I suck at Regex :(
                    tempMatch = tempMatch.substr(2, tempMatch.length);
                    results.push(tempMatch);
                }
                if (results.length < 1)
                    throw new Error(`HotTester: Command ${input} requires arguments, but none were supplied.`);
                return (results);
            };
            let cmdFunc = null;
            let args = [];
            if (hasCmd(stop.cmd, "waitForTesterAPIData", false) === true) {
                cmdFunc = (cmdArgs) => __awaiter(this, void 0, void 0, function* () {
                    this.finishedLoading = false;
                    yield this.waitForData();
                });
            }
            if (hasCmd(stop.cmd, "wait", true) === true) {
                args = getCmdArgs(stop.cmd);
                cmdFunc = (cmdArgs) => __awaiter(this, void 0, void 0, function* () {
                    let numMilliseconds = parseInt(cmdArgs[0]);
                    yield HotStaq_1.HotStaq.wait(numMilliseconds);
                });
            }
            if (hasCmd(stop.cmd, "url", true) === true) {
                args = getCmdArgs(stop.cmd);
                cmdFunc = (cmdArgs) => __awaiter(this, void 0, void 0, function* () {
                    let input = cmdArgs[0];
                    yield this.driver.navigateToUrl(input);
                });
            }
            if (hasCmd(stop.cmd, "print", true) === true) {
                args = getCmdArgs(stop.cmd);
                cmdFunc = (cmdArgs) => __awaiter(this, void 0, void 0, function* () {
                    let input = cmdArgs[0];
                    yield this.driver.print(input);
                });
            }
            if (hasCmd(stop.cmd, "println", true) === true) {
                args = getCmdArgs(stop.cmd);
                cmdFunc = (cmdArgs) => __awaiter(this, void 0, void 0, function* () {
                    let input = cmdArgs[0];
                    yield this.driver.println(input);
                });
            }
            if (hasCmd(stop.cmd, "waitForTestObject", true) === true) {
                args = getCmdArgs(stop.cmd);
                cmdFunc = (cmdArgs) => __awaiter(this, void 0, void 0, function* () {
                    let testObject = JSON.parse(cmdArgs[0]);
                    yield this.driver.waitForTestElement(testObject);
                });
            }
            if (cmdFunc == null)
                throw new Error(`HotTester: Command ${stop.cmd} does not exist!`);
            yield this.onCommand(destination, page, stop, cmd, args, cmdFunc);
        });
    }
    /**
     * Execute all test paths in a page.
     */
    executeTestPagePaths(destination, continueWhenTestIsComplete = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = [];
            let testMap = this.testMaps[destination.mapName];
            /// @fixme For some reason the errors being thrown here are not being thrown.
            if (testMap == null)
                throw new Error(`HotTester: Map ${destination.mapName} does not exist!`);
            // Iterate through each path in the destination until complete.
            for (let iIdx = 0; iIdx < destination.paths.length; iIdx++) {
                let stop = destination.paths[iIdx];
                let result = null;
                let page = testMap.pages[destination.page];
                if (page == null)
                    throw new Error(`HotTester: Page ${destination.page} does not exist!`);
                if (stop.dest !== "") {
                    if (testMap.destinations instanceof Array)
                        throw new Error(`HotTester: When using type 'dest' in a destination string, all destinations in map ${destination.mapName} must be named.`);
                    let testDest = testMap.destinations[stop.dest];
                    let newDestination = HotTester.interpretDestination(destination.mapName, testDest);
                    result = yield this.executeTestPagePaths(newDestination);
                }
                if (stop.cmd !== "")
                    yield this.executeCommand(destination, page, stop, stop.cmd);
                if (stop.path !== "")
                    result = yield this.executeTestPagePath(destination, stop, false, continueWhenTestIsComplete);
                results.push(result);
            }
            return (results);
        });
    }
    /**
     * Execute the tests.
     */
    execute(mapName) {
        return __awaiter(this, void 0, void 0, function* () {
            let map = this.testMaps[mapName];
            if (map == null)
                throw new Error(`HotTester: Map ${mapName} does not exist!`);
            // Process routes testing first.
            let routeKey = this.processor.getRouteKeyFromName(mapName);
            let url = "";
            if (routeKey !== "")
                url = `${this.baseUrl}${routeKey}`;
            let executeDestination = (testDest, destinationKey = "") => __awaiter(this, void 0, void 0, function* () {
                if (testDest.autoStart === false)
                    return;
                let destination = HotTester.interpretDestination(mapName, testDest);
                let isWebRoute = false;
                let runTestPaths = true;
                if (destination.page !== "")
                    isWebRoute = true;
                if (this.setup != null) {
                    if (this.hasBeenSetup === false) {
                        yield this.setup(isWebRoute, url, destinationKey);
                        this.hasBeenSetup = true;
                        this.hasBeenDestroyed = false;
                    }
                }
                if (this.onTestStart != null)
                    runTestPaths = yield this.onTestStart(destination, url, destinationKey);
                if (runTestPaths === true) {
                    if (destination.page !== "")
                        yield this.executeTestPagePaths(destination);
                    if (destination.api !== "")
                        yield this.executeTestAPIPaths(destination);
                }
                if (this.onTestEnd != null)
                    yield this.onTestEnd(destination);
                if (this.destroy != null) {
                    if (this.hasBeenDestroyed === false) {
                        yield this.destroy();
                        this.hasBeenDestroyed = true;
                        this.hasBeenSetup = false;
                    }
                }
            });
            // If the map destinations are in an array, just execute those in order.
            if (map.destinations instanceof Array) {
                for (let iIdx = 0; iIdx < map.destinations.length; iIdx++) {
                    let testDest = map.destinations[iIdx];
                    yield executeDestination(testDest);
                }
            }
            else {
                // If there's a destination order, use that.
                if (map.destinationOrder.length > 0) {
                    let hasExecutedKeys = [];
                    // Go through the destination order and execute each one.
                    for (let iIdx = 0; iIdx < map.destinationOrder.length; iIdx++) {
                        let orderKey = map.destinationOrder[iIdx];
                        let testDest = map.destinations[orderKey];
                        if (testDest == null)
                            throw new Error(`HotTester: Destination ${orderKey} does not exist!`);
                        hasExecutedKeys.push(orderKey);
                        yield executeDestination(testDest, orderKey);
                    }
                    // Execute the rest of the destinations that have not been executed yet.
                    for (let key in map.destinations) {
                        let executeDest = true;
                        for (let iIdx = 0; iIdx < hasExecutedKeys.length; iIdx++) {
                            let executedKey = hasExecutedKeys[iIdx];
                            if (executedKey === key) {
                                executeDest = false;
                                break;
                            }
                        }
                        if (executeDest === true) {
                            let testDest = map.destinations[key];
                            yield executeDestination(testDest, key);
                        }
                    }
                }
                else {
                    // Execute the destinations in any order.
                    for (let key in map.destinations) {
                        let testDest = map.destinations[key];
                        yield executeDestination(testDest, key);
                    }
                }
            }
            // End of routes testing
            // Start of API testing
        });
    }
}
exports.HotTester = HotTester;


/***/ }),

/***/ "./src/HotTesterAPI.ts":
/*!*****************************!*\
  !*** ./src/HotTesterAPI.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotTesterAPI = void 0;
const HotAPI_1 = __webpack_require__(/*! ./HotAPI */ "./src/HotAPI.ts");
const HotRoute_1 = __webpack_require__(/*! ./HotRoute */ "./src/HotRoute.ts");
class HotTesterAPI extends HotAPI_1.HotAPI {
    constructor(baseUrl, connection = null, db = null) {
        super(baseUrl, connection, db);
        this.executeEventsUsing = HotAPI_1.EventExecutionType.HotAPI;
        let route = new HotRoute_1.HotRoute(connection, "tester");
        route.addMethod("pageLoaded", this.pageLoaded);
        route.addMethod("executeTests", this.executeTests);
        this.addRoute(route);
    }
    /**
     * This is called when the page has finished loading in development mode.
     */
    pageLoaded(req, res, authorizedValue, jsonObj, queryObj) {
        return __awaiter(this, void 0, void 0, function* () {
            let testerObj = {
                testerName: jsonObj["testerName"],
                testerMap: jsonObj["testerMap"],
                pageName: jsonObj["pageName"],
                testElements: jsonObj["testElements"],
                testPathsStrs: jsonObj["testPaths"]
            };
            for (let key in testerObj) {
                // @ts-ignore
                let testObj = testerObj[key];
                let throwError = false;
                if (testObj == null)
                    throwError = true;
                if ((testerObj.testerName == "") ||
                    (testerObj.testerMap === "") ||
                    (testerObj.testElements === "") ||
                    (testerObj.testPathsStrs === "")) {
                    throwError = true;
                }
                if (throwError === true)
                    throw new Error(`TesterAPI: Object ${key} was not passed.`);
            }
            testerObj.testElements = JSON.parse(testerObj.testElements);
            testerObj.testPathsStrs = JSON.parse(testerObj.testPathsStrs);
            let testPaths = {};
            for (let key in testerObj.testPathsStrs) {
                let testPath = eval(testerObj.testPathsStrs[key]);
                testPaths[key] = testPath;
            }
            let tester = this.connection.processor.testers[testerObj.testerName];
            if (tester == null)
                throw new Error(`TesterAPI: Tester ${testerObj.testerMap} does not exist!`);
            let testMap = tester.testMaps[testerObj.testerMap];
            if (testMap == null)
                throw new Error(`TesterAPI: Tester map ${testerObj.testerMap} does not exist!`);
            testMap.pages[testerObj.pageName] = {
                "testElements": {},
                "testPaths": {}
            };
            testMap.pages[testerObj.pageName].testElements = testerObj.testElements;
            testMap.pages[testerObj.pageName].testPaths = testPaths;
            tester.finishedLoading = true;
            if (tester.onFinishedLoading != null)
                yield tester.onFinishedLoading();
            return (true);
        });
    }
    /**
     * Execute the tests for a page.
     */
    executeTests(req, res, authorizedValue, jsonObj, queryObj) {
        return __awaiter(this, void 0, void 0, function* () {
            let testerName = jsonObj["testerName"];
            let testerMap = jsonObj["testerMap"];
            if ((testerName == null) || (testerMap == null))
                throw new Error("TesterAPI: Not all required json objects were passed.");
            if ((testerName === "") || (testerMap === ""))
                throw new Error("TesterAPI: Not all required json objects were passed.");
            let server = this.connection;
            // @ts-ignore
            if (server.executeTests != null) {
                // @ts-ignore
                yield server.executeTests(testerName, testerMap);
            }
            return (true);
        });
    }
}
exports.HotTesterAPI = HotTesterAPI;


/***/ }),

/***/ "./src/api-web.ts":
/*!************************!*\
  !*** ./src/api-web.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const HotStaq_1 = __webpack_require__(/*! ./HotStaq */ "./src/HotStaq.ts");
const Hot_1 = __webpack_require__(/*! ./Hot */ "./src/Hot.ts");
const HotComponent_1 = __webpack_require__(/*! ./HotComponent */ "./src/HotComponent.ts");
const HotFile_1 = __webpack_require__(/*! ./HotFile */ "./src/HotFile.ts");
const HotLog_1 = __webpack_require__(/*! ./HotLog */ "./src/HotLog.ts");
const HotPage_1 = __webpack_require__(/*! ./HotPage */ "./src/HotPage.ts");
// Server stuff
const HotAPI_1 = __webpack_require__(/*! ./HotAPI */ "./src/HotAPI.ts");
const HotRoute_1 = __webpack_require__(/*! ./HotRoute */ "./src/HotRoute.ts");
const HotRouteMethod_1 = __webpack_require__(/*! ./HotRouteMethod */ "./src/HotRouteMethod.ts");
const HotServer_1 = __webpack_require__(/*! ./HotServer */ "./src/HotServer.ts");
const HotClient_1 = __webpack_require__(/*! ./HotClient */ "./src/HotClient.ts");
// Testing stuff
const HotTestDriver_1 = __webpack_require__(/*! ./HotTestDriver */ "./src/HotTestDriver.ts");
const HotTestElement_1 = __webpack_require__(/*! ./HotTestElement */ "./src/HotTestElement.ts");
const HotTester_1 = __webpack_require__(/*! ./HotTester */ "./src/HotTester.ts");
const HotTesterAPI_1 = __webpack_require__(/*! ./HotTesterAPI */ "./src/HotTesterAPI.ts");
const HotTestMap_1 = __webpack_require__(/*! ./HotTestMap */ "./src/HotTestMap.ts");
HotStaq_1.HotStaq.isWeb = true;
// Can't export interfaces from here :(
module.exports["HotStaq"] = HotStaq_1.HotStaq;
module.exports["Hot"] = Hot_1.Hot;
module.exports["DeveloperMode"] = Hot_1.DeveloperMode;
module.exports["HotComponent"] = HotComponent_1.HotComponent;
module.exports["HotAPI"] = HotAPI_1.HotAPI;
module.exports["EventExecutionType"] = HotAPI_1.EventExecutionType;
module.exports["HotFile"] = HotFile_1.HotFile;
module.exports["HotLog"] = HotLog_1.HotLog;
module.exports["HotLogLevel"] = HotLog_1.HotLogLevel;
module.exports["HotPage"] = HotPage_1.HotPage;
module.exports["HotRoute"] = HotRoute_1.HotRoute;
module.exports["HotRouteMethod"] = HotRouteMethod_1.HotRouteMethod;
module.exports["HTTPMethod"] = HotRouteMethod_1.HTTPMethod;
module.exports["HotServer"] = HotServer_1.HotServer;
module.exports["HotClient"] = HotClient_1.HotClient;
module.exports["HotTester"] = HotTester_1.HotTester;
module.exports["HotTesterAPI"] = HotTesterAPI_1.HotTesterAPI;
module.exports["HotTestMap"] = HotTestMap_1.HotTestMap;
module.exports["HotTestDestination"] = HotTestMap_1.HotTestDestination;
module.exports["HotTestElement"] = HotTestElement_1.HotTestElement;
module.exports["HotTestElementOptions"] = HotTestElement_1.HotTestElementOptions;
module.exports["HotTestDriver"] = HotTestDriver_1.HotTestDriver;


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Ib3RTdGFxV2ViL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0hvdFN0YXFXZWIvLi9ub2RlX21vZHVsZXMvY3Jvc3MtZmV0Y2gvZGlzdC9icm93c2VyLXBvbnlmaWxsLmpzIiwid2VicGFjazovL0hvdFN0YXFXZWIvLi9ub2RlX21vZHVsZXMvanMtY29va2llL2Rpc3QvanMuY29va2llLmpzIiwid2VicGFjazovL0hvdFN0YXFXZWIvLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovL0hvdFN0YXFXZWIvLi9ub2RlX21vZHVsZXMvdmFsaWRhdGUtbnBtLXBhY2thZ2UtbmFtZS9pbmRleC5qcyIsIndlYnBhY2s6Ly9Ib3RTdGFxV2ViLy4vc3JjL0hvdC50cyIsIndlYnBhY2s6Ly9Ib3RTdGFxV2ViLy4vc3JjL0hvdEFQSS50cyIsIndlYnBhY2s6Ly9Ib3RTdGFxV2ViLy4vc3JjL0hvdENsaWVudC50cyIsIndlYnBhY2s6Ly9Ib3RTdGFxV2ViLy4vc3JjL0hvdENvbXBvbmVudC50cyIsIndlYnBhY2s6Ly9Ib3RTdGFxV2ViLy4vc3JjL0hvdEZpbGUudHMiLCJ3ZWJwYWNrOi8vSG90U3RhcVdlYi8uL3NyYy9Ib3RMb2cudHMiLCJ3ZWJwYWNrOi8vSG90U3RhcVdlYi8uL3NyYy9Ib3RQYWdlLnRzIiwid2VicGFjazovL0hvdFN0YXFXZWIvLi9zcmMvSG90Um91dGUudHMiLCJ3ZWJwYWNrOi8vSG90U3RhcVdlYi8uL3NyYy9Ib3RSb3V0ZU1ldGhvZC50cyIsIndlYnBhY2s6Ly9Ib3RTdGFxV2ViLy4vc3JjL0hvdFNlcnZlci50cyIsIndlYnBhY2s6Ly9Ib3RTdGFxV2ViLy4vc3JjL0hvdFN0YXEudHMiLCJ3ZWJwYWNrOi8vSG90U3RhcVdlYi8uL3NyYy9Ib3RUZXN0RHJpdmVyLnRzIiwid2VicGFjazovL0hvdFN0YXFXZWIvLi9zcmMvSG90VGVzdEVsZW1lbnQudHMiLCJ3ZWJwYWNrOi8vSG90U3RhcVdlYi8uL3NyYy9Ib3RUZXN0TWFwLnRzIiwid2VicGFjazovL0hvdFN0YXFXZWIvLi9zcmMvSG90VGVzdGVyLnRzIiwid2VicGFjazovL0hvdFN0YXFXZWIvLi9zcmMvSG90VGVzdGVyQVBJLnRzIiwid2VicGFjazovL0hvdFN0YXFXZWIvLi9zcmMvYXBpLXdlYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLG1CQUFtQixpQkFBaUI7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZELFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVCw4RUFBOEU7QUFDOUU7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOEJBQThCLHFCQUFxQjtBQUNuRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFF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QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHNCQUFzQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUNBQXFDOztBQUVyQztBQUNBO0FBQ0E7O0FBRUEsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixVQUFVOzs7Ozs7Ozs7Ozs7O0FDdkwxQjs7QUFFWjtBQUNBLGVBQWUsbUJBQU8sQ0FBQyx1REFBVTtBQUNqQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFD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QU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsbUJBQVEsQ0FBQztBQUN0QyxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsK0JBQWMsQ0FBQztBQUNsRCxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLDJCQUFVLENBQUM7QUFDMUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxxQkFBUyxDQUFDO0FBQ3hDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcscUJBQVMsQ0FBQztBQUN4QyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLHFCQUFTLENBQUM7QUFDeEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBRywyQkFBWSxDQUFDO0FBQzlDLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsdUJBQVUsQ0FBQztBQUMxQyxNQUFNLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsK0JBQWtCLENBQUM7QUFDMUQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLCtCQUFjLENBQUM7QUFDbEQsTUFBTSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLHNDQUFxQixDQUFDO0FBQ2hFLE1BQU0sQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLEdBQUcsNkJBQWEsQ0FBQyIsImZpbGUiOiJIb3RTdGFxLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvYXBpLXdlYi50c1wiKTtcbiIsInZhciBnbG9iYWwgPSB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcztcbnZhciBfX3NlbGZfXyA9IChmdW5jdGlvbiAoKSB7XG5mdW5jdGlvbiBGKCkge1xudGhpcy5mZXRjaCA9IGZhbHNlO1xudGhpcy5ET01FeGNlcHRpb24gPSBnbG9iYWwuRE9NRXhjZXB0aW9uXG59XG5GLnByb3RvdHlwZSA9IGdsb2JhbDtcbnJldHVybiBuZXcgRigpO1xufSkoKTtcbihmdW5jdGlvbihzZWxmKSB7XG5cbnZhciBpcnJlbGV2YW50ID0gKGZ1bmN0aW9uIChleHBvcnRzKSB7XG5cbiAgdmFyIHN1cHBvcnQgPSB7XG4gICAgc2VhcmNoUGFyYW1zOiAnVVJMU2VhcmNoUGFyYW1zJyBpbiBzZWxmLFxuICAgIGl0ZXJhYmxlOiAnU3ltYm9sJyBpbiBzZWxmICYmICdpdGVyYXRvcicgaW4gU3ltYm9sLFxuICAgIGJsb2I6XG4gICAgICAnRmlsZVJlYWRlcicgaW4gc2VsZiAmJlxuICAgICAgJ0Jsb2InIGluIHNlbGYgJiZcbiAgICAgIChmdW5jdGlvbigpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBuZXcgQmxvYigpO1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSkoKSxcbiAgICBmb3JtRGF0YTogJ0Zvcm1EYXRhJyBpbiBzZWxmLFxuICAgIGFycmF5QnVmZmVyOiAnQXJyYXlCdWZmZXInIGluIHNlbGZcbiAgfTtcblxuICBmdW5jdGlvbiBpc0RhdGFWaWV3KG9iaikge1xuICAgIHJldHVybiBvYmogJiYgRGF0YVZpZXcucHJvdG90eXBlLmlzUHJvdG90eXBlT2Yob2JqKVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIpIHtcbiAgICB2YXIgdmlld0NsYXNzZXMgPSBbXG4gICAgICAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICAgICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICAgICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgICAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgICAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgVWludDMyQXJyYXldJyxcbiAgICAgICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgRmxvYXQ2NEFycmF5XSdcbiAgICBdO1xuXG4gICAgdmFyIGlzQXJyYXlCdWZmZXJWaWV3ID1cbiAgICAgIEFycmF5QnVmZmVyLmlzVmlldyB8fFxuICAgICAgZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogJiYgdmlld0NsYXNzZXMuaW5kZXhPZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSkgPiAtMVxuICAgICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZU5hbWUobmFtZSkge1xuICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIG5hbWUgPSBTdHJpbmcobmFtZSk7XG4gICAgfVxuICAgIGlmICgvW15hLXowLTlcXC0jJCUmJyorLl5fYHx+XS9pLnRlc3QobmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgY2hhcmFjdGVyIGluIGhlYWRlciBmaWVsZCBuYW1lJylcbiAgICB9XG4gICAgcmV0dXJuIG5hbWUudG9Mb3dlckNhc2UoKVxuICB9XG5cbiAgZnVuY3Rpb24gbm9ybWFsaXplVmFsdWUodmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuXG4gIC8vIEJ1aWxkIGEgZGVzdHJ1Y3RpdmUgaXRlcmF0b3IgZm9yIHRoZSB2YWx1ZSBsaXN0XG4gIGZ1bmN0aW9uIGl0ZXJhdG9yRm9yKGl0ZW1zKSB7XG4gICAgdmFyIGl0ZXJhdG9yID0ge1xuICAgICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGl0ZW1zLnNoaWZ0KCk7XG4gICAgICAgIHJldHVybiB7ZG9uZTogdmFsdWUgPT09IHVuZGVmaW5lZCwgdmFsdWU6IHZhbHVlfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICAgICAgaXRlcmF0b3JbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZXJhdG9yXG4gIH1cblxuICBmdW5jdGlvbiBIZWFkZXJzKGhlYWRlcnMpIHtcbiAgICB0aGlzLm1hcCA9IHt9O1xuXG4gICAgaWYgKGhlYWRlcnMgaW5zdGFuY2VvZiBIZWFkZXJzKSB7XG4gICAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgICAgdGhpcy5hcHBlbmQobmFtZSwgdmFsdWUpO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGhlYWRlcnMpKSB7XG4gICAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24oaGVhZGVyKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kKGhlYWRlclswXSwgaGVhZGVyWzFdKTtcbiAgICAgIH0sIHRoaXMpO1xuICAgIH0gZWxzZSBpZiAoaGVhZGVycykge1xuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIGhlYWRlcnNbbmFtZV0pO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKTtcbiAgICB2YWx1ZSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKTtcbiAgICB2YXIgb2xkVmFsdWUgPSB0aGlzLm1hcFtuYW1lXTtcbiAgICB0aGlzLm1hcFtuYW1lXSA9IG9sZFZhbHVlID8gb2xkVmFsdWUgKyAnLCAnICsgdmFsdWUgOiB2YWx1ZTtcbiAgfTtcblxuICBIZWFkZXJzLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldO1xuICB9O1xuXG4gIEhlYWRlcnMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKTtcbiAgICByZXR1cm4gdGhpcy5oYXMobmFtZSkgPyB0aGlzLm1hcFtuYW1lXSA6IG51bGxcbiAgfTtcblxuICBIZWFkZXJzLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwLmhhc093blByb3BlcnR5KG5vcm1hbGl6ZU5hbWUobmFtZSkpXG4gIH07XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKTtcbiAgfTtcblxuICBIZWFkZXJzLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24oY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMubWFwKSB7XG4gICAgICBpZiAodGhpcy5tYXAuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB0aGlzLm1hcFtuYW1lXSwgbmFtZSwgdGhpcyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIEhlYWRlcnMucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgIGl0ZW1zLnB1c2gobmFtZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxuICB9O1xuXG4gIEhlYWRlcnMucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdO1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgaXRlbXMucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxuICB9O1xuXG4gIEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgIGl0ZW1zLnB1c2goW25hbWUsIHZhbHVlXSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxuICB9O1xuXG4gIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gICAgSGVhZGVycy5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXM7XG4gIH1cblxuICBmdW5jdGlvbiBjb25zdW1lZChib2R5KSB7XG4gICAgaWYgKGJvZHkuYm9keVVzZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKSlcbiAgICB9XG4gICAgYm9keS5ib2R5VXNlZCA9IHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHJlYWRlci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChyZWFkZXIuZXJyb3IpO1xuICAgICAgfTtcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZEJsb2JBc0FycmF5QnVmZmVyKGJsb2IpIHtcbiAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICB2YXIgcHJvbWlzZSA9IGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpO1xuICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKTtcbiAgICByZXR1cm4gcHJvbWlzZVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZEJsb2JBc1RleHQoYmxvYikge1xuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcik7XG4gICAgcmVhZGVyLnJlYWRBc1RleHQoYmxvYik7XG4gICAgcmV0dXJuIHByb21pc2VcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRBcnJheUJ1ZmZlckFzVGV4dChidWYpIHtcbiAgICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1Zik7XG4gICAgdmFyIGNoYXJzID0gbmV3IEFycmF5KHZpZXcubGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmlldy5sZW5ndGg7IGkrKykge1xuICAgICAgY2hhcnNbaV0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHZpZXdbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gY2hhcnMuam9pbignJylcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1ZmZlckNsb25lKGJ1Zikge1xuICAgIGlmIChidWYuc2xpY2UpIHtcbiAgICAgIHJldHVybiBidWYuc2xpY2UoMClcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShidWYuYnl0ZUxlbmd0aCk7XG4gICAgICB2aWV3LnNldChuZXcgVWludDhBcnJheShidWYpKTtcbiAgICAgIHJldHVybiB2aWV3LmJ1ZmZlclxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIEJvZHkoKSB7XG4gICAgdGhpcy5ib2R5VXNlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5faW5pdEJvZHkgPSBmdW5jdGlvbihib2R5KSB7XG4gICAgICB0aGlzLl9ib2R5SW5pdCA9IGJvZHk7XG4gICAgICBpZiAoIWJvZHkpIHtcbiAgICAgICAgdGhpcy5fYm9keVRleHQgPSAnJztcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keTtcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5ibG9iICYmIEJsb2IucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgdGhpcy5fYm9keUJsb2IgPSBib2R5O1xuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmZvcm1EYXRhICYmIEZvcm1EYXRhLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlGb3JtRGF0YSA9IGJvZHk7XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkudG9TdHJpbmcoKTtcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiBzdXBwb3J0LmJsb2IgJiYgaXNEYXRhVmlldyhib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5LmJ1ZmZlcik7XG4gICAgICAgIC8vIElFIDEwLTExIGNhbid0IGhhbmRsZSBhIERhdGFWaWV3IGJvZHkuXG4gICAgICAgIHRoaXMuX2JvZHlJbml0ID0gbmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pO1xuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIChBcnJheUJ1ZmZlci5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSB8fCBpc0FycmF5QnVmZmVyVmlldyhib2R5KSkpIHtcbiAgICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYm9keSk7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QmxvYiAmJiB0aGlzLl9ib2R5QmxvYi50eXBlKSB7XG4gICAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgdGhpcy5fYm9keUJsb2IudHlwZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PVVURi04Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKHN1cHBvcnQuYmxvYikge1xuICAgICAgdGhpcy5ibG9iID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpO1xuICAgICAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0ZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUJsb2IpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSkpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIGJsb2InKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlUZXh0XSkpXG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHRoaXMuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICAgIHJldHVybiBjb25zdW1lZCh0aGlzKSB8fCBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUFycmF5QnVmZmVyKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLmJsb2IoKS50aGVuKHJlYWRCbG9iQXNBcnJheUJ1ZmZlcilcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICB0aGlzLnRleHQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpO1xuICAgICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICAgIHJldHVybiByZWplY3RlZFxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgICAgcmV0dXJuIHJlYWRCbG9iQXNUZXh0KHRoaXMuX2JvZHlCbG9iKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZWFkQXJyYXlCdWZmZXJBc1RleHQodGhpcy5fYm9keUFycmF5QnVmZmVyKSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyB0ZXh0JylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keVRleHQpXG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmIChzdXBwb3J0LmZvcm1EYXRhKSB7XG4gICAgICB0aGlzLmZvcm1EYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKGRlY29kZSlcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdGhpcy5qc29uID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihKU09OLnBhcnNlKVxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLy8gSFRUUCBtZXRob2RzIHdob3NlIGNhcGl0YWxpemF0aW9uIHNob3VsZCBiZSBub3JtYWxpemVkXG4gIHZhciBtZXRob2RzID0gWydERUxFVEUnLCAnR0VUJywgJ0hFQUQnLCAnT1BUSU9OUycsICdQT1NUJywgJ1BVVCddO1xuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZU1ldGhvZChtZXRob2QpIHtcbiAgICB2YXIgdXBjYXNlZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpO1xuICAgIHJldHVybiBtZXRob2RzLmluZGV4T2YodXBjYXNlZCkgPiAtMSA/IHVwY2FzZWQgOiBtZXRob2RcbiAgfVxuXG4gIGZ1bmN0aW9uIFJlcXVlc3QoaW5wdXQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB2YXIgYm9keSA9IG9wdGlvbnMuYm9keTtcblxuICAgIGlmIChpbnB1dCBpbnN0YW5jZW9mIFJlcXVlc3QpIHtcbiAgICAgIGlmIChpbnB1dC5ib2R5VXNlZCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKVxuICAgICAgfVxuICAgICAgdGhpcy51cmwgPSBpbnB1dC51cmw7XG4gICAgICB0aGlzLmNyZWRlbnRpYWxzID0gaW5wdXQuY3JlZGVudGlhbHM7XG4gICAgICBpZiAoIW9wdGlvbnMuaGVhZGVycykge1xuICAgICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhpbnB1dC5oZWFkZXJzKTtcbiAgICAgIH1cbiAgICAgIHRoaXMubWV0aG9kID0gaW5wdXQubWV0aG9kO1xuICAgICAgdGhpcy5tb2RlID0gaW5wdXQubW9kZTtcbiAgICAgIHRoaXMuc2lnbmFsID0gaW5wdXQuc2lnbmFsO1xuICAgICAgaWYgKCFib2R5ICYmIGlucHV0Ll9ib2R5SW5pdCAhPSBudWxsKSB7XG4gICAgICAgIGJvZHkgPSBpbnB1dC5fYm9keUluaXQ7XG4gICAgICAgIGlucHV0LmJvZHlVc2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51cmwgPSBTdHJpbmcoaW5wdXQpO1xuICAgIH1cblxuICAgIHRoaXMuY3JlZGVudGlhbHMgPSBvcHRpb25zLmNyZWRlbnRpYWxzIHx8IHRoaXMuY3JlZGVudGlhbHMgfHwgJ3NhbWUtb3JpZ2luJztcbiAgICBpZiAob3B0aW9ucy5oZWFkZXJzIHx8ICF0aGlzLmhlYWRlcnMpIHtcbiAgICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycyk7XG4gICAgfVxuICAgIHRoaXMubWV0aG9kID0gbm9ybWFsaXplTWV0aG9kKG9wdGlvbnMubWV0aG9kIHx8IHRoaXMubWV0aG9kIHx8ICdHRVQnKTtcbiAgICB0aGlzLm1vZGUgPSBvcHRpb25zLm1vZGUgfHwgdGhpcy5tb2RlIHx8IG51bGw7XG4gICAgdGhpcy5zaWduYWwgPSBvcHRpb25zLnNpZ25hbCB8fCB0aGlzLnNpZ25hbDtcbiAgICB0aGlzLnJlZmVycmVyID0gbnVsbDtcblxuICAgIGlmICgodGhpcy5tZXRob2QgPT09ICdHRVQnIHx8IHRoaXMubWV0aG9kID09PSAnSEVBRCcpICYmIGJvZHkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JvZHkgbm90IGFsbG93ZWQgZm9yIEdFVCBvciBIRUFEIHJlcXVlc3RzJylcbiAgICB9XG4gICAgdGhpcy5faW5pdEJvZHkoYm9keSk7XG4gIH1cblxuICBSZXF1ZXN0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgUmVxdWVzdCh0aGlzLCB7Ym9keTogdGhpcy5fYm9keUluaXR9KVxuICB9O1xuXG4gIGZ1bmN0aW9uIGRlY29kZShib2R5KSB7XG4gICAgdmFyIGZvcm0gPSBuZXcgRm9ybURhdGEoKTtcbiAgICBib2R5XG4gICAgICAudHJpbSgpXG4gICAgICAuc3BsaXQoJyYnKVxuICAgICAgLmZvckVhY2goZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgICAgaWYgKGJ5dGVzKSB7XG4gICAgICAgICAgdmFyIHNwbGl0ID0gYnl0ZXMuc3BsaXQoJz0nKTtcbiAgICAgICAgICB2YXIgbmFtZSA9IHNwbGl0LnNoaWZ0KCkucmVwbGFjZSgvXFwrL2csICcgJyk7XG4gICAgICAgICAgdmFyIHZhbHVlID0gc3BsaXQuam9pbignPScpLnJlcGxhY2UoL1xcKy9nLCAnICcpO1xuICAgICAgICAgIGZvcm0uYXBwZW5kKGRlY29kZVVSSUNvbXBvbmVudChuYW1lKSwgZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIHJldHVybiBmb3JtXG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZUhlYWRlcnMocmF3SGVhZGVycykge1xuICAgIHZhciBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICAvLyBSZXBsYWNlIGluc3RhbmNlcyBvZiBcXHJcXG4gYW5kIFxcbiBmb2xsb3dlZCBieSBhdCBsZWFzdCBvbmUgc3BhY2Ugb3IgaG9yaXpvbnRhbCB0YWIgd2l0aCBhIHNwYWNlXG4gICAgLy8gaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzcyMzAjc2VjdGlvbi0zLjJcbiAgICB2YXIgcHJlUHJvY2Vzc2VkSGVhZGVycyA9IHJhd0hlYWRlcnMucmVwbGFjZSgvXFxyP1xcbltcXHQgXSsvZywgJyAnKTtcbiAgICBwcmVQcm9jZXNzZWRIZWFkZXJzLnNwbGl0KC9cXHI/XFxuLykuZm9yRWFjaChmdW5jdGlvbihsaW5lKSB7XG4gICAgICB2YXIgcGFydHMgPSBsaW5lLnNwbGl0KCc6Jyk7XG4gICAgICB2YXIga2V5ID0gcGFydHMuc2hpZnQoKS50cmltKCk7XG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHBhcnRzLmpvaW4oJzonKS50cmltKCk7XG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKGtleSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBoZWFkZXJzXG4gIH1cblxuICBCb2R5LmNhbGwoUmVxdWVzdC5wcm90b3R5cGUpO1xuXG4gIGZ1bmN0aW9uIFJlc3BvbnNlKGJvZHlJbml0LCBvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuXG4gICAgdGhpcy50eXBlID0gJ2RlZmF1bHQnO1xuICAgIHRoaXMuc3RhdHVzID0gb3B0aW9ucy5zdGF0dXMgPT09IHVuZGVmaW5lZCA/IDIwMCA6IG9wdGlvbnMuc3RhdHVzO1xuICAgIHRoaXMub2sgPSB0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDA7XG4gICAgdGhpcy5zdGF0dXNUZXh0ID0gJ3N0YXR1c1RleHQnIGluIG9wdGlvbnMgPyBvcHRpb25zLnN0YXR1c1RleHQgOiAnT0snO1xuICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycyk7XG4gICAgdGhpcy51cmwgPSBvcHRpb25zLnVybCB8fCAnJztcbiAgICB0aGlzLl9pbml0Qm9keShib2R5SW5pdCk7XG4gIH1cblxuICBCb2R5LmNhbGwoUmVzcG9uc2UucHJvdG90eXBlKTtcblxuICBSZXNwb25zZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKHRoaXMuX2JvZHlJbml0LCB7XG4gICAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgICAgc3RhdHVzVGV4dDogdGhpcy5zdGF0dXNUZXh0LFxuICAgICAgaGVhZGVyczogbmV3IEhlYWRlcnModGhpcy5oZWFkZXJzKSxcbiAgICAgIHVybDogdGhpcy51cmxcbiAgICB9KVxuICB9O1xuXG4gIFJlc3BvbnNlLmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IDAsIHN0YXR1c1RleHQ6ICcnfSk7XG4gICAgcmVzcG9uc2UudHlwZSA9ICdlcnJvcic7XG4gICAgcmV0dXJuIHJlc3BvbnNlXG4gIH07XG5cbiAgdmFyIHJlZGlyZWN0U3RhdHVzZXMgPSBbMzAxLCAzMDIsIDMwMywgMzA3LCAzMDhdO1xuXG4gIFJlc3BvbnNlLnJlZGlyZWN0ID0gZnVuY3Rpb24odXJsLCBzdGF0dXMpIHtcbiAgICBpZiAocmVkaXJlY3RTdGF0dXNlcy5pbmRleE9mKHN0YXR1cykgPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCBzdGF0dXMgY29kZScpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiBzdGF0dXMsIGhlYWRlcnM6IHtsb2NhdGlvbjogdXJsfX0pXG4gIH07XG5cbiAgZXhwb3J0cy5ET01FeGNlcHRpb24gPSBzZWxmLkRPTUV4Y2VwdGlvbjtcbiAgdHJ5IHtcbiAgICBuZXcgZXhwb3J0cy5ET01FeGNlcHRpb24oKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgZXhwb3J0cy5ET01FeGNlcHRpb24gPSBmdW5jdGlvbihtZXNzYWdlLCBuYW1lKSB7XG4gICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgIHZhciBlcnJvciA9IEVycm9yKG1lc3NhZ2UpO1xuICAgICAgdGhpcy5zdGFjayA9IGVycm9yLnN0YWNrO1xuICAgIH07XG4gICAgZXhwb3J0cy5ET01FeGNlcHRpb24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xuICAgIGV4cG9ydHMuRE9NRXhjZXB0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGV4cG9ydHMuRE9NRXhjZXB0aW9uO1xuICB9XG5cbiAgZnVuY3Rpb24gZmV0Y2goaW5wdXQsIGluaXQpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGlucHV0LCBpbml0KTtcblxuICAgICAgaWYgKHJlcXVlc3Quc2lnbmFsICYmIHJlcXVlc3Quc2lnbmFsLmFib3J0ZWQpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgZXhwb3J0cy5ET01FeGNlcHRpb24oJ0Fib3J0ZWQnLCAnQWJvcnRFcnJvcicpKVxuICAgICAgfVxuXG4gICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgIGZ1bmN0aW9uIGFib3J0WGhyKCkge1xuICAgICAgICB4aHIuYWJvcnQoKTtcbiAgICAgIH1cblxuICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICBzdGF0dXM6IHhoci5zdGF0dXMsXG4gICAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1c1RleHQsXG4gICAgICAgICAgaGVhZGVyczogcGFyc2VIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSB8fCAnJylcbiAgICAgICAgfTtcbiAgICAgICAgb3B0aW9ucy51cmwgPSAncmVzcG9uc2VVUkwnIGluIHhociA/IHhoci5yZXNwb25zZVVSTCA6IG9wdGlvbnMuaGVhZGVycy5nZXQoJ1gtUmVxdWVzdC1VUkwnKTtcbiAgICAgICAgdmFyIGJvZHkgPSAncmVzcG9uc2UnIGluIHhociA/IHhoci5yZXNwb25zZSA6IHhoci5yZXNwb25zZVRleHQ7XG4gICAgICAgIHJlc29sdmUobmV3IFJlc3BvbnNlKGJvZHksIG9wdGlvbnMpKTtcbiAgICAgIH07XG5cbiAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpO1xuICAgICAgfTtcblxuICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKTtcbiAgICAgIH07XG5cbiAgICAgIHhoci5vbmFib3J0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChuZXcgZXhwb3J0cy5ET01FeGNlcHRpb24oJ0Fib3J0ZWQnLCAnQWJvcnRFcnJvcicpKTtcbiAgICAgIH07XG5cbiAgICAgIHhoci5vcGVuKHJlcXVlc3QubWV0aG9kLCByZXF1ZXN0LnVybCwgdHJ1ZSk7XG5cbiAgICAgIGlmIChyZXF1ZXN0LmNyZWRlbnRpYWxzID09PSAnaW5jbHVkZScpIHtcbiAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdvbWl0Jykge1xuICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICgncmVzcG9uc2VUeXBlJyBpbiB4aHIgJiYgc3VwcG9ydC5ibG9iKSB7XG4gICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYmxvYic7XG4gICAgICB9XG5cbiAgICAgIHJlcXVlc3QuaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIHZhbHVlKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAocmVxdWVzdC5zaWduYWwpIHtcbiAgICAgICAgcmVxdWVzdC5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBhYm9ydFhocik7XG5cbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIC8vIERPTkUgKHN1Y2Nlc3Mgb3IgZmFpbHVyZSlcbiAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICAgIHJlcXVlc3Quc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgYWJvcnRYaHIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgeGhyLnNlbmQodHlwZW9mIHJlcXVlc3QuX2JvZHlJbml0ID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiByZXF1ZXN0Ll9ib2R5SW5pdCk7XG4gICAgfSlcbiAgfVxuXG4gIGZldGNoLnBvbHlmaWxsID0gdHJ1ZTtcblxuICBpZiAoIXNlbGYuZmV0Y2gpIHtcbiAgICBzZWxmLmZldGNoID0gZmV0Y2g7XG4gICAgc2VsZi5IZWFkZXJzID0gSGVhZGVycztcbiAgICBzZWxmLlJlcXVlc3QgPSBSZXF1ZXN0O1xuICAgIHNlbGYuUmVzcG9uc2UgPSBSZXNwb25zZTtcbiAgfVxuXG4gIGV4cG9ydHMuSGVhZGVycyA9IEhlYWRlcnM7XG4gIGV4cG9ydHMuUmVxdWVzdCA9IFJlcXVlc3Q7XG4gIGV4cG9ydHMuUmVzcG9uc2UgPSBSZXNwb25zZTtcbiAgZXhwb3J0cy5mZXRjaCA9IGZldGNoO1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbiAgcmV0dXJuIGV4cG9ydHM7XG5cbn0oe30pKTtcbn0pKF9fc2VsZl9fKTtcbl9fc2VsZl9fLmZldGNoLnBvbnlmaWxsID0gdHJ1ZTtcbi8vIFJlbW92ZSBcInBvbHlmaWxsXCIgcHJvcGVydHkgYWRkZWQgYnkgd2hhdHdnLWZldGNoXG5kZWxldGUgX19zZWxmX18uZmV0Y2gucG9seWZpbGw7XG4vLyBDaG9vc2UgYmV0d2VlbiBuYXRpdmUgaW1wbGVtZW50YXRpb24gKGdsb2JhbCkgb3IgY3VzdG9tIGltcGxlbWVudGF0aW9uIChfX3NlbGZfXylcbi8vIHZhciBjdHggPSBnbG9iYWwuZmV0Y2ggPyBnbG9iYWwgOiBfX3NlbGZfXztcbnZhciBjdHggPSBfX3NlbGZfXzsgLy8gdGhpcyBsaW5lIGRpc2FibGUgc2VydmljZSB3b3JrZXIgc3VwcG9ydCB0ZW1wb3JhcmlseVxuZXhwb3J0cyA9IGN0eC5mZXRjaCAvLyBUbyBlbmFibGU6IGltcG9ydCBmZXRjaCBmcm9tICdjcm9zcy1mZXRjaCdcbmV4cG9ydHMuZGVmYXVsdCA9IGN0eC5mZXRjaCAvLyBGb3IgVHlwZVNjcmlwdCBjb25zdW1lcnMgd2l0aG91dCBlc01vZHVsZUludGVyb3AuXG5leHBvcnRzLmZldGNoID0gY3R4LmZldGNoIC8vIFRvIGVuYWJsZTogaW1wb3J0IHtmZXRjaH0gZnJvbSAnY3Jvc3MtZmV0Y2gnXG5leHBvcnRzLkhlYWRlcnMgPSBjdHguSGVhZGVyc1xuZXhwb3J0cy5SZXF1ZXN0ID0gY3R4LlJlcXVlc3RcbmV4cG9ydHMuUmVzcG9uc2UgPSBjdHguUmVzcG9uc2Vcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1xuIiwiLyohIGpzLWNvb2tpZSB2My4wLjEgfCBNSVQgKi9cbjtcbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgKGdsb2JhbCA9IGdsb2JhbCB8fCBzZWxmLCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjdXJyZW50ID0gZ2xvYmFsLkNvb2tpZXM7XG4gICAgdmFyIGV4cG9ydHMgPSBnbG9iYWwuQ29va2llcyA9IGZhY3RvcnkoKTtcbiAgICBleHBvcnRzLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7IGdsb2JhbC5Db29raWVzID0gY3VycmVudDsgcmV0dXJuIGV4cG9ydHM7IH07XG4gIH0oKSkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbiAgLyogZXNsaW50LWRpc2FibGUgbm8tdmFyICovXG4gIGZ1bmN0aW9uIGFzc2lnbiAodGFyZ2V0KSB7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG4gICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXRcbiAgfVxuICAvKiBlc2xpbnQtZW5hYmxlIG5vLXZhciAqL1xuXG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXZhciAqL1xuICB2YXIgZGVmYXVsdENvbnZlcnRlciA9IHtcbiAgICByZWFkOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIGlmICh2YWx1ZVswXSA9PT0gJ1wiJykge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnNsaWNlKDEsIC0xKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC8oJVtcXGRBLUZdezJ9KSsvZ2ksIGRlY29kZVVSSUNvbXBvbmVudClcbiAgICB9LFxuICAgIHdyaXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpLnJlcGxhY2UoXG4gICAgICAgIC8lKDJbMzQ2QkZdfDNbQUMtRl18NDB8NVtCREVdfDYwfDdbQkNEXSkvZyxcbiAgICAgICAgZGVjb2RlVVJJQ29tcG9uZW50XG4gICAgICApXG4gICAgfVxuICB9O1xuICAvKiBlc2xpbnQtZW5hYmxlIG5vLXZhciAqL1xuXG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXZhciAqL1xuXG4gIGZ1bmN0aW9uIGluaXQgKGNvbnZlcnRlciwgZGVmYXVsdEF0dHJpYnV0ZXMpIHtcbiAgICBmdW5jdGlvbiBzZXQgKGtleSwgdmFsdWUsIGF0dHJpYnV0ZXMpIHtcbiAgICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBhdHRyaWJ1dGVzID0gYXNzaWduKHt9LCBkZWZhdWx0QXR0cmlidXRlcywgYXR0cmlidXRlcyk7XG5cbiAgICAgIGlmICh0eXBlb2YgYXR0cmlidXRlcy5leHBpcmVzID09PSAnbnVtYmVyJykge1xuICAgICAgICBhdHRyaWJ1dGVzLmV4cGlyZXMgPSBuZXcgRGF0ZShEYXRlLm5vdygpICsgYXR0cmlidXRlcy5leHBpcmVzICogODY0ZTUpO1xuICAgICAgfVxuICAgICAgaWYgKGF0dHJpYnV0ZXMuZXhwaXJlcykge1xuICAgICAgICBhdHRyaWJ1dGVzLmV4cGlyZXMgPSBhdHRyaWJ1dGVzLmV4cGlyZXMudG9VVENTdHJpbmcoKTtcbiAgICAgIH1cblxuICAgICAga2V5ID0gZW5jb2RlVVJJQ29tcG9uZW50KGtleSlcbiAgICAgICAgLnJlcGxhY2UoLyUoMlszNDZCXXw1RXw2MHw3QykvZywgZGVjb2RlVVJJQ29tcG9uZW50KVxuICAgICAgICAucmVwbGFjZSgvWygpXS9nLCBlc2NhcGUpO1xuXG4gICAgICB2YXIgc3RyaW5naWZpZWRBdHRyaWJ1dGVzID0gJyc7XG4gICAgICBmb3IgKHZhciBhdHRyaWJ1dGVOYW1lIGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdKSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnOyAnICsgYXR0cmlidXRlTmFtZTtcblxuICAgICAgICBpZiAoYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICAvLyBDb25zaWRlcnMgUkZDIDYyNjUgc2VjdGlvbiA1LjI6XG4gICAgICAgIC8vIC4uLlxuICAgICAgICAvLyAzLiAgSWYgdGhlIHJlbWFpbmluZyB1bnBhcnNlZC1hdHRyaWJ1dGVzIGNvbnRhaW5zIGEgJXgzQiAoXCI7XCIpXG4gICAgICAgIC8vICAgICBjaGFyYWN0ZXI6XG4gICAgICAgIC8vIENvbnN1bWUgdGhlIGNoYXJhY3RlcnMgb2YgdGhlIHVucGFyc2VkLWF0dHJpYnV0ZXMgdXAgdG8sXG4gICAgICAgIC8vIG5vdCBpbmNsdWRpbmcsIHRoZSBmaXJzdCAleDNCIChcIjtcIikgY2hhcmFjdGVyLlxuICAgICAgICAvLyAuLi5cbiAgICAgICAgc3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc9JyArIGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0uc3BsaXQoJzsnKVswXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIChkb2N1bWVudC5jb29raWUgPVxuICAgICAgICBrZXkgKyAnPScgKyBjb252ZXJ0ZXIud3JpdGUodmFsdWUsIGtleSkgKyBzdHJpbmdpZmllZEF0dHJpYnV0ZXMpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0IChrZXkpIHtcbiAgICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnIHx8IChhcmd1bWVudHMubGVuZ3RoICYmICFrZXkpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICAvLyBUbyBwcmV2ZW50IHRoZSBmb3IgbG9vcCBpbiB0aGUgZmlyc3QgcGxhY2UgYXNzaWduIGFuIGVtcHR5IGFycmF5XG4gICAgICAvLyBpbiBjYXNlIHRoZXJlIGFyZSBubyBjb29raWVzIGF0IGFsbC5cbiAgICAgIHZhciBjb29raWVzID0gZG9jdW1lbnQuY29va2llID8gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7ICcpIDogW107XG4gICAgICB2YXIgamFyID0ge307XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBhcnRzID0gY29va2llc1tpXS5zcGxpdCgnPScpO1xuICAgICAgICB2YXIgdmFsdWUgPSBwYXJ0cy5zbGljZSgxKS5qb2luKCc9Jyk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgZm91bmRLZXkgPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMF0pO1xuICAgICAgICAgIGphcltmb3VuZEtleV0gPSBjb252ZXJ0ZXIucmVhZCh2YWx1ZSwgZm91bmRLZXkpO1xuXG4gICAgICAgICAgaWYgKGtleSA9PT0gZm91bmRLZXkpIHtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgfVxuXG4gICAgICByZXR1cm4ga2V5ID8gamFyW2tleV0gOiBqYXJcbiAgICB9XG5cbiAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShcbiAgICAgIHtcbiAgICAgICAgc2V0OiBzZXQsXG4gICAgICAgIGdldDogZ2V0LFxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIChrZXksIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICBzZXQoXG4gICAgICAgICAgICBrZXksXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgIGFzc2lnbih7fSwgYXR0cmlidXRlcywge1xuICAgICAgICAgICAgICBleHBpcmVzOiAtMVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgICAgICB3aXRoQXR0cmlidXRlczogZnVuY3Rpb24gKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICByZXR1cm4gaW5pdCh0aGlzLmNvbnZlcnRlciwgYXNzaWduKHt9LCB0aGlzLmF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMpKVxuICAgICAgICB9LFxuICAgICAgICB3aXRoQ29udmVydGVyOiBmdW5jdGlvbiAoY29udmVydGVyKSB7XG4gICAgICAgICAgcmV0dXJuIGluaXQoYXNzaWduKHt9LCB0aGlzLmNvbnZlcnRlciwgY29udmVydGVyKSwgdGhpcy5hdHRyaWJ1dGVzKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBhdHRyaWJ1dGVzOiB7IHZhbHVlOiBPYmplY3QuZnJlZXplKGRlZmF1bHRBdHRyaWJ1dGVzKSB9LFxuICAgICAgICBjb252ZXJ0ZXI6IHsgdmFsdWU6IE9iamVjdC5mcmVlemUoY29udmVydGVyKSB9XG4gICAgICB9XG4gICAgKVxuICB9XG5cbiAgdmFyIGFwaSA9IGluaXQoZGVmYXVsdENvbnZlcnRlciwgeyBwYXRoOiAnLycgfSk7XG4gIC8qIGVzbGludC1lbmFibGUgbm8tdmFyICovXG5cbiAgcmV0dXJuIGFwaTtcblxufSkpKTtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIndXNlIHN0cmljdCdcblxudmFyIHNjb3BlZFBhY2thZ2VQYXR0ZXJuID0gbmV3IFJlZ0V4cCgnXig/OkAoW14vXSs/KVsvXSk/KFteL10rPykkJylcbnZhciBidWlsdGlucyA9IHJlcXVpcmUoJ2J1aWx0aW5zJylcbnZhciBibGFja2xpc3QgPSBbXG4gICdub2RlX21vZHVsZXMnLFxuICAnZmF2aWNvbi5pY28nXG5dXG5cbnZhciB2YWxpZGF0ZSA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgdmFyIHdhcm5pbmdzID0gW11cbiAgdmFyIGVycm9ycyA9IFtdXG5cbiAgaWYgKG5hbWUgPT09IG51bGwpIHtcbiAgICBlcnJvcnMucHVzaCgnbmFtZSBjYW5ub3QgYmUgbnVsbCcpXG4gICAgcmV0dXJuIGRvbmUod2FybmluZ3MsIGVycm9ycylcbiAgfVxuXG4gIGlmIChuYW1lID09PSB1bmRlZmluZWQpIHtcbiAgICBlcnJvcnMucHVzaCgnbmFtZSBjYW5ub3QgYmUgdW5kZWZpbmVkJylcbiAgICByZXR1cm4gZG9uZSh3YXJuaW5ncywgZXJyb3JzKVxuICB9XG5cbiAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgIGVycm9ycy5wdXNoKCduYW1lIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgIHJldHVybiBkb25lKHdhcm5pbmdzLCBlcnJvcnMpXG4gIH1cblxuICBpZiAoIW5hbWUubGVuZ3RoKSB7XG4gICAgZXJyb3JzLnB1c2goJ25hbWUgbGVuZ3RoIG11c3QgYmUgZ3JlYXRlciB0aGFuIHplcm8nKVxuICB9XG5cbiAgaWYgKG5hbWUubWF0Y2goL15cXC4vKSkge1xuICAgIGVycm9ycy5wdXNoKCduYW1lIGNhbm5vdCBzdGFydCB3aXRoIGEgcGVyaW9kJylcbiAgfVxuXG4gIGlmIChuYW1lLm1hdGNoKC9eXy8pKSB7XG4gICAgZXJyb3JzLnB1c2goJ25hbWUgY2Fubm90IHN0YXJ0IHdpdGggYW4gdW5kZXJzY29yZScpXG4gIH1cblxuICBpZiAobmFtZS50cmltKCkgIT09IG5hbWUpIHtcbiAgICBlcnJvcnMucHVzaCgnbmFtZSBjYW5ub3QgY29udGFpbiBsZWFkaW5nIG9yIHRyYWlsaW5nIHNwYWNlcycpXG4gIH1cblxuICAvLyBObyBmdW5ueSBidXNpbmVzc1xuICBibGFja2xpc3QuZm9yRWFjaChmdW5jdGlvbiAoYmxhY2tsaXN0ZWROYW1lKSB7XG4gICAgaWYgKG5hbWUudG9Mb3dlckNhc2UoKSA9PT0gYmxhY2tsaXN0ZWROYW1lKSB7XG4gICAgICBlcnJvcnMucHVzaChibGFja2xpc3RlZE5hbWUgKyAnIGlzIGEgYmxhY2tsaXN0ZWQgbmFtZScpXG4gICAgfVxuICB9KVxuXG4gIC8vIEdlbmVyYXRlIHdhcm5pbmdzIGZvciBzdHVmZiB0aGF0IHVzZWQgdG8gYmUgYWxsb3dlZFxuXG4gIC8vIGNvcmUgbW9kdWxlIG5hbWVzIGxpa2UgaHR0cCwgZXZlbnRzLCB1dGlsLCBldGNcbiAgYnVpbHRpbnMuZm9yRWFjaChmdW5jdGlvbiAoYnVpbHRpbikge1xuICAgIGlmIChuYW1lLnRvTG93ZXJDYXNlKCkgPT09IGJ1aWx0aW4pIHtcbiAgICAgIHdhcm5pbmdzLnB1c2goYnVpbHRpbiArICcgaXMgYSBjb3JlIG1vZHVsZSBuYW1lJylcbiAgICB9XG4gIH0pXG5cbiAgLy8gcmVhbGx5LWxvbmctcGFja2FnZS1uYW1lcy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1zdWNoLS1sZW5ndGgtLS0tLW1hbnktLS13b3dcbiAgLy8gdGhlIHRoaXNpc2FyZWFsbHlyZWFsbHlsb25ncGFja2FnZW5hbWVpdHNob3VsZHB1Ymxpc2hkb3dlbm93aGF2ZWFsaW1pdHRvdGhlbGVuZ3Rob2ZwYWNrYWdlbmFtZXMtcG9jaC5cbiAgaWYgKG5hbWUubGVuZ3RoID4gMjE0KSB7XG4gICAgd2FybmluZ3MucHVzaCgnbmFtZSBjYW4gbm8gbG9uZ2VyIGNvbnRhaW4gbW9yZSB0aGFuIDIxNCBjaGFyYWN0ZXJzJylcbiAgfVxuXG4gIC8vIG1JeGVEIENhU2UgbkFNRXNcbiAgaWYgKG5hbWUudG9Mb3dlckNhc2UoKSAhPT0gbmFtZSkge1xuICAgIHdhcm5pbmdzLnB1c2goJ25hbWUgY2FuIG5vIGxvbmdlciBjb250YWluIGNhcGl0YWwgbGV0dGVycycpXG4gIH1cblxuICBpZiAoL1t+JyEoKSpdLy50ZXN0KG5hbWUuc3BsaXQoJy8nKS5zbGljZSgtMSlbMF0pKSB7XG4gICAgd2FybmluZ3MucHVzaCgnbmFtZSBjYW4gbm8gbG9uZ2VyIGNvbnRhaW4gc3BlY2lhbCBjaGFyYWN0ZXJzIChcIn5cXCchKCkqXCIpJylcbiAgfVxuXG4gIGlmIChlbmNvZGVVUklDb21wb25lbnQobmFtZSkgIT09IG5hbWUpIHtcbiAgICAvLyBNYXliZSBpdCdzIGEgc2NvcGVkIHBhY2thZ2UgbmFtZSwgbGlrZSBAdXNlci9wYWNrYWdlXG4gICAgdmFyIG5hbWVNYXRjaCA9IG5hbWUubWF0Y2goc2NvcGVkUGFja2FnZVBhdHRlcm4pXG4gICAgaWYgKG5hbWVNYXRjaCkge1xuICAgICAgdmFyIHVzZXIgPSBuYW1lTWF0Y2hbMV1cbiAgICAgIHZhciBwa2cgPSBuYW1lTWF0Y2hbMl1cbiAgICAgIGlmIChlbmNvZGVVUklDb21wb25lbnQodXNlcikgPT09IHVzZXIgJiYgZW5jb2RlVVJJQ29tcG9uZW50KHBrZykgPT09IHBrZykge1xuICAgICAgICByZXR1cm4gZG9uZSh3YXJuaW5ncywgZXJyb3JzKVxuICAgICAgfVxuICAgIH1cblxuICAgIGVycm9ycy5wdXNoKCduYW1lIGNhbiBvbmx5IGNvbnRhaW4gVVJMLWZyaWVuZGx5IGNoYXJhY3RlcnMnKVxuICB9XG5cbiAgcmV0dXJuIGRvbmUod2FybmluZ3MsIGVycm9ycylcbn1cblxudmFsaWRhdGUuc2NvcGVkUGFja2FnZVBhdHRlcm4gPSBzY29wZWRQYWNrYWdlUGF0dGVyblxuXG52YXIgZG9uZSA9IGZ1bmN0aW9uICh3YXJuaW5ncywgZXJyb3JzKSB7XG4gIHZhciByZXN1bHQgPSB7XG4gICAgdmFsaWRGb3JOZXdQYWNrYWdlczogZXJyb3JzLmxlbmd0aCA9PT0gMCAmJiB3YXJuaW5ncy5sZW5ndGggPT09IDAsXG4gICAgdmFsaWRGb3JPbGRQYWNrYWdlczogZXJyb3JzLmxlbmd0aCA9PT0gMCxcbiAgICB3YXJuaW5nczogd2FybmluZ3MsXG4gICAgZXJyb3JzOiBlcnJvcnNcbiAgfVxuICBpZiAoIXJlc3VsdC53YXJuaW5ncy5sZW5ndGgpIGRlbGV0ZSByZXN1bHQud2FybmluZ3NcbiAgaWYgKCFyZXN1bHQuZXJyb3JzLmxlbmd0aCkgZGVsZXRlIHJlc3VsdC5lcnJvcnNcbiAgcmV0dXJuIHJlc3VsdFxufVxuIiwiaW1wb3J0IHsgSG90RmlsZSB9IGZyb20gXCIuL0hvdEZpbGVcIjtcbmltcG9ydCB7IEhvdFBhZ2UgfSBmcm9tIFwiLi9Ib3RQYWdlXCI7XG5pbXBvcnQgeyBIb3RTdGFxIH0gZnJvbSBcIi4vSG90U3RhcVwiO1xuaW1wb3J0IHsgSG90QVBJIH0gZnJvbSBcIi4vSG90QVBJXCI7XG5pbXBvcnQgeyBIb3RUZXN0RWxlbWVudCB9IGZyb20gXCIuL0hvdFRlc3RFbGVtZW50XCI7XG5cbmltcG9ydCBDb29raWVzIGZyb20gXCJqcy1jb29raWVcIjtcbmltcG9ydCBmZXRjaCBmcm9tIFwiY3Jvc3MtZmV0Y2hcIjtcblxuLyoqXG4gKiBUaGUgYXZhaWxhYmxlIGRldmVsb3BlciBtb2Rlcy5cbiAqL1xuZXhwb3J0IGVudW0gRGV2ZWxvcGVyTW9kZVxue1xuXHQvKipcblx0ICogVGhlIGRlZmF1bHQgZGV2ZWxvcGVyIG1vZGUuIE5vIHRlc3RzIHdpbGwgYmUgZXhlY3V0ZWQgYW5kIFxuXHQgKiBhbnkgdGVzdCByZWxhdGVkIGRhdGEgd2lsbCBiZSBpZ25vcmVkLlxuXHQgKi9cblx0UHJvZHVjdGlvbixcblx0LyoqXG5cdCAqIEZvciB1c2UgZHVyaW5nIGRldmVsb3BtZW50L2RlYnVnZ2luZy4gQWxsIHRlc3QgZGF0YSB3aWxsIFxuXHQgKiBiZSBjb2xsZWN0ZWQgYW5kIGV4ZWN1dGVkIGlmIG5lY2Vzc2FyeS5cblx0ICovXG5cdERldmVsb3BtZW50XG59XG5cbi8qKlxuICogQSBDU1Mgb2JqZWN0IHRvIGVtYmVkLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENTU09iamVjdFxue1xuXHQvKipcblx0ICogVGhlIHVybCB0byB0aGUgQ1NTIGZpbGUgdG8gZW1iZWQuXG5cdCAqL1xuXHR1cmw6IHN0cmluZztcblx0LyoqXG5cdCAqIFRoZSBpbnRlZ3JpdHkgaGFzaCB0byBnZW5lcmF0ZSBkdXJpbmcgaW5pdGlhbCBjb21waWxhdGlvbi5cblx0ICovXG5cdGludGVncml0eUhhc2g6IHN0cmluZztcbn1cblxuLyoqXG4gKiBUaGUgYXBpIHVzZWQgZHVyaW5nIHByb2Nlc3NpbmcuXG4gKi9cbmV4cG9ydCBjbGFzcyBIb3Rcbntcblx0LyoqXG5cdCAqIFRoZSBjdXJyZW50bHkgZ2VuZXJhdGVkIHBhZ2UgYmVpbmcgZGlzcGxheWVkLiBUaGlzIGlzIGNsZWFyZWQgYmV0d2VlbiBldmVyeSBmaWxlIHByb2Nlc3NlZC5cblx0ICovXG5cdHN0YXRpYyBDdXJyZW50UGFnZTogSG90UGFnZSA9IG51bGw7XG5cdC8qKlxuXHQgKiBUaGUgYXJndW1lbnRzIHBhc3NlZC5cblx0ICovXG5cdHN0YXRpYyBBcmd1bWVudHM6IGFueSA9IG51bGw7XG5cdC8qKlxuXHQgKiBUaGUgbW9kZSBpbiB3aGljaCB0aGlzIGFwcGxpY2F0aW9uIGlzIHJ1bm5pbmcuIElmIGl0J3Mgc2V0IHRvIGRldmVsb3BtZW50IG1vZGUsIGFsbCB0ZXN0aW5nXG5cdCAqIHJlbGF0ZWQgZGF0YSB3aWxsIGJlIGNvbGxlY3RlZCwgcGFyc2VkLCBhbmQgZXhlY3V0ZWQgaWYgbmVjZXNzYXJ5LlxuXHQgKi9cblx0c3RhdGljIERldmVsb3Blck1vZGUgPSBEZXZlbG9wZXJNb2RlO1xuXHQvKipcblx0ICogVGhlIG1vZGUgaW4gd2hpY2ggdGhpcyBhcHBsaWNhdGlvbiBpcyBydW5uaW5nLiBJZiBpdCdzIHNldCB0byBkZXZlbG9wbWVudCBtb2RlLCBhbGwgdGVzdGluZ1xuXHQgKiByZWxhdGVkIGRhdGEgd2lsbCBiZSBjb2xsZWN0ZWQsIHBhcnNlZCwgYW5kIGV4ZWN1dGVkIGlmIG5lY2Vzc2FyeS5cblx0ICovXG5cdHN0YXRpYyBIb3RUZXN0RWxlbWVudCA9IEhvdFRlc3RFbGVtZW50O1xuXHQvKipcblx0ICogVGhlIG1vZGUgaW4gd2hpY2ggdGhpcyBhcHBsaWNhdGlvbiBpcyBydW5uaW5nLiBJZiBpdCdzIHNldCB0byBkZXZlbG9wbWVudCBtb2RlLCBhbGwgdGVzdGluZ1xuXHQgKiByZWxhdGVkIGRhdGEgd2lsbCBiZSBjb2xsZWN0ZWQsIHBhcnNlZCwgYW5kIGV4ZWN1dGVkIGlmIG5lY2Vzc2FyeS5cblx0ICovXG5cdHN0YXRpYyBNb2RlOiBEZXZlbG9wZXJNb2RlID0gRGV2ZWxvcGVyTW9kZS5Qcm9kdWN0aW9uO1xuXHQvKipcblx0ICpUaGUgY3VycmVudCBBUEkgdXNlZCBvbiB0aGlzIHBhZ2UuIFRoaXMgaXMgY2xlYXJlZCBiZXR3ZWVuIGV2ZXJ5IGZpbGUgcHJvY2Vzc2VkLlxuXHQgKi9cblx0c3RhdGljIEFQSTogSG90QVBJID0gbnVsbDtcblx0LyoqXG5cdCAqIFRoZSBBUEkgYmVpbmcgdXNlZCBieSB0aGUgdGVzdGVyLlxuXHQgKi9cblx0c3RhdGljIFRlc3RlckFQSTogSG90QVBJID0gbnVsbDtcblx0LyoqXG5cdCAqIENvbnRhaW5zIHRoZSBidWZmZXIgdG8gb3V0cHV0LiBUaGlzIGlzIGNsZWFyZWQgYmV0d2VlbiBldmVyeSBmaWxlIHByb2Nlc3NlZC5cblx0ICovXG5cdHN0YXRpYyBPdXRwdXQ6IHN0cmluZyA9IFwiXCI7XG5cdC8qKlxuXHQgKiBUaGUgZGF0YSB0byBzaGFyZSBhY3Jvc3MgYWxsIHRoZSBkaWZmZXJlbnQgZmlsZXMgYW5kIHBhZ2VzLiBUaGlzIGRhdGEgd2lsbCBiZSBwdWJsaWMuXG5cdCAqL1xuXHRzdGF0aWMgRGF0YTogYW55ID0ge307XG5cdC8qKlxuXHQgKiBUaGUgY29va2llcyB0byB1c2UgYmV0d2VlbiBwYWdlcy5cblx0ICovXG5cdHN0YXRpYyBDb29raWVzOiBDb29raWVzLkNvb2tpZXNTdGF0aWMgPSBDb29raWVzO1xuXHQvKipcblx0ICogQW55IHNlY3JldHMgdGhhdCBjYW4gYmUgc2hvd24gcHVibGljbHkuIFRoZXNlIGNhbiBiZSBwYXNzZWQgZnJvbSBIb3RTaXRlLmpzb24uXG5cdCAqL1xuXHRzdGF0aWMgUHVibGljU2VjcmV0czogYW55ID0ge307XG5cdC8qKlxuXHQgKiBUaGUgQ1NTIHN0cmluZyB0byB1c2Ugd2hlbiBlY2hvaW5nIG91dCB0aGUgQ1NTIGZpbGVzLlxuXHQgKi9cblx0c3RhdGljIGNzc1N0cjogc3RyaW5nID0gYDxsaW5rIHJlbCA9IFwic3R5bGVzaGVldFwiIGhyZWYgPSBcIiVDU1NfRklMRSVcIiAvPmA7XG5cdC8qKlxuXHQgKiBUaGUgQ1NTIGZpbGVzIHRvIHVzZSBpbiB0aGUgY3VycmVudCBwYWdlIGJlaW5nIGdlbmVyYXRlZC5cblx0ICogXG5cdCAqIEB0b2RvIE1ha2UgdGhpcyBhIFwic3RyaW5nIHwgQ1NTT2JqZWN0XCIgZGF0YSB0eXBlIHNvIGl0IGNhbiBhbHNvIGluY2x1ZGUgXG5cdCAqIHRoZSBpbnRlZ3JpdHkgaGFzaGVzIGFzIHdlbGwuXG5cdCAqL1xuXHRzdGF0aWMgQ1NTOiBzdHJpbmdbXSA9IFtdO1xuXHQvKipcblx0ICogVGhlIEphdmFTY3JpcHQgZmlsZXMgdG8gdXNlIGluIHRoZSBjdXJyZW50IHBhZ2UgYmVpbmcgZ2VuZXJhdGVkLlxuXHQgKiBcblx0ICogQHRvZG8gTWFrZSB0aGlzIGEgXCJzdHJpbmcgfCBKU0ZpbGVPYmplY3RcIiBkYXRhIHR5cGUgc28gaXQgY2FuIGFsc28gaW5jbHVkZSBcblx0ICogdGhlIGludGVncml0eSBoYXNoZXMgYXMgd2VsbC5cblx0ICovXG5cdHN0YXRpYyBKU0ZpbGVzOiBhbnlbXSA9IFtdO1xuXHQvKipcblx0ICogVGhlIEphdmFTY3JpcHQgaW5saW5lIGNvZGUgdG8gdXNlIGluIHRoZSBjdXJyZW50IHBhZ2UgYmVpbmcgZ2VuZXJhdGVkLlxuXHQgKi9cblx0c3RhdGljIEpTU2NyaXB0czogYW55W10gPSBbXTtcblx0LyoqXG5cdCAqIFRoZSBKYXZhU2NyaXB0IHN0cmluZyB0byB1c2Ugd2hlbiBlY2hvaW5nIG91dCB0aGUgU2NyaXB0cyBmaWxlcy5cblx0ICovXG5cdHN0YXRpYyBqc0ZpbGVTdHI6IHN0cmluZyA9IGA8c2NyaXB0IHR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiIHNyYyA9IFwiJUpTX0ZJTEUlXCI+PC9zY3JpcHQ+YDtcblx0LyoqXG5cdCAqIFRoZSBKYXZhU2NyaXB0IHN0cmluZyB0byB1c2Ugd2hlbiBlY2hvaW5nIG91dCB0aGUgU2NyaXB0cyBmaWxlcy5cblx0ICovXG5cdHN0YXRpYyBqc1NjcmlwdHNTdHI6IHN0cmluZyA9IGA8c2NyaXB0IHR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiPiVKU19DT0RFJTwvc2NyaXB0PmA7XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlIGEgZmlsZSBhbmQgZWNobyBvdXQgaXQncyBjb250ZW50cy5cblx0ICovXG5cdHN0YXRpYyBhc3luYyBpbmNsdWRlIChmaWxlOiBIb3RGaWxlIHwgc3RyaW5nLCBhcmdzOiBhbnlbXSA9IG51bGwpOiBQcm9taXNlPHZvaWQ+XG5cdHtcblx0XHRpZiAoSG90U3RhcS5pc1dlYiA9PT0gdHJ1ZSlcblx0XHR7XG5cdFx0XHRpZiAodHlwZW9mIChmaWxlKSA9PT0gXCJzdHJpbmdcIilcblx0XHRcdHtcblx0XHRcdFx0Y29uc3QgbG93ZXJGaWxlOiBzdHJpbmcgPSBmaWxlLnRvTG93ZXJDYXNlICgpO1xuXG5cdFx0XHRcdC8vIElmIHRoZSBmaWxlIHRvIGJlIGluY2x1ZGVkIGRvZXMgbm90IGhhdmUgYSBuYWhmYW0sIGFkZCBpdC4gVGhpcyBcblx0XHRcdFx0Ly8gd2lsbCBlbnN1cmUgdGhlIHNlcnZlciBzZW5kcyBvbmx5IHRoZSBmaWxlIGNvbnRlbnQuXG5cdFx0XHRcdGlmIChsb3dlckZpbGUuaW5kZXhPZiAoXCIuaG90dFwiKSA+IC0xKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWYgKGxvd2VyRmlsZS5pbmRleE9mIChcIm5haGZhbVwiKSA8IDApXG5cdFx0XHRcdFx0XHRmaWxlICs9IFwiP2hwc2VydmU9bmFoZmFtXCI7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRIb3QuZWNobyAoYXdhaXQgSG90LmdldEZpbGUgKGZpbGUsIGFyZ3MpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSdW4gYW4gYWxyZWFkeSBsb2FkZWQgZmlsZSBhbmQgZWNobyBvdXQgaXQncyBjb250ZW50cy5cblx0ICovXG5cdHN0YXRpYyBhc3luYyBydW5GaWxlIChmaWxlTmFtZTogc3RyaW5nLCBhcmdzOiBhbnlbXSA9IG51bGwpOiBQcm9taXNlPHZvaWQ+XG5cdHtcblx0XHRsZXQgZmlsZTogSG90RmlsZSA9IEhvdC5DdXJyZW50UGFnZS5wcm9jZXNzb3IuZ2V0RmlsZSAoZmlsZU5hbWUpO1xuXHRcdC8vLyBAZml4bWUgRG9lcyB0aGUgZmlsZSBuZWVkIHRvIGJlIGRlZXAgY2xvbmVkIGZpcnN0P1xuXHRcdC8vbGV0IGNsb25lZEZpbGU6IEhvdEZpbGUgPSBuZXcgSG90RmlsZSAoT2JqZWN0LmFzc2lnbiAoe30sIGZpbGUpKTtcblx0XHRsZXQgdGVtcEZpbGU6IEhvdEZpbGUgPSBmaWxlO1xuXG5cdFx0dGVtcEZpbGUucGFnZSA9IHRoaXMuQ3VycmVudFBhZ2U7XG5cdFx0bGV0IGNvbnRlbnQ6IHN0cmluZyA9IGF3YWl0IHRlbXBGaWxlLnByb2Nlc3MgKGFyZ3MpO1xuXG5cdFx0SG90LmVjaG8gKGNvbnRlbnQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCB0aGUgY29udGVudCBvZiBhIGZpbGUuXG5cdCAqL1xuXHRzdGF0aWMgYXN5bmMgZ2V0RmlsZSAocGF0aDogSG90RmlsZSB8IHN0cmluZywgYXJnczogYW55W10gPSBudWxsKTogUHJvbWlzZTxzdHJpbmc+XG5cdHtcblx0XHRsZXQgdGVtcEZpbGU6IEhvdEZpbGUgPSBudWxsO1xuXG5cdFx0aWYgKHR5cGVvZiAocGF0aCkgPT09IFwic3RyaW5nXCIpXG5cdFx0e1xuXHRcdFx0dGVtcEZpbGUgPSBuZXcgSG90RmlsZSAoKTtcblxuXHRcdFx0aWYgKEhvdFN0YXEuaXNXZWIgPT09IHRydWUpXG5cdFx0XHRcdHRlbXBGaWxlLnVybCA9IHBhdGg7XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHRlbXBGaWxlLmxvY2FsRmlsZSA9IHBhdGg7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHRcdHRlbXBGaWxlID0gcGF0aDtcblxuXHRcdGF3YWl0IHRlbXBGaWxlLmxvYWQgKCk7XG5cblx0XHR0ZW1wRmlsZS5wYWdlID0gdGhpcy5DdXJyZW50UGFnZTtcblx0XHRsZXQgY29udGVudDogc3RyaW5nID0gYXdhaXQgdGVtcEZpbGUucHJvY2VzcyAoYXJncyk7XG5cblx0XHRyZXR1cm4gKGNvbnRlbnQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1ha2UgYW4gYXBpIGNhbGwuXG5cdCAqL1xuXHRzdGF0aWMgYXN5bmMgYXBpQ2FsbCAocm91dGU6IHN0cmluZywgZGF0YTogYW55ID0gbnVsbCwgaHR0cE1ldGhvZDogc3RyaW5nID0gXCJQT1NUXCIpOiBQcm9taXNlPGFueT5cblx0e1xuXHRcdGxldCByZXN1bHQ6IGFueSA9IG51bGw7XG5cblx0XHRpZiAoSG90LkN1cnJlbnRQYWdlID09IG51bGwpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IgKFwiQ3VycmVudCBwYWdlIGlzIG51bGwhXCIpO1xuXG5cdFx0aWYgKEhvdC5DdXJyZW50UGFnZS5wcm9jZXNzb3IgPT0gbnVsbClcblx0XHRcdHRocm93IG5ldyBFcnJvciAoXCJDdXJyZW50IHBhZ2UncyBwcm9jZXNzb3IgaXMgbnVsbCFcIik7XG5cblx0XHRpZiAoSG90LkN1cnJlbnRQYWdlLnByb2Nlc3Nvci5hcGkgPT0gbnVsbClcblx0XHRcdHRocm93IG5ldyBFcnJvciAoXCJDdXJyZW50IHBhZ2UncyBwcm9jZXNzb3IgYXBpIGlzIG51bGwhXCIpO1xuXG5cdFx0aWYgKEhvdC5DdXJyZW50UGFnZS5wcm9jZXNzb3IuYXBpICE9IG51bGwpXG5cdFx0XHRyZXN1bHQgPSBhd2FpdCBIb3QuQ3VycmVudFBhZ2UucHJvY2Vzc29yLmFwaS5tYWtlQ2FsbCAocm91dGUsIGRhdGEsIGh0dHBNZXRob2QpO1xuXG5cdFx0cmV0dXJuIChyZXN1bHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1ha2UgYSBIVFRQIEpTT04gcmVxdWVzdC5cblx0ICogXG5cdCAqIEBwYXJhbSB1cmwgVGhlIGZ1bGwgdXJsIHRvIG1ha2UgdGhlIEhUVFAgY2FsbC5cblx0ICogQHBhcmFtIGRhdGEgVGhlIGRhdGEgdG8gSlNPTi5zdHJpbmdpZnkgYW5kIHNlbmQuXG5cdCAqIEBwYXJhbSBodHRwTWV0aG9kIFRoZSBIVFRQIG1ldGhvZCB0byB1c2UgdG8gc2VuZCB0aGUgZGF0YS5cblx0ICogXG5cdCAqIEByZXR1cm5zIFRoZSBwYXJzZWQgSlNPTiBvYmplY3QuXG5cdCAqL1xuXHRzdGF0aWMgYXN5bmMganNvblJlcXVlc3QgKHVybDogc3RyaW5nLCBkYXRhOiBhbnkgPSBudWxsLCBodHRwTWV0aG9kOiBzdHJpbmcgPSBcIlBPU1RcIik6IFByb21pc2U8YW55PlxuXHR7XG5cdFx0dHJ5XG5cdFx0e1xuXHRcdFx0bGV0IHJlczogUmVzcG9uc2UgPSBhd2FpdCBmZXRjaCAodXJsLCB7XG5cdFx0XHRcdFx0XCJtZXRob2RcIjogaHR0cE1ldGhvZCxcblx0XHRcdFx0XHRcImhlYWRlcnNcIjoge1xuXHRcdFx0XHRcdFx0XHRcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcblx0XHRcdFx0XHRcdFx0XCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XCJib2R5XCI6IEpTT04uc3RyaW5naWZ5IChkYXRhKVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0aWYgKHJlcy5vayA9PT0gZmFsc2UpXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvciAoYCR7cmVzLnN0YXR1c306ICR7cmVzLnN0YXR1c1RleHR9YCk7XG5cblx0XHRcdGxldCByZXN1bHQ6IGFueSA9IGF3YWl0IHJlcy5qc29uICgpO1xuXG5cdFx0XHRyZXR1cm4gKHJlc3VsdCk7XG5cdFx0fVxuXHRcdGNhdGNoIChleClcblx0XHR7XG5cdFx0XHRyZXR1cm4gKEpTT04uc3RyaW5naWZ5ICh7IFwiZXJyb3JcIjogYCR7ZXgubWVzc2FnZX0gLSBDb3VsZCBub3QgZmV0Y2ggJHt1cmx9YCB9KSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIE1ha2UgYSBIVFRQIHJlcXVlc3QuIFRoaXMgaXMgYmFzaWNhbGx5IGp1c3QgYSB3cmFwcGVyIGZvciBmZXRjaC5cblx0ICogXG5cdCAqIEBwYXJhbSB1cmwgVGhlIGZ1bGwgdXJsIHRvIG1ha2UgdGhlIEhUVFAgY2FsbC5cblx0ICogQHBhcmFtIHJlcXVlc3RJbml0IFRoZSByZXF1ZXN0IHBhcmFtZXRlcnMgdG8gc2VuZC5cblx0ICogXG5cdCAqIEByZXR1cm5zIFRoZSBIVFRQIHJlc3BvbnNlLlxuXHQgKi9cblx0c3RhdGljIGFzeW5jIGh0dHBSZXF1ZXN0ICh1cmw6IHN0cmluZywgcmVxdWVzdEluaXQ6IFJlcXVlc3RJbml0ID0gdW5kZWZpbmVkKTogUHJvbWlzZTxSZXNwb25zZT5cblx0e1xuXHRcdGxldCByZXM6IFJlc3BvbnNlID0gYXdhaXQgZmV0Y2ggKHVybCwgcmVxdWVzdEluaXQpO1xuXG5cdFx0cmV0dXJuIChyZXMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEVjaG8gb3V0IHNvbWUgb3V0cHV0LlxuXHQgKi9cblx0c3RhdGljIGVjaG8gKG1lc3NhZ2U6IHN0cmluZyk6IHZvaWRcblx0e1xuXHRcdEhvdC5PdXRwdXQgKz0gbWVzc2FnZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBFY2hvIG91dCB0aGUgQ1NTIGZvciB0aGUgY3VycmVudCBwYWdlIGJlaW5nIGdlbmVyYXRlZC5cblx0ICovXG5cdHN0YXRpYyBkaXNwbGF5Q1NTICgpOiB2b2lkXG5cdHtcblx0XHRmb3IgKGxldCBpSWR4ID0gMDsgaUlkeCA8IEhvdC5DU1MubGVuZ3RoOyBpSWR4KyspXG5cdFx0e1xuXHRcdFx0bGV0IGNzc0ZpbGU6IHN0cmluZyA9IEhvdC5DU1NbaUlkeF07XG5cdFx0XHRsZXQgY3NzT3V0OiBzdHJpbmcgPSBIb3QuY3NzU3RyO1xuXG5cdFx0XHRjc3NPdXQgPSBjc3NPdXQucmVwbGFjZSAoL1xcJUNTU19GSUxFXFwlL2csIGNzc0ZpbGUpO1xuXG5cdFx0XHRIb3QuZWNobyAoY3NzT3V0KTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogRWNobyBvdXQgdGhlIEpTIGZpbGVzIGZvciB0aGUgY3VycmVudCBwYWdlIGJlaW5nIGdlbmVyYXRlZC5cblx0ICovXG5cdHN0YXRpYyBkaXNwbGF5SlNGaWxlcyAoKTogdm9pZFxuXHR7XG5cdFx0Zm9yIChsZXQgaUlkeCA9IDA7IGlJZHggPCBIb3QuSlNGaWxlcy5sZW5ndGg7IGlJZHgrKylcblx0XHR7XG5cdFx0XHRsZXQganNGaWxlOiBzdHJpbmcgPSBIb3QuSlNGaWxlc1tpSWR4XTtcblx0XHRcdGxldCBqc0ZpbGVPdXQ6IHN0cmluZyA9IEhvdC5qc0ZpbGVTdHI7XG5cblx0XHRcdGpzRmlsZU91dCA9IGpzRmlsZU91dC5yZXBsYWNlICgvXFwlSlNfRklMRVxcJS9nLCBqc0ZpbGUpO1xuXG5cdFx0XHRIb3QuZWNobyAoanNGaWxlT3V0KTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogRWNobyBvdXQgdGhlIEpTIHNjcmlwdHMgZm9yIHRoZSBjdXJyZW50IHBhZ2UgYmVpbmcgZ2VuZXJhdGVkLlxuXHQgKi9cblx0c3RhdGljIGRpc3BsYXlKU1NjcmlwdHMgKCk6IHZvaWRcblx0e1xuXHRcdGZvciAobGV0IGlJZHggPSAwOyBpSWR4IDwgSG90LkpTU2NyaXB0cy5sZW5ndGg7IGlJZHgrKylcblx0XHR7XG5cdFx0XHRsZXQganNTY3JpcHQ6IHN0cmluZyA9IEhvdC5KU1NjcmlwdHNbaUlkeF07XG5cdFx0XHRsZXQganNTY3JpcHRPdXQ6IHN0cmluZyA9IEhvdC5qc1NjcmlwdHNTdHI7XG5cblx0XHRcdGpzU2NyaXB0T3V0ID0ganNTY3JpcHRPdXQucmVwbGFjZSAoL1xcJUpTX0NPREVcXCUvZywganNTY3JpcHQpO1xuXG5cdFx0XHRIb3QuZWNobyAoanNTY3JpcHRPdXQpO1xuXHRcdH1cblx0fVxufSIsImltcG9ydCBmZXRjaCBmcm9tIFwiY3Jvc3MtZmV0Y2hcIjtcblxuaW1wb3J0IHsgSG90U2VydmVyIH0gZnJvbSBcIi4vSG90U2VydmVyXCI7XG5pbXBvcnQgeyBIb3RSb3V0ZSB9IGZyb20gXCIuL0hvdFJvdXRlXCI7XG5pbXBvcnQgeyBIb3RDbGllbnQgfSBmcm9tIFwiLi9Ib3RDbGllbnRcIjtcbmltcG9ydCB7IEhvdFJvdXRlTWV0aG9kLCBTZXJ2ZXJBdXRob3JpemF0aW9uRnVuY3Rpb24gfSBmcm9tIFwiLi9Ib3RSb3V0ZU1ldGhvZFwiO1xuaW1wb3J0IHsgSG90REIgfSBmcm9tIFwiLi9Ib3REQlwiO1xuXG5pbXBvcnQgeyBIb3REQlNjaGVtYSB9IGZyb20gXCIuL3NjaGVtYXMvSG90REJTY2hlbWFcIjtcblxuLyoqXG4gKiBUaGUgQVBJIHRvIGxvYWQuXG4gKi9cbmV4cG9ydCB0eXBlIEFQSXRvTG9hZCA9IHtcblx0ZXhwb3J0ZWRDbGFzc05hbWU6IHN0cmluZztcblx0cGF0aDogc3RyaW5nO1xuIH07XG5cbi8qKlxuICogVGhlIHR5cGUgb2Ygb2JqZWN0IHRvIHVzZSBkdXJpbmcgZXZlbnQgZXhlY3V0aW9ucy5cbiAqL1xuZXhwb3J0IGVudW0gRXZlbnRFeGVjdXRpb25UeXBlXG57XG5cdEhvdFJvdXRlLFxuXHRIb3RNZXRob2QsXG5cdEhvdEFQSVxufVxuXG4vKipcbiAqIFRoZSBBUEkgdG8gdXNlLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSG90QVBJXG57XG5cdC8qKlxuXHQgKiBUaGUgc2VydmVyIGNvbm5lY3Rpb24uXG5cdCAqL1xuXHRjb25uZWN0aW9uOiBIb3RTZXJ2ZXIgfCBIb3RDbGllbnQ7XG5cdC8qKlxuXHQgKiBUaGUgYmFzZSB1cmwgZm9yIHRoZSBzZXJ2ZXIuXG5cdCAqL1xuXHRiYXNlVXJsOiBzdHJpbmc7XG5cdC8qKlxuXHQgKiBJZiBzZXQsIHRoaXMgd2lsbCBjcmVhdGUgdGhlIHJvdXRlIHZhcmlhYmxlcyBhbmQgZnVuY3Rpb25zIGZvciBcblx0ICogZWFzeSBjbGllbnQvc2VydmVyIGNhbGxpbmcuXG5cdCAqL1xuXHRjcmVhdGVGdW5jdGlvbnM6IGJvb2xlYW47XG5cdC8qKlxuXHQgKiBUaGUgZGF0YWJhc2UgY29ubmVjdGlvbi5cblx0ICovXG5cdGV4ZWN1dGVFdmVudHNVc2luZzogRXZlbnRFeGVjdXRpb25UeXBlO1xuXHQvKipcblx0ICogVGhlIGRhdGFiYXNlIGNvbm5lY3Rpb24uXG5cdCAqL1xuXHRkYjogSG90REI7XG5cdC8qKlxuXHQgKiBUaGUgYXV0aG9yaXphdGlvbiBjcmVkZW50aWFscyB0byB1c2UgdGhyb3VnaG91dCB0aGUgYXBwbGljYXRpb24uXG5cdCAqL1xuXHRhdXRoQ3JlZGVudGlhbHM6IGFueTtcblx0LyoqXG5cdCAqIFRoZSBmdW5jdGlvbiB1c2VkIGZvciB1c2VyIGF1dGhlbnRpY2F0aW9uLlxuXHQgKi9cblx0dXNlckF1dGg6IFNlcnZlckF1dGhvcml6YXRpb25GdW5jdGlvbjtcblx0LyoqXG5cdCAqIFRoZSBkYXRhYmFzZSBjb25uZWN0aW9uLlxuXHQgKi9cblx0cm91dGVzOiB7IFtuYW1lOiBzdHJpbmddOiBIb3RSb3V0ZSB9O1xuXHQvKipcblx0ICogRXhlY3V0ZWQgd2hlbiB0aGUgQVBJIGlzIGFib3V0IHRvIHN0YXJ0IHJlZ2lzdGVyaW5nIHJvdXRlcy4gSWYgXG5cdCAqIHRoaXMgZnVuY3Rpb24gcmV0dXJucyBmYWxzZSwgdGhlIHNlcnZlciB3aWxsIG5vdCBzdGFydC5cblx0ICovXG5cdG9uUHJlUmVnaXN0ZXI6ICgpID0+IFByb21pc2U8Ym9vbGVhbj47XG5cdC8qKlxuXHQgKiBFeGVjdXRlZCB3aGVuIHRoZSBBUEkgaGFzIGZpbmlzaGVkIHJlZ2lzdGVyaW5nIHJvdXRlcy4gSWYgXG5cdCAqIHRoaXMgZnVuY3Rpb24gcmV0dXJucyBmYWxzZSwgdGhlIHNlcnZlciB3aWxsIG5vdCBzdGFydC5cblx0ICovXG5cdG9uUG9zdFJlZ2lzdGVyOiAoKSA9PiBQcm9taXNlPGJvb2xlYW4+O1xuXG5cdGNvbnN0cnVjdG9yIChiYXNlVXJsOiBzdHJpbmcsIGNvbm5lY3Rpb246IEhvdFNlcnZlciB8IEhvdENsaWVudCA9IG51bGwsIGRiOiBIb3REQiA9IG51bGwpXG5cdHtcblx0XHR0aGlzLmNvbm5lY3Rpb24gPSBjb25uZWN0aW9uO1xuXHRcdHRoaXMuYmFzZVVybCA9IGJhc2VVcmw7XG5cdFx0dGhpcy5jcmVhdGVGdW5jdGlvbnMgPSB0cnVlO1xuXHRcdHRoaXMuZXhlY3V0ZUV2ZW50c1VzaW5nID0gRXZlbnRFeGVjdXRpb25UeXBlLkhvdFJvdXRlO1xuXHRcdHRoaXMuZGIgPSBkYjtcblx0XHR0aGlzLmF1dGhDcmVkZW50aWFscyA9IG51bGw7XG5cdFx0dGhpcy51c2VyQXV0aCA9IG51bGw7XG5cdFx0dGhpcy5yb3V0ZXMgPSB7fTtcblx0XHR0aGlzLm9uUHJlUmVnaXN0ZXIgPSBudWxsO1xuXHRcdHRoaXMub25Qb3N0UmVnaXN0ZXIgPSBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldCB0aGUgZGF0YWJhc2Ugc2NoZW1hIGZvciB1c2UuXG5cdCAqL1xuXHRzZXREQlNjaGVtYSAoc2NoZW1hOiBIb3REQlNjaGVtYSk6IHZvaWRcblx0e1xuXHRcdGlmICh0aGlzLmNvbm5lY3Rpb24uYXBpID09IG51bGwpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IgKGBObyBBUEkgaGFzIGJlZW4gc2V0IWApO1xuXG5cdFx0aWYgKHRoaXMuY29ubmVjdGlvbi5hcGkuZGIgPT0gbnVsbClcblx0XHRcdHRocm93IG5ldyBFcnJvciAoYE5vIGRhdGFiYXNlIGhhcyBiZWVuIHNldCBmb3IgQVBJIGJhc2UgdXJsICR7dGhpcy5jb25uZWN0aW9uLmFwaS5iYXNlVXJsfWApO1xuXG5cdFx0dGhpcy5jb25uZWN0aW9uLmFwaS5kYi5zY2hlbWEgPSBzY2hlbWE7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IHRoZSBkYXRhYmFzZSBiZWluZyB1c2VkLlxuXHQgKi9cblx0Z2V0REIgKCk6IEhvdERCXG5cdHtcblx0XHRpZiAodGhpcy5jb25uZWN0aW9uLmFwaS5kYiA9PSBudWxsKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yIChgTm8gZGF0YWJhc2UgaGFzIGJlZW4gc2V0IGZvciBBUEkgYmFzZSB1cmwgJHt0aGlzLmNvbm5lY3Rpb24uYXBpLmJhc2VVcmx9YCk7XG5cblx0XHRyZXR1cm4gKHRoaXMuY29ubmVjdGlvbi5hcGkuZGIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCB0aGUgZGF0YWJhc2Ugc2NoZW1hIGJlaW5nIHVzZWQuXG5cdCAqL1xuXHRnZXREQlNjaGVtYSAoKTogSG90REJTY2hlbWFcblx0e1xuXHRcdGlmICh0aGlzLmNvbm5lY3Rpb24uYXBpLmRiID09IG51bGwpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IgKGBObyBkYXRhYmFzZSBoYXMgYmVlbiBzZXQgZm9yIEFQSSBiYXNlIHVybCAke3RoaXMuY29ubmVjdGlvbi5hcGkuYmFzZVVybH1gKTtcblxuXHRcdHJldHVybiAodGhpcy5jb25uZWN0aW9uLmFwaS5kYi5zY2hlbWEpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZCBhIHJvdXRlLiBJZiB0aGlzLmNyZWF0ZUZ1bmN0aW9ucyBpcyBzZXQgdG8gdHJ1ZSwgdGhpcyB3aWxsIHRha2UgdGhlIGluY29taW5nIFxuXHQgKiByb3V0ZSBhbmQgY3JlYXRlIGFuIG9iamVjdCBpbiB0aGlzIEhvdEFQSSBvYmplY3QgdXNpbmcgdGhlIG5hbWUgb2YgdGhlIHJvdXRlLiBJZiB0aGVyZSdzIFxuXHQgKiBhbnkgSG90Um91dGVNZXRob2RzIGluc2lkZSBvZiB0aGUgaW5jb21pbmcgSG90Um91dGUsIGl0IHdpbGwgY3JlYXRlIHRoZSBtZXRob2RzIFxuXHQgKiBhbmQgYXR0YWNoIHRoZW0gdG8gdGhlIG5ld2x5IGNyZWF0ZWQgSG90Um91dGUgb2JqZWN0LlxuXHQgKiBcblx0ICogRXhhbXBsZTpcblx0ICogYGBgXG5cdCAqIGV4cG9ydCBjbGFzcyBVc2VycyBleHRlbmRzIEhvdFJvdXRlXG5cdCAqIHtcblx0ICogXHRcdGNvbnN0cnVjdG9yIChhcGk6IEZyZWVMaWdodEFQSSlcblx0ICogXHRcdHtcblx0ICogXHRcdFx0c3VwZXIgKGFwaS5jb25uZWN0aW9uLCBcInVzZXJcIik7XG5cdCAqIFxuXHQgKiBcdFx0XHR0aGlzLmFkZE1ldGhvZCAoXCJjcmVhdGVcIiwgdGhpcy5fY3JlYXRlLCBIVFRQTWV0aG9kLlBPU1QpO1xuXHQgKiBcdFx0fVxuXHQgKiBcblx0ICogXHRcdHByb3RlY3RlZCBhc3luYyBfY3JlYXRlIChyZXE6IGFueSwgcmVzOiBhbnksIGF1dGhvcml6ZWRWYWx1ZTogYW55LCBqc29uT2JqOiBhbnksIHF1ZXJ5T2JqOiBhbnkpOiBQcm9taXNlPGFueT5cblx0ICogXHRcdHtcblx0ICogXHRcdFx0cmV0dXJuICh0cnVlKTtcblx0ICogXHRcdH1cblx0ICogfVxuXHQgKiBgYGBcblx0ICogXG5cdCAqIFRoaXMgaW4gdHVybiBjb3VsZCBiZSB1c2VkIGxpa2Ugc286XG5cdCAqIGBgYFxuXHQgKiBIb3QuQVBJLnVzZXIuY3JlYXRlICh7fSk7XG5cdCAqIGBgYFxuXHQgKiBcblx0ICogQWRkaXRpb25hbGx5IGl0IHdvdWxkIGNyZWF0ZSB0aGUgZW5kcG9pbnQ6IGBgYGh0dHA6Ly8xMjcuMC4wLjE6ODA4MC92MS91c2VyL2NyZWF0ZWBgYFxuXHQgKiBcblx0ICogQHBhcmFtIHJvdXRlIFRoZSByb3V0ZSB0byBhZGQuIENhbiBiZSBlaXRoZXIgYSBmdWxsIEhvdFJvdXRlIG9iamVjdCwgb3IganVzdCBcblx0ICogdGhlIHJvdXRlJ3MgbmFtZS4gSWYgYSBIb3RSb3V0ZSBvYmplY3QgaXMgc3VwcGxpZWQsIHRoZSByZXN0IG9mIHRoZSBwYXJhbWV0ZXJzIFxuXHQgKiB3aWxsIGJlIGlnbm9yZWQuXG5cdCAqIEBwYXJhbSByb3V0ZU1ldGhvZCBUaGUgcm91dGUncyBtZXRob2QgdG8gYWRkLiBJZiB0aGUgcm91dGUgcGFyYW1ldGVyIGlzIGEgc3RyaW5nLCBcblx0ICogaXQgd2lsbCBiZSBpbnRlcnByZXRlZCBhcyB0aGUgcm91dGUncyBuYW1lLCBhbmQgdGhpcyB3aWxsIGJlIHRoZSBtZXRob2QgYWRkZWQgdG8gXG5cdCAqIHRoZSBuZXcgcm91dGUuXG5cdCAqIEBwYXJhbSBleGVjdXRlRnVuY3Rpb24gVGhlIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiByb3V0ZU1ldGhvZCBpcyBjYWxsZWQgYnkgdGhlIEFQSS5cblx0ICovXG5cdGFkZFJvdXRlIChcblx0XHRyb3V0ZTogSG90Um91dGUgfCBzdHJpbmcsXG5cdFx0cm91dGVNZXRob2Q6IEhvdFJvdXRlTWV0aG9kIHwgc3RyaW5nID0gbnVsbCxcblx0XHRleGVjdXRlRnVuY3Rpb246IChyZXE6IGFueSwgcmVzOiBhbnksIGF1dGhvcml6ZWRWYWx1ZTogYW55LCBqc29uT2JqOiBhbnksIHF1ZXJ5T2JqOiBhbnkpID0+IFByb21pc2U8YW55PiA9IG51bGxcblx0XHQpOiB2b2lkXG5cdHtcblx0XHRsZXQgcm91dGVOYW1lOiBzdHJpbmcgPSBcIlwiO1xuXG5cdFx0aWYgKHJvdXRlIGluc3RhbmNlb2YgSG90Um91dGUpXG5cdFx0e1xuXHRcdFx0cm91dGVOYW1lID0gcm91dGUucm91dGU7XG5cdFx0XHR0aGlzLnJvdXRlc1tyb3V0ZS5yb3V0ZV0gPSByb3V0ZTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHJvdXRlTmFtZSA9IHJvdXRlO1xuXG5cdFx0XHRpZiAodGhpcy5yb3V0ZXNbcm91dGVOYW1lXSA9PSBudWxsKVxuXHRcdFx0XHR0aGlzLnJvdXRlc1tyb3V0ZU5hbWVdID0gbmV3IEhvdFJvdXRlICh0aGlzLmNvbm5lY3Rpb24sIHJvdXRlTmFtZSk7XG5cblx0XHRcdGlmIChyb3V0ZU1ldGhvZCBpbnN0YW5jZW9mIEhvdFJvdXRlTWV0aG9kKVxuXHRcdFx0XHR0aGlzLnJvdXRlc1tyb3V0ZU5hbWVdLmFkZE1ldGhvZCAocm91dGVNZXRob2QpO1xuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHR0aGlzLnJvdXRlc1tyb3V0ZU5hbWVdLmFkZE1ldGhvZCAobmV3IEhvdFJvdXRlTWV0aG9kIChcblx0XHRcdFx0XHR0aGlzLnJvdXRlc1tyb3V0ZU5hbWVdLCByb3V0ZU1ldGhvZCwgZXhlY3V0ZUZ1bmN0aW9uKSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5yb3V0ZXNbcm91dGVOYW1lXS5jb25uZWN0aW9uID0gdGhpcy5jb25uZWN0aW9uO1xuXG5cdFx0Ly8gQ3JlYXRlIHRoZSByb3V0ZSBmdW5jdGlvbnMgZm9yIHRoZSBzZXJ2ZXIvY2xpZW50LlxuXHRcdGlmICh0aGlzLmNyZWF0ZUZ1bmN0aW9ucyA9PT0gdHJ1ZSlcblx0XHR7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRsZXQgbmV3Um91dGU6IHsgW25hbWU6IHN0cmluZ106IEZ1bmN0aW9uIH0gPSB0aGlzW3JvdXRlTmFtZV07XG5cblx0XHRcdGlmIChuZXdSb3V0ZSA9PSBudWxsKVxuXHRcdFx0XHRuZXdSb3V0ZSA9IHt9O1xuXG5cdFx0XHRmb3IgKGxldCBpSWR4ID0gMDsgaUlkeCA8IHRoaXMucm91dGVzW3JvdXRlTmFtZV0ubWV0aG9kcy5sZW5ndGg7IGlJZHgrKylcblx0XHRcdHtcblx0XHRcdFx0bGV0IGN1cnJlbnRSb3V0ZTogSG90Um91dGUgPSB0aGlzLnJvdXRlc1tyb3V0ZU5hbWVdO1xuXHRcdFx0XHRsZXQgbmV3Um91dGVNZXRob2Q6IEhvdFJvdXRlTWV0aG9kID0gdGhpcy5yb3V0ZXNbcm91dGVOYW1lXS5tZXRob2RzW2lJZHhdO1xuXG5cdFx0XHRcdC8qXG5cdFx0XHRcdC8vLyBAZml4bWUgSXMgdGhpcyByZWFsbHkgbmVjZXNzYXJ5PyBBIEhUVFAgY2FsbCBpcyBtdWNoIG1vcmUgcHJlZmVyYWJsZSwgXG5cdFx0XHRcdC8vLyBlc3BlY2lhbGx5IGZvciBhY2NydWF0ZSB0ZXN0aW5nLlxuXHRcdFx0XHRpZiAodGhpcy5jb25uZWN0aW9uIGluc3RhbmNlb2YgSG90U2VydmVyKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWYgKG5ld1JvdXRlTWV0aG9kLm9uU2VydmVyRXhlY3V0ZSAhPSBudWxsKVxuXHRcdFx0XHRcdFx0bmV3Um91dGVbbmV3Um91dGVNZXRob2QubmFtZV0gPSBuZXdSb3V0ZU1ldGhvZC5vblNlcnZlckV4ZWN1dGU7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSovXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQvKlxuXHRcdFx0XHRcdC8vLyBAZml4bWUgSXMgb25DbGllbnRFeGVjdXRlIG5lY2Vzc2FyeT8gSSdtIHRoaW5raW5nIHRoZSBkZXYgY2FuIGp1c3Qgc2ltcGx5IGNyZWF0ZSBcblx0XHRcdFx0XHQvLy8gdGhlaXIgb3duIGZ1bmN0aW9uIHRvIGNhbGwuXG5cdFx0XHRcdFx0aWYgKG5ld1JvdXRlTWV0aG9kLm9uQ2xpZW50RXhlY3V0ZSAhPSBudWxsKVxuXHRcdFx0XHRcdFx0bmV3Um91dGVbbmV3Um91dGVNZXRob2QubmFtZV0gPSBuZXdSb3V0ZU1ldGhvZC5vbkNsaWVudEV4ZWN1dGU7XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHsqL1xuXHRcdFx0XHRcdFx0bmV3Um91dGVbbmV3Um91dGVNZXRob2QubmFtZV0gPSAoZGF0YTogYW55KTogYW55ID0+XG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRsZXQgaHR0cE1ldGhvZDogc3RyaW5nID0gbmV3Um91dGVNZXRob2QudHlwZTtcblx0XHRcdFx0XHRcdFx0XHQvLyBDb25zdHJ1Y3QgdGhlIHVybCBoZXJlLiBCYXNlICsgcm91dGUgKyByb3V0ZSBtZXRob2Rcblx0XHRcdFx0XHRcdFx0XHRsZXQgcm91dGVTdHI6IHN0cmluZyA9IFwiXCI7XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAoY3VycmVudFJvdXRlLnZlcnNpb24gIT09IFwiXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHRyb3V0ZVN0ciArPSBgLyR7Y3VycmVudFJvdXRlLnZlcnNpb259YDtcblxuXHRcdFx0XHRcdFx0XHRcdGlmIChjdXJyZW50Um91dGUucm91dGUgIT09IFwiXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHRyb3V0ZVN0ciArPSBgLyR7Y3VycmVudFJvdXRlLnJvdXRlfWA7XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAobmV3Um91dGVNZXRob2QubmFtZSAhPT0gXCJcIilcblx0XHRcdFx0XHRcdFx0XHRcdHJvdXRlU3RyICs9IGAvJHtuZXdSb3V0ZU1ldGhvZC5uYW1lfWA7XG5cblx0XHRcdFx0XHRcdFx0XHRsZXQgYXV0aENyZWRlbnRpYWxzOiBhbnkgPSBudWxsO1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gR2V0dGluZyB0aGUgYXV0aG9yaXphdGlvbiBjcmVkZW50aWFscyBmcm9tIHRoZSBBUEkgaXMgdGhlIGxvd2VzdCBcblx0XHRcdFx0XHRcdFx0XHQvLyBwcmlvcml0eSBmb3IgZ2V0dGluZyBjcmVkZW50aWFscy4gVGhlIHByaW9yaXRpZXMgYXJlIGluIHRoaXMgb3JkZXI6IFxuXHRcdFx0XHRcdFx0XHRcdC8vIDEuIEhvdFJvdXRlTWV0aG9kXG5cdFx0XHRcdFx0XHRcdFx0Ly8gMi4gSG90Um91dGVcblx0XHRcdFx0XHRcdFx0XHQvLyAzLiBIb3RBUElcblx0XHRcdFx0XHRcdFx0XHRpZiAodGhpcy5hdXRoQ3JlZGVudGlhbHMgIT0gbnVsbClcblx0XHRcdFx0XHRcdFx0XHRcdGF1dGhDcmVkZW50aWFscyA9IHRoaXMuYXV0aENyZWRlbnRpYWxzO1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gRmluZCB0aGUgYXV0aG9yaXphdGlvbiBjcmVkZW50aWFscy4gUHJpb3JpdGl6ZSB0aGVtIHdoZW4gdGhleSdyZSBcblx0XHRcdFx0XHRcdFx0XHQvLyBpbiB0aGUgbWV0aG9kLiBPbmx5IGFkZCB0aGUgb25lcyBmcm9tIHRoZSByb3V0ZSBpZiB0aGUgb25lcyBmcm9tIFxuXHRcdFx0XHRcdFx0XHRcdC8vIHRoZSBtZXRob2QgYXJlIG1pc3NpbmcuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKG5ld1JvdXRlTWV0aG9kLmF1dGhDcmVkZW50aWFscyAhPSBudWxsKVxuXHRcdFx0XHRcdFx0XHRcdFx0YXV0aENyZWRlbnRpYWxzID0gbmV3Um91dGVNZXRob2QuYXV0aENyZWRlbnRpYWxzO1xuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAobmV3Um91dGVNZXRob2QucGFyZW50Um91dGUuYXV0aENyZWRlbnRpYWxzICE9IG51bGwpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGF1dGhDcmVkZW50aWFscyA9IG5ld1JvdXRlTWV0aG9kLnBhcmVudFJvdXRlLmF1dGhDcmVkZW50aWFscztcblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAoYXV0aENyZWRlbnRpYWxzID09IG51bGwpXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiAoSG90KSAhPT0gXCJ1bmRlZmluZWRcIilcblx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoSG90ICE9IG51bGwpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKEhvdC5BUEkgIT0gbnVsbClcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoSG90LkFQSVtjdXJyZW50Um91dGUucm91dGVdICE9IG51bGwpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKEhvdC5BUElbY3VycmVudFJvdXRlLnJvdXRlXS5hdXRoQ3JlZGVudGlhbHMgIT0gbnVsbClcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhdXRoQ3JlZGVudGlhbHMgPSBIb3QuQVBJW2N1cnJlbnRSb3V0ZS5yb3V0ZV0uYXV0aENyZWRlbnRpYWxzO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGF1dGhDcmVkZW50aWFscyAhPSBudWxsKVxuXHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdC8vIEFkZCB0aGUgYXV0aG9yaXphdGlvbiBjcmVkZW50aWFscyB0byB0aGUgZGF0YSBiZWluZyBzZW50LlxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQga2V5IGluIGF1dGhDcmVkZW50aWFscylcblx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGF1dGhDcmVkZW50aWFsOiBhbnkgPSBhdXRoQ3JlZGVudGlhbHNba2V5XTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBEbyBub3Qgb3ZlcndyaXRlIGFueSBleGlzdGluZyBrZXlzIGluIHRoZSBkYXRhIGFib3V0IFxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyB0byBiZSBzZW50LlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoZGF0YVtrZXldID09IG51bGwpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YVtrZXldID0gYXV0aENyZWRlbnRpYWw7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0bGV0IGFyZ3M6IGFueVtdID0gW3JvdXRlU3RyLCBkYXRhLCBodHRwTWV0aG9kXTtcblxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiAodGhpcy5tYWtlQ2FsbC5hcHBseSAodGhpcywgYXJncykpO1xuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdC8vfVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdHRoaXNbcm91dGVOYW1lXSA9IG5ld1JvdXRlO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBSZWdpc3RlciBhIHJvdXRlIHdpdGggdGhlIHNlcnZlci5cblx0ICovXG5cdGFzeW5jIHJlZ2lzdGVyUm91dGUgKHJvdXRlOiBIb3RSb3V0ZSk6IFByb21pc2U8dm9pZD5cblx0e1xuXHRcdGlmICh0aGlzLmNvbm5lY3Rpb24gaW5zdGFuY2VvZiBIb3RTZXJ2ZXIpXG5cdFx0XHRhd2FpdCB0aGlzLmNvbm5lY3Rpb24ucmVnaXN0ZXJSb3V0ZSAocm91dGUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlZ2lzdGVyIGFsbCByb3V0ZXMgd2l0aCB0aGUgc2VydmVyLlxuXHQgKi9cblx0YXN5bmMgcmVnaXN0ZXJSb3V0ZXMgKCk6IFByb21pc2U8dm9pZD5cblx0e1xuXHRcdGZvciAobGV0IGtleSBpbiB0aGlzLnJvdXRlcylcblx0XHR7XG5cdFx0XHRsZXQgcm91dGU6IEhvdFJvdXRlID0gdGhpcy5yb3V0ZXNba2V5XTtcblxuXHRcdFx0YXdhaXQgdGhpcy5yZWdpc3RlclJvdXRlIChyb3V0ZSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIE1ha2UgYSBjYWxsIHRvIHRoZSBBUEkuXG5cdCAqL1xuXHRhc3luYyBtYWtlQ2FsbCAocm91dGU6IHN0cmluZywgZGF0YTogYW55LCBodHRwTWV0aG9kOiBzdHJpbmcgPSBcIlBPU1RcIik6IFByb21pc2U8YW55PlxuXHR7XG5cdFx0bGV0IHVybDogc3RyaW5nID0gdGhpcy5iYXNlVXJsO1xuXG5cdFx0aWYgKHVybFsodXJsLmxlbmd0aCAtIDEpXSA9PT0gXCIvXCIpXG5cdFx0XHR1cmwgPSB1cmwuc3Vic3RyICgwLCAodXJsLmxlbmd0aCAtIDEpKTtcblxuXHRcdGlmIChyb3V0ZVswXSAhPT0gXCIvXCIpXG5cdFx0XHR1cmwgKz0gXCIvXCI7XG5cblx0XHR1cmwgKz0gcm91dGU7XG5cblx0XHRodHRwTWV0aG9kID0gaHR0cE1ldGhvZC50b1VwcGVyQ2FzZSAoKTtcblxuXHRcdGxldCBmZXRjaE9iajogYW55ID0ge1xuXHRcdFx0XHRtZXRob2Q6IGh0dHBNZXRob2QsXG5cdFx0XHRcdGhlYWRlcnM6IHtcblx0XHRcdFx0XHRcdFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuXHRcdFx0XHRcdFx0XCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcblx0XHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0aWYgKChodHRwTWV0aG9kICE9PSBcIkdFVFwiKSAmJiBcblx0XHRcdChodHRwTWV0aG9kICE9PSBcIkhFQURcIikpXG5cdFx0e1xuXHRcdFx0ZmV0Y2hPYmpbXCJib2R5XCJdID0gSlNPTi5zdHJpbmdpZnkgKGRhdGEpO1xuXHRcdH1cblxuXHRcdGxldCByZXM6IGFueSA9IG51bGw7XG5cdFx0XG5cdFx0dHJ5XG5cdFx0e1xuXHRcdFx0cmVzID0gYXdhaXQgZmV0Y2ggKHVybCwgZmV0Y2hPYmopO1xuXHRcdH1cblx0XHRjYXRjaCAoZXgpXG5cdFx0e1xuXHRcdFx0dGhyb3cgZXg7XG5cdFx0fVxuXG5cdFx0bGV0IGpzb25PYmo6IGFueSA9IGF3YWl0IHJlcy5qc29uICgpO1xuXG5cdFx0cmV0dXJuIChqc29uT2JqKTtcblx0fVxufVxuIiwiaW1wb3J0IHsgSG90U3RhcSB9IGZyb20gXCIuL0hvdFN0YXFcIjtcbmltcG9ydCB7IEhvdEFQSSB9IGZyb20gXCIuL0hvdEFQSVwiO1xuaW1wb3J0IHsgSG90U2VydmVyVHlwZSB9IGZyb20gXCIuL0hvdFNlcnZlclwiO1xuaW1wb3J0IHsgSG90TG9nIH0gZnJvbSBcIi4vSG90TG9nXCI7XG5cbi8qKlxuICogQSBjbGllbnQgY29ubmVjdGVkIHRvIGEgc2VydmVyLlxuICovXG5leHBvcnQgY2xhc3MgSG90Q2xpZW50XG57XG5cdC8qKlxuXHQgKiBUaGUgcHJvY2Vzc29yIHRvIHVzZS5cblx0ICovXG5cdHByb2Nlc3NvcjogSG90U3RhcTtcblx0LyoqXG5cdCAqIFRoZSBBUEkgdG8gdXNlLlxuXHQgKi9cblx0YXBpOiBIb3RBUEk7XG5cdC8qKlxuXHQgKiBUaGUgdGVzdGVyIEFQSSB0byB1c2UuXG5cdCAqL1xuXHR0ZXN0ZXJBUEk6IEhvdEFQSTtcblx0LyoqXG5cdCAqIFRoZSB0eXBlIG9mIHNlcnZlci5cblx0ICovXG5cdHR5cGU6IEhvdFNlcnZlclR5cGU7XG5cdC8qKlxuXHQgKiBUaGUgbG9nZ2VyLlxuXHQgKi9cblx0bG9nZ2VyOiBIb3RMb2c7XG5cblx0Y29uc3RydWN0b3IgKHByb2Nlc3NvcjogSG90U3RhcSlcblx0e1xuXHRcdHRoaXMucHJvY2Vzc29yID0gcHJvY2Vzc29yO1xuXHRcdHRoaXMuYXBpID0gbnVsbDtcblx0XHR0aGlzLnRlc3RlckFQSSA9IG51bGw7XG5cdFx0dGhpcy50eXBlID0gSG90U2VydmVyVHlwZS5IVFRQO1xuXHRcdHRoaXMubG9nZ2VyID0gcHJvY2Vzc29yLmxvZ2dlcjtcblx0fVxufSIsImltcG9ydCB7IEhvdEFQSSB9IGZyb20gXCIuL0hvdEFQSVwiO1xuaW1wb3J0IHsgSG90U3RhcSB9IGZyb20gXCIuL0hvdFN0YXFcIjtcblxuLyoqXG4gKiBBIGNvbXBvbmVudCB0byBwcmVwcm9jZXNzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElIb3RDb21wb25lbnRcbntcblx0LyoqXG5cdCAqIFRoZSBwcm9jZXNzb3IgdG8gdXNlLlxuXHQgKi9cblx0cHJvY2Vzc29yOiBIb3RTdGFxO1xuXHQvKipcblx0ICogVGhlIGFzc29jaWF0ZWQgSFRNTEVsZW1lbnQuXG5cdCAqL1xuXHRodG1sRWxlbWVudD86IEhUTUxFbGVtZW50O1xuXHQvKipcblx0ICogVGhlIG5hbWUgb2YgdGhlIHBhZ2UuXG5cdCAqL1xuXHRuYW1lPzogc3RyaW5nO1xuXHQvKipcblx0ICogVGhlIG5hbWUgb2YgdGhlIHRhZy5cblx0ICovXG5cdHRhZz86IHN0cmluZztcblx0LyoqXG5cdCAqIFRoZSBjb25uZWN0ZWQgQVBJLlxuXHQgKi9cblx0YXBpPzogSG90QVBJO1xuXHQvKipcblx0ICogVGhlIG9wdGlvbnMgdG8gaW5jbHVkZSB3aXRoIHJlZ2lzdGVyaW5nIHRoaXMgY29tcG9uZW50LlxuXHQgKi9cblx0ZWxlbWVudE9wdGlvbnM/OiBFbGVtZW50RGVmaW5pdGlvbk9wdGlvbnM7XG5cdC8qKlxuXHQgKiBUaGUgdHlwZSBvZiBjb21wb25lbnQuXG5cdCAqL1xuXHR0eXBlPzogc3RyaW5nO1xuXHQvKipcblx0ICogVGhlIHZhbHVlIG9mIHRoZSBjb21wb25lbnQuXG5cdCAqL1xuXHR2YWx1ZT86IGFueTtcblx0LyoqXG5cdCAqIFRoZSBldmVudHMgdG8gdHJpZ2dlci5cblx0ICovXG5cdGV2ZW50cz86IHtcblx0XHRcdFtuYW1lOiBzdHJpbmddOiB7XG5cdFx0XHRcdHR5cGU6IHN0cmluZztcblx0XHRcdFx0ZnVuYzogRnVuY3Rpb247XG5cdFx0XHRcdG9wdGlvbnM/OiBhbnk7XG5cdFx0XHR9XG5cdFx0fTtcbn1cblxuLyoqXG4gKiBBIGNvbXBvbmVudCB0byBwcmVwcm9jZXNzLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSG90Q29tcG9uZW50IGltcGxlbWVudHMgSUhvdENvbXBvbmVudFxue1xuXHQvKipcblx0ICogVGhlIHByb2Nlc3NvciB0byB1c2UuXG5cdCAqL1xuXHRwcm9jZXNzb3I6IEhvdFN0YXE7XG5cdC8qKlxuXHQgKiBUaGUgYXNzb2NpYXRlZCBIVE1MRWxlbWVudC5cblx0ICovXG5cdGh0bWxFbGVtZW50OiBIVE1MRWxlbWVudDtcblx0LyoqXG5cdCAqIFRoZSBuYW1lIG9mIHRoZSBjb21wb25lbnQuXG5cdCAqL1xuXHRuYW1lOiBzdHJpbmc7XG5cdC8qKlxuXHQgKiBUaGUgbmFtZSBvZiB0aGUgdGFnLlxuXHQgKi9cblx0dGFnOiBzdHJpbmc7XG5cdC8qKlxuXHQgKiBUaGUgY29ubmVjdGVkIEFQSS5cblx0ICovXG5cdGFwaTogSG90QVBJO1xuXHQvKipcblx0ICogVGhlIG9wdGlvbnMgdG8gaW5jbHVkZSB3aXRoIHJlZ2lzdGVyaW5nIHRoaXMgY29tcG9uZW50LlxuXHQgKi9cblx0ZWxlbWVudE9wdGlvbnM6IEVsZW1lbnREZWZpbml0aW9uT3B0aW9ucztcblx0LyoqXG5cdCAqIFRoZSB0eXBlIG9mIGNvbXBvbmVudC5cblx0ICovXG5cdHR5cGU6IHN0cmluZztcblx0LyoqXG5cdCAqIFRoZSB2YWx1ZSBvZiB0aGUgY29tcG9uZW50LlxuXHQgKi9cblx0dmFsdWU6IGFueTtcblx0LyoqXG5cdCAqIFRoZSBldmVudHMgdG8gdHJpZ2dlci5cblx0ICovXG5cdGV2ZW50czoge1xuXHRcdFtuYW1lOiBzdHJpbmddOiB7XG5cdFx0XHRcdHR5cGU6IHN0cmluZztcblx0XHRcdFx0ZnVuYzogRnVuY3Rpb247XG5cdFx0XHRcdG9wdGlvbnM6IGFueTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdGNvbnN0cnVjdG9yIChjb3B5OiBJSG90Q29tcG9uZW50IHwgSG90U3RhcSwgYXBpOiBIb3RBUEkgPSBudWxsKVxuXHR7XG5cdFx0aWYgKGNvcHkgaW5zdGFuY2VvZiBIb3RTdGFxKVxuXHRcdHtcblx0XHRcdHRoaXMucHJvY2Vzc29yID0gY29weTtcblx0XHRcdHRoaXMuaHRtbEVsZW1lbnQgPSBudWxsO1xuXHRcdFx0dGhpcy5uYW1lID0gXCJcIjtcblx0XHRcdHRoaXMudGFnID0gXCJcIjtcblx0XHRcdHRoaXMuYXBpID0gbnVsbDtcblx0XHRcdHRoaXMuZWxlbWVudE9wdGlvbnMgPSB1bmRlZmluZWQ7XG5cdFx0XHR0aGlzLnR5cGUgPSBcIlwiO1xuXHRcdFx0dGhpcy52YWx1ZSA9IG51bGw7XG5cdFx0XHR0aGlzLmV2ZW50cyA9IHt9O1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0dGhpcy5wcm9jZXNzb3IgPSBjb3B5LnByb2Nlc3Nvcjtcblx0XHRcdHRoaXMuaHRtbEVsZW1lbnQgPSBjb3B5Lmh0bWxFbGVtZW50IHx8IG51bGw7XG5cdFx0XHR0aGlzLm5hbWUgPSBjb3B5Lm5hbWUgfHwgXCJcIjtcblx0XHRcdHRoaXMudGFnID0gY29weS50YWcgfHwgdGhpcy5uYW1lO1xuXHRcdFx0dGhpcy5hcGkgPSBjb3B5LmFwaSB8fCBudWxsO1xuXHRcdFx0dGhpcy5lbGVtZW50T3B0aW9ucyA9IGNvcHkuZWxlbWVudE9wdGlvbnMgfHwgdW5kZWZpbmVkO1xuXHRcdFx0dGhpcy50eXBlID0gY29weS50eXBlIHx8IFwiXCI7XG5cdFx0XHR0aGlzLnZhbHVlID0gY29weS52YWx1ZSB8fCBudWxsO1xuXHRcdFx0dGhpcy5ldmVudHMgPSB7fTtcblx0XHR9XG5cblx0XHRpZiAoYXBpICE9IG51bGwpXG5cdFx0XHR0aGlzLmFwaSA9IGFwaTtcblx0fVxuXG5cdC8qKlxuXHQgKiBFdmVudCB0aGF0J3MgY2FsbGVkIHdoZW4gdGhpcyBjb21wb25lbnQgaXMgY3JlYXRlZC4gVGhpcyBpcyBcblx0ICogY2FsbGVkIGJlZm9yZSBvdXRwdXQgaXMgY2FsbGVkLiBSaWdodCBhZnRlciB0aGlzIGlzIGNhbGxlZCwgXG5cdCAqIHRoZSBhdHRyaWJ1dGVzIGZyb20gdGhlIEhUTUxFbGVtZW50IHdpbGwgYmUgcHJvY2Vzc2VkLiBJZiBcblx0ICogdGhlIGZ1bmN0aW9uYWxpdHkgb2YgdGhlIGF0dHJpYnV0ZXMgcHJvY2Vzc2luZyBuZWVkIHRvIGJlIFxuXHQgKiBvdmVyd3JpdHRlbiwgdXNlIHRoZSBoYW5kbGVBdHRyaWJ1dGVzIG1ldGhvZCB0byBoYW5kbGUgdGhlbS5cblx0ICovXG5cdGFzeW5jIG9uQ3JlYXRlZCAoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBQcm9taXNlPGFueT5cblx0e1xuXHRcdHJldHVybiAoZWxlbWVudCk7XG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlIHRoZSBhdHRyaWJ1dGVzIG1hbnVhbGx5LlxuXHQgKi9cblx0YXN5bmMgaGFuZGxlQXR0cmlidXRlcz8gKGF0dHJpYnV0ZXM6IE5hbWVkTm9kZU1hcCk6IFByb21pc2U8dm9pZD47XG5cblx0LyoqXG5cdCAqIEhhbmRsZSBhIGNsaWNrIGV2ZW50LlxuXHQgKi9cblx0YWJzdHJhY3QgY2xpY2sgKCk6IFByb21pc2U8dm9pZD47XG5cblx0LyoqXG5cdCAqIE91dHB1dCB0aGUgY29tcG9uZW50LlxuXHQgKi9cblx0YWJzdHJhY3Qgb3V0cHV0ICgpOiBQcm9taXNlPHN0cmluZz47XG59IiwiaW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCI7XG5cbmltcG9ydCBmZXRjaCBmcm9tIFwiY3Jvc3MtZmV0Y2hcIjtcblxuaW1wb3J0IHsgRGV2ZWxvcGVyTW9kZSwgSG90IH0gZnJvbSBcIi4vSG90XCI7XG5pbXBvcnQgeyBIb3RQYWdlIH0gZnJvbSBcIi4vSG90UGFnZVwiO1xuaW1wb3J0IHsgSG90VGVzdEVsZW1lbnQgfSBmcm9tIFwiLi9Ib3RUZXN0RWxlbWVudFwiO1xuXG4vKipcbiAqIEEgZmlsZSB0byBwcm9jZXNzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElIb3RGaWxlXG57XG5cdC8qKlxuXHQgKiBUaGUgcGFyZW50IHBhZ2UuXG5cdCAqL1xuXHRwYWdlPzogSG90UGFnZTtcblx0LyoqXG5cdCAqIFRoZSBuYW1lIG9mIHRoZSBmaWxlLlxuXHQgKi9cblx0bmFtZT86IHN0cmluZztcblx0LyoqXG5cdCAqIFRoZSB1cmwgdG8gdGhlIGZpbGUgdG8gZ2V0LlxuXHQgKi9cblx0dXJsPzogc3RyaW5nO1xuXHQvKipcblx0ICogVGhlIHBhdGggdG8gdGhlIGxvY2FsIGZpbGUgdG8gZ2V0LlxuXHQgKi9cblx0bG9jYWxGaWxlPzogc3RyaW5nO1xuXHQvKipcblx0ICogVGhlIGNvbnRlbnQgb2YgdGhlIGZpbGUgdG8gcHJvY2Vzcy5cblx0ICovXG5cdGNvbnRlbnQ/OiBzdHJpbmc7XG5cdC8qKlxuXHQgKiBGb3JjZSBhbGwgZXJyb3JzIHRvIGJlIHRocm93bi5cblx0ICovXG5cdHRocm93QWxsRXJyb3JzPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBIGZpbGUgdG8gcHJvY2Vzcy5cbiAqL1xuZXhwb3J0IGNsYXNzIEhvdEZpbGUgaW1wbGVtZW50cyBJSG90RmlsZVxue1xuXHQvKipcblx0ICogVGhlIHBhcmVudCBwYWdlLlxuXHQgKi9cblx0cGFnZTogSG90UGFnZTtcblx0LyoqXG5cdCAqIFRoZSBuYW1lIG9mIHRoZSBmaWxlLlxuXHQgKi9cblx0bmFtZTogc3RyaW5nO1xuXHQvKipcblx0ICogVGhlIHVybCB0byB0aGUgZmlsZSB0byBnZXQuXG5cdCAqL1xuXHR1cmw6IHN0cmluZztcblx0LyoqXG5cdCAqIFRoZSBwYXRoIHRvIHRoZSBsb2NhbCBmaWxlIHRvIGdldC5cblx0ICovXG5cdGxvY2FsRmlsZTogc3RyaW5nO1xuXHQvKipcblx0ICogVGhlIGNvbnRlbnQgb2YgdGhlIGZpbGUgdG8gcHJvY2Vzcy5cblx0ICovXG5cdGNvbnRlbnQ6IHN0cmluZztcblx0LyoqXG5cdCAqIEZvcmNlIGFsbCBlcnJvcnMgdG8gYmUgdGhyb3duLlxuXHQgKi9cblx0dGhyb3dBbGxFcnJvcnM6IGJvb2xlYW47XG5cblx0Y29uc3RydWN0b3IgKGNvcHk6IElIb3RGaWxlID0ge30pXG5cdHtcblx0XHR0aGlzLnBhZ2UgPSBjb3B5LnBhZ2UgfHwgbnVsbDtcblx0XHR0aGlzLm5hbWUgPSBjb3B5Lm5hbWUgfHwgXCJcIjtcblx0XHR0aGlzLnVybCA9IGNvcHkudXJsIHx8IFwiXCI7XG5cdFx0dGhpcy5sb2NhbEZpbGUgPSBjb3B5LmxvY2FsRmlsZSB8fCBcIlwiO1xuXHRcdHRoaXMuY29udGVudCA9IGNvcHkuY29udGVudCB8fCBcIlwiO1xuXHRcdHRoaXMudGhyb3dBbGxFcnJvcnMgPSBjb3B5LnRocm93QWxsRXJyb3JzIHx8IGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldCB0aGUgY29udGVudCBvZiB0aGlzIGZpbGUuXG5cdCAqL1xuXHRzZXRDb250ZW50IChjb250ZW50OiBzdHJpbmcpOiB2b2lkXG5cdHtcblx0XHR0aGlzLmNvbnRlbnQgPSBjb250ZW50O1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCB0aGUgY29udGVudCBvZiB0aGlzIGZpbGUuXG5cdCAqL1xuXHRnZXRDb250ZW50ICgpOiBzdHJpbmdcblx0e1xuXHRcdHJldHVybiAodGhpcy5jb250ZW50KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBNYWtlIGEgSFRUUCBnZXQgcmVxdWVzdC5cblx0ICovXG5cdHN0YXRpYyBhc3luYyBodHRwR2V0ICh1cmw6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPlxuXHR7XG5cdFx0dHJ5XG5cdFx0e1xuXHRcdFx0bGV0IHJlczogUmVzcG9uc2UgPSBhd2FpdCBmZXRjaCAodXJsKTtcblxuXHRcdFx0aWYgKHJlcy5vayA9PT0gZmFsc2UpXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvciAoYCR7cmVzLnN0YXR1c306ICR7cmVzLnN0YXR1c1RleHR9YCk7XG5cblx0XHRcdGxldCBjb250ZW50OiBzdHJpbmcgPSBhd2FpdCByZXMudGV4dCAoKTtcblxuXHRcdFx0cmV0dXJuIChjb250ZW50KTtcblx0XHR9XG5cdFx0Y2F0Y2ggKGV4KVxuXHRcdHtcblx0XHRcdHJldHVybiAoSlNPTi5zdHJpbmdpZnkgKHsgXCJlcnJvclwiOiBgJHtleC5tZXNzYWdlfSAtIENvdWxkIG5vdCBmZXRjaCAke3VybH1gIH0pKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogTG9hZCBjb250ZW50IGZyb20gYSB1cmwuXG5cdCAqL1xuXHRhc3luYyBsb2FkVXJsICgpOiBQcm9taXNlPHN0cmluZz5cblx0e1xuXHRcdHRoaXMuY29udGVudCA9IGF3YWl0IEhvdEZpbGUuaHR0cEdldCAodGhpcy51cmwpO1xuXG5cdFx0cmV0dXJuICh0aGlzLmNvbnRlbnQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIExvYWQgY29udGVudCBmcm9tIGEgbG9jYWwgZmlsZS5cblx0ICovXG5cdGFzeW5jIGxvYWRMb2NhbEZpbGUgKCk6IFByb21pc2U8c3RyaW5nPlxuXHR7XG5cdFx0bGV0IHByb21pc2U6IFByb21pc2U8c3RyaW5nPiA9IG5ldyBQcm9taXNlIChcblx0XHRcdChyZXNvbHZlOiBhbnksIHJlamVjdDogYW55KTogdm9pZCA9PlxuXHRcdFx0e1xuXHRcdFx0XHRmcy5yZWFkRmlsZSAodGhpcy5sb2NhbEZpbGUsIChlcnI6IE5vZGVKUy5FcnJub0V4Y2VwdGlvbiwgZGF0YTogQnVmZmVyKTogdm9pZCA9PlxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGlmIChlcnIgIT0gbnVsbClcblx0XHRcdFx0XHRcdFx0dGhyb3cgZXJyO1xuXG5cdFx0XHRcdFx0XHRsZXQgY29udGVudDogc3RyaW5nID0gZGF0YS50b1N0cmluZyAoKTtcblx0XHRcdFx0XHRcdHRoaXMuY29udGVudCA9IGNvbnRlbnQ7XG5cblx0XHRcdFx0XHRcdHJlc29sdmUgKHRoaXMuY29udGVudCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblxuXHRcdHJldHVybiAocHJvbWlzZSk7XG5cdH1cblxuXHQvKipcblx0ICogTG9hZCB0aGUgY29udGVudHMgb2YgdGhlIGZpbGUuXG5cdCAqL1xuXHRhc3luYyBsb2FkICgpOiBQcm9taXNlPHN0cmluZz5cblx0e1xuXHRcdGxldCBjb250ZW50OiBzdHJpbmcgPSBcIlwiO1xuXG5cdFx0aWYgKHRoaXMudXJsICE9PSBcIlwiKVxuXHRcdFx0Y29udGVudCA9IGF3YWl0IHRoaXMubG9hZFVybCAoKTtcblxuXHRcdGlmICh0aGlzLmxvY2FsRmlsZSAhPT0gXCJcIilcblx0XHRcdGNvbnRlbnQgPSBhd2FpdCB0aGlzLmxvYWRMb2NhbEZpbGUgKCk7XG5cblx0XHRyZXR1cm4gKGNvbnRlbnQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFByb2Nlc3Mgc3RyaW5nIGNvbnRlbnQuIFRoaXMgd2lsbCB0YWtlIGluIGEgcmVndWxhciBleHByZXNzaW9uIGFuZCBcblx0ICogcGFyc2UgdGhlIGNvbnRlbnQgYmFzZWQgb24gdGhlIHJlZ2V4LiBXaGVuIHRoZSByZWdleCBjb250ZW50IGlzIGZvdW5kIFxuXHQgKiBjb250ZW50UHJvY2Vzc29yIHdpbGwgYmUgZXhlY3V0ZWQgd2l0aCB0aGUgcmVnZXggY29udGVudCBmb3VuZC4gV2hlbiBcblx0ICogdGhlIHJlZ2V4IGNvbnRlbnQgaXMgbm90IGZvdW5kLCBvZmZDb250ZW50UHJvY2Vzc29yIHdpbGwgYmUgY2FsbGVkIHdpdGggXG5cdCAqIHRoZSBjb250ZW50IG91dHNpZGUgb2YgdGhlIHJlZ2V4LlxuXHQgKiBcblx0ICogQHBhcmFtIGNvbnRlbnQgVGhlIGNvbnRlbnQgdG8gcGFyc2UuXG5cdCAqIEBwYXJhbSBjb250ZW50UmVnZXggVGhlIHJlZ2V4IHRvIHVzZSB0byBwYXJzZSB0aGUgY29udGVudC5cblx0ICogQHBhcmFtIGNvbnRlbnRQcm9jZXNzb3IgVGhlIGNvbnRlbnQgZm91bmQgaW5zaWRlIHRoZSByZWdleC5cblx0ICogQHBhcmFtIG9mZkNvbnRlbnRQcm9jZXNzb3IgVGhlIGNvbnRlbnQgZm91bmQgb3V0c2lkZSBvZiB0aGUgcmVnZXguXG5cdCAqIEBwYXJhbSBudW1SZW1vdmVGcm9tQmVnaW5uaW5nIFRoZSBudW1iZXIgb2YgY2hhcmFjdGVycyB0byByZW1vdmUgZnJvbSB0aGUgXG5cdCAqIGJlZ2lubmluZyBvZiB0aGUgZm91bmQgY29udGVudC5cblx0ICogQHBhcmFtIG51bVJlbW92ZUZyb21FbmQgVGhlIG51bWJlciBvZiBjaGFyYWN0ZXJzIHRvIHJlbW92ZSBmcm9tIHRoZSBlbmQgb2YgXG5cdCAqIHRoZSBmb3VuZCBjb250ZW50LlxuXHQgKi9cblx0c3RhdGljIHByb2Nlc3NDb250ZW50IChjb250ZW50OiBzdHJpbmcsIGNvbnRlbnRSZWdleDogUmVnRXhwLFxuXHRcdGNvbnRlbnRQcm9jZXNzb3I6IChyZWdleEZvdW5kOiBzdHJpbmcpID0+IHN0cmluZyxcblx0XHRvZmZDb250ZW50UHJvY2Vzc29yOiAob2ZmQ29udGVudDogc3RyaW5nKSA9PiBzdHJpbmcsXG5cdFx0bnVtUmVtb3ZlRnJvbUJlZ2lubmluZzogbnVtYmVyID0gMixcblx0XHRudW1SZW1vdmVGcm9tRW5kOiBudW1iZXIgPSAyKTogc3RyaW5nXG5cdHtcblx0XHRsZXQgcmVzdWx0OiBSZWdFeHBFeGVjQXJyYXkgPSBjb250ZW50UmVnZXguZXhlYyAoY29udGVudCk7XG5cdFx0bGV0IHByZXZpb3VzSW5kZXg6IG51bWJlciA9IDA7XG5cdFx0bGV0IG91dHB1dDogc3RyaW5nID0gXCJcIjtcblxuXHRcdHdoaWxlIChyZXN1bHQgIT0gbnVsbClcblx0XHR7XG5cdFx0XHRsZXQgc3RhcnQ6IG51bWJlciA9IHJlc3VsdC5pbmRleCAtIG51bVJlbW92ZUZyb21CZWdpbm5pbmc7XG5cdFx0XHRsZXQgZW5kOiBudW1iZXIgPSBjb250ZW50UmVnZXgubGFzdEluZGV4ICsgbnVtUmVtb3ZlRnJvbUVuZDtcblxuXHRcdFx0Ly8gR2V0IHRoZSBwcmV2aW91cyBzZWN0aW9uLlxuXHRcdFx0bGV0IHByZXZDb250ZW50OiBzdHJpbmcgPSBjb250ZW50LnN1YnN0ciAocHJldmlvdXNJbmRleCwgKHN0YXJ0IC0gcHJldmlvdXNJbmRleCkpO1xuXHRcdFx0cHJldmlvdXNJbmRleCA9IGVuZDtcblxuXHRcdFx0b3V0cHV0ICs9IG9mZkNvbnRlbnRQcm9jZXNzb3IgKHByZXZDb250ZW50KTtcblxuXHRcdFx0Ly8gUHJvY2VzcyB0aGUgY29udGVudCBmb3VuZCBmcm9tIHRoZSByZWdleFxuXHRcdFx0bGV0IGNvbnRlbnRGb3VuZDogc3RyaW5nID0gcmVzdWx0WzBdO1xuXHRcdFx0b3V0cHV0ICs9IGNvbnRlbnRQcm9jZXNzb3IgKGNvbnRlbnRGb3VuZCk7XG5cblx0XHRcdC8vIE1vdmUgb24gdG8gdGhlIG5leHQgc2VjdGlvbiB0byBwYXJzZS5cblx0XHRcdHJlc3VsdCA9IGNvbnRlbnRSZWdleC5leGVjIChjb250ZW50KTtcblx0XHR9XG5cblx0XHQvLyBBcHBlbmQgd2hhdGV2ZXIgZWxzZSBpcyBhZnRlciB0aGUgbGFzdCBwYXJzZWQgc2VjdGlvbi5cblx0XHRsZXQgbGFzdENvbnRlbnQ6IHN0cmluZyA9IGNvbnRlbnQuc3Vic3RyIChwcmV2aW91c0luZGV4KTtcblxuXHRcdG91dHB1dCArPSBvZmZDb250ZW50UHJvY2Vzc29yIChsYXN0Q29udGVudCk7XG5cblx0XHRyZXR1cm4gKG91dHB1dCk7XG5cdH1cblxuXHQvKipcblx0ICogUHJvY2VzcyBhbnkgY29udGVudCB0aGF0IGNvdWxkIGhhdmUgbmVzdGVkIHZhbHVlcy4gVGhpcyB3aWxsIFxuXHQgKiB0YWtlIGluIGEgcmVndWxhciBleHByZXNzaW9uIGFuZCBcblx0ICogcGFyc2UgdGhlIGNvbnRlbnQgYmFzZWQgb24gdGhlIHJlZ2V4LiBXaGVuIHRoZSByZWdleCBjb250ZW50IGlzIGZvdW5kIFxuXHQgKiBjb250ZW50UHJvY2Vzc29yIHdpbGwgYmUgZXhlY3V0ZWQgd2l0aCB0aGUgcmVnZXggY29udGVudCBmb3VuZC4gV2hlbiBcblx0ICogdGhlIHJlZ2V4IGNvbnRlbnQgaXMgbm90IGZvdW5kLCBvZmZDb250ZW50UHJvY2Vzc29yIHdpbGwgYmUgY2FsbGVkIHdpdGggXG5cdCAqIHRoZSBjb250ZW50IG91dHNpZGUgb2YgdGhlIHJlZ2V4LlxuXHQgKiBcblx0ICogQGZpeG1lIE5lZWRzIHRvIGJlIGFibGUgdG8gaWdub3JlIGFueSBjaGFyYWN0ZXJzIGZvdW5kIGluc2lkZSBjb21tZW50cyBcblx0ICogb3IgYSBzdHJpbmcuIEZvciBleGFtcGxlLCBpZiB0aGUgZm9sbG93aW5nIGlzIHVzZWQgYGBgJHtcIlRlc3QgfVwifWBgYCBJdCBcblx0ICogd2lsbCBlcnJvciBvdXQuXG5cdCAqIFxuXHQgKiBAcGFyYW0gY29udGVudCBUaGUgY29udGVudCB0byBwYXJzZS5cblx0ICogQHBhcmFtIGNvbnRlbnRSZWdleCBUaGUgcmVnZXggdG8gdXNlIHRvIHBhcnNlIHRoZSBjb250ZW50LlxuXHQgKiBAcGFyYW0gY29udGVudFByb2Nlc3NvciBUaGUgY29udGVudCBmb3VuZCBpbnNpZGUgdGhlIHJlZ2V4LlxuXHQgKiBAcGFyYW0gb2ZmQ29udGVudFByb2Nlc3NvciBUaGUgY29udGVudCBmb3VuZCBvdXRzaWRlIG9mIHRoZSByZWdleC5cblx0ICogQHBhcmFtIG51bVJlbW92ZUZyb21CZWdpbm5pbmcgVGhlIG51bWJlciBvZiBjaGFyYWN0ZXJzIHRvIHJlbW92ZSBmcm9tIHRoZSBcblx0ICogYmVnaW5uaW5nIG9mIHRoZSBmb3VuZCBjb250ZW50LlxuXHQgKiBAcGFyYW0gbnVtUmVtb3ZlRnJvbUVuZCBUaGUgbnVtYmVyIG9mIGNoYXJhY3RlcnMgdG8gcmVtb3ZlIGZyb20gdGhlIGVuZCBvZiBcblx0ICogdGhlIGZvdW5kIGNvbnRlbnQuXG5cdCAqL1xuXHRzdGF0aWMgcHJvY2Vzc05lc3RlZENvbnRlbnQgKGNvbnRlbnQ6IHN0cmluZywgc3RhcnRDaGFyczogc3RyaW5nLCBlbmRDaGFyczogc3RyaW5nLCBcblx0XHR0cmlnZ2VyQ2hhcjogc3RyaW5nLCBjb250ZW50UHJvY2Vzc29yOiAocmVnZXhGb3VuZDogc3RyaW5nKSA9PiBzdHJpbmcsXG5cdFx0b2ZmQ29udGVudFByb2Nlc3NvcjogKG9mZkNvbnRlbnQ6IHN0cmluZykgPT4gc3RyaW5nLFxuXHRcdG51bVJlbW92ZUZyb21CZWdpbm5pbmc6IG51bWJlciA9IDIsXG5cdFx0bnVtUmVtb3ZlRnJvbUVuZDogbnVtYmVyID0gMSk6IHN0cmluZ1xuXHR7XG5cdFx0bGV0IHBvczogbnVtYmVyID0gY29udGVudC5pbmRleE9mIChzdGFydENoYXJzKTtcblx0XHRsZXQgcHJldmlvdXNJbmRleDogbnVtYmVyID0gMDtcblx0XHRsZXQgc3RhcnRUcmlnZ2VyUG9zOiBudW1iZXIgPSBjb250ZW50LmluZGV4T2YgKHRyaWdnZXJDaGFyLCBwb3MpO1xuXHRcdGxldCBvdXRwdXQ6IHN0cmluZyA9IFwiXCI7XG5cblx0XHR3aGlsZSAocG9zID4gLTEpXG5cdFx0e1xuXHRcdFx0bGV0IGVuZDogbnVtYmVyID0gY29udGVudC5pbmRleE9mIChlbmRDaGFycywgcG9zKTtcblx0XHRcdGxldCBuZXN0ZWRDb3VudGVyOiBudW1iZXIgPSAwO1xuXG5cdFx0XHRpZiAodHJpZ2dlckNoYXIgIT09IFwiXCIpXG5cdFx0XHR7XG5cdFx0XHRcdC8vIFJldmVyc2Ugc2VhcmNoIHRoZSB0cmlnZ2VyIGNoYXJhY3RlcnMgYW5kIGNvdW50IHRoZSBudW1iZXIgb2YgXG5cdFx0XHRcdC8vIG9jY3VycmVuY2VzLlxuXHRcdFx0XHRsZXQgcnBvczogbnVtYmVyID0gY29udGVudC5sYXN0SW5kZXhPZiAodHJpZ2dlckNoYXIsIGVuZCAtIG51bVJlbW92ZUZyb21FbmQpO1xuXG5cdFx0XHRcdHdoaWxlIChycG9zID4gLTEpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZiAocnBvcyA9PT0gc3RhcnRUcmlnZ2VyUG9zKVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRycG9zID0gY29udGVudC5sYXN0SW5kZXhPZiAodHJpZ2dlckNoYXIsIHJwb3MgLSBudW1SZW1vdmVGcm9tRW5kKTtcblx0XHRcdFx0XHRuZXN0ZWRDb3VudGVyKys7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gSWYgdGhlcmUncyBuZXN0ZWQgdHJpZ2dlciBjaGFyYWN0ZXJzLCBnZXQgdGhlIGxhc3Qgb2NjdXJyZW5jZSBvZiBcblx0XHRcdC8vIHRoZSBlbmQgY2hhcmFjdGVyLlxuXHRcdFx0aWYgKG5lc3RlZENvdW50ZXIgPiAwKVxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgZXBvczogbnVtYmVyID0gY29udGVudC5pbmRleE9mIChlbmRDaGFycywgZW5kICsgbnVtUmVtb3ZlRnJvbUVuZCk7XG5cdFx0XHRcdGxldCB0ZW1wZXBvczogbnVtYmVyID0gZXBvcztcblxuXHRcdFx0XHR3aGlsZSAoKGVwb3MgPiAtMSkgJiYgKG5lc3RlZENvdW50ZXIgPiAwKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmICh0ZW1wZXBvcyA8IDApXG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdC8vIE1ha2Ugc3VyZSB3ZSBhcmVuJ3QgZGlzY292ZXJpbmcgZW5kQ2hhcnMgdGhhdCB3ZSBzaG91bGRuJ3QgYmUuXG5cdFx0XHRcdFx0bGV0IHBvc091dHNpZGVPZkNvbnRlbnQ6IG51bWJlciA9IGNvbnRlbnQubGFzdEluZGV4T2YgKHN0YXJ0Q2hhcnMsIHRlbXBlcG9zIC0gbnVtUmVtb3ZlRnJvbUVuZCk7XG5cblx0XHRcdFx0XHRpZiAocG9zT3V0c2lkZU9mQ29udGVudCA+IGVwb3MpXG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdGVwb3MgPSB0ZW1wZXBvcztcblxuXHRcdFx0XHRcdHRlbXBlcG9zID0gY29udGVudC5pbmRleE9mIChlbmRDaGFycywgZXBvcyArIG51bVJlbW92ZUZyb21FbmQpO1xuXHRcdFx0XHRcdG5lc3RlZENvdW50ZXItLTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGVuZCA9IGVwb3M7XG5cdFx0XHR9XG5cblx0XHRcdGxldCBvZmZDb250ZW50U3RyOiBzdHJpbmcgPSBjb250ZW50LnN1YnN0ciAocHJldmlvdXNJbmRleCwgKHBvcyAtIHByZXZpb3VzSW5kZXgpKTtcblx0XHRcdG91dHB1dCArPSBvZmZDb250ZW50UHJvY2Vzc29yIChvZmZDb250ZW50U3RyKTtcblxuXHRcdFx0bGV0IGZvdW5kQ29udGVudDogc3RyaW5nID0gY29udGVudC5zdWJzdHIgKFxuXHRcdFx0XHRwb3MgKyBudW1SZW1vdmVGcm9tQmVnaW5uaW5nLCAoZW5kIC0gKHBvcyArIG51bVJlbW92ZUZyb21CZWdpbm5pbmcpKSk7XG5cdFx0XHRvdXRwdXQgKz0gY29udGVudFByb2Nlc3NvciAoZm91bmRDb250ZW50KTtcblxuXHRcdFx0Ly8gR2V0IHRoZSBuZXh0IGNvbnRlbnRcblx0XHRcdHBvcyA9IGNvbnRlbnQuaW5kZXhPZiAoc3RhcnRDaGFycywgZW5kICsgbnVtUmVtb3ZlRnJvbUVuZCk7XG5cdFx0XHRzdGFydFRyaWdnZXJQb3MgPSBjb250ZW50LmluZGV4T2YgKHRyaWdnZXJDaGFyLCBwb3MpO1xuXHRcdFx0cHJldmlvdXNJbmRleCA9IGVuZCArIG51bVJlbW92ZUZyb21FbmQ7XG5cdFx0fVxuXG5cdFx0Ly8gQXBwZW5kIHdoYXRldmVyIGVsc2UgaXMgYWZ0ZXIgdGhlIGxhc3QgcGFyc2VkIHNlY3Rpb24uXG5cdFx0bGV0IGxhc3RDb250ZW50OiBzdHJpbmcgPSBjb250ZW50LnN1YnN0ciAocHJldmlvdXNJbmRleCk7XG5cblx0XHRvdXRwdXQgKz0gb2ZmQ29udGVudFByb2Nlc3NvciAobGFzdENvbnRlbnQpO1xuXG5cdFx0cmV0dXJuIChvdXRwdXQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFByb2Nlc3MgdGhlIGNvbnRlbnQgaW4gdGhpcyBmaWxlLiBUaGlzIHRyZWF0cyBlYWNoIGZpbGUgYXMgb25lIGxhcmdlIEphdmFTY3JpcHRcblx0ICogZmlsZS4gQW55IHRleHQgb3V0c2lkZSBvZiB0aGUgPCogKj4gYXJlYXMgd2lsbCBiZSB0cmVhdGVkIGFzOlxuXHQgKiBcblx0ICogXHRcdEhvdC5lY2hvIChcInRleHRcIik7XG5cdCAqIFxuXHQgKiBAZml4bWUgVGhlIHJlZ2V4J3MgaW4gdGhlIG9mZkNvbnRlbnQgZnVuY3Rpb25zIG5lZWQgdG8gYmUgZml4ZWQuIFRoZXJlJ3Mgc2V2ZXJhbCBcblx0ICogdGVzdCBjYXNlcyB3aGVyZSB0aGV5IHdpbGwgZmFpbC5cblx0ICovXG5cdGFzeW5jIHByb2Nlc3MgKGFyZ3M6IGFueSA9IG51bGwpOiBQcm9taXNlPHN0cmluZz5cblx0e1xuXHRcdGxldCBvdXRwdXQ6IHN0cmluZyA9IFwiXCI7XG5cdFx0bGV0IHRoaXNDb250ZW50OiBzdHJpbmcgPSB0aGlzLmNvbnRlbnQ7XG5cblx0XHRIb3QuTW9kZSA9IHRoaXMucGFnZS5wcm9jZXNzb3IubW9kZTtcblx0XHRIb3QuQXJndW1lbnRzID0gYXJncztcblx0XHRIb3QuQ3VycmVudFBhZ2UgPSB0aGlzLnBhZ2U7XG5cdFx0SG90LlB1YmxpY1NlY3JldHMgPSB0aGlzLnBhZ2UucHJvY2Vzc29yLnB1YmxpY1NlY3JldHM7XG5cdFx0SG90LkFQSSA9IHRoaXMucGFnZS5nZXRBUEkgKCk7XG5cdFx0SG90LlRlc3RlckFQSSA9IHRoaXMucGFnZS5nZXRUZXN0ZXJBUEkgKCk7XG5cblx0XHQvLyBBc3NlbWJsZSB0aGUgSlMgdG8gZXZhbHVhdGUuIFRoaXMgd2lsbCB0YWtlIGFsbCBjb250ZW50IG91dHNpZGUgb2YgXG5cdFx0Ly8gPCogYW5kICo+IGFuZCB3cmFwIGEgSG90LmVjaG8gYXJvdW5kIGl0LiBBbnkgSlMgZm91bmQgaW5zaWRlIG9mIHRoZSBcblx0XHQvLyA8KiBhbmQgKj4gd2lsbCBiZSBleGVjdXRlZCBhcyBpcy5cblx0XHRvdXRwdXQgPSBIb3RGaWxlLnByb2Nlc3NDb250ZW50ICh0aGlzQ29udGVudCwgXG5cdFx0XHRuZXcgUmVnRXhwIChcIig/PVxcXFw8XFxcXCopKFtcXFxcc1xcXFxTXSo/KSg/PVxcXFwqXFxcXD4pXCIsIFwiZ1wiKSwgXG5cdFx0XHQocmVnZXhGb3VuZDogc3RyaW5nKTogc3RyaW5nID0+XG5cdFx0XHR7XG5cdFx0XHRcdC8vIEEgbGl0dGxlIGhhY2ssIHNpbmNlIEkgc3VjayBhdCBSZWdleCA6KFxuXHRcdFx0XHRyZWdleEZvdW5kID0gcmVnZXhGb3VuZC5zdWJzdHIgKDIpO1xuXG5cdFx0XHRcdHJldHVybiAoYCR7cmVnZXhGb3VuZH1gKTtcblx0XHRcdH0sIFxuXHRcdFx0KG9mZkNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyA9PlxuXHRcdFx0e1xuXHRcdFx0XHRpZiAob2ZmQ29udGVudCA9PT0gXCJcIilcblx0XHRcdFx0XHRyZXR1cm4gKFwiXCIpO1xuXG5cdFx0XHRcdGxldCB0ZW1wT3V0cHV0OiBzdHJpbmcgPSBIb3RGaWxlLnByb2Nlc3NOZXN0ZWRDb250ZW50IChcblx0XHRcdFx0XHRvZmZDb250ZW50LCBcIiF7XCIsIFwifVwiLCBcIntcIiwgXG5cdFx0XHRcdFx0KHJlZ2V4Rm91bmQyOiBzdHJpbmcpOiBzdHJpbmcgPT5cblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRsZXQgb3V0OiBzdHJpbmcgPSBgKiYmJSolQCNAISR7cmVnZXhGb3VuZDJ9KiYhIyVAIUAqIWA7XG5cblx0XHRcdFx0XHRcdHJldHVybiAob3V0KTtcblx0XHRcdFx0XHR9LCBcblx0XHRcdFx0XHQob2ZmQ29udGVudDM6IHN0cmluZyk6IHN0cmluZyA9PlxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJldHVybiAob2ZmQ29udGVudDMpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRsZXQgdGVtcE91dHB1dDI6IHN0cmluZyA9IEhvdEZpbGUucHJvY2Vzc05lc3RlZENvbnRlbnQgKFxuXHRcdFx0XHRcdHRlbXBPdXRwdXQsIFwiU1RSe1wiLCBcIn1cIiwgXCJ7XCIsIFxuXHRcdFx0XHRcdChyZWdleEZvdW5kMjogc3RyaW5nKTogc3RyaW5nID0+XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0bGV0IG91dDogc3RyaW5nID0gXG5cdFx0XHRcdFx0XHRgKiYmJSolQCNAIWVjaG9PdXRwdXQgKEpTT04uc3RyaW5naWZ5KCR7cmVnZXhGb3VuZDJ9KSwgJHt0aGlzLnRocm93QWxsRXJyb3JzfSk7KiYhIyVAIUAqIWA7XG5cblx0XHRcdFx0XHRcdHJldHVybiAob3V0KTtcblx0XHRcdFx0XHR9LCBcblx0XHRcdFx0XHQob2ZmQ29udGVudDM6IHN0cmluZyk6IHN0cmluZyA9PlxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJldHVybiAob2ZmQ29udGVudDMpO1xuXHRcdFx0XHRcdH0sIDQsIDEpO1xuXHRcdFx0XHRsZXQgdGVtcE91dHB1dDM6IHN0cmluZyA9IEhvdEZpbGUucHJvY2Vzc05lc3RlZENvbnRlbnQgKFxuXHRcdFx0XHRcdHRlbXBPdXRwdXQyLCBcIiR7XCIsIFwifVwiLCBcIntcIiwgXG5cdFx0XHRcdFx0KHJlZ2V4Rm91bmQyOiBzdHJpbmcpOiBzdHJpbmcgPT5cblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRsZXQgb3V0OiBzdHJpbmcgPSBgKiYmJSolQCNAIXRyeSB7IEhvdC5lY2hvICgke3JlZ2V4Rm91bmQyfSk7IH1jYXRjaCAoZXgpe0hvdC5lY2hvIChcIlwiKTt9KiYhIyVAIUAqIWA7XG5cblx0XHRcdFx0XHRcdGlmICh0aGlzLnRocm93QWxsRXJyb3JzID09PSB0cnVlKVxuXHRcdFx0XHRcdFx0XHRvdXQgPSBgKiYmJSolQCNAIUhvdC5lY2hvICgke3JlZ2V4Rm91bmQyfSk7KiYhIyVAIUAqIWA7XG5cblx0XHRcdFx0XHRcdHJldHVybiAob3V0KTtcblx0XHRcdFx0XHR9LCBcblx0XHRcdFx0XHQob2ZmQ29udGVudDM6IHN0cmluZyk6IHN0cmluZyA9PlxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJldHVybiAob2ZmQ29udGVudDMpO1xuXHRcdFx0XHRcdFx0LypsZXQgZXNjYXBlZENvbnRlbnQ6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5IChvZmZDb250ZW50Myk7XG5cdFx0XHRcdFx0XHRsZXQgb3V0OiBzdHJpbmcgPSBgZWNob091dHB1dCAoJHtlc2NhcGVkQ29udGVudH0sICR7dGhpcy50aHJvd0FsbEVycm9yc30pO1xcbmA7XG5cblx0XHRcdFx0XHRcdHJldHVybiAob3V0KTsqL1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGxldCB0ZW1wT3V0cHV0NDogc3RyaW5nID0gXCJcIjtcblxuXHRcdFx0XHRpZiAoSG90Lk1vZGUgPT09IERldmVsb3Blck1vZGUuUHJvZHVjdGlvbilcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHRlbXBPdXRwdXQ0ID0gSG90RmlsZS5wcm9jZXNzTmVzdGVkQ29udGVudCAoXG5cdFx0XHRcdFx0XHR0ZW1wT3V0cHV0MywgXCI/KFwiLCBcIilcIiwgXCIoXCIsIFxuXHRcdFx0XHRcdFx0KHJlZ2V4Rm91bmQyOiBzdHJpbmcpOiBzdHJpbmcgPT5cblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIChcIlwiKTtcblx0XHRcdFx0XHRcdH0sIFxuXHRcdFx0XHRcdFx0KG9mZkNvbnRlbnQzOiBzdHJpbmcpOiBzdHJpbmcgPT5cblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIChvZmZDb250ZW50Myk7XG5cdFx0XHRcdFx0XHRcdC8qbGV0IG91dDogc3RyaW5nID0gYGVjaG9PdXRwdXQgKCR7b2ZmQ29udGVudDN9LCAke3RoaXMudGhyb3dBbGxFcnJvcnN9KTtcXG5gO1xuXG5cdFx0XHRcdFx0XHRcdHJldHVybiAob3V0KTsqL1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoSG90Lk1vZGUgPT09IERldmVsb3Blck1vZGUuRGV2ZWxvcG1lbnQpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0ZW1wT3V0cHV0NCA9IEhvdEZpbGUucHJvY2Vzc05lc3RlZENvbnRlbnQgKFxuXHRcdFx0XHRcdFx0dGVtcE91dHB1dDMsIFwiPyhcIiwgXCIpXCIsIFwiKFwiLCBcblx0XHRcdFx0XHRcdChyZWdleEZvdW5kMjogc3RyaW5nKTogc3RyaW5nID0+XG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGxldCBmb3VuZFN0cjogc3RyaW5nID0gXCJcIjtcblxuXHRcdFx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiBpdCBiZSBwYXJzZWQuIElmIHNvLCBzdHJpbmdpZnkgaXQuXG5cdFx0XHRcdFx0XHRcdFx0SlNPTi5wYXJzZSAocmVnZXhGb3VuZDIpO1xuXHRcdFx0XHRcdFx0XHRcdGZvdW5kU3RyID0gSlNPTi5zdHJpbmdpZnkgKHJlZ2V4Rm91bmQyKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRjYXRjaCAoZXgpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHQvLyBJZiB2YWxpZCBKU09OIGlzIG5vdCByZWNlaXZlZCwgZG9uJ3Qgd29ycnkgYWJvdXQgaXQsIHBhc3MgaXQgXG5cdFx0XHRcdFx0XHRcdFx0Ly8gYWxvbmcgdG8gdGhlIGZ1bmN0aW9uIGJlbG93IGZvciBpdCB0byBiZSBwYXJzZWQgaW4gdGhlIHBhZ2UuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gVGhlIGV4Y2VwdGlvbiBzaG91bGQgYmUgdGhyb3duIHRoZXJlIGluc3RlYWQuXG5cdFx0XHRcdFx0XHRcdFx0Zm91bmRTdHIgPSBgJHtyZWdleEZvdW5kMn1gO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0Ly8vIEBmaXhtZSBNYWtlIHRoaXMgYSBjYWxsYWJsZSBmdW5jdGlvbiBhbmQgcGFzcyBmb3VuZFN0ciwgZXRjLlxuXHRcdFx0XHRcdFx0XHRsZXQgb3V0OiBzdHJpbmcgPSBcbmAqJiYlKiVAI0Ahe1xuY29uc3QgdGVzdEVsbSA9IGNyZWF0ZVRlc3RFbGVtZW50ICgke2ZvdW5kU3RyfSk7XG5Ib3QuZWNobyAoXFxgZGF0YS10ZXN0LW9iamVjdC1uYW1lID0gXCJcXCR7dGVzdEVsbS5uYW1lfVwiIGRhdGEtdGVzdC1vYmplY3QtZnVuYyA9IFwiXFwke3Rlc3RFbG0uZnVuY31cIiBkYXRhLXRlc3Qtb2JqZWN0LXZhbHVlID0gXCJcXCR7dGVzdEVsbS52YWx1ZX1cIlxcYCk7XG59KiYhIyVAIUAqIVxcbmA7XG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIChvdXQpO1xuXHRcdFx0XHRcdFx0fSwgXG5cdFx0XHRcdFx0XHQob2ZmQ29udGVudDM6IHN0cmluZyk6IHN0cmluZyA9PlxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKG9mZkNvbnRlbnQzKTtcblx0XHRcdFx0XHRcdFx0LypsZXQgb3V0OiBzdHJpbmcgPSBgZWNob091dHB1dCAoJHtvZmZDb250ZW50M30sICR7dGhpcy50aHJvd0FsbEVycm9yc30pO1xcbmA7XG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIChvdXQpOyovXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCB0ZW1wT3V0cHV0NTogc3RyaW5nID0gSG90RmlsZS5wcm9jZXNzTmVzdGVkQ29udGVudCAoXG5cdFx0XHRcdFx0dGVtcE91dHB1dDQsIFwiKiYmJSolQCNAIVwiLCBcIiomISMlQCFAKiFcIiwgXCIqJiYlKiVAI0AhXCIsIFxuXHRcdFx0XHRcdChyZWdleEZvdW5kOiBzdHJpbmcpOiBzdHJpbmcgPT5cblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRyZXR1cm4gKHJlZ2V4Rm91bmQpO1xuXHRcdFx0XHRcdH0sIFxuXHRcdFx0XHRcdChvZmZDb250ZW50OiBzdHJpbmcpOiBzdHJpbmcgPT5cblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRsZXQgZXNjYXBlZENvbnRlbnQ6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5IChvZmZDb250ZW50KTtcblx0XHRcdFx0XHRcdGxldCBvdXQ6IHN0cmluZyA9IGBlY2hvT3V0cHV0ICgke2VzY2FwZWRDb250ZW50fSwgJHt0aGlzLnRocm93QWxsRXJyb3JzfSk7XFxuYDtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIChvdXQpO1xuXHRcdFx0XHRcdH0sIFxuXHRcdFx0XHRcdFwiKiYmJSolQCNAIVwiLmxlbmd0aCwgXCIqJiEjJUAhQCohXCIubGVuZ3RoKTtcblxuXHRcdFx0XHQvLy8gQGZpeG1lIFRlbXBvcmFyeSBoYWNrLiBUaGVzZSBkZWxpbWl0ZXJzIHNob3VsZCBiZSByZW1vdmVkIGZyb20gdGVtcE91dHB1dCB3aGVuIFxuXHRcdFx0XHQvLy8gZXhlY3V0aW5nIHByb2Nlc3NOZXN0ZWRDb250ZW50LlxuXHRcdFx0XHR0ZW1wT3V0cHV0NSA9IHRlbXBPdXRwdXQ1LnJlcGxhY2UgKC9cXCpcXCZcXCZcXCVcXCpcXCVcXEBcXCNcXEBcXCEvZywgXCJcIik7XG5cdFx0XHRcdHRlbXBPdXRwdXQ1ID0gdGVtcE91dHB1dDUucmVwbGFjZSAoL1xcKlxcJlxcIVxcI1xcJVxcQFxcIVxcQFxcKlxcIS9nLCBcIlwiKTtcblxuXHRcdFx0XHRyZXR1cm4gKHRlbXBPdXRwdXQ1KTtcblx0XHRcdH0sIDApO1xuXG5cdFx0Ly8gRXhlY3V0ZSB0aGUgYXNzZW1ibGVkIEpTIGZpbGUuXG5cdFx0bGV0IHJldHVybmVkT3V0cHV0OiBhbnkgPSBudWxsO1xuXG5cdFx0dHJ5XG5cdFx0e1xuXHRcdFx0bGV0IGV4ZWN1dGlvbkNvbnRlbnQ6IHN0cmluZyA9IGBcblx0XHRcdHZhciBIb3QgPSBhcmd1bWVudHNbMF07XG5cdFx0XHR2YXIgUGFzc2VkSG90RmlsZSA9IGFyZ3VtZW50c1sxXTtcblxuXHRcdFx0YDtcblxuXHRcdFx0aWYgKHR5cGVvZiAoYXJncykgPT09IFwic3RyaW5nXCIpXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvciAoYFRoZSBwYXNzaW5nIGFyZ3VtZW50cyBjYW5ub3QgYmUgYSBzdHJpbmchYCk7XG5cblx0XHRcdGZvciAobGV0IGtleSBpbiBhcmdzKVxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgbmV3VmFyOiBzdHJpbmcgPSBcIlwiO1xuXHRcdFx0XHRsZXQgbmV3VmFyVmFsdWU6IGFueSA9IGFyZ3Nba2V5XTtcblx0XHRcdFx0bGV0IG5ld1ZhclZhbHVlU3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSAobmV3VmFyVmFsdWUpO1xuXG5cdFx0XHRcdG5ld1ZhciA9IGB2YXIgJHtrZXl9ID0gJHtuZXdWYXJWYWx1ZVN0cn07XFxuYDtcblxuXHRcdFx0XHRleGVjdXRpb25Db250ZW50ICs9IG5ld1Zhcjtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGNvbnRlbnROYW1lOiBzdHJpbmcgPSB0aGlzLm5hbWU7XG5cblx0XHRcdGlmIChjb250ZW50TmFtZSA9PT0gXCJcIilcblx0XHRcdFx0Y29udGVudE5hbWUgPSB0aGlzLmxvY2FsRmlsZTtcblxuXHRcdFx0aWYgKGNvbnRlbnROYW1lID09PSBcIlwiKVxuXHRcdFx0XHRjb250ZW50TmFtZSA9IHRoaXMudXJsO1xuXG5cdFx0XHRleGVjdXRpb25Db250ZW50ICs9IGBcblxuXHRcdFx0ZnVuY3Rpb24gZWNob091dHB1dCAoY29udGVudCwgdGhyb3dFcnJvcnMpXG5cdFx0XHR7XG5cdFx0XHRcdGlmICh0aHJvd0Vycm9ycyA9PSBudWxsKVxuXHRcdFx0XHRcdHRocm93RXJyb3JzID0gdHJ1ZTtcblxuXHRcdFx0XHRpZiAodGhyb3dFcnJvcnMgPT09IHRydWUpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRIb3QuZWNobyAoY29udGVudCk7XG5cblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0cnlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdEhvdC5lY2hvIChjb250ZW50KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXRjaCAoZXgpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRIb3QuZWNobyAoXCJcIik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gY3JlYXRlVGVzdEVsZW1lbnQgKGZvdW5kU3RyKVxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgdGVzdEVsbSA9IG51bGw7XG5cblx0XHRcdFx0dHJ5XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRsZXQgb2JqID0gZm91bmRTdHI7XG5cblx0XHRcdFx0XHRpZiAodHlwZW9mIChmb3VuZFN0cikgPT09IFwic3RyaW5nXCIpXG5cdFx0XHRcdFx0XHRvYmogPSBKU09OLnBhcnNlIChmb3VuZFN0cik7XG5cblx0XHRcdFx0XHRpZiAodHlwZW9mIChvYmopID09PSBcInN0cmluZ1wiKVxuXHRcdFx0XHRcdFx0dGVzdEVsbSA9IG5ldyBIb3QuSG90VGVzdEVsZW1lbnQgKG9iaik7XG5cblx0XHRcdFx0XHRpZiAob2JqIGluc3RhbmNlb2YgQXJyYXkpXG5cdFx0XHRcdFx0XHR0ZXN0RWxtID0gbmV3IEhvdC5Ib3RUZXN0RWxlbWVudCAob2JqWzBdLCBvYmpbMV0sIG9ialsyXSk7XG5cblx0XHRcdFx0XHRpZiAob2JqW1wibmFtZVwiXSAhPSBudWxsKVxuXHRcdFx0XHRcdFx0dGVzdEVsbSA9IG5ldyBIb3QuSG90VGVzdEVsZW1lbnQgKG9iaik7XG5cblx0XHRcdFx0XHRpZiAoSG90LkN1cnJlbnRQYWdlLnRlc3RFbGVtZW50c1t0ZXN0RWxtLm5hbWVdICE9IG51bGwpXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IgKFxcYFRlc3QgZWxlbWVudCBcXCR7dGVzdEVsbS5uYW1lfSBhbHJlYWR5IGV4aXN0cyFcXGApO1xuXG5cdFx0XHRcdFx0SG90LkN1cnJlbnRQYWdlLmFkZFRlc3RFbGVtZW50ICh0ZXN0RWxtKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXRjaCAoZXgpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IgKFxuXHRcdFx0XFxgRXJyb3IgcHJvY2Vzc2luZyB0ZXN0IGVsZW1lbnQgXFwke2ZvdW5kU3RyfSBpbiBcXCR7SG90LkN1cnJlbnRQYWdlLm5hbWV9LiBFcnJvcjogXFwke2V4Lm1lc3NhZ2V9XFxgXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICh0ZXN0RWxtKTtcblx0XHRcdH1cblxuXHRcdFx0YXN5bmMgZnVuY3Rpb24gcnVuQ29udGVudCAoQ3VycmVudEhvdEZpbGUpXG5cdFx0XHR7XFxuYDtcblx0XHRcdGV4ZWN1dGlvbkNvbnRlbnQgKz0gb3V0cHV0O1xuXHRcdFx0ZXhlY3V0aW9uQ29udGVudCArPSBgXG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAocnVuQ29udGVudCAoUGFzc2VkSG90RmlsZSkudGhlbiAoKCkgPT5cblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuICh7XG5cdFx0XHRcdFx0XHRob3Q6IEhvdCxcblx0XHRcdFx0XHRcdG91dHB1dDogSG90Lk91dHB1dCxcblx0XHRcdFx0XHRcdGRhdGE6IEpTT04uc3RyaW5naWZ5IChIb3QuRGF0YSlcblx0XHRcdFx0XHR9KTtcblx0XHRcdH0pKTtgO1xuXG5cdFx0XHQvLy8gQGZpeG1lIFByaW9yIHRvIGV4ZWN1dGlvbiBjb21waWxlIGFueSBUeXBlU2NyaXB0IGFuZCBtYWtlIGl0IEVTNSBjb21wYXRpYmxlLlxuXHRcdFx0bGV0IGZ1bmM6IEZ1bmN0aW9uID0gbmV3IEZ1bmN0aW9uIChleGVjdXRpb25Db250ZW50KTtcblx0XHRcdHJldHVybmVkT3V0cHV0ID0gYXdhaXQgZnVuYy5hcHBseSAodGhpcywgW0hvdCwgdGhpc10pO1xuXHRcdH1cblx0XHRjYXRjaCAoZXgpXG5cdFx0e1xuXHRcdFx0aWYgKGV4IGluc3RhbmNlb2YgU3ludGF4RXJyb3IpXG5cdFx0XHR7XG5cdFx0XHRcdC8vLyBAZml4bWUgUHV0IHdoYXQncyBpbiB0aGUgY29udGVudCB2YXJpYWJsZSBpbnRvIGEgcHJldiBjb250ZW50IHZhcmlhYmxlP1xuXHRcdFx0XHQvLy8gVGhlbiBvbmNlIHRoZXJlJ3Mgbm8gbG9uZ2VyIGFueSBzeW50YXggZXJyb3JzIGJlaW5nIHRocm93biwgZXhlY3V0ZSB0aGUgXG5cdFx0XHRcdC8vLyBjb2RlPyBUaGlzIHdvdWxkIGFsc28gcmVxdWlyZSBzYXZpbmcgYW55IEhUTUwgb3V0c2lkZSBvZiB0aGUgKj4gYW5kIDwqIFxuXHRcdFx0XHQvLy8gdGhlbiBlY2hvaW5nIGl0IG91dC4gVGhlIHRocm93IGJlbG93IHdvdWxkIGhhdmUgdG8gYmUgcmVtb3ZlZCBhcyB3ZWxsLlxuXHRcdFx0XHR0aHJvdyBleDtcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdFx0dGhyb3cgZXg7XG5cdFx0fVxuXG5cdFx0SG90LkRhdGEgPSByZXR1cm5lZE91dHB1dC5ob3QuRGF0YTtcblx0XHRsZXQgZmluYWxPdXRwdXQ6IHN0cmluZyA9IHJldHVybmVkT3V0cHV0Lm91dHB1dDtcblx0XHRIb3QuT3V0cHV0ID0gXCJcIjtcblxuXHRcdHJldHVybiAoZmluYWxPdXRwdXQpO1xuXHR9XG59IiwiLyoqXG4gKiBUaGUgbG9nZ2luZyBsZXZlbC5cbiAqL1xuZXhwb3J0IGVudW0gSG90TG9nTGV2ZWxcbntcblx0LyoqXG5cdCAqIFByaW50cyBvbmx5IGluZm8gbWVzc2FnZXMuXG5cdCAqL1xuXHRJbmZvLFxuXHQvKipcblx0ICogUHJpbnRzIG9ubHkgd2FybmluZyBtZXNzYWdlcy5cblx0ICovXG5cdFdhcm5pbmcsXG5cdC8qKlxuXHQgKiBQcmludHMgb25seSBlcnJvciBtZXNzYWdlcy5cblx0ICovXG5cdEVycm9yLFxuXHQvKipcblx0ICogUHJpbnRzIGFsbCBtZXNzYWdlcy5cblx0ICovXG5cdFZlcmJvc2UsXG5cdC8qKlxuXHQgKiBQcmludHMgYWxsIG1lc3NhZ2VzLCBleGNlcHQgdmVyYm9zZS5cblx0ICovXG5cdEFsbCxcblx0LyoqXG5cdCAqIERvZXNuJ3QgcHJpbnQgYW55IG1lc3NhZ2UuXG5cdCAqL1xuXHROb25lXG59XG5cbi8qKlxuICogVGhlIGxvZ2dlci5cbiAqL1xuZXhwb3J0IGNsYXNzIEhvdExvZ1xue1xuXHQvKipcblx0ICogVGhlIGxvZ2dpbmcgbGV2ZWwuXG5cdCAqL1xuXHRsb2dMZXZlbDogSG90TG9nTGV2ZWw7XG5cblx0Y29uc3RydWN0b3IgKGxvZ0xldmVsOiBIb3RMb2dMZXZlbCA9IEhvdExvZ0xldmVsLkFsbClcblx0e1xuXHRcdHRoaXMubG9nTGV2ZWwgPSBsb2dMZXZlbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBMb2cgYSBtZXNzYWdlLlxuXHQgKi9cblx0bG9nIChsZXZlbDogSG90TG9nTGV2ZWwsIG1lc3NhZ2U6IHN0cmluZylcblx0e1xuXHRcdGlmICh0aGlzLmxvZ0xldmVsID09PSBIb3RMb2dMZXZlbC5WZXJib3NlKVxuXHRcdHtcblx0XHRcdGlmIChsZXZlbCA9PT0gSG90TG9nTGV2ZWwuRXJyb3IpXG5cdFx0XHRcdHRoaXMuZXJyb3IgKG1lc3NhZ2UpO1xuXG5cdFx0XHRpZiAobGV2ZWwgPT09IEhvdExvZ0xldmVsLldhcm5pbmcpXG5cdFx0XHRcdHRoaXMud2FybmluZyAobWVzc2FnZSk7XG5cblx0XHRcdGlmICgobGV2ZWwgPT09IEhvdExvZ0xldmVsLkluZm8pIHx8IFxuXHRcdFx0XHQobGV2ZWwgPT09IEhvdExvZ0xldmVsLlZlcmJvc2UpKVxuXHRcdFx0e1xuXHRcdFx0XHR0aGlzLmluZm8gKG1lc3NhZ2UpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0aGlzLmxvZ0xldmVsID09PSBIb3RMb2dMZXZlbC5BbGwpXG5cdFx0e1xuXHRcdFx0aWYgKGxldmVsID09PSBIb3RMb2dMZXZlbC5FcnJvcilcblx0XHRcdFx0dGhpcy5lcnJvciAobWVzc2FnZSk7XG5cblx0XHRcdGlmIChsZXZlbCA9PT0gSG90TG9nTGV2ZWwuV2FybmluZylcblx0XHRcdFx0dGhpcy53YXJuaW5nIChtZXNzYWdlKTtcblxuXHRcdFx0aWYgKGxldmVsID09PSBIb3RMb2dMZXZlbC5JbmZvKVxuXHRcdFx0XHR0aGlzLmluZm8gKG1lc3NhZ2UpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmxvZ0xldmVsID09PSBIb3RMb2dMZXZlbC5FcnJvcilcblx0XHR7XG5cdFx0XHRpZiAobGV2ZWwgPT09IEhvdExvZ0xldmVsLkVycm9yKVxuXHRcdFx0XHR0aGlzLmVycm9yIChtZXNzYWdlKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5sb2dMZXZlbCA9PT0gSG90TG9nTGV2ZWwuV2FybmluZylcblx0XHR7XG5cdFx0XHRpZiAobGV2ZWwgPT09IEhvdExvZ0xldmVsLldhcm5pbmcpXG5cdFx0XHRcdHRoaXMud2FybmluZyAobWVzc2FnZSk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMubG9nTGV2ZWwgPT09IEhvdExvZ0xldmVsLkluZm8pXG5cdFx0e1xuXHRcdFx0aWYgKGxldmVsID09PSBIb3RMb2dMZXZlbC5JbmZvKVxuXHRcdFx0XHR0aGlzLmluZm8gKG1lc3NhZ2UpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBMb2cgYSB2ZXJib3NlIG1lc3NhZ2UuXG5cdCAqL1xuXHR2ZXJib3NlIChtZXNzYWdlOiBzdHJpbmcpXG5cdHtcblx0XHRpZiAodGhpcy5sb2dMZXZlbCA9PT0gSG90TG9nTGV2ZWwuVmVyYm9zZSlcblx0XHRcdGNvbnNvbGUuaW5mbyAobWVzc2FnZSk7XG5cdH1cblxuXHQvKipcblx0ICogTG9nIGEgbWVzc2FnZS5cblx0ICovXG5cdGluZm8gKG1lc3NhZ2U6IHN0cmluZylcblx0e1xuXHRcdGlmICgodGhpcy5sb2dMZXZlbCA9PT0gSG90TG9nTGV2ZWwuQWxsKSB8fCBcblx0XHRcdCh0aGlzLmxvZ0xldmVsID09PSBIb3RMb2dMZXZlbC5WZXJib3NlKSB8fCBcblx0XHRcdCh0aGlzLmxvZ0xldmVsID09PSBIb3RMb2dMZXZlbC5JbmZvKSlcblx0XHR7XG5cdFx0XHRjb25zb2xlLmluZm8gKG1lc3NhZ2UpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBMb2cgYSB3YXJuaW5nLlxuXHQgKi9cblx0d2FybmluZyAobWVzc2FnZTogc3RyaW5nKVxuXHR7XG5cdFx0aWYgKCh0aGlzLmxvZ0xldmVsID09PSBIb3RMb2dMZXZlbC5BbGwpIHx8IFxuXHRcdFx0KHRoaXMubG9nTGV2ZWwgPT09IEhvdExvZ0xldmVsLlZlcmJvc2UpIHx8IFxuXHRcdFx0KHRoaXMubG9nTGV2ZWwgPT09IEhvdExvZ0xldmVsLldhcm5pbmcpKVxuXHRcdHtcblx0XHRcdGNvbnNvbGUud2FybiAobWVzc2FnZSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIExvZyBhbiBlcnJvciBtZXNzYWdlLlxuXHQgKi9cblx0ZXJyb3IgKG1lc3NhZ2U6IHN0cmluZyB8IEVycm9yKVxuXHR7XG5cdFx0aWYgKCh0aGlzLmxvZ0xldmVsID09PSBIb3RMb2dMZXZlbC5BbGwpIHx8IFxuXHRcdFx0KHRoaXMubG9nTGV2ZWwgPT09IEhvdExvZ0xldmVsLlZlcmJvc2UpIHx8IFxuXHRcdFx0KHRoaXMubG9nTGV2ZWwgPT09IEhvdExvZ0xldmVsLkVycm9yKSlcblx0XHR7XG5cdFx0XHRsZXQgbXNnOiBzdHJpbmcgPSBcIlwiO1xuXG5cdFx0XHRpZiAodHlwZW9mIChtZXNzYWdlKSA9PT0gXCJzdHJpbmdcIilcblx0XHRcdFx0bXNnID0gbWVzc2FnZTtcblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0aWYgKG1lc3NhZ2UubWVzc2FnZSAhPSBudWxsKVxuXHRcdFx0XHRcdG1zZyA9IG1lc3NhZ2UubWVzc2FnZTtcblxuXHRcdFx0XHRpZiAobWVzc2FnZS5zdGFjayAhPSBudWxsKVxuXHRcdFx0XHRcdG1zZyA9IG1lc3NhZ2Uuc3RhY2s7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnNvbGUuZXJyb3IgKG1zZyk7XG5cdFx0fVxuXHR9XG59IiwiaW1wb3J0IHsgSG90IH0gZnJvbSBcIi4vSG90XCI7XG5pbXBvcnQgeyBIb3RGaWxlIH0gZnJvbSBcIi4vSG90RmlsZVwiO1xuaW1wb3J0IHsgSG90U3RhcSB9IGZyb20gXCIuL0hvdFN0YXFcIjtcbmltcG9ydCB7IEhvdEFQSSB9IGZyb20gXCIuL0hvdEFQSVwiO1xuaW1wb3J0IHsgSG90VGVzdEVsZW1lbnQgfSBmcm9tIFwiLi9Ib3RUZXN0RWxlbWVudFwiO1xuaW1wb3J0IHsgSG90VGVzdE1hcCwgSG90VGVzdFBhdGggfSBmcm9tIFwiLi9Ib3RUZXN0TWFwXCI7XG5cbi8qKlxuICogQSBwYWdlIHRvIHByZXByb2Nlc3MuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUhvdFBhZ2Vcbntcblx0LyoqXG5cdCAqIFRoZSBwcm9jZXNzb3IgdG8gdXNlLlxuXHQgKi9cblx0cHJvY2Vzc29yOiBIb3RTdGFxO1xuXHQvKipcblx0ICogVGhlIG5hbWUgb2YgdGhlIHBhZ2UuXG5cdCAqL1xuXHRuYW1lPzogc3RyaW5nO1xuXHQvKipcblx0ICogVGhlIHJvdXRlIHVzZWQgdG8gZ2V0IHRvIHRoaXMgcGFnZS5cblx0ICovXG5cdHJvdXRlPzogc3RyaW5nO1xuXHQvKipcblx0ICogVGhlIG5hbWUgb2YgdGhlIHBhZ2UuIEZpbGUgb3JkZXJpbmcgbWF0dGVycyBoZXJlLlxuXHQgKiBFdmVyeSBmaWxlIGlzIHByb2Nlc3NlZCBpbmNyZW1lbnRhbGx5LlxuXHQgKi9cblx0ZmlsZXM/OiBIb3RGaWxlW107XG5cdC8qKlxuXHQgKiBUaGUgYXNzb2NpYXRlZCB0ZXN0ZXIgbmFtZS5cblx0ICovXG5cdHRlc3Rlck5hbWU/OiBzdHJpbmc7XG5cdC8qKlxuXHQgKiBUaGUgYXNzb2NpYXRlZCB0ZXN0ZXIgbWFwLlxuXHQgKi9cblx0dGVzdGVyTWFwPzogc3RyaW5nO1xuXHQvKipcblx0ICogVGhlIGVsZW1lbnRzIHRvIHRlc3Qgb24gdGhpcyBwYWdlLlxuXHQgKi9cblx0dGVzdEVsZW1lbnRzPzogeyBbbmFtZTogc3RyaW5nXTogSG90VGVzdEVsZW1lbnQ7IH07XG5cdC8qKlxuXHQgKiBUaGUgdGVzdCBwYXRocyB0byB0ZXN0IG9uIHRoaXMgcGFnZS5cblx0ICovXG5cdHRlc3RQYXRocz86IHsgW25hbWU6IHN0cmluZ106IEhvdFRlc3RQYXRoOyB9O1xufVxuXG4vKipcbiAqIEEgcGFnZSB0byBwcmVwcm9jZXNzLlxuICovXG5leHBvcnQgY2xhc3MgSG90UGFnZSBpbXBsZW1lbnRzIElIb3RQYWdlXG57XG5cdC8qKlxuXHQgKiBUaGUgcHJvY2Vzc29yIHRvIHVzZS5cblx0ICovXG5cdHByb2Nlc3NvcjogSG90U3RhcTtcblx0LyoqXG5cdCAqIFRoZSBuYW1lIG9mIHRoZSBwYWdlLlxuXHQgKi9cblx0bmFtZTogc3RyaW5nO1xuXHQvKipcblx0ICogVGhlIHJvdXRlIHVzZWQgdG8gZ2V0IHRvIHRoaXMgcGFnZS5cblx0ICovXG5cdHJvdXRlOiBzdHJpbmc7XG5cdC8qKlxuXHQgKiBUaGUgbmFtZSBvZiB0aGUgcGFnZS4gRmlsZSBvcmRlcmluZyBtYXR0ZXJzIGhlcmUuXG5cdCAqIEV2ZXJ5IGZpbGUgaXMgcHJvY2Vzc2VkIGluY3JlbWVudGFsbHkuXG5cdCAqL1xuXHRmaWxlczogSG90RmlsZVtdO1xuXHQvKipcblx0ICogVGhlIGFzc29jaWF0ZWQgdGVzdGVyIG5hbWUuXG5cdCAqL1xuXHR0ZXN0ZXJOYW1lOiBzdHJpbmc7XG5cdC8qKlxuXHQgKiBUaGUgYXNzb2NpYXRlZCB0ZXN0ZXIgbWFwLlxuXHQgKi9cblx0dGVzdGVyTWFwOiBzdHJpbmc7XG5cdC8qKlxuXHQgKiBUaGUgZWxlbWVudHMgdG8gdGVzdCBvbiB0aGlzIHBhZ2UuXG5cdCAqL1xuXHR0ZXN0RWxlbWVudHM6IHsgW25hbWU6IHN0cmluZ106IEhvdFRlc3RFbGVtZW50OyB9O1xuXHQvKipcblx0ICogVGhlIHRlc3QgcGF0aHMgdG8gdGVzdCBvbiB0aGlzIHBhZ2UuXG5cdCAqL1xuXHR0ZXN0UGF0aHM6IHsgW25hbWU6IHN0cmluZ106IEhvdFRlc3RQYXRoOyB9O1xuXG5cdGNvbnN0cnVjdG9yIChjb3B5OiBJSG90UGFnZSB8IEhvdFN0YXEpXG5cdHtcblx0XHRpZiAoY29weSBpbnN0YW5jZW9mIEhvdFN0YXEpXG5cdFx0e1xuXHRcdFx0dGhpcy5wcm9jZXNzb3IgPSBjb3B5O1xuXHRcdFx0dGhpcy5uYW1lID0gXCJcIjtcblx0XHRcdHRoaXMudGVzdGVyTmFtZSA9IFwiXCI7XG5cdFx0XHR0aGlzLnRlc3Rlck1hcCA9IFwiXCI7XG5cdFx0XHR0aGlzLnJvdXRlID0gXCJcIjtcblx0XHRcdHRoaXMuZmlsZXMgPSBbXTtcblx0XHRcdHRoaXMudGVzdEVsZW1lbnRzID0ge307XG5cdFx0XHR0aGlzLnRlc3RQYXRocyA9IHt9O1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0dGhpcy5wcm9jZXNzb3IgPSBjb3B5LnByb2Nlc3Nvcjtcblx0XHRcdHRoaXMubmFtZSA9IGNvcHkubmFtZSB8fCBcIlwiO1xuXHRcdFx0dGhpcy50ZXN0ZXJOYW1lID0gY29weS50ZXN0ZXJOYW1lIHx8IFwiXCI7XG5cdFx0XHR0aGlzLnRlc3Rlck1hcCA9IGNvcHkudGVzdGVyTWFwIHx8IFwiXCI7XG5cdFx0XHR0aGlzLnJvdXRlID0gY29weS5yb3V0ZSB8fCBcIlwiO1xuXHRcdFx0dGhpcy5maWxlcyA9IGNvcHkuZmlsZXMgfHwgW107XG5cdFx0XHR0aGlzLnRlc3RFbGVtZW50cyA9IGNvcHkudGVzdEVsZW1lbnRzIHx8IHt9O1xuXHRcdFx0dGhpcy50ZXN0UGF0aHMgPSBjb3B5LnRlc3RQYXRocyB8fCB7fTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQWRkIGEgZmlsZSB0byBwcm9jZXNzLiBJdCdzIHJlY29tbWVuZCB0byBsb2FkIHRoZSBmaWxlIHByaW9yIHRvIFxuXHQgKiBhZGRpbmcgaXQgdG8gYSBwYWdlIGlmIGl0J3MgYWJvdXQgdG8gYmUgdXNlZC5cblx0ICovXG5cdGFzeW5jIGFkZEZpbGUgKGZpbGU6IEhvdEZpbGUpOiBQcm9taXNlPHZvaWQ+XG5cdHtcblx0XHRmaWxlLnBhZ2UgPSB0aGlzO1xuXG5cdFx0dGhpcy5maWxlcy5wdXNoIChmaWxlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgdGhlIEFQSSBhc3NvY2lhdGVkIHdpdGggdGhpcyBwYWdlLlxuXHQgKi9cblx0Z2V0QVBJICgpOiBIb3RBUElcblx0e1xuXHRcdHJldHVybiAodGhpcy5wcm9jZXNzb3IuYXBpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgdGhlIHRlc3RlciBBUEkgYXNzb2NpYXRlZCB3aXRoIHRoaXMgcGFnZS5cblx0ICovXG5cdGdldFRlc3RlckFQSSAoKTogSG90QVBJXG5cdHtcblx0XHRyZXR1cm4gKHRoaXMucHJvY2Vzc29yLnRlc3RlckFQSSk7XG5cdH1cblxuXHQvKipcblx0ICogQWRkIGFsbCBmaWxlcyBpbiB0aGUgcGFnZS4gQ291bGQgZGVjcmVhc2UgcGFnZSBsb2FkaW5nIHBlcmZvcm1hbmNlLlxuXHQgKiBJdCdzIHJlY29tbWVuZCB0byBsb2FkIHRoZSBmaWxlIHByaW9yIHRvIGFkZGluZyBpdCB0byBhIHBhZ2UuXG5cdCAqL1xuXHRhc3luYyBsb2FkIChmaWxlOiBIb3RGaWxlKTogUHJvbWlzZTx2b2lkPlxuXHR7XG5cdFx0Zm9yIChsZXQgaUlkeCA9IDA7IGlJZHggPCB0aGlzLmZpbGVzLmxlbmd0aDsgaUlkeCsrKVxuXHRcdHtcblx0XHRcdGxldCBmaWxlOiBIb3RGaWxlID0gdGhpcy5maWxlc1tpSWR4XTtcblxuXHRcdFx0YXdhaXQgZmlsZS5sb2FkICgpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBQcm9jZXNzIGEgcGFnZSBhbmQgZ2V0IHRoZSByZXN1bHQuXG5cdCAqL1xuXHRhc3luYyBwcm9jZXNzIChhcmdzOiBhbnkgPSBudWxsKTogUHJvbWlzZTxzdHJpbmc+XG5cdHtcblx0XHRsZXQgb3V0cHV0OiBzdHJpbmcgPSBcIlwiO1xuXG5cdFx0Zm9yIChsZXQgaUlkeCA9IDA7IGlJZHggPCB0aGlzLmZpbGVzLmxlbmd0aDsgaUlkeCsrKVxuXHRcdHtcblx0XHRcdGxldCBmaWxlOiBIb3RGaWxlID0gdGhpcy5maWxlc1tpSWR4XTtcblxuXHRcdFx0SG90Lk91dHB1dCA9IFwiXCI7XG5cdFx0XHRmaWxlLnBhZ2UgPSB0aGlzO1xuXG5cdFx0XHRvdXRwdXQgKz0gYXdhaXQgZmlsZS5wcm9jZXNzIChhcmdzKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gKG91dHB1dCk7XG5cdH1cblxuXHQvKipcblx0ICogQWRkIGEgdGVzdCBlbGVtZW50LlxuXHQgKi9cblx0YWRkVGVzdEVsZW1lbnQgKGVsbTogSG90VGVzdEVsZW1lbnQpOiB2b2lkXG5cdHtcblx0XHRpZiAodGhpcy50ZXN0RWxlbWVudHNbZWxtLm5hbWVdICE9IG51bGwpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IgKGBUZXN0IGVsZW1lbnQgJHtlbG0ubmFtZX0gYWxyZWFkeSBleGlzdHMhYCk7XG5cblx0XHR0aGlzLnRlc3RFbGVtZW50c1tlbG0ubmFtZV0gPSBlbG07XG5cdH1cblxuXHQvKipcblx0ICogR2V0IGEgdGVzdCBlbGVtZW50LlxuXHQgKi9cblx0Z2V0VGVzdEVsZW1lbnQgKG5hbWU6IHN0cmluZyk6IEhvdFRlc3RFbGVtZW50XG5cdHtcblx0XHRpZiAodGhpcy50ZXN0RWxlbWVudHNbbmFtZV0gPT0gbnVsbClcblx0XHRcdHRocm93IG5ldyBFcnJvciAoYFRlc3QgZWxlbWVudCAke25hbWV9IGRvZXN0IG5vdCBleGlzdCFgKTtcblxuXHRcdHJldHVybiAodGhpcy50ZXN0RWxlbWVudHNbbmFtZV0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIHRlc3QgcGF0aC5cblx0ICovXG5cdGNyZWF0ZVRlc3RQYXRoIChwYXRoTmFtZTogc3RyaW5nLCBkcml2ZXJGdW5jOiBIb3RUZXN0UGF0aCk6IHZvaWRcblx0e1xuXHRcdGlmICh0aGlzLnRlc3RQYXRoc1twYXRoTmFtZV0gIT0gbnVsbClcblx0XHRcdHRocm93IG5ldyBFcnJvciAoYFRlc3QgcGF0aCAke3BhdGhOYW1lfSBhbHJlYWR5IGV4aXN0cyFgKTtcblxuXHRcdHRoaXMudGVzdFBhdGhzW3BhdGhOYW1lXSA9IGRyaXZlckZ1bmM7XG5cdH1cbn0iLCJpbXBvcnQgeyBIb3RTZXJ2ZXIgfSBmcm9tIFwiLi9Ib3RTZXJ2ZXJcIjtcbmltcG9ydCB7IEhvdFJvdXRlTWV0aG9kLCBIVFRQTWV0aG9kLCBTZXJ2ZXJFeGVjdXRpb25GdW5jdGlvbiwgVGVzdENhc2VGdW5jdGlvbiwgVGVzdENhc2VPYmplY3QgfSBmcm9tIFwiLi9Ib3RSb3V0ZU1ldGhvZFwiO1xuaW1wb3J0IHsgSG90Q2xpZW50IH0gZnJvbSBcIi4vSG90Q2xpZW50XCI7XG5pbXBvcnQgeyBIb3RMb2cgfSBmcm9tIFwiLi9Ib3RMb2dcIjtcblxuLyoqXG4gKiBUaGUgcm91dGUgdG8gdXNlLlxuICovXG5leHBvcnQgY2xhc3MgSG90Um91dGVcbntcblx0LyoqXG5cdCAqIFRoZSBzZXJ2ZXIgdGhhdCBtYWludGFpbnMgdGhlIGNvbm5lY3Rpb25zLlxuXHQgKi9cblx0Y29ubmVjdGlvbjogSG90U2VydmVyIHwgSG90Q2xpZW50O1xuXHQvKipcblx0ICogVGhlIGFzc29jaWF0ZWQgbG9nZ2VyLlxuXHQgKi9cblx0bG9nZ2VyOiBIb3RMb2c7XG5cdC8qKlxuXHQgKiBUaGUgcm91dGUuXG5cdCAqL1xuXHRyb3V0ZTogc3RyaW5nO1xuXHQvKipcblx0ICogVGhlIHZlcnNpb24uXG5cdCAqL1xuXHR2ZXJzaW9uOiBzdHJpbmc7XG5cdC8qKlxuXHQgKiBUaGUgcHJlZml4IHRvIGFkZCB0byB0aGUgYmVnaW5uaW5nIG9mIGVhY2ggcm91dGUgbWV0aG9kLlxuXHQgKi9cblx0cHJlZml4OiBzdHJpbmc7XG5cdC8qKlxuXHQgKiBUaGUgYXV0aG9yaXphdGlvbiBjcmVkZW50aWFscyB0byBiZSB1c2VkIGJ5IHRoZSBjbGllbnQgXG5cdCAqIHdoZW4gY29ubmVjdGluZyB0byB0aGUgc2VydmVyLlxuXHQgKi9cblx0YXV0aENyZWRlbnRpYWxzOiBhbnk7XG5cdC8qKlxuXHQgKiBUaGUgY2FsbHMgdGhhdCBjYW4gYmUgbWFkZS5cblx0ICovXG5cdG1ldGhvZHM6IEhvdFJvdXRlTWV0aG9kW107XG5cdC8qKlxuXHQgKiBUaGUgZXJyb3JzIGFuZCB0aGVpciBKU09OIHRoYXQgY2FuIGJlIHRocm93bi4gQ2FuIGJlOlxuXHQgKiAqIG5vdF9hdXRob3JpemVkXG5cdCAqL1xuXHRlcnJvcnM6IHsgW2Vycm9yOiBzdHJpbmddOiBhbnkgfTtcblxuXHRjb25zdHJ1Y3RvciAoY29ubmVjdGlvbjogSG90U2VydmVyIHwgSG90Q2xpZW50LCByb3V0ZTogc3RyaW5nLCBtZXRob2RzOiBIb3RSb3V0ZU1ldGhvZFtdID0gW10pXG5cdHtcblx0XHR0aGlzLmNvbm5lY3Rpb24gPSBjb25uZWN0aW9uO1xuXHRcdHRoaXMubG9nZ2VyID0gbnVsbDtcblxuXHRcdGlmICh0aGlzLmNvbm5lY3Rpb24gIT0gbnVsbClcblx0XHR7XG5cdFx0XHRpZiAodGhpcy5jb25uZWN0aW9uLnByb2Nlc3NvciAhPSBudWxsKVxuXHRcdFx0XHR0aGlzLmxvZ2dlciA9IHRoaXMuY29ubmVjdGlvbi5wcm9jZXNzb3IubG9nZ2VyO1xuXHRcdH1cblxuXHRcdHRoaXMucm91dGUgPSByb3V0ZTtcblx0XHR0aGlzLnZlcnNpb24gPSBcInYxXCI7XG5cdFx0dGhpcy5wcmVmaXggPSBcIlwiO1xuXHRcdHRoaXMuYXV0aENyZWRlbnRpYWxzID0gbnVsbDtcblx0XHR0aGlzLm1ldGhvZHMgPSBtZXRob2RzO1xuXHRcdHRoaXMuZXJyb3JzID0ge1xuXHRcdFx0XHRcIm5vdF9hdXRob3JpemVkXCI6IEhvdFJvdXRlLmNyZWF0ZUVycm9yIChcIk5vdCBhdXRob3JpemVkLlwiKVxuXHRcdFx0fTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYW4gZXJyb3IgSlNPTiBvYmplY3QuXG5cdCAqL1xuXHRzdGF0aWMgY3JlYXRlRXJyb3IgKG1lc3NhZ2U6IHN0cmluZyk6IGFueVxuXHR7XG5cdFx0cmV0dXJuICh7IGVycm9yOiBtZXNzYWdlIH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZCBhbiBBUEkgbWV0aG9kIHRvIHRoaXMgcm91dGUuXG5cdCAqIFxuXHQgKiBAcGFyYW0gbWV0aG9kIFRoZSBuYW1lIG9mIHRoZSBtZXRob2QgdG8gYWRkLiBJZiBhIEhvdFJvdXRlTWV0aG9kIGlzIHN1cHBsaWVkLCB0aGUgXG5cdCAqIHJlc3Qgb2YgdGhlIGFyZ3VtZW50cyBzdXBwbGllZCB3aWxsIGJlIGlnbm9yZWQuXG5cdCAqL1xuXHRhZGRNZXRob2QgKFxuXHRcdG1ldGhvZDogSG90Um91dGVNZXRob2QgfCBzdHJpbmcsXG5cdFx0ZXhlY3V0ZUZ1bmN0aW9uOiBTZXJ2ZXJFeGVjdXRpb25GdW5jdGlvbiA9IG51bGwsXG5cdFx0dHlwZTogSFRUUE1ldGhvZCA9IEhUVFBNZXRob2QuUE9TVCxcblx0XHR0ZXN0Q2FzZXM6IChzdHJpbmcgfCBUZXN0Q2FzZUZ1bmN0aW9uKVtdIHwgVGVzdENhc2VGdW5jdGlvbltdIHwgVGVzdENhc2VPYmplY3RbXSA9IG51bGxcblx0XHQpOiB2b2lkXG5cdHtcblx0XHRpZiAodHlwZW9mIChtZXRob2QpID09PSBcInN0cmluZ1wiKVxuXHRcdFx0bWV0aG9kID0gbmV3IEhvdFJvdXRlTWV0aG9kICh0aGlzLCBtZXRob2QsIGV4ZWN1dGVGdW5jdGlvbiwgdHlwZSwgbnVsbCwgbnVsbCwgbnVsbCwgdGVzdENhc2VzKTtcblxuXHRcdHRoaXMubWV0aG9kcy5wdXNoIChtZXRob2QpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCBhIG1ldGhvZCBieSBpdCdzIG5hbWUuXG5cdCAqL1xuXHRnZXRNZXRob2QgKG5hbWU6IHN0cmluZyk6IEhvdFJvdXRlTWV0aG9kXG5cdHtcblx0XHRsZXQgZm91bmRNZXRob2Q6IEhvdFJvdXRlTWV0aG9kID0gbnVsbDtcblxuXHRcdGZvciAobGV0IGlJZHggPSAwOyBpSWR4IDwgdGhpcy5tZXRob2RzLmxlbmd0aDsgaUlkeCsrKVxuXHRcdHtcblx0XHRcdGxldCBtZXRob2Q6IEhvdFJvdXRlTWV0aG9kID0gdGhpcy5tZXRob2RzW2lJZHhdO1xuXG5cdFx0XHRpZiAobWV0aG9kLm5hbWUgPT09IG5hbWUpXG5cdFx0XHR7XG5cdFx0XHRcdGZvdW5kTWV0aG9kID0gbWV0aG9kO1xuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiAoZm91bmRNZXRob2QpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEV4ZWN1dGVzIGJlZm9yZSBhbGwgcm91dGVzIGhhdmUgYmVlbiByZWdpc3RlcmVkLlxuXHQgKi9cblx0b25QcmVSZWdpc3RlcjogKCkgPT4gUHJvbWlzZTx2b2lkPiA9IG51bGw7XG5cdC8qKlxuXHQgKiBFeGVjdXRlcyB3aGVuIGZpcnN0IHJlZ2lzdGVyaW5nIHRoaXMgcm91dGUgd2l0aCBFeHByZXNzLiBJZiBcblx0ICogdGhpcyByZXR1cm5zIGZhbHNlLCB0aGUgcm91dGUgd2lsbCBub3QgYmUgcmVnaXN0ZXJlZC5cblx0ICovXG5cdG9uUmVnaXN0ZXI6ICgpID0+IFByb21pc2U8Ym9vbGVhbj4gPSBudWxsO1xuXHQvKipcblx0ICogRXhlY3V0ZXMgYWZ0ZXIgYWxsIHJvdXRlcyBoYXZlIGJlZW4gcmVnaXN0ZXJlZC5cblx0ICovXG5cdG9uUG9zdFJlZ2lzdGVyOiAoKSA9PiBQcm9taXNlPHZvaWQ+ID0gbnVsbDtcblxuXHQvKipcblx0ICogRXhlY3V0ZXMgd2hlbiBhdXRob3JpemluZyBhIGNhbGxlZCBtZXRob2QuXG5cdCAqIFRoZSB2YWx1ZSByZXR1cm5lZCBmcm9tIGhlcmUgd2lsbCBiZSBwYXNzZWQgdG8gb25FeGVjdXRlIGluIHRoZSBcblx0ICogY2FsbGVkIEhvdFJvdXRlTWV0aG9kLiBVbmRlZmluZWQgcmV0dXJuaW5nIGZyb20gaGVyZSB3aWxsIG1lYW4gXG5cdCAqIHRoZSBhdXRob3JpemF0aW9uIGZhaWxlZC5cblx0ICovXG5cdG9uQXV0aG9yaXplVXNlcjogKHJlcTogYW55LCByZXM6IGFueSkgPT4gUHJvbWlzZTxhbnk+ID0gbnVsbDtcbn0iLCJpbXBvcnQgeyBEZXZlbG9wZXJNb2RlIH0gZnJvbSBcIi4vSG90XCI7XG5pbXBvcnQgeyBIb3RUZXN0RHJpdmVyIH0gZnJvbSBcIi4vSG90VGVzdERyaXZlclwiO1xuaW1wb3J0IHsgSG90Um91dGUgfSBmcm9tIFwiLi9Ib3RSb3V0ZVwiO1xuaW1wb3J0IHsgSG90U2VydmVyIH0gZnJvbSBcIi4vSG90U2VydmVyXCI7XG5cbi8qKlxuICogQXZhaWxhYmxlIEhUVFAgbWV0aG9kcy5cbiAqL1xuZXhwb3J0IGVudW0gSFRUUE1ldGhvZFxue1xuXHRHRVQgPSBcImdldFwiLFxuXHRQT1NUID0gXCJwb3N0XCJcbn1cblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBleGVjdXRlZCBieSB0aGUgc2VydmVyIHdoZW4gZmlyc3QgcmVnaXN0ZXJpbmcgd2l0aCBFeHByZXNzLlxuICogSWYgdGhpcyByZXR1cm5zIGZhbHNlLCB0aGlzIHJvdXRlIG1ldGhvZCB3aWxsIG5vdCBiZSByZWdpc3RlcmVkLlxuICovXG5leHBvcnQgdHlwZSBTZXJ2ZXJSZWdpc3RyYXRpb25GdW5jdGlvbiA9ICgpID0+IFByb21pc2U8Ym9vbGVhbj47XG4vKipcbiAqIEEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIGJ5IHRoZSBzZXJ2ZXIuXG4gKi9cbmV4cG9ydCB0eXBlIFNlcnZlckV4ZWN1dGlvbkZ1bmN0aW9uID0gXG5cdChyZXE6IGFueSwgcmVzOiBhbnksIGF1dGhvcml6ZWRWYWx1ZTogYW55LCBqc29uT2JqOiBhbnksIHF1ZXJ5T2JqOiBhbnkpID0+IFByb21pc2U8YW55Pjtcbi8qKlxuICogQSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgYnkgdGhlIGNsaWVudC5cbiAqL1xuZXhwb3J0IHR5cGUgQ2xpZW50RXhlY3V0aW9uRnVuY3Rpb24gPSAoLi4uYXJnczogYW55W10pID0+IFByb21pc2U8YW55Pjtcbi8qKlxuICogQSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgYnkgdGhlIHNlcnZlciBmb3IgYXV0aG9yaXphdGlvbi4gQW55IHZhbHVlIFxuICogcmV0dXJuZWQgZnJvbSB0aGlzIGZ1bmN0aW9uIHdpbGwgYmUgcGFzc2VkIHRvIHRoZSBTZXJ2ZXJFeGVjdXRpb25GdW5jdGlvbi5cbiAqIElmIGFuIHVuZGVmaW5lZCB2YWx1ZSBpcyByZXR1cm5lZCwgdGhpcyBpbmRpY2F0ZXMgdGhlIHNlcnZlciB3YXMgbm90IGFibGUgXG4gKiB0byBhdXRoZW50aWNhdGUgdGhlIHVzZXIsIHNvIHRoZSBTZXJ2ZXJFeGVjdXRpb25GdW5jdGlvbiB3aWxsIG5vdCBiZSBcbiAqIGV4ZWN1dGVkLlxuICovXG5leHBvcnQgdHlwZSBTZXJ2ZXJBdXRob3JpemF0aW9uRnVuY3Rpb24gPSAocmVxOiBhbnksIHJlczogYW55LCBqc29uT2JqOiBhbnksIHF1ZXJ5T2JqOiBhbnkpID0+IFByb21pc2U8YW55Pjtcbi8qKlxuICogVGhlIHRlc3QgY2FzZSBmdW5jdGlvbiB0byBleGVjdXRlLlxuICovXG5leHBvcnQgdHlwZSBUZXN0Q2FzZUZ1bmN0aW9uID0gKChkcml2ZXI6IEhvdFRlc3REcml2ZXIpID0+IFByb21pc2U8YW55PikgfCAoKGRyaXZlcjogSG90VGVzdERyaXZlcikgPT4gYW55KTtcbi8qKlxuICogVGhlIHRlc3QgY2FzZSBvYmplY3QgdG8gcGFzcy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUZXN0Q2FzZU9iamVjdFxue1xuXHQvKipcblx0ICogVGhlIG5hbWUgb2YgdGhlIHRlc3QgY2FzZS5cblx0ICovXG5cdG5hbWU6IHN0cmluZztcblx0LyoqXG5cdCAqIFRoZSBmdW5jdGlvbiB0byBleGVjdXRlLlxuXHQgKi9cblx0ZnVuYzogVGVzdENhc2VGdW5jdGlvbjtcbn1cblxuLyoqXG4gKiBBbiBBUEkgbWV0aG9kIHRvIG1ha2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBIb3RSb3V0ZU1ldGhvZFxue1xuXHQvKipcblx0ICogVGhlIHBhcmVudCByb3V0ZS5cblx0ICovXG5cdHBhcmVudFJvdXRlOiBIb3RSb3V0ZTtcblx0LyoqXG5cdCAqIFRoZSBhcGkgY2FsbCBuYW1lLlxuXHQgKi9cblx0bmFtZTogc3RyaW5nO1xuXHQvKipcblx0ICogVGhlIGFwaSBjYWxsIG5hbWUuXG5cdCAqL1xuXHR0eXBlOiBIVFRQTWV0aG9kO1xuXHQvKipcblx0ICogSGFzIHRoaXMgbWV0aG9kIGJlZW4gcmVnaXN0ZXJlZCB3aXRoIHRoZSBzZXJ2ZXI/IFRoaXMgXG5cdCAqIHByZXZlbnRzIHRoZSBtZXRob2QgZnJvbSBiZWluZyByZXJlZ2lzdGVyZWQuXG5cdCAqL1xuXHRpc1JlZ2lzdGVyZWQ6IGJvb2xlYW47XG5cdC8qKlxuXHQgKiBIYXMgdGhpcyBtZXRob2QgYmVlbiByZWdpc3RlcmVkIHdpdGggdGhlIHNlcnZlcj8gVGhpcyBcblx0ICogcHJldmVudHMgdGhlIG1ldGhvZCBmcm9tIGJlaW5nIHJlcmVnaXN0ZXJlZC5cblx0ICovXG5cdGV4ZWN1dGVTZXR1cDogYm9vbGVhbjtcblx0LyoqXG5cdCAqIFRoZSBhdXRob3JpemF0aW9uIGNyZWRlbnRpYWxzIHRvIGJlIHVzZWQgYnkgdGhlIGNsaWVudCBcblx0ICogd2hlbiBjb25uZWN0aW5nIHRvIHRoZSBzZXJ2ZXIuXG5cdCAqL1xuXHRhdXRoQ3JlZGVudGlhbHM6IGFueTtcblx0LyoqXG5cdCAqIFRoZSB0ZXN0IGNhc2Ugb2JqZWN0cyB0byBleGVjdXRlIGR1cmluZyB0ZXN0cy5cblx0ICovXG5cdHRlc3RDYXNlczoge1xuXHRcdFx0W25hbWU6IHN0cmluZ106IFRlc3RDYXNlT2JqZWN0O1xuXHRcdH07XG5cblx0Y29uc3RydWN0b3IgKHJvdXRlOiBIb3RSb3V0ZSwgbmFtZTogc3RyaW5nLCBcblx0XHRvbkV4ZWN1dGU6IFNlcnZlckV4ZWN1dGlvbkZ1bmN0aW9uIHwgQ2xpZW50RXhlY3V0aW9uRnVuY3Rpb24gPSBudWxsLCBcblx0XHR0eXBlOiBIVFRQTWV0aG9kID0gSFRUUE1ldGhvZC5QT1NULCBvblNlcnZlckF1dGhvcml6ZTogU2VydmVyQXV0aG9yaXphdGlvbkZ1bmN0aW9uID0gbnVsbCwgXG5cdFx0b25SZWdpc3RlcjogU2VydmVyUmVnaXN0cmF0aW9uRnVuY3Rpb24gPSBudWxsLCBhdXRoQ3JlZGVudGlhbHM6IGFueSA9IG51bGwsIFxuXHRcdHRlc3RDYXNlczogKHN0cmluZyB8IFRlc3RDYXNlRnVuY3Rpb24pW10gfCBUZXN0Q2FzZUZ1bmN0aW9uW10gfCBUZXN0Q2FzZU9iamVjdFtdID0gbnVsbClcblx0e1xuXHRcdHRoaXMucGFyZW50Um91dGUgPSByb3V0ZTtcblx0XHR0aGlzLm5hbWUgPSBuYW1lO1xuXHRcdHRoaXMudHlwZSA9IHR5cGU7XG5cdFx0dGhpcy5pc1JlZ2lzdGVyZWQgPSBmYWxzZTtcblx0XHR0aGlzLmV4ZWN1dGVTZXR1cCA9IGZhbHNlO1xuXHRcdHRoaXMuYXV0aENyZWRlbnRpYWxzID0gYXV0aENyZWRlbnRpYWxzO1xuXHRcdHRoaXMub25TZXJ2ZXJBdXRob3JpemUgPSBvblNlcnZlckF1dGhvcml6ZTtcblx0XHR0aGlzLm9uUmVnaXN0ZXIgPSBvblJlZ2lzdGVyO1xuXHRcdHRoaXMudGVzdENhc2VzID0ge307XG5cblx0XHRpZiAodGhpcy5wYXJlbnRSb3V0ZS5jb25uZWN0aW9uLnByb2Nlc3Nvci5tb2RlID09PSBEZXZlbG9wZXJNb2RlLkRldmVsb3BtZW50KVxuXHRcdHtcblx0XHRcdGlmICh0ZXN0Q2FzZXMgIT0gbnVsbClcblx0XHRcdHtcblx0XHRcdFx0Zm9yIChsZXQgaUlkeCA9IDA7IGlJZHggPCB0ZXN0Q2FzZXMubGVuZ3RoOyBpSWR4KyspXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRsZXQgb2JqID0gdGVzdENhc2VzW2lJZHhdO1xuXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiAob2JqKSA9PT0gXCJzdHJpbmdcIilcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjb25zdCBuYW1lOiBzdHJpbmcgPSBvYmo7XG5cdFx0XHRcdFx0XHRjb25zdCBmdW5jOiBUZXN0Q2FzZUZ1bmN0aW9uID0gKDxUZXN0Q2FzZUZ1bmN0aW9uPnRlc3RDYXNlc1tpSWR4ICsgMV0pO1xuXG5cdFx0XHRcdFx0XHR0aGlzLmFkZFRlc3RDYXNlIChuYW1lLCBmdW5jKTtcblx0XHRcdFx0XHRcdGlJZHgrKztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0dGhpcy5hZGRUZXN0Q2FzZSAob2JqKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0aGlzLnBhcmVudFJvdXRlLmNvbm5lY3Rpb24gaW5zdGFuY2VvZiBIb3RTZXJ2ZXIpXG5cdFx0XHR0aGlzLm9uU2VydmVyRXhlY3V0ZSA9IG9uRXhlY3V0ZTtcblx0XHQvL2Vsc2Vcblx0XHRcdC8vdGhpcy5vbkNsaWVudEV4ZWN1dGUgPSBvbkV4ZWN1dGU7XG5cdH1cblxuXHQvKipcblx0ICogRXhlY3V0ZXMgYmVmb3JlIGFsbCByb3V0ZXMgaGF2ZSBiZWVuIHJlZ2lzdGVyZWQuXG5cdCAqL1xuXHRvblByZVJlZ2lzdGVyPzogKCkgPT4gUHJvbWlzZTx2b2lkPjtcblx0LyoqXG5cdCAqIEV4ZWN1dGVzIHdoZW4gZmlyc3QgcmVnaXN0ZXJpbmcgdGhpcyBtZXRob2Qgd2l0aCBFeHByZXNzLiBJZiBcblx0ICogdGhpcyByZXR1cm5zIGZhbHNlLCB0aGUgbWV0aG9kIHdpbGwgbm90IGJlIHJlZ2lzdGVyZWQuXG5cdCAqL1xuXHRvblJlZ2lzdGVyPzogU2VydmVyUmVnaXN0cmF0aW9uRnVuY3Rpb247XG5cdC8qKlxuXHQgKiBFeGVjdXRlcyBhZnRlciBhbGwgcm91dGVzIGhhdmUgYmVlbiByZWdpc3RlcmVkLlxuXHQgKi9cblx0b25Qb3N0UmVnaXN0ZXI/OiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuXG5cdC8qKlxuXHQgKiBFeGVjdXRlcyB3aGVuIGF1dGhvcml6aW5nIGEgY2FsbGVkIG1ldGhvZC4gSWYgdGhpcyBtZXRob2QgXG5cdCAqIGlzIHNldCwgdGhpcyB3aWxsIG5vdCBjYWxsIG9uQXV0aG9yaXplIGZvciB0aGUgcGFyZW50IEhvdFJvdXRlLlxuXHQgKiBUaGUgdmFsdWUgcmV0dXJuZWQgZnJvbSBoZXJlIHdpbGwgYmUgcGFzc2VkIHRvIG9uRXhlY3V0ZS4gXG5cdCAqIFVuZGVmaW5lZCByZXR1cm5pbmcgZnJvbSBoZXJlIHdpbGwgbWVhbiB0aGUgYXV0aG9yaXphdGlvbiBmYWlsZWQuXG5cdCAqIElmIGFueSBleGNlcHRpb25zIGFyZSB0aHJvd24gZnJvbSB0aGlzIGZ1bmN0aW9uLCB0aGV5IHdpbGwgYmUgc2VudCBcblx0ICogdG8gdGhlIHNlcnZlciBhcyBhbiB7IGVycm9yOiBzdHJpbmc7IH0gb2JqZWN0IHdpdGggdGhlIGV4Y2VwdGlvbiBcblx0ICogbWVzc2FnZSBhcyB0aGUgZXJyb3IuXG5cdCAqL1xuXHRvblNlcnZlckF1dGhvcml6ZT86IFNlcnZlckF1dGhvcml6YXRpb25GdW5jdGlvbjtcblxuXHQvKipcblx0ICogRXhlY3V0ZXMgd2hlbiBleGVjdXRpbmcgYSBjYWxsZWQgbWV0aG9kIGZyb20gdGhlIHNlcnZlciBzaWRlLiBcblx0ICogVGhpcyB3aWxsIHN0cmluZ2lmeSBhbnkgSlNPTiBvYmplY3QgYW5kIHNlbmQgaXQgYXMgYSBKU09OIHJlc3BvbnNlLiBcblx0ICogSWYgdW5kZWZpbmVkIGlzIHJldHVybmVkIG5vIHJlc3BvbnNlIHdpbGwgYmUgc2VudCB0byB0aGUgc2VydmVyLiBcblx0ICogU28gdGhlIGRldmVsb3BlciB3b3VsZCBoYXZlIHRvIHNlbmQgYSByZXNwb25zZSB1c2luZyBcInJlc1wiLlxuXHQgKiBJZiBhbnkgZXhjZXB0aW9ucyBhcmUgdGhyb3duIGZyb20gdGhpcyBmdW5jdGlvbiwgdGhleSB3aWxsIGJlIHNlbnQgXG5cdCAqIHRvIHRoZSBzZXJ2ZXIgYXMgYW4geyBlcnJvcjogc3RyaW5nOyB9IG9iamVjdCB3aXRoIHRoZSBleGNlcHRpb24gXG5cdCAqIG1lc3NhZ2UgYXMgdGhlIGVycm9yLlxuXHQgKi9cblx0b25TZXJ2ZXJFeGVjdXRlPzogU2VydmVyRXhlY3V0aW9uRnVuY3Rpb247XG5cdC8qKlxuXHQgKiBFeGVjdXRlcyB3aGVuIGV4ZWN1dGluZyBhIGNhbGxlZCBtZXRob2QgZnJvbSB0aGUgY2xpZW50IHNpZGUuXG5cdCAqIEBmaXhtZSBJcyB0aGlzIG5lY2Vzc2FyeT9cblx0ICovXG5cdG9uQ2xpZW50RXhlY3V0ZT86IENsaWVudEV4ZWN1dGlvbkZ1bmN0aW9uO1xuXG5cdC8qKlxuXHQgKiBBZGQgYSBuZXcgdGVzdCBjYXNlLlxuXHQgKi9cblx0YWRkVGVzdENhc2UgKG5ld1Rlc3RDYXNlOiBUZXN0Q2FzZU9iamVjdCB8IHN0cmluZyB8IFRlc3RDYXNlRnVuY3Rpb24sIFxuXHRcdFx0dGVzdENhc2VGdW5jdGlvbjogVGVzdENhc2VGdW5jdGlvbiA9IG51bGwpOiB2b2lkXG5cdHtcblx0XHRpZiAodHlwZW9mIChuZXdUZXN0Q2FzZSkgPT09IFwic3RyaW5nXCIpXG5cdFx0e1xuXHRcdFx0Y29uc3QgbmFtZTogc3RyaW5nID0gbmV3VGVzdENhc2U7XG5cdFx0XHRjb25zdCBmdW5jOiBUZXN0Q2FzZUZ1bmN0aW9uID0gdGVzdENhc2VGdW5jdGlvbjtcblxuXHRcdFx0dGhpcy50ZXN0Q2FzZXNbbmFtZV0gPSB7XG5cdFx0XHRcdFx0bmFtZTogbmFtZSxcblx0XHRcdFx0XHRmdW5jOiBmdW5jXG5cdFx0XHRcdH07XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAodHlwZW9mIChuZXdUZXN0Q2FzZSkgPT09IFwiZnVuY3Rpb25cIilcblx0XHR7XG5cdFx0XHRjb25zdCB0ZXN0Q2FzZUlkOiBudW1iZXIgPSBPYmplY3Qua2V5cyAodGhpcy50ZXN0Q2FzZXMpLmxlbmd0aDtcblx0XHRcdGNvbnN0IG5hbWU6IHN0cmluZyA9IGAke3RoaXMucGFyZW50Um91dGUucm91dGV9LyR7dGhpcy5uYW1lfSB0ZXN0IGNhc2UgJHt0ZXN0Q2FzZUlkfWA7XG5cdFx0XHRjb25zdCBmdW5jOiBUZXN0Q2FzZUZ1bmN0aW9uID0gKDxUZXN0Q2FzZUZ1bmN0aW9uPm5ld1Rlc3RDYXNlKTtcblxuXHRcdFx0dGhpcy50ZXN0Q2FzZXNbbmFtZV0gPSB7XG5cdFx0XHRcdFx0bmFtZTogbmFtZSxcblx0XHRcdFx0XHRmdW5jOiBmdW5jXG5cdFx0XHRcdH07XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCB0ZXN0Q2FzZTogVGVzdENhc2VPYmplY3QgPSAoPFRlc3RDYXNlT2JqZWN0Pm5ld1Rlc3RDYXNlKTtcblx0XHR0aGlzLnRlc3RDYXNlc1t0ZXN0Q2FzZS5uYW1lXSA9IHRlc3RDYXNlO1xuXHR9XG59IiwiaW1wb3J0IHsgSG90U3RhcSB9IGZyb20gXCIuL0hvdFN0YXFcIjtcbmltcG9ydCB7IEhvdExvZyB9IGZyb20gXCIuL0hvdExvZ1wiO1xuaW1wb3J0IHsgSG90QVBJIH0gZnJvbSBcIi4vSG90QVBJXCI7XG5pbXBvcnQgeyBIb3RSb3V0ZSB9IGZyb20gXCIuL0hvdFJvdXRlXCI7XG5cbi8qKlxuICogVGhlIHR5cGUgb2Ygc2VydmVyLlxuICovXG5leHBvcnQgZW51bSBIb3RTZXJ2ZXJUeXBlXG57XG5cdEhUVFAsXG5cdFdlYlNvY2tldHNcbn1cblxuLyoqXG4gKiBUaGUgc2VydmVyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElIb3RTZXJ2ZXJcbntcblx0LyoqXG5cdCAqIFRoZSBwcm9jZXNzb3IgdG8gdXNlLlxuXHQgKi9cblx0cHJvY2Vzc29yOiBIb3RTdGFxO1xuXHQvKipcblx0ICogVGhlIHNlcnZlciB0eXBlLlxuXHQgKi9cblx0c2VydmVyVHlwZTogc3RyaW5nO1xuXHQvKipcblx0ICogVGhlIEFQSSB0byB1c2UuXG5cdCAqL1xuXHRhcGk6IEhvdEFQSTtcblx0LyoqXG5cdCAqIFRoZSBuZXR3b3JrIGFkZHJlc3MgdG8gbGlzdGVuIG9uLlxuXHQgKi9cblx0bGlzdGVuQWRkcmVzczogc3RyaW5nO1xuXHQvKipcblx0ICogVGhlIHBvcnRzIHRvIHVzZS5cblx0ICovXG5cdHBvcnRzOiB7XG5cdFx0XHRodHRwOiBudW1iZXI7XG5cdFx0XHRodHRwczogbnVtYmVyO1xuXHRcdH07XG5cdC8qKlxuXHQgKiBTU0wgc2V0dGluZ3MuXG5cdCAqL1xuXHRzc2w6IHtcblx0XHRcdC8qKlxuXHRcdFx0ICogVGhlIFNTTCBjZXJ0aWZpY2F0ZSB0byB1c2UuXG5cdFx0XHQgKi9cblx0XHRcdGNlcnQ6IHN0cmluZztcblx0XHRcdC8qKlxuXHRcdFx0ICogVGhlIFNTTCBjZXJ0aWZpY2F0ZSBrZXkgdG8gdXNlLlxuXHRcdFx0ICovXG5cdFx0XHRrZXk6IHN0cmluZztcblx0XHRcdC8qKlxuXHRcdFx0ICogVGhlIFNTTCBjZXJ0aWZpY2F0ZSBDQSB0byB1c2UuXG5cdFx0XHQgKi9cblx0XHRcdGNhOiBzdHJpbmc7XG5cdFx0fTtcblx0LyoqXG5cdCAqIFJlZGlyZWN0IEhUVFAgdHJhZmZpYyB0byBIVFRQUy5cblx0ICovXG5cdHJlZGlyZWN0SFRUUHRvSFRUUFM6IGJvb2xlYW47XG5cdC8qKlxuXHQgKiBUaGUgdHlwZSBvZiBzZXJ2ZXIuXG5cdCAqL1xuXHR0eXBlOiBIb3RTZXJ2ZXJUeXBlO1xuXHQvKipcblx0ICogVGhlIGxvZ2dlci5cblx0ICovXG5cdGxvZ2dlcjogSG90TG9nO1xuXHQvKipcblx0ICogQW55IHNlY3JldHMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgc2VydmVyLlxuXHQgKi9cblx0c2VjcmV0czogYW55O1xufVxuXG4vKipcbiAqIFRoZSBzZXJ2ZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBIb3RTZXJ2ZXIgaW1wbGVtZW50cyBJSG90U2VydmVyXG57XG5cdC8qKlxuXHQgKiBUaGUgcHJvY2Vzc29yIHRvIHVzZS5cblx0ICovXG5cdHByb2Nlc3NvcjogSG90U3RhcTtcblx0LyoqXG5cdCAqIFRoZSBzZXJ2ZXIgdHlwZS5cblx0ICovXG5cdHNlcnZlclR5cGU6IHN0cmluZztcblx0LyoqXG5cdCAqIFRoZSBBUEkgdG8gdXNlLlxuXHQgKi9cblx0YXBpOiBIb3RBUEk7XG5cdC8qKlxuXHQgKiBUaGUgbmV0d29yayBhZGRyZXNzIHRvIGxpc3RlbiBvbi5cblx0ICovXG5cdGxpc3RlbkFkZHJlc3M6IHN0cmluZztcblx0LyoqXG5cdCAqIFRoZSBwb3J0cyB0byB1c2UuXG5cdCAqL1xuXHRwb3J0czoge1xuXHRcdFx0aHR0cDogbnVtYmVyO1xuXHRcdFx0aHR0cHM6IG51bWJlcjtcblx0XHR9O1xuXHQvKipcblx0ICogU1NMIHNldHRpbmdzLlxuXHQgKi9cblx0c3NsOiB7XG5cdFx0XHQvKipcblx0XHRcdCAqIFRoZSBTU0wgY2VydGlmaWNhdGUgdG8gdXNlLlxuXHRcdFx0ICovXG5cdFx0XHRjZXJ0OiBzdHJpbmc7XG5cdFx0XHQvKipcblx0XHRcdCAqIFRoZSBTU0wgY2VydGlmaWNhdGUga2V5IHRvIHVzZS5cblx0XHRcdCAqL1xuXHRcdFx0a2V5OiBzdHJpbmc7XG5cdFx0XHQvKipcblx0XHRcdCAqIFRoZSBTU0wgY2VydGlmaWNhdGUgQ0EgdG8gdXNlLlxuXHRcdFx0ICovXG5cdFx0XHRjYTogc3RyaW5nO1xuXHRcdH07XG5cdC8qKlxuXHQgKiBSZWRpcmVjdCBIVFRQIHRyYWZmaWMgdG8gSFRUUFMuXG5cdCAqL1xuXHRyZWRpcmVjdEhUVFB0b0hUVFBTOiBib29sZWFuO1xuXHQvKipcblx0ICogVGhlIHR5cGUgb2Ygc2VydmVyLlxuXHQgKi9cblx0dHlwZTogSG90U2VydmVyVHlwZTtcblx0LyoqXG5cdCAqIFRoZSBsb2dnZXIuXG5cdCAqL1xuXHRsb2dnZXI6IEhvdExvZztcblx0LyoqXG5cdCAqIEFueSBzZWNyZXRzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHNlcnZlci5cblx0ICovXG5cdHNlY3JldHM6IGFueTtcblxuXHRjb25zdHJ1Y3RvciAocHJvY2Vzc29yOiBIb3RTdGFxIHwgSG90U2VydmVyKVxuXHR7XG5cdFx0aWYgKHByb2Nlc3NvciBpbnN0YW5jZW9mIEhvdFN0YXEpXG5cdFx0e1xuXHRcdFx0dGhpcy5wcm9jZXNzb3IgPSBwcm9jZXNzb3I7XG5cdFx0XHR0aGlzLnNlcnZlclR5cGUgPSBcIlNlcnZlclwiO1xuXHRcdFx0dGhpcy5hcGkgPSBudWxsO1xuXHRcdFx0dGhpcy5saXN0ZW5BZGRyZXNzID0gXCIwLjAuMC4wXCI7XG5cdFx0XHR0aGlzLnBvcnRzID0ge1xuXHRcdFx0XHRcdGh0dHA6IDgwLFxuXHRcdFx0XHRcdGh0dHBzOiA0NDNcblx0XHRcdFx0fTtcblx0XHRcdHRoaXMuc3NsID0ge1xuXHRcdFx0XHRcdGNlcnQ6IFwiXCIsXG5cdFx0XHRcdFx0a2V5OiBcIlwiLFxuXHRcdFx0XHRcdGNhOiBcIlwiXG5cdFx0XHRcdH07XG5cdFx0XHR0aGlzLnJlZGlyZWN0SFRUUHRvSFRUUFMgPSB0cnVlO1xuXHRcdFx0dGhpcy50eXBlID0gSG90U2VydmVyVHlwZS5IVFRQO1xuXHRcdFx0dGhpcy5sb2dnZXIgPSBwcm9jZXNzb3IubG9nZ2VyO1xuXHRcdFx0dGhpcy5zZWNyZXRzID0ge307XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHR0aGlzLnByb2Nlc3NvciA9IHByb2Nlc3Nvci5wcm9jZXNzb3I7XG5cdFx0XHR0aGlzLnNlcnZlclR5cGUgPSBwcm9jZXNzb3Iuc2VydmVyVHlwZSB8fCBcIlNlcnZlclwiO1xuXHRcdFx0dGhpcy5hcGkgPSBwcm9jZXNzb3IuYXBpIHx8IG51bGw7XG5cdFx0XHR0aGlzLmxpc3RlbkFkZHJlc3MgPSBwcm9jZXNzb3IubGlzdGVuQWRkcmVzcyB8fCBcIjAuMC4wLjBcIjtcblx0XHRcdHRoaXMucG9ydHMgPSBwcm9jZXNzb3IucG9ydHMgfHwge1xuXHRcdFx0XHRcdGh0dHA6IDgwLFxuXHRcdFx0XHRcdGh0dHBzOiA0NDNcblx0XHRcdFx0fTtcblx0XHRcdHRoaXMuc3NsID0gcHJvY2Vzc29yLnNzbCB8fCB7XG5cdFx0XHRcdFx0Y2VydDogXCJcIixcblx0XHRcdFx0XHRrZXk6IFwiXCIsXG5cdFx0XHRcdFx0Y2E6IFwiXCJcblx0XHRcdFx0fTtcblx0XHRcdHRoaXMucmVkaXJlY3RIVFRQdG9IVFRQUyA9IHByb2Nlc3Nvci5yZWRpcmVjdEhUVFB0b0hUVFBTICE9IG51bGwgPyBwcm9jZXNzb3IucmVkaXJlY3RIVFRQdG9IVFRQUyA6IHRydWU7XG5cdFx0XHR0aGlzLnR5cGUgPSBwcm9jZXNzb3IudHlwZSB8fCBIb3RTZXJ2ZXJUeXBlLkhUVFA7XG5cdFx0XHR0aGlzLmxvZ2dlciA9IHByb2Nlc3Nvci5sb2dnZXI7XG5cdFx0XHR0aGlzLnNlY3JldHMgPSBwcm9jZXNzb3Iuc2VjcmV0cyB8fCB7fTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogU2V0IGFuIEFQSSB0byB0aGlzIHNlcnZlci4gVGhpcyB3aWxsIGFsc28gc2V0IHRoZSBhc3NvY2lhdGVkIFxuXHQgKiBwcm9jZXNzb3IgdG8gdGhpcyBBUEkgYXMgd2VsbC5cblx0ICovXG5cdGFzeW5jIHNldEFQSSAoYXBpOiBIb3RBUEkpOiBQcm9taXNlPHZvaWQ+XG5cdHtcblx0XHR0aGlzLnByb2Nlc3Nvci5hcGkgPSBhcGk7XG5cdFx0dGhpcy5hcGkgPSBhcGk7XG5cblx0XHQvL2lmIChyZWdpc3RlclJvdXRlcyA9PT0gdHJ1ZSlcblx0XHRcdC8vYXdhaXQgdGhpcy5hcGkucmVnaXN0ZXJSb3V0ZXMgKCk7XG5cdH1cblxuXHQvKipcblx0ICogUmVnaXN0ZXIgYSByb3V0ZSB3aXRoIHRoZSBzZXJ2ZXIuXG5cdCAqL1xuXHRhc3luYyByZWdpc3RlclJvdXRlPyAocm91dGU6IEhvdFJvdXRlKTogUHJvbWlzZTx2b2lkPjtcblxuXHQvKipcblx0ICogU3RhcnQgbGlzdGVuaW5nIGZvciByZXF1ZXN0cy5cblx0ICovXG5cdGFzeW5jIGxpc3Rlbj8gKCk6IFByb21pc2U8dm9pZD47XG5cblx0LyoqXG5cdCAqIFNodXRkb3duIHRoZSBzZXJ2ZXIuXG5cdCAqL1xuXHRhc3luYyBzaHV0ZG93bj8gKCk6IFByb21pc2U8dm9pZD47XG59IiwiaW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgKiBhcyBwcGF0aCBmcm9tIFwicGF0aFwiO1xuXG5pbXBvcnQgZmV0Y2ggZnJvbSBcImNyb3NzLWZldGNoXCI7XG5pbXBvcnQgdmFsaWRhdGVNb2R1bGVOYW1lIGZyb20gXCJ2YWxpZGF0ZS1ucG0tcGFja2FnZS1uYW1lXCI7XG5cbmltcG9ydCB7IEhvdFBhZ2UgfSBmcm9tIFwiLi9Ib3RQYWdlXCI7XG5pbXBvcnQgeyBIb3RGaWxlIH0gZnJvbSBcIi4vSG90RmlsZVwiO1xuXG5pbXBvcnQgeyBIb3RDb21wb25lbnQgfSBmcm9tIFwiLi9Ib3RDb21wb25lbnRcIjtcbmltcG9ydCB7IEhvdExvZywgSG90TG9nTGV2ZWwgfSBmcm9tIFwiLi9Ib3RMb2dcIjtcbmltcG9ydCB7IEhvdEFQSSB9IGZyb20gXCIuL0hvdEFQSVwiO1xuaW1wb3J0IHsgSG90U2VydmVyIH0gZnJvbSBcIi4vSG90U2VydmVyXCI7XG5pbXBvcnQgeyBEZXZlbG9wZXJNb2RlLCBIb3QgfSBmcm9tIFwiLi9Ib3RcIjtcbmltcG9ydCB7IEhvdENsaWVudCB9IGZyb20gXCIuL0hvdENsaWVudFwiO1xuXG5pbXBvcnQgeyBIb3RUZXN0ZXIgfSBmcm9tIFwiLi9Ib3RUZXN0ZXJcIjtcbmltcG9ydCB7IEhvdFRlc3RlckFQSSB9IGZyb20gXCIuL0hvdFRlc3RlckFQSVwiO1xuaW1wb3J0IHsgSG90VGVzdERyaXZlciB9IGZyb20gXCIuL0hvdFRlc3REcml2ZXJcIjtcbmltcG9ydCB7IEhvdFRlc3REZXN0aW5hdGlvbiwgSG90VGVzdE1hcCB9IGZyb20gXCIuL0hvdFRlc3RNYXBcIjtcblxudmFyIEhvdFRlc3Rlck1vY2hhOiBhbnkgPSBudWxsO1xudmFyIEhvdFRlc3Rlck1vY2hhU2VsZW5pdW06IGFueSA9IG51bGw7XG52YXIgSG90VGVzdFNlbGVuaXVtRHJpdmVyOiBhbnkgPSBudWxsO1xuXG4vKipcbiAqIEEgbWFwIHBhdGggZm9yIHRlc3RpbmcuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSG90U2l0ZU1hcFBhdGhcbntcblx0LyoqXG5cdCAqIElmIHNldCB0byB0cnVlLCB0aGlzIHdpbGwgc3RhcnQgYXV0b21hdGljYWxseSB3aGVuIHRlc3RzIHN0YXJ0LlxuXHQgKiBUaGUgZGVmYXVsdCBpcyB0cnVlLlxuXHQgKi9cblx0YXV0b1N0YXJ0PzogYm9vbGVhbjtcblx0LyoqXG5cdCAqIFRoZSBwYXRoIHRvIHRoZSBcblx0ICovXG5cdHBhdGg/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSByb3V0ZSB1c2VkIGluIGEgSG90U2l0ZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBIb3RTaXRlUm91dGVcbntcblx0LyoqXG5cdCAqIFRoZSBuYW1lIG9mIHRoZSByb3V0ZS4gV2lsbCBhcHBlYXIgaW4gdGhlIHRpdGxlLlxuXHQgKi9cblx0bmFtZTogc3RyaW5nO1xuXHQvKipcblx0ICogVGhlIHVybCB0byB0aGUgZmlsZSB0byBsb2FkLlxuXHQgKi9cblx0dXJsOiBzdHJpbmc7XG5cdC8qKlxuXHQgKiBUaGUgbmFtZSBvZiB0aGUgQVBJIHRvIGludGVyZmFjZSB3aXRoLlxuXHQgKi9cblx0YXBpPzogc3RyaW5nO1xuXHQvKipcblx0ICogVGhlIG9yZGVyIGluIHdoaWNoIGRlc3RpbmF0aW9ucyBhcmUgc3VwcG9zZWQgdG8gZXhlY3V0ZS4gVGhpcyBpcyBcblx0ICogaWdub3JlZCBpZiB0aGUgZGVzdGluYXRpb25zIGFyZSBhbiBhcnJheS5cblx0ICovXG5cdGRlc3RpbmF0aW9uT3JkZXI/OiBzdHJpbmdbXTtcblx0LyoqXG5cdCAqIFRoZSBIb3RUZXN0ZXJNYXAgdG8gdXNlLiBUaGlzIGNhbiBiZSB0aGUgbmFtZSBvZiBhbiBcblx0ICogZXhpc3Rpbmcgb25lIGF0dGFjaGVkIHRvIHRoZSBzZWxlY3RlZCB0ZXN0ZXIsIG9yIFxuXHQgKiBjYW4gYmUgYW4gYXJyYXkgb2YgZGVzdGluYXRpb25zIHRoYXQgd2lsbCBiZSB1c2VkIHRvIFxuXHQgKiBjcmVhdGUgYSBuZXcgbWFwLlxuXHQgKi9cblx0bWFwPzogc3RyaW5nIHwgc3RyaW5nW10gfCB7IFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfCBIb3RTaXRlTWFwUGF0aDsgfSB8IEhvdFNpdGVNYXBQYXRoW107XG59XG5cbi8qKlxuICogQSBIb3RTaXRlIHRvIGxvYWQuIFRoaXMgU0hPVUxEIE5PVCBjb250YWluIGFueSBwcml2YXRlIHNlY3JldCBrZXlzLCBwYXNzd29yZHMsIFxuICogb3IgZGF0YWJhc2UgY29ubmVjdGlvbiBpbmZvcm1hdGlvbiByZWxhdGVkIHRvIHRoZSBzZXJ2ZXIuIEFzIHN1Y2gsIGZ1dHVyZSBcbiAqIHZlcnNpb25zIG9mIHRoZSBIb3RTaXRlIGludGVyZmFjZSBzaG91bGQgbm90IGNvbnRhaW4gYW55IGRhdGFiYXNlIHJlbGF0ZWQgXG4gKiBjb25uZWN0aW9uIGluZm8uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSG90U2l0ZVxue1xuXHQvKipcblx0ICogVGhlIG5hbWUgb2YgdGhpcyBIb3RTaXRlLlxuXHQgKi9cblx0bmFtZTogc3RyaW5nO1xuXHQvKipcblx0ICogVGhlIHBhdGggdG8gdGhlIGN1cnJlbnQgSG90U2l0ZS4gVGhpcyBpcyBmaWxsZWQgaW4gZHVyaW5nIHBhcnNpbmcuXG5cdCAqL1xuXHRob3RzaXRlUGF0aD86IHN0cmluZztcblx0LyoqXG5cdCAqIEFkZGl0aW9uYWwgd2ViIHNlcnZlciBjb25maWd1cmF0aW9uLlxuXHQgKi9cblx0c2VydmVyPzoge1xuXHRcdFx0LyoqXG5cdFx0XHQgKiBUaGUgZGVmYXVsdCBuYW1lIGZvciBhIHNlcnZlZCBIb3R0IGZpbGUuXG5cdFx0XHQgKi9cblx0XHRcdG5hbWU/OiBzdHJpbmc7XG5cdFx0XHQvKipcblx0XHRcdCAqIFNlcnZlIGhvdHQgZmlsZXMgd2hlbiByZXF1ZXN0ZWQuXG5cdFx0XHQgKi9cblx0XHRcdHNlcnZlSG90dEZpbGVzPzogYm9vbGVhbjtcblx0XHRcdC8qKlxuXHRcdFx0ICogVGhlIG5hbWUgb2YgdGhlIEFQSSB0byBpbnRlcmZhY2Ugd2l0aCBhY3Jvc3MgYWxsIHBhZ2VzLlxuXHRcdFx0ICovXG5cdFx0XHRnbG9iYWxBcGk/OiBzdHJpbmc7XG5cdFx0XHQvKipcblx0XHRcdCAqIFRoZSBiYXNlIHVybCBmb3IgdGhlIHNlcnZlci5cblx0XHRcdCAqL1xuXHRcdFx0dXJsPzogc3RyaW5nO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiBUaGUgSmF2YVNjcmlwdCBzb3VyY2UgcGF0aC5cblx0XHRcdCAqL1xuXHRcdFx0anNTcmNQYXRoPzogc3RyaW5nO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiBUaGUgcG9ydHMgdG8gdXNlLlxuXHRcdFx0ICovXG5cdFx0XHRwb3J0cz86IHtcblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiBUaGUgSFRUUCBwb3J0IHRvIHNlcnZlIG9uLlxuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdGh0dHA/OiBudW1iZXI7XG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogVGhlIEhUVFBTIHBvcnQgdG8gc2VydmUgb24uXG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0aHR0cHM/OiBudW1iZXI7XG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogSWYgc2V0IHRvIHRydWUsIHRoaXMgd2lsbCByZWRpcmVjdCBmcm9tIEhUVFAgdG8gSFRUUFMuXG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0cmVkaXJlY3RIVFRQdG9IVFRQUz86IGJvb2xlYW47XG5cdFx0XHRcdH07XG5cdFx0XHQvKipcblx0XHRcdCAqIFRoZSBsaXN0IG9mIGRpcmVjdG9yeSB0byBzZXJ2ZSB0byB0aGUgY2xpZW50IGZyb20gdGhlIHNlcnZlci5cblx0XHRcdCAqL1xuXHRcdFx0c2VydmVEaXJlY3Rvcmllcz86IHtcblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiBUaGUgd2ViIHJvdXRlIHRvIHRha2UuXG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0cm91dGU6IHN0cmluZztcblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiBUaGUgbG9jYWwgZmlsZXN5c3RlbSBwYXRoIHRvIHNlcnZlIHBhZ2VzIGZyb20uXG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0bG9jYWxQYXRoOiBzdHJpbmc7XG5cdFx0XHRcdH1bXTtcblx0XHR9O1xuXHQvKipcblx0ICogVGVzdGluZyByZWxhdGVkIGZ1bmN0aW9uYWxpdHkuXG5cdCAqL1xuXHR0ZXN0aW5nPzoge1xuXHRcdFx0d2ViPzoge1xuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogVGhlIHRlc3RlciBjbGFzcyB0byB1c2UuIEVYOiBIb3RUZXN0ZXJNb2NoYVNlbGVuaXVtXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHR0ZXN0ZXI/OiBzdHJpbmc7XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiBUaGUgbmFtZSBvZiB0aGUgdGVzdGVyIHRvIHVzZS5cblx0XHRcdFx0ICovXG5cdFx0XHRcdHRlc3Rlck5hbWU/OiBzdHJpbmc7XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiBJZiBzZXQgdG8gdHJ1ZSwgdGhpcyB3aWxsIGNyZWF0ZSBhIG5ldyB0ZXN0ZXIuXG5cdFx0XHRcdCAqIERlZmF1bHQgVmFsdWU6IHRydWVcblx0XHRcdFx0ICovXG5cdFx0XHRcdGNyZWF0ZU5ld1Rlc3Rlcj86IGJvb2xlYW47XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiBUaGUgdXJsIHRoYXQgY29ubmVjdHMgdG8gdGhlIHRlc3RlciBhcGkgc2VydmVyLlxuXHRcdFx0XHQgKi9cblx0XHRcdFx0dGVzdGVyQVBJVXJsPzogc3RyaW5nO1xuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogVGhlIG5hbWUgb2YgdGhlIHRlc3QgZHJpdmVyIHRvIHVzZS5cblx0XHRcdFx0ICovXG5cdFx0XHRcdGRyaXZlcj86IHN0cmluZztcblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIFRoZSB1cmwgdG8gdGhlIGh0bWwgdGhhdCBsb2FkcyB0aGUgaG90dCBmaWxlcy5cblx0XHRcdFx0ICovXG5cdFx0XHRcdGxhdW5jaHBhZFVybD86IHN0cmluZztcblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIFRoZSBtYXBzIHRvIHRlc3QgaW4gb3JkZXIuXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHRtYXBzPzogc3RyaW5nW107XG5cdFx0XHR9LFxuXHRcdFx0YXBpPzoge1xuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogVGhlIHRlc3RlciBjbGFzcyB0byB1c2UuIEVYOiBIb3RUZXN0ZXJNb2NoYVxuXHRcdFx0XHQgKi9cblx0XHRcdFx0dGVzdGVyPzogc3RyaW5nO1xuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogVGhlIG5hbWUgb2YgdGhlIHRlc3RlciB0byB1c2UuXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHR0ZXN0ZXJOYW1lPzogc3RyaW5nO1xuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogSWYgc2V0IHRvIHRydWUsIHRoaXMgd2lsbCBjcmVhdGUgYSBuZXcgdGVzdGVyLlxuXHRcdFx0XHQgKiBEZWZhdWx0IFZhbHVlOiB0cnVlXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHRjcmVhdGVOZXdUZXN0ZXI/OiBib29sZWFuO1xuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogVGhlIHVybCB0aGF0IGNvbm5lY3RzIHRvIHRoZSB0ZXN0ZXIgYXBpIHNlcnZlci5cblx0XHRcdFx0ICovXG5cdFx0XHRcdHRlc3RlckFQSVVybD86IHN0cmluZztcblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIFRoZSBuYW1lIG9mIHRoZSB0ZXN0IGRyaXZlciB0byB1c2UuXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHRkcml2ZXI/OiBzdHJpbmc7XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiBUaGUgdXJsIHRvIHRoZSBodG1sIHRoYXQgbG9hZHMgdGhlIGhvdHQgZmlsZXMuXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHRsYXVuY2hwYWRVcmw/OiBzdHJpbmc7XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiBUaGUgbWFwcyB0byB0ZXN0IGluIG9yZGVyLlxuXHRcdFx0XHQgKi9cblx0XHRcdFx0bWFwcz86IHN0cmluZ1tdO1xuXHRcdFx0fVxuXHRcdH07XG5cdC8qKlxuXHQgKiBUaGUgcm91dGVzIHRvIGxvYWQuXG5cdCAqL1xuXHRyb3V0ZXM/OiB7XG5cdFx0XHRbcm91dGVOYW1lOiBzdHJpbmddOiBIb3RTaXRlUm91dGU7XG5cdFx0fTtcblx0LyoqXG5cdCAqIFRoZSBhdmFpbGFibGUgQVBJcyBvbiB0aGUgc2VydmVyLiBUaGUgc2VydmVyIG11c3QgYWxyZWFkeSBoYXZlIHRoZXNlIFxuXHQgKiBsb2FkZWQuXG5cdCAqL1xuXHRhcGlzPzoge1xuXHRcdFx0W25hbWU6IHN0cmluZ106IHtcblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiBUaGUgSlMgQVBJIGZpbGUgdG8gbG9hZC5cblx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHRqc2FwaT86IHN0cmluZztcblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiBUaGUgZXhwb3J0ZWQgSlMgbGlicmFyeSBuYW1lIHRvIHVzZS5cblx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHRsaWJyYXJ5TmFtZT86IHN0cmluZztcblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiBUaGUgbmFtZSBvZiB0aGUgYXBpIHRvIHVzZS5cblx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHRhcGlOYW1lPzogc3RyaW5nO1xuXHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdCAqIFRoZSBwb3J0IHRvIHVzZS5cblx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHRwb3J0PzogbnVtYmVyO1xuXHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdCAqIFRoZSBwdWJsaWMgYmFzZSB1cmwgZm9yIHRoZSBhcGkuXG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0dXJsPzogc3RyaW5nO1xuXHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdCAqIFRoZSBzZXJ2ZXItc2lkZSBmaWxlcGF0aCBmb3IgdGhlIGFwaS5cblx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHRmaWxlcGF0aD86IHN0cmluZztcblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiBUaGUgbWFwcyB0byB0ZXN0IGluIG9yZGVyLlxuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdG1hcD86IHN0cmluZ1tdO1xuXHRcdFx0XHR9O1xuXHRcdH07XG5cdC8qKlxuXHQgKiBTZWNyZXRzIHRoYXQgY2FuIGJlIHB1YmxpY2x5IGVtYmVkZGVkIGludG8gdGhlIHBhZ2UuXG5cdCAqL1xuXHRwdWJsaWNTZWNyZXRzPzoge1xuXHRcdFx0W25hbWU6IHN0cmluZ106IHN0cmluZyB8IHtcblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiBUaGUga2V5IG9mIGFuIEFQSSBzZWNyZXQgdG8gcGFzcyB0byB0aGUgc2l0ZSB0byBcblx0XHRcdFx0XHQgKiBiZSB1c2VkIHB1YmxpY2x5LlxuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdHBhc3NTZWNyZXRGcm9tQVBJPzogc3RyaW5nO1xuXHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdCAqIEdldCB0aGUgcHVibGljIHNlY3JldCBmcm9tIGFuIGVudmlyb25tZW50IHZhcmlhYmxlLlxuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdGVudj86IHN0cmluZztcblx0XHRcdFx0fTtcblx0XHR9O1xuXHQvKipcblx0ICogVGhlIGNvbXBvbmVudHMgdG8gbG9hZCBhbmQgcmVnaXN0ZXIuXG5cdCAqL1xuXHRjb21wb25lbnRzPzoge1xuXHRcdFx0W25hbWU6IHN0cmluZ106IHtcblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiBUaGUgdXJsIHRvIHRoZSBjb21wb25lbnQgdG8gbG9hZCBhbmQgcmVnaXN0ZXIuXG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0dXJsOiBzdHJpbmc7XG5cdFx0XHRcdH07XG5cdFx0fTtcblx0LyoqXG5cdCAqIFRoZSBmaWxlcyB0byBsb2FkIGFuZCBzYXZlIGluIG1lbW9yeS5cblx0ICovXG5cdGZpbGVzPzoge1xuXHRcdFx0W25hbWU6IHN0cmluZ106IHtcblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiBUaGUgdXJsIHRvIHRoZSBmaWxlIHRvIGxvYWQuXG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0dXJsOiBzdHJpbmc7XG5cdFx0XHRcdH07XG5cdFx0fTtcbn1cblxuLyoqXG4gKiBUaGUgb3B0aW9ucyB0byB1c2Ugd2hlbiBzdGFydGluZyBhIHBhZ2UuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSG90U3RhcnRPcHRpb25zXG57XG5cdC8qKlxuXHQgKiBUaGUgSG90dCBzaXRlIHRvIGxvYWQuXG5cdCAqL1xuXHR1cmw6IHN0cmluZztcblx0LyoqXG5cdCAqIFRoZSBuYW1lIG9mIHRoZSBwYWdlIHRvIGxvYWQuXG5cdCAqL1xuXHRuYW1lPzogc3RyaW5nO1xuXHQvKipcblx0ICogVGhlIHByb2Nlc3NvciB0byB1c2UgdG8gbG9hZCB0aGUgcGFnZS5cblx0ICovXG5cdHByb2Nlc3Nvcj86IEhvdFN0YXE7XG5cdC8qKlxuXHQgKiBBbnkgYXJndW1lbnRzIHRvIHBhc3MgdG8gdGhlIG5ldyBwYWdlLlxuXHQgKi9cblx0YXJncz86IGFueTtcblx0LyoqXG5cdCAqIFRoZSBuYW1lIG9mIHRoZSB0ZXN0ZXIgdG8gdXNlLlxuXHQgKi9cblx0dGVzdGVyTmFtZT86IHN0cmluZztcblx0LyoqXG5cdCAqIFRoZSBuYW1lIG9mIHRoZSB0ZXN0ZXIgbWFwIHRvIHVzZS5cblx0ICovXG5cdHRlc3Rlck1hcD86IHN0cmluZztcblx0LyoqXG5cdCAqIFRoZSBiYXNlIHVybCBmb3IgdGhlIHRlc3RlciBhcGkuXG5cdCAqL1xuXHR0ZXN0ZXJBUElCYXNlVXJsPzogc3RyaW5nO1xuXHQvKipcblx0ICogVGhlIHVybCB0byB0aGUgaHRtbCB0aGF0IGxvYWRzIHRoZSBob3R0IGZpbGUgdGhhdCdzIFxuXHQgKiBwb2ludGVkIGF0IHRoZSB1cmwgYWJvdmUuXG5cdCAqL1xuXHR0ZXN0ZXJMYXVuY2hwYWRVcmw/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogVGhlIG1haW4gY2xhc3MgdGhhdCBoYW5kbGVzIGFsbCBIVE1MIHByZXByb2Nlc3NpbmcsIHRoZW4gb3V0cHV0cyB0aGUgXG4gKiByZXN1bHRzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElIb3RTdGFxXG57XG5cdC8qKlxuXHQgKiBUaGUgYXBpIHRoYXQncyB1c2VkIHRvIGNvbW11bmljYXRlIHdpdGguXG5cdCAqL1xuXHRhcGk/OiBIb3RBUEk7XG5cdC8qKlxuXHQgKiBUaGUgdGVzdGVyIGFwaSB0aGF0J3MgdXNlZCB0byBjb21tdW5pY2F0ZSB3aXRoLlxuXHQgKi9cblx0dGVzdGVyQVBJPzogSG90QVBJO1xuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoYXQgdHlwZSBvZiBleGVjdXRpb24gdGhpcyBpcy5cblx0ICovXG5cdG1vZGU/OiBEZXZlbG9wZXJNb2RlO1xuXHQvKipcblx0ICogVGhlIHBhZ2VzIHRoYXQgY2FuIGJlIGNvbnN0cnVjdGVkLlxuXHQgKi9cblx0cGFnZXM/OiB7IFtuYW1lOiBzdHJpbmddOiBIb3RQYWdlIH07XG5cdC8qKlxuXHQgKiBUaGUgY29tcG9uZW50cyB0aGF0IGNhbiBiZSBjb25zdHJ1Y3RlZC5cblx0ICovXG5cdGNvbXBvbmVudHM/OiB7IFtuYW1lOiBzdHJpbmddOiBIb3RDb21wb25lbnQgfTtcblx0LyoqXG5cdCAqIFRoZSBmaWxlcyB0aGF0IGNhbiBiZSBzdG9yZWQgZm9yIGxhdGVyIHVzZS5cblx0ICovXG5cdGZpbGVzPzogeyBbbmFtZTogc3RyaW5nXTogSG90RmlsZSB9O1xuXHQvKipcblx0ICogVGhlIGxvYWRlZCBob3RzaXRlLlxuXHQgKi9cblx0aG90U2l0ZT86IEhvdFNpdGU7XG59XG5cbi8qKlxuICogVGhlIG1haW4gY2xhc3MgdGhhdCBoYW5kbGVzIGFsbCBIVE1MIHByZXByb2Nlc3NpbmcsIHRoZW4gb3V0cHV0cyB0aGUgXG4gKiByZXN1bHRzLlxuICovXG5leHBvcnQgY2xhc3MgSG90U3RhcSBpbXBsZW1lbnRzIElIb3RTdGFxXG57XG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgaWYgdGhpcyBpcyBhIHdlYiBidWlsZC5cblx0ICovXG5cdHN0YXRpYyBpc1dlYjogYm9vbGVhbiA9IGZhbHNlO1xuXHQvKipcblx0ICogSW5kaWNhdGVzIGlmIHRoaXMgaXMgcmVhZHkgZm9yIHRlc3RpbmcuXG5cdCAqL1xuXHRzdGF0aWMgaXNSZWFkeUZvclRlc3Rpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblx0LyoqXG5cdCAqIEV4ZWN1dGVzIHRoaXMgZXZlbnQgd2hlbiB0aGlzIHBhZ2UgaXMgcmVhZHkgZm9yIHRlc3RpbmcuXG5cdCAqL1xuXHRzdGF0aWMgb25SZWFkeUZvclRlc3Rpbmc6ICgpID0+IFByb21pc2U8dm9pZD4gPSBudWxsO1xuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoYXQgdHlwZSBvZiBleGVjdXRpb24gdGhpcyBpcy5cblx0ICovXG5cdG1vZGU6IERldmVsb3Blck1vZGU7XG5cdC8qKlxuXHQgKiBUaGUgYXBpIHRoYXQncyB1c2VkIHRvIGNvbW11bmljYXRlIHdpdGguXG5cdCAqL1xuXHRhcGk6IEhvdEFQSTtcblx0LyoqXG5cdCAqIFRoZSB0ZXN0ZXIgYXBpIHRoYXQncyB1c2VkIHRvIGNvbW11bmljYXRlIHdpdGguXG5cdCAqL1xuXHR0ZXN0ZXJBUEk6IEhvdEFQSTtcblx0LyoqXG5cdCAqIFRoZSBwYWdlcyB0aGF0IGNhbiBiZSBjb25zdHJ1Y3RlZC5cblx0ICovXG5cdHBhZ2VzOiB7IFtuYW1lOiBzdHJpbmddOiBIb3RQYWdlIH07XG5cdC8qKlxuXHQgKiBUaGUgY29tcG9uZW50cyB0aGF0IGNhbiBiZSBjb25zdHJ1Y3RlZC5cblx0ICovXG5cdGNvbXBvbmVudHM6IHsgW25hbWU6IHN0cmluZ106IEhvdENvbXBvbmVudCB9O1xuXHQvKipcblx0ICogVGhlIGZpbGVzIHRoYXQgY2FuIGJlIHN0b3JlZCBmb3IgbGF0ZXIgdXNlLlxuXHQgKi9cblx0ZmlsZXM6IHsgW25hbWU6IHN0cmluZ106IEhvdEZpbGUgfTtcblx0LyoqXG5cdCAqIFRoZSBsb2FkZWQgaG90c2l0ZS5cblx0ICovXG5cdGhvdFNpdGU6IEhvdFNpdGU7XG5cdC8qKlxuXHQgKiBUaGUgYXBpIGNvbnRlbnQgdG8gdXNlIHdoZW4gYWJvdXQgdG8gbG9hZCBIb3RTdGFxLlxuXHQgKi9cblx0YXBpQ29udGVudDogc3RyaW5nO1xuXHQvKipcblx0ICogVGhlIHRlc3RlciBhcGkgY29udGVudCB0byB1c2Ugd2hlbiBhYm91dCB0byBsb2FkIEhvdFN0YXEuXG5cdCAqL1xuXHR0ZXN0ZXJBcGlDb250ZW50OiBzdHJpbmc7XG5cdC8qKlxuXHQgKiBUaGUgcGFnZSBjb250ZW50IHRvIHVzZSB3aGVuIGFib3V0IHRvIGxvYWQgSG90U3RhcS5cblx0ICovXG5cdHBhZ2VDb250ZW50OiBzdHJpbmc7XG5cdC8qKlxuXHQgKiBUaGUgbG9nZ2VyLlxuXHQgKi9cblx0bG9nZ2VyOiBIb3RMb2c7XG5cdC8qKlxuXHQgKiBUaGUgc2VjcmV0cyB0aGF0IGNhbiBiZSBleHBvc2VkIHB1YmxpY2x5LlxuXHQgKi9cblx0cHVibGljU2VjcmV0czogYW55O1xuXHQvKipcblx0ICogVGhlIHNlY3JldHMgdGhhdCBjYW4gYmUgZXhwb3NlZCBwdWJsaWNseS5cblx0ICovXG5cdHRlc3RlcnM6IHsgW25hbWU6IHN0cmluZ106IEhvdFRlc3RlciB9O1xuXG5cdGNvbnN0cnVjdG9yIChjb3B5OiBJSG90U3RhcSA9IHt9KVxuXHR7XG5cdFx0dGhpcy5hcGkgPSBjb3B5LmFwaSB8fCBudWxsO1xuXHRcdHRoaXMudGVzdGVyQVBJID0gY29weS50ZXN0ZXJBUEkgfHwgbnVsbDtcblx0XHR0aGlzLm1vZGUgPSBjb3B5Lm1vZGUgfHwgRGV2ZWxvcGVyTW9kZS5Qcm9kdWN0aW9uO1xuXHRcdHRoaXMucGFnZXMgPSBjb3B5LnBhZ2VzIHx8IHt9O1xuXHRcdHRoaXMuY29tcG9uZW50cyA9IGNvcHkuY29tcG9uZW50cyB8fCB7fTtcblx0XHR0aGlzLmZpbGVzID0gY29weS5maWxlcyB8fCB7fTtcblx0XHR0aGlzLmhvdFNpdGUgPSBjb3B5LmhvdFNpdGUgfHwgbnVsbDtcblx0XHR0aGlzLmFwaUNvbnRlbnQgPSBgXG5cdFx0XHR2YXIgJWFwaV9uYW1lJSA9ICVhcGlfZXhwb3J0ZWRfbmFtZSUuJWFwaV9uYW1lJTtcblx0XHRcdHZhciBuZXdIb3RDbGllbnQgPSBuZXcgSG90Q2xpZW50IChwcm9jZXNzb3IpO1xuXHRcdFx0dmFyIG5ld2FwaSA9IG5ldyAlYXBpX25hbWUlICglYmFzZV91cmwlLCBuZXdIb3RDbGllbnQpO1xuXHRcdFx0bmV3SG90Q2xpZW50LmFwaSA9IG5ld2FwaTtcblx0XHRcdHByb2Nlc3Nvci5hcGkgPSBuZXdhcGk7YDtcblx0XHR0aGlzLnRlc3RlckFwaUNvbnRlbnQgPSBgXG5cdFx0XHR2YXIgSG90VGVzdGVyQVBJID0gSG90U3RhcVdlYi5Ib3RUZXN0ZXJBUEk7XG5cdFx0XHR2YXIgbmV3SG90VGVzdGVyQ2xpZW50ID0gbmV3IEhvdENsaWVudCAocHJvY2Vzc29yKTtcblx0XHRcdHZhciBuZXd0ZXN0ZXJhcGkgPSBuZXcgSG90VGVzdGVyQVBJICglYmFzZV90ZXN0ZXJfdXJsJSwgbmV3SG90VGVzdGVyQ2xpZW50KTtcblx0XHRcdG5ld0hvdFRlc3RlckNsaWVudC50ZXN0ZXJBUEkgPSBuZXd0ZXN0ZXJhcGk7XG5cdFx0XHRwcm9jZXNzb3IudGVzdGVyQVBJID0gbmV3dGVzdGVyYXBpO2A7XG5cdFx0dGhpcy5wYWdlQ29udGVudCA9IFxuYDwhRE9DVFlQRSBodG1sPlxuPGh0bWw+XG5cbjxoZWFkPlxuXHQ8dGl0bGU+JXRpdGxlJTwvdGl0bGU+XG5cblx0PHNjcmlwdCB0eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIiBzcmMgPSBcIiVob3RzdGFxX2pzX3NyYyVcIj48L3NjcmlwdD5cblx0PHNjcmlwdCB0eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIj5cblx0XHR3aW5kb3cuSG90U3RhcSA9IEhvdFN0YXFXZWIuSG90U3RhcTtcblx0XHR3aW5kb3cuSG90Q2xpZW50ID0gSG90U3RhcVdlYi5Ib3RDbGllbnQ7XG5cdFx0d2luZG93LkhvdEFQSSA9IEhvdFN0YXFXZWIuSG90QVBJO1xuXHRcdHdpbmRvdy5Ib3QgPSBIb3RTdGFxV2ViLkhvdDtcblx0PC9zY3JpcHQ+XG5cbiVhcGlzX3RvX2xvYWQlXG5cblx0PHNjcmlwdCB0eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIj5cblx0XHRmdW5jdGlvbiBob3RzdGFxX3N0YXJ0QXBwICgpXG5cdFx0e1xuXHRcdFx0bGV0IHRlbXBNb2RlID0gMDtcblxuXHRcdFx0aWYgKHdpbmRvd1tcIkhvdFwiXSAhPSBudWxsKVxuXHRcdFx0XHR0ZW1wTW9kZSA9IEhvdC5Nb2RlO1xuXG5cdFx0XHQlbG9hZF9ob3Rfc2l0ZSVcblxuXHRcdFx0dmFyIHByb2Nlc3NvciA9IG5ldyBIb3RTdGFxICgpO1xuXHRcdFx0dmFyIHByb21pc2VzID0gW107XG5cdFx0XHQlZGV2ZWxvcGVyX21vZGUlXG5cblx0XHRcdCVhcGlfY29kZSVcblxuXHRcdFx0JXB1YmxpY19zZWNyZXRzJVxuXHRcdFx0JXRlc3Rlcl9hcGklXG5cdFx0XHQlbG9hZF9maWxlcyVcblxuXHRcdFx0cHJvY2Vzc29yLm1vZGUgPSB0ZW1wTW9kZTtcblxuXHRcdFx0UHJvbWlzZS5hbGwgKHByb21pc2VzKS50aGVuIChmdW5jdGlvbiAoKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0SG90U3RhcS5kaXNwbGF5VXJsICh7XG5cdFx0XHRcdFx0XHRcdHVybDogXCIldXJsJVwiLFxuXHRcdFx0XHRcdFx0XHRuYW1lOiBcIiV0aXRsZSVcIixcblx0XHRcdFx0XHRcdFx0cHJvY2Vzc29yOiBwcm9jZXNzb3IsXG5cdFx0XHRcdFx0XHRcdGFyZ3M6ICVhcmdzJSxcblx0XHRcdFx0XHRcdFx0dGVzdGVyTmFtZTogJXRlc3Rlcl9uYW1lJSxcblx0XHRcdFx0XHRcdFx0dGVzdGVyTWFwOiAldGVzdGVyX21hcCUsXG5cdFx0XHRcdFx0XHRcdHRlc3RlckFQSUJhc2VVcmw6ICV0ZXN0ZXJfYXBpX2Jhc2VfdXJsJSxcblx0XHRcdFx0XHRcdFx0dGVzdGVyTGF1bmNocGFkVXJsOiAldGVzdGVyX2xhdW5jaHBhZF91cmwlXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aG90c3RhcV9zdGFydEFwcCAoKTtcblx0PC9zY3JpcHQ+XG48L2hlYWQ+XG5cbjxib2R5PlxuPC9ib2R5PlxuXG48L2h0bWw+YDtcblx0XHR0aGlzLmxvZ2dlciA9IG5ldyBIb3RMb2cgKEhvdExvZ0xldmVsLk5vbmUpO1xuXHRcdHRoaXMucHVibGljU2VjcmV0cyA9IHt9O1xuXHRcdHRoaXMudGVzdGVycyA9IHt9O1xuXHR9XG5cblx0LyoqXG5cdCAqIFBhcnNlIGEgYm9vbGVhbiB2YWx1ZS5cblx0ICovXG5cdHN0YXRpYyBwYXJzZUJvb2xlYW4gKHZhbHVlOiBzdHJpbmcpOiBib29sZWFuXG5cdHtcblx0XHR2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlICgpO1xuXG5cdFx0aWYgKHZhbHVlID09PSBcInRydWVcIilcblx0XHRcdHJldHVybiAodHJ1ZSk7XG5cblx0XHRpZiAodmFsdWUgPT09IFwiZmFsc2VcIilcblx0XHRcdHJldHVybiAoZmFsc2UpO1xuXG5cdFx0aWYgKHZhbHVlID09PSBcInllc1wiKVxuXHRcdFx0cmV0dXJuICh0cnVlKTtcblxuXHRcdGlmICh2YWx1ZSA9PT0gXCJub1wiKVxuXHRcdFx0cmV0dXJuIChmYWxzZSk7XG5cblx0XHRpZiAodmFsdWUgPT09IFwieWVwXCIpXG5cdFx0XHRyZXR1cm4gKHRydWUpO1xuXG5cdFx0aWYgKHZhbHVlID09PSBcIm5haFwiKVxuXHRcdFx0cmV0dXJuIChmYWxzZSk7XG5cblx0XHR0cnlcblx0XHR7XG5cdFx0XHRpZiAocGFyc2VJbnQgKHZhbHVlKSAhPSAwKVxuXHRcdFx0XHRyZXR1cm4gKHRydWUpO1xuXHRcdH1cblx0XHRjYXRjaCAoZXgpXG5cdFx0e1xuXHRcdH1cblxuXHRcdHJldHVybiAoZmFsc2UpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrIGlmIGEgcmVxdWlyZWQgcGFyYW1ldGVyIGV4aXN0cyBpbnNpZGUgYW4gb2JqZWN0LiBJZiBpdCBleGlzdHMsIHJldHVybiB0aGUgdmFsdWUuXG5cdCAqL1xuXHRzdGF0aWMgZ2V0UGFyYW0gKG5hbWU6IHN0cmluZywgb2JqV2l0aFBhcmFtOiBhbnksIHJlcXVpcmVkOiBib29sZWFuID0gdHJ1ZSwgdGhyb3dFeGNlcHRpb246IGJvb2xlYW4gPSB0cnVlKTogYW55XG5cdHtcblx0XHRsZXQgdmFsdWU6IGFueSA9IG9ialdpdGhQYXJhbVtuYW1lXTtcblxuXHRcdGlmICh2YWx1ZSA9PSBudWxsKVxuXHRcdHtcblx0XHRcdGlmIChyZXF1aXJlZCA9PT0gdHJ1ZSlcblx0XHRcdHtcblx0XHRcdFx0aWYgKHRocm93RXhjZXB0aW9uID09PSB0cnVlKVxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvciAoYE1pc3NpbmcgcmVxdWlyZWQgcGFyYW1ldGVyICR7bmFtZX0uYCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiAodmFsdWUpID09PSBcInN0cmluZ1wiKVxuXHRcdHtcblx0XHRcdGlmIChyZXF1aXJlZCA9PT0gdHJ1ZSlcblx0XHRcdHtcblx0XHRcdFx0aWYgKHZhbHVlID09PSBcIlwiKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWYgKHRocm93RXhjZXB0aW9uID09PSB0cnVlKVxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yIChgTWlzc2luZyByZXF1aXJlZCBwYXJhbWV0ZXIgJHtuYW1lfS5gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiAodmFsdWUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrIGlmIGEgcmVxdWlyZWQgcGFyYW1ldGVyIGV4aXN0cyBpbnNpZGUgYW4gb2JqZWN0LiBJZiBpdCBleGlzdHMsIHJldHVybiB0aGUgdmFsdWUuXG5cdCAqIElmIGl0IGRvZXMgbm90IGV4aXN0LCByZXR1cm4gYSBkZWZhdWx0IHZhbHVlIGluc3RlYWQuXG5cdCAqL1xuXHRzdGF0aWMgZ2V0UGFyYW1EZWZhdWx0IChuYW1lOiBzdHJpbmcsIG9ialdpdGhQYXJhbTogYW55LCBkZWZhdWx0VmFsdWU6IGFueSk6IGFueVxuXHR7XG5cdFx0bGV0IHZhbHVlOiBhbnkgPSBvYmpXaXRoUGFyYW1bbmFtZV07XG5cblx0XHRpZiAodmFsdWUgPT0gbnVsbClcblx0XHRcdHJldHVybiAoZGVmYXVsdFZhbHVlKTtcblxuXHRcdGlmICh0eXBlb2YgKHZhbHVlKSA9PT0gXCJzdHJpbmdcIilcblx0XHR7XG5cdFx0XHRpZiAodmFsdWUgPT09IFwiXCIpXG5cdFx0XHRcdHJldHVybiAoZGVmYXVsdFZhbHVlKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gKHZhbHVlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBXYWl0IGZvciBhIG51bWJlciBvZiBtaWxsaXNlY29uZHMuXG5cdCAqL1xuXHRzdGF0aWMgYXN5bmMgd2FpdCAobnVtTWlsbGlzZWNvbmRzOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+XG5cdHtcblx0XHRyZXR1cm4gKGF3YWl0IG5ldyBQcm9taXNlICgocmVzb2x2ZSwgcmVqZWN0KSA9PlxuXHRcdFx0e1xuXHRcdFx0XHRzZXRUaW1lb3V0ICgoKSA9PlxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJlc29sdmUgKCk7XG5cdFx0XHRcdFx0fSwgbnVtTWlsbGlzZWNvbmRzKTtcblx0XHRcdH0pKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGQgYSBwYWdlLlxuXHQgKi9cblx0YWRkUGFnZSAocGFnZTogSG90UGFnZSk6IHZvaWRcblx0e1xuXHRcdHRoaXMucGFnZXNbcGFnZS5uYW1lXSA9IHBhZ2U7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IGEgcGFnZSB0byBwcm9jZXNzLlxuXHQgKi9cblx0Z2V0UGFnZSAocGFnZU5hbWU6IHN0cmluZyk6IEhvdFBhZ2Vcblx0e1xuXHRcdHJldHVybiAodGhpcy5wYWdlc1twYWdlTmFtZV0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZCBhIGZpbGUuXG5cdCAqL1xuXHRhZGRGaWxlIChmaWxlOiBIb3RGaWxlKTogdm9pZFxuXHR7XG5cdFx0bGV0IG5hbWU6IHN0cmluZyA9IGZpbGUubmFtZTtcblxuXHRcdGlmIChuYW1lID09PSBcIlwiKVxuXHRcdFx0bmFtZSA9IGZpbGUubG9jYWxGaWxlO1xuXG5cdFx0aWYgKG5hbWUgPT09IFwiXCIpXG5cdFx0XHRuYW1lID0gZmlsZS51cmw7XG5cblx0XHR0aGlzLmZpbGVzW25hbWVdID0gZmlsZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgYSBmaWxlLlxuXHQgKi9cblx0Z2V0RmlsZSAobmFtZTogc3RyaW5nKTogSG90RmlsZVxuXHR7XG5cdFx0aWYgKHRoaXMuZmlsZXNbbmFtZV0gPT0gbnVsbClcblx0XHRcdHRocm93IG5ldyBFcnJvciAoYFVuYWJsZSB0byBmaW5kIGZpbGUgJHtuYW1lfWApO1xuXG5cdFx0cmV0dXJuICh0aGlzLmZpbGVzW25hbWVdKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGQgYW5kIHJlZ2lzdGVyIGEgY29tcG9uZW50LlxuXHQgKi9cblx0YWRkQ29tcG9uZW50IChjb21wb25lbnQ6IEhvdENvbXBvbmVudCk6IHZvaWRcblx0e1xuXHRcdHRoaXMuY29tcG9uZW50c1tjb21wb25lbnQubmFtZV0gPSBjb21wb25lbnQ7XG5cdFx0dGhpcy5yZWdpc3RlckNvbXBvbmVudCAoY29tcG9uZW50KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZWdpc3RlciBhIGNvbXBvbmVudCBmb3IgdXNlIGFzIGEgSFRNTCB0YWcuXG5cdCAqL1xuXHRyZWdpc3RlckNvbXBvbmVudCAoY29tcG9uZW50OiBIb3RDb21wb25lbnQpOiB2b2lkXG5cdHtcblx0XHRjdXN0b21FbGVtZW50cy5kZWZpbmUgKGNvbXBvbmVudC50YWcsIGNsYXNzIGV4dGVuZHMgSFRNTEVsZW1lbnRcblx0XHRcdHtcblx0XHRcdFx0Y29uc3RydWN0b3IgKClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHN1cGVyICgpO1xuXG5cdFx0XHRcdFx0Ly8vIEBmaXhtZSBJcyB0aGlzIGJhZD8gQ291bGQgY3JlYXRlIHJhY2UgY29uZGl0aW9ucy5cblx0XHRcdFx0XHQoYXN5bmMgKCkgPT5cblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0aGlzLm9uY2xpY2sgPSBjb21wb25lbnQuY2xpY2suYmluZCAoY29tcG9uZW50KTtcblxuXHRcdFx0XHRcdFx0Zm9yIChsZXQga2V5IGluIGNvbXBvbmVudC5ldmVudHMpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGxldCBldmVudCA9IGNvbXBvbmVudC5ldmVudHNba2V5XTtcblxuXHRcdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0XHRcdHRoaXMuYWRkRXZlbnRMaXN0ZW5lciAoZXZlbnQudHlwZSwgZXZlbnQuZnVuYywgZXZlbnQub3B0aW9ucyk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGNvbXBvbmVudC5odG1sRWxlbWVudCA9IGF3YWl0IGNvbXBvbmVudC5vbkNyZWF0ZWQgKHRoaXMpO1xuXG5cdFx0XHRcdFx0XHRpZiAoY29tcG9uZW50LmhhbmRsZUF0dHJpYnV0ZXMgIT0gbnVsbClcblx0XHRcdFx0XHRcdFx0YXdhaXQgY29tcG9uZW50LmhhbmRsZUF0dHJpYnV0ZXMgKHRoaXMuYXR0cmlidXRlcyk7XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGZvciAobGV0IGlJZHggPSAwOyBpSWR4IDwgdGhpcy5hdHRyaWJ1dGVzLmxlbmd0aDsgaUlkeCsrKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0bGV0IGF0dHI6IEF0dHIgPSB0aGlzLmF0dHJpYnV0ZXNbaUlkeF07XG5cdFx0XHRcdFx0XHRcdFx0bGV0IGF0dHJOYW1lOiBzdHJpbmcgPSBhdHRyLm5hbWUudG9Mb3dlckNhc2UgKCk7XG5cdFx0XHRcdFx0XHRcdFx0bGV0IGF0dHJWYWx1ZTogc3RyaW5nID0gYXR0ci52YWx1ZTtcblxuXHRcdFx0XHRcdFx0XHRcdGlmIChhdHRyTmFtZSA9PT0gXCJpZFwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0Y29tcG9uZW50Lm5hbWUgPSBhdHRyVmFsdWU7XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAoYXR0ck5hbWUgPT09IFwibmFtZVwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0Y29tcG9uZW50Lm5hbWUgPSBhdHRyVmFsdWU7XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAoYXR0ck5hbWUgPT09IFwidmFsdWVcIilcblx0XHRcdFx0XHRcdFx0XHRcdGNvbXBvbmVudC52YWx1ZSA9IGF0dHJWYWx1ZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRsZXQgc3RyOiBzdHJpbmcgPSBhd2FpdCBjb21wb25lbnQub3V0cHV0ICgpO1xuXHRcdFx0XHRcdFx0bGV0IG5ld0RPTTogRG9jdW1lbnQgPSBuZXcgRE9NUGFyc2VyICgpLnBhcnNlRnJvbVN0cmluZyAoc3RyLCBcInRleHQvaHRtbFwiKTtcblx0XHRcdFx0XHRcdGxldCBzaGFkb3c6IFNoYWRvd1Jvb3QgPSB0aGlzLmF0dGFjaFNoYWRvdyAoeyBtb2RlOiBcIm9wZW5cIiB9KTtcblxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgaUlkeCA9IDA7IGlJZHggPCBuZXdET00uYm9keS5jaGlsZHJlbi5sZW5ndGg7IGlJZHgrKylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0bGV0IGNoaWxkID0gbmV3RE9NLmJvZHkuY2hpbGRyZW5baUlkeF07XG5cdFx0XHRcdFx0XHRcdHNoYWRvdy5hcHBlbmRDaGlsZCAoY2hpbGQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIGNvbXBvbmVudC5lbGVtZW50T3B0aW9ucyk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IGEgY29tcG9uZW50IHRvIHByb2Nlc3MuXG5cdCAqL1xuXHRnZXRDb21wb25lbnQgKG5hbWU6IHN0cmluZyk6IEhvdENvbXBvbmVudFxuXHR7XG5cdFx0cmV0dXJuICh0aGlzLmNvbXBvbmVudHNbbmFtZV0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZCBhIG5ldyBIVE1MIGVsZW1lbnQocykgdG8gdGhlIGN1cnJlbnQgZG9jdW1lbnQuXG5cdCAqL1xuXHRzdGF0aWMgYWRkSHRtbCAocGFyZW50OiBzdHJpbmcgfCBIVE1MRWxlbWVudCwgaHRtbDogc3RyaW5nIHwgSFRNTEVsZW1lbnQpOiBIVE1MRWxlbWVudCB8IEhUTUxFbGVtZW50W11cblx0e1xuXHRcdGxldCBmb3VuZFBhcmVudDogSFRNTEVsZW1lbnQgPSBudWxsO1xuXG5cdFx0aWYgKHR5cGVvZiAocGFyZW50KSA9PT0gXCJzdHJpbmdcIilcblx0XHRcdGZvdW5kUGFyZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciAocGFyZW50KTtcblx0XHRlbHNlXG5cdFx0XHRmb3VuZFBhcmVudCA9IHBhcmVudDtcblxuXHRcdGlmIChmb3VuZFBhcmVudCA9PSBudWxsKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yIChgVW5hYmxlIHRvIGZpbmQgcGFyZW50ICR7cGFyZW50fSFgKTtcblxuXHRcdGxldCByZXN1bHQ6IEhUTUxFbGVtZW50ID0gbnVsbDtcblxuXHRcdGlmICh0eXBlb2YgKGh0bWwpID09PSBcInN0cmluZ1wiKVxuXHRcdHtcblx0XHRcdGxldCBuZXdET006IERvY3VtZW50ID0gbmV3IERPTVBhcnNlciAoKS5wYXJzZUZyb21TdHJpbmcgKGh0bWwsIFwidGV4dC9odG1sXCIpO1xuXHRcdFx0bGV0IHJlc3VsdHM6IEhUTUxFbGVtZW50W10gPSBbXTtcblxuXHRcdFx0Zm9yIChsZXQgaUlkeCA9IDA7IGlJZHggPCBuZXdET00uYm9keS5jaGlsZHJlbi5sZW5ndGg7IGlJZHgrKylcblx0XHRcdHtcblx0XHRcdFx0bGV0IGNoaWxkOiBIVE1MRWxlbWVudCA9ICg8SFRNTEVsZW1lbnQ+bmV3RE9NLmJvZHkuY2hpbGRyZW5baUlkeF0pO1xuXG5cdFx0XHRcdHJlc3VsdHMucHVzaCAoZm91bmRQYXJlbnQuYXBwZW5kQ2hpbGQgKGNoaWxkKSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAocmVzdWx0cyk7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHRcdHJlc3VsdCA9IGZvdW5kUGFyZW50LmFwcGVuZENoaWxkIChodG1sKTtcblxuXHRcdHJldHVybiAocmVzdWx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVjayBpZiBhIEhvdFNpdGUncyBuYW1lIGlzIHZhbGlkLlxuXHQgKi9cblx0c3RhdGljIGNoZWNrSG90U2l0ZU5hbWUgKGhvdHNpdGVOYW1lOiBzdHJpbmcsIHRocm93RXhjZXB0aW9uOiBib29sZWFuID0gZmFsc2UpOiBib29sZWFuXG5cdHtcblx0XHRsZXQgdGhyb3dUaGVFeGNlcHRpb24gPSAoKSA9PlxuXHRcdFx0e1xuXHRcdFx0XHRpZiAodGhyb3dFeGNlcHRpb24gPT09IHRydWUpXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yIChgSG90U2l0ZSAke2hvdHNpdGVOYW1lfSBoYXMgYW4gaW52YWxpZCBuYW1lISBUaGUgbmFtZSBjYW5ub3QgYmUgZW1wdHkgYW5kIG11c3QgaGF2ZSBhIHZhbGlkIE5QTSBtb2R1bGUgbmFtZS5gKTtcblx0XHRcdH07XG5cblx0XHRsZXQgcmVzdWx0cyA9IHZhbGlkYXRlTW9kdWxlTmFtZSAoaG90c2l0ZU5hbWUpO1xuXG5cdFx0aWYgKHJlc3VsdHMuZXJyb3JzICE9IG51bGwpXG5cdFx0e1xuXHRcdFx0aWYgKHJlc3VsdHMuZXJyb3JzLmxlbmd0aCA+IDApXG5cdFx0XHRcdHRocm93VGhlRXhjZXB0aW9uICgpO1xuXHRcdH1cblxuXHRcdHJldHVybiAodHJ1ZSk7XG5cdH1cblxuXHQvKipcblx0ICogSW4gdGhlIHN1cHBsaWVkIGNvbnRlbnQsIHJlcGxhY2UgYSBrZXkgaW4gYSAke0tFWX0gd2l0aCBhIHZhbHVlLlxuXHQgKiBcblx0ICogQHJldHVybnMgVGhlIGNvbnRlbnQgd2l0aCB0aGUgY29ycmVjdCB2YWx1ZXMuXG5cdCAqL1xuXHRzdGF0aWMgcmVwbGFjZUtleSAoY29udGVudDogc3RyaW5nLCBrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IHN0cmluZ1xuXHR7XG5cdFx0Y29uc3QgZmluYWxTdHI6IHN0cmluZyA9IGNvbnRlbnQucmVwbGFjZSAobmV3IFJlZ0V4cCAoYFxcXFwkXFxcXHske2tleX1cXFxcfWAsIFwiZ1wiKSwgdmFsdWUpO1xuXG5cdFx0cmV0dXJuIChmaW5hbFN0cik7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IGEgdmFsdWUgZnJvbSBhIEhvdFNpdGUgb2JqZWN0LlxuXHQgKiBcblx0ICogQHJldHVybnMgUmV0dXJucyB0aGUgdmFsdWUgZnJvbSB0aGUgaG90c2l0ZSBvYmplY3QuIFJldHVybnMgbnVsbCBpZiBpdCBkb2Vzbid0IGV4aXN0LlxuXHQgKi9cblx0c3RhdGljIGdldFZhbHVlRnJvbUhvdFNpdGVPYmogKGhvdHNpdGU6IEhvdFNpdGUsIHBhcmFtczogc3RyaW5nW10pOiBhbnlcblx0e1xuXHRcdGxldCB2YWx1ZTogYW55ID0gbnVsbDtcblxuXHRcdGlmIChob3RzaXRlICE9IG51bGwpXG5cdFx0e1xuXHRcdFx0bGV0IHByZXZWYWx1ZTogYW55ID0gaG90c2l0ZTtcblxuXHRcdFx0Ly8gR28gdGhyb3VnaCBlYWNoIG9iamVjdCBpbiB0aGUgbGlzdCBvZiBwYXJhbWV0ZXJzIGFuZCBcblx0XHRcdC8vIGdldCB0aGUgdmFsdWUgb2YgdGhlIGZpbmFsIHBhcmFtZXRlci5cblx0XHRcdGZvciAobGV0IGlJZHggPSAwOyBpSWR4IDwgcGFyYW1zLmxlbmd0aDsgaUlkeCsrKVxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgcGFyYW06IHN0cmluZyA9IHBhcmFtc1tpSWR4XTtcblxuXHRcdFx0XHRpZiAocHJldlZhbHVlW3BhcmFtXSA9PSBudWxsKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cHJldlZhbHVlID0gbnVsbDtcblxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cHJldlZhbHVlID0gcHJldlZhbHVlW3BhcmFtXTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHByZXZWYWx1ZSAhPSBudWxsKVxuXHRcdFx0XHR2YWx1ZSA9IHByZXZWYWx1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gKHZhbHVlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBMb2FkIGZyb20gYSBIb3RTaXRlLmpzb24gZmlsZS4gQmUgc3VyZSB0byBsb2FkIGFuZCBhdHRhY2ggYW55IHRlc3RlcnMgYmVmb3JlIFxuXHQgKiBsb2FkaW5nIGEgSG90U2l0ZS5cblx0ICovXG5cdGFzeW5jIGxvYWRIb3RTaXRlIChwYXRoOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+XG5cdHtcblx0XHRsZXQganNvblN0cjogc3RyaW5nID0gXCJcIjtcblxuXHRcdGlmIChIb3RTdGFxLmlzV2ViID09PSB0cnVlKVxuXHRcdHtcblx0XHRcdHRoaXMubG9nZ2VyLmluZm8gKGBSZXRyaWV2aW5nIEhvdFNpdGUgJHtwYXRofWApO1xuXG5cdFx0XHRsZXQgcmVzOiBhbnkgPSBhd2FpdCBmZXRjaCAocGF0aCk7XG5cblx0XHRcdHRoaXMubG9nZ2VyLmluZm8gKGBSZXRyaWV2ZWQgc2l0ZSAke3BhdGh9YCk7XG5cblx0XHRcdGpzb25TdHIgPSByZXMudGV4dCAoKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHBhdGggPSBwcGF0aC5ub3JtYWxpemUgKHBhdGgpO1xuXG5cdFx0XHR0aGlzLmxvZ2dlci5pbmZvIChgUmV0cmlldmluZyBIb3RTaXRlICR7cGF0aH1gKTtcblxuXHRcdFx0anNvblN0ciA9IGF3YWl0IG5ldyBQcm9taXNlIChcblx0XHRcdFx0KHJlc29sdmU6IGFueSwgcmVqZWN0OiBhbnkpOiB2b2lkID0+XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRmcy5yZWFkRmlsZSAocGF0aCwgKGVycjogTm9kZUpTLkVycm5vRXhjZXB0aW9uLCBkYXRhOiBCdWZmZXIpOiB2b2lkID0+XG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGlmIChlcnIgIT0gbnVsbClcblx0XHRcdFx0XHRcdFx0XHR0aHJvdyBlcnI7XG5cdFxuXHRcdFx0XHRcdFx0XHRsZXQgY29udGVudDogc3RyaW5nID0gZGF0YS50b1N0cmluZyAoKTtcblxuXHRcdFx0XHRcdFx0XHR0aGlzLmxvZ2dlci5pbmZvIChgUmV0cmlldmVkIHNpdGUgJHtwYXRofWApO1xuXHRcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZSAoY29udGVudCk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0dGhpcy5ob3RTaXRlID0gSlNPTi5wYXJzZSAoanNvblN0cik7XG5cblx0XHRIb3RTdGFxLmNoZWNrSG90U2l0ZU5hbWUgKHRoaXMuaG90U2l0ZS5uYW1lLCB0cnVlKTtcblxuXHRcdHRoaXMuaG90U2l0ZS5ob3RzaXRlUGF0aCA9IHBhdGg7XG5cdFx0bGV0IHJvdXRlcyA9IHRoaXMuaG90U2l0ZS5yb3V0ZXM7XG5cdFx0bGV0IHRlc3RlclVybDogc3RyaW5nID0gXCJodHRwOi8vMTI3LjAuMC4xOjgxODJcIjtcblx0XHRsZXQgdGVzdGVyOiBIb3RUZXN0ZXIgPSBudWxsO1xuXHRcdGxldCBkcml2ZXI6IEhvdFRlc3REcml2ZXIgPSBudWxsO1xuXG5cdFx0aWYgKEhvdFN0YXEuaXNXZWIgPT09IGZhbHNlKVxuXHRcdHtcblx0XHRcdGlmICh0aGlzLm1vZGUgPT09IERldmVsb3Blck1vZGUuRGV2ZWxvcG1lbnQpXG5cdFx0XHR7XG5cdFx0XHRcdGlmICh0aGlzLmhvdFNpdGUudGVzdGluZyAhPSBudWxsKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bGV0IHNldHVwVGVzdGVyID0gKHBhcmVudE9iajogYW55KSA9PiBcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0bGV0IGNyZWF0ZU5ld1Rlc3RlcjogYm9vbGVhbiA9IHRydWU7XG5cdFx0XG5cdFx0XHRcdFx0XHRcdGlmIChwYXJlbnRPYmouY3JlYXRlTmV3VGVzdGVyICE9IG51bGwpXG5cdFx0XHRcdFx0XHRcdFx0Y3JlYXRlTmV3VGVzdGVyID0gcGFyZW50T2JqLmNyZWF0ZU5ld1Rlc3Rlcjtcblx0XHRcblx0XHRcdFx0XHRcdFx0bGV0IHRlc3Rlck5hbWU6IHN0cmluZyA9IFwiVGVzdGVyXCI7XG5cdFx0XG5cdFx0XHRcdFx0XHRcdGlmIChwYXJlbnRPYmoudGVzdGVyICE9IG51bGwpXG5cdFx0XHRcdFx0XHRcdFx0dGVzdGVyTmFtZSA9IHBhcmVudE9iai50ZXN0ZXI7XG5cdFx0XG5cdFx0XHRcdFx0XHRcdGlmIChwYXJlbnRPYmoudGVzdGVyTmFtZSAhPSBudWxsKVxuXHRcdFx0XHRcdFx0XHRcdHRlc3Rlck5hbWUgPSBwYXJlbnRPYmoudGVzdGVyTmFtZTtcblx0XHRcblx0XHRcdFx0XHRcdFx0aWYgKGNyZWF0ZU5ld1Rlc3RlciA9PT0gdHJ1ZSlcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdC8vLyBAZml4bWUgRmluZCBhIHdheSB0byBzZWN1cmVseSBhbGxvdyBkZXZzIHRvIHVzZSB0aGVpciBvd24gZHJpdmVycyBhbmQgdGVzdGVycy4uLlxuXHRcdFx0XHRcdFx0XHRcdC8vLyBAZml4bWUgSGFjayBmb3IgZGVhbGluZyB3aXRoIFdlYlBhY2sncyBicy5cblx0XHRcdFx0XHRcdFx0XHRIb3RUZXN0ZXJNb2NoYSA9IHJlcXVpcmUgKFwiLi9Ib3RUZXN0ZXJNb2NoYVwiKS5Ib3RUZXN0ZXJNb2NoYTtcblx0XHRcdFx0XHRcdFx0XHRIb3RUZXN0ZXJNb2NoYVNlbGVuaXVtID0gcmVxdWlyZSAoXCIuL0hvdFRlc3Rlck1vY2hhU2VsZW5pdW1cIikuSG90VGVzdGVyTW9jaGFTZWxlbml1bTtcblx0XHRcdFx0XHRcdFx0XHRIb3RUZXN0U2VsZW5pdW1Ecml2ZXIgPSByZXF1aXJlIChcIi4vSG90VGVzdFNlbGVuaXVtRHJpdmVyXCIpLkhvdFRlc3RTZWxlbml1bURyaXZlcjtcblx0XHRcblx0XHRcdFx0XHRcdFx0XHRpZiAocGFyZW50T2JqLnRlc3RlckFQSVVybCA9PT0gXCJcIilcblx0XHRcdFx0XHRcdFx0XHRcdHRlc3RlclVybCA9IHBhcmVudE9iai50ZXN0ZXJBUElVcmw7XG5cdFx0XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHBhcmVudE9iai5kcml2ZXIgPT09IFwiSG90VGVzdFNlbGVuaXVtRHJpdmVyXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHRkcml2ZXIgPSBuZXcgSG90VGVzdFNlbGVuaXVtRHJpdmVyICgpO1xuXHRcdFxuXHRcdFx0XHRcdFx0XHRcdGlmIChwYXJlbnRPYmoudGVzdGVyID09PSBcIkhvdFRlc3Rlck1vY2hhXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHR0ZXN0ZXIgPSBuZXcgSG90VGVzdGVyTW9jaGEgKHRoaXMsIHRlc3Rlck5hbWUsIHRlc3RlclVybCwgZHJpdmVyKTtcblx0XHRcblx0XHRcdFx0XHRcdFx0XHRpZiAocGFyZW50T2JqLnRlc3RlciA9PT0gXCJIb3RUZXN0ZXJNb2NoYVNlbGVuaXVtXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHR0ZXN0ZXIgPSBuZXcgSG90VGVzdGVyTW9jaGFTZWxlbml1bSAodGhpcywgdGVzdGVyTmFtZSwgdGVzdGVyVXJsKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0dGVzdGVyID0gdGhpcy50ZXN0ZXJzW3Rlc3Rlck5hbWVdO1xuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdGlmICh0aGlzLmhvdFNpdGUudGVzdGluZy53ZWIgIT0gbnVsbClcblx0XHRcdFx0XHRcdHNldHVwVGVzdGVyICh0aGlzLmhvdFNpdGUudGVzdGluZy53ZWIpO1xuXG5cdFx0XHRcdFx0aWYgKHRoaXMuaG90U2l0ZS50ZXN0aW5nLmFwaSAhPSBudWxsKVxuXHRcdFx0XHRcdFx0c2V0dXBUZXN0ZXIgKHRoaXMuaG90U2l0ZS50ZXN0aW5nLmFwaSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAocm91dGVzICE9IG51bGwpXG5cdFx0e1xuXHRcdFx0Zm9yIChsZXQga2V5IGluIHJvdXRlcylcblx0XHRcdHtcblx0XHRcdFx0bGV0IHJvdXRlOiBIb3RTaXRlUm91dGUgPSByb3V0ZXNba2V5XTtcblx0XHRcdFx0bGV0IGZpbGU6IEhvdEZpbGUgPSBuZXcgSG90RmlsZSAocm91dGUpO1xuXHRcdFx0XHRsZXQgcGFnZTogSG90UGFnZSA9IG5ldyBIb3RQYWdlICh7XG5cdFx0XHRcdFx0XHRwcm9jZXNzb3I6IHRoaXMsXG5cdFx0XHRcdFx0XHRuYW1lOiByb3V0ZS5uYW1lIHx8IFwiXCIsXG5cdFx0XHRcdFx0XHRyb3V0ZToga2V5LFxuXHRcdFx0XHRcdFx0ZmlsZXM6IFtmaWxlXVxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGlmICh0ZXN0ZXIgIT0gbnVsbClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmICh0aGlzLm1vZGUgPT09IERldmVsb3Blck1vZGUuRGV2ZWxvcG1lbnQpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0bGV0IG1hcE5hbWU6IHN0cmluZyA9IHJvdXRlLm5hbWU7XG5cdFx0XHRcdFx0XHRsZXQgdGVzdE1hcDogSG90VGVzdE1hcCA9IG51bGw7XG5cblx0XHRcdFx0XHRcdGlmIChyb3V0ZS5tYXAgIT0gbnVsbClcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiAocm91dGUubWFwKSA9PT0gXCJzdHJpbmdcIilcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGlmICh0ZXN0ZXIudGVzdE1hcHNbcm91dGUubWFwXSA9PSBudWxsKVxuXHRcdFx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yIChgVGVzdCBtYXAgJHtyb3V0ZS5tYXB9IGRvZXMgbm90IGV4aXN0IWApO1xuXG5cdFx0XHRcdFx0XHRcdFx0dGVzdGVyLnRlc3RNYXBzW21hcE5hbWVdID0gdGVzdGVyLnRlc3RNYXBzW3JvdXRlLm1hcF07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0dGVzdE1hcCA9IG5ldyBIb3RUZXN0TWFwICgpO1xuXHRcdFx0XHRcdFx0XHRcdGxldCBkZXN0aW5hdGlvbnM6IEhvdFRlc3REZXN0aW5hdGlvbltdIHwgeyBbbmFtZTogc3RyaW5nXTogSG90VGVzdERlc3RpbmF0aW9uIH0gPSBudWxsO1xuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHJvdXRlLm1hcCBpbnN0YW5jZW9mIEFycmF5KVxuXHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdGRlc3RpbmF0aW9ucyA9IFtdO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpSWR4ID0gMDsgaUlkeCA8IHJvdXRlLm1hcC5sZW5ndGg7IGlJZHgrKylcblx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGRlc3QgPSByb3V0ZS5tYXBbaUlkeF07XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVzdGluYXRpb25zLnB1c2ggKG5ldyBIb3RUZXN0RGVzdGluYXRpb24gKGRlc3QpKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdGRlc3RpbmF0aW9ucyA9IHt9O1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBrZXkyIGluIHJvdXRlLm1hcClcblx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGRlc3QgPSByb3V0ZS5tYXBba2V5Ml07XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVzdGluYXRpb25zW2tleTJdID0gbmV3IEhvdFRlc3REZXN0aW5hdGlvbiAoZGVzdCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0dGVzdE1hcC5kZXN0aW5hdGlvbnMgPSBkZXN0aW5hdGlvbnM7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHR0ZXN0ZXIudGVzdE1hcHNbbWFwTmFtZV0gPSB0ZXN0TWFwO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAocm91dGUuZGVzdGluYXRpb25PcmRlciAhPSBudWxsKVxuXHRcdFx0XHRcdFx0XHR0ZXN0ZXIudGVzdE1hcHNbbWFwTmFtZV0uZGVzdGluYXRpb25PcmRlciA9IHJvdXRlLmRlc3RpbmF0aW9uT3JkZXI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5hZGRQYWdlIChwYWdlKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodGhpcy5ob3RTaXRlLmFwaXMgIT0gbnVsbClcblx0XHR7XG5cdFx0XHRmb3IgKGxldCBrZXkgaW4gdGhpcy5ob3RTaXRlLmFwaXMpXG5cdFx0XHR7XG5cdFx0XHRcdGxldCBhcGkgPSB0aGlzLmhvdFNpdGUuYXBpc1trZXldO1xuXG5cdFx0XHRcdGlmIChhcGkubWFwID09IG51bGwpXG5cdFx0XHRcdFx0Y29udGludWU7XG5cblx0XHRcdFx0aWYgKEhvdFN0YXEuaXNXZWIgPT09IGZhbHNlKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PT0gRGV2ZWxvcGVyTW9kZS5EZXZlbG9wbWVudClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRsZXQgbWFwTmFtZTogc3RyaW5nID0ga2V5O1xuXHRcdFx0XHRcdFx0bGV0IHRlc3RNYXA6IEhvdFRlc3RNYXAgPSBuZXcgSG90VGVzdE1hcCAoKTtcblxuXHRcdFx0XHRcdFx0dGVzdE1hcC5kZXN0aW5hdGlvbnMgPSBbXTtcblxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgaUlkeCA9IDA7IGlJZHggPCBhcGkubWFwLmxlbmd0aDsgaUlkeCsrKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRsZXQgbWFwOiBzdHJpbmcgPSBhcGkubWFwW2lJZHhdO1xuXG5cdFx0XHRcdFx0XHRcdHRlc3RNYXAuZGVzdGluYXRpb25zLnB1c2ggKG5ldyBIb3RUZXN0RGVzdGluYXRpb24gKG1hcCkpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAodGVzdGVyID09IG51bGwpXG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvciAoYEEgdGVzdGVyIHdhcyBub3QgY3JlYXRlZCBmaXJzdCEgWW91IG11c3Qgc3BlY2lmeSBvbmUgaW4gdGhlIENMSSBvciBpbiBIb3RTaXRlLmpzb24uYCk7XG5cblx0XHRcdFx0XHRcdHRlc3Rlci50ZXN0TWFwc1ttYXBOYW1lXSA9IHRlc3RNYXA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8vIEBmaXhtZSBBbGxvdyB0aGlzIHRvIHdvcmsgZm9yIHNlcnZlci1zaWRlIGFzIHdlbGwuLi5cblx0XHRpZiAoSG90U3RhcS5pc1dlYiA9PT0gdHJ1ZSlcblx0XHR7XG5cdFx0XHRmb3IgKGxldCBrZXkgaW4gdGhpcy5ob3RTaXRlLmNvbXBvbmVudHMpXG5cdFx0XHR7XG5cdFx0XHRcdGxldCBjb21wb25lbnQgPSB0aGlzLmhvdFNpdGUuY29tcG9uZW50c1trZXldO1xuXHRcdFx0XHRsZXQgY29tcG9uZW50VXJsOiBzdHJpbmcgPSBjb21wb25lbnQudXJsO1xuXG5cdFx0XHRcdC8vLyBAZml4bWUgQ3JlYXRlIHVuaXQgdGVzdCBmb3IgZmV0Y2hpbmcsIGxvYWRpbmcsIGFuZCByZWdpc3RlcmluZy5cblx0XHRcdFx0bGV0IHJlczogYW55ID0gYXdhaXQgZmV0Y2ggKGNvbXBvbmVudFVybCk7XG5cdFx0XHRcdGxldCBuZXdDb21wb25lbnQ6IEhvdENvbXBvbmVudCA9IGV2YWwgKHJlcyk7XG5cblx0XHRcdFx0dGhpcy5hZGRDb21wb25lbnQgKG5ld0NvbXBvbmVudCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuaG90U2l0ZS5yb3V0ZXMgPT0gbnVsbClcblx0XHRcdHRoaXMuaG90U2l0ZS5yb3V0ZXMgPSB7fTtcblxuXHRcdGF3YWl0IHRoaXMubG9hZEhvdEZpbGVzICh0aGlzLmhvdFNpdGUuZmlsZXMpO1xuXG5cdFx0aWYgKHRlc3RlciAhPSBudWxsKVxuXHRcdFx0dGhpcy5hZGRUZXN0ZXIgKHRlc3Rlcik7XG5cdH1cblxuXHQvKipcblx0ICogTG9hZCBhbiBhcnJheSBvZiBmaWxlcy4gSWYgYSBmaWxlIGFscmVhZHkgaGFzIGNvbnRlbnQsIGl0IHdpbGwgbm90IGJlIHJlbG9hZGVkIFxuXHQgKiB1bmxlc3MgZm9yY2VDb250ZW50TG9hZGluZyBpcyBzZXQgdG8gdHJ1ZS5cblx0ICovXG5cdGFzeW5jIGxvYWRIb3RGaWxlcyAoZmlsZXM6IHsgW25hbWU6IHN0cmluZ106IHsgdXJsPzogc3RyaW5nOyBsb2NhbEZpbGU/OiBzdHJpbmc7IGNvbnRlbnQ/OiBzdHJpbmc7IH0gfSwgXG5cdFx0XHRmb3JjZUNvbnRlbnRMb2FkaW5nOiBib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPHZvaWQ+XG5cdHtcblx0XHRmb3IgKGxldCBrZXkgaW4gZmlsZXMpXG5cdFx0e1xuXHRcdFx0bGV0IGZpbGUgPSBmaWxlc1trZXldO1xuXHRcdFx0bGV0IG5ld0ZpbGU6IEhvdEZpbGUgPSBudWxsO1xuXG5cdFx0XHRpZiAoSG90U3RhcS5pc1dlYiA9PT0gdHJ1ZSlcblx0XHRcdHtcblx0XHRcdFx0bmV3RmlsZSA9IG5ldyBIb3RGaWxlICh7XG5cdFx0XHRcdFx0XHRcIm5hbWVcIjoga2V5XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdG5ld0ZpbGUgPSBuZXcgSG90RmlsZSAoe1xuXHRcdFx0XHRcdFx0XCJuYW1lXCI6IGtleVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZmlsZS51cmwgIT0gbnVsbClcblx0XHRcdFx0bmV3RmlsZS51cmwgPSBmaWxlLnVybDtcblxuXHRcdFx0aWYgKEhvdFN0YXEuaXNXZWIgPT09IGZhbHNlKVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAoZmlsZS5sb2NhbEZpbGUgIT0gbnVsbClcblx0XHRcdFx0XHRuZXdGaWxlLmxvY2FsRmlsZSA9IGZpbGUubG9jYWxGaWxlO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgbG9hZENvbnRlbnQ6IGJvb2xlYW4gPSB0cnVlO1xuXG5cdFx0XHRpZiAoZmlsZS5jb250ZW50ICE9IG51bGwpXG5cdFx0XHR7XG5cdFx0XHRcdG5ld0ZpbGUuY29udGVudCA9IGZpbGUuY29udGVudDtcblx0XHRcdFx0bG9hZENvbnRlbnQgPSBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGZvcmNlQ29udGVudExvYWRpbmcgPT09IHRydWUpXG5cdFx0XHRcdGxvYWRDb250ZW50ID0gdHJ1ZTtcblxuXHRcdFx0aWYgKGxvYWRDb250ZW50ID09PSB0cnVlKVxuXHRcdFx0XHRhd2FpdCBuZXdGaWxlLmxvYWQgKCk7XG5cblx0XHRcdHRoaXMuYWRkRmlsZSAobmV3RmlsZSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEdlbmVyYXRlIHRoZSBjb250ZW50IHRvIHNlbmQgdG8gYSBjbGllbnQuXG5cdCAqL1xuXHRnZW5lcmF0ZUNvbnRlbnQgKHJvdXRlS2V5OiBzdHJpbmcsIG5hbWU6IHN0cmluZyA9IFwiXCIsIHVybDogc3RyaW5nID0gXCIuL1wiLFxuXHRcdFx0anNTcmNQYXRoOiBzdHJpbmcgPSBcIi4vanMvSG90U3RhcS5qc1wiLCBwYXNzQXJnczogYm9vbGVhbiA9IHRydWUsIFxuXHRcdFx0YXJnczogYW55ID0gbnVsbCk6IHN0cmluZ1xuXHR7XG5cdFx0bGV0IGFwaVNjcmlwdHM6IHN0cmluZyA9IFwiXCI7XG5cdFx0bGV0IGFwaUNvZGU6IHN0cmluZyA9IFwiXCI7XG5cdFx0bGV0IHB1YmxpY1NlY3JldHM6IHN0cmluZyA9IFwiXCI7XG5cblx0XHQvLy8gQHRvZG8gT3B0aW1pemUgdGhpcyBmdW5jdGlvbiBhcyBtdWNoIGFzIHBvc3NpYmxlLlxuXG5cdFx0Ly8gTG9hZCB0aGUgQVBJIHN0cmluZy5cblx0XHRpZiAodGhpcy5ob3RTaXRlICE9IG51bGwpXG5cdFx0e1xuXHRcdFx0aWYgKHRoaXMuaG90U2l0ZS5zZXJ2ZXIuZ2xvYmFsQXBpICE9IG51bGwpXG5cdFx0XHR7XG5cdFx0XHRcdGlmICh0aGlzLmhvdFNpdGUuc2VydmVyLmdsb2JhbEFwaSAhPT0gXCJcIilcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNvbnN0IGdsb2JhbEFwaSA9IHRoaXMuaG90U2l0ZS5hcGlzW3RoaXMuaG90U2l0ZS5zZXJ2ZXIuZ2xvYmFsQXBpXTtcblxuXHRcdFx0XHRcdGlmIChnbG9iYWxBcGkgPT0gbnVsbClcblx0XHRcdFx0XHRcdHRoaXMubG9nZ2VyLndhcm5pbmcgKGBBUEkgd2l0aCBuYW1lICR7dGhpcy5ob3RTaXRlLnNlcnZlci5nbG9iYWxBcGl9IGRvZXNuJ3QgZXhpc3QhYCk7XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGxldCBzZW5kSlNDb250ZW50OiBib29sZWFuID0gdHJ1ZTtcblxuXHRcdFx0XHRcdFx0aWYgKGdsb2JhbEFwaS5qc2FwaSA9PSBudWxsKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRzZW5kSlNDb250ZW50ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdHRoaXMubG9nZ2VyLndhcm5pbmcgKGBBUEkgd2l0aCBuYW1lICR7dGhpcy5ob3RTaXRlLnNlcnZlci5nbG9iYWxBcGl9IGRvZXNuJ3QgaGF2ZSBhIGpzYXBpIHNldC4gV2lsbCBub3Qgc2VuZCBqcyBjb250ZW50IHRvIGNsaWVudC5gKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKGdsb2JhbEFwaS5saWJyYXJ5TmFtZSA9PSBudWxsKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRzZW5kSlNDb250ZW50ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdHRoaXMubG9nZ2VyLndhcm5pbmcgKGBBUEkgd2l0aCBuYW1lICR7dGhpcy5ob3RTaXRlLnNlcnZlci5nbG9iYWxBcGl9IGRvZXNuJ3QgaGF2ZSBhIGxpYnJhcnlOYW1lIHNldC4gV2lsbCBub3Qgc2VuZCBqcyBjb250ZW50IHRvIGNsaWVudC5gKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKGdsb2JhbEFwaS5hcGlOYW1lID09IG51bGwpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHNlbmRKU0NvbnRlbnQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0dGhpcy5sb2dnZXIud2FybmluZyAoYEFQSSB3aXRoIG5hbWUgJHt0aGlzLmhvdFNpdGUuc2VydmVyLmdsb2JhbEFwaX0gZG9lc24ndCBoYXZlIGEgYXBpTmFtZSBzZXQuIFdpbGwgbm90IHNlbmQganMgY29udGVudCB0byBjbGllbnQuYCk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmIChzZW5kSlNDb250ZW50ID09PSB0cnVlKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRhcGlTY3JpcHRzICs9IGBcXHQ8c2NyaXB0IHR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiIHNyYyA9IFwiJHtnbG9iYWxBcGkuanNhcGl9XCI+PC9zY3JpcHQ+XFxuYDtcblxuXHRcdFx0XHRcdFx0XHRsZXQgYmFzZVVybDogc3RyaW5nID0gXCJcXFwiXFxcIlwiO1xuXG5cdFx0XHRcdFx0XHRcdGlmICh0aGlzLmFwaSAhPSBudWxsKVxuXHRcdFx0XHRcdFx0XHRcdGJhc2VVcmwgPSBgXFxcIiR7dGhpcy5hcGkuYmFzZVVybH1cXFwiYDtcblxuXHRcdFx0XHRcdFx0XHRsZXQgdGVtcEFQSUNvbnRlbnQ6IHN0cmluZyA9IHRoaXMuYXBpQ29udGVudDtcblx0XHRcdFx0XHRcdFx0dGVtcEFQSUNvbnRlbnQgPSB0ZW1wQVBJQ29udGVudC5yZXBsYWNlICgvXFwlYXBpXFxfbmFtZVxcJS9nLCBnbG9iYWxBcGkuYXBpTmFtZSk7XG5cdFx0XHRcdFx0XHRcdHRlbXBBUElDb250ZW50ID0gdGVtcEFQSUNvbnRlbnQucmVwbGFjZSAoL1xcJWFwaVxcX2V4cG9ydGVkXFxfbmFtZVxcJS9nLCBnbG9iYWxBcGkubGlicmFyeU5hbWUpO1xuXHRcdFx0XHRcdFx0XHR0ZW1wQVBJQ29udGVudCA9IHRlbXBBUElDb250ZW50LnJlcGxhY2UgKC9cXCViYXNlXFxfdXJsXFwlL2csIGJhc2VVcmwpO1xuXG5cdFx0XHRcdFx0XHRcdGFwaUNvZGUgKz0gdGVtcEFQSUNvbnRlbnQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLmhvdFNpdGUuYXBpcyAhPSBudWxsKVxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgcm91dGUgPSB0aGlzLmhvdFNpdGUucm91dGVzW3JvdXRlS2V5XTtcblxuXHRcdFx0XHRpZiAocm91dGUgIT0gbnVsbClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmIChyb3V0ZS5hcGkgIT0gbnVsbClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRsZXQgYXBpID0gdGhpcy5ob3RTaXRlLmFwaXNbcm91dGUuYXBpXTtcblxuXHRcdFx0XHRcdFx0aWYgKGFwaSA9PSBudWxsKVxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IgKGBVbmFibGUgdG8gZmluZCBBUEkgJHtyb3V0ZS5hcGl9YCk7XG5cblx0XHRcdFx0XHRcdGxldCBzZW5kSlNDb250ZW50OiBib29sZWFuID0gdHJ1ZTtcblxuXHRcdFx0XHRcdFx0aWYgKGFwaS5qc2FwaSA9PSBudWxsKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRzZW5kSlNDb250ZW50ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdHRoaXMubG9nZ2VyLndhcm5pbmcgKGBBUEkgd2l0aCBuYW1lICR7cm91dGUuYXBpfSBkb2Vzbid0IGhhdmUgYSBqc2FwaSBzZXQuIFdpbGwgbm90IHNlbmQganMgY29udGVudCB0byBjbGllbnQuYCk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmIChhcGkubGlicmFyeU5hbWUgPT0gbnVsbClcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0c2VuZEpTQ29udGVudCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR0aGlzLmxvZ2dlci53YXJuaW5nIChgQVBJIHdpdGggbmFtZSAke3JvdXRlLmFwaX0gZG9lc24ndCBoYXZlIGEgbGlicmFyeU5hbWUgc2V0LiBXaWxsIG5vdCBzZW5kIGpzIGNvbnRlbnQgdG8gY2xpZW50LmApO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAoYXBpLmFwaU5hbWUgPT0gbnVsbClcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0c2VuZEpTQ29udGVudCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR0aGlzLmxvZ2dlci53YXJuaW5nIChgQVBJIHdpdGggbmFtZSAke3JvdXRlLmFwaX0gZG9lc24ndCBoYXZlIGEgYXBpTmFtZSBzZXQuIFdpbGwgbm90IHNlbmQganMgY29udGVudCB0byBjbGllbnQuYCk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmIChzZW5kSlNDb250ZW50ID09PSB0cnVlKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRsZXQganNhcGlwYXRoID0gYXBpLmpzYXBpO1xuXHRcdFx0XHRcdFx0XHRhcGlTY3JpcHRzICs9IGBcXHQ8c2NyaXB0IHR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiIHNyYyA9IFwiJHtqc2FwaXBhdGh9XCI+PC9zY3JpcHQ+XFxuYDtcblxuXHRcdFx0XHRcdFx0XHRsZXQgYmFzZVVybDogc3RyaW5nID0gXCJcXFwiXFxcIlwiO1xuXG5cdFx0XHRcdFx0XHRcdGlmICh0aGlzLmFwaSAhPSBudWxsKVxuXHRcdFx0XHRcdFx0XHRcdGJhc2VVcmwgPSBgXFxcIiR7dGhpcy5hcGkuYmFzZVVybH1cXFwiYDtcblxuXHRcdFx0XHRcdFx0XHRsZXQgdGVtcEFQSUNvbnRlbnQ6IHN0cmluZyA9IHRoaXMuYXBpQ29udGVudDtcblx0XHRcdFx0XHRcdFx0dGVtcEFQSUNvbnRlbnQgPSB0ZW1wQVBJQ29udGVudC5yZXBsYWNlICgvXFwlYXBpXFxfbmFtZVxcJS9nLCBhcGkuYXBpTmFtZSk7XG5cdFx0XHRcdFx0XHRcdHRlbXBBUElDb250ZW50ID0gdGVtcEFQSUNvbnRlbnQucmVwbGFjZSAoL1xcJWFwaVxcX2V4cG9ydGVkXFxfbmFtZVxcJS9nLCBhcGkubGlicmFyeU5hbWUpO1xuXHRcdFx0XHRcdFx0XHR0ZW1wQVBJQ29udGVudCA9IHRlbXBBUElDb250ZW50LnJlcGxhY2UgKC9cXCViYXNlXFxfdXJsXFwlL2csIGJhc2VVcmwpO1xuXG5cdFx0XHRcdFx0XHRcdGFwaUNvZGUgKz0gdGVtcEFQSUNvbnRlbnQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLmhvdFNpdGUuc2VydmVyICE9IG51bGwpXG5cdFx0XHR7XG5cdFx0XHRcdGlmICh0aGlzLmhvdFNpdGUuc2VydmVyLmpzU3JjUGF0aCAhPSBudWxsKVxuXHRcdFx0XHRcdGpzU3JjUGF0aCA9IHRoaXMuaG90U2l0ZS5zZXJ2ZXIuanNTcmNQYXRoO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5ob3RTaXRlLnB1YmxpY1NlY3JldHMgIT0gbnVsbClcblx0XHRcdHtcblx0XHRcdFx0Zm9yIChsZXQga2V5IGluIHRoaXMuaG90U2l0ZS5wdWJsaWNTZWNyZXRzKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bGV0IHNlY3JldCA9IHRoaXMuaG90U2l0ZS5wdWJsaWNTZWNyZXRzW2tleV07XG5cdFx0XHRcdFx0bGV0IHZhbHVlOiBzdHJpbmcgPSB1bmRlZmluZWQ7XG5cblx0XHRcdFx0XHRpZiAodHlwZW9mIChzZWNyZXQpID09PSBcInN0cmluZ1wiKVxuXHRcdFx0XHRcdFx0dmFsdWUgPSBKU09OLnN0cmluZ2lmeSAoc2VjcmV0KTtcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aWYgKEhvdFN0YXEuaXNXZWIgPT09IGZhbHNlKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRpZiAodGhpcy5hcGkgIT0gbnVsbClcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGlmICh0aGlzLmFwaS5jb25uZWN0aW9uID09IG51bGwpXG5cdFx0XHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IgKGBDYW5ub3QgcGFzcyBzZWNyZXRzIGZyb20gdGhlIEFQSSBpZiB0aGVyZSdzIG5vIGNvbm5lY3Rpb24hYCk7XG5cblx0XHRcdFx0XHRcdFx0XHRsZXQgc2VydmVyQ29ubjogSG90U2VydmVyID0gKDxIb3RTZXJ2ZXI+dGhpcy5hcGkuY29ubmVjdGlvbik7XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAoc2VjcmV0LnBhc3NTZWNyZXRGcm9tQVBJICE9IG51bGwpXG5cdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZSA9IEpTT04uc3RyaW5naWZ5IChzZXJ2ZXJDb25uLnNlY3JldHNba2V5XSk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRpZiAoc2VjcmV0LmVudiAhPSBudWxsKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0Ly8vIEBmaXhtZSBAc2VjdnVsIElzIHRoaXMgYSBzZWN1cml0eSB2dWxuZXJhYmlsaXR5PyBOZWVkIHRvIHZlcmlmeSB0aGF0IFxuXHRcdFx0XHRcdFx0XHRcdC8vLyBvbmx5IHRoZSBzZXJ2ZXIgaGFzIGFjY2VzcyB0byB0aGlzLiBBdCB0aGlzIHBvaW50LCBJIHRoaW5rIG9ubHkgdGhlIFxuXHRcdFx0XHRcdFx0XHRcdC8vLyBzZXJ2ZXIgaGFzIGFjY2Vzcy5cblx0XHRcdFx0XHRcdFx0XHRjb25zdCBlbnZLZXk6IHN0cmluZyA9IHNlY3JldC5lbnY7XG5cblx0XHRcdFx0XHRcdFx0XHR2YWx1ZSA9IEpTT04uc3RyaW5naWZ5IChwcm9jZXNzLmVudltlbnZLZXldKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHB1YmxpY1NlY3JldHMgKz0gYHByb2Nlc3Nvci5wdWJsaWNTZWNyZXRzW1wiJHtrZXl9XCJdID0gJHt2YWx1ZX07XFxuYDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGxldCBjb250ZW50OiBzdHJpbmcgPSB0aGlzLnBhZ2VDb250ZW50O1xuXHRcdGxldCBmaXhDb250ZW50ID0gKHRlbXBDb250ZW50OiBzdHJpbmcpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGxldCBkZXZlbG9wZXJNb2RlU3RyOiBzdHJpbmcgPSBcIlwiO1xuXHRcdFx0XHRsZXQgdGVzdGVyQVBJU3RyOiBzdHJpbmcgPSBcIlwiO1xuXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgPT09IERldmVsb3Blck1vZGUuRGV2ZWxvcG1lbnQpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRkZXZlbG9wZXJNb2RlU3RyID0gYHRlbXBNb2RlID0gSG90U3RhcVdlYi5EZXZlbG9wZXJNb2RlLkRldmVsb3BtZW50O2A7XG5cdFx0XHRcdFx0dGVzdGVyQVBJU3RyID0gdGhpcy50ZXN0ZXJBcGlDb250ZW50O1xuXG5cdFx0XHRcdFx0aWYgKHRoaXMuaG90U2l0ZSAhPSBudWxsKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGlmICh0aGlzLmhvdFNpdGUudGVzdGluZyAhPSBudWxsKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRpZiAodGhpcy5ob3RTaXRlLnRlc3Rpbmcud2ViLnRlc3RlckFQSVVybCA9PSBudWxsKVxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuaG90U2l0ZS50ZXN0aW5nLndlYi50ZXN0ZXJBUElVcmwgPSBcImh0dHA6Ly8xMjcuMC4wLjE6ODE4MlwiO1xuXG5cdFx0XHRcdFx0XHRcdHRlc3RlckFQSVN0ciA9IHRlc3RlckFQSVN0ci5yZXBsYWNlICgvXFwlYmFzZVxcX3Rlc3RlclxcX3VybFxcJS9nLCBgXFxcIiR7dGhpcy5ob3RTaXRlLnRlc3Rpbmcud2ViLnRlc3RlckFQSVVybH1cXFwiYCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IGxvYWRGaWxlczogc3RyaW5nID0gXCJcIjtcblxuXHRcdFx0XHRpZiAoT2JqZWN0LmtleXMgKHRoaXMuZmlsZXMpLmxlbmd0aCA+IDApXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRsb2FkRmlsZXMgKz0gYHZhciBmaWxlcyA9IHt9O1xcblxcbmA7XG5cblx0XHRcdFx0XHRmb3IgKGxldCBrZXkgaW4gdGhpcy5maWxlcylcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRsZXQgZmlsZSA9IHRoaXMuZmlsZXNba2V5XTtcblx0XHRcdFx0XHRcdGxldCBmaWxlVXJsOiBzdHJpbmcgPSBgXCIke2ZpbGUudXJsfVwiYDtcblx0XHRcdFx0XHRcdGxldCBmaWxlQ29udGVudDogc3RyaW5nID0gXCJcIjtcblxuXHRcdFx0XHRcdFx0aWYgKGZpbGUuY29udGVudCAhPT0gXCJcIilcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0bGV0IGVzY2FwZWRDb250ZW50OiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSAoZmlsZS5jb250ZW50KTtcblxuXHRcdFx0XHRcdFx0XHQvLyBGaW5kIGFueSBzY3JpcHQgdGFncyBhbmQgaW50ZXJydXB0IHRoZW0gc28gdGhlIEhUTUwgcGFyc2VycyBcblx0XHRcdFx0XHRcdFx0Ly8gZG9uJ3QgZ2V0IGNvbmZ1c2VkLlxuXHRcdFx0XHRcdFx0XHRlc2NhcGVkQ29udGVudCA9IGVzY2FwZWRDb250ZW50LnJlcGxhY2UgKG5ldyBSZWdFeHAgKFwiXFxcXDxzY3JpcHRcIiwgXCJnbWlcIiksIFwiPHNjclxcXCIgKyBcXFwiaXB0XCIpO1xuXHRcdFx0XHRcdFx0XHRlc2NhcGVkQ29udGVudCA9IGVzY2FwZWRDb250ZW50LnJlcGxhY2UgKG5ldyBSZWdFeHAgKFwiXFxcXDxcXFxcL3NjcmlwdFwiLCBcImdtaVwiKSwgXCI8L3NjclxcXCIgKyBcXFwiaXB0XCIpO1xuXG5cdFx0XHRcdFx0XHRcdGZpbGVDb250ZW50ID0gYCwgXCJjb250ZW50XCI6ICR7ZXNjYXBlZENvbnRlbnR9YDtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0bG9hZEZpbGVzICs9IGBcXHRcXHRcXHRmaWxlc1tcIiR7a2V5fVwiXSA9IHsgXCJ1cmxcIjogJHtmaWxlVXJsfSR7ZmlsZUNvbnRlbnR9IH07XFxuYDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRsb2FkRmlsZXMgKz0gYFxcdFxcdFxcdHByb21pc2VzLnB1c2ggKHByb2Nlc3Nvci5sb2FkSG90RmlsZXMgKGZpbGVzKSk7XFxuYDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRlbXBDb250ZW50ID0gdGVtcENvbnRlbnQucmVwbGFjZSAoL1xcJXRpdGxlXFwlL2csIG5hbWUpO1xuXG5cdFx0XHRcdGlmIChwYXNzQXJncyA9PT0gdHJ1ZSlcblx0XHRcdFx0XHR0ZW1wQ29udGVudCA9IHRlbXBDb250ZW50LnJlcGxhY2UgKC9cXCVhcmdzXFwlL2csIFwiSG90LkFyZ3VtZW50c1wiKTtcblxuXHRcdFx0XHRpZiAoYXJncyAhPSBudWxsKVxuXHRcdFx0XHRcdHRlbXBDb250ZW50ID0gdGVtcENvbnRlbnQucmVwbGFjZSAoL1xcJWFyZ3NcXCUvZywgSlNPTi5zdHJpbmdpZnkgKGFyZ3MpKTtcblxuXHRcdFx0XHRsZXQgdGVzdGVyTWFwOiBzdHJpbmcgPSByb3V0ZUtleTtcblx0XHRcdFx0bGV0IHRlc3RlclVybDogc3RyaW5nID0gXCJcIjtcblx0XHRcdFx0bGV0IHRlc3RlckxhdW5jaHBhZFVybDogc3RyaW5nID0gXCJcIjtcblx0XHRcdFx0bGV0IHRlc3Rlck5hbWU6IHN0cmluZyA9IFwiVGVzdGVyXCI7XG5cblx0XHRcdFx0aWYgKHRoaXMuaG90U2l0ZSAhPSBudWxsKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWYgKHRoaXMuaG90U2l0ZS50ZXN0aW5nICE9IG51bGwpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aWYgKHRoaXMuaG90U2l0ZS50ZXN0aW5nLndlYi50ZXN0ZXIgIT0gbnVsbClcblx0XHRcdFx0XHRcdFx0dGVzdGVyTmFtZSA9IHRoaXMuaG90U2l0ZS50ZXN0aW5nLndlYi50ZXN0ZXI7XG5cblx0XHRcdFx0XHRcdGlmICh0aGlzLmhvdFNpdGUudGVzdGluZy53ZWIudGVzdGVyTmFtZSAhPSBudWxsKVxuXHRcdFx0XHRcdFx0XHR0ZXN0ZXJOYW1lID0gdGhpcy5ob3RTaXRlLnRlc3Rpbmcud2ViLnRlc3Rlck5hbWU7XG5cblx0XHRcdFx0XHRcdGlmICh0aGlzLmhvdFNpdGUudGVzdGluZy53ZWIudGVzdGVyQVBJVXJsICE9IG51bGwpXG5cdFx0XHRcdFx0XHRcdHRlc3RlclVybCA9IHRoaXMuaG90U2l0ZS50ZXN0aW5nLndlYi50ZXN0ZXJBUElVcmw7XG5cblx0XHRcdFx0XHRcdGlmICh0aGlzLmhvdFNpdGUudGVzdGluZy53ZWIubGF1bmNocGFkVXJsICE9IG51bGwpXG5cdFx0XHRcdFx0XHRcdHRlc3RlckxhdW5jaHBhZFVybCA9IHRoaXMuaG90U2l0ZS50ZXN0aW5nLndlYi5sYXVuY2hwYWRVcmw7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHRoaXMuaG90U2l0ZS5yb3V0ZXMgIT0gbnVsbClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRpZiAodGhpcy5ob3RTaXRlLnJvdXRlc1tyb3V0ZUtleV0gIT0gbnVsbClcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0bGV0IHJvdXRlID0gdGhpcy5ob3RTaXRlLnJvdXRlc1tyb3V0ZUtleV07XG5cdFx0XHRcdFx0XHRcdHRlc3Rlck1hcCA9IHJvdXRlLm5hbWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGVtcENvbnRlbnQgPSB0ZW1wQ29udGVudC5yZXBsYWNlICgvXFwlaG90c3RhcVxcX2pzXFxfc3JjXFwlL2csIGpzU3JjUGF0aCk7XG5cdFx0XHRcdHRlbXBDb250ZW50ID0gdGVtcENvbnRlbnQucmVwbGFjZSAoL1xcJWRldmVsb3BlclxcX21vZGVcXCUvZywgZGV2ZWxvcGVyTW9kZVN0cik7XG5cdFx0XHRcdHRlbXBDb250ZW50ID0gdGVtcENvbnRlbnQucmVwbGFjZSAoL1xcJXRlc3RlclxcX2FwaVxcJS9nLCB0ZXN0ZXJBUElTdHIpO1xuXHRcdFx0XHR0ZW1wQ29udGVudCA9IHRlbXBDb250ZW50LnJlcGxhY2UgKC9cXCVhcGlzXFxfdG9cXF9sb2FkXFwlL2csIGFwaVNjcmlwdHMpO1xuXHRcdFx0XHR0ZW1wQ29udGVudCA9IHRlbXBDb250ZW50LnJlcGxhY2UgKC9cXCVsb2FkXFxfaG90XFxfc2l0ZVxcJS9nLCBcIlwiKTsgLy8vIEBmaXhtZSBTaG91bGQgdGhpcyBvbmx5IGJlIGRvbmUgc2VydmVyLXNpZGU/XG5cdFx0XHRcdHRlbXBDb250ZW50ID0gdGVtcENvbnRlbnQucmVwbGFjZSAoL1xcJWxvYWRcXF9maWxlc1xcJS9nLCBsb2FkRmlsZXMpO1xuXHRcdFx0XHR0ZW1wQ29udGVudCA9IHRlbXBDb250ZW50LnJlcGxhY2UgKC9cXCVhcGlcXF9jb2RlXFwlL2csIGFwaUNvZGUpO1xuXHRcdFx0XHR0ZW1wQ29udGVudCA9IHRlbXBDb250ZW50LnJlcGxhY2UgKC9cXCVwdWJsaWNcXF9zZWNyZXRzXFwlL2csIHB1YmxpY1NlY3JldHMpO1xuXHRcdFx0XHR0ZW1wQ29udGVudCA9IHRlbXBDb250ZW50LnJlcGxhY2UgKC9cXCV1cmxcXCUvZywgdXJsKTtcblx0XHRcdFx0dGVtcENvbnRlbnQgPSB0ZW1wQ29udGVudC5yZXBsYWNlICgvXFwldGVzdGVyXFxfbmFtZVxcJS9nLCBgXCIke3Rlc3Rlck5hbWV9XCJgKTtcblx0XHRcdFx0dGVtcENvbnRlbnQgPSB0ZW1wQ29udGVudC5yZXBsYWNlICgvXFwldGVzdGVyXFxfbWFwXFwlL2csIGBcIiR7dGVzdGVyTWFwfVwiYCk7XG5cdFx0XHRcdHRlbXBDb250ZW50ID0gdGVtcENvbnRlbnQucmVwbGFjZSAoL1xcJXRlc3RlclxcX2FwaVxcX2Jhc2VcXF91cmxcXCUvZywgYFwiJHt0ZXN0ZXJVcmx9XCJgKTtcblx0XHRcdFx0dGVtcENvbnRlbnQgPSB0ZW1wQ29udGVudC5yZXBsYWNlICgvXFwldGVzdGVyXFxfbGF1bmNocGFkXFxfdXJsXFwlL2csIGBcIiR7dGVzdGVyTGF1bmNocGFkVXJsfVwiYCk7XG5cblx0XHRcdFx0cmV0dXJuICh0ZW1wQ29udGVudCk7XG5cdFx0XHR9O1xuXHRcdGNvbnRlbnQgPSBmaXhDb250ZW50IChjb250ZW50KTtcblxuXHRcdHJldHVybiAoY29udGVudCk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlIHRoZSBFeHByZXNzIHJvdXRlcyBmcm9tIHRoZSBnaXZlbiBwYWdlcy4gQmUgc3VyZSB0byBsb2FkIHRoZSBcblx0ICogcGFnZXMgZmlyc3QgYmVmb3JlIGRvaW5nIHRoaXMuIFRoaXMgbWV0aG9kIGlzIG1lYW50IHRvIGJlIHVzZWQgZm9yIFxuXHQgKiBjdXN0b21pemVkIEV4cHJlc3MgYXBwbGljYXRpb25zLiBJZiB5b3Ugd2lzaCB0byB1c2UgdGhlIGxvYWRlZCByb3V0ZXMgXG5cdCAqIGZyb20gdGhpcyBIb3RTdGFxIG9iamVjdCB3aXRoIEhvdEhUVFBTZXJ2ZXIsIGJlIHN1cmUgdG8gdXNlIFxuXHQgKiB0aGUgbG9hZEhvdFNpdGUgbWV0aG9kIGluIEhvdEhUVFBTZXJ2ZXIuXG5cdCAqL1xuXHRjcmVhdGVFeHByZXNzUm91dGVzIChleHByZXNzQXBwOiBhbnksIGpzU3JjUGF0aDogc3RyaW5nID0gXCIuL2pzL0hvdFN0YXEuanNcIik6IHZvaWRcblx0e1xuXHRcdGZvciAobGV0IGtleSBpbiB0aGlzLnBhZ2VzKVxuXHRcdHtcblx0XHRcdGxldCBwYWdlOiBIb3RQYWdlID0gdGhpcy5wYWdlc1trZXldO1xuXHRcdFx0Y29uc3QgY29udGVudDogc3RyaW5nID0gdGhpcy5nZW5lcmF0ZUNvbnRlbnQgKHBhZ2Uucm91dGUsIHBhZ2UubmFtZSwgcGFnZS5maWxlc1swXS51cmwsIGpzU3JjUGF0aCk7XG5cblx0XHRcdGV4cHJlc3NBcHAuZ2V0IChwYWdlLnJvdXRlLCAocmVxOiBhbnksIHJlczogYW55KSA9PlxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmVzLnNlbmQgKGNvbnRlbnQpO1xuXHRcdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQWRkIGEgdGVzdGVyIGZvciB1c2UgbGF0ZXIuXG5cdCAqL1xuXHRhZGRUZXN0ZXIgKHRlc3RlcjogSG90VGVzdGVyKTogdm9pZFxuXHR7XG5cdFx0dGhpcy50ZXN0ZXJzW3Rlc3Rlci5uYW1lXSA9IHRlc3Rlcjtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgdGhlIGxpc3Qgb2YgbWFwcyBmb3IgdGVzdGluZyBmcm9tIHRoZSBIb3RTaXRlLlxuXHQgKi9cblx0Z2V0V2ViVGVzdGluZ01hcHMgKCk6IHN0cmluZ1tdXG5cdHtcblx0XHRpZiAodGhpcy5ob3RTaXRlID09IG51bGwpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IgKFwiTm8gSG90U2l0ZSB3YXMgbG9hZGVkIVwiKTtcblxuXHRcdGlmICh0aGlzLmhvdFNpdGUudGVzdGluZyA9PSBudWxsKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yIChcIlRoZSBIb3RTaXRlIGRvZXMgbm90IGhhdmUgYSB0ZXN0aW5nIG9iamVjdCFcIik7XG5cblx0XHRpZiAodGhpcy5ob3RTaXRlLnRlc3Rpbmcud2ViID09IG51bGwpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IgKFwiVGhlIEhvdFNpdGUgZG9lcyBub3QgaGF2ZSBhIHRlc3Rpbmcgd2ViIG9iamVjdCFcIik7XG5cblx0XHRpZiAodGhpcy5ob3RTaXRlLnRlc3Rpbmcud2ViLm1hcHMgPT0gbnVsbClcblx0XHRcdHRocm93IG5ldyBFcnJvciAoXCJUaGUgSG90U2l0ZSB0ZXN0aW5nIG9iamVjdCBkb2VzIG5vdCBoYXZlIGFueSBtYXBzIVwiKTtcblxuXHRcdHJldHVybiAodGhpcy5ob3RTaXRlLnRlc3Rpbmcud2ViLm1hcHMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCB0aGUgbGlzdCBvZiBtYXBzIGZvciB0ZXN0aW5nIGZyb20gdGhlIEhvdFNpdGUuXG5cdCAqL1xuXHRnZXRBUElUZXN0aW5nTWFwcyAoKTogc3RyaW5nW11cblx0e1xuXHRcdGlmICh0aGlzLmhvdFNpdGUgPT0gbnVsbClcblx0XHRcdHRocm93IG5ldyBFcnJvciAoXCJObyBIb3RTaXRlIHdhcyBsb2FkZWQhXCIpO1xuXG5cdFx0aWYgKHRoaXMuaG90U2l0ZS50ZXN0aW5nID09IG51bGwpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IgKFwiVGhlIEhvdFNpdGUgZG9lcyBub3QgaGF2ZSBhIHRlc3Rpbmcgb2JqZWN0IVwiKTtcblxuXHRcdGlmICh0aGlzLmhvdFNpdGUudGVzdGluZy5hcGkgPT0gbnVsbClcblx0XHRcdHRocm93IG5ldyBFcnJvciAoXCJUaGUgSG90U2l0ZSBkb2VzIG5vdCBoYXZlIGEgdGVzdGluZyBhcGkgb2JqZWN0IVwiKTtcblxuXHRcdGlmICh0aGlzLmhvdFNpdGUudGVzdGluZy5hcGkubWFwcyA9PSBudWxsKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yIChcIlRoZSBIb3RTaXRlIHRlc3Rpbmcgb2JqZWN0IGRvZXMgbm90IGhhdmUgYW55IG1hcHMhXCIpO1xuXG5cdFx0cmV0dXJuICh0aGlzLmhvdFNpdGUudGVzdGluZy5hcGkubWFwcyk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IGEgcm91dGUncyBrZXkgZnJvbSBhIHJvdXRlJ3MgbmFtZS5cblx0ICovXG5cdGdldFJvdXRlS2V5RnJvbU5hbWUgKG5hbWU6IHN0cmluZyk6IHN0cmluZ1xuXHR7XG5cdFx0bGV0IGZvdW5kS2V5OiBzdHJpbmcgPSBcIlwiO1xuXG5cdFx0aWYgKHRoaXMuaG90U2l0ZSAhPSBudWxsKVxuXHRcdHtcblx0XHRcdGlmICh0aGlzLmhvdFNpdGUucm91dGVzICE9IG51bGwpXG5cdFx0XHR7XG5cdFx0XHRcdGZvciAobGV0IGtleSBpbiB0aGlzLmhvdFNpdGUucm91dGVzKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bGV0IHJvdXRlOiBIb3RTaXRlUm91dGUgPSB0aGlzLmhvdFNpdGUucm91dGVzW2tleV07XG5cblx0XHRcdFx0XHRpZiAocm91dGUubmFtZSA9PT0gbmFtZSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRmb3VuZEtleSA9IGtleTtcblxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIChmb3VuZEtleSk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IGEgcm91dGUgZnJvbSBhIHJvdXRlJ3MgbmFtZS5cblx0ICovXG5cdGdldFJvdXRlRnJvbU5hbWUgKG5hbWU6IHN0cmluZyk6IEhvdFNpdGVSb3V0ZVxuXHR7XG5cdFx0bGV0IGZvdW5kUm91dGU6IEhvdFNpdGVSb3V0ZSA9IG51bGw7XG5cdFx0bGV0IGZvdW5kS2V5OiBzdHJpbmcgPSB0aGlzLmdldFJvdXRlS2V5RnJvbU5hbWUgKG5hbWUpO1xuXG5cdFx0aWYgKGZvdW5kS2V5ICE9PSBcIlwiKVxuXHRcdFx0Zm91bmRSb3V0ZSA9IHRoaXMuaG90U2l0ZS5yb3V0ZXNbZm91bmRLZXldO1xuXG5cdFx0cmV0dXJuIChmb3VuZFJvdXRlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBFeGVjdXRlIHRlc3RzLlxuXHQgKiBcblx0ICogQHBhcmFtIHRlc3Rlck5hbWUgVGhlIHRlc3RlciB0byB1c2UgdG8gZXhlY3V0ZSB0ZXN0cy5cblx0ICogQHBhcmFtIG1hcE5hbWUgVGhlIG1hcCBvciBtYXBzIHRvIHVzZSB0byBuYXZpZ2F0ZSB0aHJvdWdoIHRlc3RzLlxuXHQgKi9cblx0YXN5bmMgZXhlY3V0ZVRlc3RzICh0ZXN0ZXJOYW1lOiBzdHJpbmcsIG1hcE5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD5cblx0e1xuXHRcdGxldCB0ZXN0ZXI6IEhvdFRlc3RlciA9IHRoaXMudGVzdGVyc1t0ZXN0ZXJOYW1lXTtcblxuXHRcdGlmICh0ZXN0ZXIgPT0gbnVsbClcblx0XHRcdHRocm93IG5ldyBFcnJvciAoYFVuYWJsZSB0byBleGVjdXRlIHRlc3RzLiBUZXN0ZXIgJHt0ZXN0ZXJOYW1lfSBkb2VzIG5vdCBleGlzdCFgKTtcblxuXHRcdHJldHVybiAodGVzdGVyLmV4ZWN1dGUgKG1hcE5hbWUpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBFeGVjdXRlIGFsbCB3ZWIgdGVzdHMgZnJvbSB0aGUgSG90U2l0ZSB0ZXN0aW5nIHdlYiBvYmplY3QuXG5cdCAqIFxuXHQgKiBAcGFyYW0gdGVzdGVyTmFtZSBUaGUgdGVzdGVyIHRvIHVzZSB0byBleGVjdXRlIHRlc3RzLlxuXHQgKi9cblx0YXN5bmMgZXhlY3V0ZUFsbFdlYlRlc3RzICh0ZXN0ZXJOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+XG5cdHtcblx0XHRsZXQgbWFwczogc3RyaW5nW10gPSB0aGlzLmdldFdlYlRlc3RpbmdNYXBzICgpO1xuXHRcdGxldCB0ZXN0ZXI6IEhvdFRlc3RlciA9IHRoaXMudGVzdGVyc1t0ZXN0ZXJOYW1lXTtcblxuXHRcdGlmICh0ZXN0ZXIgPT0gbnVsbClcblx0XHRcdHRocm93IG5ldyBFcnJvciAoYFVuYWJsZSB0byBleGVjdXRlIHRlc3RzLiBUZXN0ZXIgJHt0ZXN0ZXJOYW1lfSBkb2VzIG5vdCBleGlzdCFgKTtcblxuXHRcdGZvciAobGV0IGlJZHggPSAwOyBpSWR4IDwgbWFwcy5sZW5ndGg7IGlJZHgrKylcblx0XHR7XG5cdFx0XHRsZXQgbWFwTmFtZTogc3RyaW5nID0gbWFwc1tpSWR4XTtcblxuXHRcdFx0YXdhaXQgdGhpcy5leGVjdXRlVGVzdHMgKHRlc3Rlck5hbWUsIG1hcE5hbWUpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBFeGVjdXRlIGFsbCBhcGkgdGVzdHMgZnJvbSB0aGUgSG90U2l0ZSB0ZXN0aW5nIGFwaSBvYmplY3QuXG5cdCAqIFxuXHQgKiBAcGFyYW0gdGVzdGVyTmFtZSBUaGUgdGVzdGVyIHRvIHVzZSB0byBleGVjdXRlIHRlc3RzLlxuXHQgKi9cblx0YXN5bmMgZXhlY3V0ZUFsbEFQSVRlc3RzICh0ZXN0ZXJOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+XG5cdHtcblx0XHRsZXQgbWFwczogc3RyaW5nW10gPSB0aGlzLmdldEFQSVRlc3RpbmdNYXBzICgpO1xuXHRcdGxldCB0ZXN0ZXI6IEhvdFRlc3RlciA9IHRoaXMudGVzdGVyc1t0ZXN0ZXJOYW1lXTtcblxuXHRcdGlmICh0ZXN0ZXIgPT0gbnVsbClcblx0XHRcdHRocm93IG5ldyBFcnJvciAoYFVuYWJsZSB0byBleGVjdXRlIHRlc3RzLiBUZXN0ZXIgJHt0ZXN0ZXJOYW1lfSBkb2VzIG5vdCBleGlzdCFgKTtcblxuXHRcdGZvciAobGV0IGlJZHggPSAwOyBpSWR4IDwgbWFwcy5sZW5ndGg7IGlJZHgrKylcblx0XHR7XG5cdFx0XHRsZXQgbWFwTmFtZTogc3RyaW5nID0gbWFwc1tpSWR4XTtcblxuXHRcdFx0YXdhaXQgdGhpcy5leGVjdXRlVGVzdHMgKHRlc3Rlck5hbWUsIG1hcE5hbWUpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBQcm9jZXNzIGEgcGFnZSBhbmQgZ2V0IHRoZSByZXN1bHQuXG5cdCAqL1xuXHRhc3luYyBwcm9jZXNzIChwYWdlTmFtZTogc3RyaW5nLCBhcmdzOiBhbnkgPSBudWxsKTogUHJvbWlzZTxzdHJpbmc+XG5cdHtcblx0XHRsZXQgcGFnZTogSG90UGFnZSA9IHRoaXMuZ2V0UGFnZSAocGFnZU5hbWUpO1xuXHRcdGxldCByZXN1bHQ6IHN0cmluZyA9IGF3YWl0IHBhZ2UucHJvY2VzcyAoYXJncyk7XG5cblx0XHRyZXR1cm4gKHJlc3VsdCk7XG5cdH1cblxuXHQvKipcblx0ICogUHJvY2VzcyBhIGxvY2FsIGZpbGUgYW5kIGdldCB0aGUgcmVzdWx0LlxuXHQgKi9cblx0c3RhdGljIGFzeW5jIHByb2Nlc3NMb2NhbEZpbGUgKGxvY2FsRmlsZXBhdGg6IHN0cmluZywgbmFtZTogc3RyaW5nID0gbG9jYWxGaWxlcGF0aCwgYXJnczogYW55ID0gbnVsbCk6IFByb21pc2U8c3RyaW5nPlxuXHR7XG5cdFx0bGV0IHByb2Nlc3NvcjogSG90U3RhcSA9IG5ldyBIb3RTdGFxICgpO1xuXHRcdGxldCBmaWxlOiBIb3RGaWxlID0gbmV3IEhvdEZpbGUgKHtcblx0XHRcdFwibG9jYWxGaWxlXCI6IGxvY2FsRmlsZXBhdGhcblx0XHR9KTtcblx0XHRhd2FpdCBmaWxlLmxvYWQgKCk7XG5cdFx0bGV0IHBhZ2U6IEhvdFBhZ2UgPSBuZXcgSG90UGFnZSAoe1xuXHRcdFx0XHRcInByb2Nlc3NvclwiOiBwcm9jZXNzb3IsXG5cdFx0XHRcdFwibmFtZVwiOiBuYW1lLFxuXHRcdFx0XHRcImZpbGVzXCI6IFtmaWxlXVxuXHRcdFx0fSk7XG5cdFx0cHJvY2Vzc29yLmFkZFBhZ2UgKHBhZ2UpO1xuXHRcdGxldCByZXN1bHQ6IHN0cmluZyA9IGF3YWl0IHByb2Nlc3Nvci5wcm9jZXNzIChuYW1lLCBhcmdzKTtcblxuXHRcdHJldHVybiAocmVzdWx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQcm9jZXNzIGEgdXJsIGFuZCBnZXQgdGhlIHJlc3VsdC5cblx0ICovXG5cdHN0YXRpYyBhc3luYyBwcm9jZXNzVXJsIChvcHRpb25zOiBIb3RTdGFydE9wdGlvbnMpOiBQcm9taXNlPHN0cmluZz5cblx0e1xuXHRcdGxldCBmaWxlOiBIb3RGaWxlID0gbmV3IEhvdEZpbGUgKHtcblx0XHRcdFwidXJsXCI6IG9wdGlvbnMudXJsXG5cdFx0fSk7XG5cblx0XHRhd2FpdCBmaWxlLmxvYWQgKCk7XG5cdFx0bGV0IHBhZ2U6IEhvdFBhZ2UgPSBuZXcgSG90UGFnZSAoe1xuXHRcdFx0XHRcInByb2Nlc3NvclwiOiBvcHRpb25zLnByb2Nlc3Nvcixcblx0XHRcdFx0XCJuYW1lXCI6IG9wdGlvbnMubmFtZSxcblx0XHRcdFx0XCJmaWxlc1wiOiBbZmlsZV0sXG5cdFx0XHRcdFwidGVzdGVyTmFtZVwiOiBvcHRpb25zLnRlc3Rlck5hbWUsXG5cdFx0XHRcdFwidGVzdGVyTWFwXCI6IG9wdGlvbnMudGVzdGVyTWFwXG5cdFx0XHR9KTtcblx0XHRvcHRpb25zLnByb2Nlc3Nvci5hZGRQYWdlIChwYWdlKTtcblx0XHRsZXQgcmVzdWx0OiBzdHJpbmcgPSBhd2FpdCBvcHRpb25zLnByb2Nlc3Nvci5wcm9jZXNzIChvcHRpb25zLm5hbWUsIG9wdGlvbnMuYXJncyk7XG5cblx0XHRyZXR1cm4gKHJlc3VsdCk7XG5cdH1cblxuXHQvKipcblx0ICogUHJvY2VzcyBjb250ZW50IGFuZCBnZXQgdGhlIHJlc3VsdC5cblx0ICovXG5cdHN0YXRpYyBhc3luYyBwcm9jZXNzQ29udGVudCAocHJvY2Vzc29yOiBIb3RTdGFxLCBcblx0XHRjb250ZW50OiBzdHJpbmcsIG5hbWU6IHN0cmluZywgYXJnczogYW55ID0gbnVsbCk6IFByb21pc2U8c3RyaW5nPlxuXHR7XG5cdFx0bGV0IGZpbGU6IEhvdEZpbGUgPSBuZXcgSG90RmlsZSAoe1xuXHRcdFx0XCJjb250ZW50XCI6IGNvbnRlbnRcblx0XHR9KTtcblx0XHRhd2FpdCBmaWxlLmxvYWQgKCk7XG5cdFx0bGV0IHBhZ2U6IEhvdFBhZ2UgPSBuZXcgSG90UGFnZSAoe1xuXHRcdFx0XHRcInByb2Nlc3NvclwiOiBwcm9jZXNzb3IsXG5cdFx0XHRcdFwibmFtZVwiOiBuYW1lLFxuXHRcdFx0XHRcImZpbGVzXCI6IFtmaWxlXVxuXHRcdFx0fSk7XG5cdFx0cHJvY2Vzc29yLmFkZFBhZ2UgKHBhZ2UpO1xuXHRcdGxldCByZXN1bHQ6IHN0cmluZyA9IGF3YWl0IHByb2Nlc3Nvci5wcm9jZXNzIChuYW1lLCBhcmdzKTtcblxuXHRcdHJldHVybiAocmVzdWx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBXaGVuIHRoZSB3aW5kb3cgaGFzIGZpbmlzaGVkIGxvYWRpbmcsIGV4ZWN1dGUgdGhlIGZ1bmN0aW9uLlxuXHQgKiBUaGlzIGlzIG1lYW50IGZvciB3ZWIgYnJvd3NlciB1c2Ugb25seS5cblx0ICovXG5cdHN0YXRpYyBvblJlYWR5IChyZWFkeUZ1bmM6ICgpID0+IHZvaWQpOiB2b2lkXG5cdHtcblx0XHRpZiAoKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIikgfHwgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiaW50ZXJhY3RpdmVcIikpXG5cdFx0XHRyZWFkeUZ1bmMgKCk7XG5cdFx0ZWxzZVxuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIgKFwibG9hZFwiLCByZWFkeUZ1bmMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlcGxhY2UgdGhlIGN1cnJlbnQgSFRNTCBwYWdlIHdpdGggdGhlIG91dHB1dC5cblx0ICogVGhpcyBpcyBtZWFudCBmb3Igd2ViIGJyb3dzZXIgdXNlIG9ubHkuXG5cdCAqL1xuXHRzdGF0aWMgdXNlT3V0cHV0IChvdXRwdXQ6IHN0cmluZyk6IHZvaWRcblx0e1xuXHRcdGRvY3VtZW50Lm9wZW4gKCk7XG5cdFx0ZG9jdW1lbnQud3JpdGUgKG91dHB1dCk7XG5cdFx0ZG9jdW1lbnQuY2xvc2UgKCk7XG5cdH1cblxuXHQvKipcblx0ICogV2FpdCBmb3IgdGVzdGVycyB0byBsb2FkLlxuXHQgKiBcblx0ICogQGZpeG1lIFRoaXMgZG9lcyBub3Qgd2FpdCBmb3IgQUxMIHRlc3RlcnMgdG8gZmluaXNoIGxvYWRpbmcuIE9ubHkgXG5cdCAqIHRoZSBmaXJzdCBvbmUuXG5cdCAqL1xuXHRzdGF0aWMgYXN5bmMgd2FpdEZvclRlc3RlcnMgKCk6IFByb21pc2U8dm9pZD5cblx0e1xuXHRcdHdoaWxlIChIb3RTdGFxLmlzUmVhZHlGb3JUZXN0aW5nID09PSBmYWxzZSlcblx0XHRcdGF3YWl0IEhvdFN0YXEud2FpdCAoMTApO1xuXG5cdFx0aWYgKEhvdFN0YXEub25SZWFkeUZvclRlc3RpbmcgIT0gbnVsbClcblx0XHRcdGF3YWl0IEhvdFN0YXEub25SZWFkeUZvclRlc3RpbmcgKCk7XG5cdH1cblxuXHQvKipcblx0ICogUHJvY2VzcyBhbmQgcmVwbGFjZSB0aGUgY3VycmVudCBIVE1MIHBhZ2Ugd2l0aCB0aGUgaG90dCBzY3JpcHQgZnJvbSB0aGUgZ2l2ZW4gdXJsLlxuXHQgKiBUaGlzIGlzIG1lYW50IGZvciB3ZWIgYnJvd3NlciB1c2Ugb25seS5cblx0ICovXG5cdHN0YXRpYyBhc3luYyBkaXNwbGF5VXJsICh1cmw6IHN0cmluZyB8IEhvdFN0YXJ0T3B0aW9ucywgbmFtZTogc3RyaW5nID0gbnVsbCwgXG5cdFx0cHJvY2Vzc29yOiBIb3RTdGFxID0gbnVsbCwgYXJnczogYW55ID0gbnVsbCk6IFByb21pc2U8SG90U3RhcT5cblx0e1xuXHRcdHJldHVybiAobmV3IFByb21pc2U8SG90U3RhcT4gKChyZXNvbHZlLCByZWplY3QpID0+XG5cdFx0XHR7XG5cdFx0XHRcdEhvdFN0YXEub25SZWFkeSAoYXN5bmMgKCkgPT5cblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRsZXQgb3B0aW9uczogSG90U3RhcnRPcHRpb25zID0ge1xuXHRcdFx0XHRcdFx0XHRcdFwidXJsXCI6IFwiXCJcblx0XHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdFx0aWYgKG5hbWUgPT0gbnVsbClcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiAodXJsKSA9PT0gXCJzdHJpbmdcIilcblx0XHRcdFx0XHRcdFx0XHRvcHRpb25zLm5hbWUgPSB1cmw7XG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRvcHRpb25zLm5hbWUgPSB1cmwubmFtZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0b3B0aW9ucy5uYW1lID0gbmFtZTtcblxuXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMubmFtZSA9PT0gXCJcIilcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiAodXJsKSA9PT0gXCJzdHJpbmdcIilcblx0XHRcdFx0XHRcdFx0XHRvcHRpb25zLm5hbWUgPSB1cmw7XG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRvcHRpb25zLm5hbWUgPSB1cmwubmFtZTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiAodXJsKSA9PT0gXCJzdHJpbmdcIilcblx0XHRcdFx0XHRcdFx0b3B0aW9ucy51cmwgPSB1cmw7XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMudXJsID0gdXJsLnVybDtcblxuXHRcdFx0XHRcdFx0XHRpZiAocHJvY2Vzc29yID09IG51bGwpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRpZiAodXJsLnByb2Nlc3NvciAhPSBudWxsKVxuXHRcdFx0XHRcdFx0XHRcdFx0cHJvY2Vzc29yID0gdXJsLnByb2Nlc3Nvcjtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGlmIChhcmdzID09IG51bGwpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRpZiAodXJsLmFyZ3MgIT0gbnVsbClcblx0XHRcdFx0XHRcdFx0XHRcdGFyZ3MgPSB1cmwuYXJncztcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGlmICh1cmwudGVzdGVyTWFwICE9IG51bGwpXG5cdFx0XHRcdFx0XHRcdFx0b3B0aW9ucy50ZXN0ZXJNYXAgPSB1cmwudGVzdGVyTWFwO1xuXG5cdFx0XHRcdFx0XHRcdGlmICh1cmwudGVzdGVyTmFtZSAhPSBudWxsKVxuXHRcdFx0XHRcdFx0XHRcdG9wdGlvbnMudGVzdGVyTmFtZSA9IHVybC50ZXN0ZXJOYW1lO1xuXG5cdFx0XHRcdFx0XHRcdGlmICh1cmwudGVzdGVyQVBJQmFzZVVybCAhPSBudWxsKVxuXHRcdFx0XHRcdFx0XHRcdG9wdGlvbnMudGVzdGVyQVBJQmFzZVVybCA9IHVybC50ZXN0ZXJBUElCYXNlVXJsO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAocHJvY2Vzc29yID09IG51bGwpXG5cdFx0XHRcdFx0XHRcdHByb2Nlc3NvciA9IG5ldyBIb3RTdGFxICgpO1xuXG5cdFx0XHRcdFx0XHRpZiAocHJvY2Vzc29yLm1vZGUgPT09IERldmVsb3Blck1vZGUuRGV2ZWxvcG1lbnQpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGlmIChwcm9jZXNzb3IudGVzdGVyQVBJID09IG51bGwpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy50ZXN0ZXJBUElCYXNlVXJsID09IG51bGwpXG5cdFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zLnRlc3RlckFQSUJhc2VVcmwgPSBcIlwiO1xuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMudGVzdGVyQVBJQmFzZVVybCA9PT0gXCJcIilcblx0XHRcdFx0XHRcdFx0XHRcdG9wdGlvbnMudGVzdGVyQVBJQmFzZVVybCA9IFwiaHR0cDovLzEyNy4wLjAuMTo4MTgyXCI7XG5cblx0XHRcdFx0XHRcdFx0XHRsZXQgY2xpZW50OiBIb3RDbGllbnQgPSBuZXcgSG90Q2xpZW50IChwcm9jZXNzb3IpO1xuXHRcdFx0XHRcdFx0XHRcdGxldCB0ZXN0ZXJBUEk6IEhvdFRlc3RlckFQSSA9IG5ldyBIb3RUZXN0ZXJBUEkgKG9wdGlvbnMudGVzdGVyQVBJQmFzZVVybCwgY2xpZW50KTtcblx0XHRcdFx0XHRcdFx0XHR0ZXN0ZXJBUEkuY29ubmVjdGlvbi5hcGkgPSB0ZXN0ZXJBUEk7XG5cdFx0XHRcdFx0XHRcdFx0cHJvY2Vzc29yLnRlc3RlckFQSSA9IHRlc3RlckFQSTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRvcHRpb25zLnByb2Nlc3NvciA9IHByb2Nlc3Nvcjtcblx0XHRcdFx0XHRcdG9wdGlvbnMuYXJncyA9IGFyZ3M7XG5cblx0XHRcdFx0XHRcdGxldCBvdXRwdXQ6IHN0cmluZyA9IGF3YWl0IEhvdFN0YXEucHJvY2Vzc1VybCAob3B0aW9ucyk7XG5cblx0XHRcdFx0XHRcdGlmIChwcm9jZXNzb3IubW9kZSA9PT0gRGV2ZWxvcGVyTW9kZS5EZXZlbG9wbWVudClcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0b3V0cHV0ICs9IFxuYDxzY3JpcHQgdHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI+XG5cdGZ1bmN0aW9uIGhvdHN0YXFfaXNEb2N1bWVudFJlYWR5ICgpXG5cdHtcblx0XHRpZiAod2luZG93W1wiSG90XCJdICE9IG51bGwpXG5cdFx0e1xuXHRcdFx0aWYgKEhvdC5Nb2RlID09PSBIb3RTdGFxV2ViLkRldmVsb3Blck1vZGUuRGV2ZWxvcG1lbnQpXG5cdFx0XHR7XG5cdFx0XHRcdGxldCBmdW5jID0gZnVuY3Rpb24gKClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRpZiAoSG90LlRlc3RlckFQSSAhPSBudWxsKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRsZXQgdGVzdFBhdGhzID0ge307XG5cdFx0XHRcdFx0XHRcdGxldCB0ZXN0RWxlbWVudHMgPSBKU09OLnN0cmluZ2lmeSAoSG90LkN1cnJlbnRQYWdlLnRlc3RFbGVtZW50cyk7XG5cdFx0XHRcdFx0XHRcdGxldCB0ZXN0TWFwcyA9IEpTT04uc3RyaW5naWZ5IChIb3QuQ3VycmVudFBhZ2UudGVzdE1hcHMpO1xuXG5cdFx0XHRcdFx0XHRcdGZvciAobGV0IGtleSBpbiBIb3QuQ3VycmVudFBhZ2UudGVzdFBhdGhzKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0bGV0IHRlc3RQYXRoID0gSG90LkN1cnJlbnRQYWdlLnRlc3RQYXRoc1trZXldO1xuXG5cdFx0XHRcdFx0XHRcdFx0dGVzdFBhdGhzW2tleV0gPSB0ZXN0UGF0aC50b1N0cmluZyAoKTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGxldCB0ZXN0UGF0aHNTdHIgPSBKU09OLnN0cmluZ2lmeSAodGVzdFBhdGhzKTtcblxuXHRcdFx0XHRcdFx0XHRIb3QuVGVzdGVyQVBJLnRlc3Rlci5wYWdlTG9hZGVkICh7XG5cdFx0XHRcdFx0XHRcdFx0XHR0ZXN0ZXJOYW1lOiBIb3QuQ3VycmVudFBhZ2UudGVzdGVyTmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdHRlc3Rlck1hcDogSG90LkN1cnJlbnRQYWdlLnRlc3Rlck1hcCxcblx0XHRcdFx0XHRcdFx0XHRcdHBhZ2VOYW1lOiBIb3QuQ3VycmVudFBhZ2UubmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdHRlc3RFbGVtZW50czogdGVzdEVsZW1lbnRzLFxuXHRcdFx0XHRcdFx0XHRcdFx0dGVzdFBhdGhzOiB0ZXN0UGF0aHNTdHJcblx0XHRcdFx0XHRcdFx0XHR9KS50aGVuIChmdW5jdGlvbiAocmVzcClcblx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKHJlc3AuZXJyb3IgIT0gbnVsbClcblx0XHRcdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChyZXNwLmVycm9yICE9PSBcIlwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yIChyZXNwLmVycm9yKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdEhvdFN0YXFXZWIuSG90U3RhcS5pc1JlYWR5Rm9yVGVzdGluZyA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdGlmICgoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiKSB8fCAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJpbnRlcmFjdGl2ZVwiKSlcblx0XHRcdFx0XHRmdW5jICgpO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmMpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGhvdHN0YXFfaXNEb2N1bWVudFJlYWR5ICgpO1xuPC9zY3JpcHQ+YDtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0SG90U3RhcS51c2VPdXRwdXQgKG91dHB1dCk7XG5cdFx0XHRcdFx0XHRyZXNvbHZlIChwcm9jZXNzb3IpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fSkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFByb2Nlc3MgYW5kIHJlcGxhY2UgdGhlIGN1cnJlbnQgSFRNTCBwYWdlIHdpdGggdGhlIGhvdHQgc2NyaXB0LlxuXHQgKiBUaGlzIGlzIG1lYW50IGZvciB3ZWIgYnJvd3NlciB1c2Ugb25seS5cblx0ICovXG5cdHN0YXRpYyBhc3luYyBkaXNwbGF5Q29udGVudCAoY29udGVudDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIHByb2Nlc3NvcjogSG90U3RhcSA9IG51bGwpOiBQcm9taXNlPEhvdFN0YXE+XG5cdHtcblx0XHRyZXR1cm4gKG5ldyBQcm9taXNlPEhvdFN0YXE+ICgocmVzb2x2ZSwgcmVqZWN0KSA9PlxuXHRcdFx0e1xuXHRcdFx0XHRIb3RTdGFxLm9uUmVhZHkgKGFzeW5jICgpID0+XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aWYgKHByb2Nlc3NvciA9PSBudWxsKVxuXHRcdFx0XHRcdFx0XHRwcm9jZXNzb3IgPSBuZXcgSG90U3RhcSAoKTtcblxuXHRcdFx0XHRcdFx0bGV0IG91dHB1dDogc3RyaW5nID0gYXdhaXQgSG90U3RhcS5wcm9jZXNzQ29udGVudCAocHJvY2Vzc29yLCBjb250ZW50LCBuYW1lKTtcblxuXHRcdFx0XHRcdFx0SG90U3RhcS51c2VPdXRwdXQgKG91dHB1dCk7XG5cdFx0XHRcdFx0XHRyZXNvbHZlIChwcm9jZXNzb3IpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fSkpO1xuXHR9XG59XG5cbmlmICh0eXBlb2YgKGRvY3VtZW50KSAhPT0gXCJ1bmRlZmluZWRcIilcbntcblx0bGV0IGhvdHN0YXFFbG1zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUgKFwiaG90c3RhcVwiKTtcblxuXHRpZiAoaG90c3RhcUVsbXMubGVuZ3RoID4gMClcblx0e1xuXHRcdGxldCB0ZW1wTW9kZSA9IDA7XG5cblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0aWYgKHdpbmRvd1tcIkhvdFwiXSAhPSBudWxsKVxuXHRcdFx0dGVtcE1vZGUgPSBIb3QuTW9kZTtcblxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRsZXQgaG90c3RhcUVsbTogSFRNTEVsZW1lbnQgPSBob3RzdGFxRWxtc1swXTtcblxuXHRcdGxldCBwcm9jZXNzb3IgPSBuZXcgSG90U3RhcSAoKTtcblx0XHRsZXQgcHJvbWlzZXM6IGFueVtdID0gW107XG5cblx0XHRwcm9jZXNzb3IubW9kZSA9IHRlbXBNb2RlO1xuXG5cdFx0UHJvbWlzZS5hbGwgKHByb21pc2VzKS50aGVuIChmdW5jdGlvbiAoKVxuXHRcdFx0e1xuXHRcdFx0XHRIb3RTdGFxLmRpc3BsYXlVcmwgKHtcblx0XHRcdFx0XHRcdHVybDogaG90c3RhcUVsbS5kYXRhc2V0LmxvYWRQYWdlLFxuXHRcdFx0XHRcdFx0bmFtZTogXCJcIixcblx0XHRcdFx0XHRcdHByb2Nlc3NvcjogcHJvY2Vzc29yLFxuXHRcdFx0XHRcdFx0YXJnczogSG90LkFyZ3VtZW50c1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdH1cbn1cbiIsImltcG9ydCB7IEhvdFRlc3RFbGVtZW50LCBIb3RUZXN0RWxlbWVudE9wdGlvbnMgfSBmcm9tIFwiLi9Ib3RUZXN0RWxlbWVudFwiO1xuaW1wb3J0IHsgSG90VGVzdFBhZ2UgfSBmcm9tIFwiLi9Ib3RUZXN0TWFwXCI7XG5cbi8qKlxuICogVGhpcyBhY3R1YWxseSBleGVjdXRlcyB0aGUgdGVzdHMuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBIb3RUZXN0RHJpdmVyXG57XG5cdC8qKlxuXHQgKiBUaGUgY3VycmVudCBwYWdlLlxuXHQgKi9cblx0cGFnZTogSG90VGVzdFBhZ2U7XG5cblx0Y29uc3RydWN0b3IgKHBhZ2U6IEhvdFRlc3RQYWdlID0gbnVsbClcblx0e1xuXHRcdHRoaXMucGFnZSA9IHBhZ2U7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IGEgdGVzdCBvYmplY3QgYnkgaXQncyBuYW1lLiBJZiBhICogaXMgdXNlZCwgaXQgd2lsbCBiZSB1c2VkIGFzIGEgXG5cdCAqIHdpbGRjYXJkIGZvciB0aGUgb2JqZWN0J3MgbmFtZS4gSWYgYSA+IGlzIHVzZWQsIHRoZW4gdGhlIG5hbWUgd2lsbCBcblx0ICogYmUgdHJlYXRlZCBhcyBhIENTUyBzZWxlY3Rvci5cblx0ICovXG5cdHBhcnNlVGVzdE9iamVjdCAobmFtZTogc3RyaW5nKTogc3RyaW5nXG5cdHtcblx0XHRsZXQgcG9zOiBudW1iZXIgPSBuYW1lLmluZGV4T2YgKFwiKlwiKTtcblx0XHRsZXQgd2lsZGNhcmQ6IHN0cmluZyA9IFwiXCI7XG5cblx0XHRpZiAocG9zID4gLTEpXG5cdFx0e1xuXHRcdFx0bmFtZSA9IG5hbWUucmVwbGFjZSAoL1xcKi8sIFwiXCIpO1xuXHRcdFx0d2lsZGNhcmQgPSBcIipcIjtcblx0XHR9XG5cblx0XHRsZXQgc2VsZWN0b3I6IHN0cmluZyA9IGBbZGF0YS10ZXN0LW9iamVjdC1uYW1lJHt3aWxkY2FyZH09JyR7bmFtZX0nXWA7XG5cdFx0cG9zID0gbmFtZS5pbmRleE9mIChcIj5cIik7XG5cblx0XHRpZiAocG9zID4gLTEpXG5cdFx0e1xuXHRcdFx0bmFtZSA9IG5hbWUucmVwbGFjZSAoL1xcPi8sIFwiXCIpO1xuXHRcdFx0c2VsZWN0b3IgPSBuYW1lO1xuXHRcdH1cblxuXHRcdHJldHVybiAoc2VsZWN0b3IpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdhaXQgZm9yIGEgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcy5cblx0ICovXG5cdGFzeW5jIHdhaXQgKG51bU1pbGxpc2Vjb25kczogbnVtYmVyKTogUHJvbWlzZTx2b2lkPlxuXHR7XG5cdFx0cmV0dXJuIChhd2FpdCBuZXcgUHJvbWlzZSAoKHJlc29sdmUsIHJlamVjdCkgPT5cblx0XHRcdHtcblx0XHRcdFx0c2V0VGltZW91dCAoKCkgPT5cblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRyZXNvbHZlICgpO1xuXHRcdFx0XHRcdH0sIG51bU1pbGxpc2Vjb25kcyk7XG5cdFx0XHR9KSk7XG5cdH1cblxuXHQvKipcblx0ICogUHJpbnQgYSBtZXNzYWdlLlxuXHQgKi9cblx0YXN5bmMgcHJpbnQgKG1lc3NhZ2U6IHN0cmluZyk6IFByb21pc2U8dm9pZD5cblx0e1xuXHRcdHByb2Nlc3Muc3Rkb3V0LndyaXRlIChtZXNzYWdlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQcmludCBhIG1lc3NhZ2UgbGluZS5cblx0ICovXG5cdGFzeW5jIHByaW50bG4gKG1lc3NhZ2U6IHN0cmluZyk6IFByb21pc2U8dm9pZD5cblx0e1xuXHRcdGF3YWl0IHRoaXMucHJpbnQgKGAke21lc3NhZ2V9XFxuYCk7XG5cdH1cblxuXHQvKipcblx0ICogRGlzY29ubmVjdCB0aGlzIHNlcnZlciBvciBkZXN0cm95IGFueXRoaW5nIGFzc29jaWF0ZWQgd2l0aCB0aGlzIEhvdFRlc3REcml2ZXIuXG5cdCAqL1xuXHRhYnN0cmFjdCBkZXN0cm95ICgpOiBQcm9taXNlPHZvaWQ+O1xuXG5cdC8qKlxuXHQgKiBOYXZpZ2F0ZSB0byBhIHVybC5cblx0ICovXG5cdGFic3RyYWN0IG5hdmlnYXRlVG9VcmwgKHVybDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPjtcblx0LyoqXG5cdCAqIFdhaXQgZm9yIGEgSG90VGVzdEVsZW1lbnQgdG8gbG9hZC5cblx0ICovXG5cdGFic3RyYWN0IHdhaXRGb3JUZXN0RWxlbWVudCAobmFtZTogc3RyaW5nIHwgSG90VGVzdEVsZW1lbnQsIG9wdGlvbnM/OiBIb3RUZXN0RWxlbWVudE9wdGlvbnMpOiBQcm9taXNlPGFueT47XG5cdC8qKlxuXHQgKiBGaW5kIGEgSG90VGVzdEVsZW1lbnQgdG8gdXRpbGl6ZS5cblx0ICovXG5cdGFic3RyYWN0IGZpbmRUZXN0RWxlbWVudCAobmFtZTogc3RyaW5nIHwgSG90VGVzdEVsZW1lbnQsIG9wdGlvbnM/OiBIb3RUZXN0RWxlbWVudE9wdGlvbnMpOiBQcm9taXNlPGFueT47XG5cdC8qKlxuXHQgKiBSdW4gYSBIb3RUZXN0RWxlbWVudCBjb21tYW5kLlxuXHQgKi9cblx0YWJzdHJhY3QgcnVuQ29tbWFuZCAodGVzdEVsbTogc3RyaW5nIHwgSG90VGVzdEVsZW1lbnQsIGZ1bmNOYW1lPzogc3RyaW5nLCB2YWx1ZVN0cj86IHN0cmluZyk6IFByb21pc2U8YW55Pjtcblx0LyoqXG5cdCAqIEFuIGV4cHJlc3Npb24gdG8gdGVzdC5cblx0ICovXG5cdGFic3RyYWN0IGFzc2VydEVsZW1lbnRWYWx1ZSAobmFtZTogc3RyaW5nIHwgSG90VGVzdEVsZW1lbnQsIHZhbHVlOiBhbnksIFxuXHRcdGVycm9yTWVzc2FnZT86IHN0cmluZywgb3B0aW9ucz86IEhvdFRlc3RFbGVtZW50T3B0aW9ucyk6IFByb21pc2U8YW55Pjtcblx0LyoqXG5cdCAqIEFuIGV4cHJlc3Npb24gdG8gdGVzdC5cblx0ICovXG5cdGFzeW5jIGFzc2VydCAodmFsdWU6IGFueSwgZXJyb3JNZXNzYWdlOiBzdHJpbmcgPSBcIlwiKTogUHJvbWlzZTxhbnk+XG5cdHtcblx0XHRpZiAoISAodmFsdWUpKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yIChlcnJvck1lc3NhZ2UpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJ1biBhIHNlcmllcyBvZiB0ZXN0IGVsZW1lbnRzLlxuXHQgKi9cblx0YXN5bmMgcnVuIChleGVjdXRpb25zOiBzdHJpbmdbXSB8IHN0cmluZ1tdW10pOiBQcm9taXNlPGFueVtdPlxuXHR7XG5cdFx0bGV0IHJlc3VsdHM6IGFueVtdID0gW107XG5cblx0XHRmb3IgKGxldCBpSWR4ID0gMDsgaUlkeCA8IGV4ZWN1dGlvbnMubGVuZ3RoOyBpSWR4KyspXG5cdFx0e1xuXHRcdFx0bGV0IGV4ZWN1dGlvbjogYW55ID0gZXhlY3V0aW9uc1tpSWR4XTtcblx0XHRcdGxldCB0ZXN0RWxtOiBIb3RUZXN0RWxlbWVudCA9IG51bGw7XG5cdFx0XHRsZXQgZnVuYzogc3RyaW5nID0gXCJcIjtcblx0XHRcdGxldCB2YWx1ZTogc3RyaW5nID0gXCJcIjtcblxuXHRcdFx0aWYgKHR5cGVvZiAoZXhlY3V0aW9uKSA9PT0gXCJzdHJpbmdcIilcblx0XHRcdHtcblx0XHRcdFx0dGVzdEVsbSA9IHRoaXMucGFnZS50ZXN0RWxlbWVudHNbZXhlY3V0aW9uXTtcblxuXHRcdFx0XHQvLy8gQGZpeG1lIFRoaXMgaXMgZ29pbmcgdG8gd3JlY2sgc2VsZWN0aW5nIHRlc3QgZWxlbWVudHMgYnkgd2lsZGNhcmRzLlxuXHRcdFx0XHRpZiAodGVzdEVsbSA9PSBudWxsKVxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvciAoYEhvdFRlc3REcml2ZXI6IFVuYWJsZSB0byBmaW5kIHRlc3QgZWxlbWVudCAke2V4ZWN1dGlvbn1gKTtcblxuXHRcdFx0XHRmdW5jID0gdGVzdEVsbS5mdW5jO1xuXHRcdFx0XHR2YWx1ZSA9IHRlc3RFbG0udmFsdWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChleGVjdXRpb24gaW5zdGFuY2VvZiBBcnJheSlcblx0XHRcdHtcblx0XHRcdFx0bGV0IG5hbWU6IHN0cmluZyA9IGV4ZWN1dGlvblswXTtcblx0XHRcdFx0dGVzdEVsbSA9IHRoaXMucGFnZS50ZXN0RWxlbWVudHNbbmFtZV07XG5cblx0XHRcdFx0Ly8gVGhpcyBudWxsIGNhdGNoIGlzIHNwZWNpZmljYWxseSB0byBoZWxwIGZpbmQgd2lsZGNhcmQgdGVzdCBlbGVtZW50cy5cblx0XHRcdFx0aWYgKHRlc3RFbG0gPT0gbnVsbClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHRlc3RFbG0gPSBuZXcgSG90VGVzdEVsZW1lbnQgKG5hbWUpO1xuXHRcdFx0XHRcdGZ1bmMgPSBleGVjdXRpb25bMV07XG5cdFx0XHRcdFx0dmFsdWUgPSBleGVjdXRpb25bMl07XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0ZnVuYyA9IHRlc3RFbG0uZnVuYztcblx0XHRcdFx0XHR2YWx1ZSA9IHRlc3RFbG0udmFsdWU7XG5cblx0XHRcdFx0XHRpZiAoZXhlY3V0aW9uLmxlbmd0aCA+IDEpXG5cdFx0XHRcdFx0XHRmdW5jID0gZXhlY3V0aW9uWzFdO1xuXG5cdFx0XHRcdFx0aWYgKGV4ZWN1dGlvbi5sZW5ndGggPiAyKVxuXHRcdFx0XHRcdFx0dmFsdWUgPSBleGVjdXRpb25bMl07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0dGVzdEVsbS5mdW5jID0gZnVuYztcblx0XHRcdHRlc3RFbG0udmFsdWUgPSB2YWx1ZTtcblxuXHRcdFx0cmVzdWx0cy5wdXNoIChhd2FpdCB0aGlzLnJ1bkNvbW1hbmQgKHRlc3RFbG0pKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gKHJlc3VsdHMpO1xuXHR9XG59IiwiLyoqXG4gKiBIb3QgdGVzdCBlbGVtZW50IG9wdGlvbnMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUhvdFRlc3RFbGVtZW50T3B0aW9uc1xue1xuXHQvKipcblx0ICogSW5kaWNhdGVzIHRoYXQgdGhlIHRlc3QgZWxlbWVudCBtdXN0IGJlIHZpc2libGUgaW4gXG5cdCAqIG9yZGVyIHRvIHNlbGVjdCBpdC5cblx0ICovXG5cdG11c3RCZVZpc2libGU/OiBib29sZWFuO1xuXHQvKipcblx0ICogSWYgdGhlIHRlc3QgZWxlbWVudCBpcyBtaXNzaW5nLCBpZ25vcmUgdGhlIGVycm9yLiBUaGlzIFxuXHQgKiB3aWxsIGNhdXNlIHRoZSByZXN0IG9mIHRoZSBmdW5jdGlvbiB0byByZXR1cm4gaW1tZWRpYXRlbHkgXG5cdCAqIHdpdGhvdXQgYW55IGV4Y2VwdGlvbnMgYmVpbmcgdGhyb3duLlxuXHQgKi9cblx0aWdub3JlTWlzc2luZ0VsZW1lbnRFcnJvcj86IGJvb2xlYW47XG59XG5cbi8qKlxuICogSG90IHRlc3QgZWxlbWVudCBvcHRpb25zLlxuICovXG5leHBvcnQgY2xhc3MgSG90VGVzdEVsZW1lbnRPcHRpb25zIGltcGxlbWVudHMgSUhvdFRlc3RFbGVtZW50T3B0aW9uc1xue1xuXHQvKipcblx0ICogSW5kaWNhdGVzIHRoYXQgdGhlIHRlc3QgZWxlbWVudCBtdXN0IGJlIHZpc2libGUgaW4gXG5cdCAqIG9yZGVyIHRvIHNlbGVjdCBpdC5cblx0ICovXG5cdG11c3RCZVZpc2libGU6IGJvb2xlYW47XG5cdC8qKlxuXHQgKiBJZiB0aGUgdGVzdCBlbGVtZW50IGlzIG1pc3NpbmcsIGlnbm9yZSB0aGUgZXJyb3IuIFRoaXMgXG5cdCAqIHdpbGwgY2F1c2UgdGhlIHJlc3Qgb2YgdGhlIGZ1bmN0aW9uIHRvIHJldHVybiBpbW1lZGlhdGVseSBcblx0ICogd2l0aG91dCBhbnkgZXhjZXB0aW9ucyBiZWluZyB0aHJvd24uXG5cdCAqL1xuXHRpZ25vcmVNaXNzaW5nRWxlbWVudEVycm9yOiBib29sZWFuO1xuXG5cdGNvbnN0cnVjdG9yIChjb3B5OiBJSG90VGVzdEVsZW1lbnRPcHRpb25zID0ge30pXG5cdHtcblx0XHR0aGlzLm11c3RCZVZpc2libGUgPSBjb3B5Lm11c3RCZVZpc2libGUgfHwgdHJ1ZTtcblx0XHR0aGlzLmlnbm9yZU1pc3NpbmdFbGVtZW50RXJyb3IgPSBjb3B5Lmlnbm9yZU1pc3NpbmdFbGVtZW50RXJyb3IgfHwgZmFsc2U7XG5cdH1cbn1cblxuLyoqXG4gKiBBIHRlc3QgZWxlbWVudC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJSG90VGVzdEVsZW1lbnRcbntcblx0LyoqXG5cdCAqIFRoZSBuYW1lIG9mIHRoZSBlbGVtZW50LlxuXHQgKi9cblx0bmFtZTogc3RyaW5nO1xuXHQvKipcblx0ICogVGhlIG5hbWUgb2YgdGhlIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgXG5cdCAqIHdoaWxlIGV4ZWN1dGluZyB0aGUgdGVzdC5cblx0ICovXG5cdGZ1bmM/OiBzdHJpbmc7XG5cdC8qKlxuXHQgKiBUaGUgdmFsdWUgdG8gdXNlLlxuXHQgKi9cblx0dmFsdWU/OiBhbnk7XG59XG5cbi8qKlxuICogQSB0ZXN0IGVsZW1lbnQuXG4gKi9cbmV4cG9ydCBjbGFzcyBIb3RUZXN0RWxlbWVudCBpbXBsZW1lbnRzIElIb3RUZXN0RWxlbWVudFxue1xuXHQvKipcblx0ICogVGhlIG5hbWUgb2YgdGhlIGVsZW1lbnQuXG5cdCAqL1xuXHRuYW1lOiBzdHJpbmc7XG5cdC8qKlxuXHQgKiBUaGUgbmFtZSBvZiB0aGUgZnVuY3Rpb24gdG8gZXhlY3V0ZSBcblx0ICogd2hpbGUgZXhlY3V0aW5nIHRoZSB0ZXN0LlxuXHQgKi9cblx0ZnVuYzogc3RyaW5nO1xuXHQvKipcblx0ICogVGhlIHZhbHVlIHRvIHVzZS5cblx0ICovXG5cdHZhbHVlOiBhbnk7XG5cblx0Y29uc3RydWN0b3IgKG5hbWU6IHN0cmluZyB8IElIb3RUZXN0RWxlbWVudCwgZnVuYzogc3RyaW5nID0gXCJcIiwgdmFsdWU6IGFueSA9IG51bGwpXG5cdHtcblx0XHRpZiAodHlwZW9mIChuYW1lKSA9PT0gXCJzdHJpbmdcIilcblx0XHR7XG5cdFx0XHR0aGlzLm5hbWUgPSBuYW1lO1xuXHRcdFx0dGhpcy5mdW5jID0gZnVuYztcblx0XHRcdHRoaXMudmFsdWUgPSB2YWx1ZTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHRoaXMubmFtZSA9IG5hbWUubmFtZTtcblx0XHRcdHRoaXMuZnVuYyA9IG5hbWUuZnVuYyB8fCBmdW5jO1xuXHRcdFx0dGhpcy52YWx1ZSA9IG5hbWUudmFsdWUgfHwgdmFsdWU7XG5cdFx0fVxuXHR9XG59IiwiaW1wb3J0IHsgSG90VGVzdEVsZW1lbnQgfSBmcm9tIFwiLi9Ib3RUZXN0RWxlbWVudFwiO1xuaW1wb3J0IHsgSG90VGVzdERyaXZlciB9IGZyb20gXCIuL0hvdFRlc3REcml2ZXJcIjtcbmltcG9ydCB7IEhvdFNpdGVNYXBQYXRoIH0gZnJvbSBcIi4vSG90U3RhcVwiO1xuXG4vKipcbiAqIENyZWF0ZSBhIHRlc3QgcGF0aCBmb3IgbGF0ZXIgZXhlY3V0aW9uLlxuICovXG5leHBvcnQgdHlwZSBIb3RUZXN0UGF0aCA9IChkcml2ZXI6IEhvdFRlc3REcml2ZXIsIC4uLmFyZ3M6IGFueSkgPT4gUHJvbWlzZTxhbnk+O1xuXG4vKipcbiAqIFRoZSBkZXN0aW5hdGlvbiB0byB0YWtlIGluIGEgbWFwLlxuICovXG5leHBvcnQgY2xhc3MgSG90VGVzdERlc3RpbmF0aW9uXG57XG5cdC8qKlxuXHQgKiBUaGUgZGVzdGluYXRpb24gdG8gdGFrZS5cblx0ICovXG5cdGRlc3RpbmF0aW9uOiBzdHJpbmc7XG5cdC8qKlxuXHQgKiBJZiBzZXQgdG8gdHJ1ZSwgdGhpcyB3aWxsIGF1dG9tYXRpY2FsbHkgc3RhcnQgZXhlY3V0aW5nIGl0J3MgXG5cdCAqIHRlc3RzIHdoZW4gaXQncyB0aW1lLlxuXHQgKi9cblx0YXV0b1N0YXJ0OiBib29sZWFuO1xuXG5cdGNvbnN0cnVjdG9yIChkZXN0aW5hdGlvbjogc3RyaW5nIHwgSG90VGVzdERlc3RpbmF0aW9uIHwgSG90U2l0ZU1hcFBhdGggPSBcIlwiLCBhdXRvU3RhcnQ6IGJvb2xlYW4gPSB0cnVlKVxuXHR7XG5cdFx0aWYgKHR5cGVvZiAoZGVzdGluYXRpb24pID09PSBcInN0cmluZ1wiKVxuXHRcdHtcblx0XHRcdHRoaXMuZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbjtcblx0XHRcdHRoaXMuYXV0b1N0YXJ0ID0gYXV0b1N0YXJ0O1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0aWYgKGRlc3RpbmF0aW9uIGluc3RhbmNlb2YgSG90VGVzdERlc3RpbmF0aW9uKVxuXHRcdFx0e1xuXHRcdFx0XHR0aGlzLmRlc3RpbmF0aW9uID0gZGVzdGluYXRpb24uZGVzdGluYXRpb247XG5cdFx0XHRcdHRoaXMuYXV0b1N0YXJ0ID0gZGVzdGluYXRpb24uYXV0b1N0YXJ0O1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHR0aGlzLmRlc3RpbmF0aW9uID0gZGVzdGluYXRpb24ucGF0aDtcblx0XHRcdFx0dGhpcy5hdXRvU3RhcnQgPSBkZXN0aW5hdGlvbi5hdXRvU3RhcnQ7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogQSBwYWdlIGNvbnRhaW5pbmcgb25seSB0ZXN0IHJlbGF0ZWQgaW5mby5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBIb3RUZXN0UGFnZVxue1xuXHQvKipcblx0ICogVGhlIGVsZW1lbnRzIHRvIHRlc3Qgb24gdGhpcyBtYXAuXG5cdCAqL1xuXHR0ZXN0RWxlbWVudHM6IHsgW25hbWU6IHN0cmluZ106IEhvdFRlc3RFbGVtZW50OyB9O1xuXHQvKipcblx0ICogVGhlIHRlc3QgcGF0aHMgdG8gdGVzdCBvbiB0aGlzIG1hcC5cblx0ICovXG5cdHRlc3RQYXRoczogeyBbbmFtZTogc3RyaW5nXTogSG90VGVzdFBhdGg7IH07XG59XG5cbi8qKlxuICogTWFwcyB0aGUgcGF0aHMgdGhhdCBhcmUgdGFrZW4gdG8gY29tcGxldGUgYSB0ZXN0LlxuICovXG5leHBvcnQgY2xhc3MgSG90VGVzdE1hcFxue1xuXHQvKipcblx0ICogVGhlIG9yZGVyIGluIHdoaWNoIHBhdGhzIGFyZSB0byBiZSB0YWtlbi4gRWFjaCBkZXN0aW5hdGlvbiBpcyBhIHN0cmluZyBcblx0ICogaW4gYSB0eXBlIC0+IHBhdGggb3JkZXIuIFRoZSB0eXBlIGNvdWxkIGJlIGVpdGhlciBhIHBhZ2Ugb3IgYXBpIHJvdXRlLiBcblx0ICogRm9yIGV4YW1wbGU6XG5cdCAqIGBgYFxuXHQgKiBbXG5cdCAqICAgICAgXCJwYWdlOnNpZ25pbl9wYWdlIC0+IHNpZ25pbl9wYXRoXCIsXG5cdCAqICAgICAgXCJwYWdlOmFjY291bnRfcGFnZSAtPiBjaGFuZ2VfdXNlcm5hbWVfcGF0aFwiLFxuXHQgKiAgICAgIFwicGFnZTphY2NvdW50X3BhZ2UgLT4gY2hhbmdlX3Bhc3N3b3JkX3BhdGhcIixcblx0ICogICAgICBcInBhZ2U6YWNjb3VudF9wYWdlIC0+IGNoYW5nZV9uYW1lX3BhdGggLT4gY2hhbmdlX2FkZHJlc3NfcGF0aFwiLFxuXHQgKiBcdFx0XCJwYWdlOmFjY291bnRfcGFnZSAtPiBzaWdub3V0X3BhdGhcIixcblx0ICogXHRcdFwiYXBpOmFjY291bnRfYXBpX3JvdXRlIC0+IHNpZ25vdXRfcm91dGVfbWV0aG9kIC0+IHNpZ25vdXRfdGVzdF9wYXRoXCJcblx0ICogXVxuXHQgKiBgYGBcblx0ICogXG5cdCAqIFRoZSBmaXJzdCBzdHJpbmcgdG8gdGhlIGxlZnQgb2YgdGhlIC0+IHdpbGwgYWx3YXlzIGJlIHRoZSB0eXBlLCBzdWNoIGFzIGEgXG5cdCAqIHBhZ2Ugb3IgYW4gYXBpIHJvdXRlLiBBbnkgc3RyaW5ncyB0byB0aGUgcmlnaHQgb2YgdGhlIC0+IHdpbGwgYmUgYSBwYXRoLCBldmVuIFxuXHQgKiB3aGVuIGNoYWluaW5nIGFkZHRpb25hbCAtPidzLlxuXHQgKi9cblx0ZGVzdGluYXRpb25zOiBIb3RUZXN0RGVzdGluYXRpb25bXSB8IHsgW25hbWU6IHN0cmluZ106IEhvdFRlc3REZXN0aW5hdGlvbjsgfTtcblx0LyoqXG5cdCAqIFRoZSBvcmRlciBpbiB3aGljaCBkZXN0aW5hdGlvbnMgYXJlIHN1cHBvc2VkIHRvIGV4ZWN1dGUuIFRoaXMgaXMgXG5cdCAqIGlnbm9yZWQgaWYgdGhlIGRlc3RpbmF0aW9ucyBhcmUgYW4gYXJyYXkuXG5cdCAqL1xuXHRkZXN0aW5hdGlvbk9yZGVyOiBzdHJpbmdbXTtcblx0LyoqXG5cdCAqIFRoZSB0ZXN0IHBhZ2VzIHRvIGV4ZWN1dGUuXG5cdCAqL1xuXHRwYWdlczoge1xuXHRcdFx0W25hbWU6IHN0cmluZ106IEhvdFRlc3RQYWdlXG5cdFx0fTtcblxuXHRjb25zdHJ1Y3RvciAoZGVzdGluYXRpb25zOiBzdHJpbmdbXSB8IEhvdFRlc3REZXN0aW5hdGlvbltdIHwgeyBbbmFtZTogc3RyaW5nXTogc3RyaW5nIHwgSG90VGVzdERlc3RpbmF0aW9uOyB9ID0gW10sIFxuXHRcdHBhZ2VzOiB7IFtuYW1lOiBzdHJpbmddOiBIb3RUZXN0UGFnZSB9ID0ge30sIGRlc3RpbmF0aW9uT3JkZXI6IHN0cmluZ1tdID0gW10pXG5cdHtcblx0XHQvLyBHbyB0aHJvdWdoIGFuZCBjb252ZXJ0IGFueSBzdHJpbmdzIGludG8gSG90VGVzdERlc3RpbmF0aW9ucy5cblx0XHRpZiAoZGVzdGluYXRpb25zIGluc3RhbmNlb2YgQXJyYXkpXG5cdFx0e1xuXHRcdFx0dGhpcy5kZXN0aW5hdGlvbnMgPSBbXTtcblxuXHRcdFx0Zm9yIChsZXQgaUlkeCA9IDA7IGlJZHggPCBkZXN0aW5hdGlvbnMubGVuZ3RoOyBpSWR4KyspXG5cdFx0XHR7XG5cdFx0XHRcdGxldCBkZXN0ID0gZGVzdGluYXRpb25zW2lJZHhdO1xuXG5cdFx0XHRcdHRoaXMuZGVzdGluYXRpb25zLnB1c2ggKG5ldyBIb3RUZXN0RGVzdGluYXRpb24gKGRlc3QpKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHRoaXMuZGVzdGluYXRpb25zID0ge307XG5cblx0XHRcdGZvciAobGV0IGtleSBpbiBkZXN0aW5hdGlvbnMpXG5cdFx0XHR7XG5cdFx0XHRcdGxldCBkZXN0ID0gZGVzdGluYXRpb25zW2tleV07XG5cblx0XHRcdFx0dGhpcy5kZXN0aW5hdGlvbnNba2V5XSA9IG5ldyBIb3RUZXN0RGVzdGluYXRpb24gKGRlc3QpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuZGVzdGluYXRpb25PcmRlciA9IGRlc3RpbmF0aW9uT3JkZXI7XG5cdFx0dGhpcy5wYWdlcyA9IHBhZ2VzO1xuXHR9XG59IiwiaW1wb3J0IHsgSG90U3RhcSB9IGZyb20gXCIuL0hvdFN0YXFcIjtcbmltcG9ydCB7IEhvdFJvdXRlIH0gZnJvbSBcIi4vSG90Um91dGVcIjtcbmltcG9ydCB7IEhvdFJvdXRlTWV0aG9kLCBUZXN0Q2FzZU9iamVjdCB9IGZyb20gXCIuL0hvdFJvdXRlTWV0aG9kXCI7XG5pbXBvcnQgeyBIb3RUZXN0RHJpdmVyIH0gZnJvbSBcIi4vSG90VGVzdERyaXZlclwiO1xuaW1wb3J0IHsgSG90VGVzdERlc3RpbmF0aW9uLCBIb3RUZXN0TWFwLCBIb3RUZXN0UGFnZSwgSG90VGVzdFBhdGggfSBmcm9tIFwiLi9Ib3RUZXN0TWFwXCI7XG5cbi8qKlxuICogVGhlIHRlc3Qgc3RvcCB0aGF0IGlzIGV4ZWN1dGVkIGFzIGVpdGhlciBhIGRlc3RpbmF0aW9uIG9yIFxuICogYSBwYXRoLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEhvdFRlc3RTdG9wXG57XG5cdC8qKlxuXHQgKiBBIGNvbW1hbmQgdG8gZXhlY3V0ZS4gQ2FuIGJlOlxuXHQgKiAqIHByaW50KHgpXG5cdCAqICAgKiBQcmludCBhIG1lc3NhZ2UgdG8gdGhlIHNlcnZlcidzIGNvbnNvbGUuXG5cdCAqICogcHJpbnRsbih4KVxuXHQgKiAgICogUHJpbnQgYSBtZXNzYWdlIHdpdGggYSBuZXcgbGluZSB0byB0aGUgc2VydmVyJ3MgY29uc29sZS5cblx0ICogKiB1cmwoeClcblx0ICogICAqIE9wZW4gYSB1cmwuIE11c3QgYmUgYW4gYWJzb2x1dGUgdXJsLlxuXHQgKiAqIHdhaXRGb3JUZXN0ZXJBUElEYXRhXG5cdCAqICAgKiBUaGlzIHdpbGwgd2FpdCBmb3IgdGhlIHRlc3RlciBBUEkgdG8gcmVjZWl2ZSBkYXRhLlxuXHQgKiAqIHdhaXQoeClcblx0ICogICAqIFRoaXMgd2lsbCB3YWl0IGZvciB4IG51bWJlciBvZiBtaWxsaXNlY29uZHMuXG5cdCAqICogd2FpdEZvclRlc3RPYmplY3QoeClcblx0ICogICAqIFRoaXMgd2lsbCB3YWl0IGZvciBhIHRlc3Qgb2JqZWN0IHRvIGJlIGxvYWRlZC5cblx0ICovXG5cdGNtZDogc3RyaW5nO1xuXHQvKipcblx0ICogVGhlIGRlc3RpbmF0aW9uIHRvIGV4ZWN1dGUuXG5cdCAqL1xuXHRkZXN0OiBzdHJpbmc7XG5cdC8qKlxuXHQgKiBUaGUgcGF0aCB0byBleGVjdXRlLlxuXHQgKi9cblx0cGF0aDogc3RyaW5nO1xufVxuXG4vKipcbiAqIFRoZSBkZXN0aW5hdGlvbiBmb3IgYSB0ZXN0IHRvIHRha2UuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSG90RGVzdGluYXRpb25cbntcblx0LyoqXG5cdCAqIFRoZSBuYW1lIG9mIHRoZSBtYXAuXG5cdCAqL1xuXHRtYXBOYW1lOiBzdHJpbmc7XG5cdC8qKlxuXHQgKiBUaGUgcGFnZSB0byBzdGFydCBhdC5cblx0ICovXG5cdHBhZ2U6IHN0cmluZztcblx0LyoqXG5cdCAqIFRoZSBBUEkgcm91dGUgdG8gc3RhcnQgdXNpbmcuXG5cdCAqL1xuXHRhcGk6IHN0cmluZztcblx0LyoqXG5cdCAqIFRoZSBwYXRocyB0byB0YWtlIG9uIHRoZSBwYWdlLlxuXHQgKi9cblx0cGF0aHM6IEhvdFRlc3RTdG9wW107XG59XG5cbi8qKlxuICogRXhlY3V0ZXMgdGVzdHMuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBIb3RUZXN0ZXJcbntcblx0LyoqXG5cdCAqIFRoZSB0ZXN0ZXIgbmFtZS5cblx0ICovXG5cdG5hbWU6IHN0cmluZztcblx0LyoqXG5cdCAqIFRoZSBiYXNlIHVybCB0aGF0IHdpbGwgY29uc3RydWN0IGZ1dHVyZSB1cmxzLlxuXHQgKi9cblx0YmFzZVVybDogc3RyaW5nO1xuXHQvKipcblx0ICogVGhlIGFzc29jaWF0ZWQgcHJvY2Vzc29yLlxuXHQgKi9cblx0cHJvY2Vzc29yOiBIb3RTdGFxO1xuXHQvKipcblx0ICogVGhlIHRlc3QgbWFwcyB0byB0ZXN0LlxuXHQgKi9cblx0dGVzdE1hcHM6IHsgW25hbWU6IHN0cmluZ106IEhvdFRlc3RNYXA7IH07XG5cdC8qKlxuXHQgKiBUaGUgZHJpdmVyIHRvIHVzZSB3aGVuIHJ1bm5pbmcgdGVzdHMuXG5cdCAqL1xuXHRkcml2ZXI6IEhvdFRlc3REcml2ZXI7XG5cdC8qKlxuXHQgKiBIYXMgdGhpcyB0ZXN0ZXIgZmluaXNoZWQgbG9hZGluZz9cblx0ICovXG5cdGZpbmlzaGVkTG9hZGluZzogYm9vbGVhbjtcblx0LyoqXG5cdCAqIEhhcyB0aGlzIHRlc3RlciBmaW5pc2hlZCBzZXR0aW5nIHVwP1xuXHQgKi9cblx0aGFzQmVlblNldHVwOiBib29sZWFuO1xuXHQvKipcblx0ICogSGFzIHRoaXMgdGVzdGVyIGZpbmlzaGVkIHNldHRpbmcgdXA/XG5cdCAqL1xuXHRoYXNCZWVuRGVzdHJveWVkOiBib29sZWFuO1xuXG5cdGNvbnN0cnVjdG9yIChwcm9jZXNzb3I6IEhvdFN0YXEsIG5hbWU6IHN0cmluZywgYmFzZVVybDogc3RyaW5nLCBcblx0XHRkcml2ZXI6IEhvdFRlc3REcml2ZXIsIHRlc3RNYXBzOiB7IFtuYW1lOiBzdHJpbmddOiBIb3RUZXN0TWFwOyB9ID0ge30pXG5cdHtcblx0XHR0aGlzLnByb2Nlc3NvciA9IHByb2Nlc3Nvcjtcblx0XHR0aGlzLm5hbWUgPSBuYW1lO1xuXHRcdHRoaXMuYmFzZVVybCA9IGJhc2VVcmw7XG5cdFx0dGhpcy50ZXN0TWFwcyA9IHRlc3RNYXBzO1xuXHRcdHRoaXMuZHJpdmVyID0gZHJpdmVyO1xuXHRcdHRoaXMuZmluaXNoZWRMb2FkaW5nID0gZmFsc2U7XG5cdFx0dGhpcy5oYXNCZWVuU2V0dXAgPSBmYWxzZTtcblx0XHR0aGlzLmhhc0JlZW5EZXN0cm95ZWQgPSBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBFeGVjdXRlZCB3aGVuIHNldHRpbmcgdXAgdGhlIHRlc3Rlci5cblx0ICovXG5cdGFic3RyYWN0IHNldHVwIChpc1dlYlJvdXRlOiBib29sZWFuLCB1cmw6IHN0cmluZywgZGVzdGluYXRpb25LZXk/OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+O1xuXHQvKipcblx0ICogRXhlY3V0ZWQgd2hlbiBkZXN0cm95aW5nIHVwIHRoZSB0ZXN0ZXIuXG5cdCAqL1xuXHRhYnN0cmFjdCBkZXN0cm95ICgpOiBQcm9taXNlPHZvaWQ+O1xuXG5cdC8qKlxuXHQgKiBFeGVjdXRlZCB3aGVuIHRlc3RzIGFyZSBzdGFydGVkLiBJZiB0aGlzIHJldHVybnMgdHJ1ZSwgaXQgd2lsbCBcblx0ICogY29udGludWUgYW5kIGV4ZWN1dGUgYWxsIHRlc3QgcGF0aHMuIElmIHRoaXMgcmV0dXJucyBpdCB3aWxsIFxuXHQgKiBza2lwIGFsbCB0ZXN0IHBhdGhzIGFuZCBleGVjdXRlIG9uVGVzdEVuZCBpbnN0ZWFkLlxuXHQgKi9cblx0YXN5bmMgb25UZXN0U3RhcnQ/IChkZXN0aW5hdGlvbjogSG90RGVzdGluYXRpb24sIHVybDogc3RyaW5nLCBkZXN0aW5hdGlvbktleT86IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj47XG5cdC8qKlxuXHQgKiBFeGVjdXRlZCB3aGVuIGFuIEFQSSB0ZXN0IHBhdGggaGFzIHN0YXJ0ZWQuIElmIHRoaXMgcmV0dXJucyBmYWxzZSwgXG5cdCAqIHRoZSB0ZXN0UGF0aCB3aWxsIG5vdCBiZSBpbW1lZGlhdGVseSBleGVjdXRlZCBhZnRlcndhcmRzLlxuXHQgKi9cblx0YXN5bmMgb25UZXN0QVBJUGF0aFN0YXJ0PyAoZGVzdGluYXRpb246IEhvdERlc3RpbmF0aW9uLCBtZXRob2Q6IEhvdFJvdXRlTWV0aG9kLCBcblx0XHR0ZXN0TmFtZTogc3RyaW5nLCBjb250aW51ZVdoZW5UZXN0SXNDb21wbGV0ZT86IGJvb2xlYW4pOiBQcm9taXNlPGJvb2xlYW4+O1xuXHQvKipcblx0ICogRXhlY3V0ZWQgd2hlbiBhbiBBUEkgdGVzdCBwYXRoIGhhcyBlbmRlZC5cblx0ICovXG5cdGFzeW5jIG9uVGVzdEFQSVBhdGhFbmQ/IChkZXN0aW5hdGlvbjogSG90RGVzdGluYXRpb24sIG1ldGhvZDogSG90Um91dGVNZXRob2QsIFxuXHRcdHRlc3ROYW1lOiBzdHJpbmcsIHJlc3VsdDogYW55LCBjb250aW51ZVdoZW5UZXN0SXNDb21wbGV0ZT86IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQ+O1xuXHQvKipcblx0ICogRXhlY3V0ZWQgd2hlbiBwYWdlIHRlc3RzIGFyZSBzdGFydGVkLiBJZiB0aGlzIHJldHVybnMgZmFsc2UsIHRoZSB0ZXN0UGF0aCB3aWxsIG5vdCBiZSBcblx0ICogaW1tZWRpYXRlbHkgZXhlY3V0ZWQgYWZ0ZXJ3YXJkcy5cblx0ICovXG5cdGFzeW5jIG9uVGVzdFBhZ2VQYXRoU3RhcnQ/IChkZXN0aW5hdGlvbjogSG90RGVzdGluYXRpb24sIHBhZ2U6IEhvdFRlc3RQYWdlLCBcblx0XHRzdG9wOiBIb3RUZXN0U3RvcCwgY29udGludWVXaGVuVGVzdElzQ29tcGxldGU/OiBib29sZWFuKTogUHJvbWlzZTxib29sZWFuPjtcblx0LyoqXG5cdCAqIEV4ZWN1dGVkIHdoZW4gYSBwYWdlIHRlc3QgaGFzIGVuZGVkLlxuXHQgKi9cblx0YXN5bmMgb25UZXN0UGFnZVBhdGhFbmQ/IChkZXN0aW5hdGlvbjogSG90RGVzdGluYXRpb24sIHRlc3RQYXRoOiBIb3RUZXN0UGF0aCwgXG5cdFx0cmVzdWx0OiBhbnksIGNvbnRpbnVlV2hlblRlc3RJc0NvbXBsZXRlPzogYm9vbGVhbik6IFByb21pc2U8dm9pZD47XG5cdC8qKlxuXHQgKiBFeGVjdXRlZCB3aGVuIGEgY29tbWFuZCBpcyBleGVjdXRlZC5cblx0ICovXG5cdGFzeW5jIG9uQ29tbWFuZD8gKGRlc3RpbmF0aW9uOiBIb3REZXN0aW5hdGlvbiwgcGFnZTogSG90VGVzdFBhZ2UsIHN0b3A6IEhvdFRlc3RTdG9wLCBcblx0XHRjbWQ6IHN0cmluZywgYXJnczogc3RyaW5nW10sIGNtZEZ1bmM6ICgoY21kQXJnczogc3RyaW5nW10pID0+IFByb21pc2U8dm9pZD4pKTogUHJvbWlzZTx2b2lkPjtcblx0LyoqXG5cdCAqIEV4ZWN1dGVkIHdoZW4gdGVzdHMgYXJlIGZpbmlzaGVkLlxuXHQgKi9cblx0YXN5bmMgb25UZXN0RW5kPyAoZGVzdGluYXRpb246IEhvdERlc3RpbmF0aW9uKTogUHJvbWlzZTx2b2lkPjtcblxuXHQvKipcblx0ICogRXhlY3V0ZWQgd2hlbiB0aGlzIHRlc3RlciBoYXMgYmVlbiBleGVjdXRlZCBmcm9tIHRoZSBBUEkuXG5cdCAqL1xuXHRhc3luYyBvbkV4ZWN1dGU/ICgpOiBQcm9taXNlPHZvaWQ+O1xuXHQvKipcblx0ICogRXhlY3V0ZWQgd2hlbiB0aGlzIHRlc3RlciBoYXMgZmluaXNoZWQgbG9hZGluZyBhbGwgZGF0YSBmcm9tIHRoZSBBUEkuXG5cdCAqL1xuXHRhc3luYyBvbkZpbmlzaGVkTG9hZGluZz8gKCk6IFByb21pc2U8dm9pZD47XG5cblx0LyoqXG5cdCAqIFdhaXRzIGZvciB0aGUgQVBJIHRvIGZpbmlzaCBsb2FkaW5nIGFsbCBkYXRhLlxuXHQgKi9cblx0YXN5bmMgd2FpdEZvckRhdGEgKCk6IFByb21pc2U8dm9pZD5cblx0e1xuXHRcdHdoaWxlICh0aGlzLmZpbmlzaGVkTG9hZGluZyA9PT0gZmFsc2UpXG5cdFx0XHRhd2FpdCBIb3RTdGFxLndhaXQgKDEwKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgYSB0ZXN0IHBhZ2UuXG5cdCAqL1xuXHRnZXRUZXN0UGFnZSAoZGVzdGluYXRpb246IEhvdERlc3RpbmF0aW9uKTogSG90VGVzdFBhZ2Vcblx0e1xuXHRcdGxldCBwYWdlID0gdGhpcy50ZXN0TWFwc1tkZXN0aW5hdGlvbi5tYXBOYW1lXS5wYWdlc1tkZXN0aW5hdGlvbi5wYWdlXTtcblxuXHRcdHJldHVybiAocGFnZSk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IGEgdGVzdCBwYXRoLlxuXHQgKi9cblx0Z2V0VGVzdFBhdGggKGRlc3RpbmF0aW9uOiBIb3REZXN0aW5hdGlvbiwgcGF0aE5hbWU6IHN0cmluZyk6IEhvdFRlc3RQYXRoXG5cdHtcblx0XHRsZXQgcGFnZSA9IHRoaXMudGVzdE1hcHNbZGVzdGluYXRpb24ubWFwTmFtZV0ucGFnZXNbZGVzdGluYXRpb24ucGFnZV07XG5cblx0XHRyZXR1cm4gKHBhZ2UudGVzdFBhdGhzW3BhdGhOYW1lXSk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IGEgZGVzdGluYXRpb24gSlNPTiBvYmplY3QgdG8gdXNlLlxuXHQgKi9cblx0c3RhdGljIGludGVycHJldERlc3RpbmF0aW9uIChtYXBOYW1lOiBzdHJpbmcsIHRlc3REZXN0OiBIb3RUZXN0RGVzdGluYXRpb24pOiBIb3REZXN0aW5hdGlvblxuXHR7XG5cdFx0bGV0IGRlc3RpbmF0aW9uOiBzdHJpbmcgPSB0ZXN0RGVzdC5kZXN0aW5hdGlvbjtcblx0XHRsZXQgbmV3RGVzdGluYXRpb246IEhvdERlc3RpbmF0aW9uID0ge1xuXHRcdFx0XHRtYXBOYW1lOiBtYXBOYW1lLFxuXHRcdFx0XHRwYWdlOiBcIlwiLFxuXHRcdFx0XHRhcGk6IFwiXCIsXG5cdFx0XHRcdHBhdGhzOiBbXVxuXHRcdFx0fTtcblx0XHRsZXQgc3Ryczogc3RyaW5nW10gPSBkZXN0aW5hdGlvbi5zcGxpdCAoL1xcLVxcPi9nKTtcblx0XHRsZXQgdHlwZTogc3RyaW5nID0gc3Ryc1swXTtcblx0XHRsZXQgZ2V0VHlwZTogKHR5cGVTdHI6IHN0cmluZywgdHlwZURlbGltaXRlcjogc3RyaW5nKSA9PiBzdHJpbmcgPSBcblx0XHRcdCh0eXBlU3RyOiBzdHJpbmcsIHR5cGVEZWxpbWl0ZXI6IHN0cmluZyk6IHN0cmluZyA9PlxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgcG9zOiBudW1iZXIgPSB0eXBlU3RyLmluZGV4T2YgKHR5cGVEZWxpbWl0ZXIpO1xuXHRcdFx0XHRsZXQgdHlwZVZhbHVlOiBzdHJpbmcgPSBcIlwiO1xuXHRcdFxuXHRcdFx0XHRpZiAocG9zID4gLTEpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0eXBlVmFsdWUgPSB0eXBlU3RyLnN1YnN0ciAocG9zICsgdHlwZURlbGltaXRlci5sZW5ndGgpO1xuXHRcdFx0XHRcdHR5cGVWYWx1ZSA9IHR5cGVWYWx1ZS50cmltICgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuICh0eXBlVmFsdWUpO1xuXHRcdFx0fTtcblxuXHRcdG5ld0Rlc3RpbmF0aW9uLnBhZ2UgPSBnZXRUeXBlICh0eXBlLCBcInBhZ2U6XCIpO1xuXHRcdG5ld0Rlc3RpbmF0aW9uLmFwaSA9IGdldFR5cGUgKHR5cGUsIFwiYXBpOlwiKTtcblxuXHRcdGZvciAobGV0IGlJZHggPSAxOyBpSWR4IDwgc3Rycy5sZW5ndGg7IGlJZHgrKylcblx0XHR7XG5cdFx0XHRsZXQgbmV3UGF0aFN0cjogc3RyaW5nID0gc3Ryc1tpSWR4XTtcblx0XHRcdGxldCBuZXdQYXRoOiBIb3RUZXN0U3RvcCA9IHtcblx0XHRcdFx0XHRjbWQ6IFwiXCIsXG5cdFx0XHRcdFx0ZGVzdDogXCJcIixcblx0XHRcdFx0XHRwYXRoOiBcIlwiXG5cdFx0XHRcdH07XG5cblx0XHRcdG5ld1BhdGhTdHIgPSBuZXdQYXRoU3RyLnRyaW0gKCk7XG5cdFx0XHRuZXdQYXRoLmRlc3QgPSBnZXRUeXBlIChuZXdQYXRoU3RyLCBcImRlc3Q6XCIpO1xuXHRcdFx0bmV3UGF0aC5jbWQgPSBnZXRUeXBlIChuZXdQYXRoU3RyLCBcImNtZDpcIik7XG5cdFx0XHRuZXdQYXRoLnBhdGggPSBnZXRUeXBlIChuZXdQYXRoU3RyLCBcInBhdGg6XCIpO1xuXG5cdFx0XHRpZiAoKG5ld1BhdGguZGVzdCA9PSBcIlwiKSAmJiAobmV3UGF0aC5jbWQgPT0gXCJcIikgJiYgKG5ld1BhdGgucGF0aCA9PSBcIlwiKSlcblx0XHRcdFx0bmV3UGF0aC5wYXRoID0gbmV3UGF0aFN0cjtcblxuXHRcdFx0bmV3RGVzdGluYXRpb24ucGF0aHMucHVzaCAobmV3UGF0aCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIChuZXdEZXN0aW5hdGlvbik7XG5cdH1cblxuXHQvKipcblx0ICogRXhlY3V0ZSBhbiBBUEkncyB0ZXN0IHBhdGguXG5cdCAqL1xuXHRhc3luYyBleGVjdXRlVGVzdEFQSVBhdGggKGRlc3RpbmF0aW9uOiBIb3REZXN0aW5hdGlvbiwgbWV0aG9kOiBIb3RSb3V0ZU1ldGhvZCwgXG5cdFx0dGVzdE5hbWU6IHN0cmluZywgc2tpcEV2ZW50Q2FsbHM6IGJvb2xlYW4gPSBmYWxzZSwgY29udGludWVXaGVuVGVzdElzQ29tcGxldGU6IGJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8YW55PlxuXHR7XG5cdFx0bGV0IHJ1blRlc3RQYXRoOiBib29sZWFuID0gdHJ1ZTtcblxuXHRcdC8vIEEgZHVtYiBoYWNrIHRvIHByZXZlbnQgYW55IHJlY3Vyc2lvbiB0aGF0IGNvdWxkIG9jY3VyLlxuXHRcdGlmIChza2lwRXZlbnRDYWxscyA9PT0gZmFsc2UpXG5cdFx0e1xuXHRcdFx0aWYgKHRoaXMub25UZXN0QVBJUGF0aFN0YXJ0ICE9IG51bGwpXG5cdFx0XHRcdHJ1blRlc3RQYXRoID0gYXdhaXQgdGhpcy5vblRlc3RBUElQYXRoU3RhcnQgKGRlc3RpbmF0aW9uLCBtZXRob2QsIHRlc3ROYW1lLCBjb250aW51ZVdoZW5UZXN0SXNDb21wbGV0ZSk7XG5cdFx0fVxuXG5cdFx0bGV0IHJlc3VsdDogYW55ID0gbnVsbDtcblxuXHRcdGlmIChydW5UZXN0UGF0aCA9PT0gdHJ1ZSlcblx0XHR7XG5cdFx0XHRsZXQgdGVzdENhc2VPYmplY3Q6IFRlc3RDYXNlT2JqZWN0ID0gbWV0aG9kLnRlc3RDYXNlc1t0ZXN0TmFtZV07XG5cblx0XHRcdGlmICh0ZXN0Q2FzZU9iamVjdCA9PSBudWxsKVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IgKGBIb3RUZXN0ZXI6IFRlc3QgY2FzZSBvYmplY3QgJHt0ZXN0TmFtZX0gZG9lcyBub3QgZXhpc3QhYCk7XG5cblx0XHRcdHJlc3VsdCA9IGF3YWl0IHRlc3RDYXNlT2JqZWN0LmZ1bmMgKHRoaXMuZHJpdmVyKTtcblx0XHR9XG5cblx0XHRpZiAoc2tpcEV2ZW50Q2FsbHMgPT09IGZhbHNlKVxuXHRcdHtcblx0XHRcdGlmICh0aGlzLm9uVGVzdEFQSVBhdGhFbmQgIT0gbnVsbClcblx0XHRcdFx0YXdhaXQgdGhpcy5vblRlc3RBUElQYXRoRW5kIChkZXN0aW5hdGlvbiwgbWV0aG9kLCB0ZXN0TmFtZSwgcmVzdWx0LCBjb250aW51ZVdoZW5UZXN0SXNDb21wbGV0ZSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIChyZXN1bHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEV4ZWN1dGUgYWxsIHRlc3QgcGF0aHMgaW4gYW4gQVBJIHJvdXRlLlxuXHQgKiBcblx0ICogQGZpeG1lIFRoaXMgbmVlZHMgYSBiZXR0ZXIgaW1wbGVtZW50YXRpb24uLi5cblx0ICovXG5cdGFzeW5jIGV4ZWN1dGVUZXN0QVBJUGF0aHMgKGRlc3RpbmF0aW9uOiBIb3REZXN0aW5hdGlvbik6IFByb21pc2U8YW55W10+XG5cdHtcblx0XHRsZXQgcmVzdWx0czogYW55W10gPSBbXTtcblx0XHRsZXQgdGVzdE1hcDogSG90VGVzdE1hcCA9IHRoaXMudGVzdE1hcHNbZGVzdGluYXRpb24ubWFwTmFtZV07XG5cblx0XHRpZiAodGVzdE1hcCA9PSBudWxsKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yIChgSG90VGVzdGVyOiBNYXAgJHtkZXN0aW5hdGlvbi5tYXBOYW1lfSBkb2VzIG5vdCBleGlzdCFgKTtcblxuXHRcdGlmICh0aGlzLnByb2Nlc3Nvci5hcGkgPT0gbnVsbClcblx0XHRcdHRocm93IG5ldyBFcnJvciAoYEhvdFRlc3RlcjogQXNzb2NpYXRlZCBwcm9jZXNzb3IgZG9lcyBub3QgaGF2ZSBhbiBBUEkhYCk7XG5cblx0XHRsZXQgcm91dGU6IEhvdFJvdXRlID0gdGhpcy5wcm9jZXNzb3IuYXBpLnJvdXRlc1tkZXN0aW5hdGlvbi5hcGldO1xuXG5cdFx0aWYgKHJvdXRlID09IG51bGwpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IgKGBIb3RUZXN0ZXI6IEFQSSBkb2VzIG5vdCBoYXZlIHJvdXRlICR7ZGVzdGluYXRpb24uYXBpfSFgKTtcblxuXHRcdC8vIEl0ZXJhdGUgdGhyb3VnaCBlYWNoIHBhdGggaW4gdGhlIGRlc3RpbmF0aW9uIHVudGlsIGNvbXBsZXRlLlxuXHRcdGZvciAobGV0IGlJZHggPSAwOyBpSWR4IDwgZGVzdGluYXRpb24ucGF0aHMubGVuZ3RoOyBpSWR4ICs9IDIpXG5cdFx0e1xuXHRcdFx0bGV0IHN0b3A6IEhvdFRlc3RTdG9wID0gZGVzdGluYXRpb24ucGF0aHNbaUlkeF07XG5cdFx0XHRsZXQgcGF0aE5hbWU6IHN0cmluZyA9IHN0b3AucGF0aDtcblx0XHRcdGxldCBtZXRob2Q6IEhvdFJvdXRlTWV0aG9kID0gcm91dGUuZ2V0TWV0aG9kIChwYXRoTmFtZSk7XG5cdFx0XHRsZXQgbmV4dFN0b3A6IEhvdFRlc3RTdG9wID0gZGVzdGluYXRpb24ucGF0aHNbaUlkeCArIDFdO1xuXHRcdFx0bGV0IHRlc3ROYW1lOiBzdHJpbmcgPSBuZXh0U3RvcC5wYXRoO1xuXHRcdFx0bGV0IHJlc3VsdDogYW55ID0gYXdhaXQgdGhpcy5leGVjdXRlVGVzdEFQSVBhdGggKGRlc3RpbmF0aW9uLCBtZXRob2QsIHRlc3ROYW1lKTtcblxuXHRcdFx0cmVzdWx0cy5wdXNoIChyZXN1bHQpO1xuXHRcdH1cblxuXHRcdHJldHVybiAocmVzdWx0cyk7XG5cdH1cblxuXHQvKipcblx0ICogRXhlY3V0ZSBhIHRlc3QgcGFnZSBwYXRoLlxuXHQgKi9cblx0YXN5bmMgZXhlY3V0ZVRlc3RQYWdlUGF0aCAoZGVzdGluYXRpb246IEhvdERlc3RpbmF0aW9uLCBzdG9wOiBIb3RUZXN0U3RvcCwgXG5cdFx0c2tpcEV2ZW50Q2FsbHM6IGJvb2xlYW4gPSBmYWxzZSwgY29udGludWVXaGVuVGVzdElzQ29tcGxldGU6IGJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8YW55PlxuXHR7XG5cdFx0bGV0IHJ1blRlc3RQYXRoOiBib29sZWFuID0gdHJ1ZTtcblx0XHRsZXQgdGVzdE1hcDogSG90VGVzdE1hcCA9IHRoaXMudGVzdE1hcHNbZGVzdGluYXRpb24ubWFwTmFtZV07XG5cblx0XHQvLy8gQGZpeG1lIEZvciBzb21lIHJlYXNvbiB0aGUgZXJyb3JzIGJlaW5nIHRocm93biBoZXJlIGFyZSBub3QgYmVpbmcgdGhyb3duLlxuXHRcdGlmICh0ZXN0TWFwID09IG51bGwpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IgKGBIb3RUZXN0ZXI6IE1hcCAke2Rlc3RpbmF0aW9uLm1hcE5hbWV9IGRvZXMgbm90IGV4aXN0IWApO1xuXG5cdFx0bGV0IHBhZ2U6IEhvdFRlc3RQYWdlID0gdGVzdE1hcC5wYWdlc1tkZXN0aW5hdGlvbi5wYWdlXTtcblxuXHRcdGlmIChwYWdlID09IG51bGwpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IgKGBIb3RUZXN0ZXI6IFBhZ2UgJHtkZXN0aW5hdGlvbi5wYWdlfSBkb2VzIG5vdCBleGlzdCFgKTtcblxuXHRcdHRoaXMuZHJpdmVyLnBhZ2UgPSBwYWdlO1xuXG5cdFx0bGV0IHRlc3RQYXRoTmFtZTogc3RyaW5nID0gc3RvcC5wYXRoO1xuXHRcdGxldCB0ZXN0UGF0aDogSG90VGVzdFBhdGggPSBwYWdlLnRlc3RQYXRoc1t0ZXN0UGF0aE5hbWVdO1xuXG5cdFx0Ly8gQSBkdW1iIGhhY2sgdG8gcHJldmVudCBhbnkgcmVjdXJzaW9uIHRoYXQgY291bGQgb2NjdXIuXG5cdFx0aWYgKHNraXBFdmVudENhbGxzID09PSBmYWxzZSlcblx0XHR7XG5cdFx0XHRpZiAodGhpcy5vblRlc3RQYWdlUGF0aFN0YXJ0ICE9IG51bGwpXG5cdFx0XHRcdHJ1blRlc3RQYXRoID0gYXdhaXQgdGhpcy5vblRlc3RQYWdlUGF0aFN0YXJ0IChkZXN0aW5hdGlvbiwgcGFnZSwgc3RvcCwgY29udGludWVXaGVuVGVzdElzQ29tcGxldGUpO1xuXHRcdH1cblxuXHRcdGxldCByZXN1bHQ6IGFueSA9IG51bGw7XG5cblx0XHRpZiAocnVuVGVzdFBhdGggPT09IHRydWUpXG5cdFx0e1xuXHRcdFx0aWYgKHRlc3RQYXRoID09IG51bGwpXG5cdFx0XHR7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvciAoYEhvdFRlc3RlcjogVGVzdCBwYXRoICR7dGVzdFBhdGhOYW1lfSBkb2VzIG5vdCBoYXZlIGEgZnVuY3Rpb24hYCk7XG5cdFx0XHR9XG5cblx0XHRcdHJlc3VsdCA9IGF3YWl0IHRlc3RQYXRoICh0aGlzLmRyaXZlcik7XG5cdFx0fVxuXG5cdFx0aWYgKHNraXBFdmVudENhbGxzID09PSBmYWxzZSlcblx0XHR7XG5cdFx0XHRpZiAodGhpcy5vblRlc3RQYWdlUGF0aEVuZCAhPSBudWxsKVxuXHRcdFx0XHRhd2FpdCB0aGlzLm9uVGVzdFBhZ2VQYXRoRW5kIChkZXN0aW5hdGlvbiwgdGVzdFBhdGgsIHJlc3VsdCwgY29udGludWVXaGVuVGVzdElzQ29tcGxldGUpO1xuXHRcdH1cblxuXHRcdHJldHVybiAocmVzdWx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBFeGVjdXRlIGEgY29tbWFuZC5cblx0ICovXG5cdGFzeW5jIGV4ZWN1dGVDb21tYW5kIChkZXN0aW5hdGlvbjogSG90RGVzdGluYXRpb24sIHBhZ2U6IEhvdFRlc3RQYWdlLCBzdG9wOiBIb3RUZXN0U3RvcCwgY21kOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+XG5cdHtcblx0XHQvKipcblx0XHQgKiBDaGVjayBpZiB0aGUgaW5wdXQgY29tbWFuZCBtYXRjaGVzLlxuXHRcdCAqL1xuXHRcdGxldCBoYXNDbWQ6IChpbnB1dDogc3RyaW5nLCBjbWQ6IHN0cmluZywgaGFzQXJndW1lbnRzOiBib29sZWFuKSA9PiBib29sZWFuID0gXG5cdFx0XHQoaW5wdXQ6IHN0cmluZywgY21kOiBzdHJpbmcsIGhhc0FyZ3VtZW50czogYm9vbGVhbik6IGJvb2xlYW4gPT5cblx0XHRcdHtcblx0XHRcdFx0bGV0IHJlc3VsdDogYm9vbGVhbiA9IGZhbHNlO1xuXG5cdFx0XHRcdGlmIChzdG9wLmNtZCA9PT0gY21kKVxuXHRcdFx0XHRcdHJlc3VsdCA9IHRydWU7XG5cblx0XHRcdFx0Y29uc3QgcG9zOiBudW1iZXIgPSBzdG9wLmNtZC5pbmRleE9mIChcIihcIik7XG5cblx0XHRcdFx0Ly8gSWYgdGhlcmUncyBwYXJlbnRoZXNpcywgZ2V0IHRoZSBpbmNvbWluZyBjb21tYW5kLlxuXHRcdFx0XHRpZiAocG9zID4gLTEpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRsZXQgaW5wdXRDbWQ6IHN0cmluZyA9IHN0b3AuY21kLnN1YnN0ciAoMCwgcG9zKTtcblxuXHRcdFx0XHRcdGlmIChpbnB1dENtZCA9PT0gY21kKVxuXHRcdFx0XHRcdFx0cmVzdWx0ID0gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAocmVzdWx0KTtcblx0XHRcdH07XG5cdFx0LyoqXG5cdFx0ICogR2V0IHRoZSBhcmd1bWVudHMgaW4gYSBjb21tYW5kLiBUaGlzIHdpbGwgb25seSByZXR1cm4gYSBcblx0XHQgKiBzaW5nbGUgYXJndW1lbnQgZm9yIG5vdy5cblx0XHQgKiBcblx0XHQgKiBAZml4bWUgQWRkIHN1cHBvcnQgZm9yIG11bHRpcGxlIGFyZ3VtZW50cy5cblx0XHQgKi9cblx0XHRsZXQgZ2V0Q21kQXJnczogKGlucHV0OiBzdHJpbmcpID0+IHN0cmluZ1tdID0gXG5cdFx0XHQoaW5wdXQ6IHN0cmluZyk6IHN0cmluZ1tdID0+XG5cdFx0XHR7XG5cdFx0XHRcdGxldCByZXN1bHRzOiBzdHJpbmdbXSA9IFtdO1xuXHRcdFx0XHRsZXQgbWF0Y2hlcyA9IGlucHV0Lm1hdGNoICgvKD89XFwoKSguKj8pKD89XFwpKS9nKTtcblxuXHRcdFx0XHRpZiAobWF0Y2hlcyAhPSBudWxsKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bGV0IHRlbXBNYXRjaCA9IG1hdGNoZXNbMF07XG5cblx0XHRcdFx0XHQvLyBBIGxpdHRsZSBoYWNrLCBzaW5jZSBJIHN1Y2sgYXQgUmVnZXggOihcblx0XHRcdFx0XHR0ZW1wTWF0Y2ggPSB0ZW1wTWF0Y2guc3Vic3RyICgyLCB0ZW1wTWF0Y2gubGVuZ3RoKTtcblxuXHRcdFx0XHRcdHJlc3VsdHMucHVzaCAodGVtcE1hdGNoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChyZXN1bHRzLmxlbmd0aCA8IDEpXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yIChgSG90VGVzdGVyOiBDb21tYW5kICR7aW5wdXR9IHJlcXVpcmVzIGFyZ3VtZW50cywgYnV0IG5vbmUgd2VyZSBzdXBwbGllZC5gKTtcblxuXHRcdFx0XHRyZXR1cm4gKHJlc3VsdHMpO1xuXHRcdFx0fTtcblxuXHRcdGxldCBjbWRGdW5jOiAoKGNtZEFyZ3M6IHN0cmluZ1tdKSA9PiBQcm9taXNlPHZvaWQ+KSA9IG51bGw7XG5cdFx0bGV0IGFyZ3M6IHN0cmluZ1tdID0gW107XG5cblx0XHRpZiAoaGFzQ21kIChzdG9wLmNtZCwgXCJ3YWl0Rm9yVGVzdGVyQVBJRGF0YVwiLCBmYWxzZSkgPT09IHRydWUpXG5cdFx0e1xuXHRcdFx0Y21kRnVuYyA9IGFzeW5jIChjbWRBcmdzOiBzdHJpbmdbXSk6IFByb21pc2U8dm9pZD4gPT5cblx0XHRcdFx0e1xuXHRcdFx0XHRcdHRoaXMuZmluaXNoZWRMb2FkaW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0YXdhaXQgdGhpcy53YWl0Rm9yRGF0YSAoKTtcblx0XHRcdFx0fTtcblx0XHR9XG5cblx0XHRpZiAoaGFzQ21kIChzdG9wLmNtZCwgXCJ3YWl0XCIsIHRydWUpID09PSB0cnVlKVxuXHRcdHtcblx0XHRcdGFyZ3MgPSBnZXRDbWRBcmdzIChzdG9wLmNtZCk7XG5cblx0XHRcdGNtZEZ1bmMgPSBhc3luYyAoY21kQXJnczogc3RyaW5nW10pOiBQcm9taXNlPHZvaWQ+ID0+XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRsZXQgbnVtTWlsbGlzZWNvbmRzOiBudW1iZXIgPSBwYXJzZUludCAoY21kQXJnc1swXSk7XG5cblx0XHRcdFx0XHRhd2FpdCBIb3RTdGFxLndhaXQgKG51bU1pbGxpc2Vjb25kcyk7XG5cdFx0XHRcdH07XG5cdFx0fVxuXG5cdFx0aWYgKGhhc0NtZCAoc3RvcC5jbWQsIFwidXJsXCIsIHRydWUpID09PSB0cnVlKVxuXHRcdHtcblx0XHRcdGFyZ3MgPSBnZXRDbWRBcmdzIChzdG9wLmNtZCk7XG5cblx0XHRcdGNtZEZ1bmMgPSBhc3luYyAoY21kQXJnczogc3RyaW5nW10pOiBQcm9taXNlPHZvaWQ+ID0+XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRsZXQgaW5wdXQ6IHN0cmluZyA9IGNtZEFyZ3NbMF07XG5cblx0XHRcdFx0XHRhd2FpdCB0aGlzLmRyaXZlci5uYXZpZ2F0ZVRvVXJsIChpbnB1dCk7XG5cdFx0XHRcdH07XG5cdFx0fVxuXG5cdFx0aWYgKGhhc0NtZCAoc3RvcC5jbWQsIFwicHJpbnRcIiwgdHJ1ZSkgPT09IHRydWUpXG5cdFx0e1xuXHRcdFx0YXJncyA9IGdldENtZEFyZ3MgKHN0b3AuY21kKTtcblxuXHRcdFx0Y21kRnVuYyA9IGFzeW5jIChjbWRBcmdzOiBzdHJpbmdbXSk6IFByb21pc2U8dm9pZD4gPT5cblx0XHRcdFx0e1xuXHRcdFx0XHRcdGxldCBpbnB1dDogc3RyaW5nID0gY21kQXJnc1swXTtcblxuXHRcdFx0XHRcdGF3YWl0IHRoaXMuZHJpdmVyLnByaW50IChpbnB1dCk7XG5cdFx0XHRcdH07XG5cdFx0fVxuXG5cdFx0aWYgKGhhc0NtZCAoc3RvcC5jbWQsIFwicHJpbnRsblwiLCB0cnVlKSA9PT0gdHJ1ZSlcblx0XHR7XG5cdFx0XHRhcmdzID0gZ2V0Q21kQXJncyAoc3RvcC5jbWQpO1xuXG5cdFx0XHRjbWRGdW5jID0gYXN5bmMgKGNtZEFyZ3M6IHN0cmluZ1tdKTogUHJvbWlzZTx2b2lkPiA9PlxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bGV0IGlucHV0OiBzdHJpbmcgPSBjbWRBcmdzWzBdO1xuXG5cdFx0XHRcdFx0YXdhaXQgdGhpcy5kcml2ZXIucHJpbnRsbiAoaW5wdXQpO1xuXHRcdFx0XHR9O1xuXHRcdH1cblxuXHRcdGlmIChoYXNDbWQgKHN0b3AuY21kLCBcIndhaXRGb3JUZXN0T2JqZWN0XCIsIHRydWUpID09PSB0cnVlKVxuXHRcdHtcblx0XHRcdGFyZ3MgPSBnZXRDbWRBcmdzIChzdG9wLmNtZCk7XG5cblx0XHRcdGNtZEZ1bmMgPSBhc3luYyAoY21kQXJnczogc3RyaW5nW10pOiBQcm9taXNlPHZvaWQ+ID0+XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRsZXQgdGVzdE9iamVjdDogc3RyaW5nID0gSlNPTi5wYXJzZSAoY21kQXJnc1swXSk7XG5cblx0XHRcdFx0XHRhd2FpdCB0aGlzLmRyaXZlci53YWl0Rm9yVGVzdEVsZW1lbnQgKHRlc3RPYmplY3QpO1xuXHRcdFx0XHR9O1xuXHRcdH1cblxuXHRcdGlmIChjbWRGdW5jID09IG51bGwpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IgKGBIb3RUZXN0ZXI6IENvbW1hbmQgJHtzdG9wLmNtZH0gZG9lcyBub3QgZXhpc3QhYCk7XG5cblx0XHRhd2FpdCB0aGlzLm9uQ29tbWFuZCAoZGVzdGluYXRpb24sIHBhZ2UsIHN0b3AsIGNtZCwgYXJncywgY21kRnVuYyk7XG5cdH1cblxuXHQvKipcblx0ICogRXhlY3V0ZSBhbGwgdGVzdCBwYXRocyBpbiBhIHBhZ2UuXG5cdCAqL1xuXHRhc3luYyBleGVjdXRlVGVzdFBhZ2VQYXRocyAoZGVzdGluYXRpb246IEhvdERlc3RpbmF0aW9uLCBjb250aW51ZVdoZW5UZXN0SXNDb21wbGV0ZTogYm9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxhbnlbXT5cblx0e1xuXHRcdGxldCByZXN1bHRzOiBhbnlbXSA9IFtdO1xuXHRcdGxldCB0ZXN0TWFwOiBIb3RUZXN0TWFwID0gdGhpcy50ZXN0TWFwc1tkZXN0aW5hdGlvbi5tYXBOYW1lXTtcblxuXHRcdC8vLyBAZml4bWUgRm9yIHNvbWUgcmVhc29uIHRoZSBlcnJvcnMgYmVpbmcgdGhyb3duIGhlcmUgYXJlIG5vdCBiZWluZyB0aHJvd24uXG5cdFx0aWYgKHRlc3RNYXAgPT0gbnVsbClcblx0XHRcdHRocm93IG5ldyBFcnJvciAoYEhvdFRlc3RlcjogTWFwICR7ZGVzdGluYXRpb24ubWFwTmFtZX0gZG9lcyBub3QgZXhpc3QhYCk7XG5cblx0XHQvLyBJdGVyYXRlIHRocm91Z2ggZWFjaCBwYXRoIGluIHRoZSBkZXN0aW5hdGlvbiB1bnRpbCBjb21wbGV0ZS5cblx0XHRmb3IgKGxldCBpSWR4ID0gMDsgaUlkeCA8IGRlc3RpbmF0aW9uLnBhdGhzLmxlbmd0aDsgaUlkeCsrKVxuXHRcdHtcblx0XHRcdGxldCBzdG9wOiBIb3RUZXN0U3RvcCA9IGRlc3RpbmF0aW9uLnBhdGhzW2lJZHhdO1xuXHRcdFx0bGV0IHJlc3VsdDogYW55ID0gbnVsbDtcblx0XHRcdGxldCBwYWdlOiBIb3RUZXN0UGFnZSA9IHRlc3RNYXAucGFnZXNbZGVzdGluYXRpb24ucGFnZV07XG5cdFxuXHRcdFx0aWYgKHBhZ2UgPT0gbnVsbClcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yIChgSG90VGVzdGVyOiBQYWdlICR7ZGVzdGluYXRpb24ucGFnZX0gZG9lcyBub3QgZXhpc3QhYCk7XG5cblx0XHRcdGlmIChzdG9wLmRlc3QgIT09IFwiXCIpXG5cdFx0XHR7XG5cdFx0XHRcdGlmICh0ZXN0TWFwLmRlc3RpbmF0aW9ucyBpbnN0YW5jZW9mIEFycmF5KVxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvciAoYEhvdFRlc3RlcjogV2hlbiB1c2luZyB0eXBlICdkZXN0JyBpbiBhIGRlc3RpbmF0aW9uIHN0cmluZywgYWxsIGRlc3RpbmF0aW9ucyBpbiBtYXAgJHtkZXN0aW5hdGlvbi5tYXBOYW1lfSBtdXN0IGJlIG5hbWVkLmApO1xuXG5cdFx0XHRcdGxldCB0ZXN0RGVzdDogSG90VGVzdERlc3RpbmF0aW9uID0gdGVzdE1hcC5kZXN0aW5hdGlvbnNbc3RvcC5kZXN0XTtcblx0XHRcdFx0bGV0IG5ld0Rlc3RpbmF0aW9uOiBIb3REZXN0aW5hdGlvbiA9IEhvdFRlc3Rlci5pbnRlcnByZXREZXN0aW5hdGlvbiAoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlc3RpbmF0aW9uLm1hcE5hbWUsIHRlc3REZXN0KTtcblxuXHRcdFx0XHRyZXN1bHQgPSBhd2FpdCB0aGlzLmV4ZWN1dGVUZXN0UGFnZVBhdGhzIChuZXdEZXN0aW5hdGlvbik7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChzdG9wLmNtZCAhPT0gXCJcIilcblx0XHRcdFx0YXdhaXQgdGhpcy5leGVjdXRlQ29tbWFuZCAoZGVzdGluYXRpb24sIHBhZ2UsIHN0b3AsIHN0b3AuY21kKTtcblxuXHRcdFx0aWYgKHN0b3AucGF0aCAhPT0gXCJcIilcblx0XHRcdFx0cmVzdWx0ID0gYXdhaXQgdGhpcy5leGVjdXRlVGVzdFBhZ2VQYXRoIChkZXN0aW5hdGlvbiwgc3RvcCwgZmFsc2UsIGNvbnRpbnVlV2hlblRlc3RJc0NvbXBsZXRlKTtcblxuXHRcdFx0cmVzdWx0cy5wdXNoIChyZXN1bHQpO1xuXHRcdH1cblxuXHRcdHJldHVybiAocmVzdWx0cyk7XG5cdH1cblxuXHQvKipcblx0ICogRXhlY3V0ZSB0aGUgdGVzdHMuXG5cdCAqL1xuXHRhc3luYyBleGVjdXRlIChtYXBOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+XG5cdHtcblx0XHRsZXQgbWFwOiBIb3RUZXN0TWFwID0gdGhpcy50ZXN0TWFwc1ttYXBOYW1lXTtcblxuXHRcdGlmIChtYXAgPT0gbnVsbClcblx0XHRcdHRocm93IG5ldyBFcnJvciAoYEhvdFRlc3RlcjogTWFwICR7bWFwTmFtZX0gZG9lcyBub3QgZXhpc3QhYCk7XG5cblx0XHQvLyBQcm9jZXNzIHJvdXRlcyB0ZXN0aW5nIGZpcnN0LlxuXHRcdGxldCByb3V0ZUtleTogc3RyaW5nID0gdGhpcy5wcm9jZXNzb3IuZ2V0Um91dGVLZXlGcm9tTmFtZSAobWFwTmFtZSk7XG5cdFx0bGV0IHVybDogc3RyaW5nID0gXCJcIjtcblxuXHRcdGlmIChyb3V0ZUtleSAhPT0gXCJcIilcblx0XHRcdHVybCA9IGAke3RoaXMuYmFzZVVybH0ke3JvdXRlS2V5fWA7XG5cblx0XHRsZXQgZXhlY3V0ZURlc3RpbmF0aW9uOiAodGVzdERlc3Q6IEhvdFRlc3REZXN0aW5hdGlvbiwgZGVzdGluYXRpb25LZXk/OiBzdHJpbmcpID0+IFByb21pc2U8dm9pZD4gPSBcblx0XHRcdGFzeW5jICh0ZXN0RGVzdDogSG90VGVzdERlc3RpbmF0aW9uLCBkZXN0aW5hdGlvbktleTogc3RyaW5nID0gXCJcIikgPT5cblx0XHRcdHtcblx0XHRcdFx0aWYgKHRlc3REZXN0LmF1dG9TdGFydCA9PT0gZmFsc2UpXG5cdFx0XHRcdFx0cmV0dXJuO1xuXG5cdFx0XHRcdGxldCBkZXN0aW5hdGlvbjogSG90RGVzdGluYXRpb24gPSBIb3RUZXN0ZXIuaW50ZXJwcmV0RGVzdGluYXRpb24gKG1hcE5hbWUsIHRlc3REZXN0KTtcblx0XHRcdFx0bGV0IGlzV2ViUm91dGU6IGJvb2xlYW4gPSBmYWxzZTtcblx0XHRcdFx0bGV0IHJ1blRlc3RQYXRoczogYm9vbGVhbiA9IHRydWU7XG5cblx0XHRcdFx0aWYgKGRlc3RpbmF0aW9uLnBhZ2UgIT09IFwiXCIpXG5cdFx0XHRcdFx0aXNXZWJSb3V0ZSA9IHRydWU7XG5cdFxuXHRcdFx0XHRpZiAodGhpcy5zZXR1cCAhPSBudWxsKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWYgKHRoaXMuaGFzQmVlblNldHVwID09PSBmYWxzZSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRhd2FpdCB0aGlzLnNldHVwIChpc1dlYlJvdXRlLCB1cmwsIGRlc3RpbmF0aW9uS2V5KTtcblx0XHRcdFx0XHRcdHRoaXMuaGFzQmVlblNldHVwID0gdHJ1ZTtcblx0XHRcdFx0XHRcdHRoaXMuaGFzQmVlbkRlc3Ryb3llZCA9IGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcblx0XHRcdFx0aWYgKHRoaXMub25UZXN0U3RhcnQgIT0gbnVsbClcblx0XHRcdFx0XHRydW5UZXN0UGF0aHMgPSBhd2FpdCB0aGlzLm9uVGVzdFN0YXJ0IChkZXN0aW5hdGlvbiwgdXJsLCBkZXN0aW5hdGlvbktleSk7XG5cdFxuXHRcdFx0XHRpZiAocnVuVGVzdFBhdGhzID09PSB0cnVlKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWYgKGRlc3RpbmF0aW9uLnBhZ2UgIT09IFwiXCIpXG5cdFx0XHRcdFx0XHRhd2FpdCB0aGlzLmV4ZWN1dGVUZXN0UGFnZVBhdGhzIChkZXN0aW5hdGlvbik7XG5cdFxuXHRcdFx0XHRcdGlmIChkZXN0aW5hdGlvbi5hcGkgIT09IFwiXCIpXG5cdFx0XHRcdFx0XHRhd2FpdCB0aGlzLmV4ZWN1dGVUZXN0QVBJUGF0aHMgKGRlc3RpbmF0aW9uKTtcblx0XHRcdFx0fVxuXHRcdFxuXHRcdFx0XHRpZiAodGhpcy5vblRlc3RFbmQgIT0gbnVsbClcblx0XHRcdFx0XHRhd2FpdCB0aGlzLm9uVGVzdEVuZCAoZGVzdGluYXRpb24pO1xuXHRcblx0XHRcdFx0aWYgKHRoaXMuZGVzdHJveSAhPSBudWxsKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWYgKHRoaXMuaGFzQmVlbkRlc3Ryb3llZCA9PT0gZmFsc2UpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0YXdhaXQgdGhpcy5kZXN0cm95ICgpO1xuXHRcdFx0XHRcdFx0dGhpcy5oYXNCZWVuRGVzdHJveWVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdHRoaXMuaGFzQmVlblNldHVwID0gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0Ly8gSWYgdGhlIG1hcCBkZXN0aW5hdGlvbnMgYXJlIGluIGFuIGFycmF5LCBqdXN0IGV4ZWN1dGUgdGhvc2UgaW4gb3JkZXIuXG5cdFx0aWYgKG1hcC5kZXN0aW5hdGlvbnMgaW5zdGFuY2VvZiBBcnJheSlcblx0XHR7XG5cdFx0XHRmb3IgKGxldCBpSWR4ID0gMDsgaUlkeCA8IG1hcC5kZXN0aW5hdGlvbnMubGVuZ3RoOyBpSWR4KyspXG5cdFx0XHR7XG5cdFx0XHRcdGxldCB0ZXN0RGVzdDogSG90VGVzdERlc3RpbmF0aW9uID0gbWFwLmRlc3RpbmF0aW9uc1tpSWR4XTtcblxuXHRcdFx0XHRhd2FpdCBleGVjdXRlRGVzdGluYXRpb24gKHRlc3REZXN0KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdC8vIElmIHRoZXJlJ3MgYSBkZXN0aW5hdGlvbiBvcmRlciwgdXNlIHRoYXQuXG5cdFx0XHRpZiAobWFwLmRlc3RpbmF0aW9uT3JkZXIubGVuZ3RoID4gMClcblx0XHRcdHtcblx0XHRcdFx0bGV0IGhhc0V4ZWN1dGVkS2V5czogc3RyaW5nW10gPSBbXTtcblxuXHRcdFx0XHQvLyBHbyB0aHJvdWdoIHRoZSBkZXN0aW5hdGlvbiBvcmRlciBhbmQgZXhlY3V0ZSBlYWNoIG9uZS5cblx0XHRcdFx0Zm9yIChsZXQgaUlkeCA9IDA7IGlJZHggPCBtYXAuZGVzdGluYXRpb25PcmRlci5sZW5ndGg7IGlJZHgrKylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGxldCBvcmRlcktleTogc3RyaW5nID0gbWFwLmRlc3RpbmF0aW9uT3JkZXJbaUlkeF07XG5cdFx0XHRcdFx0bGV0IHRlc3REZXN0OiBIb3RUZXN0RGVzdGluYXRpb24gPSBtYXAuZGVzdGluYXRpb25zW29yZGVyS2V5XTtcblxuXHRcdFx0XHRcdGlmICh0ZXN0RGVzdCA9PSBudWxsKVxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yIChgSG90VGVzdGVyOiBEZXN0aW5hdGlvbiAke29yZGVyS2V5fSBkb2VzIG5vdCBleGlzdCFgKTtcblxuXHRcdFx0XHRcdGhhc0V4ZWN1dGVkS2V5cy5wdXNoIChvcmRlcktleSk7XG5cdFx0XHRcdFx0YXdhaXQgZXhlY3V0ZURlc3RpbmF0aW9uICh0ZXN0RGVzdCwgb3JkZXJLZXkpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gRXhlY3V0ZSB0aGUgcmVzdCBvZiB0aGUgZGVzdGluYXRpb25zIHRoYXQgaGF2ZSBub3QgYmVlbiBleGVjdXRlZCB5ZXQuXG5cdFx0XHRcdGZvciAobGV0IGtleSBpbiBtYXAuZGVzdGluYXRpb25zKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bGV0IGV4ZWN1dGVEZXN0OiBib29sZWFuID0gdHJ1ZTtcblxuXHRcdFx0XHRcdGZvciAobGV0IGlJZHggPSAwOyBpSWR4IDwgaGFzRXhlY3V0ZWRLZXlzLmxlbmd0aDsgaUlkeCsrKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGxldCBleGVjdXRlZEtleTogc3RyaW5nID0gaGFzRXhlY3V0ZWRLZXlzW2lJZHhdO1xuXG5cdFx0XHRcdFx0XHRpZiAoZXhlY3V0ZWRLZXkgPT09IGtleSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0ZXhlY3V0ZURlc3QgPSBmYWxzZTtcblxuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoZXhlY3V0ZURlc3QgPT09IHRydWUpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0bGV0IHRlc3REZXN0OiBIb3RUZXN0RGVzdGluYXRpb24gPSBtYXAuZGVzdGluYXRpb25zW2tleV07XG5cblx0XHRcdFx0XHRcdGF3YWl0IGV4ZWN1dGVEZXN0aW5hdGlvbiAodGVzdERlc3QsIGtleSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdC8vIEV4ZWN1dGUgdGhlIGRlc3RpbmF0aW9ucyBpbiBhbnkgb3JkZXIuXG5cdFx0XHRcdGZvciAobGV0IGtleSBpbiBtYXAuZGVzdGluYXRpb25zKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bGV0IHRlc3REZXN0OiBIb3RUZXN0RGVzdGluYXRpb24gPSBtYXAuZGVzdGluYXRpb25zW2tleV07XG5cblx0XHRcdFx0XHRhd2FpdCBleGVjdXRlRGVzdGluYXRpb24gKHRlc3REZXN0LCBrZXkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gRW5kIG9mIHJvdXRlcyB0ZXN0aW5nXG5cblx0XHQvLyBTdGFydCBvZiBBUEkgdGVzdGluZ1xuXG5cdH1cbn0iLCJpbXBvcnQgeyBFdmVudEV4ZWN1dGlvblR5cGUsIEhvdEFQSSB9IGZyb20gXCIuL0hvdEFQSVwiO1xuaW1wb3J0IHsgSG90Um91dGUgfSBmcm9tIFwiLi9Ib3RSb3V0ZVwiO1xuaW1wb3J0IHsgSG90Q2xpZW50IH0gZnJvbSBcIi4vSG90Q2xpZW50XCI7XG5pbXBvcnQgeyBIb3RTZXJ2ZXIgfSBmcm9tIFwiLi9Ib3RTZXJ2ZXJcIjtcbmltcG9ydCB7IEhvdFRlc3REcml2ZXIgfSBmcm9tIFwiLi9Ib3RUZXN0RHJpdmVyXCI7XG5pbXBvcnQgeyBIb3RUZXN0ZXIgfSBmcm9tIFwiLi9Ib3RUZXN0ZXJcIjtcbmltcG9ydCB7IEhvdFRlc3RNYXAsIEhvdFRlc3RQYXRoLCBIb3RUZXN0UGFnZSB9IGZyb20gXCIuL0hvdFRlc3RNYXBcIjtcblxuZXhwb3J0IGNsYXNzIEhvdFRlc3RlckFQSSBleHRlbmRzIEhvdEFQSVxue1xuXHRjb25zdHJ1Y3RvciAoYmFzZVVybDogc3RyaW5nLCBjb25uZWN0aW9uOiBIb3RTZXJ2ZXIgfCBIb3RDbGllbnQgPSBudWxsLCBkYjogYW55ID0gbnVsbClcblx0e1xuXHRcdHN1cGVyKGJhc2VVcmwsIGNvbm5lY3Rpb24sIGRiKTtcblxuXHRcdHRoaXMuZXhlY3V0ZUV2ZW50c1VzaW5nID0gRXZlbnRFeGVjdXRpb25UeXBlLkhvdEFQSTtcblxuXHRcdGxldCByb3V0ZTogSG90Um91dGUgPSBuZXcgSG90Um91dGUgKGNvbm5lY3Rpb24sIFwidGVzdGVyXCIpO1xuXHRcdHJvdXRlLmFkZE1ldGhvZCAoXCJwYWdlTG9hZGVkXCIsIHRoaXMucGFnZUxvYWRlZCk7XG5cdFx0cm91dGUuYWRkTWV0aG9kIChcImV4ZWN1dGVUZXN0c1wiLCB0aGlzLmV4ZWN1dGVUZXN0cyk7XG5cdFx0dGhpcy5hZGRSb3V0ZSAocm91dGUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoaXMgaXMgY2FsbGVkIHdoZW4gdGhlIHBhZ2UgaGFzIGZpbmlzaGVkIGxvYWRpbmcgaW4gZGV2ZWxvcG1lbnQgbW9kZS5cblx0ICovXG5cdGFzeW5jIHBhZ2VMb2FkZWQgKHJlcTogYW55LCByZXM6IGFueSwgYXV0aG9yaXplZFZhbHVlOiBhbnksIGpzb25PYmo6IGFueSwgcXVlcnlPYmo6IGFueSk6IFByb21pc2U8YW55PlxuXHR7XG5cdFx0bGV0IHRlc3Rlck9iajoge1xuXHRcdFx0XHR0ZXN0ZXJOYW1lOiBzdHJpbmc7XG5cdFx0XHRcdHRlc3Rlck1hcDogc3RyaW5nO1xuXHRcdFx0XHRwYWdlTmFtZTogc3RyaW5nO1xuXHRcdFx0XHR0ZXN0RWxlbWVudHM6IGFueTtcblx0XHRcdFx0dGVzdFBhdGhzU3RyczogYW55O1xuXHRcdFx0fSA9IHtcblx0XHRcdFx0dGVzdGVyTmFtZToganNvbk9ialtcInRlc3Rlck5hbWVcIl0sXG5cdFx0XHRcdHRlc3Rlck1hcDoganNvbk9ialtcInRlc3Rlck1hcFwiXSxcblx0XHRcdFx0cGFnZU5hbWU6IGpzb25PYmpbXCJwYWdlTmFtZVwiXSxcblx0XHRcdFx0dGVzdEVsZW1lbnRzOiBqc29uT2JqW1widGVzdEVsZW1lbnRzXCJdLFxuXHRcdFx0XHR0ZXN0UGF0aHNTdHJzOiBqc29uT2JqW1widGVzdFBhdGhzXCJdXG5cdFx0XHR9O1xuXG5cdFx0Zm9yIChsZXQga2V5IGluIHRlc3Rlck9iailcblx0XHR7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRsZXQgdGVzdE9iajogYW55ID0gdGVzdGVyT2JqW2tleV07XG5cdFx0XHRsZXQgdGhyb3dFcnJvcjogYm9vbGVhbiA9IGZhbHNlO1xuXG5cdFx0XHRpZiAodGVzdE9iaiA9PSBudWxsKVxuXHRcdFx0XHR0aHJvd0Vycm9yID0gdHJ1ZTtcblxuXHRcdFx0aWYgKCh0ZXN0ZXJPYmoudGVzdGVyTmFtZSA9PSBcIlwiKSB8fCBcblx0XHRcdFx0KHRlc3Rlck9iai50ZXN0ZXJNYXAgPT09IFwiXCIpIHx8IFxuXHRcdFx0XHQodGVzdGVyT2JqLnRlc3RFbGVtZW50cyA9PT0gXCJcIikgfHwgXG5cdFx0XHRcdCh0ZXN0ZXJPYmoudGVzdFBhdGhzU3RycyA9PT0gXCJcIikpXG5cdFx0XHR7XG5cdFx0XHRcdHRocm93RXJyb3IgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhyb3dFcnJvciA9PT0gdHJ1ZSlcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yIChgVGVzdGVyQVBJOiBPYmplY3QgJHtrZXl9IHdhcyBub3QgcGFzc2VkLmApO1xuXHRcdH1cblxuXHRcdHRlc3Rlck9iai50ZXN0RWxlbWVudHMgPSBKU09OLnBhcnNlICh0ZXN0ZXJPYmoudGVzdEVsZW1lbnRzKTtcblx0XHR0ZXN0ZXJPYmoudGVzdFBhdGhzU3RycyA9IEpTT04ucGFyc2UgKHRlc3Rlck9iai50ZXN0UGF0aHNTdHJzKTtcblxuXHRcdGxldCB0ZXN0UGF0aHM6IHsgW25hbWU6IHN0cmluZ106IEhvdFRlc3RQYXRoOyB9ID0ge307XG5cblx0XHRmb3IgKGxldCBrZXkgaW4gdGVzdGVyT2JqLnRlc3RQYXRoc1N0cnMpXG5cdFx0e1xuXHRcdFx0bGV0IHRlc3RQYXRoOiAoZHJpdmVyOiBIb3RUZXN0RHJpdmVyLCAuLi5hcmdzOiBhbnkpID0+IFByb21pc2U8YW55PiA9IFxuXHRcdFx0XHRldmFsICh0ZXN0ZXJPYmoudGVzdFBhdGhzU3Ryc1trZXldKTtcblxuXHRcdFx0dGVzdFBhdGhzW2tleV0gPSB0ZXN0UGF0aDtcblx0XHR9XG5cblx0XHRsZXQgdGVzdGVyOiBIb3RUZXN0ZXIgPSB0aGlzLmNvbm5lY3Rpb24ucHJvY2Vzc29yLnRlc3RlcnNbdGVzdGVyT2JqLnRlc3Rlck5hbWVdO1xuXG5cdFx0aWYgKHRlc3RlciA9PSBudWxsKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yIChgVGVzdGVyQVBJOiBUZXN0ZXIgJHt0ZXN0ZXJPYmoudGVzdGVyTWFwfSBkb2VzIG5vdCBleGlzdCFgKTtcblxuXHRcdGxldCB0ZXN0TWFwOiBIb3RUZXN0TWFwID0gdGVzdGVyLnRlc3RNYXBzW3Rlc3Rlck9iai50ZXN0ZXJNYXBdO1xuXG5cdFx0aWYgKHRlc3RNYXAgPT0gbnVsbClcblx0XHRcdHRocm93IG5ldyBFcnJvciAoYFRlc3RlckFQSTogVGVzdGVyIG1hcCAke3Rlc3Rlck9iai50ZXN0ZXJNYXB9IGRvZXMgbm90IGV4aXN0IWApO1xuXG5cdFx0dGVzdE1hcC5wYWdlc1t0ZXN0ZXJPYmoucGFnZU5hbWVdID0ge1xuXHRcdFx0XHRcInRlc3RFbGVtZW50c1wiOiB7fSxcblx0XHRcdFx0XCJ0ZXN0UGF0aHNcIjoge31cblx0XHRcdH07XG5cdFx0dGVzdE1hcC5wYWdlc1t0ZXN0ZXJPYmoucGFnZU5hbWVdLnRlc3RFbGVtZW50cyA9IHRlc3Rlck9iai50ZXN0RWxlbWVudHM7XG5cdFx0dGVzdE1hcC5wYWdlc1t0ZXN0ZXJPYmoucGFnZU5hbWVdLnRlc3RQYXRocyA9IHRlc3RQYXRocztcblxuXHRcdHRlc3Rlci5maW5pc2hlZExvYWRpbmcgPSB0cnVlO1xuXG5cdFx0aWYgKHRlc3Rlci5vbkZpbmlzaGVkTG9hZGluZyAhPSBudWxsKVxuXHRcdFx0YXdhaXQgdGVzdGVyLm9uRmluaXNoZWRMb2FkaW5nICgpO1xuXG5cdFx0cmV0dXJuICh0cnVlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBFeGVjdXRlIHRoZSB0ZXN0cyBmb3IgYSBwYWdlLlxuXHQgKi9cblx0YXN5bmMgZXhlY3V0ZVRlc3RzIChyZXE6IGFueSwgcmVzOiBhbnksIGF1dGhvcml6ZWRWYWx1ZTogYW55LCBqc29uT2JqOiBhbnksIHF1ZXJ5T2JqOiBhbnkpOiBQcm9taXNlPGFueT5cblx0e1xuXHRcdGxldCB0ZXN0ZXJOYW1lOiBzdHJpbmcgPSBqc29uT2JqW1widGVzdGVyTmFtZVwiXTtcblx0XHRsZXQgdGVzdGVyTWFwOiBzdHJpbmcgPSBqc29uT2JqW1widGVzdGVyTWFwXCJdO1xuXG5cdFx0aWYgKCh0ZXN0ZXJOYW1lID09IG51bGwpIHx8ICh0ZXN0ZXJNYXAgPT0gbnVsbCkpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IgKFwiVGVzdGVyQVBJOiBOb3QgYWxsIHJlcXVpcmVkIGpzb24gb2JqZWN0cyB3ZXJlIHBhc3NlZC5cIik7XG5cblx0XHRpZiAoKHRlc3Rlck5hbWUgPT09IFwiXCIpIHx8ICh0ZXN0ZXJNYXAgPT09IFwiXCIpKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yIChcIlRlc3RlckFQSTogTm90IGFsbCByZXF1aXJlZCBqc29uIG9iamVjdHMgd2VyZSBwYXNzZWQuXCIpO1xuXG5cdFx0bGV0IHNlcnZlcjogSG90U2VydmVyID0gKDxIb3RTZXJ2ZXI+dGhpcy5jb25uZWN0aW9uKTtcblxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRpZiAoc2VydmVyLmV4ZWN1dGVUZXN0cyAhPSBudWxsKVxuXHRcdHtcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdGF3YWl0IHNlcnZlci5leGVjdXRlVGVzdHMgKHRlc3Rlck5hbWUsIHRlc3Rlck1hcCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuICh0cnVlKTtcblx0fVxufSIsImltcG9ydCB7IEhvdFN0YXEsIEhvdFN0YXJ0T3B0aW9ucywgSUhvdFN0YXEsIFxuXHRIb3RTaXRlLCBIb3RTaXRlUm91dGUsIEhvdFNpdGVNYXBQYXRoIH0gZnJvbSBcIi4vSG90U3RhcVwiO1xuaW1wb3J0IHsgSG90LCBEZXZlbG9wZXJNb2RlIH0gZnJvbSBcIi4vSG90XCI7XG5pbXBvcnQgeyBIb3RDb21wb25lbnQsIElIb3RDb21wb25lbnQgfSBmcm9tIFwiLi9Ib3RDb21wb25lbnRcIjtcbmltcG9ydCB7IEhvdEZpbGUgfSBmcm9tIFwiLi9Ib3RGaWxlXCI7XG5pbXBvcnQgeyBIb3RMb2csIEhvdExvZ0xldmVsIH0gZnJvbSBcIi4vSG90TG9nXCI7XG5pbXBvcnQgeyBIb3RQYWdlIH0gZnJvbSBcIi4vSG90UGFnZVwiO1xuXG4vLyBTZXJ2ZXIgc3R1ZmZcbmltcG9ydCB7IEhvdEFQSSwgRXZlbnRFeGVjdXRpb25UeXBlLCBBUEl0b0xvYWQgfSBmcm9tIFwiLi9Ib3RBUElcIjtcbmltcG9ydCB7IEhvdFJvdXRlIH0gZnJvbSBcIi4vSG90Um91dGVcIjtcbmltcG9ydCB7IEhvdFJvdXRlTWV0aG9kLCBIVFRQTWV0aG9kLCBTZXJ2ZXJBdXRob3JpemF0aW9uRnVuY3Rpb24sIFNlcnZlckV4ZWN1dGlvbkZ1bmN0aW9uIH0gZnJvbSBcIi4vSG90Um91dGVNZXRob2RcIjtcbmltcG9ydCB7IEhvdFNlcnZlciB9IGZyb20gXCIuL0hvdFNlcnZlclwiO1xuaW1wb3J0IHsgSG90Q2xpZW50IH0gZnJvbSBcIi4vSG90Q2xpZW50XCI7XG5cbi8vIFRlc3Rpbmcgc3R1ZmZcbmltcG9ydCB7IEhvdFRlc3REcml2ZXIgfSBmcm9tIFwiLi9Ib3RUZXN0RHJpdmVyXCI7XG5pbXBvcnQgeyBJSG90VGVzdEVsZW1lbnQsIEhvdFRlc3RFbGVtZW50LCBIb3RUZXN0RWxlbWVudE9wdGlvbnMsIElIb3RUZXN0RWxlbWVudE9wdGlvbnMgfSBmcm9tIFwiLi9Ib3RUZXN0RWxlbWVudFwiO1xuaW1wb3J0IHsgSG90VGVzdGVyLCBIb3RUZXN0U3RvcCwgSG90RGVzdGluYXRpb24gfSBmcm9tIFwiLi9Ib3RUZXN0ZXJcIjtcbmltcG9ydCB7IEhvdFRlc3RlckFQSSB9IGZyb20gXCIuL0hvdFRlc3RlckFQSVwiO1xuaW1wb3J0IHsgSG90VGVzdE1hcCwgSG90VGVzdERlc3RpbmF0aW9uLCBIb3RUZXN0UGF0aCwgSG90VGVzdFBhZ2UgfSBmcm9tIFwiLi9Ib3RUZXN0TWFwXCI7XG5cbkhvdFN0YXEuaXNXZWIgPSB0cnVlO1xuXG4vLyBDYW4ndCBleHBvcnQgaW50ZXJmYWNlcyBmcm9tIGhlcmUgOihcblxubW9kdWxlLmV4cG9ydHNbXCJIb3RTdGFxXCJdID0gSG90U3RhcTtcbm1vZHVsZS5leHBvcnRzW1wiSG90XCJdID0gSG90O1xubW9kdWxlLmV4cG9ydHNbXCJEZXZlbG9wZXJNb2RlXCJdID0gRGV2ZWxvcGVyTW9kZTtcbm1vZHVsZS5leHBvcnRzW1wiSG90Q29tcG9uZW50XCJdID0gSG90Q29tcG9uZW50O1xubW9kdWxlLmV4cG9ydHNbXCJIb3RBUElcIl0gPSBIb3RBUEk7XG5tb2R1bGUuZXhwb3J0c1tcIkV2ZW50RXhlY3V0aW9uVHlwZVwiXSA9IEV2ZW50RXhlY3V0aW9uVHlwZTtcbm1vZHVsZS5leHBvcnRzW1wiSG90RmlsZVwiXSA9IEhvdEZpbGU7XG5tb2R1bGUuZXhwb3J0c1tcIkhvdExvZ1wiXSA9IEhvdExvZztcbm1vZHVsZS5leHBvcnRzW1wiSG90TG9nTGV2ZWxcIl0gPSBIb3RMb2dMZXZlbDtcbm1vZHVsZS5leHBvcnRzW1wiSG90UGFnZVwiXSA9IEhvdFBhZ2U7XG5tb2R1bGUuZXhwb3J0c1tcIkhvdFJvdXRlXCJdID0gSG90Um91dGU7XG5tb2R1bGUuZXhwb3J0c1tcIkhvdFJvdXRlTWV0aG9kXCJdID0gSG90Um91dGVNZXRob2Q7XG5tb2R1bGUuZXhwb3J0c1tcIkhUVFBNZXRob2RcIl0gPSBIVFRQTWV0aG9kO1xubW9kdWxlLmV4cG9ydHNbXCJIb3RTZXJ2ZXJcIl0gPSBIb3RTZXJ2ZXI7XG5tb2R1bGUuZXhwb3J0c1tcIkhvdENsaWVudFwiXSA9IEhvdENsaWVudDtcbm1vZHVsZS5leHBvcnRzW1wiSG90VGVzdGVyXCJdID0gSG90VGVzdGVyO1xubW9kdWxlLmV4cG9ydHNbXCJIb3RUZXN0ZXJBUElcIl0gPSBIb3RUZXN0ZXJBUEk7XG5tb2R1bGUuZXhwb3J0c1tcIkhvdFRlc3RNYXBcIl0gPSBIb3RUZXN0TWFwO1xubW9kdWxlLmV4cG9ydHNbXCJIb3RUZXN0RGVzdGluYXRpb25cIl0gPSBIb3RUZXN0RGVzdGluYXRpb247XG5tb2R1bGUuZXhwb3J0c1tcIkhvdFRlc3RFbGVtZW50XCJdID0gSG90VGVzdEVsZW1lbnQ7XG5tb2R1bGUuZXhwb3J0c1tcIkhvdFRlc3RFbGVtZW50T3B0aW9uc1wiXSA9IEhvdFRlc3RFbGVtZW50T3B0aW9ucztcbm1vZHVsZS5leHBvcnRzW1wiSG90VGVzdERyaXZlclwiXSA9IEhvdFRlc3REcml2ZXI7Il0sInNvdXJjZVJvb3QiOiIifQ==