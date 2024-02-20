import { app, BrowserWindow } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { isWindows, isTest, webpackDevServerUrl } from "./platform";
import { windowMap } from "./windows-map";
import { initShortcut } from "../shortcut/index";

export const createBrowserWindow = (_options) => {
  const options = {
    width: 1038,
    height: 706,
    minWidth: 1038,
    minHeight: 706,
    // width: 380,
    // height: 550,
    // minWidth: 380,
    // minHeight: 550,
    show: false,
    frame: isWindows ? false : true,
    titleBarStyle: isWindows ? "hiddenInset" : "default",
    webPreferences: {
      // 在上阅读更多信息https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // preload: path.join(__dirname, "preload.js"),
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
  global.mainWin = win;
  windowMap.set("main", win);
  // 用于定义菜单栏的内容和行为，包括菜单项、子菜单、快捷键等。它是在应用程序启动时设置菜单栏的一种方式。
  // win.setMenuBarVisibility(false);
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
  win.webContents.once("did-finish-load", () => {
    // 直接打开软件的话开发环境的启动参数为2，安装包为1，大于这个数的话说明是通过伪协议拉起软件的
    if (process.argv.length > (app.isPackaged ? 1 : 2)) {
      app.emit("second-instance", null, process.argv);
    }
  });
  win.on("ready-to-show", () => {
    initShortcut(win);
    win.show();
  });
};
