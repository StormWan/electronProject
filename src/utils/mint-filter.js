class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.failureLink = null;
  }
}
// 基于Aho - Corasick算法实现的敏感词过滤库
class Mint {
  constructor(keys) {
    this.root = new TrieNode();
    this.buildFailureLinks();
    if (keys && Array.isArray(keys)) {
      keys.forEach((key) => {
        this.add(key);
      });
    }
  }
  add(key) {
    let currentNode = this.root;
    for (let i = 0; i < key.length; i++) {
      const char = key[i];
      if (!currentNode.children.has(char)) {
        currentNode.children.set(char, new TrieNode());
      }
      currentNode = currentNode.children.get(char);
    }
    if (!currentNode.isEndOfWord) {
      currentNode.isEndOfWord = true;
      return true;
    }
    return false;
  }
  buildFailureLinks() {
    const queue = [];
    for (const [key, node] of this.root.children) {
      node.failureLink = this.root;
      queue.push(node);
    }
    while (queue.length > 0) {
      const currentNode = queue.shift();
      for (const [key, childNode] of currentNode.children) {
        queue.push(childNode);
        let failureLinkNode = currentNode.failureLink;
        while (failureLinkNode !== null && !failureLinkNode.children.has(key)) {
          failureLinkNode = failureLinkNode.failureLink;
        }
        childNode.failureLink =
          failureLinkNode !== null ? failureLinkNode.children.get(key) : this.root;
      }
    }
  }
  filter(text, options = { replace: true }) {
    let currentNode = this.root;
    let filteredText = "";
    const matches = [];
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      while (currentNode !== null && !currentNode.children.has(char)) {
        currentNode = currentNode.failureLink;
      }
      if (currentNode === null) {
        currentNode = this.root;
        filteredText += char;
      } else {
        currentNode = currentNode.children.get(char);
        filteredText += options.replace ? "*" : char;
        if (currentNode.isEndOfWord) {
          matches.push(text.substring(i - currentNode.length + 1, i + 1));
        }
      }
    }
    return { words: matches, text: filteredText };
  }
  verify(text) {
    let currentNode = this.root;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      while (currentNode !== null && !currentNode.children.has(char)) {
        currentNode = currentNode.failureLink;
      }
      if (currentNode === null) {
        currentNode = this.root;
      } else {
        currentNode = currentNode.children.get(char);
        if (currentNode.isEndOfWord) {
          return false;
        }
      }
    }
    return true;
  }
}
export default Mint;
