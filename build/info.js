const pkg = require("../package.json");
const dayjs = require("dayjs");

const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
};

module.exports = { __APP_INFO__ };
