---
publishedAt: 2021-09-06
---

# Environment Record

:PublishDate{date="2021-09-06"}

> ECMAScript의 명세 중 Environment Record에 대해 정리해봤습니다.
> ECMAScript 2022를 기준으로 작성하고자 했고, 틀린 점은 댓글로 알려주시면 감사하겠습니다.

## Environment Record(환경 레코드)란 무엇인가

환경 레코드는 **코드의 중첩 구조를 기반으로 식별자들을 특정 변수 또는 함수에 연결**하기 위해 사용된다.

주로 함수 선언문, 블록, try문의 catch절과 같은 구문이 평가될 때마다 해당 코드에 의해 생성된 식별자 바인딩을 기록하기 위해 환경 레코드가 생성된다.

> 바인딩(binding): 식별자(이름)과 값을 연결하는 것

<br>

## 환경 레코드의 중첩구조

모든 환경 레코드는 `[[OuterEnv]]` 필드를 가지고 있고, 이 필드는 바깥환경 레코드의 참조를 저장하거나 `nul` 값을 가진다. 이 필드는 논리적으로 환경 레코드 값들이 중첩될 수 있도록 한다. 바깥의 환경 레코드가 안쪽의 환경 레코드를 둘러싸고 있는 개념이다. 당연히 바깥의 환경 레코드 또한 `[[OuterEnv]]` 필드로 바깥의 환경 레코드를 참조할 수 있다.

예시 코드를 보자.

```js
var a = 'A'

function foo() {
  var b = 'B'

  function bar() {
    var c = 'C'
  }

  function baz() {
    var d = 'D'
    console.log(a)
  }

  baz()
}

foo() // 'A'
```

일단 위의 `var`와 함수로 이루어진 코드가 평가될 때 환경 레코드가 어떻게 구성되는지 생각해보자.
실제로는 환경 레코드가 객체로 만들어지지는 않을것이고, 유저 레벨에서 접근하는 것도 불가능하지만 하지만 이해하기 편하도록 객체 형태로 표현해 보았다.

```js
GlobalEnvironmentRecord = {
	a: 'A',
  	foo: <Function foo>,
  	[[OuterEnv]]: null,
}

fooEnvironmentRecord = {
 	b: 'B',
  	bar: <Function bar>,
  	baz: <Function baz>,
  	[[OuterEnv]]: GlobalEnvironmentRecord,
}

barEnvironmentRecord = {
	c: 'C',
  	[[OuterEnv]]: fooEnvironmentRecord,
}

bazEnvrionmentRecord = {
  	d: 'D',
  	[[OuterEnv]]: fooEnvironmentRecord,
}
```

함수가 평가되면서 생성된 환경 레코드의`[[OuterEnv]]`는 구문적으로 상위의 환경 레코드의 참조가 될 것이고, 다음과 같은 트리구조를 만들게 된다.

```
                   null
                     |
          GlobalEnvironmentRecord
                     |
           fooEnvironmentRecord
                     |
          ------------------------
          |                      |
barEnvironmentRecord   bazEnvrionmentRecord
```

### 스코프, 렉시컬 스코프, 스코프 체인

이렇게 연결된 환경 레코드들이 식별자의 값을 찾을 수 있는 범위(스코프)를 결정한다.
위의 코드 예시에서 `foo`함수를 호출했을 때 콘솔에 `'A'`가 출력되는 것은 `baz`함수에서 `a`를 찾을 때까지 환경 레코드의 `[[OuterEnv]]`를 타고 올라가면서 `a`를 찾기 때문이다.
결국 `bazEnvrionmentRecord -> fooEnvironmentRecord -> GlobalEnvironmentRecord`를 거치면서 `a`를 찾아서 값을 출력한 것이고, 만약에 `a`를 찾지 못해 `null`까지 도달했다면, `undefined`가 출력되었을 것이다.

> 이렇게 식별자의 스코프가 연결된 것을 **스코프 체인**이라고 하며,
> 구문이 정의된 대로 스코프를 갖는 특징을 **렉시컬 스코프**라고 한다.

<br>

## 환경 레코드의 종류와 타입계층

환경 레코드는 몇가지 종류가 있으며 간단한 객체지향의 계층으로 생각할 수 있다.
상속관계를 나타내면 아래와 같다.

```
                                     Environment Record(Abstract Class)
                                                    |
                    -----------------------------------------------------------------
                    |                               |                               |
        Declarative Environment Record     Object Environment Record     Global Environment Record
                    |
            --------------------------------
            |                              |
Function Environment Record     Module Environment Record
```

### Declarative Environment Record

var, const, let, class, module, import, function 식별자들이 스코프 내에서 선언된 경우의 바인딩을 관리한다.

### Function Environment Record

함수 내의 최상위 스코프의 바인딩을 나타내는 `Declarative Environment Record`이다.

함수에 필요한 this, super, newTarget에 관한 필드, 메소드 동작들이 정의되어 있다.

```js
FunctionEnvironmentRecord = {
	// ... Declarative Environment Record

  	[[ThisValue]]: any
  	[[ThisBindingStatus]]: lexical | initialized | uninitialized
 	[[FunctionObject]]: object
	[[NewTarget]]: object | undefined
}
```

