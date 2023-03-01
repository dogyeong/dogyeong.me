---
publishedAt: 2022-03-06
thumbnail: /images/030-thumb.png
---

# Vue Reactivity (3)

:PublishDate{:date="publishedAt"}

이전 편에서는 vue의 반응성 시스템과 reactive API를 구현해보았다.

이번 편에서는 추가적으로 `ref`, `computed API`를 구현해보자.

### ref API

[https://vuejs.org/api/reactivity-core.html#ref](https://vuejs.org/api/reactivity-core.html#ref)

만약 외부 원시값에 반응하는 `effect`를 만들면 어떻게 될까?

원시값은 객체가 아니기 때문에 값이 변경되더라도 `effect`가 수행되지 않을 것이다.

아래 예시 코드가 있다.

```jsx
let result = 0
let times = 1

effect(() => (result = times * 10))

times = 2 // 반응하지 않음
```

이런 경우에 원시값을 반응형 객체로 만들어주는 vue API가 `ref API`이다.

`ref()`는 전달받은 값을 `value` 프로퍼티로 가리키는 반응형 객체를 반환한다.

예시를 보자.

```jsx
const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

그러면 이제 `ref API`를 구현해보자.

vue에서는 간단하게 getter, setter를 이용해서 구현했다. `value` 프로퍼티에 접근할 때 `track`을 호출하고, `value` 프로퍼티의 값을 변경하고 나서는 `trigger`를 호출해준다.

```jsx
const ref = (raw) => {
  const refObj = {
    get value() {
      track(refObj, 'value')
      return raw
    },
    set value(newVal) {
      if (newVal === raw) return // 값이 바뀔 때만
      raw = newVal
      trigger(refObj, 'value')
    },
  }

  return refObj
}
```

`ref API`를 활용하는 예시를 보자.

이전 편에서 사용하던 `sheet` 객체 예시에 내용을 추가하여, `sheet.sum`에 `times` 라는 값을 곱해서 `sheet.total` 값이 된다고 해보자.

`times` 변수를 `ref`로 만들어주고, 값을 변경해보면 `sheet.total` 값이 반응하는 것을 확인할 수 있다.

```jsx
const sheet = reactive({ a: 10, b: 20 })
const times = ref(2)

// sheet.sum
effect(() => (sheet.sum = sheet.a + sheet.b))

// sheet.total
effect(() => (sheet.total = sheet.sum * times.value))

console.log(sheet.total) // 30 * 2 = 60

times.value = 4

console.log(sheet.total) // 30 * 4 = 120
```

### computed API

[https://vuejs.org/api/reactivity-core.html#computed](https://vuejs.org/api/reactivity-core.html#computed)

`computed()`는 전달받은 `getter` 함수의 결과값을 `value`로 가지는 반응형 객체를 반환한다.

지금까지 `effect` 함수를 사용해서 다른 변수에 값을 할당하는 `effect`를 만들었는데, `computed API`를 이용하면 반응형 객체를 새로운 변수에 저장할 수 있다.

`computed`는 간단하게 `effect`와 `ref`를 조합하면 구현할 수 있다.

```jsx
const computed = (getter) => {
  const result = ref(null)
  effect(() => (result.value = getter()))
  return result
}
```

앞의 `ref API`에서 사용했던 예시에 `computed`를 적용해보자. `effect`를 `computed`로 대체하여 변수 선언식에 적용할 수 있다.

```jsx
const sheet = reactive({ a: 10, b: 20 })
const times = ref(2)

const sum = computed(() => sheet.a + sheet.b)
const total = computed(() => sum.value * times.value)

console.log(sum.value) // 30
console.log(total.value) // 60

sheet.a = 30

times.value = 4

console.log(sum.value) // 50
console.log(total.value) // 200
```
