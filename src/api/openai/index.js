import store from "@/store";
import emitter from "@/utils/mitt-bus";
import { restApi } from "@/api/node-admin-api/rest";
import { cloneDeep } from "lodash-es";
import { useAccessStore } from "@/api/openai/constant";
import { ClientApi } from "@/api/openai/api";
import { createCustomMsg } from "@/api/im-sdk-api/index";
import { CHATGPT_ROBOT } from "@/constants/index";

const restSendMsg = async (params, message) => {
  return await restApi({
    params: {
      To_Account: params.from,
      From_Account: params.to,
      Text: message || "loading...",
    },
    funName: "restSendMsg",
  });
};

const updataMessage = (msg, message = "") => {
  if (!msg) return;
  msg.payload.text = message;
  store.commit("SET_HISTORYMESSAGE", {
    type: "UPDATE_MESSAGES",
    payload: { convId: `C2C${CHATGPT_ROBOT}`, message: cloneDeep(msg) },
  });
};

const fnCreateLodMsg = (params) => {
  const { to, from } = params;
  const msg = createCustomMsg({ convId: from, customType: "loading" });
  msg.conversationID = `C2C${from}`;
  msg.avatar = "https://ljx-1307934606.cos.ap-beijing.myqcloud.com/open-ai-icon.png";
  msg.flow = "in";
  msg.to = from;
  msg.from = to;
  msg.nick = "";
  msg.status = "success";
  updataMessage(msg);
  msg.type = "TIMTextElem";
  return msg;
};

export const chatService = async (params) => {
  const api = new ClientApi();
  const { messages, chat } = params;
  const msg = fnCreateLodMsg(chat);
  await api.llm.chat({
    messages,
    config: { model: useAccessStore().model, stream: true },
    onUpdate(message) {
      console.log("[chat] onUpdate:", message);
      emitter.emit("updataScroll", "instantly");
      updataMessage(msg, message);
    },
    async onFinish(message) {
      console.log("[chat] onFinish:", message);
      emitter.emit("updataScroll", "instantly");
      if (message) {
        updataMessage(msg, message);
        await restSendMsg(chat, message);
      } else {
        await restSendMsg(chat, "网络异常请稍后再试");
      }
    },
    onError(error) {
      console.error("[chat] failed:", error);
    },
    onController(controller) {
      console.log("[chat] onController:", controller);
    },
  });
};
