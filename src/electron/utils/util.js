import { app, shell, clipboard, BrowserWindow, dialog, Menu, nativeImage } from "electron";
const { execFile, exec } = require('child_process')
import { isWindows, isMac } from "@/electron/utils/platform";
import path from "path";

const viewSize = {
  login: { width: 380, height: 550 },
  main: { width: 1038, height: 706 },
};
/* 置顶主窗口 */
export const mainTop = () => {
  const mainView = global.mainWin;
  mainView.show();
  mainView.focus();
  mainView.moveTop();
  mainView.center();
};

/* 隐藏主窗口 */
export const mainWinHide = () => { };

/* 主窗口最小化 */
export const minMainWindow = () => {
  const mainView = global.mainWin;
  mainView.minimize();
};

/* 主窗口最大化 */
export const maxMainWindow = () => {
  const mainView = global.mainWin;
  if (mainView.isMaximized()) {
    mainView.unmaximize();
  } else {
    mainView.maximize();
  }
};

/* 外部浏览器打开 */
export const openExternal = (url) => {
  shell.openExternal(url);
};
/* 设置主窗口尺寸 */
export const setmainViewSize = (type) => {
  const data = viewSize[type];
  const mainView = global.mainWin;
  const { width, height } = data;
  mainView.setMinimumSize(width, height);
  mainView.setSize(width, height);
  // mainView.center();
};
/* 截屏 */
export const handleScreenshot = () => {
  const mainView = global.mainWin;
  if (isWindows) {
    const url = app.isPackaged ? '/screenshot/QQSnapShot.exe' : './static/screenshot/screencapture.exe'
    const filePath = path.join(__dirname, '..', url)
    const screen_window = execFile(filePath)
    screen_window.on('exit', (err, stdout, stderr) => {
      console.log(err, stdout, stderr, 'err, stdout, stderr')
      const pngs = clipboard.readImage().toPNG()
      const imgs = 'data:image/png;base64,' + pngs.toString('base64')
      mainView.webContents.send('captureScreenBack', imgs)
    })
  } else if (isMac) {

  }

}

export const quitApp = (type) => { };
