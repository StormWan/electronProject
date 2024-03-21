import store from "@/store";
import { getConversationList } from "./index";
// 托盘闪烁
export const handleTrayFlashIng = (data) => {
  const massage = getConversationList(data);
  store.commit("ipcRenderer", { key: "customMessage", value: data });
  // 消息免打扰
  if (!massage || massage?.[0].messageRemindType === "AcceptNotNotify") return;
  store.commit("ipcRenderer", { key: "TrayFlashIng" });
};

// 窗口抖动
export const handlesOnShake = (data) => {
  const { payload, type } = data[0];
  if (type !== "TIMCustomElem") return;
  if (payload?.data !== "dithering") return;
  const massage = getConversationList(data);
  // 消息免打扰
  if (!massage || massage?.[0].messageRemindType === "AcceptNotNotify") return;
  if (payload?.data === "dithering") store.commit("ipcRenderer", { key: "shakeWindow" });
};
