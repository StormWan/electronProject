import router from "@/router";
import storage from "storejs";
import { tree } from "@/utils/ToTree";
import { USER_DATA, SET_UP } from "@/store/mutation-types";
import emitter from "@/utils/mitt-bus";

const mutations = {
  // 更新用户设置
  updateSettings(state, { key, value }) {
    state.settings[key] = value;
  },
  // 更新用户信息
  updateData(state, { key, value }) {
    state.data[key] = value;
  },
  updataScroll() {
    emitter.emit("updataScroll", true);
  },
};

export default mutations;
