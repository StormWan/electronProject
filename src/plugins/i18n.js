import { SET_UP } from "@/store/mutation-types";
import { createI18n } from "vue-i18n";
import storage from "storejs";
// User defined lang
import enLocale from "../../locales/en";
import zhLocale from "../../locales/zh-CN";

const localesConfigs = {
  en: {
    ...enLocale,
  },
  "zh-CN": {
    ...zhLocale,
  },
};
const lang = storage.get(SET_UP)?.lang || "zh-CN";
const yuyan = lang == "zh-CN" ? "中文" : "英文";
// console.log(yuyan, "语言");
// console.log(localesConfigs, "语言包");

export const i18n = createI18n({
  legacy: false,
  locale: lang,
  fallbackLocale: "en",
  messages: localesConfigs,
});

/**
 * app.config.globalProperties.$t = i18n.global.t;
 * 可以在全局模版语法直接使用
 * $t("common.setup")
 * $t("el.messagebox.confirm")
 */
export function useI18n(app) {
  app.config.globalProperties.$t = i18n.global.t;
  app.use(i18n);
}

export const $t = (key) => i18n.global.t(key);
