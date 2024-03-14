// hack router push callback
// const originalPush = createRouter.prototype.push;
// createRouter.prototype.push = function push(location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
//   return originalPush.call(this, location).catch((err) => err);
// };

/*
 * 自定义路由切换时页面如何滚动
 * 参考 https://router.vuejs.org/zh/guide/advanced/scroll-behavior.html
 */
export const scrollBehavior = (to, from) => {
  return new Promise((resolve) => {
    console.log(to);
    if (to.hash) {
      const el = document.querySelector(to.hash);
      if (el) {
        resolve({ el, behavior: "smooth" });
      }
    }
  });
};
