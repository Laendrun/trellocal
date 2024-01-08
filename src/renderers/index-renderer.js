const ping = async () => {
	const response = await window.trellocal.ping()
}
ping()

const openDirectory = async () => {
	const response = await window.trellocal.openDirectory()
	return response
}

const createDefaultConfig = async (directory) => {
	const config = {
		'board-name': 'My Board',
		'full-screen': false,
		'path': directory,
	}
	const configPath = `${directory}/.config`
	const response = await window.trellocal.createDefaultConfig(configPath, config)
	if (response)
		return response
	console.error('Failed to create default config')
	return undefined
}

const retrieveConfig = async (directory) => {
	const configPath = `${directory}/.config`
	const response = await window.trellocal.retrieveConfig(configPath)
	if (response) return response
	console.error('Failed to retrieve config')
	return undefined
}

const createBoardButton = document.getElementById('create-board')
const openExistingBoardButton = document.getElementById('open-existing-board')

createBoardButton.addEventListener('click', async () => {
	const directory = await openDirectory()
	if (!directory) return
	await createDefaultConfig(directory)
})

openExistingBoardButton.addEventListener('click', async () => {
	const directory = await openDirectory()
	if (!directory) return
	const config = await retrieveConfig(directory)
	if (!config) return
	await window.trellocal.openBoardPage(directory, config)
})