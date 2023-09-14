<template>
  <el-drawer
    ref="drawerRef"
    v-model="visible"
    title="群详情"
    size="360px"
    :modal="true"
    modal-class="drawer-group"
    :before-close="handleClose"
    :close-on-press-escape="true"
    :append-to-body="false"
    :show-close="true"
    :with-header="true"
  >
    <div class="group-details" v-if="currentType === TIM.TYPES.CONV_GROUP">
      <!-- info -->
      <div class="group-base-info">
        <UserAvatar :url="groupProfile.avatar" :nickName="groupProfile.name" />
        <div class="group-base-info--text">
          <div>
            <span class="group-base-info--text__name">
              {{ groupProfile.name }}
            </span>
            <FontIcon
              v-show="isOwner"
              class="style-editPen"
              iconName="EditPen"
              @click="openNamePopup"
            />
          </div>
          <span class="group-base-info--text__type">
            {{ GROUP_TYPE_MAP[groupProfile.type] }}
          </span>
        </div>
      </div>
      <el-divider />
      <!-- 群公告 -->
      <div class="group-accountecment">
        <div class="group-accountecment--title">
          <span>群公告</span>
          <FontIcon
            v-show="isOwner"
            class="style-editPen"
            iconName="EditPen"
            @click="openNoticePopup"
          />
        </div>
        <div class="group-accountecment--info">
          <AnalysisUrl :text="groupProfile.notification" />
        </div>
      </div>
      <el-divider />
      <!-- 群成员 -->
      <div class="group-member">
        <div class="group-member--title">
          <span> 群成员 </span>
          <span class="group-member--title__right">
            <span>{{ currentMemberList.length }}人 </span>
            <!-- <span><a @click="openDetails">查看</a></span> -->
          </span>
        </div>
        <div class="group-member--avatar">
          <span class="group-member--add" @click="groupMemberAdd"> </span>
          <div
            class="avatar"
            v-for="item in currentMemberList"
            :key="item.userID"
            @click="navigate(item)"
          >
            <el-icon
              class="style-close"
              v-show="isOwner"
              :class="{ isown: userProfile.userID == item.userID }"
              @click.stop="removeGroupMemberBtn(item)"
            >
              <CircleCloseFilled />
            </el-icon>
            <UserAvatar className="avatar-item" :url="item.avatar" :nickName="item.nick" />
            <div class="admin" :class="item.role" v-if="item.role !== 'Member'">
              {{ item.role == "Owner" ? "群主" : "管理员" }}
            </div>
          </div>
        </div>
      </div>
      <el-divider />
      <!-- 免打扰 -->
      <div class="group-flag-message" v-if="false">
        <div class="group-flag-message--title">
          <span class="group-flag-message--title__text"> 消息免打扰 </span>
          <el-switch v-model="isNotify" @change="notify" />
        </div>
      </div>
      <el-divider />
      <!-- 退出 转让 -->
      <div class="group-operator" v-show="!staff">
        <el-button v-if="isOwner" type="danger" @click="handleDismissGroup"> 解散群组 </el-button>
        <el-button v-else type="danger" @click="handleQuitGroup"> 退出群组 </el-button>
        <div class="group-operator--divider"></div>
        <!-- <el-button type="primary" plain v-show="isOwner" @click="handleTransferGroup">
          转让群组
        </el-button> -->
      </div>
      <!-- 添加成员弹框 -->
      <AddMemberPopup @define="addGroupMemberBtn" ref="AddMemberRef" />
    </div>
  </el-drawer>
</template>

<script setup>
import { nextTick, ref, computed, toRefs, watchEffect } from "vue";
import { useState, useGetters } from "@/utils/hooks/useMapper";
import { useStore } from "vuex";
import { updateGroupProfile, addGroupMember, deleteGroupMember } from "@/api/im-sdk-api/group";
import { useI18n } from "vue-i18n";
import AddMemberPopup from "../components/AddMemberPopup.vue";
import AnalysisUrl from "../components/AnalysisUrl.vue";
import { showConfirmationBox } from "@/utils/message";
import TIM from "@tencentcloud/chat";
// eslint-disable-next-line no-undef
const props = defineProps({
  groupProfile: {
    type: Object,
    default: () => {},
  },
  staff: {
    type: Boolean,
    default: false,
  },
});
const { groupProfile, staff } = toRefs(props);

