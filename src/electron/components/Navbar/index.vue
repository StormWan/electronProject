<template>
  <header class="header" v-if="isWindows">
    <div class="titlebar flex justify-content" :class="{ 'has-custom-titlebar': true }">
      <div class="log">
        <img class="" src="../../../assets/images/log.png" alt="" />
        <span>{{ $config.Title }}</span>
      </div>
      <div class="flex items-center">
        <el-dropdown>
          <UserAvatar type="self" class="user-info" :size="28" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="$store.dispatch('LOG_OUT')">退出登录</el-dropdown-item>
              <!-- <el-dropdown-item></el-dropdown-item> -->
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div class="setting flex">
          <div class="item" v-for="item in button" :key="item.type" @click="onClick(item)">
            <svg-icon :iconClass="item.type" />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { isWindows } from "@/electron/utils/index";
import { showConfirmationBox } from "@/utils/message";
const { ipcRenderer } = require("electron");

const button = [
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
];

async function onClick(item) {
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
.header {
  height: 42px;
}
.titlebar {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 42px;
  backdrop-filter: saturate(180%) blur(20px);
  background: rgb(235, 248, 242);
  z-index: 100;
  padding: 0 16px;
  -webkit-app-region: drag;
}
.log {
  img {
    width: 15px;
  }
  span {
    vertical-align: baseline;
    display: inline-block;
    font-size: 14px;
    margin-left: 4px;
    color: rgb(80 83 90);
  }
}
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
.user-info {
  cursor: pointer;
  -webkit-app-region: no-drag;
}
</style>
