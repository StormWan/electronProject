<template>
  <div class="head" v-if="isWindows">
    <nav :class="{ 'has-custom-titlebar': true }"></nav>
  </div>
</template>

<script setup>
import { isWindows } from "@/electron/utils/platform";
import { ref } from "vue";
</script>

<style lang="scss" scoped>
.head {
  height: 42px;
}
nav {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 42px;
  backdrop-filter: saturate(180%) blur(20px);
  background-color: var(--color-navbar-bg);
  z-index: 100;
  -webkit-app-region: drag;
}
</style>
