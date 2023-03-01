---
publishedAt: 2021-09-12
thumbnail: /images/024-thumb.png
---

# iterable protocol, iterator protocol

:PublishDate{:date="publishedAt"}

:PostThumbnail{:src="thumbnail"}

> ES2015 자바스크립트에서는 이터러블 프로토콜(iterable protocol), 이터레이터 프로토콜(iterator protocol)이라는 개념들이 추가되었다.
> 프로토콜은 규칙이라는 것으로, 해당 프로토콜을 따른다면 어떤 객체라도 이터러블, 이터레이터가 될 수 있다.

## `for...of` 문

ES2015 에서 같이 등장한 `for...of`문이 있다. 일단 예시 코드를 보자.

```js
const arr = [10, 20, 30, 40, 50]

for (const a of arr) {
  console.log(a)
}
// 10 20 30 40 50
```

기존의 `for`문에 비해 코드가 간단해진 것을 볼 수 있다. 하지만 특별한 점이 더 있다.

`for...of`문이 기존의 `for`문에 비해 `Map`이나 `Set`같은 자료구조도 쉽게 순회할 수 있다는 점이다.

```js
const m = new Map([
  ['a', 10],
  ['b', 20],
  ['c', 30],
])
const s = new Set([10, 20, 30])

/* for...of문의 Map, Set 순회 */
for (const el of m) {
  console.log(el)
}
// ['a',10] ['b',20] ['c',30]

for (const el of s) {
  console.log(el)
}
// 10 20 30

/* 일반 for문의 인덱스 접근방식으로 Map, Set 순회 */
for (let i = 0; i < m.size; i++) {
  console.log(m[i])
}
// undefined X 3

for (let i = 0; i < s.size; i++) {
  console.log(s[i])
}
// undefined X 3
```

어떻게 이런게 가능할까? 그것은 `Array`, `Map`, `Set`이 이터러블이기 때문이다.

<br />

## 이터러블(iterable)

이터러블은 이터러블 프로토콜을 따르는 객체를 의미한다.
어떤 객체든지 이터러블 프로토콜을 따른다면 `for...of`문으로 순회할 수 있다.

### 이터러블 프로토콜

`Symbol.iterator`를 키로 가지고 값은 이터레이터를 반환하는 함수여야 한다.
즉, `Symbol.iterator`라는 이터레이터를 반환하는 메소드를 가지고 있어야 한다.

| Property        | Value                                             |
| --------------- | ------------------------------------------------- |
| Symbol.iterator | 이러테이터 프로토콜을 따르는 객체를 반환하는 함수 |

> 심볼(`Symbol`)은 고유한 심볼 타입 값을 만드는 생성자이다.
> `Symbol.iterator`는 심볼 생성자의 정적 프로퍼티로, 이터레이터 심볼을 의미한다.

### 이터러블의 순회

그러면 `for...of`문이 내부적으로 이터러블을 어떻게 처리하는지 예상해보자.
물론 이렇게 단순하지는 않을 것이지만 로직은 비슷할 것이라 생각한다.

1. 이터러블 객체의 `Symbol.iterator` 메소드를 가지고 있는지 체크한다.
2. `Symbol.iterator`메소드를 호출하여 이터레이터를 얻는다.
3. 이터레이터를 가지고 순회작업을 수행한다.

코드로 나타내면 다음과 같다.

```js
// for...of문을 구현한 함수
function forOf(iterable) {
  // Symbol.iterator 메소드가 있는지 체크
  if (iterable && typeof iterable[Symbol.iterater] !== 'function') {
    throw new Error('it is not iterable')
  }

  // 이터레이터 생성
  const iterator = iterable[Symbol.iterator]()

  // 이터레이터로 순횐 작업 수행...
}
```

### 내장 이터러블

자바스크립트에서 기본적으로 내장된 이터러블 객체들은 다음과 같다.

- String
- Array
- TypedArray
- Map
- Set

<br />

## 이터레이터(iterator)

