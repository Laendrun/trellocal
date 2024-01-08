// https://stackoverflow.com/questions/28203585/prevent-drop-inside-a-child-element-when-drag-dropping-with-js

const board = {};

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
	const listElements = el.querySelector('.list-elements');
	listElements.appendChild(element);
}

const addListEvents = (listId) => {
	const list = document.querySelector(`#${listId}`);

	list.addEventListener('dragover', (e) => allowDrop(e));
	list.addEventListener('drop', (e) => drop(e, list));

	const listTitle = list.querySelector('.list-title');
	listTitle.addEventListener('click', (e) => {
		listTitle.setAttribute('contenteditable', 'true');
		listTitle.focus();
	})
	listTitle.addEventListener('mouseout', (e) => {
		listTitle.setAttribute('contenteditable', 'false');
	})
	listTitle.addEventListener('keypress', (e) => {
		if (e.key === 'Enter') {
			listTitle.setAttribute('contenteditable', 'false');
		}
	})
}

const addElementEvents = (elementId) => {
	const newElement = document.querySelector(`#${elementId}`);
	newElement.addEventListener('dragstart', (e) => drag(e));
	newElement.addEventListener('dragover', (e) => false);
	newElement.addEventListener('drop', (e) => false);
	const elementTitle = newElement.querySelector('.list-title-text');
	elementTitle.addEventListener('click', (e) => {
		elementTitle.setAttribute('contenteditable', 'true');
		elementTitle.focus();
	})
	elementTitle.addEventListener('mouseout', (e) => {
		elementTitle.setAttribute('contenteditable', 'false');
	})
	elementTitle.addEventListener('keypress', (e) => {
		if (e.key === 'Enter') {
			elementTitle.setAttribute('contenteditable', 'false');
		}
	})
	const editIcon = newElement.querySelector('.list-element-edit-icon');
	editIcon.addEventListener('click', (e) => {
		console.log('edit icon clicked')
	})
}

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
		addElementEvents(`element-${elementId}`);
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

	addListEvents(`list-${listId}`);
	addNewElementEvent(`list-${listId}`);
});
