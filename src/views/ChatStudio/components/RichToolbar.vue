<template>
  <div class="toolbar">
    <!-- 表情包 -->
    <span data-title="表情" class="emoticon icon" @click="sendEmojiClick">
      <svg-icon iconClass="iconxiaolian" class="icon-hover" />
    </span>
    <!-- 图片 -->
    <span data-title="图片" class="icon" @click="SendImageClick">
      <svg-icon iconClass="icontupian" class="icon-hover" />
    </span>
    <!-- 文件 -->
    <span data-title="文件" class="icon" @click="SendFileClick">
      <svg-icon iconClass="iconwenjianjia" class="icon-hover" />
    </span>
    <!-- 截图 -->
    <span v-if="!production" title="截图" class="" @click="clickCscreenshot">
      <svg-icon iconClass="iconjietu" class="icon-hover" />
    </span>
    <!-- 滚动到底部 -->
    <span data-title="滚动到底部" class="chat_vot icon" @click="onTobBottom" v-show="tobottom">
      <el-icon class="svg-left icon-hover">
        <DArrowLeft />
      </el-icon>
    </span>
    <input
      type="file"
      id="imagePicker"
      ref="imagePicker"
      accept=".jpg, .jpeg, .png, .gif, .bmp"
      @change="sendImage"
      hidden
    />
    <input type="file" id="filePicker" ref="filePicker" @change="sendFile" hidden />
    <!-- <input
      type="file"
      id="videoPicker"
      ref="videoPicker"
      @change="sendVideo"
      accept=".mp4"
      hidden
    /> -->
    <EmotionPackBox @SelectEmoticon="SelectEmoticon" />
  </div>
</template>

<script setup>
import html2canvas from "html2canvas";
import emitter from "@/utils/mitt-bus";
import EmotionPackBox from "./EmotionPackBox.vue";
import { useStore } from "vuex";
import { ref, defineEmits } from "vue";
import { dataURLtoFile } from "@/utils/chat/index";
const emojiQq = require("@/utils/emoji/emoji-map-qq");
const emojiDouyin = require("@/utils/emoji/emoji-map-douyin");
const { production } = require("@/config/vue.custom.config");

const tobottom = ref();
const imagePicker = ref();
const filePicker = ref();
const { commit } = useStore();
const emit = defineEmits(["setEmoj", "setPicture", "setParsefile"]);

const sendEmojiClick = () => {
  emitter.emit("onEmotionPackBox", true);
};
const SelectEmoticon = (item, table) => {
  let url = "";
  if (table == "QQ") {
    url = emojiQq.emojiUrl + emojiQq.emojiMap[item];
  } else {
    url = emojiDouyin.emojiUrl + emojiDouyin.emojiMap[item];
  }
  emit("setToolbar", {
    data: { url, item },
    key: "setEmoj",
  });
};
const SendImageClick = () => {
  let $el = imagePicker.value;
  $el.value = null;
  $el.click();
};
const SendFileClick = () => {
  let $el = filePicker.value;
  $el.click();
};
// 截图
const clickCscreenshot = () => {
  const element = document.body;
  html2canvas(element, {
    allowTaint: true,
    useCORS: true,
    dpi: 150,
    scale: 2,
  }).then((canvas) => {
    const image = canvas.toDataURL();
    const File = dataURLtoFile(image);
    console.log(File);
    emit("setToolbar", {
      data: {
        files: File,
      },
      key: "setPicture",
    });
  });
};

async function sendImage(e) {
  emit("setToolbar", {
    data: {
      files: e.target.files[0],
    },
    key: "setPicture",
  });
}
async function sendFile(e) {
  emit("setToolbar", {
    data: {
      files: e.target.files[0],
    },
    key: "setParsefile",
  });
}
const onTobBottom = () => {
  commit("updataScroll");
};
emitter.on("onisbot", (state) => {
  tobottom.value = !state;
});
</script>
<style lang="scss" scoped>
.toolbar {
  height: 40px;
  padding: 0 5px;
  display: flex;
  position: relative;
  & > span {
    width: 42px;
    align-items: center;
    justify-content: center;
    display: flex;
    height: 40px;
    padding: 4px;
    position: relative;
    text-align: center;
    color: #808080;
  }
  & > .icon:hover:after {
    font-size: 13px;
    display: inline-block;
    content: attr(data-title);
    text-align: center;
    color: rgba(0, 0, 0, 0.75);
    position: absolute;
    left: 17px;
    top: 28px;
    border-radius: 3px;
    // border: 1px solid #e9e9e9;
    background-color: #eaeaea;
    white-space: nowrap;
    padding: 2px 5px;
    z-index: 9999;
  }
}
.chat_vot {
  cursor: pointer;
  animation: chat_top 0.3s ease;
}

@keyframes chat_top {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
