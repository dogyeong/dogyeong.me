---
publishedAt: 2021-09-26
---

# Execution Context

:PublishDate{date="2021-09-26"}

> Execution Context는 자바스크립트 코어에서 가장 중요한 부분 중 하나인데, 구글링해보면 옛날 자료를 기반으로 한게 대부분입니다. (절반정도가 ES3...)
> 그래서 ECMAScript 명세와 여러 포스팅들을 종합해서 최신 자바스크립트(ES2022) Execution Context 동작을 정리하고자 했습니다.
> 틀린 부분은 댓글로 알려주시면 감사하겠습니다.

## Execution Context란?

- 자바스크립트 코드가 평가되는 상황을 추적하기 위해 사용되는 장치
  - 현재 실행 상태를 기록
- `Execution Context`는 세 가지 경우에 생성된다
  - `Global Execution Context`: 글로벌 코드가 평가될 때(프로그램 시작)
  - `Functional Execution Context`: 함수가 호출될 때
  - `Eval Function Execution Context`: `eval()` 함수가 실행될 때
- 스택처럼 LIFO구조로 동작하지만 정확히 스택은 아니다(예외가 있음)
  - 콜 스택이라고도 부르고, 재귀함수를 탈출조건없이 호출하다보면 제한 사이즈를 넘어서 `Call stack size exceeded`라는 오버플로우 에러 메세지를 볼 수도 있다
  - 스택의 가장 위의 현재 평가중인 `Execution Context`를 `Running Execution Context`라고 부른다

## ECMAScript 버전 별 변경점

Execution Context가 중요한 이유는 스코프와 식별자 바인딩을 저장하는 `Environment Record`를 참조하기 때문이라고 생각한다.
ECMAScript가 버전업을 하면서 `Execution Context`내부 구조에 크고작은 변화들이 계속 있었는데, `Environment Record`와 관련된 부분 위주로 간단하게 살펴보자.

### ES3

