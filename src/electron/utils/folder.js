const fs = require("fs");
const os = require("os");
const path = require("path");
const { shell } = require("electron");

const folderDir = "File";
const mainDir = "Pure Files";
const rootDir = path.resolve(os.homedir(), "Documents", mainDir);

export const initFolder = () => {
  createFolder();
};

/**
 * 创建文件夹
 * @param {string} dirPath - 要创建的文件夹路径，默认为全局变量 global.rootDir
 * @returns {boolean} - 返回是否成功创建文件夹
 * C:\Users\{user}\Documents\Pure Files
 */
export const createFolder = (dirPath = rootDir) => {
  if (!fs.existsSync(dirPath)) {
    try {
      fs.mkdirSync(dirPath, { recursive: true });
      return true; // 创建成功
    } catch (err) {
      console.error("Error creating directory:", err);
      return false; // 创建失败
    }
  } else {
    return true; // 路径已存在
  }
};

/**
 * 在指定文件夹下创建子文件夹
 * @param {string} folder - 要创建子文件夹的名称
 * @returns {boolean} - 返回是否成功创建文件夹
 * C:\Users\{user}\Documents\Pure Files\{folder}
 */
export const createFolderChild = (folder = folderDir) => {
  if (!folder) return;
  const parentDir = path.join(rootDir, folder);
  return createFolder(parentDir);
};

/**
 * 打开文件
 */
export const openFile = ({ folder = folderDir, fileName = "" }) => {
  const filePath = path.join(rootDir, folder, fileName);
  if (fs.existsSync(filePath)) {
    shell.openPath(filePath);
  } else {
    console.log("文件路径不存在 openFile:", filePath);
  }
};

/**
 * 打开文件夹
 */
export const openFolder = ({ folder = folderDir, fileName = "" }) => {
  const filePath = path.join(rootDir, folder, fileName);
  if (fs.existsSync(filePath)) {
    shell.showItemInFolder(filePath);
  } else {
    console.log("文件路径不存在 openFolder:", filePath);
  }
};

/**
 * 下载文件
 */
export const downloadFolder = () => {
  const isFolder = createFolderChild();
  if (!isFolder) {
    console.log("文件路径不存在 openFolder:", filePath);
    return;
  }
};
