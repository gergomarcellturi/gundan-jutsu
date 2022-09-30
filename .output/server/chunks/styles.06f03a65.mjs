import { _ as _export_sfc, a as __nuxt_component_0$3, b as __nuxt_component_0$4 } from './server.mjs';
import { withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
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
  components: { JutsuNav: __nuxt_component_0$3 }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_JutsuNav = __nuxt_component_0$3;
  const _component_NuxtLink = __nuxt_component_0$4;
  _push(`<!--[-->`);
  _push(ssrRenderComponent(_component_JutsuNav, null, null, _parent));
  _push(`<div>`);
  _push(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<button${_scopeId}>Vissza</button>`);
      } else {
        return [
          createVNode("button", null, "Vissza")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="admin-panel"><h2>\xDAj st\xEDlus hozz\xE1ad\xE1sa</h2></div><div class="style-list"></div><!--]-->`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/jutsu/styles.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const styles = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { styles as default };
//# sourceMappingURL=styles.06f03a65.mjs.map
