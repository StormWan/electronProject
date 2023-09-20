import { app, shell, BrowserWindow, dialog, Menu, nativeImage } from "electron";
import { windowMap } from './windows-map';
/* 置顶主窗口 */
export const mainTop = () => {
  if (windowMap.has('start')) {
    let mainView = windowMap.get('start')
    mainView.show()
    mainView.focus()
    mainView.moveTop()
  }
};

/* 隐藏主窗口 */
export const mainWinHide = () => { };

/* 主窗口最小化 */
export const minMainWindow = () => { };

/* 主窗口最大化 */
export const maxMainWindow = () => { };
