"use strict";
import { app, Menu, shell, protocol, BrowserWindow, session } from "electron";
import {
  isMac,
  isWindows,
  isTest,
  isDevelopment,
  webpackDevServerUrl,
  electronNodeIntegration,
} from "@/electron/utils/index";
import electronLocalshortcut from "electron-localshortcut";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import ipcEvent from "./ipcMain/index";
import {
  setDefaultProtocol,
  winSingle,
  setupGracefulExit,
  createBrowserWindow,
} from "./utils/index";
import path from "path";

class Background {
  constructor() {
    this.window = null;
    this.init();
  }
  init() {
    // 确保应用程序是单例的。
    winSingle();
    // handle app events
    this.handleAppEvents();
  }
  createWindow(_options) {
    // 用于控制菜单栏的可见性，即是否显示菜单栏。它可以在应用程序运行时动态地设置菜单栏的显示或隐藏状态。
    Menu.setApplicationMenu(null);
    const options = {
      width: 1038,
      height: 706,
      minWidth: 1038,
      minHeight: 706,
      // width: 380,
      // height: 550,
      // minWidth: 380,
      // minHeight: 550,
      frame: isWindows ? false : true,
      titleBarStyle: isWindows ? "hiddenInset" : "default",
      webPreferences: {
        // 在上阅读更多信息https://www.electronjs.org/docs/latest/tutorial/context-isolation
        preload: path.join(__dirname, "preload.js"),
        // 在外部浏览器中打开链接
        nativeWindowOpen: true,
        // 否启用 Node.js 的集成
        nodeIntegration: true,
        // 是否启用渲染进程的上下文隔离
        contextIsolation: false,
        // 是否启用渲染进程访问 Electron 的 remote 模块
        enableRemoteModule: true,
      },
    };
    // 创建浏览器窗口
    const win = new BrowserWindow(options);
    // const win = createBrowserWindow();
    this.window = win;
    global.mainWin = win;
    // 用于定义菜单栏的内容和行为，包括菜单项、子菜单、快捷键等。它是在应用程序启动时设置菜单栏的一种方式。
    // win.setMenuBarVisibility(false);
    electronLocalshortcut.register(win, "CommandOrControl+Shift+i", function () {
      // 为窗口注册ctrl+Shift+i 唤起控制台
      win.webContents.openDevTools();
    });
    if (webpackDevServerUrl) {
      // 如果处于开发模式，则加载开发服务器的url
      win.loadURL(webpackDevServerUrl);
      if (!isTest) win.webContents.openDevTools();
    } else {
      // 生产环境下加载打包后的文件
      createProtocol("app");
      win.loadURL("app://./index.html");
    }
    // 在窗口加载完成后
    win.webContents.on("did-finish-load", () => {});
  }
  handleAppEvents() {
    // 禁用 Chrome 扩展加载
    app.commandLine.appendSwitch("disable-extensions");
    // 允许加载远程资源
    app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");
    // 关闭所有窗口后退出
    app.on("window-all-closed", () => {
      // 在macOS上，应用程序及其菜单栏通常保持活动状态，直到用户使用Cmd+Q明确退出
      if (!isMac) {
        app.quit();
      }
    });

    app.on("activate", () => {
      // 在macOS上，当 dock图标被单击，并且没有其他窗口打开。
      if (BrowserWindow.getAllWindows().length === 0) this.createWindow();
    });

    //此方法将在Electron完成后调用 初始化，并准备创建浏览器窗口。 某些API只能在此事件发生后使用。
    app.on("ready", async () => {
      setupGracefulExit();
      this.createWindow();
      ipcEvent();
      // 注册协议
      setDefaultProtocol();
      session.defaultSession.maxConnections = 10;
    });

    app.on("web-contents-created", (e, webContents) => {
      // 自定义链接的打开行为
      webContents.setWindowOpenHandler((data) => {
        shell.openExternal(data.url);
        return {
          action: "deny",
          overrideBrowserWindowOptions: {
            show: false,
            autoHideMenuBar: true,
          },
        };
      });
    });

    // 用于开发环境 测试热更新
    // Object.defineProperty(app, 'isPackaged', {
    //   get() {
    //     return true;
    //   }
    // });
  }
}

new Background();
