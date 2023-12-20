<template>
  <div class="group-tip-element-wrapper">
    {{ getGroupTipContent(message) }}
  </div>
</template>

<script>
import { mapState } from "vuex";
import TIM from "@/utils/IM/chat/index";
export default {
  name: "GroupTipElement",
  props: {
    message: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState({
      memberList: (state) => state.groupinfo.currentMemberList,
    }),
    details() {
      return this.memberList.filter((t) => t.userID == this.message.payload.operatorID)?.[0] || {};
    },
  },
  methods: {
    getGroupTipContent(message) {
      const userName = message?.nick || message.payload.userIDList.join(",");
      switch (message.payload.operationType) {
        case TIM.TYPES.GRP_TIP_MBR_JOIN:
          return `${userName} 加入群聊`;
        case TIM.TYPES.GRP_TIP_MBR_QUIT:
          return `群成员：${userName} 退出群聊`;
        case TIM.TYPES.GRP_TIP_MBR_KICKED_OUT:
          return `${this.details.nick || ""} 将 ${userName} 移出群聊`;
        case TIM.TYPES.GRP_TIP_MBR_SET_ADMIN:
          return `群成员：${userName} 成为管理员`;
        case TIM.TYPES.GRP_TIP_MBR_CANCELED_ADMIN:
          return `群成员：${userName} 被撤销管理员`;
        case TIM.TYPES.GRP_TIP_GRP_PROFILE_UPDATED:
          return "群资料修改";
        case "256":
          if (message.payload.text.indexOf("结束群聊") > -1) {
            return `"${message.payload.text}"`;
          } else {
            return `${message.payload.text}`;
          }
        case TIM.TYPES.GRP_TIP_MBR_PROFILE_UPDATED:
          for (let member of message.payload.memberList) {
            if (member.muteTime > 0) {
              return `群成员：${member.userID}被禁言${member.muteTime}秒`;
            } else {
              return `群成员：${member.userID}被取消禁言`;
            }
          }
          break;
        default:
          return "[群提示消息]";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.group-tip-element-wrapper {
  font-size: 12px;
  border-radius: 3px;
  // background: var(--color-group-tip);
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
