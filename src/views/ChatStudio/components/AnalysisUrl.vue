<template>
  <AnalysisUrl :text="text" />
</template>

<script setup>
import { html2Escape } from "../utils/utils";
import { ref, toRefs, computed, watch, h } from "vue";

// eslint-disable-next-line no-undef
const props = defineProps({
  text: {
    type: String,
    default: "",
  },
});
const { text } = toRefs(props);

function AnalysisUrl(props) {
  const { text } = props;
  const reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-|,|:|;|\+|%|#)+)/g;
  const urls = text.match(reg);
  if (!urls) {
    return text;
  }
  const htmlStr = urls.reduce((acc, url) => {
    const escapedUrl = html2Escape(url);
    const link = `<a data-link="${escapedUrl}" href="${escapedUrl}" class="linkUrl" target="_blank">${escapedUrl}</a>`;
    return acc.replace(url, link);
  }, text);
  return h("span", { innerHTML: htmlStr, onClick: () => {} });
}
</script>

<style lang="scss" scoped>
:deep(.linkUrl) {
  cursor: pointer;
  text-decoration: underline;
  word-wrap: break-word;
  color: var(--el-color-primary);
}
</style>
