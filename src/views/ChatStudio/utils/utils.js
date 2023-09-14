import useClipboard from "vue-clipboard3";
import { fileImgToBase64Url, dataURLtoFile, urlToBase64 } from "@/utils/message-input-utils";
import {
  CreateTextMsg,
  CreateTextAtMsg,
  CreateFiletMsg,
  CreateImgtMsg,
  sendMsg,
} from "@/api/im-sdk-api/message";

const { toClipboard } = useClipboard();

export const dragControllerDiv = (node) => {
  let svgResize = document.getElementById("svgResize"); //滑块
  let svgTop = document.getElementById("svgTop"); //聊天框
  let svgDown = document.getElementById("svgDown"); //编辑器
  let svgBox = document.getElementById("svgBox"); //整个盒子
  // 按下鼠标执行
  svgResize.onmousedown = (e) => {
    let startY = e.clientY; //鼠标按下 起始Y
    svgResize.top = svgResize.offsetTop;
    // 事件会在鼠标指针移到指定的对象时发生。
    document.onmousemove = (e) => {
      let endY = e.clientY; //鼠标移动 结束得y
      //移动距离 = 原来高度+（结束y-开始y）
      let moveLen = svgResize.top + (endY - startY);
      // 最大移动距离 = 整个盒子高度 - 现在高度
      let maxT = svgBox.clientHeight - svgResize.offsetHeight;
      // 控制移动最小
      if (moveLen < 200) moveLen = 200;
      // 控制移动最大
      if (moveLen > maxT - 200) moveLen = maxT - 200;
      svgResize.style.top = moveLen;
      svgTop.style.height = moveLen - 60 + "px";
      svgDown.style.height = svgBox.clientHeight - moveLen - 5 + "px";
    };
    // 鼠标按键被松开时执行
    document.onmouseup = (evt) => {
      document.onmousemove = null;
      document.onmouseup = null;
      svgResize.releaseCapture && svgResize.releaseCapture();
      // 手动更新滚动条高度
      node.updateScrollbar();
    };
    svgResize.setCapture && svgResize.setCapture();
    return false;
  };
};

export const validatelastMessage = (msglist) => {
  // let msg = null;
  // for (let i = msglist.length - 1; i > -1; i--) {
  //   if (msglist[i].ID) {
  //     msg = msglist[i];
  //     break;
  //   }
  // }
  // return msg;
  return (
    msglist
      .slice()
      .reverse()
      .find((msg) => msg.ID) || null
  );
};

// 复制
export const handleCopyMsg = async (data) => {
  const { elements } = data;
  const { content, type } = elements[0];
  // 文本
  if (type === "TIMTextElem") {
    await toClipboard(content.text);
  }
};

export const GroupSystemNotice = (message) => {
  const groupName = message.payload.groupProfile.name || message.payload.groupProfile.groupID;
  switch (message.payload.operationType) {
    case 1:
      return `${message.payload.operatorID} 申请加入群组：${groupName}`;
    case 2:
      return `成功加入群组：${groupName}`;
    case 3:
      return `申请加入群组：${groupName}被拒绝`;
    case 4:
      return `你被管理员${message.payload.operatorID}踢出群组：${groupName}`;
    case 5:
      return `群：${groupName} 已被${message.payload.operatorID}解散`;
    case 6:
      return `${message.payload.operatorID}创建群：${groupName}`;
    case 7:
      return `${message.payload.operatorID}邀请你加群：${groupName}`;
    case 8:
      return `你退出群组：${groupName}`;
    case 9:
      return `你被${message.payload.operatorID}设置为群：${groupName}的管理员`;
    case 10:
      return `你被${message.payload.operatorID}撤销群：${groupName}的管理员身份`;
    case 12:
      return `${message.payload.operatorID}邀请你加群：${groupName}`;
    case 13:
      return `${message.payload.operatorID}同意加群：${groupName}`;
    case 14:
      return `${message.payload.operatorID}拒接加群：${groupName}`;
    case 255:
      return "自定义群系统通知: " + message.payload.userDefinedField;
  }
};

export const renderFileIcon = (fileType = "") => {
  let type;
  if (fileType == "xlsx" || fileType == "xls") {
    type = "表格";
  } else if (fileType == "doc" || fileType == "docx") {
    type = "文档";
  } else if (fileType == "pptx" || fileType == "ppt") {
    type = "ppt";
  } else if (fileType == "rar" || fileType == "zip") {
    type = "压缩包";
  } else if (fileType == "txt") {
    type = "txt";
  } else if (fileType == "pdf") {
    type = "pdf";
  } else {
    type = "通用";
  }
  return require(`@/assets/message/${type}.png`);
};

