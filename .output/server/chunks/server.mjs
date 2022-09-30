import { computed, defineComponent, inject, provide, h, Suspense, Transition, reactive, isRef, getCurrentInstance, toRef, ref, resolveComponent, watchEffect, markRaw, mergeProps, useSSRContext, withCtx, createVNode, shallowRef, createApp, defineAsyncComponent, onErrorCaptured, unref, openBlock, createBlock, Fragment as Fragment$1, renderList } from 'vue';
import { $fetch } from 'ohmyfetch';
import { joinURL, hasProtocol, isEqual, parseURL } from 'ufo';
import { createHooks } from 'hookable';
import { getContext, executeAsync } from 'unctx';
import { RouterView, createMemoryHistory, createRouter } from 'vue-router';
import { createError as createError$1, sendRedirect } from 'h3';
import defu, { defuFn } from 'defu';
import { isFunction } from '@vue/shared';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSuspense, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderSlot, ssrRenderAttr } from 'vue/server-renderer';
import firebase from 'firebase/compat';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
import firebase$1 from '@firebase/app-compat';
import { a as useRuntimeConfig$1 } from './node-server.mjs';
import 'node-fetch-native/polyfill';
import 'http';
import 'https';
import 'destr';
import 'radix3';
import 'unenv/runtime/fetch/index';
import 'scule';
import 'ohash';
import 'unstorage';
import 'fs';
import 'pathe';
import 'url';

