<template>
  <div class="file-box" :id="payload.uuid" :style="{ background: backgroundStyle }">
    <div class="file-data">
      <img :src="renderFileIcon(FileType)" alt="" />
      <div class="file-box__content">
        <div class="file-name">
          {{ payload.fileName }}
        </div>
        <div class="file-box__size">
          <span class="file-box__size-label">
            {{ bytesToSize(payload.fileSize) }}
          </span>
          <span class="progress" v-show="!isStatus('success')"></span>
          <span class="file-icon" v-show="isStatus('success')">
            <img src="@/assets/message/check.png" alt="" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, onMounted, onBeforeUnmount } from "vue";
import { getFileType, renderFileIcon, bytesToSize } from "@/utils/chat/index";
import emitter from "@/utils/mitt-bus";
const props = defineProps({
  message: {
    type: Object,
    default: null,
  },
  status: {
    type: String,
    default: "success",
  },
  self: {
    type: Boolean,
    default: false,
  },
});
const { message, status } = toRefs(props);
const { payload } = message.value;

const backgroundStyle = ref("");
const FileType = getFileType(payload?.fileName);

const isStatus = (value) => {
  return status.value == value;
};

const backstyle = (status = 0, percentage = 0) => {
  if (percentage === 100) {
    return "";
  }
  return status === 1
    ? `linear-gradient(to right, rgba(24, 144, 255, 0.09) ${percentage}%, white 0%, white 100%)`
    : "";
};
backgroundStyle.value = backstyle();

const uploading = ({ uuid, num }) => {
  try {
    const dom = document.getElementById(`${uuid}`);
    dom.style.background = backstyle(1, num);
    const progress = dom.querySelector(".progress");
    if (progress && !isStatus("success")) {
      progress.innerText = num + "%";
    }
  } catch (error) {
    console.error("[upload]:", error);
  }
};

onMounted(() => {
  emitter.on("fileUploading", (data) => {
    uploading(data);
  });
});
onBeforeUnmount(() => {
  emitter.off("fileUploading");
});
</script>

<style lang="scss" scoped>
.file-box {
  display: flex;
  height: 70px;
  padding: 12px;
  width: 248px;
  background: #ffffff;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  user-select: none;
  cursor: pointer;
  .file-data {
    display: flex;
    .file-box__content {
      margin-left: 12px;
      display: flex;
      flex-wrap: wrap;
      align-content: space-around;
      .file-name {
        color: #000000ad;
        font-size: 14px;
        width: 160px;
        @include text-ellipsis;
      }
      .file-box__size {
        font-weight: 400;
        color: #999999;
        line-height: 18px;
        font-size: 12px;
        .progress {
          display: inline-block;
          width: 30px;
          padding: 0 5px;
          color: #409eff;
        }
        .file-status,
        .file-icon {
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
