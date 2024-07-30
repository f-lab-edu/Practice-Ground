function structuredClonePolyfill(value, options = null) {
  if (typeof value === 'function' || value.nodeType !== undefined) {
    throw new Error('DataCloneError');
  }

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