const appConfig = useRuntimeConfig$1().app;
const baseURL = () => appConfig.baseURL;
const buildAssetsDir = () => appConfig.buildAssetsDir;
const buildAssetsURL = (...path) => joinURL(publicAssetsURL(), buildAssetsDir(), ...path);
const publicAssetsURL = (...path) => {
  const publicBase = appConfig.cdnURL || appConfig.baseURL;
  return path.length ? joinURL(publicBase, ...path) : publicBase;
};
globalThis.__buildAssetsURL = buildAssetsURL;
globalThis.__publicAssetsURL = publicAssetsURL;
const nuxtAppCtx = getContext("nuxt-app");
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  const nuxtApp = {
    provide: void 0,
    globalName: "nuxt",
    payload: reactive({
      data: {},
      state: {},
      _errors: {},
      ...{ serverRendered: true }
    }),
    isHydrating: false,
    _asyncDataPromises: {},
    _asyncData: {},
    ...options
  };
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  {
    if (nuxtApp.ssrContext) {
      nuxtApp.ssrContext.nuxt = nuxtApp;
    }
    nuxtApp.ssrContext = nuxtApp.ssrContext || {};
    if (nuxtApp.ssrContext.payload) {
      Object.assign(nuxtApp.payload, nuxtApp.ssrContext.payload);
    }
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.payload.config = {
      public: options.ssrContext.runtimeConfig.public,
      app: options.ssrContext.runtimeConfig.app
    };
  }
  const runtimeConfig = options.ssrContext.runtimeConfig;
  const compatibilityConfig = new Proxy(runtimeConfig, {
    get(target, prop) {
      var _a;
      if (prop === "public") {
        return target.public;
      }
      return (_a = target[prop]) != null ? _a : target.public[prop];
    },
    set(target, prop, value) {
      {
        return false;
      }
    }
  });
  nuxtApp.provide("config", compatibilityConfig);
  return nuxtApp;
}
async function applyPlugin(nuxtApp, plugin) {
  if (typeof plugin !== "function") {
    return;
  }
  const { provide: provide2 } = await callWithNuxt(nuxtApp, plugin, [nuxtApp]) || {};
  if (provide2 && typeof provide2 === "object") {
    for (const key in provide2) {
      nuxtApp.provide(key, provide2[key]);
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  for (const plugin of plugins2) {
    await applyPlugin(nuxtApp, plugin);
  }
}
function normalizePlugins(_plugins2) {
  const plugins2 = _plugins2.map((plugin) => {
    if (typeof plugin !== "function") {
      return null;
    }
    if (plugin.length > 1) {
      return (nuxtApp) => plugin(nuxtApp, nuxtApp.provide);
    }
    return plugin;
  }).filter(Boolean);
  return plugins2;
}
function defineNuxtPlugin(plugin) {
  plugin[NuxtPluginIndicator] = true;
  return plugin;
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => args ? setup(...args) : setup();
  {
    return nuxtAppCtx.callAsync(nuxt, fn);
  }
}
function useNuxtApp() {
  const nuxtAppInstance = nuxtAppCtx.tryUse();
  if (!nuxtAppInstance) {
    const vm = getCurrentInstance();
    if (!vm) {
      throw new Error("nuxt instance unavailable");
    }
    return vm.appContext.app.$nuxt;
  }
  return nuxtAppInstance;
}
function useRuntimeConfig() {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = "$s" + _key;
  const nuxt = useNuxtApp();
  const state = toRef(nuxt.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxt.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (_err) => {
  const err = createError(_err);
  try {
    const nuxtApp = useNuxtApp();
    nuxtApp.callHook("app:error", err);
    const error = useError();
    error.value = error.value || err;
  } catch {
    throw err;
  }
  return err;
};
const createError = (err) => {
  const _err = createError$1(err);
  _err.__nuxt_error = true;
  return _err;
};
const useRouter = () => {
  var _a;
  return (_a = useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute = () => {
  if (getCurrentInstance()) {
    return inject("_route", useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
const navigateTo = (to, options) => {
  if (!to) {
    to = "/";
  }
  const toPath = typeof to === "string" ? to : to.path || "/";
  const isExternal = hasProtocol(toPath, true);
  if (isExternal && !(options == null ? void 0 : options.external)) {
    throw new Error("Navigating to external URL is not allowed by default. Use `nagivateTo (url, { external: true })`.");
  }
  if (isExternal && parseURL(toPath).protocol === "script:") {
    throw new Error("Cannot navigate to an URL with script protocol.");
  }
  const router = useRouter();
  {
    const nuxtApp = useNuxtApp();
    if (nuxtApp.ssrContext && nuxtApp.ssrContext.event) {
      const redirectLocation = isExternal ? toPath : joinURL(useRuntimeConfig().app.baseURL, router.resolve(to).fullPath || "/");
      return nuxtApp.callHook("app:redirected").then(() => sendRedirect(nuxtApp.ssrContext.event, redirectLocation, (options == null ? void 0 : options.redirectCode) || 302));
    }
  }
  if (isExternal) {
    if (options == null ? void 0 : options.replace) {
      location.replace(toPath);
    } else {
      location.href = toPath;
    }
    return Promise.resolve();
  }
  return (options == null ? void 0 : options.replace) ? router.replace(to) : router.push(to);
};
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
const DEFAULT_EXTERNAL_REL_ATTRIBUTE = "noopener noreferrer";
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  return defineComponent({
    name: componentName,
    props: {
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      }
    },
    setup(props, { slots }) {
      const router = useRouter();
      const to = computed(() => {
        return props.to || props.href || "";
      });
      const isExternal = computed(() => {
        if (props.external) {
          return true;
        }
        if (props.target && props.target !== "_self") {
          return true;
        }
        if (typeof to.value === "object") {
          return false;
        }
        return to.value === "" || hasProtocol(to.value, true);
      });
      const prefetched = ref(false);
      return () => {
        var _a, _b, _c;
        if (!isExternal.value) {
          return h(
            resolveComponent("RouterLink"),
            {
              ref: void 0,
              to: to.value,
              ...prefetched.value && !props.custom ? { class: props.prefetchedClass || options.prefetchedClass } : {},
              activeClass: props.activeClass || options.activeClass,
              exactActiveClass: props.exactActiveClass || options.exactActiveClass,
              replace: props.replace,
              ariaCurrentValue: props.ariaCurrentValue,
              custom: props.custom
            },
            slots.default
          );
        }
        const href = typeof to.value === "object" ? (_b = (_a = router.resolve(to.value)) == null ? void 0 : _a.href) != null ? _b : null : to.value || null;
        const target = props.target || null;
        const rel = props.noRel ? null : firstNonUndefined(props.rel, options.externalRelAttribute, href ? DEFAULT_EXTERNAL_REL_ATTRIBUTE : "") || null;
        const navigate = () => navigateTo(href, { replace: props.replace });
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href,
            navigate,
            route: router.resolve(href),
            rel,
            target,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", { href, rel, target }, (_c = slots.default) == null ? void 0 : _c.call(slots));
      };
    }
  });
}
const __nuxt_component_0$4 = defineNuxtLink({ componentName: "NuxtLink" });
const inlineConfig = {};
defuFn(inlineConfig);
function useHead(meta2) {
  const resolvedMeta = isFunction(meta2) ? computed(meta2) : meta2;
  useNuxtApp()._useHead(resolvedMeta);
}
const components = {};
const _nuxt_components_plugin_mjs_KR1HBZs4kY = defineNuxtPlugin((nuxtApp) => {
  for (const name in components) {
    nuxtApp.vueApp.component(name, components[name]);
    nuxtApp.vueApp.component("Lazy" + name, components[name]);
  }
});
var PROVIDE_KEY = `usehead`;
var HEAD_COUNT_KEY = `head:count`;
var HEAD_ATTRS_KEY = `data-head-attrs`;
var SELF_CLOSING_TAGS = ["meta", "link", "base"];
var BODY_TAG_ATTR_NAME = `data-meta-body`;
var createElement = (tag, attrs, document) => {
  const el = document.createElement(tag);
  for (const key of Object.keys(attrs)) {
    if (key === "body" && attrs.body === true) {
      el.setAttribute(BODY_TAG_ATTR_NAME, "true");
    } else {
      let value = attrs[key];
      if (key === "renderPriority" || key === "key" || value === false) {
        continue;
      }
      if (key === "children") {
        el.textContent = value;
      } else {
        el.setAttribute(key, value);
      }
    }
  }
  return el;
};
var htmlEscape = (str) => str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
var stringifyAttrs = (attributes) => {
  const handledAttributes = [];
  for (let [key, value] of Object.entries(attributes)) {
    if (key === "children" || key === "key") {
      continue;
    }
    if (value === false || value == null) {
      continue;
    }
    let attribute = htmlEscape(key);
    if (value !== true) {
      attribute += `="${htmlEscape(String(value))}"`;
    }
    handledAttributes.push(attribute);
  }
  return handledAttributes.length > 0 ? " " + handledAttributes.join(" ") : "";
};
function isEqualNode(oldTag, newTag) {
  if (oldTag instanceof HTMLElement && newTag instanceof HTMLElement) {
    const nonce = newTag.getAttribute("nonce");
    if (nonce && !oldTag.getAttribute("nonce")) {
      const cloneTag = newTag.cloneNode(true);
      cloneTag.setAttribute("nonce", "");
      cloneTag.nonce = nonce;
      return nonce === oldTag.nonce && oldTag.isEqualNode(cloneTag);
    }
  }
  return oldTag.isEqualNode(newTag);
}
var getTagDeduper = (tag) => {
  if (!["meta", "base", "script", "link"].includes(tag.tag)) {
    return false;
  }
  const { props, tag: tagName } = tag;
  if (tagName === "base") {
    return true;
  }
  if (tagName === "link" && props.rel === "canonical") {
    return { propValue: "canonical" };
  }
  if (props.charset) {
    return { propKey: "charset" };
  }
  const name = ["key", "id", "name", "property", "http-equiv"];
  for (const n of name) {
    let value = void 0;
    if (typeof props.getAttribute === "function" && props.hasAttribute(n)) {
      value = props.getAttribute(n);
    } else {
      value = props[n];
    }
    if (value !== void 0) {
      return { propValue: n };
    }
  }
  return false;
};
var acceptFields = [
  "title",
  "meta",
  "link",
  "base",
  "style",
  "script",
  "noscript",
  "htmlAttrs",
  "bodyAttrs"
];
var renderTemplate = (template, title) => {
  if (template == null)
    return "";
  if (typeof template === "string") {
    return template.replace("%s", title != null ? title : "");
  }
  return template(unref(title));
};
var headObjToTags = (obj) => {
  const tags = [];
  const keys = Object.keys(obj);
  for (const key of keys) {
    if (obj[key] == null)
      continue;
    switch (key) {
      case "title":
        tags.push({ tag: key, props: { children: obj[key] } });
        break;
      case "titleTemplate":
        break;
      case "base":
        tags.push({ tag: key, props: { key: "default", ...obj[key] } });
        break;
      default:
        if (acceptFields.includes(key)) {
          const value = obj[key];
          if (Array.isArray(value)) {
            value.forEach((item) => {
              tags.push({ tag: key, props: unref(item) });
            });
          } else if (value) {
            tags.push({ tag: key, props: value });
          }
        }
        break;
    }
  }
  return tags;
};
var setAttrs = (el, attrs) => {
  const existingAttrs = el.getAttribute(HEAD_ATTRS_KEY);
  if (existingAttrs) {
    for (const key of existingAttrs.split(",")) {
      if (!(key in attrs)) {
        el.removeAttribute(key);
      }
    }
  }
  const keys = [];
  for (const key in attrs) {
    const value = attrs[key];
    if (value == null)
      continue;
    if (value === false) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
    keys.push(key);
  }
  if (keys.length) {
    el.setAttribute(HEAD_ATTRS_KEY, keys.join(","));
  } else {
    el.removeAttribute(HEAD_ATTRS_KEY);
  }
};
var updateElements = (document = window.document, type, tags) => {
  var _a, _b;
  const head = document.head;
  const body = document.body;
  let headCountEl = head.querySelector(`meta[name="${HEAD_COUNT_KEY}"]`);
  let bodyMetaElements = body.querySelectorAll(`[${BODY_TAG_ATTR_NAME}]`);
  const headCount = headCountEl ? Number(headCountEl.getAttribute("content")) : 0;
  const oldHeadElements = [];
  const oldBodyElements = [];
  if (bodyMetaElements) {
    for (let i = 0; i < bodyMetaElements.length; i++) {
      if (bodyMetaElements[i] && ((_a = bodyMetaElements[i].tagName) == null ? void 0 : _a.toLowerCase()) === type) {
        oldBodyElements.push(bodyMetaElements[i]);
      }
    }
  }
  if (headCountEl) {
    for (let i = 0, j = headCountEl.previousElementSibling; i < headCount; i++, j = (j == null ? void 0 : j.previousElementSibling) || null) {
      if (((_b = j == null ? void 0 : j.tagName) == null ? void 0 : _b.toLowerCase()) === type) {
        oldHeadElements.push(j);
      }
    }
  } else {
    headCountEl = document.createElement("meta");
    headCountEl.setAttribute("name", HEAD_COUNT_KEY);
    headCountEl.setAttribute("content", "0");
    head.append(headCountEl);
  }
  let newElements = tags.map((tag) => {
    var _a2;
    return {
      element: createElement(tag.tag, tag.props, document),
      body: (_a2 = tag.props.body) != null ? _a2 : false
    };
  });
  newElements = newElements.filter((newEl) => {
    for (let i = 0; i < oldHeadElements.length; i++) {
      const oldEl = oldHeadElements[i];
      if (isEqualNode(oldEl, newEl.element)) {
        oldHeadElements.splice(i, 1);
        return false;
      }
    }
    for (let i = 0; i < oldBodyElements.length; i++) {
      const oldEl = oldBodyElements[i];
      if (isEqualNode(oldEl, newEl.element)) {
        oldBodyElements.splice(i, 1);
        return false;
      }
    }
    return true;
  });
  oldBodyElements.forEach((t) => {
    var _a2;
    return (_a2 = t.parentNode) == null ? void 0 : _a2.removeChild(t);
  });
  oldHeadElements.forEach((t) => {
    var _a2;
    return (_a2 = t.parentNode) == null ? void 0 : _a2.removeChild(t);
  });
  newElements.forEach((t) => {
    if (t.body === true) {
      body.insertAdjacentElement("beforeend", t.element);
    } else {
      head.insertBefore(t.element, headCountEl);
    }
  });
  headCountEl.setAttribute(
    "content",
    "" + (headCount - oldHeadElements.length + newElements.filter((t) => !t.body).length)
  );
};
var createHead = (initHeadObject) => {
  let allHeadObjs = [];
  let previousTags = /* @__PURE__ */ new Set();
  if (initHeadObject) {
    allHeadObjs.push(shallowRef(initHeadObject));
  }
  const head = {
    install(app) {
      app.config.globalProperties.$head = head;
      app.provide(PROVIDE_KEY, head);
    },
    get headTags() {
      const deduped = [];
      const titleTemplate = allHeadObjs.map((i) => unref(i).titleTemplate).reverse().find((i) => i != null);
      allHeadObjs.forEach((objs) => {
        const tags = headObjToTags(unref(objs));
        tags.forEach((tag) => {
          const dedupe = getTagDeduper(tag);
          if (dedupe) {
            let index = -1;
            for (let i = 0; i < deduped.length; i++) {
              const prev = deduped[i];
              if (prev.tag !== tag.tag) {
                continue;
              }
              if (dedupe === true) {
                index = i;
              } else if (dedupe.propValue && unref(prev.props[dedupe.propValue]) === unref(tag.props[dedupe.propValue])) {
                index = i;
              } else if (dedupe.propKey && prev.props[dedupe.propKey] && tag.props[dedupe.propKey]) {
                index = i;
              }
              if (index !== -1) {
                break;
              }
            }
            if (index !== -1) {
              deduped.splice(index, 1);
            }
          }
          if (titleTemplate && tag.tag === "title") {
            tag.props.children = renderTemplate(
              titleTemplate,
              tag.props.children
            );
          }
          deduped.push(tag);
        });
      });
      return deduped;
    },
    addHeadObjs(objs) {
      allHeadObjs.push(objs);
    },
    removeHeadObjs(objs) {
      allHeadObjs = allHeadObjs.filter((_objs) => _objs !== objs);
    },
    updateDOM(document = window.document) {
      let title;
      let htmlAttrs = {};
      let bodyAttrs = {};
      const actualTags = {};
      for (const tag of head.headTags.sort(sortTags)) {
        if (tag.tag === "title") {
          title = tag.props.children;
          continue;
        }
        if (tag.tag === "htmlAttrs") {
          Object.assign(htmlAttrs, tag.props);
          continue;
        }
        if (tag.tag === "bodyAttrs") {
          Object.assign(bodyAttrs, tag.props);
          continue;
        }
        actualTags[tag.tag] = actualTags[tag.tag] || [];
        actualTags[tag.tag].push(tag);
      }
      if (title !== void 0) {
        document.title = title;
      }
      setAttrs(document.documentElement, htmlAttrs);
      setAttrs(document.body, bodyAttrs);
      const tags = /* @__PURE__ */ new Set([...Object.keys(actualTags), ...previousTags]);
      for (const tag of tags) {
        updateElements(document, tag, actualTags[tag] || []);
      }
      previousTags.clear();
      Object.keys(actualTags).forEach((i) => previousTags.add(i));
    }
  };
  return head;
};
var tagToString = (tag) => {
  let isBodyTag = false;
  if (tag.props.body) {
    isBodyTag = true;
    delete tag.props.body;
  }
  if (tag.props.renderPriority) {
    delete tag.props.renderPriority;
  }
  let attrs = stringifyAttrs(tag.props);
  if (SELF_CLOSING_TAGS.includes(tag.tag)) {
    return `<${tag.tag}${attrs}${isBodyTag ? `  ${BODY_TAG_ATTR_NAME}="true"` : ""}>`;
  }
  return `<${tag.tag}${attrs}${isBodyTag ? ` ${BODY_TAG_ATTR_NAME}="true"` : ""}>${tag.props.children || ""}</${tag.tag}>`;
};
var sortTags = (aTag, bTag) => {
  const tagWeight = (tag) => {
    if (tag.props.renderPriority) {
      return tag.props.renderPriority;
    }
    switch (tag.tag) {
      case "base":
        return -1;
      case "meta":
        if (tag.props.charset) {
          return -2;
        }
        if (tag.props["http-equiv"] === "content-security-policy") {
          return 0;
        }
        return 10;
      default:
        return 10;
    }
  };
  return tagWeight(aTag) - tagWeight(bTag);
};
var renderHeadToString = (head) => {
  const tags = [];
  let titleTag = "";
  let htmlAttrs = {};
  let bodyAttrs = {};
  let bodyTags = [];
  for (const tag of head.headTags.sort(sortTags)) {
    if (tag.tag === "title") {
      titleTag = tagToString(tag);
    } else if (tag.tag === "htmlAttrs") {
      Object.assign(htmlAttrs, tag.props);
    } else if (tag.tag === "bodyAttrs") {
      Object.assign(bodyAttrs, tag.props);
    } else if (tag.props.body) {
      bodyTags.push(tagToString(tag));
    } else {
      tags.push(tagToString(tag));
    }
  }
  tags.push(`<meta name="${HEAD_COUNT_KEY}" content="${tags.length}">`);
  return {
    get headTags() {
      return titleTag + tags.join("");
    },
    get htmlAttrs() {
      return stringifyAttrs({
        ...htmlAttrs,
        [HEAD_ATTRS_KEY]: Object.keys(htmlAttrs).join(",")
      });
    },
    get bodyAttrs() {
      return stringifyAttrs({
        ...bodyAttrs,
        [HEAD_ATTRS_KEY]: Object.keys(bodyAttrs).join(",")
      });
    },
    get bodyTags() {
      return bodyTags.join("");
    }
  };
};
const node_modules_nuxt_dist_head_runtime_lib_vueuse_head_plugin_mjs_D7WGfuP1A0 = defineNuxtPlugin((nuxtApp) => {
  const head = createHead();
  nuxtApp.vueApp.use(head);
  nuxtApp.hooks.hookOnce("app:mounted", () => {
    watchEffect(() => {
      head.updateDOM();
    });
  });
  nuxtApp._useHead = (_meta) => {
    const meta2 = ref(_meta);
    const headObj = computed(() => {
      const overrides = { meta: [] };
      if (meta2.value.charset) {
        overrides.meta.push({ key: "charset", charset: meta2.value.charset });
      }
      if (meta2.value.viewport) {
        overrides.meta.push({ name: "viewport", content: meta2.value.viewport });
      }
      return defu(overrides, meta2.value);
    });
    head.addHeadObjs(headObj);
    {
      return;
    }
  };
  {
    nuxtApp.ssrContext.renderMeta = () => {
      const meta2 = renderHeadToString(head);
      return {
        ...meta2,
        bodyScripts: meta2.bodyTags
      };
    };
  }
});
const removeUndefinedProps = (props) => Object.fromEntries(Object.entries(props).filter(([, value]) => value !== void 0));
const setupForUseMeta = (metaFactory, renderChild) => (props, ctx) => {
  useHead(() => metaFactory({ ...removeUndefinedProps(props), ...ctx.attrs }, ctx));
  return () => {
    var _a, _b;
    return renderChild ? (_b = (_a = ctx.slots).default) == null ? void 0 : _b.call(_a) : null;
  };
};
const globalProps = {
  accesskey: String,
  autocapitalize: String,
  autofocus: {
    type: Boolean,
    default: void 0
  },
  class: String,
  contenteditable: {
    type: Boolean,
    default: void 0
  },
  contextmenu: String,
  dir: String,
  draggable: {
    type: Boolean,
    default: void 0
  },
  enterkeyhint: String,
  exportparts: String,
  hidden: {
    type: Boolean,
    default: void 0
  },
  id: String,
  inputmode: String,
  is: String,
  itemid: String,
  itemprop: String,
  itemref: String,
  itemscope: String,
  itemtype: String,
  lang: String,
  nonce: String,
  part: String,
  slot: String,
  spellcheck: {
    type: Boolean,
    default: void 0
  },
  style: String,
  tabindex: String,
  title: String,
  translate: String
};
const Script = defineComponent({
  name: "Script",
  inheritAttrs: false,
  props: {
    ...globalProps,
    async: Boolean,
    crossorigin: {
      type: [Boolean, String],
      default: void 0
    },
    defer: Boolean,
    fetchpriority: String,
    integrity: String,
    nomodule: Boolean,
    nonce: String,
    referrerpolicy: String,
    src: String,
    type: String,
    charset: String,
    language: String
  },
  setup: setupForUseMeta((script) => ({
    script: [script]
  }))
});
const NoScript = defineComponent({
  name: "NoScript",
  inheritAttrs: false,
  props: {
    ...globalProps,
    title: String
  },
  setup: setupForUseMeta((props, { slots }) => {
    var _a;
    const noscript = { ...props };
    const textContent = (((_a = slots.default) == null ? void 0 : _a.call(slots)) || []).filter(({ children }) => children).map(({ children }) => children).join("");
    if (textContent) {
      noscript.children = textContent;
    }
    return {
      noscript: [noscript]
    };
  })
});
const Link = defineComponent({
  name: "Link",
  inheritAttrs: false,
  props: {
    ...globalProps,
    as: String,
    crossorigin: String,
    disabled: Boolean,
    fetchpriority: String,
    href: String,
    hreflang: String,
    imagesizes: String,
    imagesrcset: String,
    integrity: String,
    media: String,
    prefetch: {
      type: Boolean,
      default: void 0
    },
    referrerpolicy: String,
    rel: String,
    sizes: String,
    title: String,
    type: String,
    methods: String,
    target: String
  },
  setup: setupForUseMeta((link) => ({
    link: [link]
  }))
});
const Base = defineComponent({
  name: "Base",
  inheritAttrs: false,
  props: {
    ...globalProps,
    href: String,
    target: String
  },
  setup: setupForUseMeta((base) => ({
    base
  }))
});
const Title = defineComponent({
  name: "Title",
  inheritAttrs: false,
  setup: setupForUseMeta((_, { slots }) => {
    var _a, _b, _c;
    const title = ((_c = (_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) == null ? void 0 : _b[0]) == null ? void 0 : _c.children) || null;
    return {
      title
    };
  })
});
const Meta = defineComponent({
  name: "Meta",
  inheritAttrs: false,
  props: {
    ...globalProps,
    charset: String,
    content: String,
    httpEquiv: String,
    name: String
  },
  setup: setupForUseMeta((props) => {
    const meta2 = { ...props };
    if (meta2.httpEquiv) {
      meta2["http-equiv"] = meta2.httpEquiv;
      delete meta2.httpEquiv;
    }
    return {
      meta: [meta2]
    };
  })
});
const Style = defineComponent({
  name: "Style",
  inheritAttrs: false,
  props: {
    ...globalProps,
    type: String,
    media: String,
    nonce: String,
    title: String,
    scoped: {
      type: Boolean,
      default: void 0
    }
  },
  setup: setupForUseMeta((props, { slots }) => {
    var _a, _b, _c;
    const style = { ...props };
    const textContent = (_c = (_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) == null ? void 0 : _b[0]) == null ? void 0 : _c.children;
    if (textContent) {
      style.children = textContent;
    }
    return {
      style: [style]
    };
  })
});
const Head = defineComponent({
  name: "Head",
  inheritAttrs: false,
  setup: (_props, ctx) => () => {
    var _a, _b;
    return (_b = (_a = ctx.slots).default) == null ? void 0 : _b.call(_a);
  }
});
const Html = defineComponent({
  name: "Html",
  inheritAttrs: false,
  props: {
    ...globalProps,
    manifest: String,
    version: String,
    xmlns: String
  },
  setup: setupForUseMeta((htmlAttrs) => ({ htmlAttrs }), true)
});
const Body = defineComponent({
  name: "Body",
  inheritAttrs: false,
  props: globalProps,
  setup: setupForUseMeta((bodyAttrs) => ({ bodyAttrs }), true)
});
const Components = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Script,
  NoScript,
  Link,
  Base,
  Title,
  Meta,
  Style,
  Head,
  Html,
  Body
}, Symbol.toStringTag, { value: "Module" }));
const appHead = { "meta": [], "link": [{ "rel": "stylesheet", "href": "https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" }], "style": [], "script": [], "noscript": [], "charset": "utf-8", "viewport": "width=device-width, initial-scale=1" };
const appLayoutTransition = { "name": "layout", "mode": "out-in" };
const appPageTransition = { "name": "page", "mode": "out-in" };
const appKeepalive = false;
const metaMixin = {
  created() {
    const instance = getCurrentInstance();
    if (!instance) {
      return;
    }
    const options = instance.type;
    if (!options || !("head" in options)) {
      return;
    }
    const nuxtApp = useNuxtApp();
    const source = typeof options.head === "function" ? computed(() => options.head(nuxtApp)) : options.head;
    useHead(source);
  }
};
const node_modules_nuxt_dist_head_runtime_plugin_mjs_1QO0gqa6n2 = defineNuxtPlugin((nuxtApp) => {
  useHead(markRaw({ title: "", ...appHead }));
  nuxtApp.vueApp.mixin(metaMixin);
  for (const name in Components) {
    nuxtApp.vueApp.component(name, Components[name]);
  }
});
const interpolatePath = (route, match) => {
  return match.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
};
const generateRouteKey = (override, routeProps) => {
  var _a;
  const matchedRoute = routeProps.route.matched.find((m) => {
    var _a2;
    return ((_a2 = m.components) == null ? void 0 : _a2.default) === routeProps.Component.type;
  });
  const source = (_a = override != null ? override : matchedRoute == null ? void 0 : matchedRoute.meta.key) != null ? _a : matchedRoute && interpolatePath(routeProps.route, matchedRoute);
  return typeof source === "function" ? source(routeProps.route) : source;
};
const wrapInKeepAlive = (props, children) => {
  return { default: () => children };
};
const Fragment = defineComponent({
  setup(_props, { slots }) {
    return () => {
      var _a;
      return (_a = slots.default) == null ? void 0 : _a.call(slots);
    };
  }
});
const _wrapIf = (component, props, slots) => {
  return { default: () => props ? h(component, props === true ? {} : props, slots) : h(Fragment, {}, slots) };
};
const isNestedKey = Symbol("isNested");
const NuxtPage = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs }) {
    const nuxtApp = useNuxtApp();
    const isNested = inject(isNestedKey, false);
    provide(isNestedKey, true);
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          var _a, _b, _c, _d;
          if (!routeProps.Component) {
            return;
          }
          const key = generateRouteKey(props.pageKey, routeProps);
          const transitionProps = (_b = (_a = props.transition) != null ? _a : routeProps.route.meta.pageTransition) != null ? _b : appPageTransition;
          return _wrapIf(
            Transition,
            transitionProps,
            wrapInKeepAlive(
              (_d = (_c = props.keepalive) != null ? _c : routeProps.route.meta.keepalive) != null ? _d : appKeepalive,
              isNested && nuxtApp.isHydrating ? h(Component, { key, routeProps, pageKey: key, hasTransition: !!transitionProps }) : h(Suspense, {
                onPending: () => nuxtApp.callHook("page:start", routeProps.Component),
                onResolve: () => nuxtApp.callHook("page:finish", routeProps.Component)
              }, { default: () => h(Component, { key, routeProps, pageKey: key, hasTransition: !!transitionProps }) })
            )
          ).default();
        }
      });
    };
  }
});
const Component = defineComponent({
  props: ["routeProps", "pageKey", "hasTransition"],
  setup(props) {
    const previousKey = props.pageKey;
    const previousRoute = props.routeProps.route;
    const route = {};
    for (const key in props.routeProps.route) {
      route[key] = computed(() => previousKey === props.pageKey ? props.routeProps.route[key] : previousRoute[key]);
    }
    provide("_route", reactive(route));
    return () => {
      return h(props.routeProps.Component);
    };
  }
});
const meta$5 = void 0;
const meta$4 = void 0;
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$7 = {};
function _sfc_ssrRender$6(_ctx, _push, _parent, _attrs) {
  _push(`<nav${ssrRenderAttrs(mergeProps({ class: "navbar navbar-expand-lg bg-light jutsu-navbar" }, _attrs))} data-v-f2c8b824><div class="container-fluid" data-v-f2c8b824><a class="navbar-brand menu-color" href="#" data-v-f2c8b824>Jutsu adminisztr\xE1ci\xF3</a><button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation" data-v-f2c8b824><span class="navbar-toggler-icon" data-v-f2c8b824></span></button><div class="collapse navbar-collapse" id="navbarNavDropdown" data-v-f2c8b824><ul class="navbar-nav" data-v-f2c8b824><li class="nav-item" data-v-f2c8b824><a class="nav-link active menu-color" aria-current="page" href="/admin/jutsu/styles" data-v-f2c8b824>Jutsu St\xEDlusok</a></li><li class="nav-item" data-v-f2c8b824><a class="nav-link active menu-color" aria-current="page" href="/admin/jutsu/comments" data-v-f2c8b824>Megjegyz\xE9s t\xEDpusok</a></li><li class="nav-item" data-v-f2c8b824><a class="nav-link active menu-color" aria-current="page" href="/admin/users" data-v-f2c8b824>Felhaszn\xE1l\xF3k</a></li><li class="nav-item" data-v-f2c8b824><a class="nav-link active menu-color" aria-current="page" href="/jutsu/list" data-v-f2c8b824>Jutsu lista</a></li></ul></div></div><div data-v-f2c8b824><a class="mb-lg-auto nav-link active hover-pointer logout-color" data-v-f2c8b824>Kijelentkez\xE9s</a></div></nav>`);
}
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/JutsuNav.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __nuxt_component_0$3 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["ssrRender", _sfc_ssrRender$6], ["__scopeId", "data-v-f2c8b824"]]);
const meta$3 = void 0;
const meta$2 = void 0;
const useGundanUser = () => useState("firebaseUser", () => ({}));
const meta$1 = void 0;
class Jutsu {
}
const _sfc_main$6 = {
  name: "JutsuHeader",
  props: {
    jutsu: Jutsu
  }
};
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "header-container" }, _attrs))} data-v-9244a5a6><div style="${ssrRenderStyle({
    border: `1px solid ${$props.jutsu.type.secondaryColor}`,
    "box-shadow": `0 0 3px ${$props.jutsu.type.secondaryColor}`,
    background: `radial-gradient(${$props.jutsu.type.secondaryColor}, ${$props.jutsu.type.primaryColor})`
  })}" class="kanji-container" data-v-9244a5a6>${ssrInterpolate($props.jutsu.kanji)}</div><div class="name-container" data-v-9244a5a6><div class="japanese-name jutsu-name" data-v-9244a5a6>${ssrInterpolate($props.jutsu.jpName)}</div><div class="divider" data-v-9244a5a6></div><div class="hungarian-name jutsu-name" data-v-9244a5a6>${ssrInterpolate($props.jutsu.huName)}</div></div></div>`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/jutsu/jutsu-header.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender$5], ["__scopeId", "data-v-9244a5a6"]]);
