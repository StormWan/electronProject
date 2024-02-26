<template>
  <FontIcon
    v-show="!isExist"
    @click.stop="handleDownload"
    class="download"
    iconName="Download"
    title="下载文件"
  />
  <FontIcon
    v-show="isExist"
    @click.stop="handleOpenFolder()"
    class="opened"
    iconName="FolderOpened"
    title="打开文件夹"
  />
</template>

<script setup>
import {
  openFile,
  openFolder,
  downloadFolder,
  checkFileExist,
  createFolderChild,
} from "@/electron/utils/folder";
import { ref, toRefs, onMounted } from "vue";
const props = defineProps({
  folder: {
    type: Object,
    default: null,
  },
});
const { folder } = toRefs(props);

const isFolder = ref(false); // 文件夹是否存在
const isExist = ref(false); //文件是否存在

// 下载文件
function handleDownload() {
  console.log("download");
  const { fileName, fileUrl, fileSize } = folder.value;
  downloadFolder({ fileName, fileUrl, fileSize });
  updateFileState();
}
// 打开文件夹
function handleOpenFolder() {
  const { fileName } = folder.value;
  openFolder({ fileName });
}
// 打开文件
function handleOpen() {
  console.log(isFolder);
  console.log("handleOpen");
  console.log(folder.value);
  const { fileName } = folder.value;
  openFile({ fileName });
}
function updateFileState() {
  isFolder.value = createFolderChild();
  isExist.value = checkFileExist(folder.value.fileName);
}

onMounted(() => {
  updateFileState();
});
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
