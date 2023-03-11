---
publishedAt: 2021-03-17
thumbnail: /images/015-thumb.png
thumbnailPlaceholder: WILL_BE_REPLACED
---

# JavaScript - Scope

:PublishDate{:date="publishedAt"}

:PostThumbnail{:src="thumbnail" :placeholder-data-uri="thumbnailPlaceholder"}

## 스코프란?

참조 대상이 되는 식별자(변수, 함수 등)를 찾아내기 위한 규칙

## 전역 스코프(Global Scope)

코드 전역에서 정의된 식별자는 코드 어디에서든 참조할 수 있다.
`var` 키워드로 선언한 전역 변수는 전역 객체(Global Object) `window`의 프로퍼티이다.

```javascript
// a는 이제 코드 어디에서든 참조할 수 있다
var a = 1
```

## 함수 스코프(Function Scope)

함수 코드 블록이 만든 스코프로 함수 자신과 하위 함수에서만 참조할 수 있다.
**지역 스코프(Local Scope)**라고도 한다.

하지만 다음과 같은 문제점이 있다

- 함수의 코드 블록만을 스코프로 인정한다. 따라서 전역 함수 외부에서 생성한 변수는 모두 전역 변수이다. 이는 전역 변수를 남발할 가능성을 높인다.
- for 문의 변수 선언문에서 선언한 변수를 for 문의 코드 블록 외부에서 참조할 수 있다.

```js
function f() {
  var v = 'local'
  console.log(v) // "local"
}

console.log(v) // "v" is not defined
```

## 블록 스코프(Block Scope)

ES6에서 추가된 `let`, `const` 변수를 사용하면 블록 스코프를 사용할 수 있다.

```js
var x = 0
{
  var x = 1
  console.log(x) // 1
}
console.log(x) // 1

let y = 0
{
  let y = 1
  console.log(y) // 1
}
console.log(y) // 0
```

## 스코프 체인

스코프에서 식별자를 찾아내기 위한 과정
자바스크립트는 렉시컬 스코핑을 기반으로 스코프 체인이 형성된다.
**렉시컬 스코프** : 함수가 정의된 것을 기준으로 스코프가 만들어지는 것

자세한 내용은 [Environment Record](/blog/023-environment-record) 참조 ㅎ

## 참조 및 출처

- https://poiemaweb.com/js-scope
- https://baeharam.github.io/posts/javascript/jsscope-chain/
