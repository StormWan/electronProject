import { app, shell, BrowserWindow, dialog, Menu, nativeImage } from "electron";
/* 置顶主窗口 */
export const mainTop = () => {
  const mainView = global.mainWin;
  mainView.show();
  mainView.focus();
  mainView.moveTop();
};

/* 隐藏主窗口 */
export const mainWinHide = () => {};

/* 主窗口最小化 */
export const minMainWindow = () => {};

/* 主窗口最大化 */
export const maxMainWindow = () => {};

/* 外部浏览器打开 */
export const openExternal = (url) => {
  shell.openExternal(url);
};
