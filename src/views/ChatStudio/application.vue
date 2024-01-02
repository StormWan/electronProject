<template>
  <div>
    <el-button type="primary" @click="checkUpdate"> 检查更新</el-button>
    <el-button type="primary" @click="downUpdate"> 下载更新包</el-button>
    <el-button type="primary" @click="confirmUpdate"> 确定更新 </el-button>
    <el-button type="primary" @click="setShakeWindow"> 窗口抖动 </el-button>
  </div>
</template>

<script>
export default {
  name: "application",
  data() {
    return {};
  },
  methods: {
    setShakeWindow() {
      this.$store.commit("ipcRenderer", { key: "shakeWindow" });
    },
    checkUpdate() {
      this.$store.commit("ipcRenderer", { key: "check-update" });
    },
    downUpdate() {
      this.$store.commit("ipcRenderer", { key: "down-update" });
    },
    confirmUpdate() {
      this.$store.commit("ipcRenderer", { key: "confirm-update" });
    },
  },
};
</script>

<style lang="scss" scoped></style>
