import { app, protocol } from "electron";
import { isDevelopment } from "./platform";

export const winSingle = () => {
  // 注册协议
  // protocol.registerSchemesAsPrivileged([
  //   { scheme: "app", privileges: { secure: true, standard: true } },
  // ]);
  if (isDevelopment) return;
  // 请求单实例锁
  const gotTheLock = app.requestSingleInstanceLock();
  // 点击图标启动时检测窗口是否存在，存在则打开
  if (!gotTheLock) {
    app.quit();
  } else {
    // 外部协议被点击的事件;
    app.on("second-instance", (event, argv) => {
      const win = global.mainWin;
      if (win) {
        // 直接把伪协议链接发送给渲染进程，可以获取通过协议携带的参数
        win.webContents.send("renderer-scheme", argv[argv.length - 1]);
        if (win.isMinimized()) win.restore();
        if (win.isVisible()) {
          win.focus();
        } else {
          win.show();
        }
      } else {
        // 如果主窗口不存在,重启应用
        app.relaunch();
        app.exit(0);
      }
    });
  }
};
