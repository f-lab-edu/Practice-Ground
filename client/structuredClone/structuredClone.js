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

/*TODO: 테스트 코드
깊은 복사를 만족하는 조건 4가지
참조: https://developer.mozilla.org/en-US/docs/Glossary/Deep_copy
1. 서로 다른 객체여야한다.
2. 프로퍼터들의 이름과 순서가 동일해야한다.
3. The values of their properties are deep copies of each other.(프로퍼티들의 값을 깊게 복사해야한다.)
4. 프로토타입 체인들은 구조적으로 동일해야한다.

데이터 타입 검증
참조: 상단에 기술
1. 불가능한 타입에는 에러
2. 가능한 타입은 처리하여 검증

Transfer
참조: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects
structuredClone의 transfer => 참조하는 주소를 복사될 객체에 옮기고, 해당 값을 null로 만들면 될까?
**/

const map = new Map();
map.set('name', 'k');

const ex = {
  a: map,
  b: {
    d: {
      e: 3,
      f: 3,
    },
  },
};

const copyedEx1 = structuredClonePolyfill(ex);
const copyedEx2 = structuredClone(ex);

function test(obj1, obj2) {
  if (obj1 === obj2) {
    throw Error('서로 다른 객체여야합니다!');
  }

  if (JSON.stringify(a) !== JSON.stringify(b)) {
    throw Error(
      '프로퍼티들의 이름과 순서가 같아야하고, 프로토타입 체인들이 구조적으로 동일해야합니다'
    );
  }

  console.log('테스트 성공!');
}

test(copyedEx1, copyedEx2);
