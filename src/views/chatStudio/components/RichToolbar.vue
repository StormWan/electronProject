<template>
  <div class="toolbar">
    <!-- 表情包 -->
    <span :title="$t('chat.emoji')" class="emoticon" @click="sendEmojiClick">
      <svg-icon iconClass="iconxiaolian" class="icon-hover" />
    </span>
    <!-- 图片 -->
    <span v-show="!isRobot(toAccount)" :title="$t('chat.picture')" @click="sendImageClick">
      <svg-icon iconClass="icontupian" class="icon-hover" />
    </span>
    <!-- 文件 -->
    <span v-show="!isRobot(toAccount)" :title="$t('chat.file')" @click="sendFileClick">
      <svg-icon iconClass="iconwenjianjia" class="icon-hover" />
    </span>
    <!-- 截图 -->
    <span v-show="!isRobot(toAccount)" :title="$t('chat.screenshot')" @click="clickCscreenshot">
      <svg-icon iconClass="iconjietu" class="icon-hover" />
    </span>
    <!-- 机器人配置 -->
    <span v-show="isRobot(toAccount)" :title="$t('chat.configuration')" @click="openRobotBox">
      <svg-icon iconClass="robot" class="icon-hover robot" />
    </span>
    <!-- 窗口抖动 -->
    <span
      v-show="currentType === 'C2C' && isElectron"
      :title="$t('chat.windowJitter')"
      @click="onShake"
    >
      <el-icon class="icon-hover"><Iphone /></el-icon>
    </span>
    <!-- 自定义消息 -->
    <!-- <span @click="customMessage">
      <el-icon class="icon-hover"><Sunny /></el-icon>
    </span> -->
    <!-- 滚动到底部 -->
    <span
      :title="$t('chat.scrollToTheBottom')"
      class="chat_vot"
      @click="onTobBottom"
      v-show="tobottom"
    >
      <el-icon class="svg-left icon-hover">
        <DArrowLeft />
      </el-icon>
    </span>
    <span
      :title="fullScreen ? $t('chat.recover') : $t('chat.launch')"
      class="style-enlarge"
      @click="onEnlarge(fullScreen)"
    >
      <svg-icon v-if="fullScreen" iconClass="narrow" class="icon-hover" />
      <svg-icon v-else iconClass="enlarge" class="icon-hover" />
    </span>
    <input
      type="file"
      ref="imagePicker"
      accept=".jpg, .jpeg, .png, .gif, .bmp"
      @change="sendImage"
      hidden
    />
    <input type="file" ref="filePicker" @change="sendFile" hidden />
    <!-- <input
      type="file"
      ref="videoPicker"
      @change="sendVideo"
      accept=".mp4"
      hidden
    /> -->
    <RobotOptions v-if="isRobot(toAccount)" />
    <EmotionPackBox @setEmoji="setEmoji" ref="emjRef" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import emitter from "@/utils/mitt-bus";
import EmotionPackBox from "./EmotionPackBox.vue";
import RobotOptions from "./RobotOptions.vue";
import { useStore } from "vuex";
import { isRobot } from "@/utils/chat/index";
import { useState, useGetters } from "@/utils/hooks/useMapper";
import { isElectron } from "@/utils/common";
import { screenshot } from "@/utils/chat/index";
import { createCustomMsg } from "@/api/im-sdk-api/index";
const emojiQq = require("@/utils/emoji/emoji-map-qq");
const emojiDouyin = require("@/utils/emoji/emoji-map-douyin");

const emjRef = ref();
const tobottom = ref();
const imagePicker = ref();
const filePicker = ref();
const { commit, dispatch } = useStore();

const emit = defineEmits(["setToolbar"]);
const { toAccount, currentType } = useGetters(["toAccount", "currentType"]);
const { fullScreen, currentConversation } = useState({
  fullScreen: (state) => state.settings.fullScreen,
  currentConversation: (state) => state.conversation.currentConversation,
});

const sendEmojiClick = () => {
  emjRef.value.setFlag(true);
};
function openRobotBox() {
  emitter.emit("onRobotBox", true);
}
const setEmoji = (item, table) => {
  let url = "";
  if (table == "QQ") {
    // url = emojiQq.emojiUrl + emojiQq.emojiMap[item];
    url = require("@/assets/emoji/" + emojiQq.emojiMap[item]);
  } else {
    // url = emojiDouyin.emojiUrl + emojiDouyin.emojiMap[item];
    url = require("@/assets/emoji/" + emojiDouyin.emojiMap[item]);
  }
  emit("setToolbar", { data: { url, item }, key: "setEmoj" });
};
const sendImageClick = () => {
  let $el = imagePicker.value;
  $el.value = null;
  $el.click();
};
const sendFileClick = () => {
  let $el = filePicker.value;
  $el.value = null;
  $el.click();
};
// 截图
const clickCscreenshot = () => {
  commit("ipcRenderer", { key: "screenshot" });
};
let lastExecutionTimestamp = 0;
const onShake = () => {
  let startTime = Date.now();
  if (startTime - lastExecutionTimestamp < 5000) {
    // 在 5 秒内已经执行过一次，不再执行
    commit("showMessage", {
      message: "发送窗口抖动太过频繁,请稍后再试!",
      type: "warning",
    });
    return;
  }
  // 更新上次执行时间戳
  lastExecutionTimestamp = startTime;
  commit("ipcRenderer", { key: "shakeWindow" });
  const message = createCustomMsg({
    convId: toAccount.value,
    convType: currentType.value,
    customType: "dithering",
  });
  dispatch("SESSION_MESSAGE_SENDING", {
    payload: { convId: currentConversation.value.conversationID, message },
  });
};
const onEnlarge = (value) => {
  commit("UPDATE_USER_SETUP", { key: "fullScreen", value: !value });
};

function customMessage() {
  const message = createCustomMsg({
    convId: toAccount.value,
    convType: currentType.value,
    customType: "loading",
  });
  dispatch("SESSION_MESSAGE_SENDING", {
    payload: {
      convId: currentConversation.value.conversationID,
      message,
    },
  });
}

function sendImage(e) {
  emit("setToolbar", {
    key: "setPicture",
    data: { files: e.target.files[0] },
  });
}
function sendFile(e) {
  emit("setToolbar", {
    key: "setParsefile",
    data: { files: e.target.files[0] },
  });
}
const onTobBottom = () => {
  commit("EMITTER_EMIT", { key: "updataScroll" });
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
  background: var(--color-toolbar);
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
  .robot {
    stroke: unset;
    cursor: pointer;
  }
  & > .icon:hover:after {
    font-size: 13px;
    display: inline-block;
    content: attr(data-title);
    text-align: center;
    color: rgba(0, 0, 0, 0.75);
    position: absolute;
    left: 17px;
    top: 38px;
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
  .svg-left {
    transform: rotate(-90deg);
  }
}
.style-enlarge {
  margin-left: auto;
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
