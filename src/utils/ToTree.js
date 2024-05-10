import views from "@/utils/assembly";

/**
 * 将树形结构数据转换为符合 ElementUI 菜单组件的格式
 * @param {Object} node - 当前节点对象
 * @param {Array} Menu - 菜单数据数组
 */
export function convertToTree(node, Menu) {
  // 根目录存在子组件
  if (node.children && node.children.length > 0) {
    // parent.label = parent.meta.title
    for (let i = 0; i < node.children.length; i++) {
      let id = node.children[i];
      // 查找子级组件
      let child = Menu.find((item) => item.id === id);
      // 如果子级里面仍然存在子级 在次调用本身
      if (child && child.children?.length > 0) {
        convertToTree(child, Menu);
      }
      child.label = child.meta.title;
      node.children[i] = child;
    }
  }
}
/**
 * 对树状结构的数组进行处理，并根据 componentName 设置相应的组件。
 * @param {Array} arr - 菜单数据数组
 */
export function optimizeTree(arr) {
  arr.forEach((item) => {
    if (item.componentName) {
      item.component = views[item.componentName];
    }
    if (item.children?.length > 0) {
      optimizeTree(item.children);
    }
  });
}
