const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {

})

contextBridge.exposeInMainWorld('trellocal', {
	ping: () => ipcRenderer.invoke('ping'),
	openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
	createDefaultConfig: (path, config) => ipcRenderer.invoke('createDefaultConfig', path, config),
	retrieveConfig: (path) => ipcRenderer.invoke('retrieveConfig', path),
	openBoardPage: (path, config) => ipcRenderer.invoke('openBoardPage', path, config),
	getId: () => ipcRenderer.invoke('getId'),
})