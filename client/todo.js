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

    todoListEl.appendChild(todoEl);
  });
}

const getButton = document.getElementById('get-button');

getButton.addEventListener('click', () => getTodoList());
