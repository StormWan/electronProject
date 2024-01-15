<template>
  <template v-for="item in decodeText(text)" :key="item">
    <span v-if="item.name === 'text'">
      <analysis-url v-if="islink" :text="item.text" />
      <template v-else>
        {{ item.text }}
      </template>
    </span>
    <img
      v-else-if="item.name === 'img'"
      class="emoji"
      :src="require('@/assets/emoji/' + item.localSrc)"
      alt="表情包"
    />
  </template>
</template>

<script setup>
import AnalysisUrl from "../components/AnalysisUrl.vue";
import { decodeText } from "@/utils/chat/index";
// eslint-disable-next-line no-undef
const props = defineProps({
  text: {
    type: String,
    default: "",
  },
  islink: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.emoji {
  width: 23px;
  vertical-align: sub;
}
</style>