- 스코프 체인을 리스트로 구현한다. (ES5부터는 outer 참조를 통해 구현)
- [poiemaweb](https://poiemaweb.com/js-execution-context)에 자세히 설명되어 있다

### ES5

- `Execution Context` 내의 주요 컴포넌트
  - `this` 바인딩
  - `LexicalEnvironment`
  - `VariableEnvironment`
- 생성 직후에는 `LexicalEnvironment`, `VariableEnvironment` 두 레코드가 같은 참조값을 가진다. (`LexicalEnvironment`에 `VariableEnvironment`값을 복사하여 할당)
- 코드를 평가하면서 바인딩이 변경되는 경우 `LexicalEnvironment`에 반영된다
- `with`, `catch`문을 평가할 때 새로운 `Environment Record`를 생성해서 `Lexical Environment`가 갱신된다.
- 함수 표현식은 `LexicalEnvironment`를 `[[Scope]]`로 참조한다
- 함수 선언은 `VariableEnvironment`를 `[[Scope]]`로 참조한다
- outer 참조가 `Lexical Environment`에서 관리된다
- 식별자 탐색은 `LexicalEnvironment` 참조를 탐색한다

> Execution Context 내에 LexicalEnvironment라는 컴포넌트가 있고,
> 렉시컬 스코프를 구현하기 위한 outer 참조와 Environemnt Record를 가지는 Lexical Environment라는 명세가 따로 있다.
> 이름이 같아서 햇갈리므로 이 글에서는 띄워쓰기 유무로 구별하겠다.

with문이 있을 때 어떻게 되는지 그림으로 나타내보자.
아래와 같은 코드를 평가하면 foo, bar가 각각 10, 20을 출력한다.

```js
var a = 10

// FD
function foo() {
  console.log(a)
}

with ({ a: 20 }) {
  // FE
  var bar = function () {
    console.log(a)
  }

  foo() // 10!, from VariableEnvrionment
  bar() // 20,  from LexicalEnvrionment
}

foo() // 10
bar() // still 20
```

`with`문 진입 전에는 다음과 같은 상황일 것이다.
![](https://images.velog.io/images/shroad1802/post/4b0bae19-5526-4d90-a08d-35f8acb7b734/image.png)

`with`문 진입하여 `bar` 함수 할당되고 난 후에는 다음처럼 `Lexical Environment`가 하나 더 추가된 상황일 것이다.
![](https://images.velog.io/images/shroad1802/post/cc288210-966a-42a5-877f-d33fca492d0f/image.png)

- 렉시컬 스코프 법칙에 의해서 `foo` 함수는 `VariableEnvironment`를 스코프로 가지기 때문에 a 값이 `10`이 되고, `bar` 함수는 `LexicalEnvrionment`를 스코프로 가져서 `a` 값이 20이 된다.

### ES2015

- 블록 스코프의 등장
- `this` 바인딩이 `Environment Record`에서 관리된다
- `Function Environment Record`타입이 등장하였고, 화살표 함수임을 나타내기 위한 프로퍼티가 추가되었다
- `Execution Context`의 `LexicalEnvironment`, `VariableEnvironment` 컴포넌트의 역할이 변경되었다
  - `VariableEnvironment`는 `var` 식별자의 바인딩을 저장한다
  - `LexicalEnvironment`는 그 외의 `let`, `const`, `function` 선언의 바인딩을 저장한다
- 파라미터에 기본값이 있는 경우 또는 블록문이 있는 경우 새로운 `LexicalEnvironment`가 생성된다.

블록 스코프를 가지는 `let`, `const` 키워드가 추가되었다. 블록문이 있을 때 어떻게 되는지 예시를 보자.

```js
var a = 1

function Foo() {
  const b = 2
  {
    const b = 3
    console.log(a) // 1
    console.log(b) // 3
  }
}

Foo()
```

`console.log()`가 실행될 때의 Execution Context와 Environment를 그려보면 다음처럼 될 것이다.
블록문이 새로운 `Lexical Environment`를 생성하여 스코프 체인 앞에 추가한 것을 볼 수 있다. 그렇기 때문에 `b`값이 3으로 출력되는 것이다.

![](https://images.velog.io/images/shroad1802/post/26bf715f-39d9-44c7-9c2a-6514be0944c7/image.png)

### ES2021

- `Lexical Environment`가 없어지고 하던 역할을 `Environment Reocrd`가 하게 된다
  - `Environment Record`의 `[[OuterEnv]]`에서 상위 스코프를 참조하게 되었다

### ES2022

- `Execution Context`에 `PrivateEnvironment`가 추가되었다

일반적인 함수 호출을 하는 경우 다음처럼 구성될 것이다.

![](https://images.velog.io/images/shroad1802/post/dce6889c-2082-4aec-af51-2e1cdac04d76/image.png)

## 식별자 바인딩 탐색과정

그동안 공부하면서 식별자 값을 어떻게 정확하게 찾는지 개인적으로 궁금했었는데 스펙에 기술돼있었다. `Execution Context`의 `ResolveBinding` 메소드가 바인딩된 값을 찾는 역할을 한다.

- `ResolveBinding(name, env?)`: 식별자 이름과 옵션으로 `Environment Record`를 매개변수로 받는다. `env`가 없으면 `Running Execution Context`의 `LexicalEnvrionment`를 탐색한다. 탐색하는데 `GetIdentifierReference`메소드를 호출한다.
- `GetIdentifierReference(env, name, strict)`: `Environment Record`의 메소드로 실제로 식별자 바인딩 값을 찾는 역할을 한다. `env.[[OuterEnv]]` 체인을 타고가면서
  `name`의 바인딩을 찾아서 반환한다.

자세한 설명은 https://tc39.es/ecma262/#sec-resolvebinding 참조

## References

- https://cabulous.medium.com/javascript-execution-context-lexical-environment-and-block-scope-part-3-fc2551c92ce0
- https://poiemaweb.com/js-execution-context
- https://blog.bitsrc.io/understanding-execution-context-and-execution-stack-in-javascript-1c9ea8642dd0
- https://meetup.toast.com/posts/129
- http://dmitrysoshnikov.com/ecmascript/es5-chapter-3-2-lexical-environments-ecmascript-implementation/#structure-of-execution-context
- https://dev.to/luigircruz/javascript-execution-context-38cn
- https://262.ecma-international.org/12.0/#sec-execution-contexts
- https://262.ecma-international.org/11.0/#sec-execution-contexts
- https://262.ecma-international.org/5.1/#sec-10.3
- https://tc39.es/ecma262/#sec-execution-contexts
