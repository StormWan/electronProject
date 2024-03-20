<template>
  <div class="desktop-crad">
    <div class="container border animate__animated" :class="fnStyle(mode)">
      <el-icon class="close" @click="onClose"><Close /></el-icon>
      <div></div>
    </div>
  </div>
</template>

<script>
const { ipcRenderer } = require("electron");
export default {
  name: "Desktop",
  components: {},
  computed: {},
  props: {},
  data() {
    return {
      station: [],
      mode: "enter", // enter leave
    };
  },
  mounted() {
    window.addEventListener("mousemove", (event) => {
      // let flag = event.target === document.documentElement;
      let flag = this.mode !== "enter";
      this.$store.commit("ipcRenderer", {
        method: "invoke",
        key: "setIgnore",
        value: { bol: flag, forward: flag ? { forward: true } : null },
      });
    });
    ipcRenderer.on("customCardNotice", (event, data) => {
      console.log(data, "customCardNotice");
      this.station.push(...data);
      this.setMode("enter");
      console.log("station", this.station);
    });
  },
  methods: {
    setMode(data = "leave") {
      this.mode = data;
    },
    fnStyle(t) {
      switch (t) {
        case "enter":
          return "animate__fadeInRightBig";
        case "leave":
          return "animate__bounceOutRight";
        default:
          return "";
      }
    },
    onClose() {
      this.setMode();
      console.log(this.station);
    },
  },
};
</script>

<style lang="scss" scoped>
.close {
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
}
.desktop-crad {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  border-radius: 4px;
  // box-shadow: var(--el-box-shadow-lighter);
}
.container {
  border-radius: 4px;
  background: #fff;
  height: 100%;
  width: 100%;
}
.border {
  // border-radius: 4px;
  // border: 1px solid #ccc;
}
</style>
