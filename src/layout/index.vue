<template>
  <div class="manView">
    <Navbar />
    <div class="flex h-full w-full view">
      <!-- 侧边栏 -->
      <SideBar />
      <!-- 主体 -->
      <AppMain />
      <!-- 设置 -->
      <Setup />
    </div>
  </div>
</template>

<script setup>
import Navbar from "@/electron/components/Navbar/index.vue";
import AppMain from "./appMain/index.vue";
import SideBar from "./sideBar/index.vue";
import Setup from "./setup/index.vue";
</script>
<style lang="scss" scoped>
.manView {
  width: 100%;
  // height: 100%;
  .view {
    position: relative;
  }
}
</style>
