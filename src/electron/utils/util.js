import { app, shell, clipboard, dialog, screen } from "electron";
import { isWindows, isMac, isProduction } from "@/electron/utils/index";
const os = require("os");
const path = require("path");
const { windowMap } = require("./windows-map");
const { execFile, exec } = require("child_process");
const { version } = require("../../../package.json");

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

export const toggleLogIn = (type) => {
  console.log(type);
  if (global.mainWin) {
    // global mainWinOptions; mainWinOptions
    // type  login main
    // global.mainWin.hide();
    setTimeout(() => {
      if (type === "login") {
        const { width, height } = global.loginWinOptions;
        global.mainWin.setMinimumSize(width, height);
        global.mainWin.setSize(width, height);
        // global.mainWin.show();
        global.mainWin.center();
      } else {
        const { width, height } = global.mainWinOptions;
        global.mainWin.setMinimumSize(width, height);
        global.mainWin.setSize(width, height);
        // global.mainWin.show();
        global.mainWin.center();
      }
    }, 200);
  }
};

export const customMessage = (data) => {
  if (windowMap.has("mainWin")) {
    // 获取屏幕尺寸
    let screenSize = screen.getPrimaryDisplay().workAreaSize;
    let mainView = windowMap.get("customCardWin");
    if (!mainView) return;
    mainView.webContents.send("customCardNotice", data);
    const offsetX = screenSize.width - mainView.getBounds().width - 10;
    const offsetY = screenSize.height - mainView.getBounds().height - 5;
    mainView.setBounds({
      x: parseInt(offsetX),
      y: parseInt(offsetY),
    });
    //显示但不聚焦窗口
    mainView.showInactive();
  }
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
/* 窗口抖动 */
export const shakeWindow = () => {
  const win = global.mainWin;
  const originalPosition = win.getPosition();
  const shakeDistance = 10;
  const shakeDuration = 100;
  const shakeInterval = 20;

  const originalSize = win.getSize();
  const [originalWidth, originalHeight] = originalSize;

  let startTime = Date.now();

  const shakeIntervalId = setInterval(() => {
    const elapsedTime = Date.now() - startTime;

    if (elapsedTime >= shakeDuration) {
      clearInterval(shakeIntervalId);
      win.setPosition(originalPosition[0], originalPosition[1]);
      win.setSize(originalWidth, originalHeight);
      return;
    }

    const progress = elapsedTime / shakeDuration;
    const angle = progress * Math.PI * 2;
    const offsetX = Math.round(Math.sin(angle) * shakeDistance);
    const offsetY = Math.round(Math.cos(angle) * shakeDistance);

    win.setPosition(originalPosition[0] + offsetX, originalPosition[1] + offsetY);
  }, shakeInterval);
};
/**
 * 注册协议
 * 并通过浏览器打开 PureApp 程序 pure://
 * pure://groupShare?groupID=@TGS#2P5E55UNV
 */
export const setDefaultProtocol = () => {
  if (isProduction) {
    const agreement = "pure"; // 自定义协议名
    let isSet = false; // 是否注册成功
    app.removeAsDefaultProtocolClient(agreement); // 每次运行都删除自定义协议 然后再重新注册
    isSet = app.setAsDefaultProtocolClient(agreement);
    console.log("注册协议", isSet ? "成功" : "失败");
  }
};

export const handleAfterReady = () => {};
/** 在开发模式下，应父进程的请求退出。 */
export const setupGracefulExit = async () => {
  if (isWindows) {
    process.on("message", (data) => {
      if (data === "graceful-exit") app.quit();
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
};

export const quitApp = (type) => {};
