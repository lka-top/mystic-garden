import process from 'node:process';globalThis._importMeta_={url:import.meta.url,env:process.env};import { tmpdir } from 'node:os';
import { defineEventHandler, handleCacheHeaders, splitCookiesString, createEvent, fetchWithEvent, isEvent, eventHandler, setHeaders, createError, sendRedirect, proxyRequest, getRequestHeader, setResponseHeaders, setResponseStatus, send, getRequestHeaders, setResponseHeader, appendResponseHeader, getRequestURL, getResponseHeader, removeResponseHeader, getRequestPath, getRequestIP, getQuery as getQuery$1, getRequestWebStream, createApp, createRouter as createRouter$1, toNodeListener, lazyEventHandler, getResponseStatus, getRouterParam, readBody, getValidatedQuery, readMultipartFormData, setHeader, getResponseStatusText } from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/h3@1.15.11/node_modules/h3/dist/index.mjs';
import { Server } from 'node:http';
import path, { resolve, join, dirname } from 'node:path';
import crypto$1 from 'node:crypto';
import { parentPort, threadId } from 'node:worker_threads';
import { escapeHtml } from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/@vue+shared@3.5.41/node_modules/@vue/shared/dist/shared.cjs.js';
import viteNodeEntry_mjs from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/@nuxt+vite-builder@3.21.11_@types+node@20.19.43_eslint@10.8.1_jiti@2.7.0_supports-color_09af58484549cdb6394cae282d7292c1/node_modules/@nuxt/vite-builder/dist/vite-node-entry.mjs';
import { viteNodeFetch } from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/@nuxt+vite-builder@3.21.11_@types+node@20.19.43_eslint@10.8.1_jiti@2.7.0_supports-color_09af58484549cdb6394cae282d7292c1/node_modules/@nuxt/vite-builder/dist/vite-node.mjs';
import { z } from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/zod@3.23.8/node_modules/zod/lib/index.mjs';
import bcrypt from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/bcryptjs@2.4.3/node_modules/bcryptjs/index.js';
import jwt from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/jsonwebtoken@9.0.3/node_modules/jsonwebtoken/index.js';
import fs, { mkdir, writeFile, rename, unlink, readFile } from 'node:fs/promises';
import { promises, existsSync, readFileSync } from 'node:fs';
import { PrismaClient } from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/@prisma+client@5.20.0_prisma@5.20.0/node_modules/@prisma/client/default.js';
import { createRenderer, getRequestDependencies, getPreloadLinks, getPrefetchLinks } from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/vue-bundle-renderer@2.3.2/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, withTrailingSlash, decodePath, withLeadingSlash, withoutTrailingSlash, encodePath, joinRelativeURL } from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/ufo@1.6.4/node_modules/ufo/dist/index.mjs';
import destr, { destr as destr$1 } from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/destr@2.0.5/node_modules/destr/dist/index.mjs';
import { renderToString } from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/vue@3.5.41_typescript@5.6.3/node_modules/vue/server-renderer/index.mjs';
import { createHooks } from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/hookable@5.5.3/node_modules/hookable/dist/index.mjs';
import { createFetch, Headers as Headers$1 } from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/ofetch@1.5.1/node_modules/ofetch/dist/node.mjs';
import { fetchNodeRequestHandler, callNodeRequestHandler } from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/node-mock-http@1.0.5/node_modules/node-mock-http/dist/index.mjs';
import { createStorage, prefixStorage } from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/unstorage@1.17.5_db0@0.3.4_ioredis@5.11.1_supports-color@10.0.0_/node_modules/unstorage/dist/index.mjs';
import unstorage_47drivers_47fs from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/unstorage@1.17.5_db0@0.3.4_ioredis@5.11.1_supports-color@10.0.0_/node_modules/unstorage/drivers/fs.mjs';
import fsDriver from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/unstorage@1.17.5_db0@0.3.4_ioredis@5.11.1_supports-color@10.0.0_/node_modules/unstorage/drivers/fs-lite.mjs';
import lruCache from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/unstorage@1.17.5_db0@0.3.4_ioredis@5.11.1_supports-color@10.0.0_/node_modules/unstorage/drivers/lru-cache.mjs';
import { digest, hash as hash$1 } from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/ohash@2.0.12/node_modules/ohash/dist/index.mjs';
import { klona } from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/klona@2.0.6/node_modules/klona/dist/index.mjs';
import { snakeCase } from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/scule@1.3.0/node_modules/scule/dist/index.mjs';
import { getContext } from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/unctx@2.5.0/node_modules/unctx/dist/index.mjs';
import { toRouteMatcher, createRouter } from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/radix3@1.1.2/node_modules/radix3/dist/index.mjs';
import consola, { consola as consola$1 } from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/consola@3.4.2/node_modules/consola/dist/index.mjs';
import { ErrorParser } from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/youch-core@0.3.3/node_modules/youch-core/build/index.js';
import { Youch } from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/youch@4.1.1/node_modules/youch/build/index.js';
import { SourceMapConsumer } from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/source-map@0.7.6/node_modules/source-map/source-map.js';
import { AsyncLocalStorage } from 'node:async_hooks';
import { stringify, uneval } from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/devalue@5.9.0/node_modules/devalue/index.js';
import { captureRawStackTrace, parseRawStackTrace } from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/errx@0.1.2/node_modules/errx/dist/index.mjs';
import { isVNode, isRef, toValue } from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/vue@3.5.41_typescript@5.6.3/node_modules/vue/index.mjs';
import _wH6JrtIxmaSoA8lCPWFnE9z4lQeXW6H5z3l5aymEQw from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/@nuxt+vite-builder@3.21.11_@types+node@20.19.43_eslint@10.8.1_jiti@2.7.0_supports-color_09af58484549cdb6394cae282d7292c1/node_modules/@nuxt/vite-builder/dist/fix-stacktrace.mjs';
import { fileURLToPath } from 'node:url';
import { dirname as dirname$1, resolve as resolve$1 } from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/pathe@2.0.3/node_modules/pathe/dist/index.mjs';
import { createHead as createHead$1, propsToString, renderSSRHead } from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/unhead@2.1.17/node_modules/unhead/dist/server.mjs';
import { walkResolver } from 'file:///home/li/workspace/mystic-garden/node_modules/.pnpm/unhead@2.1.17/node_modules/unhead/dist/utils.mjs';

const serverAssets = [{"baseName":"server","dir":"/home/li/workspace/mystic-garden/server/assets"}];

const assets$1 = createStorage();

for (const asset of serverAssets) {
  assets$1.mount(asset.baseName, unstorage_47drivers_47fs({ base: asset.dir, ignore: (asset?.ignore || []) }));
}

// @ts-check


/**
 * @param {string} item
 */
function normalizeFsKey (item) {
  const safe = item.replace(/[^\w.-]/g, '_');
  const prefix = safe.slice(0, 20);
  const hash = crypto$1.createHash('sha256').update(item).digest('hex');
  return `${prefix}-${hash}`
}

/**
 * Write `value` to `path` atomically so a concurrent reader never observes a
 * truncated file: the payload is written to a unique sibling and renamed over
 * the destination, which is a single filesystem operation.
 * @param {string} path
 * @param {string} value
 */
async function atomicWrite (path, value) {
  await mkdir(dirname(path), { recursive: true });
  const tmp = `${path}.${crypto$1.randomBytes(8).toString('hex')}.tmp`;
  try {
    await writeFile(tmp, value, 'utf8');
    await rename(tmp, path);
  } catch (error) {
    await unlink(tmp).catch(() => {});
    throw error
  }
}

/**
 * @param {{ base?: string }} opts
 * @returns {import('unstorage').Driver} An unstorage driver that uses both LRU cache and file system, with LRU as the primary and file system as the fallback.
 */
function cacheDriver (opts) {
  const fs = fsDriver({ base: opts.base });
  const lru = lruCache({ max: 1000 });
  const base = resolve(opts.base || '.');

  return {
    ...fs, // fall back to file system - only the bottom three methods are used in renderer
    async setItem (key, value, opts) {
      await atomicWrite(join(base, normalizeFsKey(key)), value);
      await lru.setItem?.(key, value, opts);
    },
    async hasItem (key, opts) {
      return await lru.hasItem(key, opts) || await fs.hasItem(normalizeFsKey(key), opts)
    },
    async getItem (key, opts) {
      return await lru.getItem(key, opts) || await fs.getItem(normalizeFsKey(key), opts)
    },
  }
}

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('root', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"/home/li/workspace/mystic-garden","watchOptions":{"ignored":[null]}}));
storage.mount('src', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"/home/li/workspace/mystic-garden/server","watchOptions":{"ignored":[null]}}));
storage.mount('cache:nuxt:payload', cacheDriver({"base":"/home/li/workspace/mystic-garden/.nuxt/cache/nuxt/payload"}));
storage.mount('build', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"/home/li/workspace/mystic-garden/.nuxt"}));
storage.mount('cache', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"/home/li/workspace/mystic-garden/.nuxt/cache"}));
storage.mount('data', unstorage_47drivers_47fs({"driver":"fs","base":"/home/li/workspace/mystic-garden/.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
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
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
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
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
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

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = { ...defaults };
  for (const key of Object.keys(baseObject)) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

const inlineAppConfig = {
  "nuxt": {}
};



const appConfig = defuFn(inlineAppConfig);

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "dev",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/api/v1/notes/sync": {
        "cache": false
      },
      "/api/v1/notes/sync/assets": {
        "cache": false
      },
      "/api/v1/uploads/sign": {
        "cache": false
      },
      "/api/v1/stats/**": {
        "swr": 60,
        "cache": {
          "maxAge": 60,
          "swr": true
        }
      },
      "/api/v1/categories/**": {
        "swr": 120,
        "cache": {
          "maxAge": 120,
          "swr": true
        }
      },
      "/api/v1/notebooks/**": {
        "cache": false
      },
      "/api/v1/tags/**": {
        "swr": 120,
        "cache": {
          "maxAge": 120,
          "swr": true
        }
      },
      "/api/v1/articles/**": {
        "swr": 30,
        "cache": {
          "maxAge": 30,
          "swr": true
        }
      },
      "/api/v1/notes/**": {
        "cache": false
      },
      "/api/v1/essays/**": {
        "swr": 30,
        "cache": {
          "maxAge": 30,
          "swr": true
        }
      },
      "/admin/**": {
        "ssr": false
      }
    }
  },
  "public": {
    "siteName": "神秘花园",
    "siteDescription": "记录思考、探索技术、沉淀生活的一方数字花园",
    "siteUrl": "http://localhost:3000",
    "icpNumber": "蜀ICP备2026049694号",
    "authorName": "lka",
    "authorBio": "全栈开发者 / 探索 Web 现代美学与工程架构",
    "authorAvatar": "/images/avatar.webp",
    "motion": {}
  },
  "jwtSecret": "local-test-jwt-secret-key-32-characters-long-minimum",
  "databaseUrl": "mysql://luokai:LuokaiSecurePass2025!@localhost:3306/luokai_blog",
  "noteSyncToken": "d20c4b8c4c871ddfb0b44a7d94b1edfd554a4f4a7ce523d4949de58b0ef8edd7"
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

getContext("nitro-app", {
  asyncContext: false,
  AsyncLocalStorage: void 0
});

function isPathInScope(pathname, base) {
  let canonical;
  try {
    const pre = pathname.replace(/%2f/gi, "/").replace(/%5c/gi, "\\");
    canonical = new URL(pre, "http://_").pathname;
  } catch {
    return false;
  }
  return !base || canonical === base || canonical.startsWith(base + "/");
}

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function isJsonRequest(event) {
	
	if (hasReqHeader(event, "accept", "text/html")) {
		return false;
	}
	return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
	const value = getRequestHeader(event, name);
	return !!(value && typeof value === "string" && value.toLowerCase().includes(includes));
}

