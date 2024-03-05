<template>
  <div class="desktop-crad animation border"></div>
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
      let flag = event.target === document.documentElement;
      this.$store.commit("ipcRenderer", {
        method: "invoke",
        key: "setIgnore",
        value: { bol: flag, forward: flag ? { forward: true } : null },
      });
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
  display: flex;
}
.animation {
  animation: all linear 0.4s;
}
.border {
  height: 100%;
  width: 100%;
  border: 1px solid #ccc;
}
</style>
