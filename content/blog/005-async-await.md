---
publishedAt: 2020-04-18
---

# async await

:PublishDate{date="2020-04-18"}

> async await는 비동기 프로그래밍을 동기 프로그래밍처럼 작성할 수 있도록 함수에 추가된 기능이다. ES2017에서 자바스크립트 표준이 되었으며, async await를 이용해서 코드를 작성하면 가독성이 좋아진다.

**async await는 비동기 상태를 값으로 다룰 수 없기 때문에 프로미스를 완전히 대체하는 것은 아니다!**

---

## async await의 이해 🤔

### asyn await 함수는 프로미스를 반환한다

```javascript
async function getData() {
  return 123
}
```

![](https://images.velog.io/images/shroad1802/post/ce688e4a-73d8-4504-98dd-7d57450556b8/1.png)![](https://images.velog.io/images/shroad1802/post/7bdce07c-a31e-43bf-8c7c-5e6350c9932c/2.png)

### 프로미스를 반환한다면, 그 프로미스를 그대로 반환한다

```javascript
async function getData() {
  return Promise.resolve(123)
}
```

![](https://images.velog.io/images/shroad1802/post/ef0a453c-7862-4f76-808d-d329ec15d494/3.png)

### async await 함수 내부에서 예외가 발생하면, rejected 상태의 프로미스를 반환한다

```javascript
async function getData() {
  throw new Error(123)
}
```

![](https://images.velog.io/images/shroad1802/post/15f38d84-572d-43c8-8dd5-5e6c372c0e09/4.png)

### await 키워드를 사용하는 방법

- await 키워드는 async await 함수 내부에서 사용된다. await 키워드 오른쪽에 프로미스를 입력하면,
  그 프로미스가 처리될 때까지 기다린다.
- await 키워드는 오직 async await 함수 내에서만 사용될 수 있다. 일반 함수에서 사용하면 에러가 발생한다

```javascript
function requestData(value) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(value)
    }, 1000),
  )
}

async function getData() {
  const data1 = await requestData(10)
  console.log(data1)

  const data2 = await requestData(20)
  console.log(data2)
}

getData()

// 10 (1초 뒤)
// 20 (2초 뒤)
```

### 프로미스 VS async await

의존성이 높은 코드에서 가독성 비교

```javascript
// promise
function getDataPromise() {
  return asyncFunc1()
    .then(data1 => Promise.all([data1, asyncFunc2(data1)])
          .then(([data1, data2]) => {
    return asyncFunc3(data1, data2);
  });
          }

// async await
async function getDataAsync() {
  const data1 = await asyncFunc1();
  const data2 = await asyncFunc2(data1);
  return asyncFunc3(data1, data2);
}
```

---

## async await 활용하기 🚀

### 비동기 함수를 병렬로 실행하기

```javascript
// 순차적으로 실행되는 비동기 코드
async function getData() {
  const data1 = await asyncFunc1()
  const data2 = await asyncFunc2()
}

// await 키워드를 나중에 사용하면 병렬 실행할 수 있다
async function getData() {
  const p1 = asyncFunc1()
  const p2 = asyncFunc2()
  const data1 = await p1
  const data2 = await p2
}

// Promise.all을 이용해서 병렬로 실행하기
async function getData() {
  const [data1, data2] = await Promise.all([asyncFunc1(), asyncFunc2()])
}
```

### Thenable

- ES6 이전부터 여러 프로미스 라이브러리가 존재
- then 메소드를 가진 객체를 **Thenable**이라고 부름
- async await는 ES6의 프로미스가 아니라도 Thenable과 함께 사용할 수 있다
- async await는 Thenable도 프로미스처럼 처리한다

```javascript
// ThenableExample 클래스는 then 메소드를 갖고 있으므로
// 생성된 객체는 Thenable이다.
class ThenableExample {
  then(resolve, reject) {
    setTimeout(() => resolve(123), 1000)
  }
}

async function asyncFunc() {
  const result = await new ThenableExample()
  console.log(result) // 123
}
```
