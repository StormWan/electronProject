<template>
  <div class="head" v-if="isWindows">
    <nav class="nav flex justify-content" :class="{ 'has-custom-titlebar': true }">
      <div></div>
      <div class="setting flex">
        <div class="item" v-for="item in button" :key="item.type" @click="onClick(item)">
          <svg-icon :iconClass="item.type" />
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { isWindows } from "@/electron/utils/platform";
import { showConfirmationBox } from "@/utils/message";
const { ipcRenderer } = require("electron");
import { ref } from "vue";

const button = ref([
  {
    type: "minimize",
    name: "minMainWindow",
  },
  {
    type: "maximize",
    name: "maxMainWindow",
  },
  {
    type: "exit",
    name: "quitApp",
  },
]);

async function onClick(item) {
  console.log(item);
  const { type, name } = item;
  if (name == "quitApp") {
    const message = { message: "确定退出程序吗?", iconType: "warning" };
    const result = await showConfirmationBox(message);
    if (result == "cancel") return;
    ipcRenderer.send(name);
  } else {
    ipcRenderer.send(name);
  }
}
</script>

<style lang="scss" scoped>
.head {
  height: 42px;
  .setting {
    -webkit-app-region: no-drag;
    .item {
      margin-left: 16px;
      .svg-icon {
        color: #303133;
      }

      :hover {
        color: var(--color-icon-hover) !important;
      }
    }
  }
  .nav {
    padding: 0 16px;
  }
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
  // background-color: var(--el-color-danger-light-5);
  // background: var(--el-color-info-light-7);
  background: rgb(235, 248, 242);
  z-index: 100;
  -webkit-app-region: drag;
}
</style>
