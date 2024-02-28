const log = require("electron-log");
const os = require("os");
const path = require("path");
const { isDevelopment } = require("../utils/platform");
const rootDir = path.resolve(os.homedir(), "Documents", "Pure Files");

log.transports.console.level = false; // 禁用控制台输出;
log.transports.file.maxSize = 10024300; // 文件最大不超过 10M
// 输出格式
log.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}";
let date = new Date();
// 文件名为：年-月-日.log
let dateStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
// 默认位置为：C:\Users\[user]\AppData\Roaming\[appname]\electron_log\
const folder = isDevelopment ? "dev" : "pro";
// 自定义文件保存位置为安装目录下 \log\年-月-日.log
// C:\Users\{user}\Documents\Pure Files\log\{dev|pro}\{年-月-日.log}
log.transports.file.resolvePath = () => path.join(rootDir, "log", folder, dateStr + ".log");

// 有六个日志级别error, warn, info, verbose, debug, silly
export default {
  info(param) {
    log.info(param);
  },
  warn(param) {
    log.warn(param);
  },
  error(param) {
    log.error(param);
  },
  debug(param) {
    log.debug(param);
  },
  verbose(param) {
    log.verbose(param);
  },
  silly(param) {
    log.silly(param);
  },
};
