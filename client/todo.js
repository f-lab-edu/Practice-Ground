/*
todo 리스트를 조회하고, 해당 데이터에 맞게 화면을 업데이트합니다.
렌더링 로직은 분리하면 좋을 것 같습니다.
*/
function getTodoList() {
  const todoList = JSON.parse(sessionStorage.getItem('todoList'));
  if (todoList === null) return;

  const todoListEl = document.getElementById('todo-list');
  todoListEl.innerHTML = '';

  todoList.forEach((item, idx) => {
    const todoEl = document.createElement('li');
    todoEl.textContent = item.title;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '삭제';
    deleteButton.addEventListener('click', deleteTodo.bind(null, { idx }));

    const updateButton = document.createElement('button');
    updateButton.textContent = '수정';
    updateButton.addEventListener(
      'click',
      updateTodo.bind(null, { idx: idx, title: item.title })
    );

    todoEl.appendChild(updateButton);
    todoEl.appendChild(deleteButton);

    todoListEl.appendChild(todoEl);
  });
}

function addTodo() {
  const addContent = document.getElementById('add-input').value;
  if (!addContent) return;

  const todoList = JSON.parse(sessionStorage.getItem('todoList')) ?? [];
  todoList.push({ title: addContent });
  sessionStorage.setItem('todoList', JSON.stringify(todoList));
  getTodoList();
}

function deleteTodo({ idx }) {
  const todoList = JSON.parse(sessionStorage.getItem('todoList'));
  todoList.splice(idx, 1);
  sessionStorage.setItem('todoList', JSON.stringify(todoList));
  getTodoList();
}

function updateTodo({ idx, title }) {
  const targetEl = document.getElementById('todo-list').childNodes[idx];
  targetEl.innerHTML = '';
  const updateInputEl = document.createElement('input');
  updateInputEl.defaultValue = title;
  const completeButton = document.createElement('button');
  completeButton.textContent = '수정 완료';
  completeButton.addEventListener('click', updateComplete.bind(null, { idx }));

  targetEl.appendChild(updateInputEl);
  targetEl.appendChild(completeButton);
}

function updateComplete({ idx }) {
  const todoList = JSON.parse(sessionStorage.getItem('todoList'));

  const targetInputEl =
    document.getElementById('todo-list').children[idx].childNodes[0];
  todoList[idx].title = targetInputEl.value;

  sessionStorage.setItem('todoList', JSON.stringify(todoList));
  getTodoList();
}

const getButton = document.getElementById('get-button');
const addButton = document.getElementById('add-button');

getButton.addEventListener('click', () => getTodoList());
addButton.addEventListener('click', () => addTodo());
