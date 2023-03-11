---
publishedAt: 2021-11-28
thumbnail: /images/027-thumb.png
thumbnailPlaceholder: WILL_BE_REPLACED
---

# 타입스크립트와 catch절 에러 처리

:PublishDate{:date="publishedAt"}

:PostThumbnail{:src="thumbnail" :placeholder-data-uri="thumbnailPlaceholder"}

자바스크립트는 어떤 값이든 에러로 던질 수 있다.

```ts
throw 123
throw 'hello!'
throw new Error('Unexpected Error!')
```

그래서 타입스크립트에서는 에러가 `unknown` 타입으로 설정된다.

```ts
try {
  throwError()
} catch (e) {
  // e: unknown
}
```

> 아무 타입이나 던질 수 있지만 에러 객체를 던지는 것이 권장되는 방법이다

다른 언어처럼 원하는 타입의 에러만 catch로 잡을 수 없기 때문에
catch 절 내부에서는 에러 타입에 따라 다른 처리를 하고자 할 때는 분기 처리를 해주어야 한다

```ts
catch(e) {
	if (e instanceof TypeError) {
		// TypeError
	}
	else if (e instanceof SyntaxError) {
		// SyntaxError
	}
	else if (typeof e === 'string') {
		// string
	}
	else {
		// other
	}
}
```

보통 서비스를 개발할 때 catch절 내에서 로그를 많이 출력해주는데 에러 객체는 message 프로퍼티를 출력해주고 에러 객체가 아닌 경우, 문자열로 변경해서 로그를 출력해준다

```ts
catch(e) {
	if (e instanceof Error) {
		logger.error(e.message)
	} else {
		logger.error(String(e))
	}
}
```

[여기](https://github.com/kentcdodds/kentcdodds.com/issues/206)에서 제안한 에러 메세지 추출 방법도 좋다

```ts
type ErrorWithMessage = {
  message: string
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  )
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError

  try {
    return new Error(JSON.stringify(maybeError))
  } catch {
    // 순환 참조와 같이 JSON.stringify에서 에러가 발생하는 경우 처리
    return new Error(String(maybeError))
  }
}

function getErrorMessage(error: unknown) {
  return toErrorWithMessage(error).message
}
```

## References

- [https://fettblog.eu/typescript-typing-catch-clauses/](https://fettblog.eu/typescript-typing-catch-clauses/)
- [https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript](https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript)
- [https://github.com/kentcdodds/kentcdodds.com/issues/206](https://github.com/kentcdodds/kentcdodds.com/issues/206)
