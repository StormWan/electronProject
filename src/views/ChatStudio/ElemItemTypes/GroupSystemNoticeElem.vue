<template>
  <div class="message-view__item--text">
    {{ message.from }}
  </div>
</template>

<script>
export default {
  name: "GroupSystemNoticeElem",
  props: {
    message: {
      type: Object,
      default: null,
    },
  },
};
</script>

<style lang="scss" scoped>
.message-view__item--text {
  width: fit-content;
  padding: 10px 14px;
  max-width: 360px;
  padding: 10px 14px;
  box-sizing: border-box;
  border-radius: 3px;
}
</style>
