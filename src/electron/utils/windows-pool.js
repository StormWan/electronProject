const { exec } = require("child_process");
const { BrowserWindow, ipcMain } = require("electron");
const { windowMap } = require("./windows-map");
const { isDevelopment, isWindows, webpackDevServerUrl } = require("./platform");

const winURL = isDevelopment ? webpackDevServerUrl : "app://./index.html";
const windowItems = [];
const poolSize = 1;
const defaultConfig = {
  width: 320,
  height: 80,
  minWidth: 260,
  minHeight: 80,
  maxWidth: 320,
  maxHeight: 800,
  show: false,
  frame: false, // 边框
  hidden: true,
  transparent: true, // 使窗口透明
  autoHideMenuBar: true, // 自动隐藏菜单栏，除非按了Alt键
  disableAutoHideCursor: true, // 是否在打字时隐藏光标
  alwaysOnTop: true, //窗口是否永远在别的窗口的上面
  resizable: isDevelopment,
  skipTaskbar: true, // 是否在任务栏中显示窗口
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    enableRemoteModule: true,
  },
};

class WindowPool {
  constructor() {
    this.init();
  }

  init() {
    this.windowItems = windowItems;
    for (let i = 0; i < poolSize; i++) {
      windowItems.push(new WindowPoolItem());
    }
    ipcMain.handle("loadWindowInPool", (event, options) => {
      if (this.isWindowInUse(options)) return;
      this.consumeWindow(options);
      const win = windowMap.get(options.name);
      win.webContents.openDevTools();
    });
    ipcMain.handle("setIgnore", (event, options) => {
      const { bol, forward } = options;
      const win = windowMap.get("customCardWin");
      if (win) win.setIgnoreMouseEvents(bol, forward);
    });
  }
  /**
   * 检查窗口是否正在使用
   * @param {Object} options - 窗口选项
   * @param {string} options.name - 窗口名称
   * @returns {boolean} - 如果窗口正在使用返回 true，否则返回 false
   */
  isWindowInUse(options) {
    const win = windowMap.get(options.name);
    win && win.focus();
    return win ? true : false;
  }

  consumeWindow(options) {
    const item = windowItems.find((v) => !v.options);
    const index = windowItems.indexOf(item);
    if (item) {
      item.use(options);
      windowItems.splice(index, 1);
      windowItems.push(new WindowPoolItem());
    }
  }
}

class WindowPoolItem {
  constructor() {
    this.window = new BrowserWindow(defaultConfig);
    this.loadUrl(this.window, { type: 0, path: "/blank" });
  }

  initEvent() {
    this.window.once("close", () => {
      const customName = this.window.customName;
      windowMap.has(customName) && windowMap.delete(customName);
    });
  }

  use(options) {
    this.window.customName = options.name;
    windowMap.set(options.name, this.window);
    this.effectParam(options);
    this.initEvent();
    this.loadUrl(this.window, options);
  }

  effectParam(options) {
    this.options = options;
    const { isMaximized, customSize } = options;
    if (isMaximized) {
      this.window.maximize();
    }
    if (customSize) {
      const { width, height, minWidth = 0, minHeight = 0 } = customSize;
      this.window.setSize(Math.floor(width), Math.floor(height));
      this.window.setMinimumSize(Math.floor(minWidth), Math.floor(minHeight));
    }
    this.window.show();
    this.window.focus();
  }

  loadUrl(window, options) {
    window.loadURL(winURL + `#${options.path}`);
  }
}

export const initWindowPool = () => {
  new WindowPool();
};
