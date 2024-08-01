/* 
폴리필 구성
참조: https://developer.mozilla.org/en-US/docs/Web/API/structuredClone
**/

function structuredClonePolyfill(target, options = null) {
  /* 
  TODO: 추가로 작성해야할 에러 타입
  Certain object properties are not preserved에 해당하는 항목들 추가, 직렬화(저장/전송/호환성)되지 않는 경우 
  **/
  if (typeof target === 'function' || target.nodeType !== undefined) {
    throw new Error('DataCloneError');
  }

  /* 
  TODO: 추가로 작성해야할 데이터 타입
  DataView Date Error Boolean Number RegExp Set String TypedArray etc..
  참조: developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#supported_types
  **/

  if (target.constructor.name === 'ArrayBuffer') {
    let result = new ArrayBuffer(target.byteLength);

    return result;
  }

  if (target.constructor.name === 'Array') {
    let result = new Array();

    for (const [key, value] of Object.entries(target)) {
      result[key] = structuredClonePolyfill(value);
    }
    return result;
  }

  if (target.constructor.name === 'Map') {
    let result = new Map();

    for (const [key, value] of target) {
      result.set(key, structuredClonePolyfill(value));
    }
    return result;
  }

  if (typeof target === 'object' && target !== null) {
    let result = {};
    for (let key in target) {
      result[key] = structuredClonePolyfill(target[key]);
    }
    return result;
  }

  return target;
}
