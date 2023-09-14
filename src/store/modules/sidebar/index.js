const { production } = require("@/config/vue.custom.config");
const sidebar = {
  state: {
    outsideList: [
      {
        only: "message",
        icon: "news",
        title: "消息",
        class: "fixed",
        if_fixed: 1,
      },
      // {
      //   only: "address_book",
      //   icon: "mail_list",
      //   title: "通讯录",
      // },
      // {
      //   only: 'apply',
      //   icon: "application",
      //   title: "应用",
      // },
      {
        only: "document",
        icon: "Document",
        title: "文档",
        type: "el-icon",
      },
      {
        only: "chatgpt",
        icon: "openai",
        title: "ChatGpt",
      },
      {
        only: "test",
        icon: "SwitchFilled",
        title: "测试",
        show: production ? "hide" : "",
        type: "el-icon",
      },
      {
        only: "more",
        icon: "icondiandiandian",
        title: "更多",
        mode: "other",
      },
    ],
    moreList: [
      {
        only: "github",
        icon: "github",
        title: "github",
      },
      // {
      //   only: 'gitee',
      //   icon: "Connection",
      //   title: "gitee",
      // }
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
