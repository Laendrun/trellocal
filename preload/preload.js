const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {

})

// window.addEventListener('board:load', (event,) => {
// 	const { path, config } = event.detail
// 	console.log("eventListener:", path, config)
// })

ipcRenderer.on('board:load', (event, path, config) => {
	console.log("ipcRenderer.on:", path, config)
	window.dispatchEvent(new CustomEvent('board:load', {
		detail: {
			path,
			config,
		}
	}))
})

contextBridge.exposeInMainWorld('trellocal', {
	ping: () => ipcRenderer.invoke('ping'),
	openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
	createDefaultConfig: (path, config) => ipcRenderer.invoke('createDefaultConfig', path, config),
	retrieveConfig: (path) => ipcRenderer.invoke('retrieveConfig', path),
	openBoardPage: (path, config) => ipcRenderer.invoke('openBoardPage', path, config)
})