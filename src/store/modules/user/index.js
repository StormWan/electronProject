import router from "@/router";
import { ElMessage } from "element-plus";
import { timProxy } from "@/utils/IM/index";
import { login, register, logout, getMenu } from "@/api/node-admin-api/index";
import chat from "@/utils/IM/im-sdk/tim";
import emitter from "@/utils/mitt-bus";
import { verification } from "@/utils/message/index";
import { USER_MODEL } from "@/store/constants";
import { TIM_PROXY, ACCOUNT } from "@/store/constants";
import storage from "@/utils/localforage/index";

const user = {
  state: {
    timProxy,
    message: null,
    showload: false, // 登录按钮加载状态
    currentPage: 0,
    userProfile: storage.get(TIM_PROXY)?.userProfile || {}, // IM用户信息
  },
  mutations: {
    setCurrentPage(state, num) {
      state.currentPage = num;
    },
    setCurrentProfile(state, user) {
      state.userProfile = user;
    },
    reset(state) {
      Object.assign(state, {
        showload: false,
        currentPage: 0,
        userProfile: {},
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
        offset: 30,
      });
    },
  },
  actions: {
    // 注册
    async REGISTER({ state }, data) {
      const result = await register(data);
    },
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
        // 保存登录信息 keep
        data?.keep && storage.set(ACCOUNT, data);
        router.push("/welcome");
      } else {
        verification(code, msg);
      }
    },
    // 退出登录
    async LOG_OUT({ state, commit, dispatch }) {
      logout();
      emitter.all.clear();
      dispatch("TIM_LOG_OUT");
      router.push("/login");
    },
    // 登录im
    async TIM_LOG_IN({ state, commit, dispatch }, user) {
      try {
        const { code, data } = await chat.login(user);
        if (code == 0) {
          console.log("[chat] im登录成功 login", data);
        } else {
          dispatch("LOG_OUT");
        }
      } catch (error) {
        dispatch("LOG_OUT");
        console.log("[chat] im登录失败 login", error);
      }
    },
    // 退出im
    async TIM_LOG_OUT({ commit, dispatch }) {
      const { code, data } = await chat.logout();
      if (code == 0) {
        console.log("[chat] im退出登录 logout", data);
        commit("reset");
        // 清除消息记录
        commit("SET_HISTORYMESSAGE", { type: "CLEAR_HISTORY" });
        dispatch("CLEAR_EL_TAG"); // 清除 eltag 标签
      }
    },
    // 重新登陆
    LOG_IN_AGAIN({ state, dispatch }) {
      try {
        const { user } = storage.get(USER_MODEL) || {};
        if (user) {
          const { username: userID, userSig } = user;
          console.log({ userID, userSig }, "LOG_IN_AGAIN");
          window.TIMProxy.init();
          dispatch("TIM_LOG_IN", { userID, userSig });
        } else {
          dispatch("LOG_OUT");
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 菜单列表
    async GET_MENU({ dispatch }) {
      let menu = await getMenu();
      dispatch("updateRoute", menu);
    },
  },
};

export default user;
