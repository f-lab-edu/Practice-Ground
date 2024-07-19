/** 테스트 프레임워크 코드*/
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

/** 의존성 주입 코드*/
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

/** 상태 및 코어로직 코드*/
function createProgram({ getState, setState }) {
  function getItems({ id } = {}) {
    const items = getState();

    if (items.length === 0) return null;
    if (id) {
      return items[items.findIndex((item) => item.id === id)] || null;
    }

    return items;
  }

  function addItem({ input }) {
    if (!input) return;
    const items = getState();

    items.push({ id: items.length + 1, text: input });

    const result = setState(items);
    return result;
  }

  function deleteItem({ id }) {
    if (!id) return;
    const items = getState();

    items.splice(
      items.findIndex((item) => item.id === id),
      1
    );

    const result = setState(items);
    return result;
  }

  function updateItems({ id, text }) {
    if (!id || !text) return;
    const items = getState();

    items[items.findIndex((item) => item.id === id)].text = text;

    const result = setState(items);
    return result;
  }

  return {
    getItems,
    addItem,
    deleteItem,
    updateItems,
  };
}

/** 외부 저장소 활용 시 유연하게 대응하게 위해*/
function createStore() {
  //초기값 설정
  let state = [];

  function getState() {
    //상태를 저장소에서 가져오는 로직
    //Ex) state = JSON.parse(sessionStorage.getItem('kyu')) ?? [];
    return state;
  }

  function setState(items) {
    //상태를 저장소에 업데이트하는 함수
    //Ex) sessionStorage.setItem('kyu', JSON.stringify(items));
    state = items;

    const result = getState();
    return result;
  }

  return {
    getState,
    setState,
  };
}

const store = createStore();

const program = createProgram({
  getState: store.getState,
  setState: store.setState,
});

/**integration 코드*/
const test = createTest({ isEqual });
test.suite.create = program.addItem;
test.suite.read = program.getItems;
test.suite.update = program.updateItems;
test.suite.delete = program.deleteItem;

/**프레임워크 실행 코드*/
test.run();
