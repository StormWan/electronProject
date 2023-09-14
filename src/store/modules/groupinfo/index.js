import { deleteConversation } from "@/api/im-sdk-api/index";
import { restApi } from "@/api/node-admin-api/rest";
import {
  getGroupList,
  getGroupProfile,
  getGroupMemberList,
  quitGroup,
  createGroup,
  dismissGroup,
} from "@/api/im-sdk-api/group";

function compareByRole(a, b) {
  const roles = { Owner: 1, Admin: 2, Member: 3 };
  return roles[a.role] - roles[b.role];
}

export default {
  // namespaced: true,
  state: {
    isShowAddBook: false, // 地址本状态
    popover: false, // 卡片
    seat: null,
    cardData: null,
    groupDrawer: false, // 群聊开关
    groupList: [], //群组列表
    groupProfile: null, // 群聊数据
    currentMemberList: [], // 当前群组成员列表
  },
  getters: {
    hasGroupList(state) {
      return state.groupList.length > 0;
    },
    // 群主
    isOwner(state) {
      if (state.groupProfile) {
        const { role } = state.groupProfile?.selfInfo;
        return role == "Owner";
      } else {
        return "";
      }
    },
    // 管理员
    isAdmin(state) {
      if (state.groupProfile) {
        const { role } = state.groupProfile?.selfInfo;
        return role == "Admin";
      } else {
        return "";
      }
    },
  },
  mutations: {
    // 更新群详情
    setGroupProfile(state, payload) {
      state.groupProfile = payload;
    },
    // 打开地址本
    setAddbookStatus(state, status) {
      state.isShowAddBook = status;
    },
    setPopoverStatus(state, payload) {
      const { status, seat, cardData } = payload;
      state.popover = status;
      state.seat = seat;
      state.cardData = cardData;
    },
    setGroupStatus(state, status) {
      state.groupDrawer = status;
    },
  },
  actions: {
    async getGroupMemberList({ state, commit, getters }, payload) {
      const groupID = getters.toAccount;
      const { memberList, code } = await getGroupMemberList({ groupID });
      let sortlist = memberList;
      sortlist.sort(compareByRole);
      state.currentMemberList = sortlist;
    },
    // 获取群列表数据
    async getGroupList({ state }, payload) {
      const { code, groupList } = await getGroupList();
      if (code !== 0) return;
      state.groupList = groupList;
    },
    // 退出群聊
    async QUIT_GROUP({ state, dispatch }, payload) {
      const { groupId, convId } = payload;
      const { code } = await quitGroup({ groupId });
      if (code !== 0) return;
      dispatch("DELETE_SESSION", { convId });
    },
    // 创建群聊
    async CREATE_GROUP({ state }, payload) {
      const { groupName } = payload;
      await createGroup({ groupName });
    },
    // 解散群组
    async DISMISS_GROUP({ state, dispatch, commit }, payload) {
      const { groupId, convId } = payload;
      // const { code, groupID } = await dismissGroup(groupId);
      // if (code !== 0) return;
      // dispatch("DELETE_SESSION", { convId });
      const { ErrorCode } = await restApi({
        params: groupId,
        funName: "destroyGroup",
      });
      if (ErrorCode !== 0) return;
      dispatch("DELETE_SESSION", { convId });
    },
    // 获取群详细资料
    async getGroupProfile({ state, commit }, payload) {
      const { type } = payload;
      if (type !== "GROUP") return;
      const { groupID } = payload.groupProfile;
      const { code, data } = await getGroupProfile({ groupID });
      if (code !== 0) return;
      commit("setGroupProfile", data);
    },
  },
};
