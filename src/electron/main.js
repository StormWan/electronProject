"use strict";
import { app, Menu, shell, protocol, BrowserWindow, session } from "electron";
import { isMac, setDefaultProtocol, winSingle, setupGracefulExit } from "@/electron/utils/index";
import ipcEvent from "./ipcMain/index";
import { createBrowserWindow } from "./utils/create-window";

class Background {
  constructor() {
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
    createBrowserWindow();
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
    app.on("ready", () => {
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

    app.on("open-url", (event, url) => {
      // win.webContents.send("second-instance", { });
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
