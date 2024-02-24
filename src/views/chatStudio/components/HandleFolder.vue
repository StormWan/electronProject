<template>
  <FontIcon @click.stop="handleDownload" class="download" iconName="Download" title="下载文件" />
  <FontIcon
    @click.stop="handleOpenFolder"
    class="opened"
    iconName="FolderOpened"
    title="打开文件夹"
  />
</template>

<script setup>
import { ref, toRefs, onMounted, onBeforeUnmount } from "vue";
const props = defineProps({
  folder: {
    type: Object,
    default: null,
  },
});
const { folder } = toRefs(props);
// 下载文件
function handleDownload() {
  console.log("download");
}
// 打开文件夹
function handleOpenFolder() {
  console.log("openFolder");
}
// 打开文件
function handleOpen() {
  console.log("handleOpen");
  console.log(folder.value);
}
defineExpose({ handleOpen });
</script>

<style lang="scss" scoped>
.opened,
.download {
  position: absolute;
  right: 0;
  bottom: 0;
  opacity: 0.7;
}
</style>
