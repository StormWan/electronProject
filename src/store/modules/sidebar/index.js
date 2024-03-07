const { production } = require("@/config/vue.custom.config");

const outsideList = [
  {
    only: "message",
    icon: "ChatDotSquare",
    locale: "message",
    title: "消息",
    class: "fixed",
    if_fixed: 1,
    type: "el-icon",
  },
  {
    only: "document",
    icon: "Document",
    locale: "document",
    title: "文档",
    type: "el-icon",
  },
  {
    only: "test",
    icon: "SwitchFilled",
    title: "web",
    show: production ? "hide" : "",
    type: "el-icon",
  },
  {
    only: "more",
    icon: "MoreFilled",
    locale: "more",
    title: "更多",
    mode: "other",
    type: "el-icon",
  },
];
const moreList = [
  {
    only: "github",
    icon: "github",
    title: "github",
  },
  {
    only: "gitee",
    icon: "IceTea",
    title: "gitee",
    type: "el-icon",
  },
];

export default {
  state: {
    outsideList,
    moreList,
  },
  mutations: {
    SET_OUT_SIDE_LIST(state, list) {
      const data = state.outsideList.filter((t) => t.only === "more");
      state.outsideList = [...list, ...data];
    },
    SET_MORE_LIST(state, list) {
      state.moreList = list;
    },
  },
};
