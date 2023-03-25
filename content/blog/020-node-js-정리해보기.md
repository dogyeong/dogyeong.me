---
publishedAt: 2021-08-09
thumbnail: https://res.cloudinary.com/dpefbi4ts/image/upload/v1679722820/thumb/020-thumb.png
thumbnailPlaceholder: WILL_BE_REPLACED
---

# Node.js 정리해보기

:PublishDate{:date="publishedAt"}

:PostThumbnail{:src="thumbnail" :placeholder-data-uri="thumbnailPlaceholder"}

`node.js`, `npm`이 뭔지도 모르고 그냥 코드를 따라 쳐보면서 개발하던 시절부터 어느정도의 시간이 지나 어느덧 현재는 회사에서 node.js 서버 어플리케이션을 개발하기 시작했다. 그동안 노드를 사용하면서 습득한 것들에 대해 정리하고자 한다.

## Node.js

[Ryan Dahl](https://github.com/ry)이 처음 개발한 자바스크립트 런타임이다. 이후 npm과 함께 빠르게 성장하여 자바스크립트 생태계가 커지는데 핵심적인 역할을 했다. 현재 Ryan Dahl은 Node.js의 단점을 보완한 새로운 런타임인 [deno](https://deno.land/)를 개발하고 있는 것 같은데, 어떻게 될 지는 계속 지켜봐야 할 것 같다.

## 특징

구글에 검색해보면 나오는 몇가지 키워드들이 있다

- **싱글스레드**
  Node.js의 메인 스레드는 싱글 스레드로 실행된다. 대부분의 자바스크립트 코드는 메인 스레드가 실행하지만 시간이 오래 걸리는 특정 작업의 경우에는 libuv의 쓰레드풀의 워커 스레드를 이용하여 멀티스레드로 동작할 수 있다.

- **이벤트 기반의 논블로킹 I/O**
  `I/O`: 인풋과 아웃풋이 있는 입출력 작업들을 말한다. 파일 시스템(읽기/쓰기), 네트워크(데이터 송/수신, DNS) 등이 있다.
  `논블로킹`: 어떤 서브루틴을 처리할 때 원래 프로그램의 흐름이 멈추지 않는 것이다. Node.js에서 논블로킹은 자바스크립트가 아닌 다른 작업때문에 이벤트 루프가 멈추는 것을 의미한다.

👉 그래서 논블로킹 I/O라는 것은 I/O작업을 할 때 멈추지 않는다는 뜻이다. Node.js는 I/O요청이 들어오면 백그라운드에서 실행시켜놓고 다른 작업을 하다가 I/O처리가 끝나면 이벤트로 받아서 이어서 처리하는 구조로 설계되었기 때문에 이런 작업에 좋은 성능을 보여준다.
👉 Ryan Dahl이 개발할 때도 빠른 I/O작업을 위해 많은 노력을 했다고 한다. Node.js는 I/O 집약적인 어플리케이션을 개발할 때 적합하다. 반대로 CPU 집약적인 작업을 처리할 때에는 상대적으로 좋지 않은 성능을 보인다.

## 아키텍처

Node.js의 구조도 구글에 검색하면 여러 이미지들을 볼 수 있는데, 이 중 중요한 것이 아래의 `V8`과 `libuv`이다.

- **V8** : 구글이 개발하는 자바스크립트 엔진. 자바스크립트 코드를 실행하고 메모리 힙, 콜 스택을 제공한다. Node.js는 V8 C++ API로 V8을 제어한다.
- **libuv**
  1. 여러 OS의 논블로킹 I/O 동작을 추상화하여 동일한 인터페이스를 제공한다.
  2. 스레드풀을 제공하여 OS레벨에서 지원하지 않는 비동기 작업을 할 수 있게 해준다
  3. 이벤트 루프를 제공하여 이벤트 기반으로 비동기 처리를 할 수 있게 해준다

## 이벤트 루프

이벤트 루프는 libuv 라이브러리 내에 있는 장치로, Node.js가 작업들을 커널이나 스레드풀로 넘겨서 비동기 논블로킹 I/O작업을 할 수 있게 해주는 핵심 요소이다.

### Node.js의 동작흐름

먼저 Node.js 어플리케이션의 동작을 크게 보면 다음과 같은 흐름을 보인다.

1. 어플리케이션이 실행되면 입력한 자바스크립트를 실행하고 콜백들이 등록된다.
2. 이벤트 루프에서 실행할 콜백들이 없을 때까지 이벤트 루프가 동작한다.
3. 더 이상 실행할 콜백이 없으면 어플리케이션이 종료된다.

### 이벤트 루프 구조

<figure>
  <img src="https://imorph-assets.s3.amazonaws.com/site-docs/7ef2fe59-41d0-42ae-b6c9-eaa9f753e78b/6ba55bab-d4b3-4c1e-95a3-9540d1ff9e10-original.png" alt="event loop" width="650">
  <figcaption>
    이미지 출처: https://www.voidcanvas.com/nodejs-event-loop/
  </figcaption>
</figure>

이벤트 루프는 크게 **6개의 단계**로 나누어져 있으며 각각의 단계는 FIFO 큐를 가지고 있어서 해당 단계의 콜백을 실행할 수 있다.

👉 자바스크립트 콜백은 Idel, prepare 단계를 제외한 모든 단계에서 실행될 수 있다
👉 각 단계에서는 자신의 작업을 수행하고, 콜백들을 실행하는데 큐가 비거나 최대 콜백 실행 개수에 도달할 때까지 콜백을 실행한다
👉 `tick`: 이벤트 루프의 한 단계를 수행하는 것을 의미한다
👉 `nextTickQueue`, `microTaskQueue`는 특수한 큐로, libuv에 포함된 장치는 아니다

**1. timer**
`setTimeout`, `setInterval`로 등록된 타이머의 콜백들을 실행하는 단계. 타이머들은 시간을 기준으로 최소 힙에 저장되어있고, 타이머의 기준시간 이상 지났으면 타이머의 콜백을 큐에 넣어서 실행한다.

👉 타이머의 시간을 0으로 설정해도 실제로는 최소 1로 설정된다
👉 실행할 콜백이 남아있더라도 시스템의 실행 한도에 도달하면 다음 단계로 넘어간다
👉 기술적으로, poll 단계에서 타이머의 남은 시간을 체크하고 기다리는 역할을 한다

**2. pending callbacks**
TCP오류와 같은 시스템 작업의 콜백을 실행한다

**3. idle, prepare**
이벤트 루프에서 실행되는 단계이지만 자바스크립트 콜백을 실행하지는 않고 Node.js의 내부 처리를 하는 단계이다

**4. poll**
파일 읽기 작업의 콜백, HTTP 요청의 응답 콜백과 같은 작업들을 처리한다. 이 단계에서도 콜백 큐가 비거나 시스템의 실행 한도까지 콜백을 실행하며 콜백을 처리한 후엔 다음 단계로 넘어가거나 대기할 수 있다.

👉 다음 단계의 콜백 큐(`check_queue`)에 콜백이 있으면 다음 단계로 넘어간다
👉 `check_queue`가 비어있으면 타이머를 체크해서 타이머의 시간이 될 때까지 대기한다
👉 타이머도 없다면? 무슨 일이 생길 때까지 대기한다
👉 새로운 콜백이 추가될 때까지 폴링하고 있는 단계라서 poll phase라는 이름이 붙은 것 같다

**5. check**
`setImmediate`로 등록된 콜백들을 처리하는 단계이다. 다른 단계와 동일하게 콜백 큐가 비거나 시스템의 실행 한도까지 콜백을 실행한다.

**6. close callbacks**
close나 destroy 타입의 콜백들을 처리하는 단계.

**nextTickQueue와 microTaskQueue**
이 두개의 큐는 libuv의 구성요소는 아니지만 Node.js에 포함된 장치이다. 이벤트 루프를 진행하면서 각 단계의 사이마다 이 큐의 콜백들이 실행된다.

👉 `nextTickQueue`: `process.nextTick()`으로 등록한 콜백들을 저장하는 큐
👉 `microTaskQueue`: resolve된 Promise의 콜백들을 저장하는 큐
👉 이벤트 루프의 단계들과는 다르게 제한없이 큐가 빌 때까지 모든 콜백을 실행한다
👉 nextTickQueue가 microTaskQueue보다 먼저 실행된다

## 스레드 풀(Thread pool)

libuv에는 멀티스레드를 지원하도록 스레드 풀도 지원한다. Node.js의 비동기 I/O작업은 OS커널이 제공하는 비동기작업으로 수행된다. 커널에서 지원하지 않는 작업이나 이벤트 루프를 블로킹할 수 있는 시간이 오래 걸리는 몇몇 작업들은 libuv의 스레드 풀을 이용해서 수행하도록 되어있다.

👉 스레드풀의 기본 스레드 수는 4이고, 128까지 늘릴 수 있다.
👉 Node.js에서 스레드풀을 이용하는 작업(모듈)은 `DNS lookup`, `fs`, `crypto`, `zlib`이다. 그 외에 C++애드온, `worker_threads` 모듈을 이용할 수 있다.

스레드풀을 사용하는 예를 보자

```js
const crypto = require('crypto')

const start = Date.now()

function doAsyncWork() {
  crypto.pbkdf2('password', 'salt', 50000, 512, 'sha512', () => {
    console.log(Date.now() - start + 'ms')
  })
}

;[...Array(10)].forEach(doAsyncWork)
```

`crypto`모듈의 `pbkdf2`는 대표적인 스레드풀을 사용하는 비동기 API이다. 위 코드는 간단하게 `pbkdf2`를 10번 실행하고, 각각의 비동기 함수가 종료되는 시간을 출력한다. 필자의 환경에서 실행했을 때 결과는 다음과 같다.

```
254ms
259ms
259ms
259ms
526ms
526ms
531ms
532ms
778ms
779ms
```

결과를 보면 4개씩 시간이 비슷하게 걸리는 것을 볼 수 있다. 이것은 스레드풀의 사이즈가 4인 것을 나타내며 동시에 4개의 작업을 수행할 수 있으므로 5번째 부터는 첫 작업이 끝나고 스레드가 사용가능한 상태가 되어야 작업을 시작할 수 있는 것이다.

## 이벤트 루프 블로킹

이벤트 루프가 블로킹된다는 것은 어떤 콜백의 자바스크립트 실행이 너무 오래 걸려서 이벤트 루프가 돌지 못하고 멈춰있는 상태가 된다는 것을 의미한다. 싱글 스레드로 실행되기 때문에 어떤 스크립트가 오래 걸리게 되면 다른 작업들은 수행되지 못하고 기다리고 있어야 한다. 이러한 이유때문에 작업이 오래 걸리는 CPU 집약적인 일은 Node.js에 어울리지 않는다.

### 이벤트 루프를 블로킹의 예

개발할 때도 이벤트 루프를 블로킹하지 않는 것이 중요한데, 블로킹시키는 몇가지 예시를 보자.

**정규표현식**
정규표현식은 대부분 간단하게 문자열을 검사하는데 사용되지만 잘못쓰면 `O(2^n)`이 걸릴 수도 있다. ip, 전화번호, 이메일 등 특정 목적에 맞는 정규표현식 패키지들이 있으므로 그런 패키지들을 사용하는 것이 권장된다.

**JSON**
`JSON.stringify()`, `JSON.parse()`와 같이 JSON을 파싱하는 API들은 입력값이 작다면 빠르겠지만 입력값이 커질수록 작업시간이 크게 늘어난다.
50MB의 문자열을 파싱하는데 1초 넘게 걸린다는데 이는 1초 넘게 서버가 다른 작업을 못 한다는 것을 의미한다. 만약 큰 사이즈의 JSON을 다뤄야 하는 경우가 생기면 비동기 API를 제공하는 패키지들을 이용하자

### 이벤트 루프 블로킹의 대처 방법들

만약 시간이 오래 걸리는 작업을 꼭 해야 한다면 어떻게 해야 할까? 방법들은 다음과 같은 것들이 있다.

**partitioning**
큰 작업을 여러개로 쪼개서 이벤트 루프가 한번 돌 때마다 하나씩 나눠서 수행하는 방법이다. 그래서 이벤트 루프가 블로킹되는 것을 막고 다른 작업이 실행될 수 있도록 한다.

예를 들어, 다음과 같이 1부터 1억까지 합을 구하는 작업과 타이머가 있다고 하자

```js
const start = Date.now()
let sum = 0
let count = 0

setTimeout(() => {
  console.log('timer : ', Date.now() - start)
}, 10)

for (let i = 0; i < 100_000_000; i++) {
  count++
  sum += count
}

console.log('end : ', Date.now() - start)
```

코드를 실행하면 결과는 다음과 같다.

```
end :  108
timer :  114
```

sum을 구하는 작업이 이벤트 루프를 블로킹하고 있었기 때문에 타이머 콜백은 10ms가 지나도 실행되지 못하고 작업이 끝난 후 114ms에 실행된 것을 볼 수 있다.

이 코드를 `setImmediate()`로 쪼갠 것과 결과는 다음과 같다.

```js
const start = Date.now()
let sum = 0
let count = 0

setTimeout(() => {
  console.log('timer : ', Date.now() - start)
}, 10)

function partition() {
  for (let i = 0; i < 10_000; i++) {
    count++
    sum += count
  }

  if (count >= 100_000_000) {
    return console.log('end : ', Date.now() - start)
  }

  setImmediate(() => {
    partition()
  })
}

partition()
```

```
timer :  10
end :  1164
```

sum을 구하는 작업 시간은 많이 늘었지만 이벤트 루프가 블로킹되지 않아 타이머가 제시간에 실행된 것을 볼 수 있다.

**worker thread**
Node.js 10.5버전부터 `worker_threads`모듈이 추가되어 직접 스레드를 추가할 수 있게 되었다. 워커 스레드는 CPU 집약적인 작업을 효과적으로 처리할 수 있게 해준다.

👉 스레드를 생성하는데 적지않은 오버헤드가 생기기 때문에 CPU 집약적인 작업을 할 때만 사용하는 게 좋고, 실제로 사용할 때는 스레드 풀을 만드는 게 좋다.

```js
const { Worker, isMainThread, parentPort } = require('worker_threads')

if (isMainThread) {
  const start = Date.now()
  const worker = new Worker(__filename)

  worker.on('message', (message) => {
    console.log('end1 : ', Date.now() - start)
  })

  setTimeout(() => {
    console.log('timer : ', Date.now() - start)
  }, 10)
} else {
  let sum = 0
  let count = 0

  for (let i = 0; i < 100_000_000; i++) {
    count++
    sum += count
  }
  parentPort.postMessage(sum)
}
```

```
timer :  19
end :  138
```

## Reference

- https://nodejs.org/ko/docs/guides/
- https://stackoverflow.com/questions/19822668/what-exactly-is-a-node-js-event-loop-tick
- https://www.voidcanvas.com/nodejs-event-loop/
- https://evan-moon.github.io/2019/08/01/nodejs-event-loop-workflow/
- https://stackoverflow.com/questions/50718543/node-js-how-libuv-thread-pool-works
- https://stackoverflow.com/questions/52400311/i-o-bound-vs-cpu-intensive/52400450
- https://nodejs.org/dist/latest-v14.x/docs/api/worker_threads.html
