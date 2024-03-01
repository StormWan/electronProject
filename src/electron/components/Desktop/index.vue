<template>
  <div></div>
</template>

<script>
export default {
  name: "Desktop",
  components: {},
  computed: {},
  props: {},
  data() {
    return {};
  },
  mounted() {
    ipcRenderer.on("customCardNotice", (event, data) => {
      console.log(data);
    });
  },
  methods: {},
};
</script>

<style lang="scss" scoped></style>
