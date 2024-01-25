import { useI18n } from "./i18n";
import { useElIcons } from "./icons";
import { MotionPlugin, motion } from "./motion";
import { useElementPlus } from "./elementPlus";

// 导入 Element Plus 样式
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";

export function setupPlugins(app) {
  app.use(useI18n);
  app.use(useElIcons);
  app.use(MotionPlugin, motion);
  app.use(useElementPlus);
}
