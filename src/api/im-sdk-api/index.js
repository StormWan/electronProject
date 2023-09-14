import tim from "@/utils/im-sdk/tim";

// 获取 SDK 缓存的好友列表
export const getFriendList = async (params) => {
  let promise = tim.getFriendList();
  promise
    .then(function (imResponse) {
      const friendList = imResponse.data; // 好友列表
    })
    .catch(function (imError) {
      console.warn("getFriendList error:", imError); // 获取好友列表失败的相关信息
    });
};
// 获取个人资料
export const getMyProfile = async () => {
  try {
    const { code, data } = await tim.getMyProfile();
    if (code == 0) return data;
  } catch (e) {
    console.log(e);
  }
};
//登录
export const TIM_login = async (params) => {
  try {
    const { userID, userSig } = params;
    const { code, data } = await tim.login({
      userID,
      userSig,
    });
    return { code, data };
  } catch (error) {
    return { code: 404, data: null };
  }
};
//退出登录
export const TIM_logout = async () => {
  const { code, data } = await tim.logout();
  return {
    code,
    data,
  };
};
// 销毁 SDK 实例
export const TIM_Destroy = async () => {
  // SDK 会先 logout，然后断开 WebSocket 长连接，并释放资源
  await tim.destroy();
};
// 删除消息
export const deleteMsgList = async (params) => {
  const {
    code,
    data: { messageList },
  } = await tim.deleteMessage(params);
  return {
    code,
    messageList,
  };
};
// 会话顶置
export const TIMpingConv = async (params) => {
  const { conversationID, isPinned } = params;
  const result = await tim.pinConversation({
    conversationID,
    isPinned: !isPinned,
  });
  return result;
};
// 撤回消息
export const revokeMsg = async (params) => {
  const {
    code,
    data: { message },
  } = await tim.revokeMessage(params);
  return {
    code,
    message,
  };
};
// 消息免打扰
export const setMessageRemindType = async (params) => {
  const { userID, RemindType, type } = params;
  let parameter = null;
  let isDisable = RemindType == "AcceptNotNotify";
  if (type == "C2C") {
    // 单人会话
    parameter = {
      userIDList: [userID],
      messageRemindType: isDisable ? "" : "AcceptNotNotify",
    };
  } else {
    // 群聊
    parameter = {
      groupID: userID,
      // TIM.TYPES.MSG_REMIND_ACPT_AND_NOTE  AcceptAndNotify
      // （SDK 接收消息并通知接入侧，接入侧做提示）
      // TIM.TYPES.MSG_REMIND_ACPT_NOT_NOTE  AcceptNotNotify
      // （SDK 接收消息并通知接入侧，接入侧不做提示，一般用于实现“消息免打扰”）
      // TIM.TYPES.MSG_REMIND_DISCARD
      // （SDK 拒收消息）
      messageRemindType: isDisable ? "AcceptAndNotify" : "AcceptNotNotify",
    };
  }
  let { code, data } = await tim.setMessageRemindType(parameter);
  if (code == 0) {
    // const { failureUserIDList, successUserIDList } = data;
    return data;
  }
};
// 获取会话信息
export const getConversationProfile = async (params) => {
  try {
    const { conversationID } = params;
    const { code, data } = await tim.getConversationProfile(conversationID);
    if (code == 0) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};
// 消息已读上报
export const setMessageRead = async (convId) => {
  let promise = tim.setMessageRead({ conversationID: convId });
  promise
    .then(function (imResponse) {
      // 已读上报成功，指定 ID 的会话的 unreadCount 属性值被置为0
      console.log("已读上报成功", imResponse);
    })
    .catch(function (imError) {
      // 已读上报失败
      console.warn("setMessageRead error:", imError);
    });
};
// 删除会话
export const deleteConversation = async (params) => {
  const { convId } = params;
  const {
    code,
    data: { conversationID: ID },
  } = await tim.deleteConversation(convId);
  return {
    code,
    ID,
  };
};
// 设置自己的自定义状态
export const setSelfStatus = (status) => {
  const { code, data } = tim.setSelfStatus({ customStatus: status });
};
// 查询自己的用户状态
export const getUserStatus = (id) => {
  const { code, data } = tim.getUserStatus({ userIDList: [id] });
};
// 将英文翻译成中文
export const translateText = (params) => {
  const { textList } = params;
  const { code, data } = tim.translateText({
    sourceTextList: [textList],
    sourceLanguage: "auto",
    targetLanguage: "zh",
  });
  return {
    code,
    data,
  };
};
