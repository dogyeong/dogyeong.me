---
publishedAt: 2021-08-28
---

# 자바스크립트의 private

:PublishDate{date="2021-08-28"}

요즘 리팩토링에 관한 책을 읽고 있는데 객체를 캡슐화하는 방법을 보면서 어떤 방법들이 있을 지 호기심이 생겼다. 그래서 자바스크립트에서 정보를 은닉할 수 있는 방법에 대해 알아보았다.

## 1. underscore (`_`)

필드앞에 밑줄을 붙여서 외부외서 접근할 수 없는 숨겨진 필드임을 나타내는 방식이다.

```js
const obj = {
  _private: 'foo',
  get public() {
    return this._private
  },
}

obj._private // 'foo'
obj.public // 'foo'
```

자바스크립트의 모든 객체는 외부에서 접근이 허용되기 때문에 위의 예시처럼 실제로 은닉이 되지는 않는다. 하지만 쉽게 적용할 수 있고 널리 알려진 컨벤션이라 앞에 밑줄이 붙은 변수나 프로퍼티를 종종 볼 수 있다.

그렇지만 시간이 지나면서 다른 방법들도 등장했고 만약 모듈을 만들어서 배포하는 경우, 사용자들이 모든 필드에 접근할 수 있는 것은 큰 문제이기 때문에 사용하지 않는 것이 좋다. [에어비앤비 스타일 가이드](https://airbnb.io/javascript/#naming--leading-underscore)에서도 밑줄을 사용하지 않도록 하고 있다.

<br />

## 2. closure

정의된 스코프의 환경을 참조하는 클로저의 특징을 활용하면 외부에서 접근할 수 없도록 은닉할 수 있다.

```js
function ObjFactory() {
  const private = 'foo'

  return {
    get public() {
      return private
    },
  }
}

const obj = ObjFactory()

obj.private // undefined
obj.public // 'foo'
```

`ObjFactory`가 생성하는 객체의 클로저(`public` 게터)에서 private 값에 접근할 수 있지만 외부에서는 접근하려고 하면 `undefined`로 출력되면서 접근할 수 없는 것을 볼 수 있다.

객체 인스턴스가 생성될 때마다 서로 다른 클로저 함수가 만들어지기 때문에 인스턴스를 많이 생성할 경우 메모리 문제가 생길 수 있다.

<br />

## 3. Symbol

ES2015에서 추가된 [Symbol](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Symbol)타입을 사용해서 값을 은닉시켜볼 수도 있다.

```js
function ObjFactory() {
  const private = Symbol('private')

  return {
    [private]: 'foo',
  }
}

const obj = ObjFactory()

obj[Symbol('private')] // undefined
```

객체를 생성하는 함수 내에서 만든 심볼을 프로퍼티 키값으로 지정하면 `ObjFactory` 외부에서는 일반적인 접근으로 프로퍼티 값을 읽을 수 없다.

하지만 `Object.getOwnPropertySymbols()` 메소드로 심볼로 된 프로퍼티 키를 얻을 수 있으므로 실제로 프로퍼티에 접근할 수 없는 것은 아니다.

```js
Object.getOwnPropertySymbols(obj) // [Symbol(private)]
```

<br />

## 4. WeakMap

앞서 보았듯이 클로저를 활용한 데이터 은닉방식에는 객체마다 함수가 생성되므로 메모리 누수가 발생할 수 있다.

이를 prototype을 사용해서 메소드를 공유하게 하여 방지할 수 있다.

```js
function makeObjFactory() {
  const privates = new Map()

  function ObjFactory(initialVal) {
    privates.set(this, { private: initialVal })
  }

  ObjFactory.prototype.public = function () {
    return privates.get(this).private
  }

  return ObjFactory
}

const ObjFactory = makeObjFactory()
const obj1 = new ObjFactory('foo')
const obj2 = new ObjFactory('bar')

// 숨겨진 데이터에 접근할 수 없다
obj1.privates // undefined
obj1.private // undefined

// 공개된 API로만 캡슐화된 데이터에 접근할 수 있다
obj1.public() // 'foo'
obj2.public() // 'bar'

// 두 객체는 하나의 메소드(public)을 프로토타입으로 공유하고 있다
obj1.public === obj2.public // true
```

하지만 여기서 발생할 수 있는 또다른 문제점은`privates` Map에 저장된 숨겨진 데이터들이 객체가 사라진 이후에도 가비지 컬렉팅이 되지 않아 메모리 누수를 일으킬 수 있다는 점이다.

예를 들어 `obj1 = null`을 수행하여 `obj1` 객체를 제거해도 `privates`의 `'foo'`값은 GC에 의해 제거되지 않고 남아있다.

이를 해결하기 위해 [WeakMap](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)을 사용할 수 있다. WeakMap은 약한 참조를 하고 있기 때문에 프로퍼티 키인 객체가 메모리에서 제거되면 가비지 컬렉팅이 되도록한다.

사용방법도 Map과 흡사하기 때문에 아래와 같이 `privates` 선언만 바꿔주면 된다.

```js
const privates = new WeakMap()
```

<br />

## 5. Private class fields (`#`)

ES2019부터 클래스에 private field가 추가되었다.
샵`#`을 필드 또는 메소드 명 앞에 프리픽스로 붙여주면 된다.

```js
class Factory {
  #privateField = 'foo'
  publicField = 'bar'

  #privateMethod() {
    return 'baz'
  }
  publicMethod() {
    return this.#privateField
  }
}

const obj = new Factory()

obj.#privateField // Uncaught SyntaxError: Private field '#privateMehtod' must be declared in an enclosing class
obj.publicField // 'bar'
obj.#privateMethod() // Uncaught SyntaxError: Private field '#privateMehtod' must be declared in an enclosing class
obj.publicMethod() // 'foo'
```

<br />

## Reference

- https://meetup.toast.com/posts/228
- https://modernweb.com/private-variables-in-javascript-with-es6-weakmaps/
- https://ko.javascript.info/weakmap-weakset
- https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Classes/Private_class_fields
