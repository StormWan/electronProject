<template>
  <AnalysisUrl :text="text" />
</template>

<script setup>
import { html2Escape } from "../utils/utils";
import { ref, defineProps, toRefs, computed, watch, h } from "vue";
const props = defineProps({
  text: {
    type: String,
    default: "",
  },
});
const { text } = toRefs(props);

function AnalysisUrl(props) {
  const { text } = props;
  let str = html2Escape(text);
  let reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-|:|;|\+|%|#)+)/g;
  let flag = reg.test(str);
  let htmlStr = str.replace(
    reg,
    `<a data-link="$1$2" href="$1$2" class="linkUrl" target="_blank"> $1$2 </a>`
  );
  return flag ? h("span", { innerHTML: htmlStr, onClick: () => {} }) : text;
}
</script>

<style lang="scss" scoped>
:deep(.linkUrl) {
  color: blue;
  cursor: pointer;
  text-decoration: underline;
  word-wrap: break-word;
}
</style>
