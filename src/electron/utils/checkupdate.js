import { app, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import { isWindows, isMac } from "@/electron/utils/index";
/*
 * -1 检查更新失败 0 正在检查更新 1 检测到新版本，准备下载 2 未检测到新版本 3 下载中 4 下载完成
 */

// 配置更新服务器 URL
const updateServerUrl = process.env.VUE_APP_UPDATE_SERVER_URL;

class Update {
  constructor() {
    this.mainWindow = global.mainWin;
    autoUpdater.setFeedURL(updateServerUrl);
    // 禁用自动下载
    autoUpdater.autoDownload = false;
    // 启用退出app时自动安装更新
    autoUpdater.autoInstallOnAppQuit = false;
    // 当更新发生错误的时候触发。
    autoUpdater.on("error", (err) => {
      console.log("更新出现错误", err.message);
    });
    // 当开始检查更新的时候触发
    autoUpdater.on("checking-for-update", (event, arg) => {
      console.log("开始检查更新");
    });
    // 发现可更新数据时
    autoUpdater.on("update-available", (event, arg) => {
      console.log("有更新");
    });
    // 没有可更新数据时
    autoUpdater.on("update-not-available", (event, arg) => {
      console.log("没有更新");
    });
    // 下载监听
    autoUpdater.on("download-progress", (progress) => {
      console.log(progress, "进度");
    });
    // 下载完成
    autoUpdater.on("update-downloaded", () => {
      console.log("done");
    });
  }
  setFeedURL(path) {
    // autoUpdater.setFeedURL(path)
    setTimeout(() => {
      this.checkUpdate();
    }, 0);
  }
  // 执行自动更新检查
  checkUpdate() {
    autoUpdater.checkForUpdates().catch((err) => {
      console.log("网络连接问题", err);
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
  // 负责向渲染进程发送信息
  Message(type, data) {
    console.log("发送消息");
    const senddata = {
      state: type,
      msg: data || "",
    };
    this.mainWindow.webContents.send("update-msg", senddata);
  }
}

export default Update;
