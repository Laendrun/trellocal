const {app, dialog, BrowserWindow, ipcMain} = require('electron')
const fs = require('fs')
const path = require('path')

const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: `${__dirname}/preload/preload.js`
		},
		resizable: false,
	})

	return win
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.whenReady().then(() => {
	const mainWindow = createWindow()
	mainWindow.loadFile('src/index.html')
	// mainWindow.webContents.openDevTools()
	let config;

	// try to read trellocal config file
	// if it exists, load it
	// if it doesn't, create it
	const configRootPath = path.join(app.getPath('userData'), '.trellocal.config')
	console.log(configRootPath)
	if (fs.existsSync(configRootPath)) {
		config = JSON.parse(fs.readFileSync(configRootPath, 'utf-8'))
	} else {
		config = {
			'default-board-path': '',
			'full-screen': false,
		}
		fs.writeFileSync(configRootPath, JSON.stringify(config))
	}


	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow()
		}
	})

	ipcMain.handle('ping', () => {
		return 'pong'
	})

	ipcMain.handle('dialog:openDirectory', async () => {
		const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
			properties: ['openDirectory', 'createDirectory'],
		})
		if (canceled) return
		return filePaths[0]
	})

	ipcMain.handle('createDefaultConfig', async (event, path, config) => {
		const data = JSON.stringify(config)
		try {
			fs.writeFileSync(`${path}`, data)
			return true
		} catch (err) {
			console.error(err)
			return false
		}
	})

	ipcMain.handle('retrieveConfig', async (event, path) => {
		if (!fs.existsSync(path)) {
			console.error('Folder is not an existing board.')
			return undefined
		}

		try {
			const data = fs.readFileSync(`${path}`)
			return JSON.parse(data)
		} catch (err) {
			console.error(err)
			return undefined
		}
	})

	ipcMain.handle('openBoardPage', async (event, path, config) => {
		if (!fs.existsSync(path)) {
			console.error('Folder is not an existing board.')
			return undefined
		}

		const boardWindow = new BrowserWindow({
			width: 800,
			height: 600,
			webPreferences: {
				preload: `${__dirname}/preload/preload.js`
			},
		})

		boardWindow.loadFile('src/board.html')
		boardWindow.webContents.openDevTools()
		boardWindow.webContents.on('did-finish-load', () => {
			boardWindow.webContents.send('board:load', path, config)
		})

		mainWindow.close()
	})
})