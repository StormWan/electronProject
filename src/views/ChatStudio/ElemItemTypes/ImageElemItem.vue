<template>
  <div class="image_preview" :class="self ? 'is-text-self' : 'is-text-other'" @click="geiPic(url)">
    <el-image
      :src="url"
      :preview-src-list="showCheckbox ? null : srcList"
      :hide-on-click-modal="true"
      :initial-index="index"
      fit="cover"
    />
  </div>
</template>

<script setup>
import { ref, toRefs } from "vue";
import { useState, useGetters } from "@/utils/hooks/useMapper";

const props = defineProps({
  message: {
    type: Object,
    default: null,
  },
  self: {
    type: Boolean,
    default: false,
  },
});
const { message, self } = toRefs(props);
const { imgUrlList } = useGetters(["imgUrlList"]);
const { showCheckbox } = useState({
  showCheckbox: (state) => state.conversation.showCheckbox,
});

const url = message?.value.payload.imageInfoArray[0].url;

const index = imgUrlList.value.findIndex((item) => {
  return item == url;
});

const srcList = imgUrlList.value;
const geiPic = async (url) => {
  console.log(url);
};
</script>

<style lang="scss" scoped>
.is-text-self {
  background: var(--self-msg-color);
}
.is-text-other {
  background: var(--other-msg-color);
}
.image_preview {
  width: fit-content;
  max-width: 140px;
  padding: 10px 14px;
  box-sizing: border-box;
  border-radius: 3px;
}
</style>
