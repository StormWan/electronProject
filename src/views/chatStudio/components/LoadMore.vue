<template>
  <div class="viewref" v-if="index == currentMessageList.length - 1">
    <div class="showMore">
      {{ noMore ? $t("chat.noMore") : "" }}
    </div>
    <Loader v-show="!noMore" />
  </div>
</template>

<script setup>
import { useState } from "@/utils/hooks/useMapper";
import Loader from "@/views/components/Loader/index.vue";

// eslint-disable-next-line no-undef
const props = defineProps({
  index: {
    type: Number,
  },
});

const { noMore, currentMessageList } = useState({
  noMore: (state) => state.conversation.noMore,
  currentMessageList: (state) => state.conversation.currentMessageList,
});
</script>

<style lang="scss" scoped>
.viewref {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  overflow: hidden;
}
.showMore {
  padding-top: 12px;
  text-align: center;
  font-size: 12px;
  cursor: pointer;
  color: var(--color-time-divider);
}
</style>
