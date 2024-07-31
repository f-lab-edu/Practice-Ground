function structuredClonePolyfill(value, options = null) {
  //TODO: Certain object properties are not preserved에 해당하는 항목들 추가, 직렬화(저장/전송/호환성)되지 않는 경우
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
