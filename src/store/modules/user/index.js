import router from "@/router";
import { getMyProfile, TIM_logout, TIM_login } from "@/api/im-sdk-api";
import { ElMessage } from "element-plus";
import TIMProxy from "@/utils/IM";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import { getCookies } from "@/utils/Cookies";
import { login, register, logout } from "@/api/node-admin-api/user";
import { getMenu } from "@/api/node-admin-api/menu";
import emitter from "@/utils/mitt-bus";
import { verification } from "@/utils/message/index";
const timProxy = new TIMProxy();

const user = {
  state: {
    currentUserProfile: {}, // IM用户信息
    isSDKReady: false, // TIM SDK 是否 ready
    userID: "", // 用户名
    userSig: "", // 密钥
    message: null,
    showload: false, // 登录按钮加载状态
    currentPage: 0,
    timProxy,
  },
  getters: {},
  mutations: {
    SET_CURRENTPAGE(state, num) {
      state.currentPage = num;
    },
    toggleIsSDKReady(state, isSDKReady) {
      state.isSDKReady = isSDKReady;
    },
    updateCurrentUserProfile(state, userProfile) {
      state.currentUserProfile = userProfile;
      window.TIMProxy.userProfile = userProfile;
    },
    getUserInfo(state, payload) {
      const { userID, userSig } = payload;
      state.userID = userID;
      state.userSig = userSig;
      window.TIMProxy.userID = userID;
      window.TIMProxy.userSig = userSig;
    },
    reset(state) {
      Object.assign(state, {
        currentUserProfile: {},
        isSDKReady: false,
        userID: "",
        userSig: "",
      });
    },
    showMessage(state, options) {
      if (state.message) {
        state.message.close();
      }
      state.message = ElMessage({
        message: options.message,
        type: options.type || "success",
        duration: options.duration || 2000,
        // offset: 40,
      });
    },
  },
  actions: {
    // 登录
    async LOG_IN({ state, commit, dispatch }, data) {
      const { code, msg, result } = await login(data);
      console.log({ code, msg, result }, "登录信息");
      if (code == 200) {
        window.TIMProxy.init();
        dispatch("GET_MENU");
        dispatch("TIM_LOG_IN", {
          userID: result.username,
          userSig: result.userSig,
        });
        commit("UPDATE_USER_INFO", { key: "user", value: result });
        commit("ACCOUNT_INFORMATION", data);
        setTimeout(() => {
          router.push("/chatstudio");
        }, 1000);
        // router.push("/chatstudio");
      } else {
        verification(code, msg);
      }
    },
    // 注册
    async REGISTER({ state }, data) {
      const result = await register(data);
    },
    // 登录im
    async TIM_LOG_IN({ commit, dispatch }, user) {
      const { code, data } = await TIM_login(user);
      console.log({ code, data }, "TIM_LOG_IN");
      if (code == 0) {
        commit("showMessage", { message: "登录成功!" });
        commit("getUserInfo", user);
        console.log(user, "getUserInfo");
      }
    },
    // 退出登录
    async LOG_OUT({ state, commit, dispatch }) {
      dispatch("TIM_LOG_OUT");
      emitter.all.clear();
      logout();
      router.push("/login");
    },
    // 退出im
    async TIM_LOG_OUT({ commit, dispatch }) {
      const result = await TIM_logout();
      console.log(result, "TIM_LOG_OUT");
      // 清除消息记录
      commit("SET_HISTORYMESSAGE", { type: "CLEAR_HISTORY" });
      commit("reset");
      // 清除 eltag 标签
      dispatch("CLEAR_EL_TAG");
    },
    // 获取个人资料
    async GET_MY_PROFILE({ commit }) {
      const result = await getMyProfile();
      commit("updateCurrentUserProfile", result);
    },
    // 重新登陆
    LOG_IN_AGAIN({ state, rootState, dispatch }) {
      const { username: userID, userSig } = rootState.data.user || {};
      console.log({ userID, userSig }, "LOG_IN_AGAIN");
      if (!userID || !userSig) dispatch("LOG_OUT");
      setTimeout(() => {
        const token = getCookies(ACCESS_TOKEN);
        if (!token) {
          dispatch("LOG_OUT");
          return;
        }
        window.TIMProxy.init();
        dispatch("TIM_LOG_IN", { userID, userSig });
      }, 500);
    },
    // 菜单列表
    async GET_MENU({ dispatch }) {
      let menu = await getMenu();
      dispatch("updateRoute", menu);
    },
  },
};

export default user;
