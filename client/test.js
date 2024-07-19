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

function isEqual(o1, o2) {
  if (o1 === null && o2 === null) return true;
  if (Object.keys(o1).length !== Object.keys(o2).length) return false;

  for (const key of Object.keys(o1)) {
    if (JSON.stringify(o1[key]) !== JSON.stringify(o2[key])) {
      return false;
    }
  }

  return true;
}

function createProgram() {
  let state = [];

  function getItems({ id } = {}) {
    if (state.length === 0) return null;

    if (id) {
      return state[state.findIndex((item) => item.id === id)] || null;
    }

    return state;
  }

  function addItem({ input }) {
    if (!input) return;

    state.push({ id: state.length + 1, text: input });
    return state;
  }

  function deleteItem({ id }) {
    if (!id) return;

    state.splice(
      state.findIndex((item) => item.id === id),
      1
    );
    return state;
  }

  function updateItems({ id, text }) {
    if (!id || !text) return;

    state[state.findIndex((item) => item.id === id)].text = text;
    return state;
  }

  return {
    getItems,
    addItem,
    deleteItem,
    updateItems,
  };
}

const program = createProgram();

const test = createTest({ isEqual });
test.suite.create = program.addItem;
test.suite.read = program.getItems;
test.suite.update = program.updateItems;
test.suite.delete = program.deleteItem;

test.run();
