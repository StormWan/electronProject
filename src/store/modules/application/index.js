const { ipcRenderer } = require("electron");
const application = {
  state: {},
  getters: {},
  mutations: {
    ipcRenderer(state, { key, value = null }) {
      ipcRenderer.send(key, value);
    },
  },
  actions: {
    // setViewSize({ state }, type) {
    //   nextTick(() => {
    //     ipcRenderer.send("setmainViewSize", type);
    //   });
    // },
  },
};

export default application;
