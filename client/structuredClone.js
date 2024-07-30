function structuredClonePolyfill(value, options = null) {
  let result = {};

  if (typeof value === 'object' && value !== null) {
    for (let key in value) {
      result[key] = structuredClonePolyfill(value[key]);
    }
  } else {
    result = value;
  }

  return result;
}