const GROUP_TYPE_MAP = {
  Public: "陌生人社交群(Public)",
  Private: "好友工作群(Work)",
  ChatRoom: "临时会议群(Meeting)",
  AVChatRoom: "直播群(AVChatRoom)",
};
const { locale, t } = useI18n();
const { state, commit, dispatch } = useStore();
const { userProfile, groupDrawer, currentMemberList, currentConversation } = useState({
  userProfile: (state) => state.user.currentUserProfile,
  groupDrawer: (state) => state.groupinfo.groupDrawer,
  currentMemberList: (state) => state.groupinfo.currentMemberList,
  currentConversation: (state) => state.conversation.currentConversation,
});
const { isOwner, isAdmin, toAccount, currentType } = useGetters([
  "isOwner",
  "isAdmin",
  "toAccount",
  "currentType",
]);

watchEffect(() => {});
const isNotify = ref(false);
const AddMemberRef = ref();
const notify = (val) => {
  // const { type, toAccount, messageRemindType: remindType } = currentConversation.value;
  // dispatch("SET_MESSAGE_REMIND_TYPE", {
  //   type,
  //   toAccount,
  //   remindType,
  // });
};
const visible = computed({
  get() {
    return groupDrawer.value;
  },
  set() {
    commit("setGroupStatus", false);
  },
});
const openNamePopup = async () => {
  const { name } = groupProfile.value;
  const data = { message: "输入群名", inputValue: name };
  const result = await showConfirmationBox(data, "prompt");
  if (result == "cancel") return;
  const { value, action } = result;
  modifyGroupInfo(value);
};
const openNoticePopup = async () => {
  const { notification } = groupProfile.value;
  const data = { message: "输入群公告", inputValue: notification };
  const result = await showConfirmationBox(data, "prompt");
  if (result == "cancel") return;
  const { value, action } = result;
  modifyGroupInfo(value, "notification");
};
const openDetails = () => {};
const handleClose = (done) => {
  done();
};
const groupMemberAdd = () => {
  AddMemberRef.value.onenDialog();
};
const navigate = (item) => {
  dispatch("CHEC_OUT_CONVERSATION", { convId: `C2C${item.userID}` });
  commit("setGroupStatus", false);
};
const removeGroupMemberBtn = async (item) => {
  const data = { message: `确定将 ${item.nick} 移出群聊?`, iconType: "warning" };
  const result = await showConfirmationBox(data);
  if (result == "cancel") return;
  const params = { groupID: toAccount.value, user: item.userID };
  const { code } = await deleteGroupMember(params);
  if (code !== 0) return;
  updataGroup();
};
const addGroupMemberBtn = (value) => {
  const { groupID } = groupProfile.value;
  const { toAccount } = value;
  addGroupMember({ groupID, user: toAccount });
  updataGroup();
};
const updataGroup = () => {
  setTimeout(() => {
    dispatch("getGroupMemberList");
  }, 250);
};
// 修改群资料
const modifyGroupInfo = async (value, modify) => {
  const { groupID } = groupProfile.value;
  const { code, group } = await updateGroupProfile({
    convId: groupID,
    modify: modify,
    value,
  });
};
const handleDismissGroup = async () => {
  const data = { message: "确定解散群聊?", iconType: "warning" };
  const result = await showConfirmationBox(data);
  if (result == "cancel") return;
  const { conversationID } = currentConversation.value;
  dispatch("DISMISS_GROUP", {
    convId: conversationID,
    groupId: toAccount.value,
  });
};
const handleTransferGroup = async () => {
  const data = { message: "确定转让群聊?", iconType: "warning" };
  const result = await showConfirmationBox(data);
  if (result == "cancel") return;
};
const handleQuitGroup = async () => {
  const data = { message: "确定退出群聊?", iconType: "warning" };
  const result = await showConfirmationBox(data);
  if (result == "cancel") return;
  const { conversationID } = currentConversation.value;
  dispatch("QUIT_GROUP", {
    convId: conversationID,
    groupId: toAccount.value,
  });
  commit("setGroupStatus", false);
};
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";

