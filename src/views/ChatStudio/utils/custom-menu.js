import { IButtonMenu, DomEditor, IDomEditor, SlateElement, Boot } from "@wangeditor/editor";
import ctrlEnterModule from "@wangeditor/plugin-ctrl-enter";
import mentionModule, { MentionElement } from "@wangeditor/plugin-mention";
import { h, VNode } from "snabbdom";
import { getFileType } from "@/utils/chat/index";
import { renderFileIcon } from "./utils";

/**
 * @description 一个函数，接收一个 Slate 编辑器对象，并返回一个修改后的版本，使其能够处理附件节点作为内联或空节点。
 * @param {Editor} editor - 要修改的 Slate 编辑器对象
 * @returns {Editor} 具有修改后的 isInline 和 isVoid 函数的新 Slate 编辑器对象
 */
function withAttachment(editor) {
  const { isInline, isVoid } = editor;
  const newEditor = editor;
  newEditor.isInline = (elem) => {
    const type = DomEditor.getNodeType(elem);
    if (type === "attachment") return true; // 针对 type: attachment ，设置为 inline
    return isInline(elem);
  };
  newEditor.isVoid = (elem) => {
    const type = DomEditor.getNodeType(elem);
    if (type === "attachment") return true; // 针对 type: attachment ，设置为 void
    return isVoid(elem);
  };
  return newEditor; // 返回 newEditor ，重要！！！
}
/**
 * @param elem 附件元素，即上文的 myResume
 * @param children 元素子节点，void 元素可忽略
 * @param editor 编辑器实例
 * @returns vnode 节点（通过 snabbdom.js 的 h 函数生成）
 */
function renderAttachment(elem, children, editor) {
  console.log(elem, children, editor);
  const { fileName = "", link = "", fileSize } = elem;
  const fileType = getFileType(fileName);
  // 附件 icon 图标 vnode
  const iconVnode = h("img", {
    props: { src: renderFileIcon(fileType) },
    style: {
      width: "40px",
      height: "40px",
      marginLeft: "12px",
    },
  });
  const nameVnode = h(
    "div",
    {
      style: {
        color: "rgba(0, 0, 0, 0.68)",
        fontSize: "14px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        width: "120px",
        textOverflow: "ellipsis",
      },
    },
    fileName
  );
  const sizeVnode = h(
    "div",
    {
      style: {
        fontWeight: "400",
        color: "#999999",
        lineHeight: "18px",
        fontSize: "12px",
      },
    },
    [h("span", fileSize)]
  );
  const divVnode = h(
    "div",
    {
      props: {},
      style: {
        marginLeft: "12px",
        display: "flex",
        flexDirection: "column",
        alignContent: "flex-start",
        justifyContent: "space-between",
        height: "40px",
      },
    },
    [nameVnode, sizeVnode]
  );
  const attachVnode = h(
    "div",
    {
      props: { contentEditable: false }, // HTML 属性，驼峰式写法
      style: {
        width: "200px",
        height: "60px",
        borderRadius: "3px",
        border: "1px solid #eeeeee",
        display: "inline-flex",
        // display: "inline-block",
        alignItems: "center",
        userSelect: "none",
      },
      class: ["my-class1", "my-class2"],
      on: {
        click() {
          console.log("clicked", link);
        },
      },
    },
    [iconVnode, divVnode]
  );
  console.log(attachVnode);
  return attachVnode;
}

/**
 * 生成“附件”元素的 HTML
 * @param elem 附件元素，即上文的 myResume
 * @param childrenHtml 子节点的 HTML 代码，void 元素可忽略
 * @returns “附件”元素的 HTML 字符串
 * editor.getHtml()
 */
function attachmentToHtml(elem, childrenHtml) {
  const { link = "", fileName = "" } = elem;
  // data-w-e-is-void
  // data-w-e-is-inline
  const html = `<span
        data-w-e-type="attachment"
        data-link="${link}"
        data-fileName="${fileName}"
    >${fileName}</span>`;
  return html;
}

/**
 * 解析 HTML 字符串，生成“附件”元素
 * @param domElem HTML 对应的 DOM Element
 * @param children 子节点
 * @param editor editor 实例
 * @returns “附件”元素，如上文的 myResume
 * editor.setHtml(html)
 */
function parseAttachmentHtml(domElem, children, editor) {
  console.log(domElem);
  // 从 DOM element 中获取“附件”的信息
  const link = domElem.getAttribute("data-link") || "";
  const fileName = domElem.getAttribute("data-fileName") || "";
  // 生成“附件”元素（按照此前约定的数据结构）
  const myResume = {
    type: "attachment",
    link,
    fileName,
    children: [{ text: "" }],
  };
  return myResume;
}

const renderElemConf = {
  type: "attachment",
  renderElem: renderAttachment,
};
const elemToHtmlConf = {
  type: "attachment",
  elemToHtml: attachmentToHtml,
};
const parseHtmlConf = {
  selector: 'span[data-w-e-type="attachment"]', // CSS 选择器，匹配特定的 HTML 标签
  parseElemHtml: parseAttachmentHtml,
};

// 注册。要在创建编辑器之前注册，且只能注册一次，不可重复注册。
Boot.registerParseElemHtml(parseHtmlConf);
Boot.registerElemToHtml(elemToHtmlConf);
Boot.registerRenderElem(renderElemConf);
Boot.registerPlugin(withAttachment);

// 注册插件
Boot.registerModule(mentionModule); // @提及
Boot.registerModule(ctrlEnterModule); // ctrl+Enter 换行
