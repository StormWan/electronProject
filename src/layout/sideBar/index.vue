<template>
  <div class="sidebar-container" v-show="vislbile || sidebar">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        ref="menuRef"
        class="el-menu-vertical"
        :default-active="route.path"
        :collapse-transition="true"
        :unique-opened="false"
        :collapse="isCollapse"
        router
        @open="handleOpen"
        @close="handleClose"
      >
        <SideItem v-if="routeTable" :tree="routeTable[0].children" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useState } from "@/utils/hooks/useMapper";

const menuRef = ref();
const route = useRoute();

// eslint-disable-next-line no-undef
const props = defineProps({
  vislbile: {
    type: Boolean,
    default: false,
  },
});

const { isCollapse, sidebar, routeTable } = useState({
  isCollapse: (state) => state.settings.isCollapse,
  sidebar: (state) => state.settings.sidebar,
  routeTable: (state) => state.data.routeTable,
});

const handleOpen = (key, keyPath) => {
  // console.log(key, keyPath);
};
const handleClose = (key, keyPath) => {
  // console.log(key, keyPath);
};
</script>

<style lang="scss" scoped>
.el-menu-vertical:not(.el-menu--collapse) {
  background: var(--color-body-bg);
  width: 200px;
  min-height: 400px;
  height: 100%;
  span {
    color: var(--color-text);
  }
}
.el-menu-vertical {
  border: none;
  height: 100%;
}
.sidebar-container {
  user-select: none;
  background: var(--color-body-bg);
  box-shadow: 0 0 1px #888;
  z-index: 11;
  height: 100%;
  position: absolute;
  font-size: 0;
  top: 0;
  bottom: 0;
  left: 0;
}
/*隐藏文字*/
.el-menu--collapse :deep(.el-sub-menu__title span) {
  display: none;
}
/*隐藏 > */
.el-menu--collapse :deep(.el-sub-menu__title .el-sub-menu__icon-arrow) {
  display: none;
}
/* 卡頓bug */
.el-menu-vertical :deep(.el-icon) {
  // width: auto;
}
</style>
