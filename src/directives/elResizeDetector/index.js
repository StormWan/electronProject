import elementResizeDetectorMaker from "element-resize-detector";
import emitter from "@/utils/mitt-bus";
import { debounce } from "lodash-es";

const erd = elementResizeDetectorMaker({
  strategy: "scroll",
});

const func = debounce((data) => {
  emitter.emit("resize", { detail: data });
}, 300);

export const resize = {
  mounted(el, binding, vnode) {
    erd.listenTo(el, (elem) => {
      const width = elem.offsetWidth;
      const height = elem.offsetHeight;
      if (binding?.instance) {
        func({ width, height });
      } else {
        vnode.el.dispatchEvent(new CustomEvent("resize", { detail: { width, height } }));
      }
    });
  },
  unmounted(el) {
    erd.uninstall(el);
  },
};
