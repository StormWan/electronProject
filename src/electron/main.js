"use strict";
import { app, Menu, shell, dialog, protocol, BrowserWindow } from "electron";
import { isMac, isWindows, isCreateTray, isDevelopment } from "@/electron/utils/platform";
import electronLocalshortcut from "electron-localshortcut";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import path from "path";
// const clc = require("cli-color");
// const log = (text) => {
//   console.log(`${clc.blueBright("[background.js]")} ${text}`);
// };

// log(`process.env环境变量: ${process.env}`);

// 注册协议
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // 隐藏菜单栏
  Menu.setApplicationMenu(null);
  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 1038,
    height: 706,
    minWidth: 1038,
    minHeight: 706,
    webPreferences: {
      // preload: path.join(__dirname, './preload/index.js'),
      // 在上阅读更多信息https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // 否启用 Node.js 的集成
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      // 是否启用渲染进程的上下文隔离
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      // 是否启用渲染进程访问 Electron 的 remote 模块
      // enableRemoteModule: true,
    },
  });
  electronLocalshortcut.register(win, "CommandOrControl+Shift+i", function () {
    // 为窗口注册ctrl+Shift+i 唤起控制台
    win.webContents.openDevTools();
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // 如果处于开发模式，则加载开发服务器的url
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    // 生产环境下加载打包后的文件
    createProtocol("app");
    win.loadURL("app://./index.html");
  }
}

// 关闭所有窗口后退出
app.on("window-all-closed", () => {
  // 在macOS上，应用程序及其菜单栏通常保持活动状态，直到用户使用Cmd+Q明确退出
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // 在macOS上，当 dock图标被单击，并且没有其他窗口打开。
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

//此方法将在Electron完成后调用 初始化，并准备创建浏览器窗口。 某些API只能在此事件发生后使用。
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// 允许加载远程资源
app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");

// 在开发模式下，应父进程的请求退出。
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
