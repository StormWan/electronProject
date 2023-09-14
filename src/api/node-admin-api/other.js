import http from "@/utils/http/index";
import axios from "axios";
import qs from "qs";

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

// im消息回调
export const imCallback = (params) => {
  console.log(params, "imCallback");
  const { Text, From, To, type } = params;
  if (To !== "R00001") return;
  const data = {
    MsgBody: [
      {
        MsgType: type,
        MsgContent: {
          Text: Text,
        },
      },
    ],
    CallbackCommand: "C2C.CallbackAfterSendMsg",
    From_Account: From,
    To_Account: To,
    MsgRandom: 707438945,
    MsgSeq: 350821200,
    MsgTime: 1686709194,
    SupportMessageExtension: 0,
    MsgKey: "350821200_707438945_1686709194",
    OnlineOnlyFlag: 0,
    SendMsgResult: 0,
    ErrorInfo: "send msg succeed",
    UnreadMsgNum: 1,
  };
  return http({
    url: "/imCallback",
    method: "post",
    data: data,
  });
};
