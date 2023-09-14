<template>
  <div class="screen-full" @click="toggle" :title="isFullscreen ? '退出全屏' : '全屏'">
    <FontIcon iconName="FullScreen" class="icon-hover" />
  </div>
</template>

<script setup>
import { useFullscreen } from "@vueuse/core";
const { isFullscreen, toggle } = useFullscreen();
</script>

<style lang="scss" scoped>
.screen-full {
  width: 36px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
