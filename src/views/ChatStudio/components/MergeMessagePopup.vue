<template>
  <el-dialog
    v-model="dialogVisible"
    :title="mergValue?.payload?.title"
    width="680px"
    align-center
    :before-close="handleClose"
  >
    <el-scrollbar always>
      <div class="merg-dialog">
        <div class="flex" v-for="item in mergValue.payload.messageList" :key="item.ID">
          <div class="avatar">
            <el-avatar
              :size="36"
              shape="square"
              :src="item.avatar || circleUrl"
              @error="() => true"
            >
              <img :src="circleUrl" />
            </el-avatar>
          </div>
          <div class="item">
            <p class="nick">{{ item.nick }} {{ timeFormat(item.clientTime * 1000, true) }}</p>
            <div :class="Megtype(item.messageBody[0].type)">
              <component
                :key="mergValue.ID"
                :is="loadMsgModule(item)"
                :msgType="mergValue.conversationType"
                :message="item.messageBody[0]"
              >
              </component>
            </div>
          </div>
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
import { ref } from "vue";
import emitter from "@/utils/mitt-bus";
import { useBoolean } from "@/utils/hooks/index";
import { timeFormat } from "@/utils/chat/index";
import { Megtype } from "../utils/utils";
import { circleUrl } from "../utils/menu";

import TextElemItem from "../ElemItemTypes/TextElemItem.vue";
import RelayElemItem from "../ElemItemTypes/RelayElemItem.vue";
import ImageElemItem from "../ElemItemTypes/ImageElemItem.vue";
import FileElemItem from "../ElemItemTypes/FileElemItem.vue";
import CustomElemItem from "../ElemItemTypes/CustomElemItem.vue";

const [dialogVisible, setDialogVisible] = useBoolean();
const mergValue = ref({});

const loadMsgModule = (item) => {
  try {
    const type = item.messageBody[0].type;
    const CompMap = {
      TIMTextElem: TextElemItem, //文本消息
      TIMRelayElem: RelayElemItem, // 合并转发消息
      TIMImageElem: ImageElemItem, // 图片消息
      TIMFileElem: FileElemItem, // 文件消息
      TIMCustomElem: CustomElemItem, // 自定义消息
    };
    return CompMap[type] || null;
  } catch (error) {
    console.error("[loadMsg] error", error);
    return null;
  }
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
emitter.on("openMergePopup", (data) => {
  mergValue.value = data;
  setDialogVisible(true);
});
</script>

<style lang="scss" scoped>
.merg-dialog {
  height: 400px;
  & > div {
    padding: 10px 0 10px 0;
  }
  .avatar {
    padding: 0 12px 0 0;
  }
  .item {
    .nick {
      display: flex;
      gap: 0 5px;
      font-size: 12px;
      color: var(--color-time-divider);
    }
  }
}
</style>
