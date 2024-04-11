<template>
  <div
    class="wangeditor"
    :class="{ 'style-wang': fullScreen }"
    id="svgDown"
    v-if="showMsgBox"
    v-show="!showCheckbox"
  >
    <!-- 自定义工具栏 -->
    <RichToolbar @setToolbar="setToolbar" />
    <Editor
      class="editor-content"
      v-model="valueHtml"
      :mode="mode"
      :defaultConfig="editorConfig"
      @drop="dropHandler"
      @onChange="onChange"
      @onCreated="handleEditor"
      @customPaste="customPaste"
      @customAlert="customAlert"
      @keyup.enter="handleEnter"
    />
    <!-- @ mention弹框 -->
    <mention-modal
      ref="mentionRef"
      v-if="isShowModal"
      :pinyinSearch="true"
      :isOwner="isOwner"
      @insertMention="insertMention"
    />
    <el-tooltip
      effect="dark"
      :content="placeholderMap[getOperatingSystem()]"
      placement="left-start"
    >
      <el-button class="btn-send" @click="handleEnter()"> {{ $t("chat.sending") }} </el-button>
    </el-tooltip>
  </div>
</template>

<script setup>
import "../utils/custom-menu";
import "@wangeditor/editor/dist/css/style.css";
import { Editor } from "@wangeditor/editor-for-vue";
import RichToolbar from "../components/RichToolbar.vue";
import { editorConfig, placeholderMap } from "../utils/configure";
import emitter from "@/utils/mitt-bus";
import {
  ref,
  shallowRef,
  onMounted,
  watch,
  onActivated,
  onDeactivated,
  onBeforeUnmount,
} from "vue";
import {
  convertEmoji,
  extractImageInfo,
  sendChatMessage,
  customAlert,
  extractFilesInfo,
  extractAitInfo,
  getOperatingSystem,
  handleToggleLanguage,
  filterMentionList,
  handleEditorKeyDown,
} from "../utils/utils";
import { useStore } from "vuex";
import { useState, useGetters } from "@/utils/hooks/useMapper";
import MentionModal from "../components/MentionModal.vue";
import { bytesToSize } from "@/utils/chat/index";
import { fileImgToBase64Url } from "@/utils/chat/index";
import { debounce } from "lodash-es";
import { createCustomMsg } from "@/api/im-sdk-api/message";

const { ipcRenderer } = require("electron");

const editorRef = shallowRef(); // 编辑器实例，必须用 shallowRef
const valueHtml = ref(""); // 内容 HTML
// const messages = ref(null); //编辑器内容 对象格式
const mode = "simple"; // 'default' 或 'simple'
const mentionRef = ref();

const { dispatch, commit } = useStore();
const { isOwner, toAccount, currentType } = useGetters(["isOwner", "toAccount", "currentType"]);
const {
  lang,
  currentConversation,
  showMsgBox,
  showCheckbox,
  isShowModal,
  currentReplyMsg,
  sessionDraftMap,
  fullScreen,
} = useState({
  lang: (state) => state.settings.lang,
  sessionDraftMap: (state) => state.conversation.sessionDraftMap,
  currentConversation: (state) => state.conversation.currentConversation,
  showCheckbox: (state) => state.conversation.showCheckbox,
  showMsgBox: (state) => state.conversation.showMsgBox,
  isShowModal: (state) => state.conversation.isShowModal,
  currentReplyMsg: (state) => state.conversation.currentReplyMsg,
  fullScreen: (state) => state.settings.fullScreen,
});

const handleEditor = (editor, created = true) => {
  if (created) {
    editorRef.value = editor;
  } else {
    if (editor === null) return;
    editor.destroy();
  }
};

