<template>
  <div class="desktop-crad" v-show="false">
    <div class="animation"></div>
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
    return {};
  },
  mounted() {
    window.addEventListener("mousemove", (event) => {
      console.log(event.target);
      console.log(document.documentElement);
      // 监听当前元素是否为html根元素
      let flag = event.target === document.documentElement;
      if (!flag) {
        this.$store.commit("ipcRenderer", {
          method: "invoke",
          key: "setIgnore",
          value: { bol: true, forward: true },
        });
      } else {
        this.$store.commit("ipcRenderer", {
          method: "invoke",
          key: "setIgnore",
          value: { bol: false },
        });
      }
    });
    ipcRenderer.on("customCardNotice", (event, data) => {
      console.log(data);
    });
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.desktop-crad {
  width: 100vw;
  height: auto;
  position: relative;
  bottom: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column-reverse;
}
.animation {
  position: relative;
  // left: 320px;
  animation: all linear 0.4s;
}
</style>
