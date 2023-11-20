<template>
  <div class="style-news">
    <!-- 聊天列表 -->
    <div class="message-left">
      <!-- 搜索框 -->
      <Search />
      <!-- tabs切换 -->
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="全部" name="whole"></el-tab-pane>
        <el-tab-pane :label="unread" name="unread"></el-tab-pane>
        <el-tab-pane label="@我" name="mention"></el-tab-pane>
        <!-- <el-tab-pane label="群聊" name="groupChat"></el-tab-pane> -->
      </el-tabs>
      <div class="scroll-container" :class="{ 'style-net': !networkStatus }">
        <!-- 连接已断开 -->
        <networklink :show="!networkStatus" />
        <!-- 会话列表 -->
        <ConversationList />
      </div>
    </div>
    <!-- 聊天框 -->
    <div class="message-right" id="svgBox">
      <Header />
      <!-- 聊天窗口 -->
      <Chatwin ref="ChatRef" />
      <!-- 消息回复框 -->
      <ReplyBox />
      <div id="svgResize" @mouseover="dragControllerDiv(ChatRef)" v-if="showMsgBox"></div>
      <!-- 多选框 -->
      <MultiChoiceBox />
      <!-- 编辑器 -->
      <Editor />
    </div>
    <!-- 合并消息弹框 -->
    <MergeMessagePopup />
    <!-- 群详情 -->
    <GroupDetails
      v-if="currentType === TIM.TYPES.CONV_GROUP"
      :groupProfile="conver.groupProfile"
      :staff="isallStaff(conver)"
    />
  </div>
</template>

<script setup>
import {
  ref,
  onActivated,
  onDeactivated,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  onUnmounted,
  watch,
  watchEffect,
  nextTick,
} from "vue";
import TIM from "@tencentcloud/chat";
import { useEventListener } from "@/utils/hooks/index";
import { useState, useGetters } from "@/utils/hooks/useMapper";
import { dragControllerDiv, isallStaff } from "./utils/utils";
import { useStore } from "vuex";

import Editor from "./chat/Editor.vue";
import Sidebar from "./Sidebar.vue";
import Search from "./components/Search.vue";
import Header from "./components/Header.vue";
import ReplyBox from "./components/ReplyBox.vue";
import Chatwin from "./chat/Chatwin.vue";
import GroupDetails from "./chat/GroupDetails.vue";
import networklink from "./components/networklink.vue";
import ConversationList from "./chat/ConversationList.vue";
import MultiChoiceBox from "./components/MultiChoiceBox.vue";
import MergeMessagePopup from "./components/MergeMessagePopup.vue";

const unread = ref("未读");
const ChatRef = ref(null);
const activeName = ref("whole");
const { dispatch, commit } = useStore();

const { toAccount, currentType } = useGetters(["toAccount", "currentType"]);
const { networkStatus, conver, showMsgBox, totalUnreadMsg } = useState({
  networkStatus: (state) => state.conversation.networkStatus,
  totalUnreadMsg: (state) => state.conversation.totalUnreadMsg,
  conver: (state) => state.conversation.currentConversation,
  showMsgBox: (state) => state.conversation.showMsgBox,
});

const fnTotalUnreadMsg = () => {
  const unreadCount = totalUnreadMsg.value;
  const isUnread = unreadCount > 0;
  const num = unreadCount > 99 ? "99+" : unreadCount;
  unread.value = isUnread ? `未读(${num})` : "未读";
};
const toBottom = () => {
  commit("updataScroll");
};
const handleClick = ({ props }, event) => {
  const { label, name } = props;
  commit("TOGGLE_LIST", name);
};
useEventListener(window, "online", () => {
  commit("SET_NETWORK_STATUS", true);
});
useEventListener(window, "offline", () => {
  commit("SET_NETWORK_STATUS", false);
});
useEventListener(window, "focus", () => {
  if (!conver.value) return;
  const { conversationID } = conver?.value;
  commit("SET_HISTORYMESSAGE", {
    type: "MARKE_MESSAGE_AS_READED",
    payload: {
      convId: conversationID,
      message: conver.value,
    },
  });
});
onActivated(() => {
  commit("updataScroll");
  commit("TOGGLE_LIST", "whole");
});
onDeactivated(() => {});
onMounted(() => {});
onUnmounted(() => {});
watchEffect(() => {
  fnTotalUnreadMsg();
});
</script>

<style lang="scss" scoped>
.style-news {
  width: 100%;
  display: flex;
}
.demo-tabs {
  :deep(.el-tabs__header) {
    margin: 0;
    padding: 0 16px;
  }
  :deep(.el-tabs__nav-wrap) {
    margin: 0;
  }
}
.message-left {
  width: 280px;
}
.message-right {
  background: var(--color-body-bg);
  border-left: 1px solid var(--color-border-default);
  width: calc(100% - 280px);
  //  - 68px
  height: 100%;
  position: relative;
  overflow: hidden;
  min-width: 274px;
}
.scroll-container {
  height: calc(100% - 60px - 40px);
  position: relative;
}
.style-net {
  height: calc(100% - 60px - 34px - 40px);
}

#svgResize {
  position: relative;
  height: 5px;
  width: 100%;
  // cursor: s-resize;
  cursor: row-resize;
  font-size: 12px;
}
.back-to-the-bottom {
  position: absolute;
  width: 70px;
  height: 20px;
  background: #17a7f6;
  top: -30px;
  right: 15px;
  z-index: 1;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  cursor: pointer;
}
</style>