const iframeStorageBridge = (nonce) => `
(function () {
  const NONCE = ${JSON.stringify(nonce)};
  const memoryStore = Object.create(null);

  const post = (type, payload) => {
    window.parent.postMessage({ type, nonce: NONCE, ...payload }, '*');
  };

  const isValid = (data) => data && data.nonce === NONCE;

  const mockStorage = {
    getItem(key) {
      return Object.hasOwn(memoryStore, key)
        ? memoryStore[key]
        : null;
    },
    setItem(key, value) {
      const v = String(value);
      memoryStore[key] = v;
      post('storage-set', { key, value: v });
    },
    removeItem(key) {
      delete memoryStore[key];
      post('storage-remove', { key });
    },
    clear() {
      for (const key of Object.keys(memoryStore))
        delete memoryStore[key];
      post('storage-clear', {});
    },
    key(index) {
      const keys = Object.keys(memoryStore);
      return keys[index] ?? null;
    },
    get length() {
      return Object.keys(memoryStore).length;
    }
  };

  const defineLocalStorage = () => {
    try {
      Object.defineProperty(window, 'localStorage', {
        value: mockStorage,
        writable: false,
        configurable: true
      });
    } catch {
      window.localStorage = mockStorage;
    }
  };

  defineLocalStorage();

  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!isValid(data) || data.type !== 'storage-sync-data') return;

    const incoming = data.data || {};
    for (const key of Object.keys(incoming))
      memoryStore[key] = incoming[key];

    if (typeof window.initTheme === 'function')
      window.initTheme();
    window.dispatchEvent(new Event('storage-ready'));
  });

  // Clipboard API is unavailable in data: URL iframe, so we use postMessage
  document.addEventListener('DOMContentLoaded', function() {
    window.copyErrorMessage = function(button) {
      post('clipboard-copy', { text: button.dataset.errorText });
      button.classList.add('copied');
      setTimeout(function() { button.classList.remove('copied'); }, 2000);
    };
  });

  post('storage-sync-request', {});
})();
`;
const parentStorageBridge = (nonce) => `
(function () {
  const host = document.querySelector('nuxt-error-overlay');
  if (!host) return;

  const NONCE = ${JSON.stringify(nonce)};
  const isValid = (data) => data && data.nonce === NONCE;

  // Handle clipboard copy from iframe
  window.addEventListener('message', function(e) {
    if (isValid(e.data) && e.data.type === 'clipboard-copy') {
      navigator.clipboard.writeText(e.data.text).catch(function() {});
    }
  });

  const collectLocalStorage = () => {
    const all = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k != null) all[k] = localStorage.getItem(k);
    }
    return all;
  };

  const attachWhenReady = () => {
    const root = host.shadowRoot;
    if (!root)
      return false;
    const iframe = root.getElementById('frame');
    if (!iframe || !iframe.contentWindow)
      return false;

    const handlers = {
      'storage-set': (d) => localStorage.setItem(d.key, d.value),
      'storage-remove': (d) => localStorage.removeItem(d.key),
      'storage-clear': () => localStorage.clear(),
      'storage-sync-request': () => {
        iframe.contentWindow.postMessage({
          type: 'storage-sync-data',
          data: collectLocalStorage(),
          nonce: NONCE
        }, '*');
      }
    };

    window.addEventListener('message', (event) => {
      const data = event.data;
      if (!isValid(data)) return;
      const fn = handlers[data.type];
      if (fn) fn(data);
    });

    return true;
  };

  if (attachWhenReady())
    return;

  const obs = new MutationObserver(() => {
    if (attachWhenReady())
      obs.disconnect();
  });

  obs.observe(host, { childList: true, subtree: true });
})();
`;
const errorCSS = `
:host {
  --preview-width: 240px;
  --preview-height: 180px;
  --base-width: 1200px;
  --base-height: 900px;
  --z-base: 999999998;
  --error-pip-left: auto;
  --error-pip-top: auto;
  --error-pip-right: 5px;
  --error-pip-bottom: 5px;
  --error-pip-origin: bottom right;
  --app-preview-left: auto;
  --app-preview-top: auto;
  --app-preview-right: 5px;
  --app-preview-bottom: 5px;
  all: initial;
  display: contents;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
#frame {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  border: none;
  z-index: var(--z-base);
}
#frame[inert] {
  left: var(--error-pip-left);
  top: var(--error-pip-top);
  right: var(--error-pip-right);
  bottom: var(--error-pip-bottom);
  width: var(--base-width);
  height: var(--base-height);
  transform: scale(calc(240 / 1200));
  transform-origin: var(--error-pip-origin);
  overflow: hidden;
  border-radius: calc(1200 * 8px / 240);
}
#preview {
  position: fixed;
  left: var(--app-preview-left);
  top: var(--app-preview-top);
  right: var(--app-preview-right);
  bottom: var(--app-preview-bottom);
  width: var(--preview-width);
  height: var(--preview-height);
  overflow: hidden;
  border-radius: 6px;
  pointer-events: none;
  z-index: var(--z-base);
  background: white;
  display: none;
}
#preview iframe {
  transform-origin: var(--error-pip-origin);
}
#frame:not([inert]) + #preview {
  display: block;
}
#toggle {
  position: fixed;
  left: var(--app-preview-left);
  top: var(--app-preview-top);
  right: calc(var(--app-preview-right) - 3px);
  bottom: calc(var(--app-preview-bottom) - 3px);
  width: var(--preview-width);
  height: var(--preview-height);
  background: none;
  border: 3px solid #00DC82;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s, box-shadow 0.2s;
  z-index: calc(var(--z-base) + 1);
  display: flex;
  align-items: center;
  justify-content: center;
}
#toggle:hover,
#toggle:focus {
  opacity: 1;
  box-shadow: 0 0 20px rgba(0, 220, 130, 0.6);
}
#toggle:focus-visible {
  outline: 3px solid #00DC82;
  outline-offset: 0;
  box-shadow: 0 0 24px rgba(0, 220, 130, 0.8);
}
#frame[inert] ~ #toggle {
  left: var(--error-pip-left);
  top: var(--error-pip-top);
  right: calc(var(--error-pip-right) - 3px);
  bottom: calc(var(--error-pip-bottom) - 3px);
  cursor: grab;
}
:host(.dragging) #frame[inert] ~ #toggle {
  cursor: grabbing;
}
#frame:not([inert]) ~ #toggle,
#frame:not([inert]) + #preview {
  cursor: grab;
}
:host(.dragging-preview) #frame:not([inert]) ~ #toggle,
:host(.dragging-preview) #frame:not([inert]) + #preview {
  cursor: grabbing;
}

#pip-close {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 16px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  pointer-events: auto;
}
#pip-close:focus-visible {
  outline: 2px solid #00DC82;
  outline-offset: 2px;
}

#pip-restore {
  position: fixed;
  right: 16px;
  bottom: 16px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 2px solid #00DC82;
  background: #111;
  color: #fff;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  z-index: calc(var(--z-base) + 2);
  cursor: grab;
}
#pip-restore:focus-visible {
  outline: 2px solid #00DC82;
  outline-offset: 2px;
}
:host(.dragging-restore) #pip-restore {
  cursor: grabbing;
}

#frame[hidden],
#toggle[hidden],
#preview[hidden],
#pip-restore[hidden],
#pip-close[hidden] {
  display: none !important;
}

@media (prefers-reduced-motion: reduce) {
  #toggle {
    transition: none;
  }
}
`;
function webComponentScript(base64HTML, startMinimized) {
	return `
(function () {
  try {
    // =========================
    // Host + Shadow
    // =========================
    const host = document.querySelector('nuxt-error-overlay');
    if (!host)
      return;
    const shadow = host.attachShadow({ mode: 'open' });

    // =========================
    // DOM helpers
    // =========================
    const el = (tag) => document.createElement(tag);
    const on = (node, type, fn, opts) => node.addEventListener(type, fn, opts);
    const hide = (node, v) => node.toggleAttribute('hidden', !!v);
    const setVar = (name, value) => host.style.setProperty(name, value);
    const unsetVar = (name) => host.style.removeProperty(name);

    // =========================
    // Create DOM
    // =========================
    const style = el('style');
    style.textContent = ${JSON.stringify(errorCSS)};

    const iframe = el('iframe');
    iframe.id = 'frame';
    iframe.src = 'data:text/html;base64,${base64HTML}';
    iframe.title = 'Detailed error stack trace';
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-top-navigation-by-user-activation');

    const preview = el('div');
    preview.id = 'preview';

    const toggle = el('div');
    toggle.id = 'toggle';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('tabindex', '0');
    toggle.innerHTML = '<span class="sr-only">Toggle detailed error view</span>';

    const liveRegion = el('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.className = 'sr-only';

    const pipCloseButton = el('button');
    pipCloseButton.id = 'pip-close';
    pipCloseButton.setAttribute('type', 'button');
    pipCloseButton.setAttribute('aria-label', 'Hide error preview overlay');
    pipCloseButton.innerHTML = '&times;';
    pipCloseButton.hidden = true;
    toggle.appendChild(pipCloseButton);

    const pipRestoreButton = el('button');
    pipRestoreButton.id = 'pip-restore';
    pipRestoreButton.setAttribute('type', 'button');
    pipRestoreButton.setAttribute('aria-label', 'Show error overlay');
    pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error overlay</span>';
    pipRestoreButton.hidden = true;

    // Order matters: #frame + #preview adjacency
    shadow.appendChild(style);
    shadow.appendChild(liveRegion);
    shadow.appendChild(iframe);
    shadow.appendChild(preview);
    shadow.appendChild(toggle);
    shadow.appendChild(pipRestoreButton);

    // =========================
    // Constants / keys
    // =========================
    const POS_KEYS = {
      position: 'nuxt-error-overlay:position',
      hiddenPretty: 'nuxt-error-overlay:error-pip:hidden',
      hiddenPreview: 'nuxt-error-overlay:app-preview:hidden'
    };

    const CSS_VARS = {
      pip: {
        left: '--error-pip-left',
        top: '--error-pip-top',
        right: '--error-pip-right',
        bottom: '--error-pip-bottom'
      },
      preview: {
        left: '--app-preview-left',
        top: '--app-preview-top',
        right: '--app-preview-right',
        bottom: '--app-preview-bottom'
      }
    };

    const MIN_GAP = 5;
    const DRAG_THRESHOLD = 2;

    // =========================
    // Local storage safe access + state
    // =========================
    let storageReady = true;
    let isPrettyHidden = false;
    let isPreviewHidden = false;

    const safeGet = (k) => {
      try {
        return localStorage.getItem(k);
      } catch {
        return null;
      }
    };

    const safeSet = (k, v) => {
      if (!storageReady) 
        return;
      try {
        localStorage.setItem(k, v);
      } catch {}
    };

    // =========================
    // Sizing helpers
    // =========================
    const vvSize = () => {
      const v = window.visualViewport;
      return v ? { w: v.width, h: v.height } : { w: window.innerWidth, h: window.innerHeight };
    };

    const previewSize = () => {
      const styles = getComputedStyle(host);
      const w = parseFloat(styles.getPropertyValue('--preview-width')) || 240;
      const h = parseFloat(styles.getPropertyValue('--preview-height')) || 180;
      return { w, h };
    };

    const sizeForTarget = (target) => {
      if (!target)
        return previewSize();
      const rect = target.getBoundingClientRect();
      if (rect.width && rect.height)
        return { w: rect.width, h: rect.height };
      return previewSize();
    };

    // =========================
    // Dock model + offset/alignment calculations
    // =========================
    const dock = { edge: null, offset: null, align: null, gap: null };

    const maxOffsetFor = (edge, size) => {
      const vv = vvSize();
      if (edge === 'left' || edge === 'right')
        return Math.max(MIN_GAP, vv.h - size.h - MIN_GAP);
      return Math.max(MIN_GAP, vv.w - size.w - MIN_GAP);
    };

    const clampOffset = (edge, value, size) => {
      const max = maxOffsetFor(edge, size);
      return Math.min(Math.max(value, MIN_GAP), max);
    };

    const updateDockAlignment = (size) => {
      if (!dock.edge || dock.offset == null)
        return;
      const max = maxOffsetFor(dock.edge, size);
      if (dock.offset <= max / 2) {
        dock.align = 'start';
        dock.gap = dock.offset;
      } else {
        dock.align = 'end';
        dock.gap = Math.max(0, max - dock.offset);
      }
    };

    const appliedOffsetFor = (size) => {
      if (!dock.edge || dock.offset == null)
        return null;
      const max = maxOffsetFor(dock.edge, size);

      if (dock.align === 'end' && typeof dock.gap === 'number') {
        return clampOffset(dock.edge, max - dock.gap, size);
      }
      if (dock.align === 'start' && typeof dock.gap === 'number') {
        return clampOffset(dock.edge, dock.gap, size);
      }
      return clampOffset(dock.edge, dock.offset, size);
    };

    const nearestEdgeAt = (x, y) => {
      const { w, h } = vvSize();
      const d = { left: x, right: w - x, top: y, bottom: h - y };
      return Object.keys(d).reduce((a, b) => (d[a] < d[b] ? a : b));
    };

    const cornerDefaultDock = () => {
      const vv = vvSize();
      const size = previewSize();
      const offset = Math.max(MIN_GAP, vv.w - size.w - MIN_GAP);
      return { edge: 'bottom', offset };
    };

    const currentTransformOrigin = () => {
      if (!dock.edge) return null;
      if (dock.edge === 'left' || dock.edge === 'top')
        return 'top left';
      if (dock.edge === 'right')
        return 'top right';
      return 'bottom left';
    };

    // =========================
    // Persist / load dock
    // =========================
    const loadDock = () => {
      const raw = safeGet(POS_KEYS.position);
      if (!raw)
        return;
      try {
        const parsed = JSON.parse(raw);
        const { edge, offset, align, gap } = parsed || {};
        if (!['left', 'right', 'top', 'bottom'].includes(edge))
          return;
        if (typeof offset !== 'number')
          return;

        dock.edge = edge;
        dock.offset = clampOffset(edge, offset, previewSize());
        dock.align = align === 'start' || align === 'end' ? align : null;
        dock.gap = typeof gap === 'number' ? gap : null;

        if (!dock.align || dock.gap == null)
          updateDockAlignment(previewSize());
      } catch {}
    };

    const persistDock = () => {
      if (!dock.edge || dock.offset == null)
        return; 
      safeSet(POS_KEYS.position, JSON.stringify({
        edge: dock.edge,
        offset: dock.offset,
        align: dock.align,
        gap: dock.gap
      }));
    };

    // =========================
    // Apply dock
    // =========================
    const dockToVars = (vars) => ({
      set: (side, v) => host.style.setProperty(vars[side], v),
      clear: (side) => host.style.removeProperty(vars[side])
    });

    const dockToEl = (node) => ({
      set: (side, v) => { node.style[side] = v; },
      clear: (side) => { node.style[side] = ''; }
    });

    const applyDock = (target, size, opts) => {
      if (!dock.edge || dock.offset == null) {
        target.clear('left');
        target.clear('top');
        target.clear('right');
        target.clear('bottom');
        return;
      }

      target.set('left', 'auto');
      target.set('top', 'auto');
      target.set('right', 'auto');
      target.set('bottom', 'auto');

      const applied = appliedOffsetFor(size);

      if (dock.edge === 'left') {
        target.set('left', MIN_GAP + 'px');
        target.set('top', applied + 'px');
      } else if (dock.edge === 'right') {
        target.set('right', MIN_GAP + 'px');
        target.set('top', applied + 'px');
      } else if (dock.edge === 'top') {
        target.set('top', MIN_GAP + 'px');
        target.set('left', applied + 'px');
      } else {
        target.set('bottom', MIN_GAP + 'px');
        target.set('left', applied + 'px');
      }

      if (!opts || opts.persist !== false)
        persistDock();
    };

    const applyDockAll = (opts) => {
      applyDock(dockToVars(CSS_VARS.pip), previewSize(), opts);
      applyDock(dockToVars(CSS_VARS.preview), previewSize(), opts);
      applyDock(dockToEl(pipRestoreButton), sizeForTarget(pipRestoreButton), opts);
    };

    const repaintToDock = () => {
      if (!dock.edge || dock.offset == null)
        return;
      const origin = currentTransformOrigin();
      if (origin)
        setVar('--error-pip-origin', origin);
      else 
        unsetVar('--error-pip-origin');
      applyDockAll({ persist: false });
    };

    // =========================
    // Hidden state + UI
    // =========================
    const loadHidden = () => {
      const rawPretty = safeGet(POS_KEYS.hiddenPretty);
      if (rawPretty != null)
        isPrettyHidden = rawPretty === '1' || rawPretty === 'true';
      const rawPreview = safeGet(POS_KEYS.hiddenPreview);
      if (rawPreview != null)
        isPreviewHidden = rawPreview === '1' || rawPreview === 'true';
    };

    const setPrettyHidden = (v) => {
      isPrettyHidden = !!v;
      safeSet(POS_KEYS.hiddenPretty, isPrettyHidden ? '1' : '0');
      updateUI();
    };

    const setPreviewHidden = (v) => {
      isPreviewHidden = !!v;
      safeSet(POS_KEYS.hiddenPreview, isPreviewHidden ? '1' : '0');
      updateUI();
    };

    const isMinimized = () => iframe.hasAttribute('inert');

    const setMinimized = (v) => {
      if (v) {
        iframe.setAttribute('inert', '');
        toggle.setAttribute('aria-expanded', 'false');
      } else {
        iframe.removeAttribute('inert');
        toggle.setAttribute('aria-expanded', 'true');
      }
    };

    const setRestoreLabel = (kind) => {
      if (kind === 'pretty') {
        pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error overlay</span>';
        pipRestoreButton.setAttribute('aria-label', 'Show error overlay');
      } else {
        pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error page</span>';
        pipRestoreButton.setAttribute('aria-label', 'Show error page');
      }
    };

    const updateUI = () => {
      const minimized = isMinimized();
      const showPiP = minimized && !isPrettyHidden;
      const showPreview = !minimized && !isPreviewHidden;
      const pipHiddenByUser = minimized && isPrettyHidden;
      const previewHiddenByUser = !minimized && isPreviewHidden;
      const showToggle = minimized ? showPiP : showPreview;
      const showRestore = pipHiddenByUser || previewHiddenByUser;

      hide(iframe, pipHiddenByUser);
      hide(preview, !showPreview);
      hide(toggle, !showToggle);
      hide(pipCloseButton, !showToggle);
      hide(pipRestoreButton, !showRestore);

      pipCloseButton.setAttribute('aria-label', minimized ? 'Hide error overlay' : 'Hide error page preview');

      if (pipHiddenByUser)
        setRestoreLabel('pretty');
      else if (previewHiddenByUser)
        setRestoreLabel('preview');

      host.classList.toggle('pip-hidden', isPrettyHidden);
      host.classList.toggle('preview-hidden', isPreviewHidden);
    };

    // =========================
    // Preview snapshot
    // =========================
    const updatePreview = () => {
      try {
        let previewIframe = preview.querySelector('iframe');
        if (!previewIframe) {
          previewIframe = el('iframe');
          previewIframe.style.cssText = 'width: 1200px; height: 900px; transform: scale(0.2); transform-origin: top left; border: none;';
          previewIframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
          preview.appendChild(previewIframe);
        }

        const doctype = document.doctype ? '<!DOCTYPE ' + document.doctype.name + '>' : '';
        const cleanedHTML = document.documentElement.outerHTML
          .replace(/<nuxt-error-overlay[^>]*>.*?<\\/nuxt-error-overlay>/gs, '')
          .replace(/<script[^>]*>.*?<\\/script>/gs, '');

        const iframeDoc = previewIframe.contentDocument || previewIframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(doctype + cleanedHTML);
        iframeDoc.close();
      } catch (err) {
        console.error('Failed to update preview:', err);
      }
    };

    // =========================
    // View toggling
    // =========================
    const toggleView = () => {
      if (isMinimized()) {
        updatePreview();
        setMinimized(false);
        liveRegion.textContent = 'Showing detailed error view';
        setTimeout(() => { 
          try { 
            iframe.contentWindow.focus();
          } catch {}
        }, 100);
      } else {
        setMinimized(true);
        liveRegion.textContent = 'Showing error page';
        repaintToDock();
        void iframe.offsetWidth;
      }
      updateUI();
    };

    // =========================
    // Dragging (unified, rAF throttled)
    // =========================
    let drag = null;
    let rafId = null;
    let suppressToggleClick = false;
    let suppressRestoreClick = false;

    const beginDrag = (e) => {
      if (drag) 
        return;

      if (!dock.edge || dock.offset == null) {
        const def = cornerDefaultDock();
        dock.edge = def.edge;
        dock.offset = def.offset;
        updateDockAlignment(previewSize());
      }

      const isRestoreTarget = e.currentTarget === pipRestoreButton;

      drag = {
        kind: isRestoreTarget ? 'restore' : (isMinimized() ? 'pip' : 'preview'),
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastY: e.clientY,
        moved: false,
        target: e.currentTarget
      };

      drag.target.setPointerCapture(e.pointerId);

      if (drag.kind === 'restore')
        host.classList.add('dragging-restore');
      else 
        host.classList.add(drag.kind === 'pip' ? 'dragging' : 'dragging-preview');

      e.preventDefault();
    };

    const moveDrag = (e) => {
      if (!drag || drag.pointerId !== e.pointerId)
        return;

      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      
      const dx = drag.lastX - drag.startX;
      const dy = drag.lastY - drag.startY;

      if (!drag.moved && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
        drag.moved = true;
      }

      if (!drag.moved)
        return;
      if (rafId)
        return;

      rafId = requestAnimationFrame(() => {
        rafId = null;

        const edge = nearestEdgeAt(drag.lastX, drag.lastY);
        const size = sizeForTarget(drag.target);

        let offset;
        if (edge === 'left' || edge === 'right') {
          const top = drag.lastY - (size.h / 2);
          offset = clampOffset(edge, Math.round(top), size);
        } else {
          const left = drag.lastX - (size.w / 2);
          offset = clampOffset(edge, Math.round(left), size);
        }

        dock.edge = edge;
        dock.offset = offset;
        updateDockAlignment(size);

        const origin = currentTransformOrigin();
        setVar('--error-pip-origin', origin || 'bottom right');

        applyDockAll({ persist: false });
      });
    };

    const endDrag = (e) => {
      if (!drag || drag.pointerId !== e.pointerId)
        return;

      const endedKind = drag.kind;
      drag.target.releasePointerCapture(e.pointerId);

      if (endedKind === 'restore')
        host.classList.remove('dragging-restore');
      else 
        host.classList.remove(endedKind === 'pip' ? 'dragging' : 'dragging-preview');

      const didMove = drag.moved;
      drag = null;

      if (didMove) {
        persistDock();
        if (endedKind === 'restore')
          suppressRestoreClick = true;
        else 
          suppressToggleClick = true;
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const bindDragTarget = (node) => {
      on(node, 'pointerdown', beginDrag);
      on(node, 'pointermove', moveDrag);
      on(node, 'pointerup', endDrag);
      on(node, 'pointercancel', endDrag);
    };

    bindDragTarget(toggle);
    bindDragTarget(pipRestoreButton);

    // =========================
    // Events (toggle / close / restore)
    // =========================
    on(toggle, 'click', (e) => {
      if (suppressToggleClick) {
        e.preventDefault();
        suppressToggleClick = false;
        return;
      }
      toggleView();
    });

    on(toggle, 'keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleView();
      }
    });

    on(pipCloseButton, 'click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isMinimized())
        setPrettyHidden(true);
      else
        setPreviewHidden(true);
    });

    on(pipCloseButton, 'pointerdown', (e) => {
      e.stopPropagation();
    });

    on(pipRestoreButton, 'click', (e) => {
      if (suppressRestoreClick) {
        e.preventDefault();
        suppressRestoreClick = false;
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      if (isMinimized()) 
        setPrettyHidden(false);
      else 
        setPreviewHidden(false);
    });

    // =========================
    // Lifecycle: load / sync / repaint
    // =========================
    const loadState = () => {
      loadDock();
      loadHidden();

      if (isPrettyHidden && !isMinimized())
        setMinimized(true);

      updateUI();
      repaintToDock();
    };

    loadState();

    on(window, 'storage-ready', () => {
      storageReady = true;
      loadState();
    });

    const onViewportChange = () => repaintToDock();

    on(window, 'resize', onViewportChange);

    if (window.visualViewport) {
      on(window.visualViewport, 'resize', onViewportChange);
      on(window.visualViewport, 'scroll', onViewportChange);
    }

    // initial preview
    setTimeout(updatePreview, 100);

    // initial minimized option
    if (${startMinimized}) {
      setMinimized(true);
      repaintToDock();
      void iframe.offsetWidth;
      updateUI();
    }
  } catch (err) {
    console.error('Failed to initialize Nuxt error overlay:', err);
  }
})();
`;
}
function generateErrorOverlayHTML(html, options) {
	const nonce = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
	const errorPage = html.replace("<head>", `<head><script>${iframeStorageBridge(nonce)}<\/script>`);
	const base64HTML = Buffer.from(errorPage, "utf8").toString("base64");
	return `
    <script>${parentStorageBridge(nonce)}<\/script>
    <nuxt-error-overlay></nuxt-error-overlay>
    <script>${webComponentScript(base64HTML, options?.startMinimized ?? false)}<\/script>
  `;
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
	if (event.handled || isJsonRequest(event)) {
		
		return;
	}
	
	const defaultRes = await defaultHandler(error, event, { json: true });
	
	const status = error.status || error.statusCode || 500;
	if (status === 404 && defaultRes.status === 302) {
		setResponseHeaders(event, defaultRes.headers);
		setResponseStatus(event, defaultRes.status, defaultRes.statusText);
		return send(event, JSON.stringify(defaultRes.body, null, 2));
	}
	if (typeof defaultRes.body !== "string" && Array.isArray(defaultRes.body.stack)) {
		
		defaultRes.body.stack = defaultRes.body.stack.join("\n");
	}
	const errorObject = defaultRes.body;
	
	const url = new URL(errorObject.url);
	errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
	
	errorObject.message = error.unhandled ? errorObject.message || "Server Error" : error.message || errorObject.message || "Server Error";
	
	errorObject.data ||= error.data;
	errorObject.statusText ||= error.statusText || error.statusMessage;
	delete defaultRes.headers["content-type"];
	delete defaultRes.headers["content-security-policy"];
	setResponseHeaders(event, defaultRes.headers);
	
	const reqHeaders = getRequestHeaders(event);
	
	const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"] || !!event.context.nuxt?.["~rendering-error"];
	if (!isRenderingError) {
		event.context.nuxt ||= {};
		event.context.nuxt["~rendering-error"] = true;
	}
	
	const res = isRenderingError ? null : await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject), {
		headers: {
			...reqHeaders,
			"x-nuxt-error": "true"
		},
		redirect: "manual"
	}).catch(() => null);
	if (event.handled) {
		return;
	}
	
	if (!res) {
		const { template } = await Promise.resolve().then(function () { return error500; });
		{
			
			errorObject.description = errorObject.message;
		}
		setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
		return send(event, template(errorObject));
	}
	const html = await res.text();
	for (const [header, value] of res.headers.entries()) {
		if (header === "set-cookie") {
			appendResponseHeader(event, header, value);
			continue;
		}
		setResponseHeader(event, header, value);
	}
	setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
	if (!globalThis._importMeta_.test && typeof html === "string") {
		const prettyResponse = await defaultHandler(error, event, { json: false });
		if (typeof prettyResponse.body === "string") {
			return send(event, html.replace("</body>", `${generateErrorOverlayHTML(prettyResponse.body, { startMinimized: 300 <= status && status < 500 })}</body>`));
		}
	}
	return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  async function defaultNitroErrorHandler(error, event) {
    const res = await defaultHandler(error, event);
    if (!event.node?.res.headersSent) {
      setResponseHeaders(event, res.headers);
    }
    setResponseStatus(event, res.status, res.statusText);
    return send(
      event,
      typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2)
    );
  }
);
async function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  await loadStackTrace(error).catch(consola.error);
  const youch = new Youch();
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    const ansiError = await (await youch.toANSI(error)).replaceAll(process.cwd(), ".");
    consola.error(
      `[request error] ${tags} [${event.method}] ${url}

`,
      ansiError
    );
  }
  const useJSON = opts?.json ?? !getRequestHeader(event, "accept")?.includes("text/html");
  const headers = {
    "content-type": useJSON ? "application/json" : "text/html",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';"
  };
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = useJSON ? {
    error: true,
    url,
    statusCode,
    statusMessage,
    message: error.message,
    data: error.data,
    stack: error.stack?.split("\n").map((line) => line.trim())
  } : await youch.toHTML(error, {
    request: {
      url: url.href,
      method: event.method,
      headers: getRequestHeaders(event)
    }
  });
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}
async function loadStackTrace(error) {
  if (!(error instanceof Error)) {
    return;
  }
  const parsed = await new ErrorParser().defineSourceLoader(sourceLoader).parse(error);
  const stack = error.message + "\n" + parsed.frames.map((frame) => fmtFrame(frame)).join("\n");
  Object.defineProperty(error, "stack", { value: stack });
  if (error.cause) {
    await loadStackTrace(error.cause).catch(consola.error);
  }
}
async function sourceLoader(frame) {
  if (!frame.fileName || frame.fileType !== "fs" || frame.type === "native") {
    return;
  }
  if (frame.type === "app") {
    const rawSourceMap = await readFile(`${frame.fileName}.map`, "utf8").catch(() => {
    });
    if (rawSourceMap) {
      const consumer = await new SourceMapConsumer(rawSourceMap);
      const originalPosition = consumer.originalPositionFor({ line: frame.lineNumber, column: frame.columnNumber });
      if (originalPosition.source && originalPosition.line) {
        frame.fileName = resolve(dirname(frame.fileName), originalPosition.source);
        frame.lineNumber = originalPosition.line;
        frame.columnNumber = originalPosition.column || 0;
      }
    }
  }
  const contents = await readFile(frame.fileName, "utf8").catch(() => {
  });
  return contents ? { contents } : void 0;
}
function fmtFrame(frame) {
  if (frame.type === "native") {
    return frame.raw;
  }
  const src = `${frame.fileName || ""}:${frame.lineNumber}:${frame.columnNumber})`;
  return frame.functionName ? `at ${frame.functionName} (${src}` : `at ${src}`;
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const script$1 = `
if (!window.__NUXT_DEVTOOLS_TIME_METRIC__) {
  Object.defineProperty(window, '__NUXT_DEVTOOLS_TIME_METRIC__', {
    value: {},
    enumerable: false,
    configurable: true,
  })
}
window.__NUXT_DEVTOOLS_TIME_METRIC__.appInit = Date.now()
`;

const _7UqLHikChXtBZDVkMTq5aLO6FfeRVWcpdNheIC9H_g = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script$1}<\/script>`);
  });
});

const rootDir = "/home/li/workspace/mystic-garden";

const appHead = {"meta":[{"charset":"utf-8"},{"name":"viewport","content":"width=device-width, initial-scale=1"},{"name":"description","content":"神秘花园 - 记录思考、探索技术、沉淀生活的一方数字花园"},{"name":"keywords","content":"lka, 博客, Nuxt3, Vue3, 前端开发, 全栈开发, 技术随笔, Bento Grid"}],"link":[{"rel":"icon","type":"image/png","href":"/favicon.png"},{"rel":"alternate","type":"application/rss+xml","title":"神秘花园 RSS Feed","href":"/feed.xml"},{"rel":"sitemap","type":"application/xml","title":"Sitemap","href":"/sitemap.xml"}],"style":[],"script":[],"noscript":[],"title":"神秘花园 - 记录思考与沉淀生活","titleTemplate":"%s | 神秘花园"};

const appRootTag = "div";

const appRootAttrs = {"id":"__nuxt"};

const appTeleportTag = "div";

const appTeleportAttrs = {"id":"teleports"};

const appSpaLoaderTag = "div";

const appSpaLoaderAttrs = {"id":"__nuxt-loader"};

const appId = "nuxt-app";

const devReducers = {
	VNode: (data) => isVNode(data) ? {
		type: data.type,
		props: data.props
	} : undefined,
	URL: (data) => data instanceof URL ? data.toString() : undefined,
	Symbol: (data) => typeof data === "symbol" ? data.description ?? "" : undefined
};
const asyncContext = getContext("nuxt-dev", {
	asyncContext: true,
	AsyncLocalStorage
});
const _pr41LPnenUDvvDWCBbWVU4eyJfjZlKmp_O0tVcLrEQ = (nitroApp) => {
	const handler = nitroApp.h3App.handler;
	nitroApp.h3App.handler = (event) => {
		return asyncContext.callAsync({
			logs: [],
			event
		}, () => handler(event));
	};
	onConsoleLog((_log) => {
		const ctx = asyncContext.tryUse();
		if (!ctx) {
			return;
		}
		const rawStack = captureRawStackTrace();
		if (!rawStack || rawStack.includes("runtime/vite-node.mjs")) {
			return;
		}
		const trace = [];
		let filename = "";
		for (const entry of parseRawStackTrace(rawStack)) {
			if (entry.source === globalThis._importMeta_.url) {
				continue;
			}
			if (EXCLUDE_TRACE_RE.test(entry.source)) {
				continue;
			}
			filename ||= entry.source.replace(withTrailingSlash(rootDir), "");
			trace.push({
				...entry,
				source: entry.source.startsWith("file://") ? entry.source.replace("file://", "") : entry.source
			});
		}
		const log = {
			..._log,
			
			filename,
			
			stack: trace
		};
		
		ctx.logs.push(log);
	});
	nitroApp.hooks.hook("afterResponse", () => {
		const ctx = asyncContext.tryUse();
		if (!ctx) {
			return;
		}
		return nitroApp.hooks.callHook("dev:ssr-logs", {
			logs: ctx.logs,
			path: ctx.event.path
		});
	});
	
	nitroApp.hooks.hook("render:html", (htmlContext) => {
		const ctx = asyncContext.tryUse();
		if (!ctx) {
			return;
		}
		try {
			const reducers = Object.assign(Object.create(null), devReducers, ctx.event.context["~payloadReducers"]);
			htmlContext.bodyAppend.unshift(`<script type="application/json" data-nuxt-logs="${appId}">${stringify(ctx.logs, reducers)}<\/script>`);
		} catch (e) {
			const shortError = e instanceof Error && "toString" in e ? ` Received \`${e.toString()}\`.` : "";
			console.warn(`[nuxt] Failed to stringify dev server logs.${shortError} You can define your own reducer/reviver for rich types following the instructions in https://nuxt.com/docs/api/composables/use-nuxt-app#payload.`);
		}
	});
};
const EXCLUDE_TRACE_RE = /\/node_modules\/(?:.*\/)?(?:nuxt|nuxt-nightly|nuxt-edge|nuxt3|consola|@vue)\/|core\/runtime\/nitro/;
function onConsoleLog(callback) {
	consola$1.addReporter({ log(logObj) {
		callback(logObj);
	} });
	consola$1.wrapConsole();
}

