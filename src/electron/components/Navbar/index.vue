<template>
  <header class="header" v-if="isWindows">
    <div class="has-custom-titlebar">
      <div class="log">
        <img class="log-img" :src="logSrc" alt="log" />
        <span>{{ $config.Title }}</span>
      </div>
      <div class="flex items-center">
        <el-dropdown>
          <UserAvatar type="self" class="user-info" :size="28" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logOut">退出登录</el-dropdown-item>
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

<script>
import { isWindows } from "@/electron/utils/index";
import { showConfirmationBox } from "@/utils/message";

export default {
  name: "Navbar",
  data() {
    return {
      logSrc: require("@/assets/images/log.png"),
      isWindows,
      button: [
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
      ],
    };
  },
  methods: {
    logOut() {
      this.$store.dispatch("LOG_OUT");
    },
    async onClick({ name }) {
      if (name === "quitApp") {
        const result = await showConfirmationBox({
          message: "确定退出程序吗?",
          iconType: "warning",
        });
        if (result == "cancel") return;
        this.$store.commit("ipcRenderer", { key: name });
      } else {
        this.$store.commit("ipcRenderer", { key: name });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  height: 42px;
}
.has-custom-titlebar {
  position: relative;
  width: 100%;
  min-width: 500px;
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
  display: flex;
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
