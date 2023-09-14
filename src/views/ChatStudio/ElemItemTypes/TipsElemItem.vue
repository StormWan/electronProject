<template>
  <div @click="onClick()" class="message-view_withdraw">
    {{ getChangeType() }}
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
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
    }),
    ...mapGetters(["toAccount", "isOwner", "tabList"]),
  },
  methods: {
    onClick() {
      console.log(this.tabList);
    },
    getChangeType(message = this.message) {
      const { conversationType, flow, from, nick } = message;
      const isMine = flow == "out";
      if (conversationType === "C2C" && !isMine) {
        return "对方撤回了一条消息";
      }
      if (conversationType === "GROUP" && !isMine) {
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
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.05);
  vertical-align: middle;
  word-wrap: normal;
  word-break: break-all;
  color: rgba(0, 0, 0, 0.45);
  margin-top: 5px;
  padding: 4px 6px;
  line-height: 16px;
  justify-content: center;
}
</style>