const script = "\"use strict\";(()=>{const t=window,e=document.documentElement,c=[\"dark\",\"light\"],n=getStorageValue(\"localStorage\",\"nuxt-color-mode\")||\"system\";let i=n===\"system\"?u():n;const r=e.getAttribute(\"data-color-mode-forced\");r&&(i=r),l(i),t[\"__NUXT_COLOR_MODE__\"]={preference:n,value:i,getColorScheme:u,addColorScheme:l,removeColorScheme:d};function l(o){const s=\"\"+o+\"\",a=\"\";e.classList?e.classList.add(s):e.className+=\" \"+s,a&&e.setAttribute(\"data-\"+a,o)}function d(o){const s=\"\"+o+\"\",a=\"\";e.classList?e.classList.remove(s):e.className=e.className.replace(new RegExp(s,\"g\"),\"\"),a&&e.removeAttribute(\"data-\"+a)}function f(o){return t.matchMedia(\"(prefers-color-scheme\"+o+\")\")}function u(){if(t.matchMedia&&f(\"\").media!==\"not all\"){for(const o of c)if(f(\":\"+o).matches)return o}return\"light\"}})();function getStorageValue(t,e){switch(t){case\"localStorage\":return window.localStorage.getItem(e);case\"sessionStorage\":return window.sessionStorage.getItem(e);case\"cookie\":return getCookie(e);default:return null}}function getCookie(t){const c=(\"; \"+window.document.cookie).split(\"; \"+t+\"=\");if(c.length===2)return c.pop()?.split(\";\").shift()}";

const _9euYX9qGLvFSlyJRbgjnibvJL7nfe1K9sx3qitO0wM = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

function defineNitroPlugin(def) {
  return def;
}

function findPrismaError(err) {
  let cur = err;
  for (let i = 0; cur && i < 5; i++) {
    const e = cur;
    if (e.code && /^P\d{4}$/.test(e.code)) return e;
    cur = e.cause;
  }
  return null;
}
const _9X2BmiJtvzb1i8ibx0Hns_RzOUkZ2wi6MHqIpxLHRQ = defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("error", (error, ctx) => {
    const event = ctx == null ? void 0 : ctx.event;
    if (!event) return;
    const httpError = error;
    const prismaError = findPrismaError(error);
    if (prismaError) {
      if (prismaError.code === "P2002") {
        httpError.statusCode = 409;
        httpError.statusMessage = "\u8D44\u6E90\u5DF2\u5B58\u5728\uFF1A\u552F\u4E00\u5B57\u6BB5\u51B2\u7A81\uFF0C\u8BF7\u66F4\u6362\u540E\u91CD\u8BD5";
      } else if (prismaError.code === "P2025") {
        httpError.statusCode = 404;
        httpError.statusMessage = "\u8D44\u6E90\u4E0D\u5B58\u5728\u6216\u5DF2\u88AB\u5220\u9664";
      } else if (!httpError.statusCode || httpError.statusCode >= 500) {
        httpError.statusCode = 500;
        httpError.statusMessage = "\u6570\u636E\u5E93\u64CD\u4F5C\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5";
      }
    }
    {
      console.error(`[server:error] ${event.path} \u2192`, (prismaError == null ? void 0 : prismaError.code) || httpError.statusMessage || error.message);
    }
  });
});

const plugins = [
  _7UqLHikChXtBZDVkMTq5aLO6FfeRVWcpdNheIC9H_g,
_pr41LPnenUDvvDWCBbWVU4eyJfjZlKmp_O0tVcLrEQ,
_9euYX9qGLvFSlyJRbgjnibvJL7nfe1K9sx3qitO0wM,
_9X2BmiJtvzb1i8ibx0Hns_RzOUkZ2wi6MHqIpxLHRQ,
_wH6JrtIxmaSoA8lCPWFnE9z4lQeXW6H5z3l5aymEQw
];

const assets = {};

function readAsset (id) {
  const serverDir = dirname$1(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve$1(serverDir, assets[id].path))
}

const publicAssetBases = {};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const __Z3Hb5 = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
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
      removeResponseHeader(event, "Cache-Control");
      throw createError({ statusCode: 404 });
    }
    return;
  }
  if (asset.encoding !== void 0) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

const rules = [
  { path: "/api/v1/auth/login", method: "POST", limit: 5, windowMs: 60 * 1e3 },
  { path: "/api/v1/auth/register", method: "POST", limit: 3, windowMs: 60 * 1e3 },
  { path: "/api/v1/comments", method: "POST", limit: 10, windowMs: 60 * 1e3 },
  { path: "/api/v1/upload", method: "POST", limit: 15, windowMs: 60 * 1e3 },
  { path: "/api/v1/uploads/sign", method: "POST", limit: 30, windowMs: 60 * 1e3 }
];
const ipRecords = /* @__PURE__ */ new Map();
const CLEANUP_INTERVAL = 5 * 60 * 1e3;
let lastCleanup = Date.now();
function cleanupExpiredRecords(now) {
  const maxWindow = 60 * 1e3;
  for (const [key, record] of ipRecords.entries()) {
    record.timestamps = record.timestamps.filter((ts) => now - ts < maxWindow);
    if (record.timestamps.length === 0) {
      ipRecords.delete(key);
    }
  }
  lastCleanup = now;
}
const _m4HU5G = defineEventHandler((event) => {
  const path = getRequestPath(event);
  const method = event.method;
  const matchedRule = rules.find(
    (r) => r.method === method && (path === r.path || path.startsWith(`${r.path}/`))
  );
  if (!matchedRule) return;
  const now = Date.now();
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    cleanupExpiredRecords(now);
  }
  const clientIp = getRequestIP(event, { xForwardedFor: true }) || "127.0.0.1";
  const key = `${matchedRule.method}:${matchedRule.path}:${clientIp}`;
  let record = ipRecords.get(key);
  if (!record) {
    record = { timestamps: [] };
    ipRecords.set(key, record);
  }
  record.timestamps = record.timestamps.filter((ts) => now - ts < matchedRule.windowMs);
  if (record.timestamps.length >= matchedRule.limit) {
    const earliestTime = record.timestamps[0] || now;
    const resetSeconds = Math.ceil((matchedRule.windowMs - (now - earliestTime)) / 1e3);
    setResponseHeader(event, "Retry-After", resetSeconds);
    throw createError({
      statusCode: 429,
      statusMessage: `\u8BF7\u6C42\u8FC7\u4E8E\u9891\u7E41\uFF0C\u8BF7\u5728 ${resetSeconds} \u79D2\u540E\u518D\u8BD5`
    });
  }
  record.timestamps.push(now);
});

const VueResolver = (_, value) => {
  return isRef(value) ? toValue(value) : value;
};

const headSymbol = "usehead";
// @__NO_SIDE_EFFECTS__
function vueInstall(head) {
  const plugin = {
    install(app) {
      app.config.globalProperties.$unhead = head;
      app.config.globalProperties.$head = head;
      app.provide(headSymbol, head);
    }
  };
  return plugin.install;
}

// @__NO_SIDE_EFFECTS__
function resolveUnrefHeadInput(input) {
  return walkResolver(input, VueResolver);
}

function computeIslandHash(name, serializedProps, context, source) {
  let parsed;
  try {
    parsed = JSON.parse(serializedProps);
  } catch {
    parsed = serializedProps;
  }
  return hash$1([name, parsed, context, source]).replace(/[-_]/g, "");
}

const MAX_ISLAND_BODY_BYTES = 64 * 1024;

const MAX_ISLAND_PROP_DEPTH = 64;

function exceedsMaxDepth(raw, maxDepth = MAX_ISLAND_PROP_DEPTH) {
	let depth = 0;
	let inString = false;
	let escaped = false;
	for (let i = 0; i < raw.length; i++) {
		const ch = raw[i];
		if (inString) {
			if (escaped) {
				escaped = false;
			} else if (ch === "\\") {
				escaped = true;
			} else if (ch === "\"") {
				inString = false;
			}
			continue;
		}
		if (ch === "\"") {
			inString = true;
		} else if (ch === "{" || ch === "[") {
			if (++depth > maxDepth) {
				return true;
			}
		} else if (ch === "}" || ch === "]") {
			if (depth > 0) {
				depth--;
			}
		}
	}
	return false;
}

function exceedsMaxBytes(raw, maxBytes = MAX_ISLAND_BODY_BYTES) {
	return Buffer.byteLength(raw, "utf8") > maxBytes;
}

// @__NO_SIDE_EFFECTS__
function createHead(options = {}) {
  const head = createHead$1({
    ...options,
    propResolvers: [VueResolver]
  });
  head.install = vueInstall(head);
  return head;
}

const unheadOptions = {
  disableDefaults: true,
};

function encodeEventPath(path) {
	const queryIndex = path.indexOf("?");
	if (queryIndex === -1) {
		return encodePath(path);
	}
	return encodePath(path.slice(0, queryIndex)) + path.slice(queryIndex);
}
function createSSRContext(event) {
	const url = encodeEventPath(event.path);
	const ssrContext = {
		url,
		event,
		runtimeConfig: useRuntimeConfig(event),
		noSSR: event.context.nuxt?.noSSR || (false),
		head: createHead(unheadOptions),
		error: false,
		nuxt: undefined,
		payload: {},
		["~payloadReducers"]: Object.create(null),
		modules: new Set()
	};
	return ssrContext;
}
function setSSRError(ssrContext, error) {
	ssrContext.error = true;
	ssrContext.payload = { error };
	ssrContext.url = error.url;
}

function buildAssetsDir() {
	
	return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
	return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
	
	const app = useRuntimeConfig().app;
	const publicBase = app.cdnURL || app.baseURL;
	return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

// @ts-expect-error private property consumed by vite-generated url helpers
globalThis.__buildAssetsURL = buildAssetsURL;
// @ts-expect-error private property consumed by vite-generated url helpers
globalThis.__publicAssetsURL = publicAssetsURL;
const APP_ROOT_OPEN_TAG = `<${appRootTag}${propsToString(appRootAttrs)}>`;
const APP_ROOT_CLOSE_TAG = `</${appRootTag}>`;
// @ts-expect-error file will be produced after app build
const getServerEntry = () => Promise.resolve().then(function () { return server; }).then((r) => r.default || r);
// @ts-expect-error file will be produced after app build
const getClientManifest = () => Promise.resolve().then(function () { return client_manifest$1; }).then((r) => r.default || r).then((r) => typeof r === "function" ? r() : r);

const getSSRRenderer = lazyCachedFunction(async () => {
	
	const createSSRApp = await getServerEntry();
	if (!createSSRApp) {
		throw new Error("Server bundle is not available");
	}
	
	const precomputed = undefined ;
	
	const renderer = createRenderer(createSSRApp, {
		precomputed,
		manifest: await getClientManifest() ,
		renderToString: renderToString$1,
		buildAssetsURL
	});
	async function renderToString$1(input, context) {
		const html = await renderToString(input, context);
		
		
		if (process.env.NUXT_VITE_NODE_OPTIONS) {
			renderer.rendererContext.updateManifest(await getClientManifest());
		}
		return APP_ROOT_OPEN_TAG + html + APP_ROOT_CLOSE_TAG;
	}
	return renderer;
});

const getSPARenderer = lazyCachedFunction(async () => {
	const precomputed = undefined ;
	// @ts-expect-error virtual file
	const spaTemplate = await Promise.resolve().then(function () { return _virtual__spaTemplate; }).then((r) => r.template).catch(() => "").then((r) => {
		{
			const APP_SPA_LOADER_OPEN_TAG = `<${appSpaLoaderTag}${propsToString(appSpaLoaderAttrs)}>`;
			const APP_SPA_LOADER_CLOSE_TAG = `</${appSpaLoaderTag}>`;
			const appTemplate = APP_ROOT_OPEN_TAG + APP_ROOT_CLOSE_TAG;
			const loaderTemplate = r ? APP_SPA_LOADER_OPEN_TAG + r + APP_SPA_LOADER_CLOSE_TAG : "";
			return appTemplate + loaderTemplate;
		}
	});
	
	const renderer = createRenderer(() => () => {}, {
		precomputed,
		manifest: await getClientManifest() ,
		renderToString: () => spaTemplate,
		buildAssetsURL
	});
	const result = await renderer.renderToString({});
	const renderToString = (ssrContext) => {
		const config = useRuntimeConfig(ssrContext.event);
		ssrContext.modules ||= new Set();
		ssrContext.payload.serverRendered = false;
		ssrContext.config = {
			public: config.public,
			app: config.app
		};
		return Promise.resolve(result);
	};
	return {
		rendererContext: renderer.rendererContext,
		renderToString
	};
});
function lazyCachedFunction(fn) {
	let res = null;
	return () => {
		if (res === null) {
			res = fn().catch((err) => {
				res = null;
				throw err;
			});
		}
		return res;
	};
}
function getRenderer(ssrContext) {
	return ssrContext.noSSR ? getSPARenderer() : getSSRRenderer();
}
// @ts-expect-error file will be produced after app build
const getSSRStyles = lazyCachedFunction(() => Promise.resolve().then(function () { return styles$1; }).then((r) => r.default || r));

async function renderInlineStyles(usedModules) {
	const styleMap = await getSSRStyles();
	const inlinedStyles = new Set();
	for (const mod of usedModules) {
		if (mod in styleMap && styleMap[mod]) {
			for (const style of await styleMap[mod]()) {
				inlinedStyles.add(style);
			}
		}
	}
	return Array.from(inlinedStyles).map((style) => ({ innerHTML: style }));
}

// @ts-expect-error virtual file
const ROOT_NODE_REGEX = new RegExp(`^<${appRootTag}[^>]*>([\\s\\S]*)<\\/${appRootTag}>$`);

function getServerComponentHTML(body) {
	const match = body.match(ROOT_NODE_REGEX);
	return match?.[1] || body;
}
const SSR_SLOT_TELEPORT_MARKER = /^uid=([^;]*);slot=(.*)$/;
const SSR_CLIENT_TELEPORT_MARKER = /^uid=([^;]*);client=(.*)$/;
const SSR_CLIENT_SLOT_MARKER = /^island-slot=([^;]*);(.*)$/;
function getSlotIslandResponse(ssrContext) {
	if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.slots).length) {
		return undefined;
	}
	const response = {};
	for (const [name, slot] of Object.entries(ssrContext.islandContext.slots)) {
		response[name] = {
			...slot,
			fallback: ssrContext.teleports?.[`island-fallback=${name}`]
		};
	}
	return response;
}
function getClientIslandResponse(ssrContext) {
	if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.components).length) {
		return undefined;
	}
	const response = {};
	for (const [clientUid, component] of Object.entries(ssrContext.islandContext.components)) {
		
		let html = ssrContext.teleports?.[clientUid]?.replaceAll("<!--teleport start anchor-->", "") || "";
		
		if (!html && ssrContext.teleports) {
			for (const [key, value] of Object.entries(ssrContext.teleports)) {
				const [, , componentUid] = key.match(SSR_CLIENT_TELEPORT_MARKER) ?? [];
				if (componentUid === clientUid) {
					html = value.replaceAll("<!--teleport start anchor-->", "");
					break;
				}
			}
		}
		response[clientUid] = {
			...component,
			html,
			slots: getComponentSlotTeleport(clientUid, ssrContext.teleports ?? {})
		};
	}
	return response;
}
function getComponentSlotTeleport(clientUid, teleports) {
	const entries = Object.entries(teleports);
	const slots = {};
	for (const [key, value] of entries) {
		const match = key.match(SSR_CLIENT_SLOT_MARKER);
		if (match) {
			const [, id, slot] = match;
			if (!slot || clientUid !== id) {
				continue;
			}
			slots[slot] = value;
		}
	}
	return slots;
}
function replaceIslandTeleports(ssrContext, html) {
	const { teleports, islandContext } = ssrContext;
	if (islandContext || !teleports) {
		return html;
	}
	for (const key in teleports) {
		const matchClientComp = key.match(SSR_CLIENT_TELEPORT_MARKER);
		if (matchClientComp) {
			const [, uid, clientId] = matchClientComp;
			if (!uid || !clientId) {
				continue;
			}
			html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-component="${clientId}"[^>]*>`), (full) => {
				return full + teleports[key];
			});
			continue;
		}
		const matchSlot = key.match(SSR_SLOT_TELEPORT_MARKER);
		if (matchSlot) {
			const [, uid, slot] = matchSlot;
			if (!uid || !slot) {
				continue;
			}
			html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-slot="${slot}"[^>]*>`), (full) => {
				return full + teleports[key];
			});
		}
	}
	return html;
}

