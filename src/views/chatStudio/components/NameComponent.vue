<template>
  <div class="message_name" v-show="!shouldDisplay">
    <span v-if="isGroup" class="isGroup" @click="handleAt">
      <span :class="styleNick">{{ item.nick }}</span>
      <span class="mention">@</span>
      <span v-if="groupProfile?.ownerID == item.from"> (群主) </span>
    </span>
    <span v-else-if="isSystem" class="isSystem">系统</span>
    <span v-else class="isFound">管理员</span>
  </div>
</template>

<script>
import emitter from "@/utils/mitt-bus";
import { mapGetters, mapState } from "vuex";
export default {
  props: {
    item: Object,
  },
  computed: {
    ...mapGetters(["isOwner"]),
    ...mapState({
      showCheckbox: (state) => state.conversation.showCheckbox,
      groupProfile: (state) => state.groupinfo.groupProfile,
    }),
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
      if (this.chatType === "C2C") return true;
      return this.item.isRevoked || this.item.type === "TIMGroupTipElem";
    },
    styleNick() {
      return this.showCheckbox ? "" : "nick";
    },
  },
  methods: {
    handleAt() {
      if (this.showCheckbox) return;
      emitter.emit("handleAt", { id: this.from, name: this.item.nick });
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

.isGroup {
  cursor: pointer;

  .mention {
    visibility: hidden;
  }

  &:hover {
    .mention,
    .nick {
      color: rgb(84, 180, 239);
      visibility: visible;
    }
  }
}
</style>
