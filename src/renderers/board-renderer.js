// DRAG N DROP FUNCTIONALITY ==================================================================================

// https://stackoverflow.com/questions/28203585/prevent-drop-inside-a-child-element-when-drag-dropping-with-js

const allowDrop = (e) => {
	e.preventDefault();
}

const drag = (e) => {
	e.dataTransfer.setData("id", e.target.id);
}

const drop = (e, el) => {
	e.preventDefault();
	const data = e.dataTransfer.getData("id");
	const element = document.getElementById(data);
	console.log(data)
	console.log(element);
	const listElements = el.querySelector('.list-elements');
	listElements.appendChild(element);
}

const addListEvents = () => {
	const lists = document.querySelectorAll('.list');

	for (let i = 0; i < lists.length - 1; i++) {
		lists[i].addEventListener('drop', (e) => drop(e, lists[i]));
		lists[i].addEventListener('dragover', (e) => allowDrop(e));
	}
}

const addElementEvents = () => {
	const listElements = document.querySelectorAll('.list-element');

	for (const listElement of listElements) {
		listElement.addEventListener('dragstart', (e) => drag(e));
		listElement.addEventListener('dragover', (e) => false);
		listElement.addEventListener('drop', (e) => false);
	}
}

// =============================================================================================================

const addNewElementEvent = (listId) => {
	const list = document.querySelector(`#${listId}`);
	const newElementDiv = list.querySelector('.list-add-new');
	newElementDiv.addEventListener('click', async (e) => {
		const elementTemplate = document.querySelector('#list-element-template');
		const newElement = elementTemplate.content.cloneNode(true);
		const listElements = list.querySelector('.list-elements');
		const elementId = await window.trellocal.getId();
		newElement.querySelector('.list-element').setAttribute('id', `element-${elementId}`);
		listElements.appendChild(newElement);
		addElementEvents();
	})
}

// Create a new list
const newListDiv = document.querySelector('#new-list');

newListDiv.addEventListener('click', async () => {
	const listTemplate = document.querySelector('#list-template');
	const listContainer = document.querySelector('.lists');
	const newList = listTemplate.content.cloneNode(true);
	const listId = await window.trellocal.getId();

	newList.querySelector('.list').setAttribute('id', `list-${listId}`);
	listContainer.insertBefore(newList, newListDiv)

	addListEvents();
	addNewElementEvent(`list-${listId}`);
	addElementEvents();
});

addListEvents();
addElementEvents();