const ISLAND_SUFFIX_RE = /\.json(?:\?.*)?$/;
const handler$1 = defineEventHandler(async (event) => {
	setResponseHeaders(event, {
		"content-type": "application/json;charset=utf-8",
		"x-powered-by": "Nuxt"
	});
	{
		return toResponse(event, await renderIsland(event));
	}
});
function toResponse(event, result) {
	return "raw" in result ? returnIslandResponse(event, result.raw) : result;
}
async function renderIsland(event) {
	const nitroApp = useNitroApp();
	const islandContext = await getIslandContext(event);
	const ssrContext = {
		...createSSRContext(event),
		islandContext,
		noSSR: false,
		url: islandContext.url
	};
	
	const renderer = await getSSRRenderer();
	const renderResult = await renderer.renderToString(ssrContext).catch(async (err) => {
		if (ssrContext["~renderResponse"] && err?.message === "skipping render") {
			return {};
		}
		await ssrContext.nuxt?.hooks.callHook("app:error", err);
		throw err;
	});
	
	
	await ssrContext.nuxt?.hooks.callHook("app:rendered", {
		ssrContext,
		renderResult
	});
	if (ssrContext["~renderResponse"]) {
		const response = ssrContext["~renderResponse"];
		if (response.statusCode && response.statusCode >= 400) {
			throw createError({
				statusCode: response.statusCode,
				statusMessage: response.statusMessage
			});
		}
		return { raw: response };
	}
	
	if (ssrContext.payload?.error) {
		throw ssrContext.payload.error;
	}
	const inlinedStyles = await renderInlineStyles(ssrContext.modules ?? []);
	if (inlinedStyles.length) {
		ssrContext.head.push({ style: inlinedStyles });
	}
	{
		const { styles } = getRequestDependencies(ssrContext, renderer.rendererContext);
		const link = [];
		for (const resource of Object.values(styles)) {
			
			if ("inline" in getQuery(resource.file)) {
				continue;
			}
			
			
			if (resource.file.includes("scoped") && !resource.file.includes("pages/")) {
				link.push({
					rel: "stylesheet",
					href: renderer.rendererContext.buildAssetsURL(resource.file),
					crossorigin: ""
				});
			}
		}
		if (link.length) {
			ssrContext.head.push({ link }, { mode: "server" });
		}
	}
	const islandHead = {};
	for (const entry of ssrContext.head.entries.values()) {
		
		for (const [key, value] of Object.entries(resolveUnrefHeadInput(entry.input))) {
			const currentValue = islandHead[key];
			if (Array.isArray(currentValue)) {
				currentValue.push(...value);
			} else {
				islandHead[key] = value;
			}
		}
	}
	
	islandHead.link ||= [];
	islandHead.style ||= [];
	const islandResponse = {
		id: islandContext.id,
		head: islandHead,
		html: getServerComponentHTML(renderResult.html),
		components: getClientIslandResponse(ssrContext),
		slots: getSlotIslandResponse(ssrContext)
	};
	await nitroApp.hooks.callHook("render:island", islandResponse, {
		event,
		islandContext
	});
	return islandResponse;
}
function returnIslandResponse(event, response) {
	for (const header in response.headers || {}) {
		setResponseHeader(event, header, response.headers[header]);
	}
	if (response.statusCode) {
		setResponseStatus(event, response.statusCode, response.statusMessage);
	}
	return response.body;
}
const ISLAND_PATH_PREFIX = "/__nuxt_island/";
const VALID_COMPONENT_NAME_RE = /^[a-z][\w.-]*$/i;


async function readGuardedIslandBody(event) {
	const contentLength = Number(getRequestHeader(event, "content-length"));
	if (contentLength > MAX_ISLAND_BODY_BYTES) {
		throw createError({
			statusCode: 413,
			statusMessage: "Island request body too large"
		});
	}
	
	
	let received = 0;
	let raw = "";
	let overflowed = false;
	const stream = getRequestWebStream(event);
	if (stream) {
		const decoder = new TextDecoder();
		const reader = stream.getReader();
		try {
			for (;;) {
				const { done, value } = await reader.read();
				if (done) {
					break;
				}
				received += value.byteLength;
				if (received > MAX_ISLAND_BODY_BYTES) {
					
					
					
					overflowed = true;
					continue;
				}
				raw += decoder.decode(value, { stream: true });
			}
		} finally {
			reader.releaseLock();
		}
		raw += decoder.decode();
	}
	if (overflowed) {
		throw createError({
			statusCode: 413,
			statusMessage: "Island request body too large"
		});
	}
	if (!raw) {
		return {};
	}
	if (exceedsMaxDepth(raw)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Island request body too deeply nested"
		});
	}
	return destr$1(raw) || {};
}
async function getIslandContext(event) {
	let url = event.path || "";
	url.replace(/\?.*$/, "");
	if (!url.startsWith(ISLAND_PATH_PREFIX)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid island request path"
		});
	}
	const componentParts = url.substring(ISLAND_PATH_PREFIX.length).replace(ISLAND_SUFFIX_RE, "").split("_");
	const hashId = componentParts.length > 1 ? componentParts.pop() : undefined;
	const componentName = componentParts.join("_");
	if (!componentName || !VALID_COMPONENT_NAME_RE.test(componentName)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid island component name"
		});
	}
	const rawContext = event.method === "GET" ? getQuery$1(event) : await readGuardedIslandBody(event);
	const serializedProps = typeof rawContext?.props === "string" ? rawContext.props : "{}";
	
	
	if (exceedsMaxBytes(serializedProps)) {
		throw createError({
			statusCode: 413,
			statusMessage: "Island request props too large"
		});
	}
	if (exceedsMaxDepth(serializedProps)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Island request props too deeply nested"
		});
	}
	
	
	const clientContext = {};
	if (rawContext && typeof rawContext === "object") {
		for (const key in rawContext) {
			if (key !== "props") {
				clientContext[key] = rawContext[key];
			}
		}
	}
	const parsed = destr$1(serializedProps);
	if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid island request props"
		});
	}
	const parsedProps = parsed;
	
	
	const expectedHash = computeIslandHash(componentName, serializedProps, clientContext, undefined);
	if (!hashId || hashId !== expectedHash) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid island request hash"
		});
	}
	return {
		url: typeof rawContext?.url === "string" ? rawContext.url : "/",
		id: hashId,
		name: componentName,
		props: parsedProps,
		slots: {},
		components: {}
	};
}

const _lazy_ulq9I7 = () => Promise.resolve().then(function () { return _id__delete$7; });
const _lazy_UVE02J = () => Promise.resolve().then(function () { return _id__put$3; });
const _lazy_y6q03Y = () => Promise.resolve().then(function () { return _slug__get$3; });
const _lazy_l7TeK2 = () => Promise.resolve().then(function () { return index_get$h; });
const _lazy_8JdHNt = () => Promise.resolve().then(function () { return index_post$d; });
const _lazy_rz10A8 = () => Promise.resolve().then(function () { return login_post$1; });
const _lazy_0wH6aZ = () => Promise.resolve().then(function () { return me_get$1; });
const _lazy_NxC1_m = () => Promise.resolve().then(function () { return register_post$1; });
const _lazy_ymoo70 = () => Promise.resolve().then(function () { return index_get$f; });
const _lazy_NZJs_7 = () => Promise.resolve().then(function () { return index_post$b; });
const _lazy_MI_eHy = () => Promise.resolve().then(function () { return _id__delete$5; });
const _lazy_58PaW1 = () => Promise.resolve().then(function () { return approve_patch$1; });
const _lazy_uR5FE5 = () => Promise.resolve().then(function () { return index_get$d; });
const _lazy_ZRhSOQ = () => Promise.resolve().then(function () { return index_post$9; });
const _lazy_ungVKr = () => Promise.resolve().then(function () { return _id__delete$3; });
const _lazy_sl6Vh1 = () => Promise.resolve().then(function () { return like_post$1; });
const _lazy_qoV9wv = () => Promise.resolve().then(function () { return index_get$b; });
const _lazy_2l96so = () => Promise.resolve().then(function () { return index_post$7; });
const _lazy_ScZ8i7 = () => Promise.resolve().then(function () { return index_get$9; });
const _lazy_urt3uK = () => Promise.resolve().then(function () { return index_post$5; });
const _lazy_EAKeX2 = () => Promise.resolve().then(function () { return _id__delete$1; });
const _lazy_mDzCfZ = () => Promise.resolve().then(function () { return _id__put$1; });
const _lazy_OQXtOL = () => Promise.resolve().then(function () { return _slug__get$1; });
const _lazy_CCctbj = () => Promise.resolve().then(function () { return index_get$7; });
const _lazy_Jwom89 = () => Promise.resolve().then(function () { return index_post$3; });
const _lazy_Crs4Ck = () => Promise.resolve().then(function () { return sync_post$1; });
const _lazy_eTfIiT = () => Promise.resolve().then(function () { return assets_post$1; });
const _lazy_IjlDh8 = () => Promise.resolve().then(function () { return index_get$5; });
const _lazy_2WIX57 = () => Promise.resolve().then(function () { return index_get$3; });
const _lazy_xOHEGN = () => Promise.resolve().then(function () { return index_patch$1; });
const _lazy__xLANH = () => Promise.resolve().then(function () { return overview_get$1; });
const _lazy_hEdZXy = () => Promise.resolve().then(function () { return index_get$1; });
const _lazy_YqT9TN = () => Promise.resolve().then(function () { return index_post$1; });
const _lazy_nOVYmY = () => Promise.resolve().then(function () { return upload_post$1; });
const _lazy_tjF0Yp = () => Promise.resolve().then(function () { return sign_post$1; });
const _lazy_qcxNMF = () => Promise.resolve().then(function () { return databaseErDiagram_svg$1; });
const _lazy_CJ3joq = () => Promise.resolve().then(function () { return feed_xml$1; });
const _lazy_u1401U = () => Promise.resolve().then(function () { return sitemap_xml$1; });
const _lazy_kekpKv = () => Promise.resolve().then(function () { return renderer; });

const handlers = [
  { route: '', handler: __Z3Hb5, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _m4HU5G, lazy: false, middleware: true, method: undefined },
  { route: '/api/v1/articles/:id', handler: _lazy_ulq9I7, lazy: true, middleware: false, method: "delete" },
  { route: '/api/v1/articles/:id', handler: _lazy_UVE02J, lazy: true, middleware: false, method: "put" },
  { route: '/api/v1/articles/:slug', handler: _lazy_y6q03Y, lazy: true, middleware: false, method: "get" },
  { route: '/api/v1/articles', handler: _lazy_l7TeK2, lazy: true, middleware: false, method: "get" },
  { route: '/api/v1/articles', handler: _lazy_8JdHNt, lazy: true, middleware: false, method: "post" },
  { route: '/api/v1/auth/login', handler: _lazy_rz10A8, lazy: true, middleware: false, method: "post" },
  { route: '/api/v1/auth/me', handler: _lazy_0wH6aZ, lazy: true, middleware: false, method: "get" },
  { route: '/api/v1/auth/register', handler: _lazy_NxC1_m, lazy: true, middleware: false, method: "post" },
  { route: '/api/v1/categories', handler: _lazy_ymoo70, lazy: true, middleware: false, method: "get" },
  { route: '/api/v1/categories', handler: _lazy_NZJs_7, lazy: true, middleware: false, method: "post" },
  { route: '/api/v1/comments/:id', handler: _lazy_MI_eHy, lazy: true, middleware: false, method: "delete" },
  { route: '/api/v1/comments/:id/approve', handler: _lazy_58PaW1, lazy: true, middleware: false, method: "patch" },
  { route: '/api/v1/comments', handler: _lazy_uR5FE5, lazy: true, middleware: false, method: "get" },
  { route: '/api/v1/comments', handler: _lazy_ZRhSOQ, lazy: true, middleware: false, method: "post" },
  { route: '/api/v1/essays/:id', handler: _lazy_ungVKr, lazy: true, middleware: false, method: "delete" },
  { route: '/api/v1/essays/:id/like', handler: _lazy_sl6Vh1, lazy: true, middleware: false, method: "post" },
  { route: '/api/v1/essays', handler: _lazy_qoV9wv, lazy: true, middleware: false, method: "get" },
  { route: '/api/v1/essays', handler: _lazy_2l96so, lazy: true, middleware: false, method: "post" },
  { route: '/api/v1/notebooks', handler: _lazy_ScZ8i7, lazy: true, middleware: false, method: "get" },
  { route: '/api/v1/notebooks', handler: _lazy_urt3uK, lazy: true, middleware: false, method: "post" },
  { route: '/api/v1/notes/:id', handler: _lazy_EAKeX2, lazy: true, middleware: false, method: "delete" },
  { route: '/api/v1/notes/:id', handler: _lazy_mDzCfZ, lazy: true, middleware: false, method: "put" },
  { route: '/api/v1/notes/:slug', handler: _lazy_OQXtOL, lazy: true, middleware: false, method: "get" },
  { route: '/api/v1/notes', handler: _lazy_CCctbj, lazy: true, middleware: false, method: "get" },
  { route: '/api/v1/notes', handler: _lazy_Jwom89, lazy: true, middleware: false, method: "post" },
  { route: '/api/v1/notes/sync', handler: _lazy_Crs4Ck, lazy: true, middleware: false, method: "post" },
  { route: '/api/v1/notes/sync/assets', handler: _lazy_eTfIiT, lazy: true, middleware: false, method: "post" },
  { route: '/api/v1/search', handler: _lazy_IjlDh8, lazy: true, middleware: false, method: "get" },
  { route: '/api/v1/settings', handler: _lazy_2WIX57, lazy: true, middleware: false, method: "get" },
  { route: '/api/v1/settings', handler: _lazy_xOHEGN, lazy: true, middleware: false, method: "patch" },
  { route: '/api/v1/stats/overview', handler: _lazy__xLANH, lazy: true, middleware: false, method: "get" },
  { route: '/api/v1/tags', handler: _lazy_hEdZXy, lazy: true, middleware: false, method: "get" },
  { route: '/api/v1/tags', handler: _lazy_YqT9TN, lazy: true, middleware: false, method: "post" },
  { route: '/api/v1/upload', handler: _lazy_nOVYmY, lazy: true, middleware: false, method: "post" },
  { route: '/api/v1/uploads/sign', handler: _lazy_tjF0Yp, lazy: true, middleware: false, method: "post" },
  { route: '/database-er-diagram.svg', handler: _lazy_qcxNMF, lazy: true, middleware: false, method: undefined },
  { route: '/feed.xml', handler: _lazy_CJ3joq, lazy: true, middleware: false, method: undefined },
  { route: '/sitemap.xml', handler: _lazy_u1401U, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_kekpKv, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: handler$1, lazy: false, middleware: false, method: undefined },
  { route: '/api/v1/stats/**', handler: _lazy_kekpKv, lazy: true, middleware: false, method: undefined },
  { route: '/api/v1/categories/**', handler: _lazy_kekpKv, lazy: true, middleware: false, method: undefined },
  { route: '/api/v1/tags/**', handler: _lazy_kekpKv, lazy: true, middleware: false, method: undefined },
  { route: '/api/v1/articles/**', handler: _lazy_kekpKv, lazy: true, middleware: false, method: undefined },
  { route: '/api/v1/essays/**', handler: _lazy_kekpKv, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_kekpKv, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(true),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter$1({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => callNodeRequestHandler(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return fetchNodeRequestHandler(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const scheduledTasks = false;

const tasks = {
  
};

const __runningTasks__ = {};
async function runTask(name, {
  payload = {},
  context = {}
} = {}) {
  if (__runningTasks__[name]) {
    return __runningTasks__[name];
  }
  if (!(name in tasks)) {
    throw createError({
      message: `Task \`${name}\` is not available!`,
      statusCode: 404
    });
  }
  if (!tasks[name].resolve) {
    throw createError({
      message: `Task \`${name}\` is not implemented!`,
      statusCode: 501
    });
  }
  const handler = await tasks[name].resolve();
  const taskEvent = { name, payload, context };
  __runningTasks__[name] = handler.run(taskEvent);
  try {
    const res = await __runningTasks__[name];
    return res;
  } finally {
    delete __runningTasks__[name];
  }
}

if (!globalThis.crypto) {
  globalThis.crypto = crypto$1.webcrypto;
}
const { NITRO_NO_UNIX_SOCKET, NITRO_DEV_WORKER_ID } = process.env;
trapUnhandledNodeErrors();
parentPort?.on("message", (msg) => {
  if (msg && msg.event === "shutdown") {
    shutdown();
  }
});
const nitroApp = useNitroApp();
const server$1 = new Server(toNodeListener(nitroApp.h3App));
let listener;
listen().catch(() => listen(
  true
  /* use random port */
)).catch((error) => {
  console.error("Dev worker failed to listen:", error);
  return shutdown();
});
nitroApp.router.get(
  "/_nitro/tasks",
  defineEventHandler(async (event) => {
    const _tasks = await Promise.all(
      Object.entries(tasks).map(async ([name, task]) => {
        const _task = await task.resolve?.();
        return [name, { description: _task?.meta?.description }];
      })
    );
    return {
      tasks: Object.fromEntries(_tasks),
      scheduledTasks
    };
  })
);
nitroApp.router.use(
  "/_nitro/tasks/:name",
  defineEventHandler(async (event) => {
    const name = getRouterParam(event, "name");
    const payload = {
      ...getQuery$1(event),
      ...await readBody(event).then((r) => r?.payload).catch(() => ({}))
    };
    return await runTask(name, { payload });
  })
);
function listen(useRandomPort = Boolean(
  NITRO_NO_UNIX_SOCKET || process.versions.webcontainer || "Bun" in globalThis && process.platform === "win32"
)) {
  return new Promise((resolve, reject) => {
    try {
      listener = server$1.listen(useRandomPort ? 0 : getSocketAddress(), () => {
        const address = server$1.address();
        parentPort?.postMessage({
          event: "listen",
          address: typeof address === "string" ? { socketPath: address } : { host: "localhost", port: address?.port }
        });
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
function getSocketAddress() {
  const socketName = `nitro-worker-${process.pid}-${threadId}-${NITRO_DEV_WORKER_ID}-${Math.round(Math.random() * 1e4)}.sock`;
  if (process.platform === "win32") {
    return join(String.raw`\\.\pipe`, socketName);
  }
  if (process.platform === "linux") {
    const nodeMajor = Number.parseInt(process.versions.node.split(".")[0], 10);
    if (nodeMajor >= 20) {
      return `\0${socketName}`;
    }
  }
  return join(tmpdir(), socketName);
}
async function shutdown() {
  server$1.closeAllConnections?.();
  await Promise.all([
    new Promise((resolve) => listener?.close(resolve)),
    nitroApp.hooks.callHook("close").catch(console.error)
  ]);
  parentPort?.postMessage({ event: "exit" });
}

const _messages = {
	"appName": "Nuxt",
	"version": "",
	"status": 500,
	"statusText": "Server error",
	"description": "This page is temporarily unavailable."
};
const template$1 = (messages) => {
	messages = {
		..._messages,
		...messages
	};
	return "<!DOCTYPE html><html lang=\"en\"><head><title>" + escapeHtml(messages.status) + " - " + escapeHtml(messages.statusText) + " | " + escapeHtml(messages.appName) + "</title><meta charset=\"utf-8\"><meta content=\"width=device-width,initial-scale=1,minimum-scale=1\" name=\"viewport\"><style>.spotlight{background:linear-gradient(45deg,#00dc82,#36e4da 50%,#0047e1);filter:blur(20vh)}*,:after,:before{border-color:var(--un-default-border-color,#e5e7eb);border-style:solid;border-width:0;box-sizing:border-box}:after,:before{--un-content:\"\"}html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-moz-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}body{line-height:inherit;margin:0}h1{font-size:inherit;font-weight:inherit}h1,p{margin:0}*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.fixed{position:fixed}.-bottom-1\\/2{bottom:-50%}.left-0{left:0}.right-0{right:0}.grid{display:grid}.mb-16{margin-bottom:4rem}.mb-8{margin-bottom:2rem}.h-1\\/2{height:50%}.max-w-520px{max-width:520px}.min-h-screen{min-height:100vh}.place-content-center{place-content:center}.overflow-hidden{overflow:hidden}.bg-white{--un-bg-opacity:1;background-color:rgb(255 255 255/var(--un-bg-opacity))}.px-8{padding-left:2rem;padding-right:2rem}.text-center{text-align:center}.text-8xl{font-size:6rem;line-height:1}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-black{--un-text-opacity:1;color:rgb(0 0 0/var(--un-text-opacity))}.font-light{font-weight:300}.font-medium{font-weight:500}.leading-tight{line-height:1.25}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}@media(prefers-color-scheme:dark){.dark\\:bg-black{--un-bg-opacity:1;background-color:rgb(0 0 0/var(--un-bg-opacity))}.dark\\:text-white{--un-text-opacity:1;color:rgb(255 255 255/var(--un-text-opacity))}}@media(min-width:640px){.sm\\:px-0{padding-left:0;padding-right:0}.sm\\:text-4xl{font-size:2.25rem;line-height:2.5rem}}</style><script>!function(){const e=document.createElement(\"link\").relList;if(!(e&&e.supports&&e.supports(\"modulepreload\"))){for(const e of document.querySelectorAll('link[rel=\"modulepreload\"]'))r(e);new MutationObserver(e=>{for(const o of e)if(\"childList\"===o.type)for(const e of o.addedNodes)\"LINK\"===e.tagName&&\"modulepreload\"===e.rel&&r(e)}).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;const r=function(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),\"use-credentials\"===e.crossOrigin?r.credentials=\"include\":\"anonymous\"===e.crossOrigin?r.credentials=\"omit\":r.credentials=\"same-origin\",r}(e);fetch(e.href,r)}}();<\/script></head><body class=\"antialiased bg-white dark:bg-black dark:text-white font-sans grid min-h-screen overflow-hidden place-content-center text-black\"><div class=\"-bottom-1/2 fixed h-1/2 left-0 right-0 spotlight\"></div><div class=\"max-w-520px text-center\"><h1 class=\"font-medium mb-8 sm:text-10xl text-8xl\">" + escapeHtml(messages.status) + "</h1><p class=\"font-light leading-tight mb-16 px-8 sm:px-0 sm:text-4xl text-xl\">" + escapeHtml(messages.description) + "</p></div></body></html>";
};

const error500 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template$1
}, Symbol.toStringTag, { value: 'Module' }));

const server = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: viteNodeEntry_mjs
}, Symbol.toStringTag, { value: 'Module' }));

const client_manifest = () => viteNodeFetch.getManifest();

const client_manifest$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: client_manifest
}, Symbol.toStringTag, { value: 'Module' }));

const template = "";

const _virtual__spaTemplate = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template
}, Symbol.toStringTag, { value: 'Module' }));

