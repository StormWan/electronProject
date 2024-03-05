import store from "@/store";
const { ipcRenderer } = require("electron");

export const appIpcEmit = () => {
  ipcRenderer.on("awaken", (event, data) => {
    console.warn("awaken:", data);
    const { queryStringToObject } = require("@/utils/chat/message-input-utils");
    console.warn(queryStringToObject(data));
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
