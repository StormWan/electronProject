<template>
  <div class="file-Box flex" :id="payload.uuid" :style="{ background: backgroundStyle }">
    <div class="file-data flex">
      <img :src="renderFileIcon(FileType)" alt="" />
      <div class="fileBoxContentEM">
        <div class="file-name">
          {{ payload.fileName }}
        </div>
        <div class="fileBoxContentEMsize">
          <span class="file-size">
            {{ bytesToSize(payload.fileSize) }}
          </span>
          <!-- <span class="file-status">测试</span> -->
          <span class="file-icon" v-show="isShow('success')">
            <img src="@/assets/message/勾.png" alt="" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, computed, watch, nextTick, onMounted } from "vue";
import { bytesToSize } from "@/utils/common";
import { getFileType } from "@/utils/message-input-utils";
import emitter from "@/utils/mitt-bus";
import { renderFileIcon } from "../utils/utils";
const props = defineProps({
  message: {
    type: Object,
    default: null,
  },
  status: {
    type: String,
    default: "success",
  },
});
const { message, status } = toRefs(props);
const { payload } = message.value;

const backgroundStyle = ref("");
const FileType = getFileType(payload?.fileName);

const isShow = (value) => {
  return status.value == value;
};

const backstyle = (status = 1, percentage = 0) => {
  if (percentage == 100) return "";
  return status === 1
    ? `linear-gradient(to right, rgba(24, 144, 255, 0.09) ${percentage}%, white 0%, white 100%)`
    : "";
};
backgroundStyle.value = backstyle();

const uploading = ({ uuid, num }) => {
  const dom = document.getElementById(`${uuid}`);
  dom.style.background = backstyle(1, num);
};

emitter.on("fileUploading", (data) => {
  uploading(data);
});

// onMounted(() => {});
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";
.file-Box {
  height: 70px;
  padding: 12px;
  width: 248px;
  background: #ffffff;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  user-select: none;
  cursor: pointer;
  .file-data {
    .fileBoxContentEM {
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
      .fileBoxContentEMsize {
        font-weight: 400;
        color: #999999;
        line-height: 18px;
        font-size: 12px;
        .file-status,
        .file-icon {
          margin-left: 5px;
        }
        // .file-size {
        // }
        // .file-status {
        // }
        // .file-icon {
        // }
      }
    }
  }
}
</style>