const _sfc_main$5 = {
  name: "JutsuImageCarousel",
  props: { jutsu: Jutsu },
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation
  }
};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_carousel = resolveComponent("carousel");
  const _component_slide = resolveComponent("slide");
  _push(ssrRenderComponent(_component_carousel, mergeProps({
    "items-to-show": 1,
    autoplay: 5e3
  }, _attrs), {
    addons: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2)
        ;
      else {
        return [];
      }
    }),
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<!--[-->`);
        ssrRenderList($props.jutsu.images, (image) => {
          _push2(ssrRenderComponent(_component_slide, { key: image }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`<div class="image-element" style="${ssrRenderStyle({
                  "background-image": `url(${image})`,
                  "border-color": `${$props.jutsu.primaryColor}`,
                  "box-shadow": `0 0 8px ${$props.jutsu.primaryColor}`
                })}" data-v-4542be0e${_scopeId2}></div>`);
              } else {
                return [
                  createVNode("div", {
                    class: "image-element",
                    style: {
                      "background-image": `url(${image})`,
                      "border-color": `${$props.jutsu.primaryColor}`,
                      "box-shadow": `0 0 8px ${$props.jutsu.primaryColor}`
                    }
                  }, null, 4)
                ];
              }
            }),
            _: 2
          }, _parent2, _scopeId));
        });
        _push2(`<!--]-->`);
      } else {
        return [
          (openBlock(true), createBlock(Fragment$1, null, renderList($props.jutsu.images, (image) => {
            return openBlock(), createBlock(_component_slide, { key: image }, {
              default: withCtx(() => [
                createVNode("div", {
                  class: "image-element",
                  style: {
                    "background-image": `url(${image})`,
                    "border-color": `${$props.jutsu.primaryColor}`,
                    "box-shadow": `0 0 8px ${$props.jutsu.primaryColor}`
                  }
                }, null, 4)
              ]),
              _: 2
            }, 1024);
          }), 128))
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/jutsu/jutsu-image-carousel.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender$4], ["__scopeId", "data-v-4542be0e"]]);
const ninjaCouncilLogo = "" + globalThis.__buildAssetsURL("ninjacouncilIcon.2d5dc875.svg");
const moderatorLogo = "" + globalThis.__buildAssetsURL("moderatorIcon.efc3f23e.svg");
const gearLogo = "" + globalThis.__buildAssetsURL("gear.348edaab.svg");
const infoLogo = "" + globalThis.__buildAssetsURL("info.c87d06f9.svg");
var Restriction = /* @__PURE__ */ ((Restriction2) => {
  Restriction2["ENGEDELYES"] = "Enged\xE9lyhez k\xF6t\xF6tt";
  Restriction2["MODERATORI"] = "Moder\xE1tori enged\xE9lyhez k\xF6t\xF6tt";
  return Restriction2;
})(Restriction || {});
let rankMap = {
  Splus: "#e0b302",
  S: "#edca40",
  A: "#06b835",
  B: "#264ede",
  C: "#aa06cf",
  D: "#b51628",
  E: "#ababab"
};
const _sfc_main$4 = {
  name: "JutsuBody",
  props: {
    jutsu: Jutsu
  },
  components: [__nuxt_component_2],
  data() {
    return {
      rankMap,
      ninjaCouncilLogo,
      moderatorLogo,
      gearLogo,
      infoLogo,
      Restriction
    };
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "body" }, _attrs))} data-v-5b1f711f><div class="info-container" data-v-5b1f711f>`);
  if ($props.jutsu.images.length > 0) {
    _push(`<div class="carousel-container" data-v-5b1f711f><div class="carousel-container" data-v-5b1f711f>`);
    ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
    _push(`</div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<div class="basic-info-container" data-v-5b1f711f><div class="upper-part" data-v-5b1f711f><div class="info-bar" data-v-5b1f711f><div class="image-container chakra-image" data-v-5b1f711f></div><span class="chara-label" data-v-5b1f711f>${ssrInterpolate($props.jutsu.chakra)}</span></div><div class="info-bar" data-v-5b1f711f><div class="image-container rank-image" data-v-5b1f711f></div><span style="${ssrRenderStyle({ color: $data.rankMap[$props.jutsu.rank], textShadow: "none" })}" class="chara-label" data-v-5b1f711f>${ssrInterpolate($props.jutsu.rank)}</span></div></div>`);
  if ($props.jutsu.restrictions.length > 0 || $props.jutsu.jutsuRequirement.length > 0) {
    _push(`<div class="lower-part" data-v-5b1f711f><div class="restriction-row" data-v-5b1f711f>`);
    if ($props.jutsu.restrictions.includes($data.Restriction.ENGEDELYES)) {
      _push(`<div class="logo" data-v-5b1f711f><img${ssrRenderAttr("src", $data.ninjaCouncilLogo)} class="restriction-logo" alt="nt logo" data-v-5b1f711f></div>`);
    } else {
      _push(`<!---->`);
    }
    if ($props.jutsu.restrictions.includes($data.Restriction.ENGEDELYES)) {
      _push(`<div class="logo" data-v-5b1f711f><img${ssrRenderAttr("src", $data.moderatorLogo)} class="restriction-logo" alt="nt logo" data-v-5b1f711f></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div>`);
    if ($props.jutsu.jutsuRequirement.length > 0) {
      _push(`<div class="requirement-row" data-v-5b1f711f><!--[-->`);
      ssrRenderList($props.jutsu.jutsuRequirement, (req) => {
        _push(`<div class="requirement-item" data-v-5b1f711f><img${ssrRenderAttr("src", $data.gearLogo)} class="requirement-logo" data-v-5b1f711f><span class="requirement-text" data-v-5b1f711f>${ssrInterpolate(req.jpName)}</span><span class="requirement-text-hun" data-v-5b1f711f>${ssrInterpolate(req.huName)}</span></div>`);
      });
      _push(`<!--]--></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div><div class="description-container" data-v-5b1f711f><!--[-->`);
  ssrRenderList($props.jutsu.info.sort((a, b) => a.order - b.order), (info) => {
    _push(`<p style="${ssrRenderStyle({ color: info.color })}" class="description info-desc" data-v-5b1f711f><div class="info-logo" data-v-5b1f711f></div> ${ssrInterpolate(info.text)}</p>`);
  });
  _push(`<!--]--><p class="description" data-v-5b1f711f>${ssrInterpolate($props.jutsu.description)}</p></div></div>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/jutsu/jutsu-body.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$3], ["__scopeId", "data-v-5b1f711f"]]);