const styles = {};

const styles$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: styles
}, Symbol.toStringTag, { value: 'Module' }));

const prisma = globalThis.__prismaClient || new PrismaClient({
  log: ["query", "error", "warn"] 
});
{
  globalThis.__prismaClient = prisma;
}

function getJwtSecret(event) {
  const config = useRuntimeConfig(event);
  const secret = config.jwtSecret;
  if (!secret || secret.length < 16) {
    console.warn("[auth] JWT_SECRET \u672A\u914D\u7F6E\u6216\u8FC7\u5F31\uFF0C\u4EC5\u5141\u8BB8\u5F00\u53D1\u73AF\u5883\u8FD0\u884C");
  }
  return secret;
}
function verifyToken(token, event) {
  try {
    return jwt.verify(token, getJwtSecret(event));
  } catch {
    return null;
  }
}
function requireAdminUser(event) {
  const authHeader = getRequestHeader(event, "authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      statusMessage: "\u672A\u63D0\u4F9B\u8BBF\u95EE\u4EE4\u724C\uFF0C\u8BF7\u5148\u767B\u5F55"
    });
  }
  const decoded = verifyToken(authHeader.substring(7), event);
  if (!decoded) {
    throw createError({
      statusCode: 401,
      statusMessage: "\u4EE4\u724C\u65E0\u6548\u6216\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u91CD\u65B0\u767B\u5F55"
    });
  }
  if (decoded.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "\u6743\u9650\u4E0D\u8DB3\uFF1A\u9700\u8981\u7BA1\u7406\u5458\u6743\u9650"
    });
  }
  return decoded;
}
function tryGetAdminUser(event) {
  try {
    return requireAdminUser(event);
  } catch {
    return null;
  }
}
function tryGetAuthUser(event) {
  const authHeader = getRequestHeader(event, "authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return verifyToken(authHeader.substring(7), event);
}
function signAuthToken(payload, secret, expiresIn = "7d") {
  return jwt.sign(payload, secret, { expiresIn });
}

function successResponse(data, message = "success") {
  return {
    code: 200,
    message,
    data
  };
}
function paginationResponse(list, total, page, pageSize) {
  return {
    code: 200,
    message: "success",
    data: {
      list,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    }
  };
}

async function readValidated(event, schema) {
  var _a;
  const body = await readBody(event);
  const result = schema.safeParse(body);
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: ((_a = result.error.errors[0]) == null ? void 0 : _a.message) || "\u53C2\u6570\u6821\u9A8C\u5931\u8D25"
    });
  }
  return result.data;
}
function parseIdParam(event, name = "id") {
  const id = parseInt(getRouterParam(event, name) || "0");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "\u65E0\u6548\u7684\u8D44\u6E90 ID" });
  }
  return id;
}
function getClientIp(event) {
  return (getRequestHeader(event, "x-forwarded-for") || getRequestHeader(event, "x-real-ip") || "127.0.0.1").toString().split(",")[0].trim();
}
function getClientUa(event) {
  return (getRequestHeader(event, "user-agent") || "").toString().substring(0, 250);
}

const _id__delete$6 = defineEventHandler(async (event) => {
  requireAdminUser(event);
  const id = parseIdParam(event);
  await prisma.article.delete({
    where: { id }
  });
  return successResponse(null, "\u6587\u7AE0\u5DF2\u5220\u9664");
});

const _id__delete$7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$6
}, Symbol.toStringTag, { value: 'Module' }));

const UpdateArticleSchema = z.object({
  slug: z.string().min(2).optional(),
  title: z.string().min(1).optional(),
  summary: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  coverImage: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
  isPinned: z.boolean().optional(),
  readingTime: z.number().int().min(0).optional(),
  categoryId: z.number().int().optional().nullable(),
  tagIds: z.array(z.number().int()).optional()
});
const _id__put$2 = defineEventHandler(async (event) => {
  requireAdminUser(event);
  const id = parseIdParam(event);
  const data = await readValidated(event, UpdateArticleSchema);
  if (data.slug) {
    const existing = await prisma.article.findFirst({
      where: { slug: data.slug, NOT: { id } }
    });
    if (existing) {
      throw createError({ statusCode: 409, statusMessage: "\u8BE5 Slug \u6807\u8BC6\u5DF2\u88AB\u5360\u7528" });
    }
  }
  let estimatedReadingTime = data.readingTime;
  if (data.content && !estimatedReadingTime) {
    estimatedReadingTime = Math.max(1, Math.ceil(data.content.length / 350));
  }
  const updated = await prisma.$transaction(async (tx) => {
    if (data.tagIds !== void 0) {
      await tx.articleTag.deleteMany({ where: { articleId: id } });
      if (data.tagIds.length > 0) {
        await tx.articleTag.createMany({
          data: data.tagIds.map((tagId) => ({ articleId: id, tagId }))
        });
      }
    }
    return tx.article.update({
      where: { id },
      data: {
        ...data.slug && { slug: data.slug },
        ...data.title && { title: data.title },
        ...data.summary && { summary: data.summary },
        ...data.content && { content: data.content },
        ...data.coverImage !== void 0 && { coverImage: data.coverImage },
        ...data.isPublished !== void 0 && { isPublished: data.isPublished },
        ...data.isPinned !== void 0 && { isPinned: data.isPinned },
        ...estimatedReadingTime !== void 0 && { readingTime: estimatedReadingTime },
        ...data.categoryId !== void 0 && { categoryId: data.categoryId }
      },
      include: {
        category: true,
        tags: { include: { tag: true } }
      }
    });
  });
  return successResponse(updated, "\u6587\u7AE0\u66F4\u65B0\u6210\u529F");
});

const _id__put$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__put$2
}, Symbol.toStringTag, { value: 'Module' }));

const _slug__get$2 = defineEventHandler(async (event) => {
  var _a;
  const paramSlug = getRouterParam(event, "slug") || ((_a = event.context.params) == null ? void 0 : _a.slug);
  const pathParts = event.path.split("?")[0].split("/");
  const slug = paramSlug || pathParts[pathParts.length - 1];
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "\u7F3A\u5C11\u6587\u7AE0 Slug" });
  }
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
      author: {
        select: { id: true, nickname: true, avatar: true, bio: true }
      },
      tags: {
        include: { tag: true }
      },
      _count: {
        select: { comments: { where: { isApproved: true } } }
      }
    }
  });
  if (!article) {
    throw createError({ statusCode: 404, statusMessage: "\u6587\u7AE0\u4E0D\u5B58\u5728\u6216\u5DF2\u88AB\u5220\u9664" });
  }
  if (!article.isPublished && !tryGetAdminUser(event)) {
    throw createError({ statusCode: 404, statusMessage: "\u6587\u7AE0\u4E0D\u5B58\u5728\u6216\u5DF2\u88AB\u5220\u9664" });
  }
  prisma.article.update({
    where: { id: article.id },
    data: { views: { increment: 1 } }
  }).catch((err) => console.error("\u9012\u589E\u6D4F\u89C8\u91CF\u5931\u8D25:", err));
  const formattedArticle = {
    ...article,
    tags: article.tags.map((t) => t.tag),
    commentCount: article._count.comments
  };
  return successResponse(formattedArticle);
});

const _slug__get$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _slug__get$2
}, Symbol.toStringTag, { value: 'Module' }));

function isAdminAll(event, all) {
  return !!tryGetAdminUser(event) && all === "true";
}
function applyPublishFilter(event, all, where) {
  if (!isAdminAll(event, all)) {
    where.isPublished = true;
  }
  return where;
}
function applyApprovalFilter(event, all, where) {
  if (!isAdminAll(event, all)) {
    where.isApproved = true;
  }
  return where;
}
function isAdminAllRequest(event, all) {
  return isAdminAll(event, all);
}

const QuerySchema$3 = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  category: z.string().optional(),
  tag: z.string().optional(),
  keyword: z.string().optional(),
  all: z.string().optional()
});
const index_get$g = defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, QuerySchema$3.parse);
  const { page, pageSize, category: categorySlug, tag: tagSlug, keyword } = query;
  const whereCondition = applyPublishFilter(event, query.all, {});
  if (categorySlug) {
    whereCondition.category = { slug: categorySlug };
  }
  if (tagSlug) {
    whereCondition.tags = {
      some: {
        tag: { slug: tagSlug }
      }
    };
  }
  if (keyword) {
    whereCondition.OR = [
      { title: { contains: keyword } },
      { summary: { contains: keyword } }
    ];
  }
  const [total, articles] = await Promise.all([
    prisma.article.count({ where: whereCondition }),
    prisma.article.findMany({
      where: whereCondition,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: [
        { isPinned: "desc" },
        { createdAt: "desc" }
      ],
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        coverImage: true,
        isPublished: true,
        isPinned: true,
        views: true,
        readingTime: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: { id: true, name: true, slug: true }
        },
        tags: {
          select: {
            tag: { select: { id: true, name: true, slug: true } }
          }
        },
        _count: {
          select: { comments: { where: { isApproved: true } } }
        }
      }
    })
  ]);
  const list = articles.map((item) => ({
    ...item,
    tags: item.tags.map((t) => t.tag),
    commentCount: item._count.comments
  }));
  return paginationResponse(list, total, page, pageSize);
});

const index_get$h = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$g
}, Symbol.toStringTag, { value: 'Module' }));

const CreateArticleSchema = z.object({
  slug: z.string().min(2, "Slug \u957F\u5EA6\u81F3\u5C11 2 \u4E2A\u5B57\u7B26"),
  title: z.string().min(1, "\u6807\u9898\u4E0D\u80FD\u4E3A\u7A7A"),
  summary: z.string().min(1, "\u6458\u8981\u4E0D\u80FD\u4E3A\u7A7A"),
  content: z.string().min(1, "\u5185\u5BB9\u4E0D\u80FD\u4E3A\u7A7A"),
  coverImage: z.string().optional().nullable(),
  isPublished: z.boolean().default(false),
  isPinned: z.boolean().default(false),
  readingTime: z.number().int().min(0).default(0),
  categoryId: z.number().int().optional().nullable(),
  tagIds: z.array(z.number().int()).default([])
});
const index_post$c = defineEventHandler(async (event) => {
  const authUser = requireAdminUser(event);
  const data = await readValidated(event, CreateArticleSchema);
  const existing = await prisma.article.findUnique({
    where: { slug: data.slug }
  });
  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: "\u8BE5 Slug \u6807\u8BC6\u5DF2\u5B58\u5728\uFF0C\u8BF7\u66F4\u6362"
    });
  }
  const estimatedReadingTime = data.readingTime || Math.max(1, Math.ceil(data.content.length / 350));
  const article = await prisma.article.create({
    data: {
      slug: data.slug,
      title: data.title,
      summary: data.summary,
      content: data.content,
      coverImage: data.coverImage,
      isPublished: data.isPublished,
      isPinned: data.isPinned,
      readingTime: estimatedReadingTime,
      categoryId: data.categoryId,
      authorId: authUser.userId,
      tags: {
        create: data.tagIds.map((tagId) => ({ tagId }))
      }
    },
    include: {
      category: true,
      tags: { include: { tag: true } }
    }
  });
  return successResponse(article, "\u6587\u7AE0\u521B\u5EFA\u6210\u529F");
});

const index_post$d = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_post$c
}, Symbol.toStringTag, { value: 'Module' }));

const LoginSchema = z.object({
  username: z.string().min(1, "\u8BF7\u8F93\u5165\u7528\u6237\u540D"),
  password: z.string().min(1, "\u8BF7\u8F93\u5165\u5BC6\u7801")
});
const login_post = defineEventHandler(async (event) => {
  const { username, password } = await readValidated(event, LoginSchema);
  const user = await prisma.user.findUnique({
    where: { username }
  });
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "\u7528\u6237\u540D\u6216\u5BC6\u7801\u9519\u8BEF"
    });
  }
  if (!user.passwordHash) {
    throw createError({
      statusCode: 401,
      statusMessage: "\u7528\u6237\u540D\u6216\u5BC6\u7801\u9519\u8BEF"
    });
  }
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw createError({
      statusCode: 401,
      statusMessage: "\u7528\u6237\u540D\u6216\u5BC6\u7801\u9519\u8BEF"
    });
  }
  const config = useRuntimeConfig(event);
  const token = signAuthToken(
    {
      userId: user.id,
      username: user.username,
      role: user.role
    },
    config.jwtSecret
  );
  return successResponse({
    token,
    user: {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      avatar: user.avatar,
      role: user.role
    }
  }, "\u767B\u5F55\u6210\u529F");
});

const login_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: login_post
}, Symbol.toStringTag, { value: 'Module' }));

const me_get = defineEventHandler(async (event) => {
  const authUser = requireAdminUser(event);
  const user = await prisma.user.findUnique({
    where: { id: authUser.userId },
    select: {
      id: true,
      username: true,
      nickname: true,
      avatar: true,
      email: true,
      bio: true,
      role: true,
      createdAt: true
    }
  });
  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: "\u7528\u6237\u4E0D\u5B58\u5728"
    });
  }
  return successResponse(user);
});

const me_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: me_get
}, Symbol.toStringTag, { value: 'Module' }));

