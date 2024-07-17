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

export const program = createProgram();
