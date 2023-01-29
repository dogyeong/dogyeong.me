---
publishedAt: 2021-04-11
---

# JavaScript - Property Descriptor

:PublishDate{date="2021-04-11"}

자바스크립트의 객체 프로퍼티는 키-값 쌍으로 이루어져 있다. 하지만 내부적으로 단순히 키-값 뿐만 아니라 프로퍼티에 대한 추가적인 정보들을 더 가지고 있는데, 이것을 `Property Descriptor`(프로퍼티 서술자)라고 한다.

`Object.getOwnPropertyDescriptor()`로 확인할 수 있다.

```js
const obj = { a: 2 }

Object.getOwnPropertyDescriptor(obj, 'a')
/*
{
  	configurable: true
  	enumerable: true
  	value: 2
	writable: true
}
*/
```

프로퍼티 값으로 보이는 `value` 말고도 다른 속성들이 있는데, 이것들에 대해서 알아보자

## writable

프로퍼티 값의 쓰기 가능 여부를 설정한다. 기본값은 `true`이며 `false`인 경우 해당 프로퍼티는 읽기 전용이 된다.

읽기 전용 프로퍼티를 수정하는 경우, 조용히 실패하며 엄격 모드에서는 `TypeError`가 발생한다.

```js
'use strict'
const obj = {}
Object.defineProperty(obj, 'a', {
  value: 2,
  writable: false, // 쓰기 금지
  configurable: true,
  enumerable: true,
})

obj.a = 3 // TypeError
```

## configurable

프로퍼티의 Descriptor를 설정가능 여부를 설정한다. 기본값은 `true`이며, `true`인 경우 `defineProperty()`로 프로퍼티 Descriptor를 변경할 수 있다.

설정 불가한 프로퍼티의 서술자를 변경하려고 하면 `TypeError`가 발생한다. 즉, `configurable` 속성은 한번 `false`로 설정되면 되돌릴 수 없다.

```js
const obj = {}
Object.defineProperty(obj, 'a', {
  value: 4,
  writable: true,
  configurable: false, // 설정 금지
  enumerable: true,
})

obj.a = 5 // ok

Object.defineProperty(obj, 'a', {
  value: 4,
  writable: true,
  configurable: true,
  enumerable: true,
}) // TypeError

delete obj.a // false, 실패
```

## enumerable

프로퍼티를 열거하는 구문에서 해당 프로퍼티의 표출 여부를 나타낸다. 기본값은 `true`이며, `false`로 지정하면 프로퍼티에 접근할 수는 있지만, `for in` 루프와 같은 열거 구문에서 감춰진다.

```js
obj = { a: 1, b: 2, c: 3 }

Object.defineProperty(obj, 'b', {
  value: 4,
  writable: true,
  configurable: true,
  enumerable: false, // 열거 금지
})

for (const i in obj) {
  console.log(i)
} // a c
```

## Property Descriptor 관련 메소드

- [Object.getOwnPropertyDescriptor()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)
  특정 프로퍼티의 Descriptor를 얻을 수 있다

- [Object.getOwnPropertyDescriptors()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors)
  객체의 모든 프로퍼티의 Descriptor를 얻을 수 있다

- [Object.defineProperty()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
  프로퍼티를 Descriptor와 함께 정의할 수 있다

- [Object.defineProperties()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties)
  여러 프로퍼티를 Descriptor와 함께 정의할 수 있다

## 불변성

객체의 프로퍼티를 변경되지 않게 해야 할 경우가 있다. ES5부터는 이런 처리를 할 수 있도록 다양한 방법을 제공한다. 이런 방법들을 알아보자.

### 1. 프로퍼티 상수화

`writable: false` `configurable: false`를 같이 지정해주면 프로퍼티를 상수처럼 사용할 수 있다.

```js
const obj = {}
Object.defineProperty(obj, 'MY_NUMBER', {
  value: 40,
  writable: false,
  configurable: false,
})
```

### 2. [Object.preventExtensions()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions)

Object.preventExtensions() 메소드는 객체에 더 프로퍼티를 추가할 수 없게 차단해준다. 프로퍼티를 추가할 수 없도록 차단된 상태에서 프로퍼티를 추가하는 경우, 조용히 실패하며 엄격 모드에서는 `TypeError`가 발생한다.

### 3. [Object.seal()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/seal)

Object.seal()은 객체를 봉인한다. 객체에 대해 Object.preventExtensions()를 실행하고 프로퍼티를 전부 `configuralbe: false` 처리하는 것과 같은 역할을 한다. 결과적으로 더는 프로퍼티를 추가할 수 없고, 기존 프로퍼티를 재설정하거나 삭제할 수도 없다. 값을 바꿀 수 있다.

### 4. [Object.freeze()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)

Object.freeze()는 객체를 완전히 얼려버리는 메소드로 가장 높은 단계의 불변성을 적용시킨다. 객체에 대해 Obejct.seal()을 적용하고, 모든 프로퍼티 서술자에 대해 `writalbe: false`처리한 것과 같은 역할을 한다. 결과적으로 프로퍼티를 추가/삭제할 수 없고, 값도 바꿀수 없게 된다.

> **얕은 불변성**
>
> 위에서 본 방법들은 얕은 불변성(Shallow Immutability)을 지원한다. 즉, 객체 자신과 자신의 프로퍼티 특성만 불변으로 만들고, 다른 객체, 배열, 함수를 가리키는 레퍼런스 프로퍼티가 있을 때는 해당 레퍼런스가 가리키는 객체의 내용까지 불변으로 만들지는 못한다.

## 참조

- [YOU DON'T KNOW JS](https://www.hanbit.co.kr/store/books/look.php?p_code=B7156943021)
- [프로퍼티 플래그와 설명자](https://ko.javascript.info/property-descriptors#ref-1370)
