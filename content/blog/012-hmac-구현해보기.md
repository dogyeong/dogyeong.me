---
publishedAt: 2020-12-17
---

# HMAC 구현해보기 (feat. 함수형 프로그래밍)

:PublishDate{date="2020-12-17"}

## HMAC 구현 (feat. PF)

[HMAC](https://ko.wikipedia.org/wiki/HMAC)을 직접 구현해보고 적용하였다..! 처음에 생성 과정을 봤을 때는 이게 뭔가 싶었는데 지금은 이해를 다 하고 있으니까 생각보다 쉽게 코드로 구현할 수 있었다. 그래서 마스터 세션에서 본 함수형 프로그래밍도 나름대로 적용해보고 재미있었던 경험이었다.

### 설계

`hmac.js` 파일 안에 `createHmac`이라는 함수를 구현하여 export하였고, 그 외에 작은 여러 함수들도 새로 만들었다. `createHmac` 함수는 4개의 인자를 받도록 설계했고 `key`는 HMAC을 만드는데 사용할 비밀 키, `data`는 해싱될 메세지, `algorithm`은 적용될 알고리즘, `encoding`은 HMAC 결과 문자열의 인코딩 방식을 지정한다.

```js
exports.createHmac = ({ key, data, algorithm, encoding }) => {
```

### 계산 시작

그리고 이제 계산에 필요한 값들을 준비한다. 최종적으로 필요한 값들은 `dataBuffer`, `iKeyPad`, `oKeyPad` 3가지이다.

```js
const keyBuffer = Buffer.from(key)
const dataBuffer = Buffer.isBuffer(data) ? data : Buffer.from(data)

const targetBuffer = Buffer.alloc(MAX_KEY_BYTES, 0)

keyBuffer.copy(targetBuffer, 0, 0, keyBuffer.byteLength)

const iKeyPad = xor(targetBuffer, I_PAD)
const oKeyPad = xor(targetBuffer, O_PAD)
```

### 함수형 프로그래밍

마지막으로 HMAC을 계산하여 만들어낸다. 이 부분에서 함수형 프로그래밍으로 해보기 위해 `pipe` 함수를 정의했다. `pipe`함수는 전달받은 함수들을 차례대로 연결시켜주는 역할을 하게 된다. 이렇게 준비한 `pipe`에 버퍼를 합치는 함수, 해시를 만드는 함수 등의 함수들을 계산 순서대로 전달하면 쉽게 계산을 할 수 있게 된다!

그리고 `key`, `algorithm`, `encoding` 조건에 따라 다른 값으로 계산을 해주기 위해서 계산과정의 함수들을 고차함수로 정의하고, 클로저를 활용하도록 했다.

```js
const pipe =
  (...functions) =>
  (arg) =>
    functions.reduce((prev, fn) => fn(prev), arg)
```

```js
return pipe(
  concatBuffer(iKeyPad),
  createHash({ algorithm, encoding }),
  strToBuffer(encoding),
  concatBuffer(oKeyPad),
  createHash({ algorithm, encoding }),
)(dataBuffer)
```
