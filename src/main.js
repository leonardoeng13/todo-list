import './style.css';
import './font-awesome.css';

const clear = document.querySelector('.clear');
const dateElement = document.getElementById('date');
const list = document.getElementById('list');
const input = document.getElementById('input');

const CHECK = 'fa-check-circle';
const UNCHECK = 'fa-circle-thin';
const LINE_THROUGH = 'lineThrough';

let LIST;

const data = localStorage.getItem('TODO');

if (data) {
  LIST = JSON.parse(data);
} else {
  LIST = [];
  // id = 0;
}

const options = { weekday: 'long', month: 'short', day: 'numeric' };
const today = new Date();

function addToDo(toDo, done, trash, index) {
  let id;

  if (index >= 0) {
    id = index;
  } else {
    id = LIST.length;
  }

  if (trash) { return; }
  const DONE = done ? CHECK : UNCHECK;
  const LINE = done ? LINE_THROUGH : '';

  const item = `<li class="item">
                    <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                    <input id="${id}" class="text ${LINE}" placeholder="${toDo}" value="${toDo}"/>
                    <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                  </li>
                `;

  list.innerHTML += item;
}

function updateToDo(index, text) {
  LIST[index].name = text;
  localStorage.setItem('TODO', JSON.stringify(LIST));
}

function loadList(array) {
  list.innerHTML = '';
  array.forEach((item, index) => {
    addToDo(item.name, item.done, item.trash, index);
  });
}

loadList(LIST);

dateElement.innerHTML = today.toLocaleDateString('en-US', options);

document.addEventListener('keyup', (event) => {
  if (event.keyCode === 13) {
    const toDo = input.value;

    if (toDo) {
      addToDo(toDo, false, false);

      LIST.push({
        name: toDo,
        id: LIST.length,
        done: false,
        trash: false,
      });

      localStorage.setItem('TODO', JSON.stringify(LIST));
    }
    input.value = '';
  }
});

function completeToDo(element) {
  element.classList.toggle(CHECK);
  element.classList.toggle(UNCHECK);
  element.parentNode.querySelector('.text').classList.toggle(LINE_THROUGH);
  LIST[element.id].done = !LIST[element.id].done;
  // localStorage.setItem('TODO', JSON.stringify(LIST));
}

function removeToDo(element) {
  element.parentNode.parentNode.removeChild(element.parentNode);
  LIST.splice(element.id, 1);
  LIST.forEach((item, id) => { item.id = id; });
  localStorage.setItem('TODO', JSON.stringify(LIST));
  loadList(LIST);
}

list.addEventListener('click', (event) => {
  const element = event.target;
  // const elementJob = element.attributes.job.value;
  const elementJob = (element.attributes.job) ? element.attributes.job.value : '';

  if (elementJob === 'complete') {
    completeToDo(element);
  } else if (elementJob === 'delete') {
    removeToDo(element);
  }

  localStorage.setItem('TODO', JSON.stringify(LIST));
});

window.addEventListener('click', (event) => {
  const element = event.target;

  if (element.className.includes('text')) {
    event.target.addEventListener('keyup', () => {
      updateToDo(element.id, element.value);
    });

    event.target.addEventListener('blur', () => {
      updateToDo(element.id, element.value);
    });
  }

  localStorage.setItem('TODO', JSON.stringify(LIST));
});

clear.addEventListener('click', () => {
  // localStorage.clear();
  LIST = LIST.filter((item) => !item.done);
  LIST.forEach((item, id) => { item.id = id; });
  localStorage.setItem('TODO', JSON.stringify(LIST));
  window.location.reload();
});