const path = require("path");
/*
 * @Description: webpack 打包配置
 */
const production = process.env.NODE_ENV === "production";
const proxy = {
  "/proxy": {
    // 目标代理服务器地址.
    target: "http://localhost:8888",
    // 是否允许跨域.
    changeOrigin: true,
    secure: true,
    pathRewrite: {
      "^/proxy": "/",
    },
  },
};
const vueDefaultConfig = {
  production, // 环境配置
  title: "Pure Admin", // 标题
  // pwa 渐进式网页应用
  pwa: {
    name: "PureAdmin",
    iconPaths: {
      favicon32: "img/icons/favicon-32x32.png",
    },
    themeColor: "#ffffff00",
    manifestOptions: {
      background_color: "#335eea",
    },
  },
  devServer: {
    client: {
      progress: true,
      overlay: false,
    },
    // 是否自动打开浏览器.
    // open: false,
    // 局域网和本地访问.
    // host: "0.0.0.0",
    // 端口.
    port: process.env.VUE_APP_PORT || 8080,
    // 代理.
    proxy: process.env.VUE_APP_PROXY === "false" ? null : proxy,
  },
  cdn: {
    css: [],
    js: [
      "https://cdn.bootcdn.net/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
      // "https://cdn.jsdelivr.net/npm/pinyin-pro@3.18.5/dist/index.js"
    ],
  },
  css: {
    // css文件名是否可省略module,默认为false.
    // requireModuleExtension: false,
    // 是否使用css分离插件 默认生产环境下是true, 开发环境下是false.
    extract: production,
    // 是否为CSS开启source map.设置为true之后可能会影响构建的性能.
    sourceMap: false,
    // 向CSS相关的loader传递选项(支持:css-loader postcss-loader sass-loader less-loader stylus-loader).
    /* loaderOptions: {
      sass: {
        // 引入全局scss全局样式
        prependData: `@import '~@/assets/sass/element.scss';`
      }
    } */
  },
  // 打包忽略项
  externals: {},
  // 用于配置如何展示性能提示，以及如何限制资源体积，从而优化网站性能。
  performance: {
    // 提示类型 error
    hints: "warning",
    // 限制入口文件（即webpack.config.js中配置的entry属性）的体积不超过100KB。
    maxEntrypointSize: 102400 * 1,
    // 限制单个资源（如js文件、css文件等）的体积不超过100KB。
    maxAssetSize: 102400 * 1,
  },
  // 用于配置代码分割
  optimization: {
    realContentHash: true,
  },
  // electron 配置
  pluginOptions: {
    electronBuilder: {
      // 主进程入口文件
      mainProcessFile: "src/electron/main.js",
      // 渲染进程也可以获取原生node包
      nodeIntegration: true,
      // 检测主进程文件在更改时将重新编译主进程并重新启动
      mainProcessWatch: ["src/electron"],
      // 预加载文件
      preload: "src/electron/preload/index.js", // 预加载文件
      // 打包配置
      builderOptions: {
        // 应用名称
        productName: "PureAdmin",
        // 安装包名称
        artifactName: "PureAdmin_${version}.${ext}",
        copyright: "PureAdmin",
        // 应用更新服务器地址
        publish: [
          {
            provider: "generic",
            url: process.env.VUE_APP_UPDATE_SERVER_URL,
          },
        ],
        win: {
          target: ["nsis"],
          icon: "images/log.png",
        },
        mac: {
          icon: "images/log-512x512.png",
        },
        electronDownload: {
          mirror: "https://npm.taobao.org/mirrors/electron/",
        },
        nsis: {
          // 一键安装，如果设为true，nsis设置就无意义请直接删除 nsis 配置
          oneClick: false,
          // true全用户安装 目录为：C:\Program Files (x86)，false安装到当前用户
          perMachine: true,
          // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          allowElevation: true,
          // 允许修改安装目录
          allowToChangeInstallationDirectory: true,
          // 创建桌面图标
          createDesktopShortcut: true,
          // 创建开始菜单图标
          createStartMenuShortcut: true,
          // 安装图标
          installerIcon: "images/icon.ico",
          // 卸载图标
          uninstallerIcon: "images/icon.ico",
          // 安装时头部图标
          installerHeaderIcon: "images/icon.ico",
        },
        asar: false, // 是否开启asar打包
        //打包后拷贝静态文件到指定位置,
        extraResources: [
          {
            from: "static",
            to: "./",
            filter: ["**/*"],
          },
        ],
      },
      // 主线程的配置文件
      chainWebpackMainProcess: (config) => {
        config.plugin("define").tap((args) => {
          args[0]["IS_ELECTRON"] = true;
          return args;
        });
      },
      // 渲染线程的配置文件
      chainWebpackRendererProcess: (config) => {
        // 渲染线程的一些其他配置
        config.plugin("define").tap((args) => {
          args[0]["IS_ELECTRON"] = true;
          return args;
        });
      },
    },
  },
};

module.exports = vueDefaultConfig;
