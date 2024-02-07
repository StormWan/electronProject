import { BrowserWindow } from "electron";
import { isWindows } from "./platform";

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
  return win;
};
