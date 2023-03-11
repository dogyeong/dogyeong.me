---
publishedAt: 2020-05-18
thumbnail: /images/008-thumb.png
thumbnailPlaceholder: WILL_BE_REPLACED
---

# Generator(2) - 제너레이터 활용하기

:PublishDate{:date="publishedAt"}

:PostThumbnail{:src="thumbnail" :placeholder-data-uri="thumbnailPlaceholder"}

제너레이터, iterator, iterable을 이용하면 함수형 프로그래밍의 대표적인 함수를 쉽게 구현할 수 있다.

```javascript
// 제너레이터로 구현한 map, filter, take 함수

function* map(iter, mapper) {
  for (const v of iter) {
    yield mapper(v)
  }
}

function* filter(iter, test) {
  for (const v of iter) {
    if (test(v)) {
      yield v
    }
  }
}

function* take(n, iter) {
  for (const v of iter) {
    if (n <= 0) return
    yield v
    n--
  }
}

const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const result = take(
  3,
  map(
    filter(values, (n) => n % 2 === 0),
    (n) => n * 10,
  ),
)
console.log([...result]) // [20, 40, 60]
```

- `result`에는 제너레이터 객체가 저장된다
- `[...result]`가 실행될 때 계산이 실행된다(필요할 때만 연산하기 때문에)
  이렇게 필요한 순간에만 연산하는 방식을 지연 평가(lazy evaluation)라고 부른다
- 필요한 연산만 수행된다 → 1부터 6까지만 연산하고 take 함수는 종료된다

## 제너레이터 함수끼리 호출하기

제너레이터 함수에서 다른 제너레이터 함수를 호출할 때는 `yield*` 키워드를 이용한다

`yield*` 키워드 오른쪽에는 iterable 객체가 올 수 있도록 설계되었다

```javascript
function* g1() {
  yield 2
  yield 3
}

function* g2() {
  yield 1
  yield* g1()
  yield 4
}

console.log(...g2()) // 1 2 3 4
```

```javascript
// 위의 g2 함수와 같은 역할을 수행하는 함수들

function* g2_second() {
  yield 1
  for (const value of g1()) {
    yield value
  }
  yield 4
}

function* g2_third() {
  yield 1
  yield* [2, 3]
  yield 4
}
```

## 제너레이터 함수로 데이터 전달하기

제너레이터 함수는 외부로부터 데이터를 받아서 사용할 수 있다.

next 메소드를 호출하는 쪽에서 제너레이터 함수로 데이터를 전달할 수 있다.

```javascript
function* f1() {
  const data1 = yield
  console.log(data1)
  const data2 = yield
  console.log(data2)
}

const gen = f1()
gen.next()
gen.next(10)
gen.next(20)
// 10 20
```

- 첫 번째 next 메소드는 첫 번째 `yield` 뒤의 값을 반환하는 역할을 한다

  값을 넘겨줘도 무시된다

- 두 번째 next 메소드부터는 넘겨준 값이 `yield` 의 결괏값이 된다

## 협업 멀티태스킹

`yield`를 이용해서 일반 함수와 멀티태스킹을 할 수 있다.

```javascript
function* minsu() {
  const myMsgList = [
    '안녕 나는 민수야',
    '만나서 반가워',
    '내일 영화 볼래?',
    '시간 안 되니?',
    '내일모레는 어때?',
  ]
  for (const msg of myMsgList) {
    console.log('수지:', yield msg)
  }
}

function suji() {
  const myMsgList = ['', '안녕 나는 수지야', '그래 반가워', '...']
  const gen = minsu()
  for (const msg of myMsgList) {
    console.log('민수:', gen.next(msg).value)
  }
}

suji()

/*
민수: 안녕 나는 민수야
수지: 안녕 나는 수지야
민수: 만나서 반가워
수지: 그래 반가워
민수: 내일 영화 볼래?
수지: ...
민수: 시간 안 되니?
*/
```
