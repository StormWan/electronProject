"use strict";
import qs from "qs";
import axios from "axios";
import storage from "storejs";
import NProgress from "@/utils/progress";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import { errorHandler } from "./tools";
const { formats, parse, stringify } = qs;

const service = axios.create({
  // baseURL: "https://node-admin.cn/",
  baseURL: process.env.VUE_APP_PROXY_DOMAIN_REAL, // 公共地址
  timeout: 50000, // 请求超时时间
  // headers: {
  //   Accept: "application/json, text/plain, */*",
  //   "Content-Type": "application/json",
  //   "X-Requested-With": "XMLHttpRequest"
  // },
  // 数组格式参数序列化
  // paramsSerializer: (params) => {
  //   console.log(params,"params")
  //   return stringify(params, { indices: false })
  // }
  // onUploadProgress: (progressEvent) => {
  //   let persent = ((progressEvent.loaded / progressEvent.total) * 100) | 0; //上传进度百分比
  //   console.log(persent);
  // },
});
const whiteList = ["/imCallback"];
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
  const { data, config, status } = response;
  const { code, msg } = data;
  // 关闭进度条动画
  NProgress.done();
  if (status === 200) {
    const ToKen = response.headers["x-token"];
    if (ToKen) {
      storage.set(ACCESS_TOKEN, ToKen);
    }
    return data;
  }
}, errorHandler);

export default service;
