globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'http';
import { Server } from 'https';
import destr from 'destr';
import { defineEventHandler, handleCacheHeaders, createEvent, eventHandler, createError, createApp, createRouter, lazyEventHandler } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ohmyfetch';
import { createRouter as createRouter$1 } from 'radix3';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import { hash } from 'ohash';
import { parseURL, withQuery, withLeadingSlash, withoutTrailingSlash, joinURL } from 'ufo';
import { createStorage } from 'unstorage';
import { promises } from 'fs';
import { dirname, resolve } from 'pathe';
import { fileURLToPath } from 'url';

const _runtimeConfig = {"app":{"baseURL":"/","buildAssetsDir":"/_nuxt/","cdnURL":""},"nitro":{"routes":{},"envPrefix":"NUXT_"},"public":{}};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _runtimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const getEnv = (key) => {
  const envKey = snakeCase(key).toUpperCase();
  return destr(process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]);
};
function isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function overrideConfig(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey);
    if (isObject(obj[key])) {
      if (isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      overrideConfig(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
}
overrideConfig(_runtimeConfig);
const config = deepFreeze(_runtimeConfig);
const useRuntimeConfig = () => config;
function deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

const globalTiming = globalThis.__timing__ || {
  start: () => 0,
  end: () => 0,
  metrics: []
};
function timingMiddleware(_req, res, next) {
  const start = globalTiming.start();
  const _end = res.end;
  res.end = (data, encoding, callback) => {
    const metrics = [["Generate", globalTiming.end(start)], ...globalTiming.metrics];
    const serverTiming = metrics.map((m) => `-;dur=${m[1]};desc="${encodeURIComponent(m[0])}"`).join(", ");
    if (!res.headersSent) {
      res.setHeader("Server-Timing", serverTiming);
    }
    _end.call(res, data, encoding, callback);
  };
  next();
}

const _assets = {

};

function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

const storage = createStorage({});

const useStorage = () => storage;

storage.mount('/assets', assets$1);

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  async function get(key, resolver) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl;
    const _resolve = async () => {
      if (!pending[key]) {
        entry.value = void 0;
        entry.integrity = void 0;
        entry.mtime = void 0;
        entry.expires = void 0;
        pending[key] = Promise.resolve(resolver());
      }
      entry.value = await pending[key];
      entry.mtime = Date.now();
      entry.integrity = integrity;
      delete pending[key];
      useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return Promise.resolve(entry);
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const key = (opts.getKey || getKey)(...args);
    const entry = await get(key, () => fn(...args));
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length ? hash(args, {}) : "";
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: (event) => {
      const url = event.req.originalUrl || event.req.url;
      const friendlyName = decodeURI(parseURL(url).pathname).replace(/[^a-zA-Z0-9]/g, "").substring(0, 16);
      const urlHash = hash(url);
      return `${friendlyName}.${urlHash}`;
    },
    group: opts.group || "nitro/handlers",
    integrity: [
      opts.integrity,
      handler
    ]
  };
  const _cachedHandler = cachedFunction(async (incomingEvent) => {
    const reqProxy = cloneWithProxy(incomingEvent.req, { headers: {} });
    const resHeaders = {};
    const resProxy = cloneWithProxy(incomingEvent.res, {
      statusCode: 200,
      getHeader(name) {
        return resHeaders[name];
      },
      setHeader(name, value) {
        resHeaders[name] = value;
        return this;
      },
      getHeaderNames() {
        return Object.keys(resHeaders);
      },
      hasHeader(name) {
        return name in resHeaders;
      },
      removeHeader(name) {
        delete resHeaders[name];
      },
      getHeaders() {
        return resHeaders;
      }
    });
    const event = createEvent(reqProxy, resProxy);
    event.context = incomingEvent.context;
    const body = await handler(event);
    const headers = event.res.getHeaders();
    headers.Etag = `W/"${hash(body)}"`;
    headers["Last-Modified"] = new Date().toUTCString();
    const cacheControl = [];
    if (opts.swr) {
      if (opts.maxAge) {
        cacheControl.push(`s-maxage=${opts.maxAge}`);
      }
      if (opts.staleMaxAge) {
        cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
      } else {
        cacheControl.push("stale-while-revalidate");
      }
    } else if (opts.maxAge) {
      cacheControl.push(`max-age=${opts.maxAge}`);
    }
    if (cacheControl.length) {
      headers["Cache-Control"] = cacheControl.join(", ");
    }
    const cacheEntry = {
      code: event.res.statusCode,
      headers,
      body
    };
    return cacheEntry;
  }, _opts);
  return defineEventHandler(async (event) => {
    const response = await _cachedHandler(event);
    if (event.res.headersSent || event.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["Last-Modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.res.statusCode = response.code;
    for (const name in response.headers) {
      event.res.setHeader(name, response.headers[name]);
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const plugins = [
  
];

function hasReqHeader(req, header, includes) {
  const value = req.headers[header];
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event.req, "accept", "application/json") || hasReqHeader(event.req, "user-agent", "curl/") || hasReqHeader(event.req, "user-agent", "httpie/") || event.req.url?.endsWith(".json") || event.req.url?.includes("/api/");
}
function normalizeError(error) {
  const cwd = process.cwd();
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Route Not Found" : "Internal Server Error");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}

const errorHandler = (async function errorhandler(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const errorObject = {
    url: event.req.url,
    statusCode,
    statusMessage,
    message,
    stack: "",
    data: error.data
  };
  event.res.statusCode = errorObject.statusCode;
  event.res.statusMessage = errorObject.statusMessage;
  if (error.unhandled || error.fatal) {
    const tags = [
      "[nuxt]",
      "[request error]",
      error.unhandled && "[unhandled]",
      error.fatal && "[fatal]",
      Number(errorObject.statusCode) !== 200 && `[${errorObject.statusCode}]`
    ].filter(Boolean).join(" ");
    console.error(tags, errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (isJsonRequest(event)) {
    event.res.setHeader("Content-Type", "application/json");
    event.res.end(JSON.stringify(errorObject));
    return;
  }
  const isErrorPage = event.req.url?.startsWith("/__nuxt_error");
  let html = !isErrorPage ? await $fetch(withQuery("/__nuxt_error", errorObject)).catch(() => null) : null;
  if (!html) {
    const { template } = await import('./error-500.mjs');
    html = template(errorObject);
  }
  event.res.setHeader("Content-Type", "text/html;charset=UTF-8");
  event.res.end(html);
});

const assets = {
  "/_nuxt/ComicSansMS3.efc79601.ttf": {
    "type": "font/ttf",
    "etag": "\"1f4f4-tgND5fZ4xW1S6AsA5gQQSnPSVvI\"",
    "mtime": "2022-09-30T09:36:56.017Z",
    "size": 128244,
    "path": "../public/_nuxt/ComicSansMS3.efc79601.ttf"
  },
  "/_nuxt/comments.d6f94bc2.js": {
    "type": "application/javascript",
    "etag": "\"21-9spEOGVcmW89hqFrYBxSkrRDzAU\"",
    "mtime": "2022-09-30T09:36:56.017Z",
    "size": 33,
    "path": "../public/_nuxt/comments.d6f94bc2.js"
  },
  "/_nuxt/entry.0f6c4074.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2f65-jIzeuUVzQIIGepaUm/E6s//cjOc\"",
    "mtime": "2022-09-30T09:36:56.020Z",
    "size": 12133,
    "path": "../public/_nuxt/entry.0f6c4074.css"
  },
  "/_nuxt/entry.99a6b556.js": {
    "type": "application/javascript",
    "etag": "\"12b8f7-mgj4fhvxHqVhn/UwxyHOiRrCmiY\"",
    "mtime": "2022-09-30T09:36:56.019Z",
    "size": 1226999,
    "path": "../public/_nuxt/entry.99a6b556.js"
  },
  "/_nuxt/error-404.18ced855.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-F8gJ3uSz6Dg2HRyb374Ax3RegKE\"",
    "mtime": "2022-09-30T09:36:56.020Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.18ced855.css"
  },
  "/_nuxt/error-404.b3715902.js": {
    "type": "application/javascript",
    "etag": "\"8a8-niVWbQ5PfSHvNroOFXV4tzm9PwQ\"",
    "mtime": "2022-09-30T09:36:56.018Z",
    "size": 2216,
    "path": "../public/_nuxt/error-404.b3715902.js"
  },
  "/_nuxt/error-500.28c4bdc3.js": {
    "type": "application/javascript",
    "etag": "\"756-DAjF6VPkhUywO/GIX2xzJXlDQu8\"",
    "mtime": "2022-09-30T09:36:56.019Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.28c4bdc3.js"
  },
  "/_nuxt/error-500.e60962de.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-VhleGjkSRH7z4cQDJV3dxcboMhU\"",
    "mtime": "2022-09-30T09:36:56.020Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.e60962de.css"
  },
  "/_nuxt/error-component.fb52343a.js": {
    "type": "application/javascript",
    "etag": "\"465-XHThrN0mvwtjcG0/t+p6FdxHAEY\"",
    "mtime": "2022-09-30T09:36:56.017Z",
    "size": 1125,
    "path": "../public/_nuxt/error-component.fb52343a.js"
  },
  "/_nuxt/gear.348edaab.svg": {
    "type": "image/svg+xml",
    "etag": "\"4ff-xhztFMfhNO/uWS7yn+6YlEhIHMU\"",
    "mtime": "2022-09-30T09:36:56.017Z",
    "size": 1279,
    "path": "../public/_nuxt/gear.348edaab.svg"
  },
  "/_nuxt/hand.3fb762c2.svg": {
    "type": "image/svg+xml",
    "etag": "\"b6f-BNsKhsFXu5dlcIbvNZz0AJ4thNw\"",
    "mtime": "2022-09-30T09:36:56.017Z",
    "size": 2927,
    "path": "../public/_nuxt/hand.3fb762c2.svg"
  },
  "/_nuxt/index.12939da6.js": {
    "type": "application/javascript",
    "etag": "\"64c-5B/sCcrnEk9f7r1D9gR13thh1u0\"",
    "mtime": "2022-09-30T09:36:56.018Z",
    "size": 1612,
    "path": "../public/_nuxt/index.12939da6.js"
  },
  "/_nuxt/index.387d8afe.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"215-HIm8X7jUygNDkGQvy83cOMP7y8Q\"",
    "mtime": "2022-09-30T09:36:56.020Z",
    "size": 533,
    "path": "../public/_nuxt/index.387d8afe.css"
  },
  "/_nuxt/index.3d5c5b8a.js": {
    "type": "application/javascript",
    "etag": "\"21-9spEOGVcmW89hqFrYBxSkrRDzAU\"",
    "mtime": "2022-09-30T09:36:56.018Z",
    "size": 33,
    "path": "../public/_nuxt/index.3d5c5b8a.js"
  },
  "/_nuxt/index.9bc31f1d.js": {
    "type": "application/javascript",
    "etag": "\"21-9spEOGVcmW89hqFrYBxSkrRDzAU\"",
    "mtime": "2022-09-30T09:36:56.017Z",
    "size": 33,
    "path": "../public/_nuxt/index.9bc31f1d.js"
  },
  "/_nuxt/info.0d0fb35b.png": {
    "type": "image/png",
    "etag": "\"1dfc-cvS/BH+dMigRvmytIiuBdNdDP7o\"",
    "mtime": "2022-09-30T09:36:56.017Z",
    "size": 7676,
    "path": "../public/_nuxt/info.0d0fb35b.png"
  },
  "/_nuxt/info.c87d06f9.svg": {
    "type": "image/svg+xml",
    "etag": "\"504-Y9zGVCxntPnUiQN73gmqFf9iWbQ\"",
    "mtime": "2022-09-30T09:36:56.017Z",
    "size": 1284,
    "path": "../public/_nuxt/info.c87d06f9.svg"
  },
  "/_nuxt/JutsuNav.d08e3751.js": {
    "type": "application/javascript",
    "etag": "\"654-9tBHlHfJfmOBhOD/AzhSSzP/AsQ\"",
    "mtime": "2022-09-30T09:36:56.018Z",
    "size": 1620,
    "path": "../public/_nuxt/JutsuNav.d08e3751.js"
  },
  "/_nuxt/katana.a0cdf7f4.svg": {
    "type": "image/svg+xml",
    "etag": "\"e22-wiWUJ1XtVVEZG0e/63yrgmrwn68\"",
    "mtime": "2022-09-30T09:36:56.017Z",
    "size": 3618,
    "path": "../public/_nuxt/katana.a0cdf7f4.svg"
  },
  "/_nuxt/list.8a3d3e57.js": {
    "type": "application/javascript",
    "etag": "\"1812-5W/yLl7JXr8tCCvlMtaN+nnPHCk\"",
    "mtime": "2022-09-30T09:36:56.018Z",
    "size": 6162,
    "path": "../public/_nuxt/list.8a3d3e57.js"
  },
  "/_nuxt/list.8b118098.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5c-/r6XOaS5qvb0BAT2ZXMvMtoP1q4\"",
    "mtime": "2022-09-30T09:36:56.020Z",
    "size": 92,
    "path": "../public/_nuxt/list.8b118098.css"
  },
  "/_nuxt/moderatorIcon.efc3f23e.svg": {
    "type": "image/svg+xml",
    "etag": "\"14d6-hmCAFA70BtNPiRqLRSVcfNgEoPg\"",
    "mtime": "2022-09-30T09:36:56.014Z",
    "size": 5334,
    "path": "../public/_nuxt/moderatorIcon.efc3f23e.svg"
  },
  "/_nuxt/nagayama_kai08.36fa2bab.otf": {
    "type": "font/otf",
    "etag": "\"edae9c-mtflj85Ff9fD2E6UlNkxVIOrPEI\"",
    "mtime": "2022-09-30T09:36:56.026Z",
    "size": 15576732,
    "path": "../public/_nuxt/nagayama_kai08.36fa2bab.otf"
  },
  "/_nuxt/ninjacouncilIcon.2d5dc875.svg": {
    "type": "image/svg+xml",
    "etag": "\"7f4-Q5WX4tPDpSvufXF8M1lUfz+HQ1k\"",
    "mtime": "2022-09-30T09:36:56.017Z",
    "size": 2036,
    "path": "../public/_nuxt/ninjacouncilIcon.2d5dc875.svg"
  },
  "/_nuxt/shield.920e9373.svg": {
    "type": "image/svg+xml",
    "etag": "\"65c-uC2/cvyVas/ABcQRw8+kYJtlqok\"",
    "mtime": "2022-09-30T09:36:56.017Z",
    "size": 1628,
    "path": "../public/_nuxt/shield.920e9373.svg"
  },
  "/_nuxt/styles.6498745d.js": {
    "type": "application/javascript",
    "etag": "\"1f0-/odM5u2cCUwVAWZIa2rfjiPaQxk\"",
    "mtime": "2022-09-30T09:36:56.018Z",
    "size": 496,
    "path": "../public/_nuxt/styles.6498745d.js"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = [];

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base of publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = ["HEAD", "GET"];
const EncodingMap = { gzip: ".gz", br: ".br" };
const _f4b49z = eventHandler(async (event) => {
  if (event.req.method && !METHODS.includes(event.req.method)) {
    return;
  }
  let id = decodeURIComponent(withLeadingSlash(withoutTrailingSlash(parseURL(event.req.url).pathname)));
  let asset;
  const encodingHeader = String(event.req.headers["accept-encoding"] || "");
  const encodings = encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort().concat([""]);
  if (encodings.length > 1) {
    event.res.setHeader("Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    event.res.statusCode = 304;
    event.res.end("Not Modified (etag)");
    return;
  }
  const ifModifiedSinceH = event.req.headers["if-modified-since"];
  if (ifModifiedSinceH && asset.mtime) {
    if (new Date(ifModifiedSinceH) >= new Date(asset.mtime)) {
      event.res.statusCode = 304;
      event.res.end("Not Modified (mtime)");
      return;
    }
  }
  if (asset.type) {
    event.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag) {
    event.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime) {
    event.res.setHeader("Last-Modified", asset.mtime);
  }
  if (asset.encoding) {
    event.res.setHeader("Content-Encoding", asset.encoding);
  }
  if (asset.size) {
    event.res.setHeader("Content-Length", asset.size);
  }
  const contents = await readAsset(id);
  event.res.end(contents);
});

const _lazy_SnNvFV = () => import('./renderer.mjs');

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_SnNvFV, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_SnNvFV, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(false),
    onError: errorHandler
  });
  h3App.use(config.app.baseURL, timingMiddleware);
  const router = createRouter();
  const routerOptions = createRouter$1({ routes: config.nitro.routes });
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    const referenceRoute = h.route.replace(/:\w+|\*\*/g, "_");
    const routeOptions = routerOptions.lookup(referenceRoute) || {};
    if (routeOptions.swr) {
      handler = cachedEventHandler(handler, {
        group: "nitro/routes"
      });
    }
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(/\/+/g, "/");
      h3App.use(middlewareBase, handler);
    } else {
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router);
  const localCall = createCall(h3App.nodeHandler);
  const localFetch = createFetch(localCall, globalThis.fetch);
  const $fetch = createFetch$1({ fetch: localFetch, Headers, defaults: { baseURL: config.app.baseURL } });
  globalThis.$fetch = $fetch;
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch
  };
  for (const plugin of plugins) {
    plugin(app);
  }
  return app;
}
const nitroApp = createNitroApp();
const useNitroApp = () => nitroApp;

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, nitroApp.h3App.nodeHandler) : new Server$1(nitroApp.h3App.nodeHandler);
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const s = server.listen(port, host, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const i = s.address();
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${i.family === "IPv6" ? `[${i.address}]` : i.address}:${i.port}${baseURL}`;
  console.log(`Listening ${url}`);
});
{
  process.on("unhandledRejection", (err) => console.error("[nitro] [dev] [unhandledRejection] " + err));
  process.on("uncaughtException", (err) => console.error("[nitro] [dev] [uncaughtException] " + err));
}
const nodeServer = {};

export { useRuntimeConfig as a, nodeServer as n, useNitroApp as u };
//# sourceMappingURL=node-server.mjs.map