<template>
  <div class="frame w-full" v-loading="loading" :element-loading-text="$t('status.hsLoad')">
    <iframe :src="frameSrc[type]" class="frame-iframe" ref="frameRef" />
  </div>
</template>

<script setup>
import { ref, unref, onMounted, nextTick } from "vue";
// eslint-disable-next-line no-undef
const props = defineProps({
  type: {
    type: String,
    default: "",
  },
});
const frameRef = ref();
const { type } = toRefs(props);

const frameSrc = {
  document: "https://hyk260.github.io/PureAdmin",
  github: "https://github.com/Hyk260",
  gitee: "https://gitee.com",
};
const loading = ref(true);

function hideLoading() {
  loading.value = false;
}
function init() {
  nextTick(() => {
    const iframe = unref(frameRef);
    if (!iframe) return;
    if (iframe.attachEvent) {
      iframe.attachEvent("onload", () => {
        hideLoading();
      });
    } else {
      iframe.onload = () => {
        hideLoading();
      };
    }
  });
}

onMounted(() => {
  init();
});
</script>

<style lang="scss" scoped>
.frame {
  .frame-iframe {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 0;
  }
}
</style>
