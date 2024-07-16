function createTest({ isEqual }) {
  if (typeof isEqual !== 'function') {
    throw new TypeError('적합한 isEqual() 함수를 주입해주세요.');
  }

  const model = [
    ['create', { input: 'Todo 1' }, [{ id: 1, text: 'Todo 1' }]],
    [
      'create',
      { input: 'Todo 2' },
      [
        { id: 1, text: 'Todo 1' },
        { id: 2, text: 'Todo 2' },
      ],
    ],
    [
      'read',
      undefined,
      [
        { id: 1, text: 'Todo 1' },
        { id: 2, text: 'Todo 2' },
      ],
    ],
    [
      'update',
      { id: 1, text: 'Todo 1 Edited' },
      [
        { id: 1, text: 'Todo 1 Edited' },
        { id: 2, text: 'Todo 2' },
      ],
    ],
    ['delete', { id: 2 }, [{ id: 1, text: 'Todo 1 Edited' }]],
    ['read', undefined, [{ id: 1, text: 'Todo 1 Edited' }]],
    ['read', { id: 2 }, null],
  ];

  const suite = {
    create: (payload) => {
      throw new Error('create() 액션이 바인딩되지 않았어요');
    },
    read: (payload) => {
      throw new Error('read() 액션이 바인딩되지 않았어요');
    },
    update: (payload) => {
      throw new Error('update() 액션이 바인딩되지 않았어요');
    },
    delete: (payload) => {
      throw new Error('delete() 액션이 바인딩되지 않았어요');
    },
  };

  function run() {
    for (const [action, input, expected] of model) {
      const actual = suite[action](input);
      const passed = isEqual(actual, expected);
      console.assert(passed, 'actual: %o, expected: %o', actual, expected);
      if (!passed) {
        throw new Error('테스트 실패');
      }
    }
    console.log('테스트 성공!');
  }

  return {
    suite,
    run,
  };
}

function isEqual(arr1, arr2) {
  if (arr1 === null && arr2 === null) return true;
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].id !== arr2[i].id || arr1[i].text !== arr2[i].text) {
      return false;
    }
  }

  return true;
}

function getTodoList({ id } = {}) {
  const todoList = JSON.parse(sessionStorage.getItem('todoList'));
  if (todoList === null) return;

  if (id) {
    return todoList[todoList.findIndex((item) => item.id === id)] || null;
  }

  return todoList;
}

function addTodo({ input }) {
  if (!input) return;

  const todoList = JSON.parse(sessionStorage.getItem('todoList')) || [];

  todoList.push({ id: todoList.length + 1, text: input });
  sessionStorage.setItem('todoList', JSON.stringify(todoList));

  return getTodoList();
}

function deleteTodo({ id }) {
  const todoList = JSON.parse(sessionStorage.getItem('todoList'));

  todoList.splice(
    todoList.findIndex((item) => item.id === id),
    1
  );
  sessionStorage.setItem('todoList', JSON.stringify(todoList));

  return getTodoList();
}

function updateTodo({ id, text }) {
  const todoList = JSON.parse(sessionStorage.getItem('todoList'));

  todoList[todoList.findIndex((item) => item.id === id)].text = text;
  sessionStorage.setItem('todoList', JSON.stringify(todoList));

  return getTodoList();
}

const test = new createTest({ isEqual });
test.suite.create = addTodo;
test.suite.read = getTodoList;
test.suite.update = updateTodo;
test.suite.delete = deleteTodo;

test.run();
