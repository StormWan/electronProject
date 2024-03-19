<template>
  <div class="toolbar">
    <!-- 表情包 -->
    <span :data-title="$t('chat.emoji')" class="emoticon icon" @click="sendEmojiClick">
      <svg-icon iconClass="iconxiaolian" class="icon-hover" />
    </span>
    <!-- 图片 -->
    <span
      v-show="!isRobot(toAccount)"
      :data-title="$t('chat.picture')"
      class="icon"
      @click="SendImageClick"
    >
      <svg-icon iconClass="icontupian" class="icon-hover" />
    </span>
    <!-- 文件 -->
    <span
      v-show="!isRobot(toAccount)"
      :data-title="$t('chat.file')"
      class="icon"
      @click="SendFileClick"
    >
      <svg-icon iconClass="iconwenjianjia" class="icon-hover" />
    </span>
    <!-- 截图 -->
    <span :data-title="$t('chat.screenshot')" class="icon" @click="clickCscreenshot">
      <svg-icon iconClass="iconjietu" class="icon-hover" />
    </span>
    <!-- 机器人配置 -->
    <span
      v-show="isRobot(toAccount)"
      :data-title="$t('chat.configuration')"
      class="icon"
      @click="openRobotBox"
    >
      <svg-icon iconClass="robot" class="icon-hover robot" />
    </span>
    <!-- 窗口抖动 -->
    <span
      v-show="currentType == 'C2C'"
      :data-title="$t('chat.windowJitter')"
      class="icon"
      @click="onShake"
    >
      <el-icon class="icon-hover"><Iphone /></el-icon>
    </span>
    <!-- 滚动到底部 -->
    <span
      :data-title="$t('chat.scrollToTheBottom')"
      class="chat_vot icon"
      @click="onTobBottom"
      v-show="tobottom"
    >
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
    <RobotOptions v-if="isRobot(toAccount)" />
    <EmotionPackBox @setEmoji="setEmoji" ref="emjRef" />
  </div>
</template>

<script setup>
import emitter from "@/utils/mitt-bus";
import EmotionPackBox from "./EmotionPackBox.vue";
import RobotOptions from "./RobotOptions.vue";
import { useStore } from "vuex";
import { ref } from "vue";
import { dataURLtoFile } from "@/utils/chat/index";
import { isRobot } from "@/utils/chat/index";
import { useState, useGetters } from "@/utils/hooks/useMapper";
const emojiQq = require("@/utils/emoji/emoji-map-qq");
const emojiDouyin = require("@/utils/emoji/emoji-map-douyin");
import { createCustomMsg } from "@/api/im-sdk-api/message";
const { production } = require("@/config/vue.custom.config");

const emjRef = ref();
const tobottom = ref();
const imagePicker = ref();
const filePicker = ref();
const { commit, dispatch } = useStore();

const emit = defineEmits(["setToolbar"]);
const { toAccount, currentType } = useGetters(["toAccount", "currentType"]);
const { currentConversation } = useState({
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
const SendImageClick = () => {
  let $el = imagePicker.value;
  $el.value = null;
  $el.click();
};
const SendFileClick = () => {
  let $el = filePicker.value;
  $el.value = null;
  $el.click();
};
// 截图
const clickCscreenshot = () => {
  commit("ipcRenderer", { key: "screenshot" });
};
const onShake = () => {
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
