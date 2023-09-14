import { ACCESS_TOKEN, SET_UP, USER_DATA } from "@/store/mutation-types";
import http from "@/utils/http/index";
import storage from "storejs";

// 登录接口
export const login = (data) => {
  return http({
    url: "/login",
    method: "post",
    data,
  });
};

// 注册接口
export const register = (data) => {
  return http({
    url: "/register",
    method: "post",
    data,
  });
};

// 账号列表
export const getuser = async () => {
  const data = [
    { value: "linjx", link: "" },
    { value: "admin", link: "" },
    { value: "zhangal", link: "" },
  ];
  return {
    loadAll: data,
  };
};

// 退出登录
export const logout = () => {
  // storage.clear();
  storage.remove(SET_UP);
  storage.remove(USER_DATA);
  storage.remove(ACCESS_TOKEN);
};
