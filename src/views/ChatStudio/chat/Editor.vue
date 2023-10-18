<template>
  <div class="Editor-style" id="svgDown" v-if="showMsgBox" v-show="!showCheckbox">
    <!-- <Toolbar
      class="toolbar"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    /> -->
    <!-- 自定义工具栏 -->
    <RichToolbar @setToolbar="setToolbar" />
    <Editor
      class="editor-content"
      v-model="valueHtml"
      :mode="mode"
      :defaultConfig="editorConfig"
      @drop="dropHandler"
      @onChange="onChange"
      @onCreated="handleCreated"
      @customPaste="customPaste"
      @customAlert="customAlert"
      @keyup.enter="handleEnter"
    />
    <!-- @ mention弹框 -->
    <mention-modal
      v-if="isShowModal"
      :isOwner="isOwner"
      :memberlist="currentMemberList"
      @insertMention="insertMention"
    />
    <el-tooltip effect="dark" :content="$t('chat.buttonPrompt')" placement="left-start">
      <el-button class="btn-send" @click="handleEnter()"> {{ $t("chat.sending") }} </el-button>
    </el-tooltip>
  </div>
</template>

<script setup>
import "../utils/custom-menu";
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import RichToolbar from "../components/RichToolbar.vue";
import { toolbarConfig, editorConfig } from "../utils/configure";
import emitter from "@/utils/mitt-bus";
import { onBeforeUnmount, ref, shallowRef, onMounted, computed, watch, nextTick } from "vue";
import { sendChatMessage, customAlert, parseHTMLToArr } from "../utils/utils";
import { empty } from "@/utils/common";
import { useStore } from "vuex";
import { useState, useGetters } from "@/utils/hooks/useMapper";
import MentionModal from "../components/MentionModal.vue";
import { bytesToSize } from "@/utils/chat/index";
import { fileImgToBase64Url, convertEmoji } from "@/utils/chat/index";
import { debounce } from "lodash-es";

const editorRef = shallowRef(); // 编辑器实例，必须用 shallowRef
const valueHtml = ref(""); // 内容 HTML
const messages = ref(null); //编辑器内容 对象格式
const mode = "simple"; // 'default' 或 'simple'

const { dispatch, commit } = useStore();
const { isOwner, toAccount } = useGetters(["isOwner", "toAccount"]);
const {
  currentConversation,
  showMsgBox,
  showCheckbox,
  isShowModal,
  currentMemberList,
  currentReplyMsg,
  sessionDraftMap,
} = useState({
  sessionDraftMap: (state) => state.conversation.sessionDraftMap,
  currentMemberList: (state) => state.groupinfo.currentMemberList,
  currentConversation: (state) => state.conversation.currentConversation,
  showCheckbox: (state) => state.conversation.showCheckbox,
  showMsgBox: (state) => state.conversation.showMsgBox,
  isShowModal: (state) => state.conversation.isShowModal,
  currentReplyMsg: (state) => state.conversation.currentReplyMsg,
});

const handleCreated = (editor) => {
  editorRef.value = editor;
  // editor.getConfig()
  // editor.enable(); //
  // editor.disable(); // 只读
  // editor.hidePanelOrModal();
};
const insertMention = (id, name, backward = true) => {
  const editor = editorRef.value;
  const mentionNode = {
    type: "mention", // 必须是 'mention'
    value: `${name} `, // 文本
    info: { id }, // 其他信息，自定义
    children: [{ text: "" }], // 必须有一个空 text 作为 children
  };
  editor?.restoreSelection(); // 恢复选区
  backward && editor.deleteBackward("character"); // 删除 '@'
  editor.insertNode(mentionNode); // 插入 mention
  editor.move(1); // 移动光标
};
const setToolbar = (item) => {
  const { data, key } = item;
  switch (key) {
    case "setEmoj":
      setEmoj(data.url, data.item);
      break;
    case "setPicture":
      setPicture(data.files);
      break;
    case "setParsefile":
      setParsefile(data.files);
      break;
  }
};
// 插入草稿
const insertDraft = (newValue) => {
  if (!newValue) return;
  const editor = editorRef.value;
  editor && editor.focus();
  const { conversationID: ID } = newValue;
  const draftMap = sessionDraftMap.value;
  const draft = draftMap.get(ID);
  clearInputInfo();
  draft?.[0]?.children.forEach((item) => {
    editorRef.value.insertNode(item);
  });
};
// 更新草稿
const updateDraft = (data) => {
  if (!currentConversation) return;
  const { conversationID } = currentConversation.value;
  commit("SET_SESSION_DRAFT", {
    ID: conversationID,
    payload: data,
  });
};
const fnUpdateDraft = debounce((data) => {
  updateDraft(data);
}, 300);
const onChange = (editor) => {
  const content = editor.children;
  messages.value = content;
  // fnUpdateDraft(content);
};

