const { contextBridge, ipcRenderer } = require('electron');

let BOARD = {};
let BOARD_CONFIG = {};

window.addEventListener('DOMContentLoaded', () => {

})

ipcRenderer.on('board:load', (event, path, config, board) => {
	console.log("ipcRenderer.on:", path, config)
	BOARD_CONFIG = config
	BOARD = board
})

contextBridge.exposeInMainWorld('trellocal', {
	ping: () => ipcRenderer.invoke('ping'),
	openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
	createDefaultConfig: (path, config) => ipcRenderer.invoke('createDefaultConfig', path, config),
	retrieveConfig: (path) => ipcRenderer.invoke('retrieveConfig', path),
	openBoardPage: (path, config) => ipcRenderer.invoke('openBoardPage', path, config),
	getId: () => ipcRenderer.invoke('getId'),
	saveChanges: (board, msg) => ipcRenderer.invoke('change', board, msg),
	retrieveBoard: () => BOARD,
})