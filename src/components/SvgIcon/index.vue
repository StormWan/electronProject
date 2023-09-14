<template>
  <svg class="svg-icon" :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
/* <svg-icon iconClass="loginBg" class="wave" /> */
export default {
  name: "SvgIcon",
  props: {
    iconClass: {
      type: String,
      default: "",
    },
    className: {
      type: String,
      default: "",
    },
  },
  computed: {
    svgClass() {
      return this.className;
    },
    iconName() {
      return `#icon-${this.iconClass}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.svg-icon {
  font-size: 16px;
  width: 1em;
  height: 1em;
  cursor: pointer;
}
</style>
