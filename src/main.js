const clear = document.querySelector('.clear');
const dateElement = document.getElementById('date');
const list = document.getElementById('list');
const input = document.getElementById('input');

const CHECK = 'fa-check-circle';
const UNCHECK = 'fa-circle-thin';
const LINE_THROUGH = 'lineThrough';

let LIST;
let id;

const data = localStorage.getItem('TODO');

clear.addEventListener('click', () => {
  // localStorage.clear();
  LIST.forEach((item, id) => { item.id = id; });
  localStorage.setItem('TODO', JSON.stringify(LIST));
  window.location.reload();
});

const options = { weekday: 'long', month: 'short', day: 'numeric' };
const today = new Date();

function addToDo(toDo, done, trash) {
  const id = LIST.length;
  if (trash) { return; }

  const DONE = done ? CHECK : UNCHECK;
  const LINE = done ? LINE_THROUGH : '';

  const item = `<li class="item">
                    <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                    <p class="text ${LINE}">${toDo}</p>
                    <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                  </li>
                `;

  const position = 'beforeend';

  list.insertAdjacentHTML(position, item);
}

function loadList(array) {
  array.forEach((item) => {
    addToDo(item.name, item.id, item.done, item.trash);
  });
}

if (data) {
  LIST = JSON.parse(data);
  id = LIST.length;
  loadList(LIST);
} else {
  LIST = [];
  // id = 0;
}

dateElement.innerHTML = today.toLocaleDateString('en-US', options);

document.addEventListener('keyup', (event) => {
  if (event.keyCode === 13) {
    const toDo = input.value;

    if (toDo) {
      addToDo(toDo, id, false, false);

      LIST.push({
        name: toDo,
        id: LIST.length,
        done: false,
        trash: false,
      });

      localStorage.setItem('TODO', JSON.stringify(LIST));

      id += 1;
    }
    input.value = '';
  }
});

function completeToDo(element) {
  element.classList.toggle(CHECK);
  element.classList.toggle(UNCHECK);
  element.parentNode.querySelector('.text').classList.toggle(LINE_THROUGH);

  LIST[element.id].done = !LIST[element.id].done;
}

function removeToDo(element) {
  element.parentNode.parentNode.removeChild(element.parentNode);
  LIST.splice(element.id, 1);
  LIST.forEach((item, id) => { item.id = id; });
  localStorage.setItem('TODO', JSON.stringify(LIST));
}

list.addEventListener('click', (event) => {
  const element = event.target;
  const elementJob = element.attributes.job.value;

  if (elementJob === 'complete') {
    completeToDo(element);
  } else if (elementJob === 'delete') {
    removeToDo(element);
    localStorage.removeItem(element);
  }

  localStorage.setItem('TODO', JSON.stringify(LIST));
});
