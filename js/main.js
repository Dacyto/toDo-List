// Находим элементы на странице
const FORM = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

// for buttons
const deleteFirstButton = document.querySelector('#first-element-button');
const deleteLastButton = document.querySelector('#last-element-button');
const evenNumbersButton = document.querySelector('#even-numbers-button');
const oddNumbersButton = document.querySelector('#odd-numbers-button');


let tasks = [];

if(localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
}

tasks.forEach(function(task) {
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

    // формируем разметку для новых задач
    const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
            <span class="${cssClass}"> ${task.text} </span>
            <div class="task-item__buttons">
            <button type="button" data-action="done" class="btn-action">
                <img src="./img/tick.svg" alt="Done" width="18" height="18">
            </button>
            <button type="button" data-action="delete" class="btn-action">
                <img src="./img/cross.svg" alt="Done" width="18" height="18">
            </button>
        </div>
    </li>`;

    // добавляем задачку на страницу (в список ul)
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
})

checkEmptyList();

// Добавление задачи в список
FORM.addEventListener('submit', addTask);

// Удаление задачи
tasksList.addEventListener('click', deleteTask);

// Отмечаем задачу завершенной
tasksList.addEventListener('click', doneTask);

// buttons eventListeners
deleteFirstButton.addEventListener('click', deleteFirstItem);
deleteLastButton.addEventListener('click', deleteLastItem);
evenNumbersButton.addEventListener('click', evenItemsHighlight);
oddNumbersButton.addEventListener('click', oddItemsHighlight);


// Функции
function addTask(event) {
    // отмена отправки формы
    event.preventDefault();
    
    // записываем текст задачи в переменную
    const taskText = taskInput.value;

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    }

    // добавляем задачу в массив
    tasks.push(newTask);
    saveToLocalStorage();

    const cssClass = newTask.done ? 'task-title task-title--done' : 'task-title';

    // формируем разметку для новых задач
    const taskHTML = `<li id="${newTask.id}" class="list-group-item d-flex justify-content-between task-item">
            <span class="${cssClass}"> ${newTask.text} </span>
            <div class="task-item__buttons">
            <button type="button" data-action="done" class="btn-action">
                <img src="./img/tick.svg" alt="Done" width="18" height="18">
            </button>
            <button type="button" data-action="delete" class="btn-action">
                <img src="./img/cross.svg" alt="Done" width="18" height="18">
            </button>
        </div>
    </li>`;

    // добавляем задачку на страницу (в список ul)
    tasksList.insertAdjacentHTML('beforeend', taskHTML);

    // очищаем поле ввода и возвращаем фокус на него
    taskInput.value = ""
    taskInput.focus();

    checkEmptyList();
}

function deleteTask(event) {
    if(event.target.dataset.action === 'delete') {
        console.log("DELETE!");
        const parentNode = event.target.closest('li');

        const id = Number(parentNode.id);

        const index = tasks.findIndex((task) => task.id === id);

        //console.log(index);
        tasks.splice(index, 1);

        saveToLocalStorage();

        parentNode.remove();

        checkEmptyList();
    }

}

function doneTask(event) {
    // проверяем что клик был по кнопке с галочкой
    if (event.target.dataset.action === "done") {
        const parentNode = event.target.closest('li');

        const id = Number(parentNode.id);

        const task = tasks.find((taskCheck) => taskCheck.id === id)
        //console.log(task);
        task.done = !task.done;
        saveToLocalStorage();
        

        tasksList.append(parentNode);
        const taskTitle = parentNode.querySelector('.task-title');
        taskTitle.classList.toggle('task-title--done');
        //console.log('Done!');
    }
}


// delete 1-st list item
function deleteFirstItem() {
    const listItems = document.getElementById("tasksList").getElementsByTagName("li");
    if(listItems.length === 0) return; // если только содержится "список дел пуст", то выходим из функции.

    let first = listItems[0];
    first.parentNode.removeChild(first);
    console.log("удаляем первый элемент списка");
    // если задач нет, то вернём блок "список дел пуст"
    if(tasksList.children.length === 1) {
        emptyList.classList.remove('none');
    }
}

function deleteLastItem() {
    
    const listItems = document.getElementById("tasksList").getElementsByTagName("li");
    if(listItems.length === 0) return;

    let last = listItems[listItems.length - 1];
    last.parentNode.removeChild(last);
    console.log("удаляем последний элемент списка");
    // если задач нет, то вернём блок "список дел пуст"
    if(tasksList.children.length === 1) {
        emptyList.classList.remove('none');
    }
}

function evenItemsHighlight() {
    const listItems = document.getElementById("tasksList").getElementsByTagName("li");
    if(listItems.length === 0) return; // если только содержится "список дел пуст", то выходим из функции.

    for(let i = 0; i < listItems.length; i++) {
        if(i % 2 !== 0) listItems[i].classList.toggle('highlight-color-yellow');
    }
    console.log("выделяем чётные элементы цветом (yellow)");
}

function oddItemsHighlight() {
    const listItems = document.getElementById("tasksList").getElementsByTagName("li");
    if(listItems.length === 0) return; // если только содержится "список дел пуст", то выходим из функции.

    for(let i = 0; i < listItems.length; i++) {
        if(i % 2 === 0) listItems[i].classList.toggle('highlight-color-lblue');
    }
    console.log("выделяем нечётные элементы цветом (lightblue)");
}

function checkEmptyList() {
    if(tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
                <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                <div class="empty-list__title">Список дел пуст</div>
            </li>`;

        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if(tasks.length > 0) {
        const emptyListElement = document.querySelector('#emptyList');
        emptyListElement ? emptyListElement.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
