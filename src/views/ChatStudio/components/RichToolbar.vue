<template>
  <div class="toolbar">
    <!-- 表情包 -->
    <el-popover
      ref="popoverRef"
      placement="top-start"
      popper-class="style-emo"
      :show-arrow="false"
      :width="200"
      :teleported="false"
      trigger="click"
    >
      <template #reference>
        <span
          data-title="表情"
          class="emoticon icon"
          ref="buttonRef"
          v-click-outside="onClickOutside"
        >
          <svg-icon iconClass="iconxiaolian" class="icon-hover" />
        </span>
      </template>
      <div>
        <div class="emojis">
          <el-scrollbar wrap-class="custom-scrollbar-wrap">
            <div class="emoji_QQ" v-show="table == 'QQ'">
              <!-- 二维数组 window css 滚动贴合 -->
              <template v-if="systemOs == 'Windows'">
                <div class="scroll-snap" v-for="emoji in EmotionPackGroup" :key="emoji">
                  <span
                    v-for="item in emoji"
                    class="emoji scroll-content"
                    :key="item"
                    @click="SelectEmoticon(item)"
                  >
                    <img :src="require('@/assets/emoji/' + emojiQq.emojiMap[item])" :title="item" />
                  </span>
                </div>
              </template>
              <!-- mac -->
              <template v-else>
                <span
                  v-for="item in emojiQq.emojiName"
                  class="emoji"
                  :key="item"
                  @click="SelectEmoticon(item)"
                >
                  <img :src="require('@/assets/emoji/' + emojiQq.emojiMap[item])" :title="item" />
                </span>
              </template>
            </div>
            <div class="emoji_Tiktok" v-show="table == 'Tiktok'">
              <span
                v-for="item in emojiDouyin.emojiName"
                class="emoji scroll-content"
                :key="item"
                @click="SelectEmoticon(item)"
              >
                <img :src="require('@/assets/emoji/' + emojiDouyin.emojiMap[item])" :title="item" />
              </span>
            </div>
          </el-scrollbar>
        </div>
        <div class="tool">
          <div v-for="item in toolDate" :key="item.icon" @click="table = item.type">
            <svg-icon
              :iconClass="item.icon"
              :class="item.type == table ? 'isHover' : ''"
              class="icon-hover"
            />
          </div>
        </div>
      </div>
    </el-popover>
    <!-- 图片 -->
    <span data-title="图片" class="icon" @click="SendImageClick">
      <svg-icon iconClass="icontupian" class="icon-hover" />
    </span>
    <!-- 文件 -->
    <span data-title="文件" class="icon" @click="SendFileClick">
      <svg-icon iconClass="iconwenjianjia" class="icon-hover" />
    </span>
    <!-- 截图 -->
    <span title="截图" class="" @click="clickCscreenshot">
      <svg-icon iconClass="iconjietu" class="icon-hover" />
    </span>
    <!-- 滚动到底部 -->
    <span
      data-title="滚动到底部"
      class="chat_chat-input-action icon"
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
  </div>
</template>

<script setup>
import html2canvas from "html2canvas";
import emitter from "@/utils/mitt-bus";
import { ref, unref, defineEmits, onMounted } from "vue";
import { ClickOutside as vClickOutside } from "element-plus";
import { dataURLtoFile } from "@/utils/message-input-utils";
import { chunk } from "lodash-es";
import { useStore } from "vuex";
import Bowser from "bowser";
const emojiQq = require("@/utils/emoji/emoji-map-qq");
const emojiDouyin = require("@/utils/emoji/emoji-map-douyin");

const tobottom = ref();
const systemOs = ref("");
const buttonRef = ref();
const popoverRef = ref();
const imagePicker = ref();
const filePicker = ref();
const table = ref("QQ");
const EmotionPackGroup = ref([]);
const { state, dispatch, commit } = useStore();
const emit = defineEmits(["setEmoj", "setPicture", "setParsefile"]);
const toolDate = [
  {
    title: "默认表情",
    icon: "iconxiaolian",
    type: "QQ",
  },
  {
    title: "我的收藏",
    icon: "collect",
    type: "Tiktok",
  },
];
const initEmotion = () => {
  EmotionPackGroup.value = chunk(emojiQq.emojiName, 12 * 6);
};
const getParser = () => {
  const browser = Bowser.getParser(window.navigator.userAgent);
  systemOs.value = browser.getOS().name; // "Windows" ""macOS""
};
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.();
};
const SelectEmoticon = (item) => {
  let url = "";
  if (table.value == "QQ") {
    url = emojiQq.emojiUrl + emojiQq.emojiMap[item];
  } else {
    url = emojiDouyin.emojiUrl + emojiDouyin.emojiMap[item];
  }
  emit("setToolbar", {
    data: { url, item },
    key: "setEmoj",
  });
  unref(popoverRef).hide();
  table.value = "QQ";
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
onMounted(() => {
  getParser();
  initEmotion();
});
</script>
<style>
.style-emo {
  z-index: 9999 !important;
  width: auto !important;
  padding: 0 !important;
}
.custom-scrollbar-wrap {
  scroll-snap-type: y mandatory;
}
.scroll-snap {
  scroll-snap-align: start;
  height: 180px;
}
</style>
<style lang="scss" scoped>
.isHover {
  color: var(--color-icon-hover) !important;
}

.emojis {
  width: 400px;
  height: 180px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .emoji_QQ,
  .emoji_Tiktok {
    padding: 0 10px 0 15px;
  }

  .emoji {
    img {
      width: 30px;
      height: 30px;
    }
  }
}
.tool {
  height: 50px;
  display: flex;
  padding: 0 10px;
  background: rgb(243, 243, 244);
  div {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.chat_chat-input-action {
  cursor: pointer;
  animation: chat_slide-in 0.3s ease;
}

@keyframes chat_slide-in {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.toolbar {
  height: 40px;
  padding: 0 5px;
  display: flex;
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
</style>