const insertMention = ({ id, name, backward = true, deleteDigit = 0 }) => {
  const editor = editorRef.value;
  const mentionNode = {
    type: "mention", // 必须是 'mention'
    value: `${name} `, // 文本
    info: { id }, // 其他信息，自定义
    children: [{ text: "" }], // 必须有一个空 text 作为 children
  };
  editor?.restoreSelection(); // 恢复选区
  if (deleteDigit) {
    for (let i = 0; i < deleteDigit; i++) {
      editor.deleteBackward("character");
    }
  } else if (backward) {
    editor.deleteBackward("character"); // 删除 '@'
  }
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
const insertDraft = (value) => {
  if (!value) return;
  const editor = editorRef.value;
  editor && editor.focus(true);
  const { conversationID: ID } = value;
  const draftMap = sessionDraftMap.value;
  const draft = draftMap.get(ID);
  clearInputInfo();
  draft?.forEach((item) => {
    editor.insertNode(item.children);
  });
};

// 更新草稿
const updateDraft = debounce((data) => {
  commit("SET_SESSION_DRAFT", {
    ID: currentConversation?.value?.conversationID,
    payload: data,
  });
}, 300);

const handleAt = debounce((editor) => {
  filterMentionList(editor.getText(), editor.getHtml());
}, 150);

const onChange = (editor) => {
  const content = editor.children;
  // messages.value = content;
  updateDraft(content);
  handleAt(editor);
};

const handleFile = (item) => {
  const type = item.type;
  let trans = Object.prototype.toString.call(item) === "[object DataTransferItem]";
  let pasteFile = trans ? item.getAsFile() : item;
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
    editorRef.value.restoreSelection(); // 恢复选区
    editorRef.value.insertNode(FileElement);
    editorRef.value.move(1); // 移动光标
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

  editorRef.value.restoreSelection();
  editorRef.value.insertNode(ImageElement);
  editorRef.value.focus(true);
  // editorRef.value.showProgressBar(100); // 进度条
};
const setPicture = (data) => {
  parsepicture(data);
  const editor = editorRef.value;
  editor && editor.focus();
};
const setParsefile = (data) => {
  parsefile(data);
};
// 插入图片
const parsepicture = async (file) => {
  let base64Url = await fileImgToBase64Url(file);
  const ImageElement = {
    type: "image",
    class: "img",
    src: base64Url,
    alt: "",
    href: "",
    style: { width: "125px" },
    children: [{ text: "" }],
  };
  editorRef.value?.insertNode(ImageElement);
};
// 回车
const handleEnter = (event) => {
  if (event?.ctrlKey) return;
  if (isShowModal.value) {
    mentionRef.value.inputKeyupHandler(event);
    return;
  }
  const editor = editorRef.value;
  const empty = editor.isEmpty(); // 判断当前编辑器内容是否为空
  const { isHave } = sendMsgBefore();
  if (!empty && isHave) {
    sendMessage(editor);
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

const sendMsgBefore = (editor = editorRef.value) => {
  const text = editor.getText(); // 纯文本内容
  const { aitStr, aitlist } = extractAitInfo(editor);
  const { files } = extractFilesInfo(editor);
  const { images } = extractImageInfo(editor);
  const emoticons = convertEmoji(editor);
  const have = images.length || files.length || aitlist.length || aitStr || emoticons || text;
  return {
    convId: toAccount.value,
    convType: currentType.value,
    textMsg: emoticons || text,
    image: images,
    aitStr: aitlist.length ? emoticons || aitStr : "",
    aitlist,
    files: files,
    reply: currentReplyMsg.value,
    isHave: Boolean(have),
  };
};
// 发送消息
const sendMessage = () => {
  const data = sendMsgBefore();
  console.log("sendMsgBefore:", data);
  const message = sendChatMessage(data);
  console.log("sendChatMessage:", message);
  clearInputInfo();
  message.map((message) => {
    dispatch("SESSION_MESSAGE_SENDING", {
      payload: {
        convId: currentConversation.value.conversationID,
        message,
      },
    });
  });
};
const setEditHtml = (text) => {
  const editor = editorRef.value;
  editor.setHtml(`<p>${text}</p>`);
  editor.focus(true);
};
const onEmitter = () => {
  emitter.on("handleAt", ({ id, name }) => {
    insertMention({ id, name, backward: false });
  });
  emitter.on("handleSetHtml", (text) => {
    text && setEditHtml(text);
  });
  emitter.on("handleInsertDraft", (value) => {
    value && insertDraft(value);
  });
  emitter.on("handleFileDrop", (file) => {
    handleFile(file);
  });
};
ipcRenderer.on("captureScreenBack", (event, url) => {
  const ImageElement = {
    type: "image",
    class: "img",
    src: url,
    alt: "",
    href: "",
    style: { width: "125px" },
    children: [{ text: "" }],
  };
  const editor = editorRef.value;
  editor.insertNode(ImageElement);
});
function offEmitter() {
  emitter.off("handleAt");
  emitter.off("handleSetHtml");
  emitter.off("handleInsertDraft");
  emitter.off("setHandleFile");
}

watch(showMsgBox, () => {
  handleEditorKeyDown();
});
watch(lang, () => {
  handleToggleLanguage();
});
onActivated(() => {
  handleEditorKeyDown();
});
onDeactivated(() => {
  offEmitter();
});
onMounted(() => {
  onEmitter();
});
onBeforeUnmount(() => {
  handleEditor(editorRef.value, false);
});
</script>

<style lang="scss" scoped>
.wangeditor {
  word-break: break-all;
  height: 206px;
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
    :deep(.w-e-selected-image-container) {
      overflow: visible;
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
.style-wang {
  height: calc(100% - 60px);
}
</style>