const handleFile = (item) => {
  const type = item.type;
  let pasteFile = item.getAsFile();
  if (type.match("^image/")) {
    parsepicture(pasteFile);
  } else {
    parsefile(pasteFile);
  }
};

const handleString = (item, editor) => {
  item.getAsString((str) => {
    parsetext(str, editor);
  });
};

const kindHandlers = {
  file: handleFile,
  string: handleString,
};

const customPaste = (editor, event, callback) => {
  console.log("ClipboardEvent 粘贴事件对象", event);
  const text = event.clipboardData?.getData("text/plain"); // 获取粘贴的纯文本
  // https://developer.mozilla.org/zh-CN/docs/Web/API/DragEvent DragEvent 拖拽
  // https://developer.mozilla.org/zh-CN/docs/Web/API/ClipboardEvent ClipboardEvent 粘贴
  const items = event?.clipboardData?.items ?? event?.dataTransfer?.items;
  for (const item of items) {
    const { kind } = item;
    const handler = kindHandlers[kind];
    handler && handler(item, editor);
  }
  text && editor.insertText(text);
  event.preventDefault();
  callback?.(false);
};
// 拖拽事件
const dropHandler = (event) => {
  customPaste(editorRef.value, event);
};
// 插入文件
const parsefile = async (file) => {
  try {
    const { size, name } = file;
    const fileSize = bytesToSize(size);
    const base64Url = await fileImgToBase64Url(file);
    const FileElement = {
      type: "attachment",
      fileName: name,
      fileSize: fileSize,
      link: base64Url,
      children: [{ text: "" }], // void 元素必须有一个 children ，其中只有一个空字符串，重要！！！
    };
    // editorRef.value.restoreSelection(); // 恢复选区
    editorRef.value.insertNode(FileElement);
    // editorRef.value.move(1); // 移动光标
  } catch (error) {
    console.log(error);
  }
};
const parsetext = (item) => {
  console.log(item);
};
const setEmoj = (url, item) => {
  const ImageElement = {
    type: "image",
    class: "EmoticonPack",
    src: url,
    alt: item,
    href: "",
    style: { width: "26px" },
    children: [{ text: "" }],
  };
  editorRef.value.insertNode(ImageElement);
  editorRef.value.focus(true);
  // editorRef.value.showProgressBar(100); // 进度条
};
const setPicture = (data) => {
  parsepicture(data);
};
const setParsefile = (data) => {
  parsefile(data);
};
// 插入图片
const parsepicture = async (file) => {
  const base64Url = await fileImgToBase64Url(file);
  const ImageElement = {
    type: "image",
    class: "img",
    src: base64Url,
    alt: "",
    href: "",
    style: { width: "125px" },
    children: [{ text: "" }],
  };
  editorRef.value.insertNode(ImageElement);
};
// 回车
const handleEnter = (event) => {
  if (event?.ctrlKey) return;
  const editor = editorRef.value;
  const isEmpty = editor.isEmpty(); // 判断当前编辑器内容是否为空
  const { textMsg, aitStr, files, image } = sendMsgBefore();
  if ((!isEmpty && !empty(textMsg)) || image || aitStr || files) {
    sendMessage();
  } else {
    clearInputInfo();
  }
};
// 清空输入框
const clearInputInfo = () => {
  commit("setReplyMsg", null);
  const editor = editorRef.value;
  editor && editor.clear();
};

