---
publishedAt: 2021-08-20
---

# Chrome 92버전의 새로운 기능

:PublishDate{date="2021-08-20"}

> 크롬 92에서 등장한 새로운 기능/기술들을 알아보자
> 자세한 내용은 아래 문서 참조
> https://v8.dev/blog/v8-release-92 > https://www.chromestatus.com/features/schedule

## `at()`

파이썬같은 다른 언어를 사용해보면 배열의 인덱스를 이용해서 원소를 선택할 때 첫 번째 요소부터 인덱싱을 할 수도 있고, 마지막 요소부터 셀 수 도 있다. 뒤에서 셀 때는 음수를 사용한다.

자바스크립트에서도 이런 기능이 있으면 좋겠다고 생각해왔었는데 `at`이라는 메소드로 등장했다.

예시를 보자.

```js
;['apple', 'banana', 'orange'].at(-1) // orange
;[('apple', 'banana', 'orange')].at(-2) // banana

'abced'.at(-4) // 'b'
```

파라미터로 음수를 전달하면 뒤에서부터 인덱스를 세며, 양수를 전달하는 경우 기존의 인덱스 접근과 동일하게 동작한다.

Array, TypedArray, String 형식의 데이터에서 사용할 수 있다.

### 참고

- [MDN - Array.prototype.at()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at)
- [MDN - String.prototype.at()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/at)

<br />

## Shared Pointer Compression Cage

V8엔진은 64비트 플랫폼에서 포인터 압축(Pointer Compression)이라는 최적화 기법을 사용한다. 힙 메모리에 저장되는 포인터에 주소를 32비트의 오프셋만 저장함으로써 메모리를 절약하는 방법이다. 대신 32비트로 저장할 수 있는 최대 크기인 4GB로 메모리 사이즈가 제한된다는 단점이 있다.

V8 9.2버전에서는 한 프로세스 내의 스레드들이 4GB의 메모리를 공유하도록 기본값이 변경되었다. JS의 공유 메모리와 관련된 실험 기능을 예상해서 변경되었다고 하며, 스레드에 가상 메모리와 관련된 이점을 가져다 줄 것으로 예상된다.
이 변경점의 단점은 같은 프로세스 내의 모든 스레드가 가지는 메모리의 최대 사이즈가 4GB로 제한된다는 것이다. 그러므로 서버와 같이 프로세스당 스레드가 많은 환경에서는 이 기능을 사용하지 않는 것이 좋을 것으로 보인다.

### 참고

- [V8 blog - pointer compression](https://v8.dev/blog/pointer-compression)

<br />

## `crypto.randomUUID()`

crypto 인터페이스는 Node.js에만 있는 줄 알았는데, Web API에도 있었다...😅

그리고 이번에 `randomUUID()`메소드가 추가되었다. uuid는 웹 개발을 하면서 종종 쓰이는데 이전에는 npm 패키지를 사용했지만 이제부터는 네이티브 API를 사용하면 될 것 같다.

```js
crypto.randomUUID() // "23f93d6c-2fb6-4e03-a795-d67364534649"
```

### 참고

- https://www.chromestatus.com/feature/5689159362543616
- [RFC 4122](https://datatracker.ietf.org/doc/html/rfc4122)
