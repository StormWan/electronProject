import http from "@/utils/http/index";

export const openAuthUrl = (id, params = null) => {
  return http({
    url: `/auth/${id}`, // github qq
    method: "get",
    params,
  });
};
