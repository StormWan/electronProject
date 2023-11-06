<template>
  <el-dialog
    v-model="dialogVisible"
    :title="mergValue.title"
    width="680px"
    :before-close="handleClose"
  >
    <el-scrollbar always>
      <div class="merg-dialog">
        <div v-for="item in mergValue.messageList" :key="item.ID">
          <NameComponent :item="item" />
          {{ formatTime(item.clientTime * 1000) }}
          {{ item.messageBody[0].payload }}
          <!-- <div :class="Megtype(item.type)" :id="item.ID">
          <component :key="item.ID" :is="loadMsgModule(item)" :message="item"> </component>
        </div> -->
        </div>
      </div>
    </el-scrollbar>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel()">
          {{ $t("el.datepicker.cancel") }}
        </el-button>
        <el-button type="primary" @click="handleConfirm()">
          {{ $t("el.datepicker.confirm") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, toRefs, computed, watch, nextTick } from "vue";
import emitter from "@/utils/mitt-bus";
import { useBoolean } from "@/utils/hooks/index";
import { formatTime } from "@/utils/common";
import NameComponent from "../components/NameComponent.vue";
import { Megtype, msgOne } from "../utils/utils";

import TextElemItem from "../ElemItemTypes/TextElemItem.vue";
import RelayElemItem from "../ElemItemTypes/RelayElemItem.vue";
import TipsElemItem from "../ElemItemTypes/TipsElemItem.vue";
import ImageElemItem from "../ElemItemTypes/ImageElemItem.vue";
import FileElemItem from "../ElemItemTypes/FileElemItem.vue";
import CustomElemItem from "../ElemItemTypes/CustomElemItem.vue";

const [dialogVisible, setDialogVisible] = useBoolean();
const mergValue = ref({});

const loadMsgModule = (item) => {
  const { type, isRevoked } = item;
  const CompMap = {
    TIMTextElem: TextElemItem, //文本消息
    TIMRelayElem: RelayElemItem, // 合并转发消息
    TIMImageElem: ImageElemItem, // 图片消息
    TIMFileElem: FileElemItem, // 文件消息
    TIMCustomElem: CustomElemItem, // 自定义消息
  };
  if (isRevoked) return TipsElemItem;
  return CompMap[type] || null;
};

function handleClose(done) {
  setDialogVisible(false);
  done();
}
function handleCancel() {
  setDialogVisible(false);
}
function handleConfirm() {
  setDialogVisible(false);
}
emitter.on("openMergePopup", ({ payload }) => {
  mergValue.value = payload;
  setDialogVisible(true);
});
</script>

<style lang="scss" scoped>
.merg-dialog {
  height: 400px;
}
</style>
