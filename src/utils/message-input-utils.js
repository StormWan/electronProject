/**
 * 将二进制数据转换为 base64 URL 格式
 * @param {string | Buffer} data 要转换的数据，可以是一个字符串或一个 Buffer 对象
 * @param {string} type 数据类型，默认为 "jpeg"
 * @returns {string} 转换后的 base64 URL
 * @throws {Error} 如果缺少数据或数据不是字符串或缓冲区，则会抛出错误
 */
export const bufferToBase64Url = (data, type = "jpeg") => {
  if (!data) {
    throw new Error("缺少数据");
  }
  if (typeof data === "string") {
    data = Buffer.from(data, "binary");
  } else if (!(data instanceof Buffer)) {
    throw new Error("数据必须是字符串或缓冲区");
  }
  return `data:image/${type};base64,${data.toString("base64")}`;
};

/**
 * 将给定的图片文件转换为 base64 编码的 URL
 * @param {File} file - 要转换的图片文件
 * @returns {Promise<string>} - 返回一个 Promise，解析为图片的 base64 编码的 URL
 */
export const fileImgToBase64Url = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Value = reader.result;
      resolve(base64Value);
    };
    reader.readAsDataURL(file);
  });
};

/**
 * 将远程图片 URL 转换为 base64 格式
 * @param {string} url 图片的 URL
 * @returns {Promise<string>} Promise 对象，resolve 后会返回转换后的 base64 数据
 * @throws {Error} 如果转换失败，则会抛出错误
 */
export const urlToBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = this.naturalWidth;
      canvas.height = this.naturalHeight;
      canvas.getContext("2d").drawImage(image, 0, 0);
      const result = canvas.toDataURL("image/png");
      resolve(result);
    };
    image.setAttribute("crossOrigin", "Anonymous");
    image.src = url;
    image.onerror = () => {
      reject(new Error("转换失败"));
    };
  });
};

/**
 * 获取图片的类型
 * @param {string} str 图片的 URL 或文件名
 * @returns {string} 图片的类型（不包括前缀点号），例如 "png"、"jpg"、"gif" 等
 * @throws {Error} 如果无法从输入字符串中提取图像类型，则会抛出错误
 */
export const getImageType = (str) => {
  const reg = /\.(png|jpg|gif|jpeg|webp)$/;
  const match = str.match(reg);
  if (!match) {
    throw new Error("无法从输入字符串中提取图像类型");
  }
  return match[1];
};

/**
 * 返回给定文件名的类型，即文件的扩展名。
 * @param {string} filename - 包括扩展名的文件名。
 * @returns {string} 文件的扩展名，如果没有扩展名则返回空字符串。
 */
export const getFileType = (filename) => {
  if (!filename) return "";
  const lastPart = filename.split("/").pop();
  if (lastPart === ".") return "";
  const parts = lastPart.split(".");
  if (parts.length > 1) return parts.pop();
  return "";
};

/**
 * 将 base64 格式的数据转换为文件对象
 * @param {string} dataUrl base64 格式的数据，例如 "data:image/png;base64,iVBORw0KGg..."
 * @param {string} fileName 文件名，例如 "image.png"
 * @returns {File} 文件对象
 */
export const dataURLtoFile = (dataUrl, fileName = "image.png") => {
  var arr = dataUrl.split(","),
    mime = arr[0].match(/:(.*?);/)?.[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
};

/**
 * 获取文件 URL 的 Blob 对象
 * @param {string} url 文件 URL
 * @returns {Promise<Blob>} 文件 Blob 对象的 Promise
 */
export function getBlob(url) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      }
    };
    xhr.send();
  });
}

/**
 * 保存 Blob 对象为文件
 * @param {Blob} blob 要保存的 Blob 对象
 * @param {string} filename 文件名
 */
const isIE = window.navigator.msSaveOrOpenBlob;
export function saveAs(blob, filename) {
  if (isIE) {
    navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.onclick = () => {
      if (!isIE) {
        window.URL.revokeObjectURL(link.href);
      }
    };
    link.click();
  }
}
/**
 * 下载
 * @param  {String} url 目标文件地址
 * @param  {String} filename 想要保存的文件名称
 */
export function download(url, filename) {
  if (!url || !filename) return;
  getBlob(url)
    .then((blob) => {
      saveAs(blob, filename);
    })
    .catch((err) => {
      console.error(`An error occurred while downloading file '${filename}': ${err}`);
    });
}
/**
 * 下载指定 url 的文件，并设置文件名
 * @param  {String} url - 文件地址
 * @param  {String} filename - 文件名
 */
export function downloadCopy(url, filename) {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
}

/**
 * 将查询字符串转换为对象
 * @param {string} String - 查询字符串，例如 "?name=John&age=30"
 * @return {object} - 转换后的对象，例如 { name: "John", age: "30" }
 */
export function queryStringToObject(String) {
  let params = {};
  let queryString = String.match(/\?(.*)/)[1];
  queryString = queryString.substring(1);
  queryString.split("&").forEach(function (param) {
    var keyValue = param.split("=");
    params[keyValue[0]] = decodeURIComponent(keyValue[1] || "");
  });
  return params;
}
const TypeMap = {
  TIMImageElem: "[图片]",
  TIMFileElem: "[文件]",
};

export const fnReplyContent = (msg) => {
  const type = msg?.type;
  const reply = TypeMap[type] || "";
  if (reply) {
    return reply;
  } else {
    return msg?.payload?.text;
  }
};

export function getReplyMsgContent(reply) {
  if (!reply) return "";
  const replyMsgContent = JSON.stringify({
    messageReply: {
      messageID: reply.ID,
      messageAbstract: fnReplyContent(reply),
      messageSender: reply.nick,
      messageType: 0,
      version: "1",
    },
  });
  return replyMsgContent;
}

/**
 * 匹配不包含 <img src= 的字符串
 * @param {string[]} arr - 包含字符串和图片链接的数组
 * @returns {string} - 返回第一个匹配到的不含图片链接的字符串，如果都含有图片链接则返回 undefined
 * ['<img src="image.png">', "some string", '<img src="image3.png">']
 * "some string"
 */
export function findNonImageString(arr) {
  const regex = /^((?!<img src=).)*$/;
  const result = arr.find((element) => regex.test(element));
  return result;
}

/**
 * 将包含表情图像的 HTML 字符串转换为对应的表情符号文本
 * @param {string} html - 待转换的 HTML 字符串
 * @param {Array} emojiMap - 表情符号和对应的图像数据数组
 * @returns {string} - 转换后的结果
 * <p>12<img src="*" alt="[我最美]" />333</p>
 * 12[我最美]333
 */
export function convertEmoji(html, emojiMap) {
  if (!html || !emojiMap || !Array.isArray(emojiMap)) return "";
  const filteredData = emojiMap.filter((item) => item.class === "EmoticonPack");
  if (filteredData.length == 0) return false;
  const convertedData = filteredData.map((item) => ({
    [item.src]: item.alt,
  }));
  const emojiMapExtended = {
    ...Object.assign(...convertedData),
  };
  const regex = /<img src="([^"]+)"[^>]+>/g;
  const result = html.replace(regex, (match, src) => {
    const emojiText = emojiMapExtended[src] || "";
    return emojiText;
  });
  const text = result.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, '');
  return text;
}

export const scrollToDomPostion = (msgid) => {
  const dom = document.getElementById(`${msgid}`);
  if (!dom) return;
  dom.scrollIntoView({ behavior: "smooth", block: "center" });
  dom.classList.add("shrink-style");
  setTimeout(() => {
    dom.classList.remove("shrink-style");
  }, 2000);
};
