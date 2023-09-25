<template>
  <div class="merge" @click="onClick">
    <div class="preview">
      <div class="preview_title">{{ message.payload.title }}</div>
      <div class="preview_item" v-for="item in message.payload.abstractList" :key="item">
        <div class="preview_text">{{ item }}</div>
      </div>
    </div>
    <div class="footer">聊天记录</div>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, computed, watch, nextTick } from "vue";
const props = defineProps({
  message: {
    type: Object,
    default: null,
  },
});
const { message } = toRefs(props);
function onClick() {
  console.log(message);
}
</script>

<style lang="scss" scoped>
.merge {
  font-size: 12px;
  width: 232px;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background-color: #ffffff;
  cursor: pointer;
  .preview {
    max-height: 105px;
    border-bottom: 1px solid #d5dbdf;
    .preview_title {
      font-size: 16px;
      height: 40px;
      padding: 12px 12px 0 12px;
      color: rgba(0, 0, 0, 0.85);
    }
    .preview_item {
      box-sizing: border-box;
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      height: 20px;
      padding: 0 12px;
    }
  }
  .footer {
    height: 30px;
    line-height: 30px;
    padding-left: 12px;
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>
