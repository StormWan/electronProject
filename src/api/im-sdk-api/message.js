import tim from "@/utils/im-sdk/tim";
import TIM from "@tencentcloud/chat";
import emitter from "@/utils/mitt-bus";
import { getReplyMsgContent, getCustomMsgContent } from "@/utils/chat/index";

const fileUploading = (data, bar = 0) => {
  const uuid = data?.payload?.uuid || "";
  console.log("file uploading:", uuid, bar?.toFixed(0));
  emitter.emit("fileUploading", { uuid, num: bar?.toFixed(0) });
};
// 发送消息
export const sendMsg = async (params) => {
  try {
    const {
      code,
      data: { message },
    } = await tim.sendMessage(params);
    return {
      code,
      message,
    };
  } catch (error) {
    console.log(error);
  }
};
// 创建自定义消息
export const createCustomMsg = async (params) => {
  const { convId, convType, textMsg, customType } = params;
  const customData = getCustomMsgContent('loading')
  return tim.createCustomMessage({
    to: convId,
    conversationType: convType,
    payload: {
      data: customType,
      description: customData,
      extension: "",
    },
  });
};
// 创建文本消息
export const CreateTextMsg = async (params) => {
  const { convId, convType, textMsg, reply } = params;
  const replyMsgContent = getReplyMsgContent(reply);
  let message = await tim.createTextMessage({
    to: convId, // 接受放ID
    conversationType: convType, // 会话类型 TIM.TYPES.CONV_C2C
    payload: {
      text: textMsg,
    },
    cloudCustomData: replyMsgContent,
  });
  return message;
};
// 创建@ 提醒功能的文本消息
export const CreateTextAtMsg = async (params) => {
  const { convId, convType, textMsg, atUserList, reply } = params;
  const replyMsgContent = getReplyMsgContent(reply);
  let message = await tim.createTextAtMessage({
    to: convId,
    conversationType: convType || TIM.TYPES.CONV_GROUP,
    payload: {
      text: textMsg, // '@denny @lucy @所有人 今晚聚餐，收到的请回复',
      atUserList: atUserList, // ['denny', 'lucy', TIM.TYPES.MSG_AT_ALL] // 'denny' 'lucy' 都是 userID，而非昵称
    },
    cloudCustomData: replyMsgContent,
  });
  return message;
};
// 创建图片消息
export const CreateImgtMsg = (params) => {
  const { convId, convType, image } = params;
  const message = tim.createImageMessage({
    to: convId,
    conversationType: convType,
    payload: {
      file: image,
    },
    onProgress: function (event) {
      console.log("file uploading:", event);
    },
  });
  return message;
};
// 创建文件消息
export const CreateFiletMsg = async (params) => {
  const { convId, convType, files } = params;
  const message = tim.createFileMessage({
    to: convId,
    conversationType: convType,
    payload: {
      file: files,
    },
    // 文件上传进度
    onProgress: (event) => {
      fileUploading(message, event * 100);
    },
  });
  return message;
};
// 创建合并消息
export const createMergerMsg = async (params) => {
  const { convId, convType, List, title = "", abstractList } = params;
  return tim.createMergerMessage({
    to: convId,
    conversationType: convType,
    payload: {
      messageList: List,
      title: title || "聊天记录",
      abstractList: abstractList || ["allen: 666", "iris: [图片]"],
      compatibleText: "当前版本不支持",
    },
    // 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
    // cloudCustomData: 'your cloud custom data'
  });
};
// 创建转发消息
export const createForwardMsg = async (params) => {
  const { convId, convType, message } = params;
  const forwardMsg = await tim.createForwardMessage({
    to: convId,
    conversationType: convType,
    payload: message,
  });
  return forwardMsg;
};
