<template>
  <div
    class="message-view__item--text"
    :class="self ? 'is-text-self' : 'is-text-other'"
    @click="onClick(message)"
  >
    <template v-if="(message?.conversationType || msgType) == 'GROUP' || 'C2C'">
      <!-- 回复消息 -->
      <ReplyElem
        v-if="message.cloudCustomData"
        :originalMsg="message.cloudCustomData && JSON.parse(message.cloudCustomData)"
      />
      <template v-for="item in decodeText(message.payload.text)" :key="item">
        <span v-if="item.name === 'text'" class="text-erase">
          <analysis-url :text="item.text" />
        </span>
        <img
          v-else-if="item.name === 'img'"
          class="emoji"
          :src="require('@/assets/emoji/' + item.localSrc)"
          alt="表情包"
        />
      </template>
    </template>
  </div>
</template>

<script setup>
import { decodeText, isRobot } from "@/utils/chat/index";
import { toRefs, h } from "vue";
import ReplyElem from "./ReplyElem.vue";
import AnalysisUrl from "../components/AnalysisUrl.vue";
const props = defineProps({
  msgType: {
    type: String,
    default: "",
  },
  message: {
    type: Object,
    default: null,
  },
  self: {
    type: Boolean,
    default: false,
  },
});
const { message, self, msgType } = toRefs(props);

const onClick = (data) => {
  console.log(data);
};
</script>

<style lang="scss" scoped>
.is-text-self {
  background: var(--self-msg-color);
}
.is-text-other {
  background: var(--other-msg-color);
}
.emoji {
  width: 24px;
  vertical-align: bottom;
}
.message-view__item--text {
  width: fit-content;
  padding: 10px 14px;
  // max-width: 360px;
  padding: 10px 14px;
  box-sizing: border-box;
  border-radius: 3px;
  word-break: break-all;
  white-space: pre-wrap;
  color: var(--color-text);
  // :deep(.github-markdown-body) {
  //   width: 100%;
  //   padding: 0;
  //   p {
  //     margin: 0 !important;
  //   }
  //   .v-md-hljs-html {
  //     margin: 0;
  //   }
  // }
}
// .text-erase {
//   width: 100%;
//   position: relative;
//   // display: inline-block;
//   p {
//     margin: 0;
//   }
//   .eraser {
//     position: absolute;
//     left: 0;
//     top: 0;
//     .text {
//       --p: 5%;
//       background: linear-gradient(to right, #0000 var(--p), #f0f2f5 calc(var(--p) + 100px));
//       color: transparent;
//       animation: erase 5s forwards;
//     }
//   }
// }
// @property --p {
//   syntax: "<percentage>";
//   initial-value: 5%;
//   inherits: false;
// }

// @keyframes erase {
//   to {
//     --p: 100%;
//   }
// }
</style>
