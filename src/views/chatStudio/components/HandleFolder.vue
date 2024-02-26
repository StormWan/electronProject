<template>
  <!-- <FontIcon @click.stop="handleDownload" class="download" iconName="Download" title="下载文件" /> -->
  <FontIcon
    v-show="isFolder"
    @click.stop="handleOpenFolder()"
    class="opened"
    iconName="FolderOpened"
    title="打开文件夹"
  />
</template>

<script setup>
import { createFolderChild, openFile, openFolder, downloadFolder } from "@/electron/utils/folder";
import { toRefs } from "vue";
const props = defineProps({
  folder: {
    type: Object,
    default: null,
  },
});
const { folder } = toRefs(props);
// 文件夹是否存在
const isFolder = createFolderChild();
// 下载文件
function handleDownload() {
  console.log("download");
  downloadFolder();
}
// 打开文件夹
function handleOpenFolder() {
  const { fileName } = folder.value;
  openFolder({ fileName });
}
// 打开文件
function handleOpen() {
  console.log("handleOpen");
  console.log(folder.value);
  const { fileName } = folder.value;
  openFile({ fileName });
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