const offensiveIcon = "" + globalThis.__buildAssetsURL("katana.a0cdf7f4.svg");
const defensiveIcon = "" + globalThis.__buildAssetsURL("shield.920e9373.svg");
const utilityIcon = "" + globalThis.__buildAssetsURL("hand.3fb762c2.svg");
var JutsuFunctionality = /* @__PURE__ */ ((JutsuFunctionality2) => {
  JutsuFunctionality2["OFFENSIVE"] = "OFFENSIVE";
  JutsuFunctionality2["DEFENSIVE"] = "DEFENSIVE";
  JutsuFunctionality2["UTILITY"] = "UTILITY";
  return JutsuFunctionality2;
})(JutsuFunctionality || {});
const _sfc_main$3 = {
  name: "JutsuFooter",
  props: {
    jutsu: Jutsu
  },
  data() {
    return {
      defensiveIcon,
      offensiveIcon,
      utilityIcon,
      JutsuFunctionality
    };
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "footer-main" }, _attrs))} data-v-55487944>`);
  if ($props.jutsu.functionality === $data.JutsuFunctionality.DEFENSIVE) {
    _push(`<div class="functionality" data-v-55487944><img${ssrRenderAttr("src", $data.defensiveIcon)} class="funtionality-icon" alt="functionality icon" data-v-55487944></div>`);
  } else {
    _push(`<!---->`);
  }
  if ($props.jutsu.functionality === $data.JutsuFunctionality.OFFENSIVE) {
    _push(`<div class="functionality" data-v-55487944><img${ssrRenderAttr("src", $data.offensiveIcon)} class="funtionality-icon" alt="functionality icon" data-v-55487944></div>`);
  } else {
    _push(`<!---->`);
  }
  if ($props.jutsu.functionality === $data.JutsuFunctionality.UTILITY) {
    _push(`<div class="functionality" data-v-55487944><img${ssrRenderAttr("src", $data.utilityIcon)} class="funtionality-icon" alt="functionality icon" data-v-55487944></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/jutsu/jutsu-footer.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-55487944"]]);
