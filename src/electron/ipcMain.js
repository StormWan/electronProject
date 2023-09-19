import { ipcMain, app, shell, dialog } from "electron";

import { mainTop, minMainWindow, maxMainWindow } from "../utils/util";

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

  //截图
  ipcMain.on("screenshot", (event, data) => {});
};

export default ipcEvent;
