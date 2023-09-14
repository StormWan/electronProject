import * as menu from "./menu";
import * as other from "./other";
import * as roles from "./roles";
import * as user from "./user";
import * as rest from "./rest";

const api = {};
const collect = Object.assign({}, menu, other, roles, user, rest);
/**
 * description
 * 将多个模块对象合并为一个API接口对象，使得外部调用时可以更方便地访问和管理这些模块。
 * api.[方法名]
 */
Object.keys(collect).forEach((key) => {
  api[`${key}`] = collect[key];
});

export { api };
