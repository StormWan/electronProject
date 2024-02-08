import electronLocalshortcut from "electron-localshortcut";

export const initShortcut = (win = null) => {
  if (win) {
    electronLocalshortcut.register(win, "CommandOrControl+Shift+i", () => {
      // 为窗口注册ctrl+Shift+i 唤起控制台
      win.webContents.openDevTools();
    });
  }
};
