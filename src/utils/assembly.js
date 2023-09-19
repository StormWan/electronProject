const views = {
  Home: () => import(/* webpackChunkName: "Home" */ "@/views/home/index"), //根组件
  Welcome: () => import(/* webpackChunkName: "Welcome" */ "@/views/welcome/index"), //首页
  ChatStudio: () => import(/* webpackChunkName: "ChatStudio" */ "@/views/ChatStudio/index"), // 聊天工作室
  Personal: () => import(/* webpackChunkName: "Personal" */ "@/views/Personal/index"), // 个人中心
  About: () => import(/* webpackChunkName: "About" */ "@/views/about/index"), //关于
  // system
  Menu: () => import(/* webpackChunkName: "Menu" */ "@/views/system/menu/index"), //菜单
  User: () => import(/* webpackChunkName: "User" */ "@/views/system/user/index"), //用户
  Role: () => import(/* webpackChunkName: "Role" */ "@/views/system/role/index"), //角色
  // assembly
  Jigsaw: () => import(/* webpackChunkName: "Jigsaw" */ "@/views/assembly/Jigsaw/index"), //拼图游戏
};

export default views;