const _sfc_main$2 = {
  name: "JutsuTemplate",
  components: { JutsuFooter: __nuxt_component_3, JutsuImageCarousel: __nuxt_component_2, JutsuBody: __nuxt_component_1, JutsuHeader: __nuxt_component_0$2 },
  props: {
    jutsu: Jutsu
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_JutsuHeader = __nuxt_component_0$2;
  const _component_JutsuBody = __nuxt_component_1;
  const _component_JutsuImageCarousel = __nuxt_component_2;
  const _component_JutsuFooter = __nuxt_component_3;
  _push(`<div${ssrRenderAttrs(mergeProps({
    style: {
      "border-color": $props.jutsu.type.primaryColor,
      "box-shadow": `0 0 8px ${$props.jutsu.type.primaryColor}`
    },
    class: "jutsu-container"
  }, _attrs))} data-v-bfdf0a9f>`);
  _push(ssrRenderComponent(_component_JutsuHeader, { jutsu: $props.jutsu }, null, _parent));
  _push(ssrRenderComponent(_component_JutsuBody, { jutsu: $props.jutsu }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div class="carousel-container" data-v-bfdf0a9f${_scopeId}>`);
        _push2(ssrRenderComponent(_component_JutsuImageCarousel, { jutsu: $props.jutsu }, null, _parent2, _scopeId));
        _push2(`</div>`);
      } else {
        return [
          createVNode("div", { class: "carousel-container" }, [
            createVNode(_component_JutsuImageCarousel, { jutsu: $props.jutsu }, null, 8, ["jutsu"])
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_JutsuFooter, { jutsu: $props.jutsu }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/jutsu/jutsu-template.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-bfdf0a9f"]]);
var Rank = /* @__PURE__ */ ((Rank2) => {
  Rank2["E"] = "E";
  Rank2["D"] = "D";
  Rank2["C"] = "C";
  Rank2["B"] = "B";
  Rank2["A"] = "A";
  Rank2["S"] = "S";
  Rank2["Splus"] = "S+";
  return Rank2;
})(Rank || {});
const jutsuList = [
  {
    id: "29252155-82df-4ef9-bb7d-0609f51bb626",
    chakra: 100,
    description: 'A kawarimi alapvet\u0151 chakrair\xE1ny\xEDt\xE1si m\u0171velete: chakra testen k\xEDv\xFCli \xF6n\xE1ll\xF3 ir\xE1ny\xEDt\xE1sa + chakra testen k\xEDv\xFCli ir\xE1ny\xEDt\xE1s\xE1val val\xF3 mozgat\xE1s\nA technika l\xE9trehoz\xE1sa k\xE9t chakrair\xE1ny\xEDt\xE1si Alapm\u0171velet kombin\xE1ci\xF3j\xE1val j\xF6n l\xE9tre. A Chakra testen k\xEDv\xFCli \xF6n\xE1ll\xF3 ir\xE1ny\xEDt\xE1sa (Bunshin no Jutsu alapm\u0171velete) valamint a Chakra testen k\xEDv\xFCli ir\xE1ny\xEDt\xE1s\xE1val val\xF3 mozgat\xE1s (Kugutsu no Jutsu alapm\u0171velete) A technik\xE1hoz sz\xFCks\xE9g van egy, a haszn\xE1l\xF3val nagyj\xE1b\xF3l egy m\xE9ret\u0171 \xE9s s\xFAly\xFA t\xE1rgyra, valamint egy kis chakrafelhaszn\xE1l\xE1sra. Az alkalmaz\xE1skor a haszn\xE1l\xF3 keres egy, a m\xE9ret\xE9vel \xE9s s\xFAly\xE1val megegyez\u0151 t\xE1rgyat ami lehet ak\xE1r egy far\xF6nk, vagy egy zs\xE1k - vagy b\xE1rmely m\xE1s dolog - \xE9s a t\xE1rgyba koncentr\xE1lja a chakr\xE1j\xE1t. Amint teljesen \xE1tj\xE1rta vele, kiterjeszti azt a t\xE1rgy fel\xFClet\xE9re, majd chakr\xE1ja seg\xEDts\xE9g\xE9vel a t\xE1rgy k\xF6r\xFCl l\xE9trehoz egy chakram\xE1solatot \xF6nmag\xE1r\xF3l, csak\xFAgy, mint a Bunshin no Jutsun\xE1l. Ezut\xE1n, a chakr\xE1ja seg\xEDts\xE9g\xE9vel k\xE9pes lesz ir\xE1ny\xEDtani azt.\nEzzel az elj\xE1r\xE1ssal egy olyan kl\xF3nt hoz l\xE9tre a haszn\xE1l\xF3, ami l\xE9nyegesen t\xF6bb ideig marad fent mint a sima Bunshin, valamint a kl\xF3n s\xFAllyal \xE9s testtel is rendelkezik, \xEDgy a haszn\xE1l\xF3val helyet cser\xE9lve (\xE9s "teleport\xE1lva" egyik helyr\u0151l a m\xE1sikra, hanem a haszn\xE1l\xF3 elb\xFAjik a kl\xF3n \xE1tveszi a hely\xE9t) remek\xFCl haszn\xE1latos megt\xE9veszt\xE9s gyan\xE1nt. Azonban, az \xEDgy l\xE9trehozott m\xE1solat addig tartja meg form\xE1j\xE1t, am\xEDg fizikai vagy chakrahat\xE1s nem \xE9ri, ekkor pedig a chakramassza sz\xE9toszl\xE1s\xE1val csak a t\xE1rgy vagy l\xE9ny marad a helysz\xEDnen. \xC9l\u0151l\xE9nyek -\xE1llatok \xE9s emberek- eset\xE9n a technika csak addig marad fenn, am\xEDg a l\xE9ny hagyja, azaz nem mozdul meg, \xEDgy \xE9l\u0151l\xE9nyekkel legt\xF6bbsz\xF6r nem, vagy csak egy pillanatnyi v\xE9szhelyzet megold\xE1s\xE1ra alkalmazhat\xF3.',
    huName: "Testhelyettes\xEDt\u0151 Technika",
    jpName: "Kawarimi no Jutsu",
    jutsuRequirement: [
      { huName: "F\xE1c\xE1n Vad\xE1szat", jpName: "Kijigari" },
      { huName: "Er\u0151szakos R\xE9msz\xE9l Csap\xE1s", jpName: "Juuha Reppushou" }
    ],
    images: [
      "https://vignette1.wikia.nocookie.net/naruto/images/e/eb/Body_Replacement.PNG/revision/latest/scale-to-width-down/320?cb=20150504131249",
      "https://i.stack.imgur.com/kEe8Q.jpg"
    ],
    kanji: "\u5FCD",
    rank: Rank.E,
    restrictions: [],
    type: {
      parentType: { name: "Ninjutsu", parentType: null, secondaryColor: "", primaryColor: "" },
      primaryColor: "#968468",
      secondaryColor: "#968468",
      name: "Akad\xE9mista Ninjutsu"
    },
    users: [],
    info: [
      {
        name: "Figyelmeztet\xE9s",
        color: "#EF5F5F",
        order: 0,
        text: "A Kawarimi no Jutsu NEM egy t\xE9rid\u0151 technika, teh\xE1t NEM lehet vele t\xE9ren \xE9s id\u0151n \xE1t kicser\xE9lni magad semmivel! Magyar\xE1zat lejjebb."
      }
    ],
    functionality: JutsuFunctionality.UTILITY
  },
  {
    id: "5e4a3967-5615-4b83-a24b-fc9d8fe4d2d9",
    chakra: 400,
    description: "A technika sor\xE1n a haszn\xE1l\xF3 egy m\xE9retesebb rep\xFCl\u0151 f\xE1c\xE1nt hoz l\xE9tre l\xE1ngokb\xF3l, mely azt\xE1n a c\xE9lpont fel\xE9 rep\xFCl \xE9s akad\xE1lyozza a mozg\xE1sban, vagy \xE9pp a haszn\xE1l\xF3 akarata szerint megt\xE1madja azt. A f\xE1c\xE1n igen magas h\u0151vel rendelkezik, \xEDgy cs\xFAnya \xE9g\xE9si s\xE9r\xFCl\xE9seket k\xE9pes okozni a c\xE9lpontnak, \xE9s mivel fizikailag \xFAgy viselkedik, mint egy f\xE1c\xE1n, a csapkod\xF3 sz\xE1rnyai v\xE9gett k\xF6nnyen megh\xE1tr\xE1l\xE1sra k\xE9nyszer\xEDthetj\xFCk ellenfel\xFCnk, vagy csak egyszer\u0171en csak beleir\xE1ny\xEDtjuk az ellenf\xE9lbe, mely nyom\xE1n a f\xE1c\xE1n belrobban. B\xE1r kib\xEDr n\xE9h\xE1ny csap\xE1st, a technika nem arra lett kital\xE1lva, hogy sok\xE1ig b\xEDrja a t\xE1mad\xE1sokat.",
    huName: "F\xE1c\xE1n Vad\xE1szat",
    jpName: "Kijigari",
    jutsuRequirement: [],
    images: [
      "https://i33.servimg.com/u/f33/18/17/45/35/kijiga10.jpg"
    ],
    kanji: "\u706B",
    rank: Rank.B,
    restrictions: [],
    type: {
      parentType: { name: "Ninjutsu", parentType: null, secondaryColor: "", primaryColor: "" },
      primaryColor: "#a10a02",
      secondaryColor: "#EF5F5F",
      name: "Akad\xE9mista Ninjutsu"
    },
    users: [],
    info: [],
    functionality: JutsuFunctionality.OFFENSIVE
  },
  {
    id: "17c69735-bd01-4668-a0a7-6322a11f86fa",
    chakra: 500,
    description: "A haszn\xE1l\xF3 sz\xE9l chakra seg\xEDts\xE9g\xE9vel egy karom form\xE1j\xFA sz\xE9ll\xF6k\xE9st hoz l\xE9tre, amely a technika l\xE9trehoz\xE1s\xE1ra felhaszn\xE1lt chakr\xE1t\xF3l v\xE1lik l\xE1that\xF3v\xE1. A jutsu k\xE9pes szikl\xE1kat rombolni.",
    huName: "Er\u0151szakos R\xE9msz\xE9l Csap\xE1s",
    jpName: "Juuha Reppushou ",
    jutsuRequirement: [],
    images: [
      "https://i.servimg.com/u/f33/18/17/45/35/juuha_11.jpg"
    ],
    kanji: "\u98A8",
    rank: Rank.A,
    restrictions: [],
    type: {
      parentType: { name: "Ninjutsu", parentType: null, secondaryColor: "", primaryColor: "" },
      primaryColor: "#048c10",
      secondaryColor: "#68f274",
      name: "Akad\xE9mista Ninjutsu"
    },
    users: [],
    info: [],
    functionality: JutsuFunctionality.DEFENSIVE
  },
  {
    id: "e129b9bb-716e-41c9-9cef-5a2ab493725a",
    chakra: 900,
    description: "A Naruton haszn\xE1lt N\xE9gy pecs\xE9t ellent\xE9te: ez a pecs\xE9t nem a testbe z\xE1rt chakr\xE1t engedi kivonni, \xE9s \xE1talakulni/felhaszn\xE1lni a haszn\xE1l\xF3 akarata szerint: A technika a haszn\xE1l\xF3 test\xE9be, avagy abba a testbe, amire a pecs\xE9tet k\xE9sz\xEDtette, z\xE1r mindent, ami a pecs\xE9t k\xF6rnyezet\xE9ben van (a pecs\xE9t hat\xF3sugara a k\xE9sz\xEDt\xE9s\xE9hez felhaszn\xE1lt chakra mennyis\xE9gt\u0151l f\xFCgg).\nA pecs\xE9t elk\xE9sz\xEDt\xE9se: rajzolat k\xE9sz\xEDt\xE9se a hordoz\xF3ra, majd a pecs\xE9tbe foglalt chakra pecs\xE9tbe \xE1ramoltat\xE1sa, v\xE9g\xFCl a pecs\xE9t lez\xE1r\xE1sa - ezt a haszn\xE1l\xF3 megteheti \xFAgy, hogy a felold\xE1st csak maga ind\xEDthatja el, de a megpecs\xE9teltnek is meghagyhatja ezt a lehet\u0151s\xE9get.",
    huName: "Ford\xEDtott N\xE9gy Pecs\xE9t",
    jpName: "Ura Shishou Fuuinjutsu ",
    jutsuRequirement: [],
    images: [
      "https://images2.imgbox.com/6b/a8/aamYiwx0_o.png"
    ],
    kanji: "\u5C01",
    rank: Rank.S,
    restrictions: [],
    type: {
      parentType: { name: "Ninjutsu", parentType: null, secondaryColor: "", primaryColor: "" },
      primaryColor: "#26272e",
      secondaryColor: "#313a7d",
      name: "Akad\xE9mista Ninjutsu"
    },
    users: [],
    info: []
  },
  {
    id: "1efbaf13-b26d-45b9-a847-c6ac1c30a9b0",
    chakra: 120,
    description: "Ez egy egyszer\u0171nek nevezhet\u0151 Kenjutsu, mivel nem t\xFAl er\u0151s. A l\xE9nyege, hogy mikor k\xE9t kard \xF6sszecsap, nagy f\xE9ny keletkezik az \xF6sszeakad\xE1s hely\xE9n, \xEDgy kicsit gyeng\xEDti az ellenf\xE9l l\xE1t\xE1s\xE1t, m\xEDg a Ninja szem\xE9be nem megy a f\xE9ny. Nem olyan neh\xE9z elsaj\xE1t\xEDtani, mint a t\xF6bbi Kenjutsut. \xC9s nem is ker\xFCl annyi chakr\xE1ba.",
    huName: "Napf\xE9ny",
    jpName: "Hikage ",
    jutsuRequirement: [],
    images: [],
    kanji: "\u5263",
    rank: Rank.D,
    restrictions: [],
    type: {
      parentType: { name: "Ninjutsu", parentType: null, secondaryColor: "", primaryColor: "" },
      primaryColor: "#312a4a",
      secondaryColor: "#ccc5e6",
      name: "Akad\xE9mista Ninjutsu"
    },
    users: [],
    info: []
  }
];
const meta = void 0;
const _routes = [
  {
    name: "admin-jutsu-comments",
    path: "/admin/jutsu/comments",
    file: "C:/Development/gundan/jutsu/pages/admin/jutsu/comments.vue",
    children: [],
    meta: meta$5,
    alias: [],
    component: () => import('./comments.282c9c22.mjs').then((m) => m.default || m)
  },
  {
    name: "admin-jutsu",
    path: "/admin/jutsu",
    file: "C:/Development/gundan/jutsu/pages/admin/jutsu/index.vue",
    children: [],
    meta: meta$4,
    alias: [],
    component: () => import('./index.0c695132.mjs').then((m) => m.default || m)
  },
  {
    name: "admin-jutsu-styles",
    path: "/admin/jutsu/styles",
    file: "C:/Development/gundan/jutsu/pages/admin/jutsu/styles.vue",
    children: [],
    meta: meta$3,
    alias: [],
    component: () => import('./styles.06f03a65.mjs').then((m) => m.default || m)
  },
  {
    name: "admin-users",
    path: "/admin/users",
    file: "C:/Development/gundan/jutsu/pages/admin/users/index.vue",
    children: [],
    meta: meta$2,
    alias: [],
    component: () => import('./index.bd028de8.mjs').then((m) => m.default || m)
  },
  {
    name: "index",
    path: "/",
    file: "C:/Development/gundan/jutsu/pages/index.vue",
    children: [],
    meta: meta$1,
    alias: [],
    component: () => import('./index.3f0ea005.mjs').then((m) => m.default || m)
  },
  {
    name: "jutsu-list",
    path: "/jutsu/list",
    file: "C:/Development/gundan/jutsu/pages/jutsu/list.vue",
    children: [],
    meta,
    alias: [],
    component: () => import('./list.3f50b8ab.mjs').then((m) => m.default || m)
  }
];
const configRouterOptions = {};
const routerOptions = {
  ...configRouterOptions
};
const globalMiddleware = [];
const namedMiddleware = {};
const node_modules_nuxt_dist_pages_runtime_router_mjs_qNv5Ky2ZmB = defineNuxtPlugin(async (nuxtApp) => {
  var _a, _b, _c, _d;
  let __temp, __restore;
  nuxtApp.vueApp.component("NuxtPage", NuxtPage);
  nuxtApp.vueApp.component("NuxtNestedPage", NuxtPage);
  nuxtApp.vueApp.component("NuxtChild", NuxtPage);
  let routerBase = useRuntimeConfig().app.baseURL;
  if (routerOptions.hashMode && !routerBase.includes("#")) {
    routerBase += "#";
  }
  const history = (_b = (_a = routerOptions.history) == null ? void 0 : _a.call(routerOptions, routerBase)) != null ? _b : createMemoryHistory(routerBase);
  const routes = (_d = (_c = routerOptions.routes) == null ? void 0 : _c.call(routerOptions, _routes)) != null ? _d : _routes;
  const initialURL = nuxtApp.ssrContext.url;
  const router = createRouter({
    ...routerOptions,
    history,
    routes
  });
  nuxtApp.vueApp.use(router);
  const previousRoute = shallowRef(router.currentRoute.value);
  router.afterEach((_to, from) => {
    previousRoute.value = from;
  });
  Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
    get: () => previousRoute.value
  });
  const _route = shallowRef(router.resolve(initialURL));
  const syncCurrentRoute = () => {
    _route.value = router.currentRoute.value;
  };
  nuxtApp.hook("page:finish", syncCurrentRoute);
  router.afterEach((to, from) => {
    var _a2, _b2, _c2, _d2;
    if (((_b2 = (_a2 = to.matched[0]) == null ? void 0 : _a2.components) == null ? void 0 : _b2.default) === ((_d2 = (_c2 = from.matched[0]) == null ? void 0 : _c2.components) == null ? void 0 : _d2.default)) {
      syncCurrentRoute();
    }
  });
  const route = {};
  for (const key in _route.value) {
    route[key] = computed(() => _route.value[key]);
  }
  nuxtApp._route = reactive(route);
  nuxtApp._middleware = nuxtApp._middleware || {
    global: [],
    named: {}
  };
  useError();
  try {
    if (true) {
      ;
      [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
      ;
    }
    ;
    [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
    ;
  } catch (error2) {
    callWithNuxt(nuxtApp, showError, [error2]);
  }
  const initialLayout = useState("_layout");
  router.beforeEach(async (to, from) => {
    var _a2, _b2;
    to.meta = reactive(to.meta);
    if (nuxtApp.isHydrating) {
      to.meta.layout = (_a2 = initialLayout.value) != null ? _a2 : to.meta.layout;
    }
    nuxtApp._processingMiddleware = true;
    const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
    for (const component of to.matched) {
      const componentMiddleware = component.meta.middleware;
      if (!componentMiddleware) {
        continue;
      }
      if (Array.isArray(componentMiddleware)) {
        for (const entry2 of componentMiddleware) {
          middlewareEntries.add(entry2);
        }
      } else {
        middlewareEntries.add(componentMiddleware);
      }
    }
    for (const entry2 of middlewareEntries) {
      const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_b2 = namedMiddleware[entry2]) == null ? void 0 : _b2.call(namedMiddleware).then((r) => r.default || r)) : entry2;
      if (!middleware) {
        throw new Error(`Unknown route middleware: '${entry2}'.`);
      }
      const result = await callWithNuxt(nuxtApp, middleware, [to, from]);
      {
        if (result === false || result instanceof Error) {
          const error2 = result || createError$1({
            statusMessage: `Route navigation aborted: ${initialURL}`
          });
          return callWithNuxt(nuxtApp, showError, [error2]);
        }
      }
      if (result || result === false) {
        return result;
      }
    }
  });
  router.afterEach(async (to) => {
    delete nuxtApp._processingMiddleware;
    if (to.matched.length === 0) {
      callWithNuxt(nuxtApp, showError, [createError$1({
        statusCode: 404,
        fatal: false,
        statusMessage: `Page not found: ${to.fullPath}`
      })]);
    } else if (to.matched[0].name === "404" && nuxtApp.ssrContext) {
      nuxtApp.ssrContext.event.res.statusCode = 404;
    } else {
      const currentURL = to.fullPath || "/";
      if (!isEqual(currentURL, initialURL)) {
        await callWithNuxt(nuxtApp, navigateTo, [currentURL]);
      }
    }
  });
  nuxtApp.hooks.hookOnce("app:created", async () => {
    try {
      await router.replace({
        ...router.resolve(initialURL),
        name: void 0,
        force: true
      });
    } catch (error2) {
      callWithNuxt(nuxtApp, showError, [error2]);
    }
  });
  return { provide: { router } };
});
const initUser = async () => {
  const store = firebase.firestore();
  const gundanUser = useGundanUser();
  if (firebase.auth().currentUser)
    gundanUser.value = (await store.doc(`users/${firebase.auth().currentUser}`).get()).data();
  firebase.auth().onAuthStateChanged(async (credential) => {
    console.log(credential);
    if (credential) {
      gundanUser.value = (await store.doc(`users/${credential.uid}`).get()).data();
      console.log(gundanUser.value);
    } else {
      gundanUser.value = null;
    }
  });
};
const plugins_firebaseAuth_ts_HmQJsTUq9K = defineNuxtPlugin((nuxtApp) => {
  const firebaseConfig = {
    apiKey: "AIzaSyBIQ745b4yyUCkbaM8Is6YXS3S-of13zp8",
    authDomain: "gundan-jutsu.firebaseapp.com",
    projectId: "gundan-jutsu",
    storageBucket: "gundan-jutsu.appspot.com",
    messagingSenderId: "1083124517666",
    appId: "1:1083124517666:web:9a714edd8909490b6d337b",
    measurementId: "G-5V1X7CNYPC"
  };
  firebase$1.initializeApp(firebaseConfig);
  initUser().then();
});
const _plugins = [
  _nuxt_components_plugin_mjs_KR1HBZs4kY,
  node_modules_nuxt_dist_head_runtime_lib_vueuse_head_plugin_mjs_D7WGfuP1A0,
  node_modules_nuxt_dist_head_runtime_plugin_mjs_1QO0gqa6n2,
  node_modules_nuxt_dist_pages_runtime_router_mjs_qNv5Ky2ZmB,
  plugins_firebaseAuth_ts_HmQJsTUq9K
];
const _sfc_main$1 = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const ErrorComponent = defineAsyncComponent(() => import('./error-component.be95b193.mjs').then((r) => r.default || r));
    const nuxtApp = useNuxtApp();
    provide("_route", useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        callWithNuxt(nuxtApp, showError, [err]);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_App = resolveComponent("App");
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(error)) {
            _push(ssrRenderComponent(unref(ErrorComponent), { error: unref(error) }, null, _parent));
          } else {
            _push(ssrRenderComponent(_component_App, null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const layouts = {};
const __nuxt_component_0 = defineComponent({
  props: {
    name: {
      type: [String, Boolean, Object],
      default: null
    }
  },
  setup(props, context) {
    const route = useRoute();
    return () => {
      var _a, _b, _c;
      const layout = (_b = (_a = isRef(props.name) ? props.name.value : props.name) != null ? _a : route.meta.layout) != null ? _b : "default";
      const hasLayout = layout && layout in layouts;
      const transitionProps = (_c = route.meta.layoutTransition) != null ? _c : appLayoutTransition;
      return _wrapIf(Transition, hasLayout && transitionProps, {
        default: () => {
          return _wrapIf(layouts[layout], hasLayout, context.slots).default();
        }
      }).default();
    };
  }
});
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLayout = __nuxt_component_0;
  const _component_NuxtPage = resolveComponent("NuxtPage");
  _push(ssrRenderComponent(_component_NuxtLayout, _attrs, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_NuxtPage)
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/pages/runtime/app.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
let entry;
const plugins = normalizePlugins(_plugins);
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main$1);
    vueApp.component("App", AppComponent);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (err) {
      await nuxt.callHook("app:error", err);
      nuxt.payload.error = nuxt.payload.error || err;
    }
    return vueApp;
  };
}
const entry$1 = (ctx) => entry(ctx);

export { _export_sfc as _, __nuxt_component_0$3 as a, __nuxt_component_0$4 as b, __nuxt_component_0$1 as c, useHead as d, entry$1 as default, jutsuList as j, useGundanUser as u };
//# sourceMappingURL=server.mjs.map
