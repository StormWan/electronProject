import http from "@/utils/http/index";
import { isRobot } from "@/utils/chat/index";
import { restApi } from "./rest";
import { throttle } from "lodash-es";
import store from "@/store";
import { useAccessStore } from "@/api/openai/constant";
import { api } from "@/api/openai/api";
import { nextTick } from "vue";

function fnMsgBody(data) {
  const { type, Text, To, From } = data;
  return {
    MsgBody: [
      {
        MsgType: type,
        MsgContent: {
          Text,
        },
      },
    ],
    SyncOtherMachine: 2,
    CallbackCommand: "Bot.OnC2CMessage",
    From_Account: From,
    To_Account: To,
    MsgRandom: 707438945,
    MsgSeq: 350821200,
    MsgTime: 1686709194,
    SupportMessageExtension: 0,
    MsgKey: "1349190009_53349086_1698387209",
    OnlineOnlyFlag: 0,
    SendMsgResult: 0,
    ErrorInfo: "send msg succeed",
    UnreadMsgNum: 1,
  };
}

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
  if (!isRobot(To)) return;
  sendMessages(params);
  // const data = fnMsgBody({ Text, From, To, type })
  // return http({ url: "/imCallback", method: "post", data });
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
export const modifyMsg = throttle(async (params, message) => {
  const { From_Account, To_Account, MsgKey } = params;
  if (!message) return;
  restApi({
    params: { From_Account, To_Account, MsgKey, message },
    funName: "modifyC2cMsg",
  })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}, 50);

export const sendMessages = async (params) => {
  let MsgKey = "";
  const res = await sendMsg(params);
  MsgKey = res.MsgKey;
  await api.chat({
    messages: params.messages,
    config: { model: useAccessStore().model, stream: true },
    onUpdate(message) {
      console.log(message, "onUpdate");
      // MsgKey && modifyMsg({ From_Account: params.From, To_Account: params.To, MsgKey }, message);
      store.commit("updataScroll", "instantly");
    },
    onFinish(message) {
      console.log(message, "onFinish");
      MsgKey && modifyMsg({ From_Account: params.From, To_Account: params.To, MsgKey }, message);
    },
    onError(error) {
      console.error("[Chat] failed ", error);
    },
    onController(controller) {
      console.log(controller, "onController");
    },
  });
};
