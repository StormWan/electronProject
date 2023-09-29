import dayjs from "dayjs";
import { customRef } from "vue";
const { title } = require("@/config/vue.custom.config");

/**
 * 切换主题风格
 * @param {string}  appearance light || dark
 */
export function changeAppearance(appearance = "light") {
  if (appearance === "auto") {
    // 查询系统主题色
    const media = window.matchMedia("(prefers-color-scheme: light)");
    media.onchange = autotaggTheme;
    appearance = media.matches ? "light" : "dark";
  }
  // 设置element主题色
  if (appearance == "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  // 自定义主题设色
  document.body.setAttribute("data-theme", appearance);
}

/**
 * 根据系统主题颜色自动切换
 * @param {event}
 */
export function autotaggTheme(e) {
  if (e.matches) {
    document.body.setAttribute("data-theme", "light");
    document.documentElement.classList.remove("dark");
  } else {
    document.body.setAttribute("data-theme", "dark");
    document.documentElement.classList.add("dark");
  }
}

export function setPageTitle(routerTitle) {
  document.title = routerTitle ? `${routerTitle} | ${title}` || title : title;
}

export function generateUUID() {
  let result = "";
  const code = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
  result = code.replace(/[xy]/gu, (item) => {
    const random = (Math.random() * 16) | 0;
    const value = item === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
  return result;
}

export function useDebouncedRef(value, delay = 200) {
  let timer;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(val) {
        if (timer) return;
        timer = setTimeout(() => {
          timer = null;
          value = val;
          trigger();
        }, delay);
      },
    };
  });
}

export function randomNum(min = 0, max = 100) {
  return Math.floor(Math.random() * (min - max) + max);
}

/**
 * 判断是否为空
 */
export function empty(value) {
  switch (typeof value) {
    case "undefined":
      return true;
    case "string":
      if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, "").length == 0) return true;
      break;
    case "boolean":
      if (!value) return true;
      break;
    case "number":
      if (value === 0 || isNaN(value)) return true;
      break;
    case "object":
      if (value === null || value.length === 0) return true;
      for (var i in value) {
        return false;
      }
      return true;
  }
  return false;
}

/**
 * 判断数据类型
 * typOf({}) === "object";
 */
export function typeOf(operand) {
  const toString = Object.prototype.toString;
  let type = toString.call(operand).split(" ")[1];
  type = type.substring(0, type.length - 1).toLowerCase();
  return type;
}

/**
 * 指定类型判断
 * isType('Array',[])
 */
export function isType(type, val) {
  return Object.prototype.toString.call(val) === `[object ${type}]`;
}

export function formatTime(data) {
  return dayjs(data).format("YYYY-MM-DD HH:mm:ss"); // 2022-5-7 9:17:56
}

/**
 * 深克隆函数，支持函数、日期、正则表达式等特殊类型的对象
 * @param {*} target - 要克隆的对象
 * @param {WeakMap} [map] - 循环引用处理的 WeakMap
 * @returns {*} 克隆出的对象
 */
export function deepClone(target, map = new WeakMap()) {
  // 如果是原始值类型或者 null，则直接返回
  if (target === null || typeof target !== "object") {
    return target;
  }
  // 循环引用处理，如果已经克隆过该对象，则直接返回已有的克隆对象
  if (map.get(target)) {
    return target;
  }

  const Ctor = target.constructor;
  const ctorName = Ctor.name;

  // 对于内置对象处理，如 RegExp、Date、Number、String、Boolean、Error
  if (/^(RegExp|Date|Number|String|Boolean|Error)$/i.test(ctorName)) {
    return new Ctor(target);
  }

  // Symbol 对象的处理，创建一个新的 Symbol 对象并返回
  if (ctorName === "Symbol") {
    return Object(Object.prototype.valueOf.call(target));
  }

  // Map 对象的处理
  if (ctorName === "Map") {
    let cloneMap = new Map();
    map.set(target, true);

    // 递归克隆 Map 对象的每个键值对
    target.forEach((value, key) => {
      cloneMap.set(deepClone(key, map), deepClone(value, map));
    });
    return cloneMap;
  }

  // Set 对象处理
  if (ctorName === "Set") {
    let cloneSet = new Set();
    map.set(target, true);

    // 递归克隆 Set 对象的每个元素
    target.forEach((value) => {
      cloneSet.add(deepClone(value, map));
    });
    return cloneSet;
  }

  // 处理普通的对象或数组
  map.set(target, true);

  let cloneResult = isType("Array", target) ? [] : {};

  // 不克隆原型链上的属性 只克隆对象本身属性
  // 使用 Object.getOwnPropertyNames 获取对象本身所有属性的属性名组成的数组
  Object.getOwnPropertyNames(target).forEach((key) => {
    cloneResult[key] = deepClone(target[key], map);
  });

  return cloneResult;
}
