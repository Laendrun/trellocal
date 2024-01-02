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
	el.appendChild(document.getElementById(data));
}

const listElementss = document.querySelectorAll('.list-elements');

for (const listElements of listElementss) {
	listElements.addEventListener('drop', (e) => drop(e, listElements));
	listElements.addEventListener('dragover', (e) => allowDrop(e));
}

const listElements = document.querySelectorAll('.list-element');

for (const listElement of listElements) {
	listElement.addEventListener('dragstart', (e) => drag(e));
	listElement.addEventListener('dragover', (e) => false);
	listElement.addEventListener('drop', (e) => false);
}