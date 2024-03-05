import * as FontIcon from "./FontIcon";
import * as UserAvatar from "./UserAvatar";
import * as QrCode from "./QrCode";
import * as SideItem from "./SideItem";

const components = [FontIcon, UserAvatar, QrCode, SideItem];
const regex = /\/([^/]+)\/index\.vue$/;

/** 自动加载全局组件 */
export function loadAllassembly(app) {
  components.forEach((t) => {
    const { __file } = t.default;
    const name = __file.match(regex)[1];
    app.component(name, t.default);
  });
}
