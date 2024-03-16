<template>
  <div
    :class="['app-wrapper', sidebar ? '' : 'style-wrapper']"
    :style="fnStyle(isCollapse)"
    v-element-size="onResize"
  >
    <Header />
    <main class="app-main" :class="fnClass()">
      <div class="continer-theme">
        <router-view v-slot="{ Component, route }">
          <transition name="fade-slide" :appear="true" mode="out-in">
            <keep-alive v-if="route.meta.keep" max="1">
              <component v-if="Component" :is="Component" :key="route.path" />
            </keep-alive>
            <template v-else>
              <component v-if="Component" :is="Component" :key="route.path" />
            </template>
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { vElementSize } from "@vueuse/components";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { useState } from "@/utils/hooks/useMapper";
import { isWindows } from "@/electron/utils/index";
import Header from "./Header.vue";

const route = useRoute();
const router = useRouter();
const { state, dispatch, commit } = useStore();

const { isCollapse, sidebar } = useState({
  isCollapse: (state) => state.settings.isCollapse,
  sidebar: (state) => state.settings.sidebar,
});
/**
 * width app-wrapper类容器宽度
 * 0 < width <= 760 隐藏侧边栏
 * 760 < width <= 990 折叠侧边栏
 * width > 990 展开侧边栏
 */
function onResize({ width, height }) {
  // console.log(width, height);
}

const fnClass = () => {
  return isWindows ? "windowStyle" : "";
};
const fnStyle = (off) => {
  return `margin-left:${off ? "64px" : "200px"}`;
};
</script>
<style lang="scss" scoped>
.style-wrapper {
  margin: 0 !important;
}
.app-wrapper {
  width: 100%;
  transition-duration: 220ms;
  transition-delay: 50ms;
}
.continer-theme {
  height: 100%;
  background: var(--color-body-bg);
}
.app-main {
  height: calc(100vh - 86px);
  width: 100%;
  position: relative;
  // overflow-x: hidden;
  background: #f0f2f5;
  box-sizing: border-box;
}
.windowStyle {
  height: calc(100vh - 86px - 42px);
}
</style>
