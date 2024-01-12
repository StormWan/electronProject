const { defineConfig } = require("@vue/cli-service");
const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack"); // 组件按需引入
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer"); // 打包文件分析工具
const { __APP_INFO__ } = require("./build/info");
const path = require("path");
const {
  cdn,
  css,
  // pwa,
  title,
  externals,
  devServer,
  production,
  optimization,
  performance,
  pluginOptions,
} = require("./src/config/vue.custom.config");

const resolve = (dir) => {
  return path.join(__dirname, dir);
};
const lifecycle = process.env.npm_lifecycle_event;

module.exports = defineConfig({
  // 是否开启 eslint 校验
  lintOnSave: false,
  // 开发以及生产环境的路径配置
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  // 打包时输出的文件目录
  outputDir: "dist",
  //是否为生产环境构建生成 source map?
  productionSourceMap: !production,
  // 加快编译速度 在多核机器下会默认开启
  parallel: require("os").cpus().length > 1,
  // 配置 webpack-dev-server
  devServer,
  // css相关配置.
  css,
  // 对内部的webpack配置(比如修改、增加Loader选项)(链式操作).
  chainWebpack(config) {
    // svg-sprite-loader 配置
    config.module.rules.delete("svg");
    config.module
      .rule("svg-sprite-loader")
      .test(/\.svg$/)
      .include.add(path.join(__dirname, "./src/assets/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({ symbolId: "icon-[name]" });
    // 根路径
    config.resolve.alias.set("@", resolve("src"));
    config.plugin("html").tap((args) => {
      args[0].title = title; // 修改标题
      args[0].cdn = cdn; // CDN外链
      args[0].__APP_INFO__ = JSON.stringify(__APP_INFO__);
      return args;
    });
  },
  configureWebpack: {
    plugins: [
      AutoImport({
        // 自动导入 Vue 相关函数，如: ref, reactive, toRef 等
        imports: ["vue"],
        // 自动导入element-plus相关函数, 如: ElMessage, ElMessageBox... (带样式)
        // resolvers: [ElementPlusResolver()],
      }),
      // 按需引入element-plus组件 (带样式)
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      // 打包分析
      // new BundleAnalyzerPlugin(),
    ],
    // 打包忽略项
    // externals,
    // 配置代码分割
    optimization,
    // 性能提示
    // performance,
  },
  // 第三方插件配置
  pluginOptions,
});
