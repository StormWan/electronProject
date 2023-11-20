<template>
  <div @click="onClick()" class="message-view_withdraw">
    <span class="withdraw">{{ getChangeType() }} </span>
    <span @click.stop="onEdit()" v-if="isReEdit" class="edit">重新编辑</span>
  </div>
</template>

<script>
import emitter from "@/utils/mitt-bus";
import { mapState } from "vuex";
export default {
  name: "TipsElemItem",
  props: {
    message: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState({
      currentConversation: (state) => state.conversation.currentConversation,
      currentMessageList: (state) => state.conversation.currentMessageList,
      revokeMsgMap: (state) => state.conversation.revokeMsgMap,
    }),
    isMine() {
      return this.message.flow !== "out";
    },
    isReEdit() {
      return this.revokeMsgMap.get(this.message.ID);
    },
  },
  methods: {
    onClick() {
      console.log(this.revokeMsgMap);
    },
    onEdit(data = this.message) {
      emitter.emit("handleSetHtml", data?.payload?.text);
      this.$store.commit("setRevokeMsg", { data, type: "delete" });
    },
    getChangeType(message = this.message) {
      const { conversationType, nick } = message;
      if (conversationType === "C2C" && this.isMine) {
        return "对方撤回了一条消息";
      }
      if (conversationType === "GROUP" && this.isMine) {
        return `${nick}撤回了一条消息`;
      }
      return "你撤回了一条消息";
    },
  },
  // render() {
  //   return (
  //     <div class="message-view_withdraw" onClick={this.onClick()}>
  //       {this.getChangeType()}
  //     </div>
  //   );
  // },
};
</script>

<style lang="scss" scoped>
.message-view_withdraw {
  font-size: 12px;
  vertical-align: middle;
  word-wrap: normal;
  word-break: break-all;
  margin-top: 5px;
  line-height: 16px;
  justify-content: center;
  .withdraw {
    border-radius: 3px;
    background: rgba(0, 0, 0, 0.05);
    color: var(--color-time-divider);
    padding: 4px 6px;
  }
  .edit {
    user-select: none;
    color: #337ecc;
    padding-left: 10px;
    cursor: pointer;
  }
}
</style>
