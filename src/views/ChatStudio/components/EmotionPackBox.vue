<template>
  <div v-show="state" class="emjio-tion" v-click-outside="onClickOutside">
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
                @click="selectEmoticon(item)"
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
              @click="selectEmoticon(item)"
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
            @click="selectEmoticon(item)"
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
</template>

<script setup>
import emitter from "@/utils/mitt-bus";
import { ref, onMounted } from "vue";
import { useBoolean } from "@/utils/hooks/index";
import { ClickOutside as vClickOutside } from "element-plus";
import { chunk } from "lodash-es";
import { getOperatingSystem } from "../utils/utils";

const emojiQq = require("@/utils/emoji/emoji-map-qq");
const emojiDouyin = require("@/utils/emoji/emoji-map-douyin");

const systemOs = ref("");
const table = ref("QQ");
const EmotionPackGroup = ref([]);
const [state, setState] = useBoolean();
const emit = defineEmits(["SelectEmoticon"]);

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
  systemOs.value = getOperatingSystem();
};
const selectEmoticon = (item) => {
  emit("SelectEmoticon", item, table.value);
  setState(false);
};
const onClickOutside = () => {
  setState(false);
};
emitter.on("onEmotionPackBox", (state) => {
  setState(state);
});
onMounted(() => {
  getParser();
  initEmotion();
});
</script>

<style lang="scss" scoped>
.emjio-tion {
  position: absolute;
  border-radius: 5px;
  bottom: 55px;
  background: #fff;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  :deep(.custom-scrollbar-wrap) {
    scroll-snap-type: y mandatory;
  }
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
.isHover {
  color: var(--color-icon-hover) !important;
}
.scroll-snap {
  scroll-snap-align: start;
  height: 180px;
}
</style>
