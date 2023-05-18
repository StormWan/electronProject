import axios from "axios";
import { errorHandler } from "./tools";
// 只有管理员身份才能调用
const service = axios.create({
  baseURL: process.env.VUE_APP_PROXY_REST_API ?? "", // 公共地址
  timeout: 6000, // 请求超时时间
});
// 请求拦截器
service.interceptors.request.use((config) => {
  return config;
}, errorHandler);
// 响应拦截器
service.interceptors.response.use((response) => {
  const { data, config, status } = response;
  const { code, msg } = data;
  if (status === 200) return data;
}, errorHandler);

export default service;
