<template>
  <el-scrollbar class="scrollbar-list">
    <div class="no-msg" v-if="tabList.length == 0">
      <el-empty description="暂无会话。" :image-size="150" />
    </div>
    <div
      class="message-item"
      v-for="item in tabList"
      :key="item.conversationID"
      :class="fnClass(item)"
      @click="handleConvListClick(item)"
      @drop="dropHandler(e, item)"
      @dragenter="dragenterHandler"
      @dragleave="dragleaveHandler"
      v-contextmenu:contextmenu
      @contextmenu.prevent="handleContextMenuEvent($event, item)"
    >
      <!-- 置顶图标 -->
      <div class="pinned-tag" v-show="item.isPinned"></div>
      <!-- 头像 -->
      <el-badge is-dot :hidden="isShowCount(item) || !isNotify(item)">
        <img
          v-if="item.type == 'C2C'"
          :src="item.userProfile.avatar || squareUrl"
          class="portrait"
          alt="头像"
        />
        <UserAvatar
          v-else
          words="3"
          shape="square"
          :nickName="chatName(item)"
          :url="item?.groupProfile?.avatar"
        />
      </el-badge>
      <!-- 消息 -->
      <div class="message-item-right">
        <div class="message-item-right-top">
          <div class="message-chat-name flex">
            <span class="name-title">{{ chatName(item) }}</span>
            <Label :item="item" :userID="item.userProfile?.userID" />
          </div>
          <div class="message-time" v-if="item.lastMessage?.lastTime">
            {{ timeFormat(item.lastMessage.lastTime * 1000) }}
          </div>
        </div>
        <div class="message-item-right-bottom">
          <!-- <CustomMention v-if="isMention(item) || isdraft(item)" :item="item" />
          <span v-else>{{ formatNewsMessage(item) }}</span> -->
          {{ formatNewsMessage(item) }}
        </div>
        <!-- 未读消息红点 -->
        <el-badge
          v-show="!isShowCount(item) && !isNotify(item)"
          :value="item.unreadCount"
          :max="99"
        />
        <!-- 消息免打扰 -->
        <svg-icon v-show="isNotify(item)" iconClass="DontDisturb" class="dont" />
      </div>
    </div>
    <!-- 右键菜单 -->
    <contextmenu ref="contextmenu">
      <contextmenu-item
        v-for="item in RIGHT_CLICK_CHAT_LIST"
        :key="item.id"
        v-show="isShowMenu"
        @click="handleClickMenuItem(item)"
      >
        {{ item.text }}
      </contextmenu-item>
    </contextmenu>
  </el-scrollbar>
</template>

<script setup>
import { h, ref, onMounted } from "vue";
import { squareUrl, RIGHT_CLICK_CHAT_LIST, RIGHT_CLICK_MENU_LIST } from "../utils/menu";
import { Contextmenu, ContextmenuItem } from "v-contextmenu";
import { timeFormat } from "@/utils/chat/index";
import { useStore } from "vuex";
import { useState, useGetters } from "@/utils/hooks/useMapper";
import { TIMpingConv } from "@/api/im-sdk-api";
import Label from "../components/Label.vue";
import { chatName, isallStaff } from "../utils/utils";

const isShowMenu = ref(false);
const contextMenuItemInfo = ref([]);

const { dispatch, commit } = useStore();
const { tabList } = useGetters(["tabList"]);
const { messageList, Conver, currentUserProfile, sessionDraftMap } = useState({
  sessionDraftMap: (state) => state.conversation.sessionDraftMap,
  currentUserProfile: (state) => state.user.currentUserProfile,
  messageList: (state) => state.conversation.currentMessageList,
  conversationList: (state) => state.conversation.conversationList,
  Conver: (state) => state.conversation.currentConversation,
});

const isdraft = (item) => {
  return (
    item.conversationID !== Conver?.value?.conversationID &&
    sessionDraftMap.value.has(item.conversationID)
  );
};
const isNotify = (item) => {
  return item.messageRemindType == "AcceptNotNotify";
};
const isShowCount = (item) => {
  return item.unreadCount == 0;
};
const isMention = (item) => {
  return item.groupAtInfoList.length > 0;
};

const fnClass = (item) => {
  let current = Conver.value;
  let select = item?.conversationID == current?.conversationID;
  if (select) {
    return "is-active";
  }
};

const formatNewsMessage = (data) => {
  const { type, lastMessage, unreadCount } = data;
  const { messageForShow, fromAccount, isRevoked } = lastMessage;
  const { userID } = currentUserProfile.value;
  const isOther = userID !== fromAccount; // 其他人消息
  const isFound = fromAccount == "@TLS#NOT_FOUND"; // 未知消息
  const isSystem = type == "@TIM#SYSTEM"; //系统消息
  const isCount = unreadCount > 0 && isNotify(data); // 未读消息计数
  // 是否为撤回消息
  if (isRevoked) {
    const nick = isOther ? lastMessage.nick : "你";
    return `${nick}撤回了一条消息`;
  }
  if (isCount) {
    return `[${unreadCount}条] ${messageForShow}`;
  }
  if (isFound || isSystem) {
    return messageForShow;
  }
  if (type == "GROUP" && isOther) {
    if (lastMessage.nick) {
      return `${lastMessage.nick}: ${messageForShow}`;
    } else {
      messageForShow;
    }
  }
  return messageForShow;
};
// 定义消息提示元素
const createElement = (num = 0) => {
  const messageTypes = ["有人@我", "草稿"];
  return `<span style='color:#f44336;'>[${messageTypes[num]}]</span> `;
};
// 定义消息提示元素
const CustomMention = (props) => {
  const { item } = props;
  const { lastMessage, conversationID: ID } = item;
  const { messageForShow } = lastMessage;
  const draft = sessionDraftMap.value.get(ID);
  if (draft) {
    return h("span", { innerHTML: `${createElement(1)}${draft?.[0]?.children[0].text}` });
  }
  return h("span", { innerHTML: `${createElement()}${lastMessage.nick}: ${messageForShow}` });
};

