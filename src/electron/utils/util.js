import { app, shell, clipboard, BrowserWindow, dialog, Menu, nativeImage } from "electron";
const { execFile, exec } = require("child_process");
import { isWindows, isMac } from "@/electron/utils/platform";
const os = require("os");
const { version } = require("../../../package.json");
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
export const mainWinHide = () => {};

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
    const url = app.isPackaged ? "../ScreenCapture.exe" : "../static/ScreenCapture.exe";
    // const url = app.isPackaged ? '../screenshot/ScreenCapture.exe' : '../static/screenshot/ScreenCapture.exe'
    const filePath = path.join(__dirname, url);
    const screen_window = execFile(filePath);
    screen_window.on("exit", (code, stdout, stderr) => {
      console.log(code, stdout, stderr, "code, stdout, stderr");
      // 粘贴
      if (code == 7) {
        const pngs = clipboard.readImage().toPNG();
        const imgs = "data:image/png;base64," + pngs.toString("base64");
        mainView.webContents.send("captureScreenBack", imgs);
      }
    });
  } else if (isMac) {
    exec(`screencapture -w  -c`, (error, stdout, stderr) => {
      if (!error) {
        //截图完成，在粘贴板中
        const pngs = clipboard.readImage().toPNG();
        const imgs = "data:image/png;base64," + pngs.toString("base64");
        mainView.webContents.send("captureScreenBack", imgs);
      }
    });
  }
};
/* dialog */
export const showMessageBox = () => {
  const options = {
    title: "关于",
    type: "info",
    message: "Pure Admin",
    detail: `版本信息：${version}\n当前系统：${os.type()} ${os.arch()} ${os.release()}`,
    noLink: true,
    buttons: ["查看github", "确定"],
  };
  dialog
    .showMessageBox(options)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const quitApp = (type) => {};
