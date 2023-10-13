<template>
  <div v-if="isWindows" class="dragBox">
    <svg-icon iconClass="exit" @click="onClick" />
  </div>
</template>

<script setup>
import { isWindows } from "@/electron/utils/platform";
const { ipcRenderer } = require("electron");
function onClick() {
  ipcRenderer.send("quitApp");
}
</script>

<style lang="scss" scoped>
.dragBox {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  height: 42px;
  z-index: 100;
  -webkit-app-region: drag;
  .svg-icon {
    -webkit-app-region: no-drag;
    margin-right: 16px;
    .svg-icon {
      color: #303133;
    }

    :hover {
      color: var(--color-icon-hover) !important;
    }
  }
}
</style>
