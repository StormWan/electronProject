import http from "@/utils/http/index";
import { isRobot } from "@/utils/chat/index";
import { restApi } from "./rest";
import { throttle, cloneDeep } from "lodash-es";
import store from "@/store";
import { useAccessStore } from "@/api/openai/constant";
import { api } from "@/api/openai/api";
import { createTextMsg } from "@/api/im-sdk-api/index";
import { CHATGPT_ROBOT } from "@/constants/index";

export const createForData = ({ files }) => {
  const formData = new FormData();
  formData.append("file", files);
  return formData;
};
// 文件上传
export const uploadFiles = async (params) => {
  const { files } = params || {};
  if (!files) return;
  let uploadedResult = null;
  const formData = createForData({ files });
  try {
    uploadedResult = await http({
      url: "/upload_files",
      method: "post",
      data: formData,
      onUploadProgress: (progressEvent) => {
        let persent = ((progressEvent.loaded / progressEvent.total) * 100) | 0; //上传进度百分比
        console.log(persent + "%");
      },
    });
    console.log(uploadedResult);
    return uploadedResult;
  } catch (error) {
    console.log(error);
  }
};

// 测试环境 模拟im消息回调
export const imCallback = async (params) => {
  console.log(params, "imCallback");
  const { Text, From, To, type } = params;
  if (To !== CHATGPT_ROBOT) return;
  sendMessages(params);
};

export const sendMsg = async (params, message) => {
  return await restApi({
    params: {
      To_Account: params.From,
      From_Account: params.To,
      Text: message || "loading...",
    },
    funName: "restSendMsg",
  });
};

const fnCreateTextMsg = (params) => {
  const msg = createTextMsg({ convId: params.From, textMsg: "｜" });
  msg.conversationID = `C2C${params.From}`;
  msg.avatar = "https://ljx-1307934606.cos.ap-beijing.myqcloud.com/open-ai-icon.png";
  msg.flow = "in";
  msg.to = params.From;
  msg.from = params.To;
  msg.nick = "AI机器人";
  msg.status = "success";
  return msg;
};

const updataMessage = (msg, message) => {
  if (!msg) return;
  msg.payload.text = message;
  store.commit("SET_HISTORYMESSAGE", {
    type: "UPDATE_MESSAGES",
    payload: {
      convId: `C2C${CHATGPT_ROBOT}`,
      message: cloneDeep(msg),
    },
  });
};

export const sendMessages = async (params) => {
  const msg = fnCreateTextMsg(params);
  await api.chat({
    messages: params.messages,
    config: { model: useAccessStore().model, stream: true },
    onUpdate(message) {
      console.log("[chat] onUpdate:", message);
      store.commit("EMITTER_EMIT", { key: "updataScroll", value: "instantly" });
      updataMessage(msg, message);
    },
    async onFinish(message) {
      console.log("[chat] onFinish:", message);
      store.commit("EMITTER_EMIT", { key: "updataScroll", value: "instantly" });
      if (message) {
        updataMessage(msg, message);
        await sendMsg(params, message);
      } else {
        await sendMsg(params, "网络异常请稍后再试");
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