이제 이터레이터에 대해 알아볼 차례이다.
이터레이터는 이터레이터 프로토콜을 따르는 객체이다

### 이터레이터 프로토콜

이터러블은 `value`, `done` 프로퍼티를 가지는 객체를 리턴하는 `next`메소드를 가지고 있어야 한다.

| Property | Value                             |
| -------- | --------------------------------- |
| next     | { value, done }을 반환하는 메소드 |

`value`, `done`의 역할은 다음과 같다.

| Property | Value                                                                                                           |
| -------- | --------------------------------------------------------------------------------------------------------------- |
| value    | 이터레이터가 순회하면서 반환하는 값                                                                             |
| done     | 이터레이터의 순회가 끝났는지 나타내는 boolean값. 만약 제너레이터의 리턴값이 있으면 done은 해당 리턴값으로 된다. |

> 제너레이터(generator)는 이터레이터를 생성하는 함수이다.

### 이터레이터의 순회

```js
const arr = [10, 20, 30, 40]
const iterator = arr[Symbol.iterator]()

iterator.next() // { value: 10, done: false }
iterator.next() // { value: 20, done: false }
iterator.next() // { value: 30, done: false }
iterator.next() // { value: 40, done: false }
iterator.next() // { value: undefined, done: true }
iterator.next() // { value: undefined, done: true }
```

next를 호출할 때마다 value값이 순서대로 출력되고 순회가 끝나면 done이 true로 바뀐다.

`for...of`내부적으로는 `done: true`가 될 때까지 `next()`를 호출하는 방식으로 순회를 하는 것이다.

### 이터레이터이자 이터러블

다음 예시 코드를 보자.

```js
const arr = [10, 20, 30]
const iterator = arr[Symbol.iterator]()

iterator.next() // { value: 10, done: false }

for (const el of iterator) {
  console.log(el)
}
// 20 30
```

실행해보면 콘솔에 20, 30이 출력되는 것을 볼 수 있다.
이는 **배열의 이터레이터가 이터레이터이면서 이터러블인 것을 의미**한다.

반환한 이터레이터도 `Symbol.iterator`메소드를 가지고 있는 것을 볼 수 있다.
그리고 그 메소드를 호출하면 자기 자신(이터레이터)를 반환한다.

```js
iterator === iterator[Symbol.iterator]() // true
```

자바스크립트의 내장 이터러블 객체들은 이터레이터가 이터레이터이면서 이터러블이도록 설계되어있다.

### 사용자 정의 이터레이터

직접 이터러블/이터레이터 프로토콜을 따르는 객체를 정의할 수도 있다. 순회할 때 값이 2배로 출력되는 이터러블을 만들어보자.

```js
const iterable = {
  [Symbol.iterator]() {
    const values = [1, 2, 3, 4, 5]
    let i = 0

    return {
      next() {
        return i < 5 ? { value: values[i++] * 2, done: false } : { value: undefined, done: true }
      },
    }
  },
}

for (const v of iterable) {
  console.log(v)
}
// 2 4 6 8 10
```

<br />

## 그래서 어떤 점이 좋은가?

형태의 컬렉션들을 같은 문법으로 순회할 수 있고, 그로 인해 자바스크립트의 다형성을 더욱 잘 활용할 수 있게 해주고 코드를 더 간단하게 작성할 수 있게 되었다.

위에서 언급하지 않았지만 전개 연산자(`...`) 또한 내부적으로 이터러블/이터레이터 프로토콜을 사용하는 연산자이다.

여러가지 타입의 컬렉션에서 같은 연산자로 순회할 수 있기 때문에 아래 예시와 같이 간단하게 표현할 수 있는 예시들이 있다.

```js
;[...[1, 2, 3], ...new Set([4, 5, 6, 7]), ...'abcd']
// [1, 2, 3, 4, 5, 6, 7, 'a', 'b', 'c', 'd']
```

<br />

## Reference

- https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Iteration_protocols#iterator
- https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/for...of
- https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Symbol
