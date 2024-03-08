import store from "@/store";
const { ipcRenderer } = require("electron");

export const appIpcEmit = () => {
  ipcRenderer.on("awaken", (event, data) => {
    console.log("awaken:", data);
    const { queryStringToObject } = require("@/utils/chat/message-input-utils");
    console.log(queryStringToObject(data));
  });
  ipcRenderer.on("updateMsg", (event, { data, type }) => {
    console.log(type, data);
    let downloadComplete = false; //下载完成
    let downloadProgress = 0; //下载进度
    let hasupdates = false; //是否更新可用
    if (type === "update-available") {
      // 有更新 hasupdates true
    } else if (type === "update-not-available") {
      // 无更新 hasupdates = false
    }
    if (!hasupdates) return;
    // 下载进度
    if (type === "download-progress") {
      const { percent } = data;
      downloadProgress = parseInt(percent) || 0;
    } else if (type === "done") {
      downloadProgress = 100;
      downloadComplete = true;
    }
  });

  // const options = {
  //   name: "customCardWin",
  //   path: "/desktop",
  //   customSize: {
  //     width: 320,
  //     height: 80,
  //     minWidth: 260,
  //     minHeight: 80,
  //   },
  // };
  // store.commit("ipcRenderer", { method: "invoke", key: "loadWindowInPool", value: options });
};
