const { production } = require("@/config/vue.custom.config");
const sidebar = {
  state: {
    outsideList: [
      {
        only: "message",
        icon: "ChatDotSquare",
        title: "消息",
        class: "fixed",
        if_fixed: 1,
        type: "el-icon",
      },
      {
        only: "document",
        icon: "Document",
        title: "文档",
        type: "el-icon",
      },
      // {
      //   only: "chatgpt",
      //   icon: "Watermelon",
      //   title: "ChatGpt",
      //   type: "el-icon",
      // },
      {
        only: "test",
        icon: "SwitchFilled",
        title: "web",
        show: production ? "hide" : "",
        type: "el-icon",
      },
      {
        only: "electron",
        icon: "Eleme",
        title: "electron",
        show: production ? "hide" : "",
        type: "el-icon",
      },
      {
        only: "more",
        icon: "MoreFilled",
        title: "更多",
        mode: "other",
        type: "el-icon",
      },
    ],
    moreList: [
      {
        only: "github",
        icon: "github",
        title: "github",
      },
      {
        only: "gitee",
        icon: "Pear",
        title: "gitee",
        type: "el-icon",
      },
    ],
  },
  getters: {},
  mutations: {
    SET_OUT_SIDE_LIST(state, list) {
      const data = state.outsideList.filter((t) => t.only == "more");
      state.outsideList = [...list, ...data];
    },
    SET_MORE_LIST(state, list) {
      state.moreList = list;
    },
  },
  actions: {},
};

export default sidebar;
