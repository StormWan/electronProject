import { ACCESS_TOKEN, USER_SETUP, USER_MODEL } from "@/constants/index";
import { StoreKey } from "@/api/openai/constant";
import http from "@/utils/http/index";
import storage from "@/utils/localforage/index";

// 账号列表
export const getuser = async () => {
  return {
    loadAll: [
      { value: "admin", link: "" },
      { value: "zhangal", link: "" },
      { value: "jinwx", link: "" },
    ],
  };
};

//  客服登录
export async function login(data) {
  return http({
    url: "/account/login",
    method: "post",
    data,
  });
}

//  发送找回密码邮件
export async function sendEmail(data) {
  return http({
    url: "/verification/sendRestPasswordEmail",
    method: "post",
    data,
  });
}

//  重置密码
export async function resetPassword(data) {
  return http({
    url: "/account/resetPassword",
    method: "post",
    data,
  });
}

export async function socialLogin(data) {
  return http({
    url: "/socialLogin",
    method: "post",
    data,
  });
}

export function getUserInfo() {
  return http({
    url: "/userInfo",
    method: "get",
  });
}

export function logout() {
  storage.remove(USER_SETUP);
  storage.remove(USER_MODEL);
  storage.remove(ACCESS_TOKEN);
  storage.remove(StoreKey.Access);
  return http({
    url: "/account/logout",
    method: "get",
  });
}

export function register(data) {
  return http({
    url: "/account/register",
    method: "post",
    data,
  });
}

export function getCode(data) {
  return http({
    url: `/captcha/image?deviceId=${data.deviceId}`,
    method: "get",
  });
}

export function sendPhoneCode(data) {
  return http({
    url: `/verification/sendCode`,
    method: "post",
    data,
  });
}
