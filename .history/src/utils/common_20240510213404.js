import dayjs from "dayjs";
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

export function formatTime(data) {
  return dayjs(data).format("YYYY-MM-DD HH:mm:ss"); // 2022-5-7 9:17:56
}

export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);

export const isElectron = window && window.process && window.process.type;
