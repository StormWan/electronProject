<template>
  <div class="flex height-full">
    <!-- 侧边栏 -->
    <SideBar />
    <!-- 主体 -->
    <Theme />
    <!-- 设置 -->
    <Setup />
    <!-- 地址本 -->
    <AddressBook />
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";

import Theme from "@/views/home/theme/index.vue";
import SideBar from "@/views/home/SideBar/index.vue";
import Setup from "@/views/home/setup/index.vue";
import AddressBook from "@/views/components/AddressBook/index.vue";

// const route = useRoute();
// const router = useRouter();
// router.replace("/welcome");
</script>
<style lang="scss" scoped>
.css {
  background-image: radial-gradient(transparent 1px, #fff 1px);
  backdrop-filter: saturate(50%) blur(4px);
  background-size: 4px 4px;
}
</style>
