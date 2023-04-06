import { Cloud } from "laf-client-sdk";

export const cloud = new Cloud({
  baseUrl: `https://${process.env.VUE_APP_APP_ID}.laf.dev`,
  // dbProxyUrl: "/proxy/app",
  // getAccessToken: () => localStorage.getItem("access_token"),
});

export const getUser = async () => {
  const res = await cloud.invoke("getUser");
  return res;
};
