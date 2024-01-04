<template>
  <div
    class="image_preview select-none"
    :class="self ? 'is-text-self' : 'is-text-other'"
    @click="geiPic(url)"
  >
    <el-image
      :src="url"
      @load="loadImg"
      :style="imgStyle"
      :preview-src-list="showCheckbox ? null : srcList"
      :hide-on-click-modal="true"
      :initial-index="index"
      :infinite="false"
      fit="cover"
    />
  </div>
</template>

<script setup>
import { toRefs } from "vue";
import { useState, useGetters } from "@/utils/hooks/useMapper";
import { showIMPic, getImageSize } from "../utils/utils";

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
const imgStyle = ref({});
const { message, self } = toRefs(props);
const { imgUrlList } = useGetters(["imgUrlList"]);
const { showCheckbox } = useState({
  showCheckbox: (state) => state.conversation.showCheckbox,
});

const url = message?.value.payload.imageInfoArray[0].url;

const index = imgUrlList.value.findIndex((item) => {
  return item == url;
});
async function initImageSize() {
  try {
    let imageInfo = message?.value.payload.imageInfoArray[1];
    let width = imageInfo?.width || 0;
    let height = imageInfo?.height || 0;

    if (width <= 0 || height <= 0) {
      const { width: newWidth, height: newHeight } = await getImageSize(url);
      width = newWidth;
      height = newHeight;
    }

    const { width: finalWidth, height: finalHeight } = showIMPic(width, height);
    imgStyle.value = { width: finalWidth, height: finalHeight };
  } catch (error) {
    const { width, height } = await getImageSize(url);
    imgStyle.value = { width: width + "px", height: height + "px" };
  }
}

initImageSize();

const srcList = imgUrlList.value;
const geiPic = async (url) => {
  console.log(message.value);
  console.log(imgStyle);
};
const loadImg = (e) => {
  console.log(e);
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
  // padding: 10px 14px;
  box-sizing: border-box;
  border-radius: 5px;
  :deep(.el-image) {
    border-radius: 5px;
    vertical-align: bottom;
  }
}
</style>
