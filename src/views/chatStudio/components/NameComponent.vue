<template>
  <div class="message_name" v-show="!shouldDisplay">
    <span v-if="isGroup" class="isGroup">{{ item.nick }}</span>
    <span v-else-if="isSystem" class="isSystem">系统</span>
    <span v-else class="isFound">管理员</span>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  computed: {
    from() {
      return this.item.from;
    },
    chatType() {
      return this.item.conversationType;
    },
    isGroup() {
      return this.chatType !== "C2C" && this.from !== "@TLS#NOT_FOUND";
    },
    isSystem() {
      return this.from === "@TIM#SYSTEM";
    },
    isFound() {
      return this.from === "@TLS#NOT_FOUND";
    },
    shouldDisplay() {
      return this.item.isRevoked || this.item.type === "TIMGroupTipElem";
    },
  },
};
</script>

<style lang="scss" scoped>
.message_name {
  margin-bottom: 5px;
  color: var(--color-time-divider);
  font-size: 12px;
}
</style>
