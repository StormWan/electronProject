const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('platform', process.platform)
contextBridge.exposeInMainWorld('IS_ELECTRON1', true)