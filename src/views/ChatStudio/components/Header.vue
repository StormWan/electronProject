<template>
  <header class="message-info-view-header" v-if="chat">
    <div class="message-info-views">
      <p v-if="currentType">
        <span v-if="chatType('C2C')" @click="openUser" class="single">
          {{ chatNick("C2C", chat) }}
        </span>
        <span v-else-if="chatType('GROUP')" @click="openSetup" class="group">
          {{ chatNick("GROUP", chat) }}
        </span>
        <span v-else-if="chatType('@TIM#SYSTEM')" class="system"> 系统通知 </span>
      </p>
    </div>
    <div class="flex">
      <div class="message-info-add" v-show="chat.type == 'GROUP' && false" title="添加成员">
        <svg-icon iconClass="tianjia" class="icon-hover" />
      </div>
      <div class="message-info-setup" v-show="chat.type == 'GROUP'" title="设置" @click="openSetup">
        <FontIcon iconName="MoreFilled" class="icon-hover" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { useState, useGetters } from "@/utils/hooks/useMapper";
import { useStore } from "vuex";

const { commit } = useStore();
const { currentType } = useGetters(["currentType"]);
const { chat, groupProfile } = useState({
  groupProfile: (state) => state.groupinfo.groupProfile,
  chat: (state) => state.conversation.currentConversation,
});

const chatType = (type) => {
  return currentType.value === type;
};

const chatNick = (type, chat) => {
  if (type === "C2C") {
    return chat.userProfile.nick || chat.userProfile.userID || chat.remark;
  } else if (type === "GROUP") {
    const {
      groupProfile: { name, groupID, memberCount },
    } = chat;
    const count = memberCount ? `(${memberCount})` : "";
    return `${name || groupID} ${count}`;
  }
};

const openSetup = () => {
  console.log(groupProfile.value);
  console.log(chat.value);
  commit("setGroupStatus", true);
};
const openUser = () => {
  console.log(chat.value);
};
</script>

<style lang="scss" scoped>
.message-info-view-header {
  height: 60px;
  background: var(--color-body-bg);
  border-bottom: 1px solid var(--color-border-default);
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  position: relative;
  .message-info-views {
    .group {
      cursor: pointer;
    }
    .single,
    .group {
      max-width: 200px;
      display: inline-block;
      @include text-ellipsis();
    }
  }
}

.message-info-setup {
  margin-left: 10px;
}
</style>
