const { contextBridge } = require("electron");

// contextBridge.exposeInMainWorld("platform", process.platform);
// contextBridge.exposeInMainWorld("IS_ELECTRON", true);
console.log("预加载文件preload.js执行");
