<template>
  <div @click="onClick()" class="message-view_withdraw">
    <span class="withdraw">{{ getChangeType() }} </span>
    <span @click.stop="onEdit()" v-if="isReEdit" class="edit">重新编辑</span>
  </div>
</template>

<script>
import emitter from "@/utils/mitt-bus";
import { mapState, mapGetters } from "vuex";
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
      userProfile: (state) => state.user.currentUserProfile,
      revokeMsgMap: (state) => state.conversation.revokeMsgMap,
    }),
    ...mapGetters(["isOwner"]),
    // 消息的流向 in 为收到的消息 | out 为发出的消息
    isMine() {
      return this.message.flow == "out" ? true : false;
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
      console.log("[edit]:", data);
      emitter.emit("handleSetHtml", data?.payload?.text);
      this.$store.commit("setRevokeMsg", { data, type: "delete" });
    },
    getChangeType(message = this.message) {
      const { conversationType: type, nick, revokerInfo, revoker } = message;
      const isGroup = type === "GROUP";
      const isC2C = type === "C2C";
      if (this.isMine) {
        return "你撤回了一条消息";
      } else {
        if (isC2C) {
          return "对方撤回了一条消息";
        }
        if (isGroup) {
          return `${nick}撤回了一条消息`;
        }
      }
      // if (isGroup && this.isOwner) {
      //   const isSelf = this.userProfile.userID === revokerInfo?.userID;
      //   if (isSelf) {
      //     return `你撤回了成员${nick}的一条消息`;
      //   } else if (revoker !== revokerInfo.userID) {
      //     return `群主${revokerInfo?.nick}撤回了一条成员消息`;
      //   }
      // }
    },
  },
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
    // border-radius: 3px;
    // background: rgba(0, 0, 0, 0.05);
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
