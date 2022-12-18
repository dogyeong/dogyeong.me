---
publishedAt: 2020-05-05
---

# Generator(1) - 제너레이터 이해하기

> 제너레이터는 ES6에서 등장한 개념으로 함수의 실행을 중간에 멈추고 재개할 수 있는 독특한 기능이다. 실행을 멈출 때 값을 전달할 수 있기 때문에 반복문에서 제너레이터가 전달하는 값을 하나씩 꺼내서 사용할 수 있다.

## 제너레이터 생성

- 제너레이터는 별표와 함께 정의된 함수가 반환하는 객체이다
- `yield` 키워드를 사용하면 함수의 실행을 멈출 수 있다

```javascript
function* generatorFunc() {
  yield 10
  yield 20
  return 'finished'
}

const gen = generatorFunc()
```

- `gen`은 제너레이터 객체이다
  ![](https://images.velog.io/images/shroad1802/post/ca221127-8999-419e-a388-e8f2807ba88d/1.png)

## next

- 제너레이터 객체는 next, return, throw 메소드를 가지고 있다.
- 주로 next 메소드를 사용하게 된다

```javascript
function* generatorFunc() {
  console.log('1')
  yield 10
  console.log('2')
  yield 20
  console.log('3')
  return 'finished'
}

const gen = generatorFunc()

console.log(gen.next())
console.log(gen.next())
console.log(gen.next())
```

![](https://images.velog.io/images/shroad1802/post/12d4e0f6-6728-41d7-b911-7a8d88acf124/2.png)

- 제너레이터 함수를 실행하면 제너레이터 객체만 반환되고 실제로 함수 내부 코드는 실행되지 않는다
- `next` 메소드를 호출하면 `yield` 키워드를 만날 때까지 실행되고, 만나면 데이터 객체를 반환한다
- `yield` 키워드를 만나면 `done` 속성값은 `false`가 되고, 만나지 못하면 `done` 속성값이 `true`가 된다
- `done`속성값이 `true`가 된 다음부터는 다음 코드를 실행하지 않고 `undefined`를 반환한다

## return

- `return` 메소드의 매개변수가 데이터 객체의 `value`로 전달되고 제너레이터를 종료시킨다
- `return` 메소드를 호출하면 데이터 객체의 `done` 속성값은 참이 된다
- 이후에 `next` 메소드를 호출해도 `done` 속성값은 참이 된다

```javascript
function* generatorFunc() {
  console.log('1')
  yield 10
  console.log('2')
  yield 20
  console.log('3')
  return 'finished'
}

const gen = generatorFunc()

console.log(gen.next())
console.log(gen.return('abc'))
console.log(gen.next())
```

![](https://images.velog.io/images/shroad1802/post/a52b952c-5057-483c-9ba0-c3b5178012e9/3.png)

## throw

- throw 메소드를 호출하면 예외가 발생한 것으로 처리되기 때문에 catch문으로 들어간다
- 이 때 데이터 객체의 `done` 속성값은 참이 된다

```javascript
function* generatorFunc() {
  try {
    console.log('1')
    yield 10
    console.log('2')
    yield 20
    console.log('3')
    return 'finished'
  } catch (e) {
    console.log(e)
  }
}

const gen = generatorFunc()

console.log(gen.next())
console.log(gen.throw('some error'))
```

![](https://images.velog.io/images/shroad1802/post/4986537b-adaf-4a82-af7f-dfc301af42d0/4.png)

## 제너레이터는 iterable이다

- iterable이 되기 위한 조건
  - Symbol.iterator 속성값으로 함수를 갖고 있다
  - 해당 함수를 호출하면 iterator를 반환한다
- 제너레이터는 Symbol.iterator 속성값으로 함수를 가지고 있고,
  해당 함수를 호출해서 반환받은 반복자는 자기 자신이다
  → 제너레이터는 iterator이면서 iterable이다

![](https://images.velog.io/images/shroad1802/post/d874ee9f-1a17-44db-bf6d-79c00ea996f4/5.png)

- 배열도 iterable이며, 제너레이터는 배열과 같이 `for of`문과 전개 연산자`...`에서 사용할 수 있다
- 둘 다 iterator를 얻어서 next메소드를 호출하면서 done 속성값이 참이 될 때까지 반복한다

```javascript
function* f() {
  yield 10
  yield 20
  yield 30
}

for (let i of f()) {
  console.log(i)
}
// 10
// 20
// 30

const arr = [...f()]
console.log(arr)
// [10, 20, 30]
```