const RegisterSchema = z.object({
  username: z.string().min(3, "\u7528\u6237\u540D\u81F3\u5C11 3 \u4E2A\u5B57\u7B26").max(30, "\u7528\u6237\u540D\u6700\u591A 30 \u4E2A\u5B57\u7B26").regex(/^[a-zA-Z0-9_-]+$/, "\u7528\u6237\u540D\u4EC5\u652F\u6301\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u4E0B\u5212\u7EBF\u53CA\u8FDE\u5B57\u7B26"),
  password: z.string().min(6, "\u5BC6\u7801\u957F\u5EA6\u81F3\u5C11 6 \u4F4D").max(50, "\u5BC6\u7801\u957F\u5EA6\u6700\u591A 50 \u4F4D"),
  nickname: z.string().min(1, "\u8BF7\u8F93\u5165\u6635\u79F0").max(30, "\u6635\u79F0\u6700\u591A 30 \u4E2A\u5B57\u7B26"),
  email: z.string().email("\u90AE\u7BB1\u683C\u5F0F\u4E0D\u6B63\u786E").optional().or(z.literal("")).nullable(),
  guestUuid: z.string().optional().nullable()
  // 支持将已有访客指纹对应的历史足迹升级绑定
});
const register_post = defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const { username, password, nickname, email, guestUuid } = await readValidated(event, RegisterSchema);
  const existingUsername = await prisma.user.findUnique({
    where: { username }
  });
  if (existingUsername) {
    throw createError({
      statusCode: 409,
      statusMessage: "\u8BE5\u7528\u6237\u540D\u5DF2\u88AB\u5360\u7528\uFF0C\u8BF7\u6362\u4E00\u4E2A"
    });
  }
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const defaultAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`;
  const ipAddress = getClientIp(event);
  const userAgent = getClientUa(event);
  const userSelect = {
    id: true,
    username: true,
    nickname: true,
    avatar: true,
    email: true,
    role: true,
    createdAt: true
  };
  let user = null;
  if (guestUuid) {
    const existingGuest = await prisma.user.findUnique({
      where: { guestUuid }
    });
    if (existingGuest && existingGuest.role === "guest") {
      user = await prisma.user.update({
        where: { id: existingGuest.id },
        data: {
          username,
          passwordHash,
          nickname,
          email: email || null,
          avatar: existingGuest.avatar || defaultAvatar,
          role: "user",
          ipAddress,
          userAgent
        },
        select: userSelect
      });
    }
  }
  if (!user) {
    user = await prisma.user.create({
      data: {
        username,
        passwordHash,
        nickname,
        email: email || null,
        avatar: defaultAvatar,
        role: "user",
        guestUuid: null,
        // 正式注册用户不占用 guestUuid 唯一约束
        ipAddress,
        userAgent
      },
      select: userSelect
    });
  }
  const token = signAuthToken(
    {
      userId: user.id,
      username: user.username,
      role: user.role
    },
    config.jwtSecret,
    "7d"
  );
  return successResponse({
    token,
    user
  }, "\u6CE8\u518C\u6210\u529F\uFF0C\u6B22\u8FCE\u52A0\u5165\u795E\u79D8\u82B1\u56ED\uFF01");
});

const register_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: register_post
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$e = defineEventHandler(async () => {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({
      include: {
        _count: {
          select: { articles: { where: { isPublished: true } } }
        }
      }
    }),
    prisma.tag.findMany({
      include: {
        _count: {
          select: { articles: { where: { article: { isPublished: true } } } }
        }
      }
    })
  ]);
  return successResponse({
    categories: categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      articleCount: c._count.articles
    })),
    tags: tags.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      articleCount: t._count.articles
    }))
  });
});

const index_get$f = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$e
}, Symbol.toStringTag, { value: 'Module' }));

const CreateCategorySchema = z.object({
  name: z.string().min(1, "\u5206\u7C7B\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A").max(50, "\u5206\u7C7B\u540D\u79F0\u6700\u591A50\u4E2A\u5B57\u7B26"),
  slug: z.string().min(1, "Slug \u6807\u8BC6\u4E0D\u80FD\u4E3A\u7A7A").max(50, "Slug \u6700\u591A50\u4E2A\u5B57\u7B26"),
  description: z.string().max(200, "\u5206\u7C7B\u63CF\u8FF0\u6700\u591A200\u4E2A\u5B57\u7B26").optional().nullable()
});
const index_post$a = defineEventHandler(async (event) => {
  requireAdminUser(event);
  const data = await readValidated(event, CreateCategorySchema);
  const existingSlug = await prisma.category.findUnique({
    where: { slug: data.slug }
  });
  if (existingSlug) {
    throw createError({ statusCode: 409, statusMessage: "\u8BE5\u5206\u7C7B Slug \u6807\u8BC6\u5DF2\u5B58\u5728" });
  }
  const existingName = await prisma.category.findUnique({
    where: { name: data.name }
  });
  if (existingName) {
    throw createError({ statusCode: 409, statusMessage: "\u8BE5\u5206\u7C7B\u540D\u79F0\u5DF2\u5B58\u5728" });
  }
  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null
    }
  });
  return successResponse(category, "\u5206\u7C7B\u521B\u5EFA\u6210\u529F");
});

const index_post$b = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_post$a
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete$4 = defineEventHandler(async (event) => {
  requireAdminUser(event);
  const id = parseIdParam(event);
  await prisma.comment.delete({
    where: { id }
  });
  return successResponse(null, "\u8BC4\u8BBA\u5DF2\u5220\u9664");
});

const _id__delete$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$4
}, Symbol.toStringTag, { value: 'Module' }));

const approve_patch = defineEventHandler(async (event) => {
  requireAdminUser(event);
  const id = parseIdParam(event);
  const body = await readBody(event);
  const isApproved = body.isApproved !== void 0 ? Boolean(body.isApproved) : true;
  const updated = await prisma.comment.update({
    where: { id },
    data: { isApproved }
  });
  return successResponse(updated, isApproved ? "\u8BC4\u8BBA\u5DF2\u901A\u8FC7\u5BA1\u6838" : "\u8BC4\u8BBA\u5DF2\u4E0B\u7EBF");
});

const approve_patch$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: approve_patch
}, Symbol.toStringTag, { value: 'Module' }));

const QuerySchema$2 = z.object({
  targetType: z.enum(["article", "essay", "guestbook"]).default("article"),
  articleId: z.coerce.number().int().positive().optional(),
  essayId: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
  all: z.string().optional()
});
const index_get$c = defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, QuerySchema$2.parse);
  const { targetType, articleId, essayId, page, pageSize } = query;
  const isAll = isAdminAllRequest(event, query.all);
  const whereCondition = applyApprovalFilter(event, query.all, {
    targetType,
    parentId: null
  });
  if (targetType === "article" && articleId) {
    whereCondition.articleId = articleId;
  } else if (targetType === "essay" && essayId) {
    whereCondition.essayId = essayId;
  }
  const [total, comments] = await Promise.all([
    prisma.comment.count({ where: whereCondition }),
    prisma.comment.findMany({
      where: whereCondition,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: [
        { isPinned: "desc" },
        { createdAt: "desc" }
      ],
      include: {
        user: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true,
            role: true
          }
        },
        replies: {
          where: isAll ? {} : { isApproved: true },
          orderBy: { createdAt: "asc" },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                nickname: true,
                avatar: true,
                role: true
              }
            }
          }
        }
      }
    })
  ]);
  return paginationResponse(comments, total, page, pageSize);
});

const index_get$d = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$c
}, Symbol.toStringTag, { value: 'Module' }));

const CreateCommentSchema = z.object({
  targetType: z.enum(["article", "essay", "guestbook"]).default("article"),
  articleId: z.number().int().optional().nullable(),
  essayId: z.number().int().optional().nullable(),
  parentId: z.number().int().optional().nullable(),
  guestUuid: z.string().min(8).max(64).optional(),
  content: z.string().min(1, "\u8BC4\u8BBA\u5185\u5BB9\u4E0D\u80FD\u4E3A\u7A7A").max(1e3, "\u8BC4\u8BBA\u5B57\u6570\u6700\u591A 1000 \u5B57")
});
const index_post$8 = defineEventHandler(async (event) => {
  const data = await readValidated(event, CreateCommentSchema);
  const ipAddress = getClientIp(event);
  const userAgent = getClientUa(event);
  let userId = null;
  const authPayload = tryGetAuthUser(event);
  const isLoggedIn = !!authPayload;
  if (authPayload == null ? void 0 : authPayload.userId) {
    const loggedInUser = await prisma.user.findUnique({
      where: { id: authPayload.userId }
    });
    if (loggedInUser) {
      userId = loggedInUser.id;
    }
  }
  if (!userId) {
    const guestUuid = data.guestUuid || `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    let guestUser = await prisma.user.findUnique({
      where: { guestUuid }
    });
    if (!guestUser) {
      const cleanId = guestUuid.replace(/[^a-zA-Z0-9]/g, "").slice(-4).toLowerCase() || Math.random().toString(36).slice(2, 6);
      const guestNickname = `\u6F2B\u6B65\u82B1\u53CB_${cleanId}`;
      const guestAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanId}`;
      guestUser = await prisma.user.create({
        data: {
          username: `guest_${guestUuid.slice(0, 16)}_${Math.random().toString(36).slice(2, 6)}`,
          passwordHash: null,
          nickname: guestNickname,
          avatar: guestAvatar,
          role: "guest",
          guestUuid,
          ipAddress,
          userAgent
        }
      });
    }
    userId = guestUser.id;
  }
  const comment = await prisma.comment.create({
    data: {
      targetType: data.targetType,
      articleId: data.articleId || null,
      essayId: data.essayId || null,
      parentId: data.parentId || null,
      userId,
      content: data.content,
      ipAddress,
      userAgent,
      isApproved: isLoggedIn
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          nickname: true,
          avatar: true,
          role: true
        }
      }
    }
  });
  return successResponse(comment, "\u8BC4\u8BBA\u63D0\u4EA4\u6210\u529F");
});

const index_post$9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_post$8
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete$2 = defineEventHandler(async (event) => {
  requireAdminUser(event);
  const id = parseIdParam(event);
  await prisma.essay.delete({
    where: { id }
  });
  return successResponse(null, "\u968F\u7B14\u5DF2\u5220\u9664");
});

const _id__delete$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$2
}, Symbol.toStringTag, { value: 'Module' }));

const like_post = defineEventHandler(async (event) => {
  const id = parseIdParam(event);
  const updated = await prisma.essay.update({
    where: { id },
    data: {
      likes: { increment: 1 }
    },
    select: {
      id: true,
      likes: true
    }
  });
  return successResponse(updated, "\u70B9\u8D5E\u6210\u529F");
});

const like_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: like_post
}, Symbol.toStringTag, { value: 'Module' }));

const QuerySchema$1 = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(15),
  mood: z.string().optional(),
  all: z.string().optional()
});
const index_get$a = defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, QuerySchema$1.parse);
  const { page, pageSize, mood } = query;
  const whereCondition = applyPublishFilter(event, query.all, {});
  if (mood) {
    whereCondition.mood = { contains: mood };
  }
  const [total, essays] = await Promise.all([
    prisma.essay.count({ where: whereCondition }),
    prisma.essay.findMany({
      where: whereCondition,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: [
        { isPinned: "desc" },
        { createdAt: "desc" }
      ],
      include: {
        author: {
          select: { id: true, nickname: true, avatar: true }
        },
        _count: {
          select: { comments: { where: { isApproved: true } } }
        }
      }
    })
  ]);
  const list = essays.map((e) => ({
    ...e,
    commentCount: e._count.comments
  }));
  return paginationResponse(list, total, page, pageSize);
});

const index_get$b = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$a
}, Symbol.toStringTag, { value: 'Module' }));

const CreateEssaySchema = z.object({
  content: z.string().min(1, "\u968F\u7B14\u5185\u5BB9\u4E0D\u80FD\u4E3A\u7A7A"),
  mood: z.string().optional().nullable(),
  weather: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  images: z.array(z.string().url()).optional().nullable(),
  isPinned: z.boolean().default(false),
  isPublished: z.boolean().default(true)
});
const index_post$6 = defineEventHandler(async (event) => {
  const authUser = requireAdminUser(event);
  const data = await readValidated(event, CreateEssaySchema);
  const essay = await prisma.essay.create({
    data: {
      content: data.content,
      mood: data.mood,
      weather: data.weather,
      location: data.location,
      images: data.images ? JSON.parse(JSON.stringify(data.images)) : null,
      isPinned: data.isPinned,
      isPublished: data.isPublished,
      authorId: authUser.userId
    },
    include: {
      author: {
        select: { id: true, nickname: true, avatar: true }
      }
    }
  });
  return successResponse(essay, "\u968F\u7B14\u53D1\u5E03\u6210\u529F");
});

const index_post$7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_post$6
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$8 = defineEventHandler(async (event) => {
  const isAdmin = !!tryGetAdminUser(event);
  const notebooks = await prisma.notebook.findMany({
    where: isAdmin ? {} : { isPrivate: false },
    orderBy: [
      { sortOrder: "asc" },
      { createdAt: "asc" }
    ],
    include: {
      _count: {
        select: { notes: { where: { isPublished: true } } }
      }
    }
  });
  const childrenByParentId = /* @__PURE__ */ new Map();
  for (const notebook of notebooks) {
    const siblings = childrenByParentId.get(notebook.parentId) || [];
    siblings.push(notebook.id);
    childrenByParentId.set(notebook.parentId, siblings);
  }
  const notebooksById = new Map(notebooks.map((notebook) => [notebook.id, notebook]));
  const countDescendantNotes = (notebookId) => {
    const current = notebooksById.get(notebookId);
    if (!current) return 0;
    return current._count.notes + (childrenByParentId.get(notebookId) || []).reduce((total, childId) => total + countDescendantNotes(childId), 0);
  };
  return successResponse(notebooks.map(({ _count, ...notebook }) => ({
    ...notebook,
    noteCount: countDescendantNotes(notebook.id)
  })));
});

const index_get$9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$8
}, Symbol.toStringTag, { value: 'Module' }));

const CreateNotebookSchema = z.object({
  name: z.string().min(1, "\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A").max(50),
  slug: z.string().min(1, "Slug\u4E0D\u80FD\u4E3A\u7A7A").max(50),
  path: z.string().min(1).max(500).optional(),
  parentId: z.number().int().positive().optional().nullable(),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  isPrivate: z.boolean().default(false),
  sortOrder: z.number().int().default(0)
});
const index_post$4 = defineEventHandler(async (event) => {
  requireAdminUser(event);
  const data = await readValidated(event, CreateNotebookSchema);
  const existing = await prisma.notebook.findUnique({
    where: { slug: data.slug }
  });
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: "\u8BE5\u7B14\u8BB0\u672C Slug \u5DF2\u5B58\u5728" });
  }
  const notebook = await prisma.notebook.create({
    data: {
      ...data,
      path: data.path || data.slug
    }
  });
  return successResponse(notebook, "\u7B14\u8BB0\u672C\u521B\u5EFA\u6210\u529F");
});

const index_post$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_post$4
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete = defineEventHandler(async (event) => {
  requireAdminUser(event);
  const id = parseIdParam(event);
  await prisma.note.delete({
    where: { id }
  });
  return successResponse(null, "\u7B14\u8BB0\u5DF2\u5220\u9664");
});

const _id__delete$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete
}, Symbol.toStringTag, { value: 'Module' }));

const UpdateNoteSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  summary: z.string().optional().nullable(),
  content: z.string().min(1).optional(),
  isPinned: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  isEncrypted: z.boolean().optional(),
  password: z.string().optional().nullable(),
  notebookId: z.number().int().optional().nullable(),
  tagIds: z.array(z.number().int()).optional()
});
const _id__put = defineEventHandler(async (event) => {
  requireAdminUser(event);
  const id = parseIdParam(event);
  const data = await readValidated(event, UpdateNoteSchema);
  if (data.slug) {
    const existing = await prisma.note.findFirst({
      where: { slug: data.slug, NOT: { id } }
    });
    if (existing) {
      throw createError({ statusCode: 409, statusMessage: "\u8BE5 Slug \u6807\u8BC6\u5DF2\u88AB\u5360\u7528" });
    }
  }
  const updated = await prisma.$transaction(async (tx) => {
    if (data.tagIds !== void 0) {
      await tx.noteTag.deleteMany({ where: { noteId: id } });
      if (data.tagIds.length > 0) {
        await tx.noteTag.createMany({
          data: data.tagIds.map((tagId) => ({ noteId: id, tagId }))
        });
      }
    }
    return tx.note.update({
      where: { id },
      data: {
        ...data.title && { title: data.title },
        ...data.slug && { slug: data.slug },
        ...data.summary !== void 0 && { summary: data.summary },
        ...data.content && { content: data.content },
        ...data.isPinned !== void 0 && { isPinned: data.isPinned },
        ...data.isPublished !== void 0 && { isPublished: data.isPublished },
        ...data.isEncrypted !== void 0 && { isEncrypted: data.isEncrypted },
        ...data.password !== void 0 && { password: data.password ? await bcrypt.hash(data.password, 10) : null },
        ...data.notebookId !== void 0 && { notebookId: data.notebookId }
      },
      include: {
        notebook: true,
        tags: { include: { tag: true } }
      }
    });
  });
  return successResponse(updated, "\u7B14\u8BB0\u66F4\u65B0\u6210\u529F");
});

const _id__put$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__put
}, Symbol.toStringTag, { value: 'Module' }));

const _slug__get = defineEventHandler(async (event) => {
  var _a;
  const paramSlug = getRouterParam(event, "slug") || ((_a = event.context.params) == null ? void 0 : _a.slug);
  const pathParts = event.path.split("?")[0].split("/");
  const slug = paramSlug || pathParts[pathParts.length - 1];
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "\u7F3A\u5C11\u7B14\u8BB0 Slug" });
  }
  const note = await prisma.note.findUnique({
    where: { slug },
    include: {
      notebook: true,
      author: {
        select: { id: true, nickname: true, avatar: true }
      },
      tags: {
        include: { tag: true }
      }
    }
  });
  if (!note) {
    throw createError({ statusCode: 404, statusMessage: "\u7B14\u8BB0\u4E0D\u5B58\u5728\u6216\u5DF2\u88AB\u5220\u9664" });
  }
  if (!note.isPublished && !tryGetAdminUser(event)) {
    throw createError({ statusCode: 404, statusMessage: "\u7B14\u8BB0\u4E0D\u5B58\u5728\u6216\u5DF2\u88AB\u5220\u9664" });
  }
  prisma.note.update({
    where: { id: note.id },
    data: { views: { increment: 1 } }
  }).catch((err) => console.error("\u9012\u589E\u7B14\u8BB0\u6D4F\u89C8\u91CF\u5931\u8D25:", err));
  const { password, ...noteWithoutPassword } = note;
  const formattedNote = {
    ...noteWithoutPassword,
    tags: note.tags.map((t) => t.tag)
  };
  return successResponse(formattedNote);
});

const _slug__get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _slug__get
}, Symbol.toStringTag, { value: 'Module' }));

const QuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
  notebook: z.string().optional(),
  tag: z.string().optional(),
  keyword: z.string().optional(),
  all: z.string().optional()
});
const index_get$6 = defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, QuerySchema.parse);
  const { page, pageSize, notebook: notebookSlug, tag: tagSlug, keyword } = query;
  const whereCondition = applyPublishFilter(event, query.all, {});
  if (notebookSlug) {
    const notebook = await prisma.notebook.findUnique({
      where: { slug: notebookSlug },
      select: { path: true }
    });
    whereCondition.notebook = notebook ? {
      OR: [
        { path: notebook.path },
        { path: { startsWith: `${notebook.path}/` } }
      ]
    } : { id: -1 };
  }
  if (tagSlug) {
    whereCondition.tags = {
      some: { tag: { slug: tagSlug } }
    };
  }
  if (keyword) {
    whereCondition.OR = [
      { title: { contains: keyword } },
      { summary: { contains: keyword } },
      { content: { contains: keyword } }
    ];
  }
  const [total, notes] = await Promise.all([
    prisma.note.count({ where: whereCondition }),
    prisma.note.findMany({
      where: whereCondition,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: [
        { isPinned: "desc" },
        { createdAt: "desc" }
      ],
      include: {
        notebook: {
          select: { id: true, name: true, slug: true, path: true, parentId: true, icon: true }
        },
        tags: {
          select: {
            tag: { select: { id: true, name: true, slug: true } }
          }
        },
        author: {
          select: { id: true, nickname: true, avatar: true }
        }
      }
    })
  ]);
  const list = notes.map((item) => {
    const { password: _password, ...rest } = item;
    return {
      ...rest,
      tags: item.tags.map((t) => t.tag)
    };
  });
  return paginationResponse(list, total, page, pageSize);
});

const index_get$7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$6
}, Symbol.toStringTag, { value: 'Module' }));

const CreateNoteSchema = z.object({
  title: z.string().min(1, "\u6807\u9898\u4E0D\u80FD\u4E3A\u7A7A").max(200),
  slug: z.string().min(1, "Slug \u4E0D\u80FD\u4E3A\u7A7A").max(100),
  summary: z.string().optional().nullable(),
  content: z.string().min(1, "\u5185\u5BB9\u4E0D\u80FD\u4E3A\u7A7A"),
  isPinned: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  isEncrypted: z.boolean().default(false),
  password: z.string().optional().nullable(),
  notebookId: z.number().int().optional().nullable(),
  tagIds: z.array(z.number().int()).default([])
});
const index_post$2 = defineEventHandler(async (event) => {
  const authUser = requireAdminUser(event);
  const data = await readValidated(event, CreateNoteSchema);
  const existing = await prisma.note.findUnique({
    where: { slug: data.slug }
  });
  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: "\u8BE5 Slug \u6807\u8BC6\u5DF2\u5B58\u5728\uFF0C\u8BF7\u66F4\u6362"
    });
  }
  const note = await prisma.note.create({
    data: {
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      content: data.content,
      isPinned: data.isPinned,
      isPublished: data.isPublished,
      isEncrypted: data.isEncrypted,
      password: data.password ? await bcrypt.hash(data.password, 10) : null,
      notebookId: data.notebookId,
      authorId: authUser.userId,
      tags: {
        create: data.tagIds.map((tagId) => ({ tagId }))
      }
    },
    include: {
      notebook: true,
      tags: { include: { tag: true } }
    }
  });
  return successResponse(note, "\u7B14\u8BB0\u521B\u5EFA\u6210\u529F");
});

const index_post$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_post$2
}, Symbol.toStringTag, { value: 'Module' }));

function requireNoteSyncToken(event) {
  const expectedToken = process.env.NUXT_NOTE_SYNC_TOKEN || process.env.NOTE_SYNC_TOKEN || useRuntimeConfig(event).noteSyncToken;
  if (!expectedToken || expectedToken.length < 32) {
    throw createError({ statusCode: 503, statusMessage: "\u7B14\u8BB0\u540C\u6B65\u670D\u52A1\u672A\u914D\u7F6E" });
  }
  const authorization = getRequestHeader(event, "authorization");
  const actualToken = (authorization == null ? void 0 : authorization.startsWith("Bearer ")) ? authorization.slice(7) : "";
  const expectedBuffer = Buffer.from(expectedToken);
  const actualBuffer = Buffer.from(actualToken);
  if (!actualToken || actualBuffer.length !== expectedBuffer.length || !crypto$1.timingSafeEqual(actualBuffer, expectedBuffer)) {
    throw createError({ statusCode: 401, statusMessage: "\u7B14\u8BB0\u540C\u6B65\u51ED\u8BC1\u65E0\u6548" });
  }
}

const DirectorySchema = z.object({
  name: z.string().trim().min(1).max(50),
  slug: z.string().trim().min(1).max(50),
  path: z.string().trim().min(1).max(500),
  parentPath: z.string().trim().min(1).max(500).nullable(),
  description: z.string().trim().max(200),
  icon: z.string().trim().min(1).max(50)
});
const SyncNoteSchema = z.object({
  title: z.string().trim().min(1, "\u7B14\u8BB0\u6807\u9898\u4E0D\u80FD\u4E3A\u7A7A").max(200),
  slug: z.string().trim().min(1, "\u7B14\u8BB0 Slug \u4E0D\u80FD\u4E3A\u7A7A").max(100),
  summary: z.string().trim().min(1).max(500),
  content: z.string().min(1, "\u7B14\u8BB0\u6B63\u6587\u4E0D\u80FD\u4E3A\u7A7A").max(2e6),
  sourcePath: z.string().trim().min(1).max(500),
  directoryPath: z.string().trim().min(1).max(500).nullable(),
  tags: z.array(z.string().trim().min(1).max(50)).max(30).transform((tags) => [...new Set(tags)])
});
const SyncRequestSchema = z.object({
  directories: z.array(DirectorySchema).max(500, "\u5355\u6B21\u6700\u591A\u540C\u6B65 500 \u4E2A\u76EE\u5F55").default([]),
  notes: z.array(SyncNoteSchema).min(1, "\u81F3\u5C11\u9700\u8981\u540C\u6B65\u4E00\u7BC7\u7B14\u8BB0").max(50, "\u5355\u6B21\u6700\u591A\u540C\u6B65 50 \u7BC7\u7B14\u8BB0")
});
function createTagSlug(name) {
  const normalized = name.toLowerCase().trim().replace(/[^\w\u4e00-\u9fa5]+/g, "-").replace(/^-+|-+$/g, "") || "tag";
  const suffix = crypto$1.createHash("sha256").update(name).digest("hex").slice(0, 8);
  return `${normalized.slice(0, 40)}-${suffix}`;
}
const sync_post = defineEventHandler(async (event) => {
  requireNoteSyncToken(event);
  const { directories, notes } = await readValidated(event, SyncRequestSchema);
  const author = await prisma.user.findFirst({
    where: { role: "admin" },
    select: { id: true }
  });
  if (!author) {
    throw createError({ statusCode: 409, statusMessage: "\u5C1A\u672A\u521D\u59CB\u5316\u7BA1\u7406\u5458\u8D26\u53F7\uFF0C\u65E0\u6CD5\u540C\u6B65\u7B14\u8BB0" });
  }
  const result = await prisma.$transaction(async (tx) => {
    let created = 0;
    let updated = 0;
    const notebookIds = /* @__PURE__ */ new Map();
    for (const directory of [...directories].sort((left, right) => left.path.split("/").length - right.path.split("/").length)) {
      const parentId = directory.parentPath ? notebookIds.get(directory.parentPath) : null;
      if (directory.parentPath && !parentId) {
        throw createError({ statusCode: 422, statusMessage: `\u76EE\u5F55\u7F3A\u5C11\u7236\u7EA7\uFF1A${directory.path}` });
      }
      const notebook = await tx.notebook.upsert({
        where: { path: directory.path },
        update: {
          name: directory.name,
          slug: directory.slug,
          description: directory.description,
          icon: directory.icon,
          parentId
        },
        create: {
          name: directory.name,
          slug: directory.slug,
          path: directory.path,
          description: directory.description,
          icon: directory.icon,
          parentId
        }
      });
      notebookIds.set(directory.path, notebook.id);
    }
    for (const item of notes) {
      const notebook = item.directoryPath ? await tx.notebook.findUnique({ where: { path: item.directoryPath }, select: { id: true } }) : null;
      if (item.directoryPath && !notebook) {
        throw createError({ statusCode: 422, statusMessage: `\u7B14\u8BB0\u76EE\u5F55\u4E0D\u5B58\u5728\uFF1A${item.directoryPath}` });
      }
      const tags = await Promise.all(item.tags.map(async (name) => {
        return tx.tag.upsert({
          where: { name },
          update: {},
          create: { name, slug: createTagSlug(name) }
        });
      }));
      const existing = await tx.note.findUnique({ where: { sourcePath: item.sourcePath }, select: { id: true } });
      const noteFields = {
        title: item.title,
        summary: item.summary,
        content: item.content,
        sourcePath: item.sourcePath,
        notebookId: (notebook == null ? void 0 : notebook.id) || null,
        isPublished: true,
        isEncrypted: false
      };
      if (existing) {
        await tx.note.update({
          where: { id: existing.id },
          data: {
            ...noteFields,
            tags: {
              deleteMany: {},
              create: tags.map((tag) => ({ tagId: tag.id }))
            }
          }
        });
        updated += 1;
      } else {
        await tx.note.create({
          data: {
            ...noteFields,
            slug: item.slug,
            authorId: author.id,
            tags: { create: tags.map((tag) => ({ tagId: tag.id })) }
          }
        });
        created += 1;
      }
    }
    return { created, updated };
  });
  return successResponse(result, `\u7B14\u8BB0\u540C\u6B65\u5B8C\u6210\uFF1A\u65B0\u589E ${result.created} \u7BC7\uFF0C\u66F4\u65B0 ${result.updated} \u7BC7`);
});

const sync_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: sync_post
}, Symbol.toStringTag, { value: 'Module' }));

const MAX_ADMIN_IMAGE_SIZE = 25 * 1024 * 1024;
const MAX_NOTE_IMAGE_SIZE = 10 * 1024 * 1024;
const IMAGE_MIME_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".svg": "image/svg+xml"
};
function getValidatedImageType(filename, mimeType) {
  const ext = path.extname(filename).toLowerCase();
  const expectedMimeType = IMAGE_MIME_TYPES[ext];
  if (!expectedMimeType || expectedMimeType !== mimeType) return null;
  return { ext, mimeType: expectedMimeType };
}

const STORAGE_PREFIX = "uploads";
function getStorageDriver() {
  return process.env.STORAGE_DRIVER === "oss" ? "oss" : "local";
}
function toOssRegion(value) {
  if (!value) return "oss-cn-hangzhou";
  return value.startsWith("oss-") ? value : `oss-${value}`;
}
function hasOssStorageConfiguration() {
  const accessKeyId = process.env.OSS_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY_ID;
  const accessKeySecret = process.env.OSS_ACCESS_KEY_SECRET || process.env.S3_SECRET_ACCESS_KEY;
  const bucket = process.env.OSS_BUCKET || process.env.S3_BUCKET_NAME;
  return Boolean(accessKeyId && accessKeySecret && bucket);
}
async function getOssStorageConfig() {
  const endpoint = process.env.OSS_ENDPOINT || process.env.S3_ENDPOINT;
  const accessKeyId = process.env.OSS_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY_ID;
  const accessKeySecret = process.env.OSS_ACCESS_KEY_SECRET || process.env.S3_SECRET_ACCESS_KEY;
  const bucket = process.env.OSS_BUCKET || process.env.S3_BUCKET_NAME;
  const region = toOssRegion(process.env.OSS_REGION || process.env.S3_REGION);
  const publicDomain = process.env.OSS_PUBLIC_DOMAIN || process.env.S3_PUBLIC_DOMAIN || "";
  if (!accessKeyId || !accessKeySecret || !bucket) return null;
  const { default: OssClient } = await import('file:///home/li/workspace/mystic-garden/node_modules/.pnpm/ali-oss@6.23.0_supports-color@10.0.0/node_modules/ali-oss/lib/client.js');
  const client = new OssClient({
    region,
    bucket,
    ...endpoint ? { endpoint } : {},
    accessKeyId,
    accessKeySecret,
    secure: true,
    authorizationV4: true
  });
  const endpointDomain = endpoint == null ? void 0 : endpoint.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  const derivedPublicDomain = endpointDomain ? `https://${bucket}.${endpointDomain}` : `https://${bucket}.${region}.aliyuncs.com`;
  return { client, publicDomain: (publicDomain || derivedPublicDomain).replace(/\/+$/, "") };
}
function getLocalUploadDirectory() {
  return process.env.UPLOAD_DIR || path.resolve(process.cwd(), "public", STORAGE_PREFIX);
}
function getLocalPublicBaseUrl() {
  return (process.env.UPLOAD_PUBLIC_BASE_URL || `/${STORAGE_PREFIX}`).replace(/\/+$/, "");
}
function getMonthPrefix(scope) {
  const date = /* @__PURE__ */ new Date();
  return `${STORAGE_PREFIX}/${scope}/${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}`;
}
function normalizeFilename(filename) {
  const baseName = path.basename(filename);
  return baseName.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "") || "image";
}
function toPublicUrl(publicDomain, objectKey) {
  return `${publicDomain}/${objectKey.split("/").map((segment) => encodeURIComponent(segment)).join("/")}`;
}
function getLocalRelativePath(objectKey) {
  const prefix = `${STORAGE_PREFIX}/`;
  if (!objectKey.startsWith(prefix)) {
    throw new Error(`\u65E0\u6548\u7684\u4E0A\u4F20\u5BF9\u8C61\u8DEF\u5F84\uFF1A${objectKey}`);
  }
  const relativePath = objectKey.slice(prefix.length);
  const normalizedPath = path.posix.normalize(relativePath);
  if (!relativePath || normalizedPath.startsWith("../") || normalizedPath === ".." || path.isAbsolute(normalizedPath)) {
    throw new Error(`\u4E0D\u5B89\u5168\u7684\u4E0A\u4F20\u5BF9\u8C61\u8DEF\u5F84\uFF1A${objectKey}`);
  }
  return normalizedPath;
}
function getLocalFilePath(objectKey, uploadDirectory = getLocalUploadDirectory()) {
  const resolvedDirectory = path.resolve(uploadDirectory);
  const filePath = path.resolve(resolvedDirectory, getLocalRelativePath(objectKey));
  if (!filePath.startsWith(`${resolvedDirectory}${path.sep}`)) {
    throw new Error(`\u4E0D\u5B89\u5168\u7684\u4E0A\u4F20\u5BF9\u8C61\u8DEF\u5F84\uFF1A${objectKey}`);
  }
  return filePath;
}
function getLocalPublicUrl(objectKey) {
  return toPublicUrl(getLocalPublicBaseUrl(), getLocalRelativePath(objectKey));
}
function isOssStorageConfigured() {
  return getStorageDriver() === "oss" && hasOssStorageConfiguration();
}
function createStorageObjectKey(scope, filename) {
  const extension = path.extname(filename).toLowerCase();
  const uniqueName = `${crypto$1.randomUUID()}${extension}`;
  return `${getMonthPrefix(scope)}/${uniqueName}`;
}
async function uploadFileToStorage(fileBuffer, filename, mimeType, options = { scope: "admin" }) {
  const objectKey = options.objectKey || `${getMonthPrefix(options.scope)}/${normalizeFilename(filename)}`;
  const ossConfig = isOssStorageConfigured() ? await getOssStorageConfig() : null;
  if (ossConfig) {
    await ossConfig.client.put(objectKey, fileBuffer, {
      mime: mimeType,
      headers: { "Cache-Control": "public, max-age=31536000, immutable" }
    });
    return toPublicUrl(ossConfig.publicDomain, objectKey);
  }
  const filePath = getLocalFilePath(objectKey);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, fileBuffer);
  return getLocalPublicUrl(objectKey);
}
async function createDirectUploadSignature(objectKey, mimeType, expiresInSeconds = 5 * 60) {
  const ossConfig = isOssStorageConfigured() ? await getOssStorageConfig() : null;
  if (!ossConfig) return null;
  const uploadUrl = await ossConfig.client.signatureUrlV4("PUT", expiresInSeconds, {
    headers: { "Content-Type": mimeType }
  }, objectKey);
  return { uploadUrl, publicUrl: toPublicUrl(ossConfig.publicDomain, objectKey) };
}

