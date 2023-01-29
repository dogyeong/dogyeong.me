---
publishedAt: 2022-02-28
---

# Vue Reactivity (2)

:PublishDate{date="2022-02-28"}

이전 편에서 vue 반응성의 기초가 되는 track, trigger, dep, depsMap, targetMap을 구현하였다.

이 요소들을 활용해서 이번 편에서는 자동으로 track, trigger가 호출되도록 하여 실질적으로 반응성 시스템이라고 할 수 있는 부분을 구현해보자.

먼저 이전 편에서 사용했던 예제 코드를 보자.

```jsx
const depsMap = new Map()

const track = (target, key, effect) => { ... }

const trigger = (target, key) => { ... }

const sheet = { a: 10, b: 20 }
const sumEffect = () => (sheet.sum = sheet.a + sheet.b)

// sumEffect 등록
track(sheet, 'a', sumEffect)

// sheet.sum 초기화
trigger(sheet, 'a')

sheet.sum // 30

sheet.a = 20

// sheet.sum 갱신
trigger(sheet, 'a')

sheet.sum // 40
```

코드를 보면 sheet.sum을 갱신할 때마다 trigger를 호출해서 등록된 effect들을 수행해야 한다.

이 부분을 reactive API를 이용해서 해결해보자.

### reactive API

[https://vuejs.org/api/reactivity-core.html#reactive](https://vuejs.org/api/reactivity-core.html#reactive)

객체의 프로퍼티들에 반응성을 부여하기 위해 사용하는 API이다. vue에서는 중첩된 프로퍼티까지 전부 반응형으로 바꾸지만, 우리는 일단 최상위 레벨의 프로퍼티만 적용시켜 볼 것이다. vue의 shallowReactive와 같다고 할 수 있겠다.

reactive API는 [프록시](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Proxy)를 이용해서 구현한다. 프록시는 프로퍼티의 값을 받아오거나 변경할 때 추가적인 로직을 수행할 수 있게 해준다. 그 점을 이용해서 getter에서는 track을, setter에서는 trigger를 호출하도록 한다.

```jsx
const reactive = (target) => {
  const handler = {
    get(target, key) {
      // 반응형 객체의 프로퍼티에 접근 시 track 호출
      track(target, key, sumEffect)
      return target[key]
    },
    set(target, key) {
      const oldVal = target[key]
      target[key] = value

      // 값이 변경된 경우에만 수행
      if (oldVal !== value) {
        // 반응형 객체의 프로퍼티 값을 변경 시 trigger 호출
        trigger(target, key)
      }
    },
  }
  return new Proxy(target, handler)
}
```

reactive API는 다음과 같이 적용할 수 있다.

```jsx
const sheet = reactive({ a: 10, b: 20 })

// reactive 내부에서 호출하기 위해 함수 선언으로 변경
function sumEffect() {
  sheet.sum = sheet.a + sheet.b
}

// 초기화 & effect 등록
sumEffect()

console.log(sheet.sum) // 30

sheet.b = 30

console.log(sheet.sum) // 40

sheet.a = 15

console.log(sheet.sum) // 45
```

sumEffect를 처음에 한번 호출하긴 하지만 sheet.sum 값이 a, b 프로퍼티 값이 변경될 때마다 반응하여 자동으로 갱신되는 것을 확인할 수 있다.

### Reflect

[https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Reflect](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Reflect)

Reflec는 메타프로그래밍을 도와주기 위한 자바스크립트 내장 객체다. Proxy와 같이 사용하면 코드를 간단하게 작성할 수 있을 뿐만 아니라, 프로토타입에 의한 사이드 이펙트를 방지해 준다. 자세한 내용은 다음 글을 참고하자.

[https://meetup.toast.com/posts/302](https://meetup.toast.com/posts/302)

Reflect를 이전에 작성한 reactive에 적용하면 다음과 같다. get, set 트랩의 파라미터의 receiver가 추가된 것을 볼 수 있다.

```jsx
const reactive = (target) => {
  const handler = {
    get(target, key, receiver) {
      track(target, key)
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      const oldVal = target[key]
      const result = Reflect.set(target, key, value, receiver)
      if (result && oldVal !== value) {
        // set작업이 성공하고, 값이 변경되었을 경우에만 trigger를 호출한다
        trigger(target, key)
      }
      return result
    },
  }
  return new Proxy(target, handler)
}
```

### activeEffect, effect

지금까지 구현한 반응형 시스템에는 두 가지 문제점이 있다.

1. sumEffect 이외의 다른 effect는 등록할 수 없음
2. 반응형 객체의 프로퍼티 값을 읽을 때마다 track이 호출됨. track은 처음 한 번만 호출되면 됨

이 문제점들을 해결하기 위해 약간의 장치를 추가할 것이다.

등록될 effect를 저장하는 activeEffect 변수와 effect 함수를 추가한다. effect 함수는 activeEffect를 수행한 후 null로 값을 바꿔서 해당 effect에 대한 track이 한 번만 수행되도록 한다.

```jsx
let activeEffect = null

const effect = (eff) => {
  activeEffect = eff
  activeEffect()
  activeEffect = null
}
```

track 함수도 맞춰서 activeEffect가 유효한 값일 때만 수행되도록 수정한다.

```jsx
const track = (target, key) => {
  // 3번째 effect 파라미터 제거
  if (!activeEffect) return // effect 내부일 때만 실행되도록 한다

  let depsMap = targetMap.get(target)

  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  let dep = depsMap.get(key)

  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }

  dep.add(activeEffect) // activeEffec로 변경
}
```

reactive에서도 track 호출 부분을 수정한다.

```jsx
const reactive = (target) => {
  return new Proxy(target, {
    get(target, key) {
      track(target, key) // 3번째 파라미터 제거
      return target[key]
    },
    set(target, key, value) {
      const oldVal = target[key]
      target[key] = value

      if (oldVal !== value) {
        trigger(target, key)
      }
    },
  })
}
```

이펙트를 등록할 때는 effect 함수를 사용하면 된다. 이제 여러개의 effect를 등록할 수 있게 되었다!

```jsx
const sheet = reactive({ a: 10, b: 20 })

// sheet.sum
effect(() => (sheet.sum = sheet.a + sheet.b))

// 새로 추가된 sheet.avg 이펙트
effect(() => (sheet.avg = (sheet.a + sheet.b) / 2))

console.log(sheet.sum) // 30
console.log(sheet.avg) // 15

sheet.b = 30

console.log(sheet.sum) // 40
console.log(sheet.avg) // 20

sheet.a = 15

console.log(sheet.sum) // 45
console.log(sheet.avg) // 22.5
```

이번 편에서는 반응성 시스템의 핵심적인 부분을 구현해 보았다. 다음 편에서는 reactive API 외에 다른 반응성 API들을 구현해보자.
