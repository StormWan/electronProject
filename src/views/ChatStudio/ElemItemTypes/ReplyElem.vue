<template>
  <div v-if="originalMsg.messageReply" class="reply-msg-content">
    <div class="reply-msg-content__sender">{{ originalMsg.messageReply.messageSender }}:</div>
    <div class="reply-msg-content__content">
      {{ originalMsg.messageReply.messageAbstract }}
    </div>
    <div class="reply-msg-content__mask" @click="hanldeItemClick"></div>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, computed, watch, nextTick } from "vue";
import { scrollToDomPostion } from "@/utils/chat/index";
// eslint-disable-next-line no-undef
const props = defineProps({
  originalMsg: {
    type: Object,
    default: null,
  },
});
// getRef, convId, convType
const { originalMsg } = toRefs(props);

const hanldeItemClick = async () => {
  const { messageReply } = originalMsg.value;
  if (!originalMsg) return;
  const ref = messageReply.messageID;
  if (ref) {
    scrollToDomPostion(ref);
  }
};
</script>

<style lang="scss" scoped>
:global(body .shrink-style) {
  // background: #ffe7ba !important;
  border-radius: 3px;
  animation: fade 500ms infinite;
}
@keyframes fade {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  to {
    opacity: 1;
  }
}
.reply-msg-content {
  border-left: 3px solid #ccc;
  padding-left: 10px;
  color: #666;
  margin-bottom: 10px;
  position: relative;
  &__sender {
    font-size: 14px;
    font-weight: 400;
  }

  &__mask {
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
</style>
