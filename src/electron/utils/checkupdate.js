import { app, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import { isWindows, isMac } from "@/electron/utils/index";
import { windowMap } from "../utils/windows-map";

/*
 * -1 检查更新失败
 * 0 正在检查更新
 * 1 检测到新版本，准备下载
 * 2 未检测到新版本
 * 3 下载中
 * 4 下载完成
 */

// 配置更新服务器 URL
const updateServerUrl = process.env.VUE_APP_UPDATE_SERVER_URL;

// 负责向渲染进程发送信息
function sendMessage({ type, data }) {
  const mainWin = windowMap.get("mainWin");
  if (!mainWin) return;
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
      sendMessage({ type: "error", data: err });
    });
    // 当开始检查更新的时候触发
    autoUpdater.on("checking-for-update", (event, arg) => {
      sendMessage({ type: "checking-for-update", data: "开始检查更新" });
    });
    // 发现可更新数据时
    autoUpdater.on("update-available", (event, arg) => {
      sendMessage({ type: "update-available", data: "有更新" });
    });
    // 没有可更新数据时
    autoUpdater.on("update-not-available", (event, arg) => {
      sendMessage({ type: "update-not-available", data: "无更新" });
    });
    // 下载监听
    autoUpdater.on("download-progress", (progress) => {
      sendMessage({ type: "download-progress", data: progress });
    });
    // 下载完成
    autoUpdater.on("update-downloaded", () => {
      sendMessage({ type: "done", data: "done" });
    });
  }
  // 执行更新检查
  checkUpdate() {
    autoUpdater.checkForUpdates().catch((err) => {
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
