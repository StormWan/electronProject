import { ipcMain, app, shell, dialog } from "electron";

import { mainTop, minMainWindow, maxMainWindow, openExternal } from "../utils/util";

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

  //关闭所有窗口
  ipcMain.on("destroy", () => {
    app.exit();
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
  ipcMain.on("screenshot", (event, data) => {});
};

export default ipcEvent;
