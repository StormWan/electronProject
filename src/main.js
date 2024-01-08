import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import AppLoading from "./views/components/AppLoading";

import { getServerConfig } from "./config";

import "@/styles/index.scss";
import "element-plus/theme-chalk/el-message-box.css";
import "element-plus/theme-chalk/el-message.css";
import "element-plus/theme-chalk/el-notification.css";

import "element-plus/theme-chalk/dark/css-vars.css";
import "v-contextmenu/dist/themes/default.css";

import { useI18n } from "./plugins/i18n";
import { useElIcons } from "./plugins/icons";
import { loadAllassembly } from "./components/index";
import { directive } from "v-contextmenu";
import { MotionPlugin } from "@vueuse/motion";
import { motion } from "./directives/index";
import { registerSvgIcon } from "./assets/icons/index";
// app loading
const appLoading = createApp(AppLoading);
appLoading.mount("#appLoading");
const app = createApp(App);
app.directive("contextmenu", directive);
// 自动加载组件
loadAllassembly(app);
// 自定义SvgIcon组件
registerSvgIcon(app);

getServerConfig(app).then(async (config) => {
  app.use(router);
  app.use(store);
  app.use(useI18n);
  app.use(useElIcons);
  app.use(MotionPlugin, motion);
  appLoading.unmount();
  app.mount("#app");
});
