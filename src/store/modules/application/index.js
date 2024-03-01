const { ipcRenderer } = require("electron");
const application = {
  mutations: {
    ipcRenderer(state, { key, value = null, method = "send" }) {
      ipcRenderer[method](key, value);
    },
  },
};

export default application;
