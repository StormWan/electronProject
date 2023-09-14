"use strict";
import TIM from "@tencentcloud/chat";
import tim from "@/utils/im-sdk/tim";
import storage from "storejs";
import store from "@/store";
import emitter from "@/utils/mitt-bus";
import { scrollToDomPostion } from "@/utils/message-input-utils";
import { kickedOutReason, fnCheckoutNetState } from "./utils/index";
import { ElNotification } from "element-plus";
import { deepClone } from "@/utils/clone";
import { h, nextTick } from "vue";

export default class TIMProxy {
  constructor() {
    this.version = TIM.VERSION; // im版本号
    this.userProfile = {}; // IM用户信息
    this.isSDKReady = false; // TIM SDK 是否 ready
    this.userID = "";
    this.userSig = "";
    this.tim = null; // TIM实例
    this.TIM = null; // TIM命名空间
    this.once = false; // 防止重复初始化
    this.test = {};
    Object.defineProperty(this, "test", {
      configurable: true, // 可配置
      enumerable: false, // 不可枚举
      value: 1, // 赋值
      writable: true, // 可写
    });
    // 暴露给全局
    window.TIMProxy = new Proxy(this, {
      set(target, key, val) {
        return Reflect.set(target, key, val);
      },
      get(target, key) {
        const value = Reflect.get(target, key);
        return value;
      },
    });
  }
  // 缓存IM信息
  saveSelfToLocalStorage() {
    const player = {};
    for (const [key, value] of Object.entries(this)) {
      player[key] = value;
    }
    console.log(player);
    // storage.set("player", player);
  }
  // 更新IM信息
  loadSelfFromLocalStorage() {
    const player = storage.get("player");
    if (!player) return;
    for (const [key, value] of Object.entries(player)) {
      this[key] = value;
    }
  }
  // 初始化
  init() {
    if (this.once) return;
    console.log("TIMProxy init");
    this.once = true;
    this.tim = tim;
    this.TIM = TIM;
    // 监听SDK
    this.initListener();
  }
  initListener() {
    // 登录成功后会触发 SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
    tim.on(TIM.EVENT.SDK_READY, this.onReadyStateUpdate);
    // 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
    tim.on(TIM.EVENT.SDK_NOT_READY, this.onReadyStateUpdate);
    // 收到会话列表更新通知
    tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, this.onUpdateConversationList);
    // 收到推送的单聊、群聊、群提示、群系统通知的新消息
    tim.on(TIM.EVENT.MESSAGE_RECEIVED, this.onReceiveMessage, this);
    // 收到消息被撤回的通知
    tim.on(TIM.EVENT.MESSAGE_REVOKED, this.onMessageRevoked);
    // 群组列表更新
    tim.on(TIM.EVENT.GROUP_LIST_UPDATED, this.onUpdateGroupList);
    // 被踢出
    tim.on(TIM.EVENT.KICKED_OUT, this.onKickOut);
    // SDK内部出错
    tim.on(TIM.EVENT.ERROR, this.onError);
    // 网络监测
    tim.on(TIM.EVENT.NET_STATE_CHANGE, this.onNetStateChange);
    // 收到好友申请列表更新通知
    tim.on(TIM.EVENT.FRIEND_APPLICATION_LIST_UPDATED, this.onFriendApplicationListUpdated);
    // 收到好友分组列表更新通知
    tim.on(TIM.EVENT.FRIEND_GROUP_LIST_UPDATED, this.onFriendGroupListUpdated);
    // 已订阅用户或好友的状态变更（在线状态或自定义状态）时触发。
    tim.on(TIM.EVENT.USER_STATUS_UPDATED, this.onUserStatusUpdated);
    // 收到消息被修改的通知
    tim.on(TIM.EVENT.MESSAGE_MODIFIED, this.onMessageModified);
  }
  onReadyStateUpdate({ name }) {
    const isSDKReady = name === TIM.EVENT.SDK_READY;
    store.commit("toggleIsSDKReady", isSDKReady);
    if (!isSDKReady) return;
    store.dispatch("GET_MY_PROFILE");
  }
  onUpdateConversationList({ data }) {
    console.log(data, "会话列表更新");
    const convId = store.state.conversation?.currentConversation?.conversationID;
    const conv = data.filter((t) => t.conversationID == convId);
    // 更新会话列表
    store.commit("SET_CONVERSATION", {
      type: "REPLACE_CONV_LIST",
      payload: data,
    });
    // 更新窗口数据
    if (conv) {
      store.commit("SET_CONVERSATION", {
        type: "UPDATE_CURRENT_SESSION",
        payload: deepClone(conv[0]),
      });
    }
    // 未读消息
    store.dispatch("GET_TOTAL_UNREAD_MSG");
  }
  // 判断浏览器窗口是否在前台可见状态
  isWindowFocused() {
    return window.document.hasFocus();
  }
  // 收到新消息
  onReceiveMessage({ data, name }) {
    console.log(data, "收到新消息");
    this.handleQuitGroupTip(data);
    this.handleNotificationTip(data);
    const convId = store.state.conversation?.currentConversation?.conversationID;
    if (!convId) return;
    // 收到新消息 且 不为当前选中会话 更新对应ID消息
    if (data?.[0].conversationID !== convId) {
      store.commit("SET_HISTORYMESSAGE", {
        type: "UPDATE_CACHE",
        payload: {
          convId: data?.[0].conversationID,
          message: data,
        },
      });
      return;
    }
    this.ReportedMessageRead(data);
    // 更新当前会话消息
    store.commit("SET_HISTORYMESSAGE", {
      type: "UPDATE_MESSAGES",
      payload: {
        convId: convId,
        message: data[0],
      },
    });
    // 更新滚动条位置到底部
    store.commit("updataScroll", "bottom");
  }
  onMessageRevoked({ data, name }) {
    console.log(data, "撤回消息");
    store.commit("SET_HISTORYMESSAGE", {
      type: "RECALL_MESSAGE",
      payload: {
        convId: data[0].conversationID,
        message: data,
      },
    });
  }
  onUpdateGroupList({ data, name }) {
    console.log(data, "群组列表更新");
    // store.commit("updateGroupList", data[0]);
  }
  onKickOut({ data }) {
    const message = kickedOutReason(data.type);
    store.commit("showMessage", {
      message: `${message}被踢出，请重新登录。`,
      type: "error",
    });
    store.dispatch("LOG_OUT");
  }
  onError({ data }) {
    console.log(data);
    if (data.message !== "Network Error") {
      store.commit("showMessage", {
        message: data.message,
        type: "error",
      });
    }
  }
  onMessageModified({ data }) {}
  onNetStateChange({ data }) {
    store.commit("showMessage", fnCheckoutNetState(data.state));
  }
  onFriendApplicationListUpdated(event) {
    console.log(event);
  }
  onFriendGroupListUpdated(event) {
    console.log(event);
  }
  onUserStatusUpdated(event) {
    console.log(event);
  }
  /**
   * 使用 window.Notification 进行全局的系统通知
   * 本地调试仅支持 http://localhost:8080/
   * https://developer.mozilla.org/zh-CN/docs/Web/API/notification
   * @param {Message} message
   */
  notifyMe(message) {
    // 需检测浏览器支持和用户授权
    if (!("Notification" in window)) {
      return;
    } else if (window.Notification.permission === "granted") {
      this.handleNotify(message);
    } else if (window.Notification.permission !== "denied") {
      window.Notification.requestPermission().then((permission) => {
        // 如果用户同意，就可以向他们发送通知
        if (permission === "granted") {
          this.handleNotify(message);
        }
      });
    }
    // 用户选择是未知的，因此浏览器的行为类似于值是 denied
    if (window.Notification.permission == "default") {
      this.handleElNotification(message);
    }
    // 用户拒绝显示通知
    if (window.Notification.permission == "denied") {
      this.handleElNotification(message);
    }
  }
  handleNotify(message) {
    console.log(message);
    const { ID, payload, avatar } = message;
    const tip = "有人提到了你";
    const icon = avatar || "https://web.sdk.qcloud.com/im/assets/images/logo.png";
    const notification = new window.Notification(tip, {
      icon: icon,
      body: payload.text,
    });
    notification.onclick = () => {
      // 切换会话列表
      store.dispatch("CHEC_OUT_CONVERSATION", { convId: message.conversationID });
      // 定位到指定会话
      scrollToDomPostion(ID);
      window.focus();
      notification.close();
    };
  }
  /**
   * 收到有群成员/退群/被踢出/入群/的groupTip时,更新群成员列表
   * @param {Message[]} messageList
   */
  handleQuitGroupTip(messageList) {
    console.log(messageList, "handleQuitGroupTip");
    const convId = store.state.conversation?.currentConversation?.conversationID;
    // MSG_GRP_TIP '"TIMGroupTipElem"' 群提示消息
    // 筛选出当前会话的/退群/被踢群/入群/的 groupTip
    const list = [
      TIM.TYPES.GRP_TIP_MBR_JOIN, // 1 有成员加群
      TIM.TYPES.GRP_TIP_MBR_QUIT, // 2 有群成员退群
      TIM.TYPES.GRP_TIP_MBR_KICKED_OUT, // 3 有群成员被踢出群
    ];
    const groupTips = messageList.filter((message) => {
      return (
        convId === message.conversationID &&
        message.type === TIM.TYPES.MSG_GRP_TIP &&
        list.includes(message.payload.operationType)
      );
    });
    // 更新当前会话的群成员列表
    if (groupTips.length > 0) {
      groupTips.forEach((groupTip) => {
        if (Array.isArray(groupTip.payload.userIDList) || groupTip.payload.userIDList.length > 0) {
          // store.dispatch("getGroupMemberList");
        }
      });
    }
  }
  // 上报消息已读
  ReportedMessageRead(data) {
    const isFocused = this.isWindowFocused();
    if (!isFocused) return;
    store.commit("SET_HISTORYMESSAGE", {
      type: "MARKE_MESSAGE_AS_READED",
      payload: {
        convId: data?.[0].conversationID,
        message: data,
      },
    });
  }
  handleElNotification(message) {
    const { ID, nick, payload, conversationID } = message;
    const Notification = ElNotification({
      title: `${nick}提到了你`,
      message: payload.text,
      duration: 6000,
      // type: "info",
      onClick: () => {
        store.dispatch("CHEC_OUT_CONVERSATION", { convId: conversationID });
        scrollToDomPostion(ID);
        Notification.close();
      },
    });
  }
  // 群详情 @好友 系统通知tis
  handleNotificationTip(data) {
    const userProfile = store.state.user.currentUserProfile;
    const { atUserList } = data[0];
    if (atUserList.length > 0) {
      let userId = userProfile?.userID;
      let off = atUserList.includes(userId);
      let all = atUserList.includes(TIM.TYPES.MSG_AT_ALL);
      if (off || all) {
        this.notifyMe(data[0]);
      }
    }
  }
}
