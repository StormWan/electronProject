<template>
  <el-dialog v-model="dialogVisible" :append-to-body="true" title="上传头像" width="30%" draggable>
    <div>待开发</div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="dialogVisible = false"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, toRefs, defineProps, computed, watch, nextTick } from "vue";
import emitter from "@/utils/mitt-bus";

const dialogVisible = ref(false);

emitter.on("uploadAvatarDialog", (val) => {
  dialogVisible.value = val;
});
function handleConfirm() {
  dialogVisible.value = false;
}
function handleCancel() {
  dialogVisible.value = false;
}
</script>

<style lang="scss" scoped></style>
