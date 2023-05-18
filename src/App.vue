<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
  </el-config-provider>
</template>

<script setup>
import { onMounted, nextTick, ref, onBeforeUnmount, computed, defineComponent } from "vue";
import { useWatermark } from "@/utils/hooks/useWatermark";
import { useStore, mapState } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { ElConfigProvider } from "element-plus";
import { useState } from "@/utils/hooks/useMapper";
import { treeToFlat } from "@/utils/ToTree";

import zhCn from "element-plus/lib/locale/lang/zh-cn";
import en from "element-plus/lib/locale/lang/en";
const watermarkText = ref("pure-admin");
const route = useRoute();
const router = useRouter();
const { setWatermark, clear } = useWatermark();

const { dispatch, commit } = useStore();
const { lang } = useState({
  lang: (state) => state.settings.lang,
});
const currentLocale = computed(() => {
  return lang.value === "zh-CN" ? zhCn : en;
});

onMounted(async () => {
  dispatch("reloadRoute");
  setTimeout(() => {
    if (route.name == "login") return;
    dispatch("LOG_IN_AGAIN");
  }, 200);
  nextTick(() => {
    setWatermark(watermarkText.value);
  });
});
onBeforeUnmount(() => {
  clear();
});
</script>

<style lang="scss">
#app {
  height: 100%;
}
.content-wrap {
  padding: 24px;
  height: calc(100vh - 86px);
}
</style>