const extractFilesInfo = (html) => {
  const matchStr = html.match(/data-link="([^"]*)"/);
  const matchStrName = html.match(/data-fileName="([^"]*)"/);
  const fileName = matchStrName?.[1];
  const link = matchStr?.[1];
  return { fileName, link };
};

const extractAitInfo = () => {
  let aitStr = "";
  let aitlist = [];
  let html = valueHtml.value;
  if (html.includes("mention")) {
    aitStr = html.replace(/<[^>]+>/g, "").replace(/&nbsp;/gi, "");
    const newmsg = messages.value[0].children.filter((t) => t.type === "mention");
    newmsg.forEach((t) => aitlist.push(t.info.id));
    aitlist = Array.from(new Set(aitlist));
  }
  return { aitStr, aitlist };
};

const sendMsgBefore = () => {
  const editor = editorRef.value;
  const text = editor.getText(); // 纯文本内容
  const HtmlText = editor.getHtml(); // 非格式化的 html
  const image = editor.getElemsByType("image"); // 所有图片
  const { aitStr, aitlist } = extractAitInfo();
  const { fileName, link } = extractFilesInfo(HtmlText);
  const emoticons = convertEmoji(HtmlText, image);
  const ElementArray = parseHTMLToArr(HtmlText);
  return {
    convId: toAccount.value,
    convType: currentConversation.value.type,
    textMsg: emoticons || text,
    image: image?.length > 0 && !emoticons ? image : null,
    aitStr: emoticons || aitStr,
    aitlist,
    files: link ? { fileName, src: link } : null,
    reply: currentReplyMsg.value,
  };
};
// 发送消息
const sendMessage = async () => {
  const data = sendMsgBefore();
  const message = await sendChatMessage(data);
  clearInputInfo();
  dispatch("SESSION_MESSAGE_SENDING", {
    payload: {
      convId: currentConversation.value.conversationID,
      message,
    },
  });
};
const setEditHtml = (text) => {
  const editor = editorRef.value;
  editor.setHtml(`<p>${text}</p>`);
};
emitter.on("handleAt", ({ id, name }) => {
  insertMention(id, name, false);
});

emitter.on("handleSetHtml", (text) => {
  setEditHtml(text);
});

// watch(currentConversation, (newValue) => {
//   insertDraft(newValue);
// });

onMounted(() => {});
// 组件销毁时，及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";
.Editor-style {
  word-break: break-all;
  height: 206px;
  .toolbar {
    // 表情包
    :deep(.w-e-bar-item) {
      // 自定义滚动条
      ::-webkit-scrollbar {
        width: 6px;
      }
      ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: rgba(222, 223, 225);
      }
      ::-webkit-scrollbar-track {
        border-radius: 0;
      }
      // 弹框位置
      .w-e-drop-panel {
        top: -207px;
        height: 200px;
        overflow: overlay;
        padding: 10px 14px 10px 10px;
        margin: 0;
      }
    }
    :deep(.w-e-bar-item .w-e-panel-content-emotion li) {
      width: 30px;
      height: 30px;
      font-size: 18px;
      line-height: 30px;
      text-align: center;
    }
  }
  .editor-content {
    height: calc(100% - 40px) !important;
    overflow-y: hidden;
    :deep(.w-e-text-container p) {
      margin: 0;
    }
    :deep(.w-e-image-dragger) {
      display: none;
    }
    :deep(.w-e-text-placeholder) {
      font-style: normal;
      font-size: 15px;
      top: 5px;
    }
    :deep(.w-e-scroll) {
      @include scrollBar;
    }
  }
}
.btn-send {
  position: absolute;
  bottom: 8px;
  right: 16px;
}
</style>