const assets_post = defineEventHandler(async (event) => {
  requireNoteSyncToken(event);
  const files = await readMultipartFormData(event);
  const file = files == null ? void 0 : files.find((item) => item.name === "image");
  if (!file || !file.filename) {
    throw createError({ statusCode: 400, statusMessage: "\u672A\u63A5\u6536\u5230\u7B14\u8BB0\u56FE\u7247" });
  }
  const imageType = getValidatedImageType(file.filename, file.type || "");
  if (!imageType || imageType.ext === ".svg") {
    throw createError({ statusCode: 400, statusMessage: "\u4EC5\u652F\u6301 JPG\u3001PNG\u3001WebP\u3001GIF\u3001AVIF \u56FE\u7247" });
  }
  if (file.data.length === 0 || file.data.length > MAX_NOTE_IMAGE_SIZE) {
    throw createError({ statusCode: 413, statusMessage: "\u5355\u5F20\u7B14\u8BB0\u56FE\u7247\u5FC5\u987B\u4ECB\u4E8E 1 B \u4E0E 10 MB \u4E4B\u95F4" });
  }
  const contentHash = crypto$1.createHash("sha256").update(file.data).digest("hex");
  const filename = `notes-${contentHash}${imageType.ext}`;
  const url = await uploadFileToStorage(file.data, filename, imageType.mimeType, { scope: "notes" });
  return successResponse({ url, filename, size: file.data.length }, "\u7B14\u8BB0\u56FE\u7247\u540C\u6B65\u6210\u529F");
});

const assets_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: assets_post
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$4 = defineEventHandler(async (event) => {
  const query = getQuery$1(event);
  const q = (query.q || "").trim();
  if (!q) {
    return successResponse({ articles: [], notes: [], essays: [] });
  }
  const [articles, notes, essays] = await Promise.all([
    // 1. 检索公开文章
    prisma.article.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: q } },
          { summary: { contains: q } },
          { content: { contains: q } }
        ]
      },
      take: 8,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        createdAt: true,
        category: { select: { name: true, slug: true } }
      }
    }),
    // 2. 检索公开笔记
    prisma.note.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: q } },
          { summary: { contains: q } },
          { content: { contains: q } }
        ]
      },
      take: 8,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        createdAt: true,
        notebook: { select: { name: true, slug: true } }
      }
    }),
    // 3. 检索公开随笔
    prisma.essay.findMany({
      where: {
        isPublished: true,
        content: { contains: q }
      },
      take: 6,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        mood: true,
        createdAt: true
      }
    })
  ]);
  return successResponse({ articles, notes, essays });
});

const index_get$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$4
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$2 = defineEventHandler(async () => {
  const settingsList = await prisma.setting.findMany();
  const settingsMap = {};
  for (const s of settingsList) {
    settingsMap[s.key] = s.value;
  }
  return successResponse(settingsMap);
});

const index_get$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$2
}, Symbol.toStringTag, { value: 'Module' }));

const index_patch = defineEventHandler(async (event) => {
  requireAdminUser(event);
  const body = await readBody(event);
  if (!body || typeof body !== "object") {
    throw createError({ statusCode: 400, statusMessage: "\u65E0\u6548\u7684\u8BBE\u7F6E\u53C2\u6570" });
  }
  const updates = Object.entries(body).map(([key, value]) => {
    return prisma.setting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) }
    });
  });
  await prisma.$transaction(updates);
  return successResponse(body, "\u8BBE\u7F6E\u4FDD\u5B58\u6210\u529F");
});

const index_patch$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_patch
}, Symbol.toStringTag, { value: 'Module' }));

const overview_get = defineEventHandler(async () => {
  const [
    articleCount,
    essayCount,
    noteCount,
    notebookCount,
    categoryCount,
    tagCount,
    commentCount,
    totalUsers,
    guestUsers,
    registeredUsers,
    articleViewsAgg,
    noteViewsAgg
  ] = await Promise.all([
    prisma.article.count({ where: { isPublished: true } }),
    prisma.essay.count({ where: { isPublished: true } }),
    prisma.note.count({ where: { isPublished: true } }),
    prisma.notebook.count(),
    prisma.category.count(),
    prisma.tag.count(),
    prisma.comment.count({ where: { isApproved: true } }),
    prisma.user.count(),
    prisma.user.count({ where: { role: "guest" } }),
    prisma.user.count({ where: { role: { in: ["user", "admin"] } } }),
    prisma.article.aggregate({ _sum: { views: true } }),
    prisma.note.aggregate({ _sum: { views: true } })
  ]);
  const [recentArticles, recentEssays, recentNotes] = await Promise.all([
    prisma.article.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        slug: true,
        title: true,
        createdAt: true,
        views: true,
        category: { select: { name: true, slug: true } }
      }
    }),
    prisma.essay.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        content: true,
        mood: true,
        likes: true,
        createdAt: true
      }
    }),
    prisma.note.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        slug: true,
        title: true,
        createdAt: true,
        views: true,
        notebook: { select: { name: true, slug: true, icon: true } }
      }
    })
  ]);
  const totalViews = (articleViewsAgg._sum.views || 0) + (noteViewsAgg._sum.views || 0);
  return successResponse({
    stats: {
      articles: articleCount,
      essays: essayCount,
      notes: noteCount,
      notebooks: notebookCount,
      categories: categoryCount,
      tags: tagCount,
      comments: commentCount,
      totalUsers,
      guestUsers,
      registeredUsers,
      totalViews
    },
    recentArticles,
    recentEssays,
    recentNotes
  });
});

