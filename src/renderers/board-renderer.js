// https://stackoverflow.com/questions/28203585/prevent-drop-inside-a-child-element-when-drag-dropping-with-js

let board = {};
let listCount = 0;
let elementCount = 0;

const addList = async (listId) => {
	const listTitle = document.querySelector(`#${listId} .list-title`).textContent;
	board[listId] = {
		index: listCount,
		title: listTitle,
		elements: [],
	}
	listCount++;

	await saveChanges("addList");
}

const addElement = async (listId, elementId) => {
	const elementTitle = document.querySelector(`#${elementId} .list-title-text`).textContent;
	const element = {
		id: elementId,
		title: elementTitle,
		description: '',
	}
	board[listId].elements.push(element);
	elementCount++;

	await saveChanges("addElement");
}

const removeElement = async (listId, elementId) => {
	const elementIndex = board[listId].elements.findIndex(element => element.id === elementId) || 0;
	board[listId].elements.splice(elementIndex, 1);
	elementCount--;

	await saveChanges("removeElement");
}

const switchElementsList = async (currListId, newListId, elementId) => {
	const elementIndex = board[currListId].elements.findIndex(element => element.id === elementId) || 0;
	const element = board[currListId].elements.splice(elementIndex, 1)[0];
	board[newListId].elements.push(element);

	await saveChanges("switchElementsList");
}

const updateListTitle = async (listId) => {
	const listTitle = document.querySelector(`#${listId} .list-title`).textContent;
	board[listId].title = listTitle;
	await saveChanges("updateListTitle");
}

const updateElementTitle = async (elementId) => {
	const elementTitle = document.querySelector(`#${elementId} .list-title-text`).textContent;
	const listId = document.querySelector(`#${elementId}`).parentElement.parentElement.id;
	const elementIndex = board[listId].elements.findIndex(element => element.id === elementId) || 0;

	board[listId].elements[elementIndex].title = elementTitle;
	await saveChanges("updateElementTitle");
}

const saveChanges = async (msg) => {
	await window.trellocal.saveChanges(board, msg);
}

const allowDrop = (e) => {
	e.preventDefault();
}

const drag = (e) => {
	e.dataTransfer.setData("id", e.target.id);
	e.dataTransfer.setData("parent", e.target.parentElement.parentElement.id);
}

const drop = (e, el) => {
	e.preventDefault();
	const data = e.dataTransfer.getData("id");
	const parent = e.dataTransfer.getData("parent");
	const element = document.getElementById(data);

	switchElementsList(parent, el.id, data);

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
	listTitle.addEventListener('mouseleave', (e) => {
		if (listTitle.getAttribute('contenteditable') === 'false') return;
		listTitle.setAttribute('contenteditable', 'false');
		updateListTitle(listId);
	})
	listTitle.addEventListener('keypress', (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			if (listTitle.getAttribute('contenteditable') === 'false') return;
			listTitle.setAttribute('contenteditable', 'false');
			updateListTitle(listId);
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
	newElement.addEventListener('mouseleave', (e) => {
		if (elementTitle.getAttribute('contenteditable') === 'false') return;
		elementTitle.setAttribute('contenteditable', 'false');
		updateElementTitle(elementId);
	})
	elementTitle.addEventListener('keypress', (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			if (elementTitle.getAttribute('contenteditable') === 'false') return;
			elementTitle.setAttribute('contenteditable', 'false');
			updateElementTitle(elementId);
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

		addElement(listId, `element-${elementId}`);
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

	addList(`list-${listId}`);
});