.admin {
  width: 40px;
  height: 14px;
  text-align: center;
  line-height: 14px;
  font-size: 8.64px;
  position: absolute;
  top: 30px;
  border-radius: 2px;
  background: #fffbe6;
  color: #4ab017b3;
  border: 0.64px solid rgb(191, 232, 158);
}
.Owner {
  color: #faad14;
  border: 0.64px solid rgba(255, 229, 143, 1);
}

:deep(.el-divider) {
  margin: 0;
}
.style-editPen {
  vertical-align: bottom;
  margin-left: 5px;
}
.avatar:hover .style-close {
  visibility: visible;
}
.style-close {
  visibility: hidden;
  position: absolute;
  right: -7px;
  top: -7px;
  color: #f44336 !important;
  cursor: pointer;
}
.member-list-drawer--item {
  display: flex;
  align-items: center;
  padding: 5px 0;
  .member-list-drawer--item__name {
    margin-left: 8px;
  }
}
.group-accountecment {
  padding: 12px 0;
  // .group-accountecment--title {
  // }
  .group-accountecment--info {
    font-size: 12px;
    font-weight: 400;
    color: #999999;
    line-height: 16px;
    min-height: 12px;
    @include ellipsisBasic(5);
  }
}
.group-base-info {
  padding-bottom: 20px;
  display: flex;
  align-items: center;
  .group-base-info--text {
    display: flex;
    flex-direction: column;
    margin-left: 8px;
    .group-base-info--text__name {
      display: inline-block;
      vertical-align: bottom;
      max-width: 150px;
      font-size: 14px;
      font-weight: 400;
      color: #000000;
      margin-right: 8px;
      @include text-ellipsis;
    }
    .group-base-info--text__type {
      font-size: 12px;
      font-weight: 400;
      color: #999999;
    }
  }
}
.group-member {
  padding: 12px 0;
  .group-member--title {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    .group-member--title__right {
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      span a {
        background-color: transparent;
        text-decoration: none;
        color: #006eff;
        cursor: pointer;
      }
    }
  }
  .group-member--avatar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .avatar {
      position: relative;
      margin-right: 12px;
      margin-bottom: 12px;
      .isown {
        display: none;
      }
    }
    .group-member--add {
      width: 38px;
      height: 38px;
      margin-right: 14px;
      margin-bottom: 14px;
      background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzhweCIgaGVpZ2h0PSIzOHB4IiB2aWV3Qm94PSIwIDAgMzggMzgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+5L2N5Zu+5aSH5Lu9IDY8L3RpdGxlPgogICAgPGRlZnM+CiAgICAgICAgPGNpcmNsZSBpZD0icGF0aC0xIiBjeD0iMTgiIGN5PSIxOCIgcj0iMTgiPjwvY2lyY2xlPgogICAgPC9kZWZzPgogICAgPGcgaWQ9Iumhtemdoi0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iMDQt576k6IGKLeaJqeWxleWKn+iDvS3nvqTorr7nva4iIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04MDEuMDAwMDAwLCAtMzIxLjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0i5L2N5Zu+5aSH5Lu9LTYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDgwMi4wMDAwMDAsIDMyMi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxtYXNrIGlkPSJtYXNrLTIiIGZpbGw9IndoaXRlIj4KICAgICAgICAgICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgICAgICAgICAgPC9tYXNrPgogICAgICAgICAgICAgICAgPHVzZSBpZD0i6JKZ54mIIiBzdHJva2U9IiM5OTk5OTkiIGZpbGwtcnVsZT0ibm9uemVybyIgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTksMTEgTDE5LDE2Ljc3NyBMMjUsMTYuNzc3Nzc3OCBMMjUsMTguNzc3Nzc3OCBMMTguOTk5LDE4Ljc3NyBMMTksMjUgTDE3LDI1IEwxNi45OTksMTguNzc3IEwxMSwxOC43Nzc3Nzc4IEwxMSwxNi43Nzc3Nzc4IEwxNywxNi43NzcgTDE3LDExIEwxOSwxMSBaIiBpZD0i5b2i54q257uT5ZCIIiBmaWxsPSIjOTk5OTk5Ij48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==);
    }
  }
}
.group-flag-message {
  padding: 12px 0;
}
.group-operator {
  padding-top: 20px;
  display: flex;
  justify-content: center;
  .group-operator--divider {
    width: 12px;
  }
}
</style>
