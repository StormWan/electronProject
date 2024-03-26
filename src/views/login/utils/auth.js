import { openAuthUrl } from "@/api/node-admin-api/index";
export const oauthAuthorize = async (id) => {
  let params = null;
  if (id === "github") {
    params = { client_id: process.env.VUE_APP_CLIENT_ID };
  }
  const res = await openAuthUrl(id, params);
  window.open(res, "_self");
  console.log(res);
};
