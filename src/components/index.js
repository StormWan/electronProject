import * as FontIcon from "./FontIcon";
import * as UserAvatar from "./UserAvatar";
import * as QrCode from "./QrCode";
import * as SideItem from "./SideItem";

const components = [
  { name: "FontIcon", component: FontIcon.default },
  { name: "UserAvatar", component: UserAvatar.default },
  { name: "QrCode", component: QrCode.default },
  { name: "SideItem", component: SideItem.default },
];

/** 自动加载全局组件 */
export function loadAllassembly(app) {
  components.forEach(({ name, component }) => {
    app.component(name, component);
  });
}
