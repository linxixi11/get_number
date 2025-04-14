const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  exportDB: (data) => ipcRenderer.invoke('export-db', data),
  importDB: () => ipcRenderer.invoke('import-db')
});
