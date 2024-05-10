export function importModules() {
  const importedModules = {};

  // 自动导入指定目录下的所有以index.js结尾的文件
  const requireModules = require.context("./modules/", true, /index\.(ts|js)$/iu);

  // 自动导入模块文件中的所有vuex模块
  requireModules.keys().forEach((filePath) => {
    const module = requireModules(filePath);
    // 从文件路径中提取模块名称，如'./modules/user/index.ts' => 'user'
    const moduleName = filePath.replace(/\.\/|\/index.(js|ts)/g, "");
    importedModules[moduleName] = {
      // namespaced: true,
      ...module.default,
    };
  });

  return importedModules;
}
