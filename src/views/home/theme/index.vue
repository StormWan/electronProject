<template>
  <div :class="['app-wrapper', sidebar ? '' : 'style-wrapper']" :style="fnStyle(isActive)" v-resize>
    <Header />
    <main class="app-main">
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
import { computed, onMounted, watch, reactive, defineAsyncComponent } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { useState } from "@/utils/hooks/useMapper";
import Header from "./Header.vue";
import emitter from "@/utils/mitt-bus";

const route = useRoute();
const router = useRouter();
const { state, dispatch, commit } = useStore();

const { isActive, sidebar } = useState({
  isActive: (state) => state.settings.isCollapse,
  sidebar: (state) => state.settings.sidebar,
});

emitter.on("resize", ({ detail }) => {
  const { width } = detail;
  /** width app-wrapper类容器宽度
   * 0 < width <= 760 隐藏侧边栏
   * 760 < width <= 990 折叠侧边栏
   * width > 990 展开侧边栏
   */
  if (width > 0 && width <= 760) {
    // commit("UPDATE_USER_SETUP", {
    //   key: "sidebar",
    //   value: false,
    // });
  } else if (width > 760 && width <= 990) {
    // toggle("desktop", false);
  } else if (width > 990) {
    // toggle("desktop", true);
    // commit("UPDATE_USER_SETUP", {
    //   key: "sidebar",
    //   value: true,
    // });
  }
});

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
}
.continer-theme {
  height: 100%;
  background: var(--color-body-bg);
}
.app-main {
  // padding-top: 86px;
  // height: 100vh;
  height: calc(100vh - 86px);
  // margin-top: 86px;
  width: 100%;
  position: relative;
  overflow-x: hidden;
  background: #f0f2f5;
  box-sizing: border-box;
}
</style>