export const getMsgElemItem = (type, data, videoInfoList) => {
  switch (type) {
    case "text": {
      return "";
    }
    case "block-video": {
      return "";
    }
    case "block-file": {
      return "";
    }
    case "block-image": {
      return "";
    }
  }
};

// 动态class
export const Megtype = (elem_type) => {
  let resp = "";
  switch (elem_type) {
    case "TIMTextElem":
      resp = "message-view__text"; // 文本
      break;
    case "TIMGroupTipElem":
      resp = "message-view__tips-elem"; // 群消息提示
      break;
    case "TIMImageElem":
      resp = "message-view__img"; // 图片消息
      break;
    case "TIMFileElem":
      resp = "message-view__file"; // 文件消息
      break;
    case "TIMGroupSystemNoticeElem":
      resp = "message-view__system"; // 系统通知
      break;
    case "TIMCustomElem":
      resp = "message-view__text message-view__custom"; // 自定义消息
      break;
    default:
      resp = "";
      break;
  }
  return resp;
};

export const msgOne = (item) => {
  const { isRevoked, type } = item;
  if (isRevoked) {
    return "message-view__tips-elem";
  } else if (type == "TIMGroupTipElem") {
    return "message-view__tips-elem";
  } else {
    return "message-view__item--index";
  }
};

/**
 * 将字符串中的特殊字符进行 HTML 转义
 * @param {string} str - 待转义的字符串
 * @returns {string} - 转义后的字符串
 */
export const html2Escape = (str) => {
  // 使用对象映射，避免多个 if/else 分支
  const map = {
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;",
  };
  return str.replace(/[<>&"]/g, function (c) {
    return map[c];
  });
};

/**
 * 发送聊天消息
 * @param {string} convId - 会话ID
 * @param {string} convType - 会话类型（单聊/群聊）
 * @param {Object} options - 消息选项
 * @param {string} [options.textMsg] - 文本消息内容（可选）
 * @param {string[]} [options.aitlist] - 艾特用户列表（可选）
 * @param {Object[]} [options.files] - 文件（可选）
 * @param {string} [options.files.fileName] - 文件名（可选）
 * @param {string} [options.files.src] - 文件数据URL（可选）
 * @param {Object[]} [options.image] - 图片（可选）
 * @param {string} [options.image.src] - 图片数据URL（可选）
 * @returns {Promise<Object>} - 返回聊天消息对象
 *
 */
export async function sendChatMessage(options) {
  let TextMsg;
  let flag = true;
  const { convId, convType, textMsg, aitStr, aitlist, files, image, reply } = options;
  console.log(options)
  // 如果包含文件，则创建相应的文件消息
  if (files) {
    const { fileName, src } = files;
    let file = dataURLtoFile(src, fileName);
    TextMsg = await CreateFiletMsg({
      convId: convId,
      convType: convType,
      files: file,
    });
    flag = false;
  }
  // 如果包含图片，则创建相应的图片消息
  if (image) {
    let file = dataURLtoFile(image[0].src);
    TextMsg = await CreateImgtMsg({
      convId: convId,
      convType: convType,
      image: file,
    });
    flag = false;
  }
  // 如果包含艾特，则创建相应的艾特消息
  if (aitStr) {
    TextMsg = await CreateTextAtMsg({
      convId: convId,
      convType: convType,
      textMsg: aitStr,
      atUserList: aitlist,
      reply,
    });
  }
  // 否则创建文本消息
  else if (flag) {
    TextMsg = await CreateTextMsg({
      convId: convId,
      convType: convType,
      textMsg: textMsg,
      reply,
    });
  }
  TextMsg.status = "unSend";
  return TextMsg;
}

export const customAlert = (s, t) => {
  console.log(s, t);
  switch (t) {
    case "success":
      console.log("success");
      break;
    case "info":
      console.log("info");
      break;
    case "warning":
      console.log("warning");
      break;
    case "error":
      console.log("error");
      break;
    default:
      console.log("default");
      break;
  }
};

export const chatName = (item) => {
  switch (item.type) {
    case "C2C":
      return item.userProfile.nick;
    case "GROUP":
      return item.groupProfile.name;
    case "@TIM#SYSTEM":
      return "系统通知";
    default:
      return "";
  }
};
// 是否全员群
export const isallStaff = (item, field = 'all_staff') => {
  return item?.groupProfile?.groupCustomField?.[0]?.value == field
}