import { ipcMain, app, shell, dialog } from "electron";

import {
  quitApp,
  mainTop,
  shakeWindow,
  minMainWindow,
  maxMainWindow,
  openExternal,
  showMessageBox,
  setmainViewSize,
  handleScreenshot,
} from "../utils/util";

import Update from "../utils/checkupdate";
const allUpdater = new Update();

const ipcEvent = () => {
  // 置顶主窗口
  ipcMain.on("mainTop", (event) => {
    mainTop();
  });

  // 主窗口最小化
  ipcMain.on("minMainWindow", () => {
    minMainWindow();
  });

  // 主窗口最大化
  ipcMain.on("maxMainWindow", () => {
    maxMainWindow();
  });

  // 窗口抖动
  ipcMain.on("shakeWindow", () => {
    shakeWindow();
  });

  // dialog 系统弹框
  ipcMain.on("showMessageBox", () => {
    showMessageBox();
  });

  //关闭所有窗口
  ipcMain.on("destroy", () => {
    app.exit();
    // 这是一个同步方法，调用后会立即退出应用程序。
    // 它会终止所有的进程，包括主进程和渲染进程。
    // 不会触发 before - quit 和 will - quit 事件。
  });

  // 退出程序
  ipcMain.on("quitApp", () => {
    app.quit();
    // 这是一个异步方法，调用后会在所有的窗口关闭后退出应用程序。
    // 它会先触发 before - quit 事件，允许你执行一些清理操作。
    // 如果有任何窗口取消了关闭操作（例如通过 event.preventDefault()），应用程序将不会退出。
    // 在所有窗口关闭后，会触发 will - quit 事件，然后退出应用程序。
  });

  // 外部浏览器打开
  ipcMain.on("openExternal", (event, option) => {
    openExternal(option);
  });

  // 托盘闪烁
  ipcMain.on("TrayFlashIng", (event, option) => {
    global.mainWin.flashFrame(true);
  });

  //截图
  ipcMain.on("screenshot", (event, data) => {
    handleScreenshot();
  });

  // 设置主窗口尺寸
  ipcMain.on("setmainViewSize", (event, data) => {
    setmainViewSize(data);
  });

  // 检查更新
  ipcMain.on("check-update", () => {
    allUpdater.checkUpdate();
  });

  // 下载更新包
  ipcMain.on("down-update", () => {
    allUpdater.downUpdate();
  });

  // 确定更新
  ipcMain.on("confirm-update", () => {
    allUpdater.quitInstall();
  });

  // 热更新
  // ipcMain.on('hot-update', (event, data) => {})
};

export default ipcEvent;
