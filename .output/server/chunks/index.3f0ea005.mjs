import { _ as _export_sfc, u as useGundanUser, a as __nuxt_component_0$3 } from './server.mjs';
import { reactive, unref, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrInterpolate } from 'vue/server-renderer';
import 'ohmyfetch';
import 'ufo';
import 'hookable';
import 'unctx';
import 'vue-router';
import 'h3';
import 'defu';
import '@vue/shared';
import 'firebase/compat';
import 'vue3-carousel';
import '@firebase/app-compat';
import './node-server.mjs';
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

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const options = reactive({
      test: 0
    });
    const user = useGundanUser();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_JutsuNav = __nuxt_component_0$3;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_JutsuNav, null, null, _parent));
      _push(`<div class="main-menu" data-v-d1c04132><pre data-v-d1c04132>    <span style="${ssrRenderStyle({ "color": "white" })}" data-v-d1c04132>${ssrInterpolate(options.test)}</span>
  </pre><pre style="${ssrRenderStyle({ "color": "white", "border": "solid thin red" })}" data-v-d1c04132>    ${ssrInterpolate(unref(user))}
  </pre>`);
      if (!unref(user)) {
        _push(`<button class="menu-button login-button" data-v-d1c04132>Google Bejelentkez\xE9s</button>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(user)) {
        _push(`<a href="/admin/jutsu" data-v-d1c04132><button class="menu-button" data-v-d1c04132>Jutsu adminisztr\xE1ci\xF3</button></a>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(user)) {
        _push(`<a href="/admin/jutsu/styles" data-v-d1c04132><button class="menu-button" data-v-d1c04132>Jutsu st\xEDlusok</button></a>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(user)) {
        _push(`<a href="/admin/jutsu/comments" data-v-d1c04132><button class="menu-button" data-v-d1c04132>Megjegyz\xE9s t\xEDpusok</button></a>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(user)) {
        _push(`<a href="/admin/users" data-v-d1c04132><button class="menu-button" data-v-d1c04132>Felhaszn\xE1l\xF3k</button></a>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(user)) {
        _push(`<a href="/jutsu/list" data-v-d1c04132><button class="menu-button" data-v-d1c04132>Jutsu lista</button></a>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(user)) {
        _push(`<button class="logout-button" data-v-d1c04132>Kijelentkez\xE9s</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d1c04132"]]);

export { index as default };
//# sourceMappingURL=index.3f0ea005.mjs.map
