import { app, shell, BrowserWindow, dialog, Menu, nativeImage } from "electron";

const viewSize = {
  login: { width: 380, height: 550 },
  main: { width: 1038, height: 706 },
};
/* 置顶主窗口 */
export const mainTop = () => {
  const mainView = global.mainWin;
  mainView.show();
  mainView.focus();
  mainView.moveTop();
  mainView.center();
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
/* 设置主窗口尺寸 */
export const setmainViewSize = (type) => {
  const data = viewSize[type];
  const mainView = global.mainWin;
  const { width, height } = data;
  mainView.setMinimumSize(width, height);
  mainView.setSize(width, height);
  // mainView.center();
};
