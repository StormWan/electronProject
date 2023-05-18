<template>
  <div class="message-view__item--text">
    <template v-if="message.conversationType == 'GROUP' || 'C2C'">
      <!-- <ReplyElem
        v-if="message.cloudCustomData"
        :originalMsg="message.cloudCustomData && JSON.parse(message.cloudCustomData)"
      /> -->
      <template v-for="item in decodeText(message.payload.text)" :key="item">
        <!-- // linkUrl: verifyLink(item.text) -->
        <span v-if="item.name === 'text'" class="text">
          <analysis-url :text="item.text" />
        </span>
        <img v-else-if="item.name === 'img'" class="emoji" :src="item.src" alt="表情包" />
      </template>
    </template>
  </div>
</template>

<script setup>
import { decodeText } from "@/utils/decodeText";
import { toRefs, h, defineProps } from "vue";
import ReplyElem from "./ReplyElem.vue";
import AnalysisUrl from "../components/AnalysisUrl.vue";
// const reg = /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/;

const props = defineProps({
  message: {
    type: Object,
    default: null,
  },
});
const { message } = toRefs(props);
</script>

<style lang="scss" scoped>
.message-view__item--text {
  width: fit-content;
  padding: 10px 14px;
  max-width: 360px;
  padding: 10px 14px;
  box-sizing: border-box;
  border-radius: 3px;
  word-break: break-all;
  white-space: pre-wrap;
}
.emoji {
  width: 24px;
  vertical-align: bottom;
}
</style>
