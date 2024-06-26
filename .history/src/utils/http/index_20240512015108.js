"use strict";
import axios from "axios";
import storage from "@/utils/localforage/index";
import NProgress from "@/utils/progress";
import { ACCESS_TOKEN } from "@/constants/index";
import { errorHandler } from "./tools";

const service = axios.create({
  // baseURL: "https://apichat.fun/", // 生产
  // baseURL: "http://localhost:8081/", // 开发
  baseURL: process.env.VUE_APP_PROXY_DOMAIN_REAL, // 公共地址
  timeout: 50000, // 请求超时时间
});
const whiteList = ["/imCallback", "/rest-api"];
// 请求拦截器
service.interceptors.request.use((config) => {
  const { url } = config;
  const isBar = whiteList.includes(url);
  // 开启进度条动画
  !isBar && NProgress.start();
  const token = storage.get(ACCESS_TOKEN);
  // 携带自定义请求头token到后台
  if (token) config.headers["authorization"] = token;
  return config;
}, errorHandler);

// 响应拦截器
service.interceptors.response.use((response) => {
  const { data, config, code } = response;
  // const { code, msg } = data;
  // 关闭进度条动画
  NProgress.done();
  if (code === 20000) {
    const ToKen = data.token; // response.headers["x-token"];
    if (ToKen) {
      storage.set(ACCESS_TOKEN, ToKen);
    }
    return data;
  }
}, errorHandler);

export default service;
