import { app, BrowserWindow } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { isWindows, isTest, webpackDevServerUrl } from "./platform";
import { windowMap } from "./windows-map";
import { initShortcut } from "../shortcut/index";

export const createBrowserWindow = (_options) => {
  const options = {
    ...global.mainWinOptions, // mainWinOptions loginWinOptions
    show: false,
    frame: isWindows ? false : true,
    titleBarStyle: isWindows ? "hiddenInset" : "default",
    // 在上阅读更多信息https://www.electronjs.org/docs/latest/tutorial/context-isolation
    webPreferences: {
      // 在外部浏览器中打开链接
      nativeWindowOpen: true,
      // 否启用 Node.js 的集成
      nodeIntegration: true,
      // 是否启用渲染进程的上下文隔离
      contextIsolation: false,
      // 是否启用渲染进程访问 Electron 的 remote 模块
      enableRemoteModule: true,
      // 预加载文件preload
      // preload: path.join(__dirname, "preload.js"),
    },
  };
  // 创建浏览器窗口
  const win = new BrowserWindow(options);
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
  win.webContents.on("did-finish-load", () => {
    let argv = process.argv;
    // 直接打开软件的话开发环境的启动参数为2，安装包为1，大于这个数的话说明是通过伪协议拉起软件的
    if (argv.length > (app.isPackaged ? 1 : 2)) {
      app.emit("second-instance", null, argv);
    }
  });
  win.on("ready-to-show", () => {
    initShortcut(win);
    win.show();
  });
  //  窗口最大化时触发
  win.on("maximize", () => {
    win.webContents.send("toggleSize", { type: "maximize", win: "mainWin" });
  });
  // 当窗口从最大化状态退出时触发
  win.on("unmaximize", () => {
    win.webContents.send("toggleSize", { type: "unmaximize", win: "mainWin" });
  });
  global.mainWin = win;
  windowMap.set("mainWin", win);
};