// 消息列表 右键菜单
const handleContextMenuEvent = (e, item) => {
  const { type } = item;
  const isStystem = type == "@TIM#SYSTEM";
  // 系统通知屏蔽右键菜单
  isShowMenu.value = !isStystem;
  contextMenuItemInfo.value = item;
  // 会话
  RIGHT_CLICK_CHAT_LIST.map((t) => {
    if (t.id == "pinged") {
      t.text = item.isPinned ? "取消置顶" : "会话置顶";
    }
    if (t.id == "disable") {
      let off = item.messageRemindType == "AcceptNotNotify";
      t.text = off ? "关闭消息免打扰" : "消息免打扰";
    }
  });
};

const dropHandler = (e, item) => {
  console.log(e, item);
};
const dragenterHandler = (e) => {};
const dragleaveHandler = (e) => {};

// 会话点击
const handleConvListClick = (data) => {
  console.log(data, "会话点击");
  // return;
  if (Conver.value) {
    const { conversationID: id } = Conver.value;
    const newId = data?.conversationID;
    if (id == newId) return;
  }
  // 切换会话
  commit("SET_CONVERSATION", {
    type: "UPDATE_CURRENT_SELECTED_CONVERSATION",
    payload: data,
  });
  // 群详情信息
  dispatch("getGroupProfile", data);
  // 获取会话列表
  dispatch("GET_MESSAGE_LIST", data);
  commit("updataScroll");
  commit("setReplyMsg", null);
};

const handleClickMenuItem = (item) => {
  const Info = contextMenuItemInfo.value;
  switch (item.id) {
    case "pinged": // 置顶
      pingConv(Info);
      break;
    case "remove": // 删除会话
      removeConv(Info);
      break;
    case "clean": // 清除消息
      console.log("清除消息");
      break;
    case "disable": // 消息免打扰
      disableRecMsg(Info);
      break;
  }
};
// 消息免打扰
const disableRecMsg = async (data, off) => {
  const { type, toAccount, messageRemindType: remindType } = data;
  dispatch("SET_MESSAGE_REMIND_TYPE", {
    type,
    toAccount,
    remindType,
  });
};
// 删除会话
const removeConv = async (data) => {
  const { conversationID } = data;
  dispatch("DELETE_SESSION", { convId: conversationID });
};
// 置顶
const pingConv = async (data, off) => {
  const { conversationID, isPinned } = data;
  await TIMpingConv({
    conversationID,
    isPinned,
  });
};

onMounted(() => {});
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";
.v-contextmenu {
  width: 154px;
  .v-contextmenu-item {
    height: 32px;
    line-height: 32px;
    padding: 0px 16px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 12px;
  }
}
.no-msg {
  color: rgba(0, 0, 0, 0.45);
  margin-top: 50%;
}
.scrollbar-list {
  background: var(--color-body-bg);
  height: 100%;
  // height: calc(100% - 40px);
}
.message-item {
  padding: 12px 12px 12px 16px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  color: var(--color-text);
  &:hover {
    background: var(--hover-color);
  }
  .pinned-tag {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    border: 8px solid rgb(84, 180, 239);
    border-right-color: transparent;
    border-bottom-color: transparent;
  }
  .portrait {
    width: 40px;
    height: 40px;
    border-radius: 3px;
  }
  .message-item-right {
    width: 200px;
    margin-left: 14px;
    height: 44px;
    position: relative;
    .dont {
      position: absolute;
      right: 0;
      top: 26px;
      // color: rgb(29 33 41 / 30%);
    }
    .message-item-right-top {
      display: flex;
      justify-content: space-between;
      padding-bottom: 10px;
      width: 100%;
      .message-chat-name {
        font-size: 14px;
        // display: block;
        // text-overflow: ellipsis;
        // word-wrap: break-word;
        // overflow: hidden;
        // color: rgba(0, 0, 0, 0.85);
        max-height: 18px;
        line-height: 18px;
        max-width: 140px;
        .name-title {
          @include ellipsisBasic(1);
        }
      }
      .message-time {
        font-family: MicrosoftYaHei;
        font-size: 10px;
        color: rgba(0, 0, 0, 0.45);
      }
    }
    .message-item-right-bottom {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
      overflow: hidden;
      pointer-events: none;
      width: 179px;
      white-space: nowrap;
      text-overflow: ellipsis;
      position: relative;
    }
    .svg-icon {
      color: rgba(0, 0, 0, 0.45);
    }
    .el-badge {
      position: absolute;
      right: 0px;
      bottom: -2px;
      sup {
        top: 0;
      }
    }
  }
}
</style>
