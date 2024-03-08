import { app, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import { isWindows, isMac } from "@/electron/utils/index";
// const logger = require("../logger/index");
/*
 * -1 检查更新失败 0 正在检查更新 1 检测到新版本，准备下载 2 未检测到新版本 3 下载中 4 下载完成
 */

// 配置更新服务器 URL
const updateServerUrl = process.env.VUE_APP_UPDATE_SERVER_URL;

// 负责向渲染进程发送信息
function sendMessage(type, data) {
  const mainWin = global.mainWin;
  console.log("mainWin", mainWin);
  if (mainWin) return;
  console.log("mainWin", mainWin);
  mainWin.webContents.send("updateMsg", { type, data });
}

class Update {
  constructor() {
    autoUpdater.setFeedURL(updateServerUrl);
    // 禁用自动下载
    autoUpdater.autoDownload = false;
    // 启用退出app时自动安装更新
    autoUpdater.autoInstallOnAppQuit = false;
    // 当更新发生错误的时候触发。
    autoUpdater.on("error", (err) => {
      // logger.error("更新出现错误", err);
      console.log("更新出现错误", err);
      sendMessage({ type: "error", data: err });
    });
    // 当开始检查更新的时候触发
    autoUpdater.on("checking-for-update", (event, arg) => {
      // logger.info("开始检查更新", arg);
      console.log("开始检查更新", arg);
      console.log(this.mainWin);
      sendMessage({ type: "checking-for-update", data: arg });
    });
    // 发现可更新数据时
    autoUpdater.on("update-available", (event, arg) => {
      // logger.info("有更新", arg);
      console.log("有更新", arg);
      sendMessage({ type: "update-available", data: arg });
    });
    // 没有可更新数据时
    autoUpdater.on("update-not-available", (event, arg) => {
      // logger.info("没有更新", arg);
      console.log("没有更新", arg);
      sendMessage({ type: "update-not-available", data: arg });
    });
    // 下载监听
    autoUpdater.on("download-progress", (progress) => {
      // logger.info("进度", progress);
      console.log("进度", progress);
      sendMessage({ type: "download-progress", data: progress });
    });
    // 下载完成
    autoUpdater.on("update-downloaded", () => {
      // logger.info("下载完成 done");
      console.log("下载完成 done");
      sendMessage({ type: "update-downloaded", data: "done" });
    });
  }
  // 执行自动更新检查
  checkUpdate() {
    autoUpdater.checkForUpdates().catch((err) => {
      console.log("网络连接问题", err);
      sendMessage({ type: "checkForUpdates", data: err });
    });
  }
  // 下载更新包
  downUpdate() {
    autoUpdater.downloadUpdate();
  }
  // 退出并安装
  quitInstall() {
    autoUpdater.quitAndInstall();
  }
}

export default Update;
