import { ref, unref, shallowRef, onBeforeUnmount, getCurrentInstance } from "vue";
import { throttle } from "lodash-es";

/**
 * 创建水印
 * @param {ref} appendEl - 水印要附加到的元素，默认为 document.body
 * @returns {Object} - 包含设置水印和清除水印的方法
 */
export function useWatermark(appendEl = ref(document.body)) {
  let watermarkText = "";
  const id = Symbol.toString();
  const watermarkEl = shallowRef();

  /**
   * 创建水印背景图的 base64 数据
   * @param {string} str - 水印文字
   * @param {Object} attr - 绘制属性
   * @returns {string} - base64 数据
   */
  function createBase64(str, attr) {
    const can = document.createElement("canvas");
    const width = 200;
    const height = 140;
    Object.assign(can, { width, height });

    const cans = can.getContext("2d");
    if (cans) {
      cans.rotate((-20 * Math.PI) / 120);
      cans.font = attr?.font ?? "12px Reggae One";
      cans.fillStyle = attr?.fillStyle ?? "rgba(0, 0, 0, 0.12)";
      cans.textAlign = "left";
      cans.textBaseline = "middle";
      cans.fillText(str, width / 20, height);
    }
    return can.toDataURL("image/png");
  }

  /**
   * 创建水印层
   * @param {string} str - 水印文字
   * @param {Object} attr - 绘制属性
   * @returns {symbol} - 水印层的 ID
   */
  const createWatermark = (str, attr) => {
    if (unref(watermarkEl)) {
      updateWatermark({ str, attr });
      return id;
    }
    watermarkText = str;
    const div = document.createElement("div");
    watermarkEl.value = div;
    div.id = id;
    div.style.pointerEvents = "none";
    div.style.top = "0px";
    div.style.left = "0px";
    div.style.position = "absolute";
    div.style.zIndex = "100000";
    const el = unref(appendEl);
    if (!el) return id;
    const { clientHeight: height, clientWidth: width } = el;
    updateWatermark({ str, width, height, attr });
    el.appendChild(div);
    return id;
  };

  /**
   * 更新水印
   * @param {Object} options - 更新选项
   */
  function updateWatermark(options) {
    const el = unref(watermarkEl);
    if (!el) return;
    if (options.width !== "undefined") {
      el.style.width = `${options.width}px`;
    }
    if (options.height !== "undefined") {
      el.style.height = `${options.height}px`;
    }
    if (options.str !== "undefined") {
      el.style.background = `url(${createBase64(options.str, options.attr)}) left top repeat`;
    }
  }

  /**
   * 设置水印
   * @param {string} str - 水印文字
   * @param {Object} attr - 绘制属性
   */
  function setWatermark(str, attr) {
    createWatermark(str, attr);
    window.addEventListener("resize", func);
    const instance = getCurrentInstance();
    if (instance) {
      onBeforeUnmount(() => {
        clear();
      });
    }
  }

  const func = throttle(function () {
    const el = unref(appendEl);
    if (!el) return;
    const { clientHeight: height, clientWidth: width } = el;
    updateWatermark({ str: watermarkText, height, width });
  }, 400);

  /* 清除水印 */
  const clear = () => {
    const domId = unref(watermarkEl);
    watermarkEl.value = undefined;
    const el = unref(appendEl);
    if (!el) return;
    domId && el.removeChild(domId);
    window.removeEventListener("resize", func);
  };

  return { setWatermark, clear };
}
