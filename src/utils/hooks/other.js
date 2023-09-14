import { ref, onMounted, onUnmounted } from "vue";

/**
 * 创建一个布尔类型的状态变量和对应的更新函数
 * @param {boolean} initialValue - 初始值，默认为 false
 * @returns {Array} - 包含状态变量和更新函数的数组
 */
export function useBoolean(initialValue = false) {
  const state = ref(initialValue);
  function setState(value) {
    state.value = value;
  }
  return [state, setState];
}

/**
 * useEventListener - 一个钩子函数，用于将事件监听器添加到给定的目标元素，并在组件卸载时将其移除。
 * @param {EventTarget} target - 要添加事件监听器的目标元素。
 * @param {String} event - 要监听的事件名称。
 * @param {Function} callback - 事件回调函数。
 */
export function useEventListener(target, event, callback) {
  onMounted(() => {
    target.addEventListener(event, callback, false);
  });
  onUnmounted(() => {
    target.removeEventListener(event, callback, false);
  });
}

/**
 * useMouse - 一个钩子函数，用于获取鼠标的位置坐标。
 * @return {Object} - 包含当前鼠标 x 和 y 坐标的对象。
 */
export function useMouse() {
  const x = ref(0);
  const y = ref(0);
  useEventListener(window, "mousemove", (e) => {
    x.value = e.clientX;
    y.value = e.clientY;
  });
  return { x, y };
}
