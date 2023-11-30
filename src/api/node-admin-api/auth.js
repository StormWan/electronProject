import http from "@/utils/http/index";

export const openAuthUrl = () => {
  return http({
    url: "/auth/qq",
    method: "get",
  });
};
