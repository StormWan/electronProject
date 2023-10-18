import store from "@/store/index";
import { $t } from "@/plugins/i18n";

// 编辑器配置
export const editorConfig = {
  // 请输入内容... $t("chat.buttonPrompt")
  placeholder: "",
  // 配置编辑器是否只读，默认为 false
  // readOnly: true,
  /* 菜单配置 */
  MENU_CONF: {},
  EXTEND_CONF: {
    mentionConfig: {
      showModal,
      hideModal,
    },
  },
  hoverbarKeys: {
    link: {
      // 重写 link 元素的 hoverbar
      menuKeys: ["editLink", "unLink", "viewLink"],
    },
    image: {
      // 清空 image 元素的 hoverbar
      // menuKeys: [],
    },
  },
};
// 显示 modal
function showModal() {
  store.commit("SET_MENTION_MODAL", true);
}
// 隐藏 modal
function hideModal() {
  store.commit("SET_MENTION_MODAL", false);
}