const overview_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: overview_get
}, Symbol.toStringTag, { value: 'Module' }));

const index_get = defineEventHandler(async () => {
  const tags = await prisma.tag.findMany({
    orderBy: { id: "asc" },
    include: {
      _count: {
        select: {
          articles: true,
          notes: true
        }
      }
    }
  });
  return successResponse(
    tags.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      articleCount: t._count.articles,
      noteCount: t._count.notes
    }))
  );
});

const index_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get
}, Symbol.toStringTag, { value: 'Module' }));

const CreateTagSchema = z.object({
  name: z.string().min(1, "\u6807\u7B7E\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A").max(50),
  slug: z.string().max(50).optional()
});
const index_post = defineEventHandler(async (event) => {
  var _a;
  requireAdminUser(event);
  const data = await readValidated(event, CreateTagSchema);
  const { name } = data;
  const cleanName = name.trim();
  let tag = await prisma.tag.findFirst({
    where: { name: cleanName }
  });
  if (tag) {
    return successResponse(tag, "\u6807\u7B7E\u5DF2\u5B58\u5728");
  }
  let slug = ((_a = data.slug) == null ? void 0 : _a.trim()) || cleanName.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, "-");
  if (!slug) slug = `tag-${Date.now()}`;
  const existingSlug = await prisma.tag.findUnique({
    where: { slug }
  });
  if (existingSlug) {
    slug = `${slug}-${Math.floor(Math.random() * 1e3)}`;
  }
  tag = await prisma.tag.create({
    data: {
      name: cleanName,
      slug
    }
  });
  return successResponse(tag, "\u6807\u7B7E\u521B\u5EFA\u6210\u529F");
});

const index_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_post
}, Symbol.toStringTag, { value: 'Module' }));

const upload_post = defineEventHandler(async (event) => {
  requireAdminUser(event);
  const files = await readMultipartFormData(event);
  if (!files || files.length === 0) {
    throw createError({ statusCode: 400, statusMessage: "\u672A\u63A5\u6536\u5230\u4E0A\u4F20\u6587\u4EF6" });
  }
  const file = files == null ? void 0 : files[0];
  if (!file) {
    throw createError({ statusCode: 400, statusMessage: "\u672A\u63A5\u6536\u5230\u4E0A\u4F20\u6587\u4EF6" });
  }
  const imageType = file.filename && file.type ? getValidatedImageType(file.filename, file.type) : null;
  if (!imageType) {
    throw createError({ statusCode: 400, statusMessage: "\u4EC5\u652F\u6301 JPG\u3001PNG\u3001WebP\u3001GIF\u3001AVIF\u3001SVG \u56FE\u7247\uFF0C\u4E14\u6587\u4EF6\u6269\u5C55\u540D\u5FC5\u987B\u4E0E\u7C7B\u578B\u4E00\u81F4" });
  }
  if (file.data.length === 0 || file.data.length > MAX_ADMIN_IMAGE_SIZE) {
    throw createError({ statusCode: 413, statusMessage: "\u5355\u5F20\u56FE\u7247\u5FC5\u987B\u4ECB\u4E8E 1 B \u4E0E 25 MB \u4E4B\u95F4" });
  }
  const randomName = `${Date.now()}-${crypto$1.randomBytes(6).toString("hex")}${imageType.ext}`;
  const publicUrl = await uploadFileToStorage(file.data, randomName, imageType.mimeType, { scope: "admin" });
  return successResponse({
    url: publicUrl,
    filename: file.filename,
    size: file.data.length
  }, "\u56FE\u7247\u4E0A\u4F20\u6210\u529F");
});

const upload_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: upload_post
}, Symbol.toStringTag, { value: 'Module' }));

const DirectUploadSchema = z.object({
  filename: z.string().trim().min(1, "\u6587\u4EF6\u540D\u4E0D\u80FD\u4E3A\u7A7A").max(255),
  contentType: z.string().trim().min(1, "\u56FE\u7247\u7C7B\u578B\u4E0D\u80FD\u4E3A\u7A7A").max(100),
  size: z.number().int().positive("\u56FE\u7247\u4E0D\u80FD\u4E3A\u7A7A").max(MAX_ADMIN_IMAGE_SIZE, "\u5355\u5F20\u56FE\u7247\u4E0D\u80FD\u8D85\u8FC7 25 MB")
});
const sign_post = defineEventHandler(async (event) => {
  requireAdminUser(event);
  const data = await readValidated(event, DirectUploadSchema);
  const imageType = getValidatedImageType(data.filename, data.contentType);
  if (!imageType) {
    throw createError({ statusCode: 400, statusMessage: "\u4EC5\u652F\u6301 JPG\u3001PNG\u3001WebP\u3001GIF\u3001AVIF\u3001SVG \u56FE\u7247\uFF0C\u4E14\u6587\u4EF6\u6269\u5C55\u540D\u5FC5\u987B\u4E0E\u7C7B\u578B\u4E00\u81F4" });
  }
  const objectKey = createStorageObjectKey("admin", `${data.filename.slice(0, -imageType.ext.length)}${imageType.ext}`);
  const signature = await createDirectUploadSignature(objectKey, imageType.mimeType);
  if (!signature) {
    throw createError({ statusCode: 503, statusMessage: "\u5F53\u524D\u5B58\u50A8\u6A21\u5F0F\u4E0D\u652F\u6301\u6D4F\u89C8\u5668\u76F4\u4F20\uFF0C\u5DF2\u5207\u6362\u4E3A\u670D\u52A1\u7AEF\u4E0A\u4F20\u6A21\u5F0F" });
  }
  return successResponse({
    ...signature,
    method: "PUT",
    headers: { "Content-Type": imageType.mimeType },
    expiresAt: new Date(Date.now() + 5 * 60 * 1e3).toISOString()
  }, "\u5DF2\u751F\u6210 OSS \u76F4\u4F20\u7B7E\u540D");
});

const sign_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: sign_post
}, Symbol.toStringTag, { value: 'Module' }));

const databaseErDiagram_svg = defineEventHandler((event) => {
  const filePath = resolve(process.cwd(), "public/database-er-diagram.svg");
  if (!existsSync(filePath)) {
    throw createError({ statusCode: 404, statusMessage: "ER Diagram SVG Not Found" });
  }
  const svgContent = readFileSync(filePath, "utf-8");
  setHeader(event, "Content-Type", "image/svg+xml; charset=utf-8");
  setHeader(event, "Cache-Control", "public, max-age=3600");
  return svgContent;
});

const databaseErDiagram_svg$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: databaseErDiagram_svg
}, Symbol.toStringTag, { value: 'Module' }));

const feed_xml = defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const siteUrl = (config.public.siteUrl || "http://localhost:3000").replace(/\/$/, "");
  const siteName = config.public.siteName || "\u795E\u79D8\u82B1\u56ED";
  const siteDescription = config.public.siteDescription || "\u8BB0\u5F55\u601D\u8003\u3001\u63A2\u7D22\u6280\u672F\u3001\u6C89\u6DC0\u751F\u6D3B\u7684\u4E00\u65B9\u6570\u5B57\u82B1\u56ED";
  const articles = await prisma.article.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      createdAt: true,
      author: {
        select: { nickname: true }
      },
      category: {
        select: { name: true }
      }
    }
  });
  const itemsXml = articles.map((item) => {
    var _a, _b;
    const link = `${siteUrl}/articles/${item.slug}`;
    const pubDate = new Date(item.createdAt).toUTCString();
    const author = ((_a = item.author) == null ? void 0 : _a.nickname) || config.public.authorName || "lka";
    const category = ((_b = item.category) == null ? void 0 : _b.name) ? `<category><![CDATA[${item.category.name}]]></category>` : "";
    return `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${item.summary || ""}]]></description>
      <author><![CDATA[${author}]]></author>
      ${category}
      <pubDate>${pubDate}</pubDate>
    </item>`;
  }).join("");
  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${siteName}]]></title>
    <link>${siteUrl}</link>
    <description><![CDATA[${siteDescription}]]></description>
    <language>zh-CN</language>
    <lastBuildDate>${(/* @__PURE__ */ new Date()).toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;
  setHeader(event, "Content-Type", "application/xml; charset=utf-8");
  setHeader(event, "Cache-Control", "public, max-age=3600, s-maxage=3600");
  return rssFeed;
});

const feed_xml$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: feed_xml
}, Symbol.toStringTag, { value: 'Module' }));

const sitemap_xml = defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const siteUrl = (config.public.siteUrl || "http://localhost:3000").replace(/\/$/, "");
  const [articles, notes] = await Promise.all([
    prisma.article.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true, createdAt: true }
    }),
    prisma.note.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true, createdAt: true }
    })
  ]);
  const staticRoutes = [
    { url: "/", changefreq: "daily", priority: "1.0" },
    { url: "/articles", changefreq: "daily", priority: "0.9" },
    { url: "/essays", changefreq: "daily", priority: "0.8" },
    { url: "/notes", changefreq: "daily", priority: "0.8" },
    { url: "/archive", changefreq: "weekly", priority: "0.7" },
    { url: "/about", changefreq: "monthly", priority: "0.7" }
  ];
  const staticXml = staticRoutes.map((route) => `
  <url>
    <loc>${siteUrl}${route.url}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join("");
  const articleXml = articles.map((art) => `
  <url>
    <loc>${siteUrl}/articles/${art.slug}</loc>
    <lastmod>${new Date(art.updatedAt || art.createdAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join("");
  const noteXml = notes.map((note) => `
  <url>
    <loc>${siteUrl}/notes/${note.slug}</loc>
    <lastmod>${new Date(note.updatedAt || note.createdAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join("");
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticXml}
  ${articleXml}
  ${noteXml}
</urlset>`;
  setHeader(event, "Content-Type", "application/xml; charset=utf-8");
  setHeader(event, "Cache-Control", "public, max-age=3600, s-maxage=3600");
  return sitemapXml;
});

const sitemap_xml$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: sitemap_xml
}, Symbol.toStringTag, { value: 'Module' }));

function renderPayloadResponse(ssrContext) {
	return {
		body: encodeForwardSlashes(stringify(splitPayload(ssrContext).payload, ssrContext["~payloadReducers"])) ,
		statusCode: getResponseStatus(ssrContext.event),
		statusMessage: getResponseStatusText(ssrContext.event),
		headers: {
			"content-type": "application/json;charset=utf-8" ,
			"x-powered-by": "Nuxt"
		}
	};
}
function renderPayloadJsonScript(opts) {
	const contents = opts.data ? encodeForwardSlashes(stringify(opts.data, opts.ssrContext["~payloadReducers"])) : "";
	const payload = {
		"type": "application/json",
		"innerHTML": contents,
		"data-nuxt-data": appId,
		"data-ssr": !(opts.ssrContext.noSSR)
	};
	{
		payload.id = "__NUXT_DATA__";
	}
	if (opts.src) {
		payload["data-src"] = opts.src;
	}
	const config = uneval(opts.ssrContext.config);
	return [payload, { innerHTML: `window.__NUXT__={};window.__NUXT__.config=${config}` }];
}

function encodeForwardSlashes(str) {
	return str.replaceAll("/", "\\u002F");
}
function splitPayload(ssrContext) {
	const { data, prerenderedAt, ...initial } = ssrContext.payload;
	return {
		initial: {
			...initial,
			prerenderedAt
		},
		payload: {
			data,
			prerenderedAt
		}
	};
}

const renderSSRHeadOptions = {"omitLineBreaks":true};

// @ts-expect-error private property consumed by vite-generated url helpers
globalThis.__buildAssetsURL = buildAssetsURL;
// @ts-expect-error private property consumed by vite-generated url helpers
globalThis.__publicAssetsURL = publicAssetsURL;
const HAS_APP_TELEPORTS = !!(appTeleportAttrs.id);
const APP_TELEPORT_OPEN_TAG = HAS_APP_TELEPORTS ? `<${appTeleportTag}${propsToString(appTeleportAttrs)}>` : "";
const APP_TELEPORT_CLOSE_TAG = HAS_APP_TELEPORTS ? `</${appTeleportTag}>` : "";
const PAYLOAD_URL_RE = /^[^?]*\/_payload.json(?:\?.*)?$/ ;
const PAYLOAD_FILENAME = "_payload.json" ;
const PAYLOAD_BUILD_ID_PARAM = "_b";
const handler = defineRenderHandler((event) => {
	
	const ssrError = event.path.startsWith("/__nuxt_error") ? getQuery$1(event) : null;
	if (ssrError && !("__unenv__" in event.node.req)) {
		throw createError({
			status: 404,
			statusText: "Page Not Found: /__nuxt_error",
			message: "Page Not Found: /__nuxt_error"
		});
	}
	return renderRoute(event, ssrError);
});
async function renderRoute(event, ssrError) {
	const nitroApp = useNitroApp();
	
	const ssrContext = createSSRContext(event);
	
	const headEntryOptions = { mode: "server" };
	ssrContext.head.push(appHead, headEntryOptions);
	if (ssrError) {
		
		const status = ssrError.status || ssrError.statusCode;
		if (status) {
			
			ssrError.status = ssrError.statusCode = Number.parseInt(status);
		}
		if (typeof ssrError.data === "string") {
			try {
				ssrError.data = destr(ssrError.data);
			} catch {}
		}
		setSSRError(ssrContext, ssrError);
	}
	
	const routeOptions = getRouteRules(event);
	if (routeOptions.ssr === false) {
		ssrContext.noSSR = true;
	}
	
	const _PAYLOAD_EXTRACTION = !ssrContext.noSSR && ((routeOptions.isr || routeOptions.cache));
	const isRenderingPayload = (_PAYLOAD_EXTRACTION || routeOptions.prerender) && PAYLOAD_URL_RE.test(ssrContext.url);
	if (isRenderingPayload) {
		const payloadURL = new URL(ssrContext.url, "http://localhost");
		const url = payloadURL.pathname.slice(0, -`/${PAYLOAD_FILENAME}`.length) || "/";
		payloadURL.searchParams.delete(PAYLOAD_BUILD_ID_PARAM);
		ssrContext.url = url + payloadURL.search;
		event._path = event.node.req.url = ssrContext.url;
	}
	const payloadURL = _PAYLOAD_EXTRACTION ? buildPayloadURL(ssrContext) : undefined;
	
	const renderer = await getRenderer(ssrContext);
	const _rendered = await renderer.renderToString(ssrContext).catch(async (error) => {
		
		
		if ((ssrContext["~renderResponse"] || ssrContext._renderResponse) && error.message === "skipping render") {
			return {};
		}
		
		const _err = !ssrError && ssrContext.payload?.error || error;
		await ssrContext.nuxt?.hooks.callHook("app:error", _err);
		throw _err;
	});
	
	
	const inlinedStyles = [];
	await ssrContext.nuxt?.hooks.callHook("app:rendered", {
		ssrContext,
		renderResult: _rendered
	});
	if (ssrContext["~renderResponse"] || ssrContext._renderResponse) {
		
		return ssrContext["~renderResponse"] || ssrContext._renderResponse;
	}
	
	if (ssrContext.payload?.error && !ssrError) {
		throw ssrContext.payload.error;
	}
	
	if (isRenderingPayload) {
		const response = renderPayloadResponse(ssrContext);
		return response;
	}
	const NO_SCRIPTS = routeOptions.noScripts;
	
	const { styles, scripts } = getRequestDependencies(ssrContext, renderer.rendererContext);
	
	if (_PAYLOAD_EXTRACTION && !NO_SCRIPTS) {
		ssrContext.head.push({ link: [{
			rel: "preload",
			as: "fetch",
			crossorigin: "anonymous",
			href: payloadURL
		} ] }, headEntryOptions);
	}
	
	if (inlinedStyles.length) {
		ssrContext.head.push({ style: inlinedStyles });
	}
	const link = [];
	for (const resource of Object.values(styles)) {
		
		if ("inline" in getQuery(resource.file)) {
			continue;
		}
		
		
		
		link.push({
			rel: "stylesheet",
			href: renderer.rendererContext.buildAssetsURL(resource.file),
			crossorigin: ""
		});
	}
	if (link.length) {
		ssrContext.head.push({ link }, headEntryOptions);
	}
	if (!NO_SCRIPTS) {
		
		
		
		const dependencyOptions = ssrContext["~lazyHydratedModules"]?.size ? { exclude: ssrContext["~lazyHydratedModules"] } : undefined;
		const stylesheetHrefs = new Set(link.map((l) => l.href));
		ssrContext.head.push({ link: [...getPreloadLinks(ssrContext, renderer.rendererContext, dependencyOptions), ...getPrefetchLinks(ssrContext, renderer.rendererContext, dependencyOptions)].filter((l) => !stylesheetHrefs.has(l.href)) }, headEntryOptions);
		
		ssrContext.head.push({ script: _PAYLOAD_EXTRACTION ? renderPayloadJsonScript({
			ssrContext,
			data: splitPayload(ssrContext).initial,
			src: payloadURL
		})  : renderPayloadJsonScript({
			ssrContext,
			data: ssrContext.payload
		})  }, {
			...headEntryOptions,
			
			tagPosition: "bodyClose",
			tagPriority: "high"
		});
	}
	
	if (!routeOptions.noScripts) {
		const tagPosition = "head";
		ssrContext.head.push({ script: Object.values(scripts).map((resource) => ({
			type: resource.module ? "module" : null,
			src: renderer.rendererContext.buildAssetsURL(resource.file),
			defer: resource.module ? null : true,
			
			
			tagPosition,
			crossorigin: ""
		})) }, headEntryOptions);
	}
	const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = await renderSSRHead(ssrContext.head, renderSSRHeadOptions);
	
	const htmlContext = {
		htmlAttrs: htmlAttrs ? [htmlAttrs] : [],
		head: normalizeChunks([headTags]),
		bodyAttrs: bodyAttrs ? [bodyAttrs] : [],
		bodyPrepend: normalizeChunks([bodyTagsOpen, ssrContext.teleports?.body]),
		body: [replaceIslandTeleports(ssrContext, _rendered.html) , APP_TELEPORT_OPEN_TAG + (HAS_APP_TELEPORTS ? joinTags([ssrContext.teleports?.[`#${appTeleportAttrs.id}`]]) : "") + APP_TELEPORT_CLOSE_TAG],
		bodyAppend: [bodyTags]
	};
	
	await nitroApp.hooks.callHook("render:html", htmlContext, { event });
	
	return {
		body: renderHTMLDocument(htmlContext),
		statusCode: getResponseStatus(event),
		statusMessage: getResponseStatusText(event),
		headers: {
			"content-type": "text/html;charset=utf-8",
			"x-powered-by": "Nuxt"
		}
	};
}
function buildPayloadURL(ssrContext) {
	const url = new URL(ssrContext.url, "http://localhost");
	const baseURL = ssrContext.runtimeConfig.app.cdnURL || ssrContext.runtimeConfig.app.baseURL;
	const payloadURL = joinURL(baseURL, url.pathname, PAYLOAD_FILENAME);
	url.searchParams.set(PAYLOAD_BUILD_ID_PARAM, ssrContext.runtimeConfig.app.buildId);
	return payloadURL + url.search;
}
function normalizeChunks(chunks) {
	const result = [];
	for (const _chunk of chunks) {
		const chunk = _chunk?.trim();
		if (chunk) {
			result.push(chunk);
		}
	}
	return result;
}
function joinTags(tags) {
	return tags.join("");
}
function joinAttrs(chunks) {
	if (chunks.length === 0) {
		return "";
	}
	return " " + chunks.join(" ");
}
function renderHTMLDocument(html) {
	return "<!DOCTYPE html>" + `<html${joinAttrs(html.htmlAttrs)}>` + `<head>${joinTags(html.head)}</head>` + `<body${joinAttrs(html.bodyAttrs)}>${joinTags(html.bodyPrepend)}${joinTags(html.body)}${joinTags(html.bodyAppend)}</body>` + "</html>";
}

const renderer = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: handler
}, Symbol.toStringTag, { value: 'Module' }));
//# sourceMappingURL=index.mjs.map
