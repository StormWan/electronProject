import { CONVERSATIONTYPE, GET_MESSAGE_LIST, HISTORY_MESSAGE_COUNT } from "@/store/mutation-types";
import { addTimeDivider } from "@/utils/chat/index";
import { imCallback } from "@/api/node-admin-api/other";
import TIM from "@tencentcloud/chat";
import { nextTick } from "vue";
import {
  deleteConversation,
  getConversationProfile,
  setMessageRead,
  setMessageRemindType,
} from "@/api/im-sdk-api";
import { sendMsg } from "@/api/im-sdk-api/message";
import { getMsgList, getUnreadMsg } from "@/api/im-sdk-api/session";

const getBaseTime = (list) => {
  return list?.length > 0 ? list.find((t) => t.isTimeDivider).time : 0;
};

const conversation = {
  // namespaced: true, //命名空间
  state: {
    sessionDraftMap: new Map(), //会话草稿
    totalUnreadMsg: 0, // 未读消息总数
    showMsgBox: false, //是否显示输入框
    showCheckbox: false, //是否显示多选框
    isShowModal: false, // @好友弹框
    noMore: false, // 加载更多  false ? 显示loading : 没有更多
    networkStatus: true, // 网络状态
    needScrollDown: -1, // 是否向下滚动 true ? 0 : -1
    forwardData: new Map(), // 多选数据
    uploadProgress: new Map(), //上传进度
    downloadProgress: new Map(), //下载进度
    historyMessageList: new Map(), //历史消息
    currentMessageList: [], //当前消息列表(窗口聊天消息)
    currentConversation: null, //跳转窗口的属性
    conversationList: [], // 会话列表数据
    currentReplyMsg: null, // 回复数据
    currentReplyUser: null,
    activetab: "whole", // 全部 未读 提及我
    outside: "message", // 侧边栏初始状态
    isNotify: false, // 是否免打扰
  },
  mutations: {
    // 设置历史消息
    SET_HISTORYMESSAGE(state, action) {
      const { type, payload } = action;
      switch (type) {
        // 添加消息 首次进入会话是调用
        case CONVERSATIONTYPE.ADD_MESSAGE: {
          console.log(payload, "添加消息");
          const { convId, message } = payload;
          state.historyMessageList.set(convId, message);
          if (state.currentConversation) {
            state.currentMessageList = state.historyMessageList.get(convId);
          } else {
            state.currentMessageList = [];
          }
          // 当前会话少于历史条数关闭loading
          const isMore = state.currentMessageList?.length < HISTORY_MESSAGE_COUNT;
          // HISTORY_MESSAGE_COUNT;
          state.noMore = isMore;
          break;
        }
        // 添加更多消息 拉取历史消息时触发
        case CONVERSATIONTYPE.ADD_MORE_MESSAGE: {
          console.log(payload, "添加更多消息");
          const { convId, messages } = payload;
          let history = state.historyMessageList.get(convId);
          let baseTime = getBaseTime(history);
          let timeDividerResult = addTimeDivider(messages, baseTime).reverse();
          state.historyMessageList.set(
            convId,
            history ? history.concat(timeDividerResult) : timeDividerResult
          );
          state.currentMessageList = state.historyMessageList.get(convId);
          break;
        }
        // 更新消息 收到新消息 或 发送消息后 触发
        case CONVERSATIONTYPE.UPDATE_MESSAGES: {
          console.log(payload, "更新消息");
          const { convId, message } = payload;
          let oldMessageList = state.historyMessageList.get(convId);
          let matched = false;
          // let newMessageList = [];
          // if (oldMessageList) {
          //   newMessageList = oldMessageList.map((oldMessage) => {
          //     if (oldMessage.ID === payload.message.ID) {
          //       matched = true;
          //       return payload.message;
          //     } else {
          //       return oldMessage;
          //     }
          //   });
          // }
          // 新消息
          // if (!matched) {
          //   let baseTime = getBaseTime(newMessageList);
          //   let timeDividerResult = addTimeDivider([message], baseTime).reverse();
          //   newMessageList.unshift(...timeDividerResult);
          // }
          // 使用reduce()方法来代替map()
          // 并在reduce过程中判断是否匹配到了消息。
          // 避免在检查完所有旧消息之后仍需要再次遍历新消息数组来判断是否添加新消息的情况
          const newMessageList = oldMessageList.reduce((acc, item) => {
            if (item.ID === payload.message.ID) {
              matched = true;
              acc.push(payload.message);
            } else {
              acc.push(item);
            }
            return acc;
          }, []);
          // 新消息
          if (!matched) {
            let baseTime = getBaseTime(newMessageList);
            let timeDividerResult = addTimeDivider([message], baseTime).reverse();
            newMessageList.unshift(...timeDividerResult);
          }
          // 更新历史消息
          state.historyMessageList.set(convId, newMessageList);
          // 当前会有列表有值
          if (state.currentConversation) {
            if (state.currentConversation.conversationID === convId) {
              state.currentMessageList = newMessageList;
            }
            state.needScrollDown = 0;
          }
          break;
        }
        // 删除消息
        case CONVERSATIONTYPE.DELETE_MESSAGE: {
          console.log(payload, "删除消息");
          const { convId, message } = payload;
          const history = state.historyMessageList.get(convId);
          if (!history) return;
          const newHistory = history.filter((item) => !item.isTimeDivider && !item.isDeleted);
          const newHistoryList = addTimeDivider(newHistory.reverse()).reverse();
          state.historyMessageList.set(convId, newHistoryList);
          state.currentMessageList = newHistoryList;
          break;
        }
        // 撤回消息
        case CONVERSATIONTYPE.RECALL_MESSAGE: {
          console.log(payload, "撤回消息");
          const { convId, message } = payload;
          let oldConvId = state.currentConversation?.conversationID;
          let history = state.historyMessageList.get(convId);
          if (!history) return;
          if (oldConvId !== convId) return;
          const newHistory = history.filter((item) => !item.isTimeDivider);
          const newHistoryList = addTimeDivider(newHistory.reverse()).reverse();
          state.historyMessageList.set(convId, newHistoryList);
          state.currentMessageList = newHistoryList;
          break;
        }
        // 回复消息
        case CONVERSATIONTYPE.SET_CURRENT_REPLY_MSG: {
          state.currentReplyMsg = payload;
          break;
        }
        // 清除历史记录
        case CONVERSATIONTYPE.CLEAR_HISTORY: {
          Object.assign(state, {
            sessionDraftMap: new Map(),
            historyMessageList: new Map(),
            currentConversation: null,
            currentMessageList: [],
            activetab: "whole",
            showMsgBox: false,
            showCheckbox: false,
            currentReplyUser: null,
            currentReplyMsg: null,
          });
          break;
        }
        // 加载更多状态
        case CONVERSATIONTYPE.UPDATE_NOMORE: {
          state.noMore = payload;
          break;
        }
        // 将消息标记为已读
        case CONVERSATIONTYPE.MARKE_MESSAGE_AS_READED: {
          const {
            convId,
            message: { unreadCount },
          } = payload;
          if (unreadCount == "0") return;
          setMessageRead(convId);
          break;
        }
        // 更新缓存数据
        case CONVERSATIONTYPE.UPDATE_CACHE: {
          console.log(payload, "更新缓存数据");
          const { convId, message } = payload;
          let history = state.historyMessageList.get(convId);
          if (!history) return;
          let baseTime = getBaseTime(history);
          let timeDivider = addTimeDivider(message, baseTime).reverse();
          history.unshift(...timeDivider);
          break;
        }
        case CONVERSATIONTYPE.UPDATE_MESSAGE_ELEM_PROGRESS: {
          // let { messageId, } = payload;
          // state.uploadProgress.set(``, {});
        }
      }
    },
    // 设置会话
    SET_CONVERSATION(state, action) {
      const { type, payload } = action;
      switch (type) {
        // 切换 跳转 会话
        case CONVERSATIONTYPE.UPDATE_CURRENT_SELECTED_CONVERSATION: {
          if (payload) {
            const { conversationID, toAccount } = payload;
            let oldConvId = state.currentConversation?.conversationID;

            if (conversationID == oldConvId) return;

            state.currentConversation = payload;
            // 系统消息关闭聊天框
            state.showMsgBox = conversationID == "@TIM#SYSTEM" ? false : true;
            state.showCheckbox = false;
            if (state.currentConversation) {
              const history = state.historyMessageList.get(conversationID);
              state.currentMessageList = history;
            } else {
              state.currentMessageList = [];
            }

            // state.needScrollDown = 0;
            // 当前会话少于历史条数关闭loading
            if (state.currentMessageList?.length < HISTORY_MESSAGE_COUNT) {
              state.noMore = true;
            } else {
              state.noMore = false;
            }
          }
          break;
        }
        // 更新当前窗口数据
        case CONVERSATIONTYPE.UPDATE_CURRENT_SESSION: {
          state.currentConversation = payload;
          break;
        }
        // 更新会话列表
        case CONVERSATIONTYPE.REPLACE_CONV_LIST: {
          state.conversationList = payload;
          break;
        }
        // 更新滚动条位置
        case CONVERSATIONTYPE.UPDATE_SCROLL_DOWN: {
          state.needScrollDown = payload;
          break;
        }
      }
    },
    // 设置网络状态
    SET_NETWORK_STATUS(state, action) {
      state.networkStatus = action;
    },
    // 设置提及弹框显示隐藏
    SET_MENTION_MODAL(state, action) {
      const { type } = state.currentConversation;
      if (type !== "GROUP") {
        state.isShowModal = false;
        return;
      }
      state.isShowModal = action;
    },
    //  切换列表 全部 未读 提及我
    TOGGLE_LIST(state, action) {
      state.activetab = action;
    },
    SET_FORWARD_DATA(state, action) {
      const { type, payload } = action;
      const { ID } = payload || {};
      switch (type) {
        case "set":
          state.forwardData.set(ID, payload);
          break;
        case "del":
          state.forwardData.delete(ID);
          break;
        case "clear":
          state.forwardData.clear();
          break;
      }
    },
    SET_IS_NOTIFY(state, flag) {
      state.isNotify = flag;
    },
    // 设置多选框状态
    SET_CHEC_BOX(state, flag) {
      state.showCheckbox = flag;
    },
    // 设置聊天框状态
    SET_SHOW_MSG_BOX(state, flag) {
      state.showMsgBox = flag;
    },
    // 切换侧边栏
    TAGGLE_OUE_SIDE(state, item) {
      state.outside = item;
    },
    // 回复消息
    setReplyMsg(state, payload) {
      state.currentReplyMsg = payload;
    },
    // 设置会话草稿
    SET_SESSION_DRAFT(state, action) {
      const { ID, payload } = action;
      const length = payload?.[0]?.children.length == 1;
      const text = payload?.[0]?.children[0].text == "";
      if (length && text) {
        state.sessionDraftMap.delete(ID);
      } else {
        state.sessionDraftMap.set(ID, payload);
      }
    },
  },
  actions: {
    // 获取消息列表
    async [GET_MESSAGE_LIST]({ commit, dispatch, state, rootState }, action) {
      let isSDKReady = rootState.user.isSDKReady;
      const { conversationID, type, toAccount } = action;
      let status = !state.currentMessageList || state.currentMessageList?.length == 0;
      // 当前会话有值
      if (state.currentConversation && isSDKReady && status) {
        const { isCompleted, messageList, nextReqMessageID } = await getMsgList({
          conversationID: conversationID,
          count: 15,
        });
        // 添加时间
        const addTimeDividerResponse = addTimeDivider(messageList).reverse();
        commit("SET_HISTORYMESSAGE", {
          type: "ADD_MESSAGE",
          payload: {
            convId: conversationID,
            message: addTimeDividerResponse,
          },
        });
        commit("updataScroll");
        if (type == "GROUP") {
          const { groupID } = action.groupProfile;
          dispatch("getGroupMemberList", { groupID });
        }
      } else {
        const { conversationID, type, toAccount } = action;
        if (type == "GROUP") {
          const { groupID } = action.groupProfile;
          dispatch("getGroupMemberList", { groupID });
        }
        console.log(state.historyMessageList, "获取缓存");
      }
      // 消息已读上报
      commit("SET_HISTORYMESSAGE", {
        type: "MARKE_MESSAGE_AS_READED",
        payload: {
          convId: conversationID,
          message: action,
        },
      });
    },
    // 新增会话列表
    async CHEC_OUT_CONVERSATION({ state, commit, dispatch }, action) {
      const { convId } = action;
      const { conversation } = await getConversationProfile({
        conversationID: convId,
      });
      // 切换会话
      commit("SET_CONVERSATION", {
        type: "UPDATE_CURRENT_SELECTED_CONVERSATION",
        payload: conversation,
      });
      // 群详情信息
      dispatch("getGroupProfile", conversation);
      // 获取会话列表
      dispatch("GET_MESSAGE_LIST", conversation);
    },
    // 删除会话列表
    async DELETE_SESSION({ state, commit, dispatch }, action) {
      const { convId } = action;
      const { code } = await deleteConversation({ convId });
      if (code !== 0) return;
      dispatch("CLEAR_CURRENT_MSG");
    },
    // 清除当前消息记录
    async CLEAR_CURRENT_MSG({ state, commit }, action) {
      state.currentConversation = null;
      state.currentMessageList = [];
      commit("SET_SHOW_MSG_BOX", false);
    },
    // 获取未读消息总数
    async GET_TOTAL_UNREAD_MSG({ state, rootState }) {
      const { isSDKReady } = rootState.user || {};
      if (!isSDKReady) return;
      state.totalUnreadMsg = await getUnreadMsg();
    },
    // 消息免打扰
    async SET_MESSAGE_REMIND_TYPE({ state, commit }, action) {
      const { type, toAccount, remindType } = action;
      if (type == "@TIM#SYSTEM") return;
      await setMessageRemindType({
        userID: toAccount,
        RemindType: remindType,
        type,
      });
    },
    // 会话消息发送
    async SESSION_MESSAGE_SENDING({ state, commit, dispatch }, action) {
      const { payload } = action;
      const { convId } = payload;
      commit("SET_HISTORYMESSAGE", {
        type: "UPDATE_MESSAGES",
        payload: {
          convId: convId,
          message: payload.message,
        },
      });
      nextTick(() => {
        commit("updataScroll");
      });
      // 发送消息
      const { code, message } = await sendMsg(payload.message);
      if (code == 0) {
        dispatch("SENDMSG_SUCCESS_CALLBACK", { convId, message });
      } else {
        console.log("发送失败", code, message);
      }
    },
    // 消息发送成功回调
    async SENDMSG_SUCCESS_CALLBACK({ state, commit, rootState }, action) {
      console.log(action, "sendMsg消息发送成功");
      const { convId, message } = action;
      commit("SET_HISTORYMESSAGE", {
        type: "UPDATE_MESSAGES",
        payload: {
          convId: convId,
          message: message,
        },
      });
      commit("updataScroll");
      imCallback({
        Text: message.payload.text,
        From: message.from,
        To: message.to,
        type: message.type,
      });
    },
  },
  getters: {
    toAccount: (state) => {
      const { currentConversation: Conve } = state;
      if (!Conve || !Conve.conversationID) return "";
      const { type, conversationID: ID } = Conve;
      switch (type) {
        case "C2C":
          return ID.replace("C2C", "");
        case "GROUP":
          return ID.replace("GROUP", "");
        default:
          return ID;
      }
    },
    tabList(state) {
      switch (state.activetab) {
        case "unread":
          return state.conversationList.filter((t) => t.unreadCount > 0);
        case "mention":
          return state.conversationList.filter((t) => t.groupAtInfoList.length > 0);
        case "groupChat":
          return state.conversationList.filter((t) => t.type == "GROUP");
        default:
          return state.conversationList;
      }
    },
    currentType(state) {
      if (!state.currentConversation || !state.currentConversation.type) {
        return "";
      }
      return state.currentConversation.type;
    },
    totalUnreadCount: (state) => {
      const result = state.conversationList.reduce((count, conversation) => {
        // 当前会话不计算总未读
        if (state.currentConversation.conversationID === conversation.conversationID) {
          return count;
        }
        return count + conversation.unreadCount;
      }, 0);
      return result;
    },
    // 用于当前会话的图片预览
    imgUrlList: (state) => {
      const filteredMessages = state.currentMessageList.filter(
        (item) => item.type === TIM.TYPES.MSG_IMAGE && !item.isRevoked && !item.isDeleted
      );
      // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight
      const reversedUrls = filteredMessages.reduceRight((urls, message) => {
        const url = message.payload.imageInfoArray[0].url;
        urls.push(url);
        return urls;
      }, []);
      return reversedUrls;
    },
  },
};

export default conversation;
