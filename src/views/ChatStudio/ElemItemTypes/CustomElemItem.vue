<template>
  <div
    class="message-view__item--text"
    :class="self ? 'is-text-self' : 'is-text-other'"
    @click="onClick"
  >
    {{ customMessage() }}
  </div>
</template>

<script>
export default {
  name: "CustomElemItem",
  props: {
    message: {
      type: Object,
      default: null,
    },
    self: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    customMessage(payload = this.message.payload) {
      let videoPayload = {};
      try {
        videoPayload = JSON.parse(payload.data);
      } catch (e) {
        videoPayload = {};
      }
      if (videoPayload.businessID == "group_create") {
        return videoPayload.opUser + videoPayload.content;
      }
      if (payload.data === "group_create") {
        return `${payload.extension}`;
      }
      if (payload.text) {
        return payload.text;
      } else {
        return "[自定义消息]";
      }
    },
    onClick() {
      console.log(this.message);
    },
  },
};
</script>

<style lang="scss" scoped>
.is-text-self {
  background: var(--self-msg-color);
}
.is-text-other {
  background: var(--other-msg-color);
}
.message-view__item--text {
  width: fit-content;
  padding: 10px 14px;
  max-width: 360px;
  padding: 10px 14px;
  box-sizing: border-box;
  border-radius: 3px;
}
</style>
