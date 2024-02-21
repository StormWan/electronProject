export const isWindows = process.platform === "win32";
export const isMac = process.platform === "darwin";

export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";

export const isTest = process.env.IS_TEST;
export const isElectron = process.env.IS_ELECTRON;
export const webpackDevServerUrl = process.env.WEBPACK_DEV_SERVER_URL;
export const electronNodeIntegration = process.env.ELECTRON_NODE_INTEGRATION;

export const isCreateTray = isWindows || isDevelopment;
