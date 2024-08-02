class CreateProgram {
  #state = [];

  getItems = ({ id } = {}) => {
    if (this.#state.length === 0) return null;

    if (id) {
      return (
        this.#state[this.#state.findIndex((item) => item.id === id)] || null
      );
    }

    return this.#state;
  };

  addItem = ({ input }) => {
    if (!input) return;

    this.#state.push({ id: this.#state.length + 1, text: input });
    return this.#state;
  };

  deleteItem = ({ id }) => {
    if (!id) return;

    this.#state.splice(
      this.#state.findIndex((item) => item.id === id),
      1
    );
    return this.#state;
  };

  updateItems = ({ id, text }) => {
    if (!id || !text) return;

    this.#state[this.#state.findIndex((item) => item.id === id)].text = text;
    return this.#state;
  };
}
