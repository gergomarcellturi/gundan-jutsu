import { _ as _export_sfc, j as jutsuList, c as __nuxt_component_0$1 } from './server.mjs';
import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
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
  data() {
    return { jutsuList };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_JutsuTemplate = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "main" }, _attrs))}><!--[-->`);
  ssrRenderList($data.jutsuList, (jutsu) => {
    _push(ssrRenderComponent(_component_JutsuTemplate, { jutsu }, null, _parent));
  });
  _push(`<!--]--></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/jutsu/list.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const list = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { list as default };
//# sourceMappingURL=list.3f50b8ab.mjs.map
