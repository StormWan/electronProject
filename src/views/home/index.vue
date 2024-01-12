<template>
  <div class="manView">
    <Navbar />
    <div class="flex h-full w-full view">
      <!-- 侧边栏 -->
      <SideBar />
      <!-- 主体 -->
      <Theme />
      <!-- 设置 -->
      <Setup />
      <!-- 地址本 -->
      <AddressBook />
    </div>
  </div>
</template>

<script setup>
import Theme from "@/views/home/theme/index.vue";
import SideBar from "@/views/home/SideBar/index.vue";
import Setup from "@/views/home/setup/index.vue";
import AddressBook from "@/views/components/AddressBook/index.vue";
import Navbar from "@/electron/components/Navbar/index.vue";
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
