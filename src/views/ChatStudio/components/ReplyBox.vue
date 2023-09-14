<template>
  <div class="reply-box" v-show="currentReplyMsg">
    <el-icon class="close" @click="onClose"><CircleCloseFilled /></el-icon>
    <div class="reply-box-content">
      <div class="nick">{{ currentReplyMsg?.nick }} :</div>
      <div class="text">
        {{ fnReplyContent(currentReplyMsg) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, computed, watch, nextTick } from "vue";
import { useState, useGetters } from "@/utils/hooks/useMapper";
import { fnReplyContent } from "@/utils/message-input-utils";
import { useStore } from "vuex";

const { state, dispatch, commit } = useStore();
const { currentReplyMsg } = useState({
  currentReplyMsg: (state) => state.conversation.currentReplyMsg,
});
const onClose = () => {
  console.log(currentReplyMsg.value);
  commit("setReplyMsg", null);
};
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";
.reply-box {
  height: 60px;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);
  padding: 0 10px;
  display: flex;
  align-items: center;
  .reply-box-content {
    border-left: 3px solid #ccc;
    padding: 0 25px 0 10px;
    color: #666;
    margin-bottom: 10px;
    .text {
      @include ellipsisBasic(1);
    }
  }
  .close {
    color: rgb(140, 140, 140);
    position: absolute;
    cursor: pointer;
    right: 20px;
    top: 20px;
  }
}
</style>
