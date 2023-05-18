import http from "@/utils/http/index";
import axios from "axios";
import qs from "qs";
import { Cloud } from "laf-client-sdk";
import { restSendMsg } from "@/api/rest-api";

export const createForData = ({ name, type, size, fileName, uploadedSize = 0, file }) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("type", type);
  formData.append("size", size);
  formData.append("fileName", fileName);
  formData.append("uploadedSize", uploadedSize);
  formData.append("file", file);
  return formData;
};

// 文件上传
export const uploadFiles = async (params) => {
  const { files } = params || {};
  if (!files) return;
  let uploadedSize = 0;
  let uploadedResult = null;
  const { name, type, size } = files || {};
  const fileName = new Date().getTime() + "_" + name;

  const formData = createForData({
    name,
    type,
    size,
    fileName,
    uploadedSize,
    file: files,
  });
  try {
    uploadedResult = await http({
      url: "/upload_files",
      method: "post",
      data: formData, // body参数
      onUploadProgress: (progressEvent) => {
        let persent = ((progressEvent.loaded / progressEvent.total) * 100) | 0; //上传进度百分比
        console.log(persent + "%");
      },
    });
    console.log(uploadedResult);
  } catch (error) {
    console.log(error);
  }
};

// 发送消息回调
export const SendMessageCd = async (params) => {
  const { sender, receiver, message } = params;
};
// chatGpt
export const chatGpt = async (params) => {
  const { From, To, content } = params;
  if (To !== "R00001") return;
  // console.log(process.env.VUE_APP_API_URL);
  const { data } = await axios({
    url: process.env.VUE_APP_API_URL ?? "",
    method: "post",
    data: {
      text: {
        content: content,
      },
    },
  });
  if (data) {
    await restSendMsg({ To, From, content: data });
  } else {
    await restSendMsg({ To, From, content: "待开发" });
  }
};
