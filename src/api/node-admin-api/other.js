import http from "@/utils/http/index";
import { isRobot } from "@/utils/chat/index";
import axios from "axios";
import qs from "qs";

function fetchData(url) {
  let answer = "";
  const eventSource = new EventSource(url);
  eventSource.addEventListener("message", async (event) => {
    console.log(event);
    if (event.data === "[DONE]") {
      eventSource.close();
      return;
    }
    const data = JSON.parse(event.data);
    if (data.choices[0].delta.content) {
      answer += data.choices[0].delta.content;
      console.log(answer);
    }
  });
  eventSource.addEventListener("error", (err) => {
    eventSource.close();
  });
}

function fetchStream(url) {
  const decoder = new TextDecoder("utf-8");
  fetch(url)
    .then((response) => {
      const reader = response.body.getReader();
      let answer = "";
      function read() {
        return reader.read().then(({ done, value }) => {
          if (done) {
            console.log("Stream complete");
            return;
          }
          const chunk = decoder.decode(value);
          answer += chunk;
          console.log(answer);
          return read();
        });
      }
      return read();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
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
export const imCallback = (params) => {
  console.log(params, "imCallback");
  const { Text, From, To, type } = params;
  if (!isRobot(To)) return;
  const data = {
    MsgBody: [
      {
        MsgType: type,
        MsgContent: {
          Text: Text,
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
  return http({
    url: "/imCallback",
    method: "post",
    data: data,
  });
};

export const stream = () => {
  const url = process.env.VUE_APP_PROXY_DOMAIN_REAL + "stream";
  // fetchData(url)
  fetchStream(url);
};