- 이 부분에서 일반 함수와 화살표 함수의 동작의 차이점을 볼 수 있다. 화살표 함수는 `[[ThisBindingStatus]]`가 `lexical`로 설정되며, this 바인딩을 제공하지 않고 생성자 함수로 사용할 수도 없다.
- `[[FunctionObject]]` 필드는 환경 레코드가 생성되게 한 호출된 함수를 가리킨다
- `[[NewTarget]]`: new 키워드와 생성자 함수를 호출한 경우, 처음에 new 키워드가 적용된 함수 객체를 가리킨다

### Object Environment Record

환경 레코드를 객체로 만드는 것은 비효율적이라서 일반적으로 하지 않지만 필요한 경우가 2가지 있다.

1. 전역 객체
2. `with` 문

전역 객체에 대해서는 아래의 `Global Environment Record`에서 알아보고, `with`문은 [사용하지 않는 것이 권장](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/with)되니 넘어가도록 하겠다.

`Object Environment Record`는 두 개의 추가 필드를 가진다.

- `[[BindingObject]]`: 환경 레코드에 바인딩된 객체
- `[[IsWithEnvironment]]`: 환경 레코드가 `with`문에 의해 생성되었는지를 나타내는 불리언 값

### Global Environment Record

하나의 `realm`에서 실행되는 모든 자바스크립트 코드들이 공유하는 최상위 스코프를 나타낸다. 전역 환경 객체는 빌트인 객체들, 전역 객체의 프로퍼티 그리고 전역 스코프에서의 선언에 대한 바인딩을 관리한다.

논리적으로 하나의 레코드로 생각할 수 있지만 `declarative Environment Record`와 `object Environment Record`가 합성된 형태로 정의된다.

각 환경 레코드가 관리하는 바인딩을 나타내면 다음과 같다.

- object Environment Record
  - 전역 객체를 `[[BindingObject]]`로 가진다
  - 전역 스코프에서 this는 전역 객체를 나타낸다
  - 브라우저 환경에서 `window`는 전역 객체를 참조한다
  - 전역 객체의 프로퍼티
    - 내장 전역 객체들의 바인딩
    - 전역 스코프에서의 함수, 비동기 함수, 제너레이터, 비동기 제너레이터, `var` 선언의 바인딩
- declarative Environment Record
  - object Environment Record의 바인딩 외의 전역 스코프에서의 선언의 바인딩

그래서 다음 예시처럼 전역 스코프에서 `var`로 선언한 변수는 전역 객체의 프로퍼티로 추가되지만, `const`로 선언한 변수는 추가되지 않는 것을 볼 수 있다.

```js
var foo = 'foo'
const bar = 'bar'

this.foo // 'foo'
this.bar // undefined
```

전역 환경 레코드만의 필드는 내부의 환경 레코드를 참조하거나 this를 참조하는 것들이 있다.

```js
GlobalEnvironmentRecord = {
	// ...Environment Record

  	[[ObjectRecord]]: 전역 객체를 바인딩하는 object Environment Record
  	[[GlobalThisValue]]: 전역 스코프에서의 this값
    	[[DeclarativeRecord]]: 전역 스코프에서의 함수, 비동기 함수, 제너레이터, 비동기 제너레이터, var 선언을 제외한 모든 바인딩을 가지는 declarative Environment Record
	[[VarNames]]: 전역 객체의 프로퍼티로 추가되는 식별자와 전역 스코프에서 선언되는 식별자를 구분하기 위해 함수, 비동기 함수, 제너레이터, 비동기 제너레이터, `var` 변수 이름을 리스트 형태로 저장
}
```

### Module Environment Record

자바스크립트 모듈의 바깥 스코프를 표현하기 위해 사용되는 declarative Environment Record

다른 환경 레코드에 존재하는 바인딩에 간접적으로 접근할 수 있는 불변 `import` 바인딩을 제공한다.

그래서 다른 모듈에 대해 `import` 바인딩을 생성하는 메소드가 추가된다.

<br>

## 정리

- 프로그램이 동작하면서 코드가 평가될 때 식별자 바인딩을 기록하기 위해 환경 레코드가 생성된다
- 어떠 식별자의 값을 찾을 때 환경 레코드를 바탕으로 값을 찾는다
- 환경 레코드는 구문이 정의된 대로 중첩된 참조를 가지며, 이런 스코핑 방식을 렉시컬 스코프, 연쇄 참조방식을 스코프 체인이라고 한다.
- 환경 레코드는 상속구조를 가지며, 최상위의 추상클래스(Environment Record) 하위의 5가지의 타입이 존재한다.

<br>

## Reference

- https://tc39.es/ecma262/
- https://roseline.oopy.io/dev/javascript-back-to-the-basic/environment-record
- http://dmitrysoshnikov.com/ecmascript/es5-chapter-3-2-lexical-environments-ecmascript-implementation/
- https://stackoverflow.com/questions/32450516/what-is-new-target
