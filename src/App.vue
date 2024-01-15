<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
  </el-config-provider>
</template>

<script setup>
import { onMounted, nextTick, onBeforeUnmount, computed } from "vue";
import { useWatermark } from "@/utils/hooks/useWatermark";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { ElConfigProvider } from "element-plus";
import { useState } from "@/utils/hooks/useMapper";

import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import en from "element-plus/dist/locale/en.mjs";

const { setWatermark, clear } = useWatermark();
const route = useRoute();

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
    setWatermark("Pure Admin");
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
.v-contextmenu {
  .v-contextmenu-item--hover {
    background: #f6f7f8 !important;
  }
  .v-contextmenu-item {
    height: 32px;
    line-height: 32px;
    padding: 0px 16px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 12px;
  }
}
</style>
