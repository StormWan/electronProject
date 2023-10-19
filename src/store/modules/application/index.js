
const { ipcRenderer } = require("electron");
const application = {
  state: {},
  getters: {},
  mutations: {
    ipcRenderer(state, { key, value }) {
      ipcRenderer.send(key, value);
    }
  },
  actions: {
    setViewSize({ state }, type) {
      nextTick(() => {
        ipcRenderer.send("setmainViewSize", type);
      });
    },
  },
};

export default application;
