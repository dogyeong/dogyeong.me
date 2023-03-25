---
publishedAt: 2022-02-19
thumbnail: https://res.cloudinary.com/dpefbi4ts/image/upload/v1679722820/thumb/030-thumb.png
thumbnailPlaceholder: WILL_BE_REPLACED
---

# Vue Reactivity (1)

:PublishDate{:date="publishedAt"}

:PostThumbnail{:src="thumbnail" :placeholder-data-uri="thumbnailPlaceholder"}

Vue의 핵심요소라고 할 수 있는 반응성 시스템을 단계별로 구현해 볼 것이다.

이번 편에서는 반응성을 구현하기 위해 필요한 기본요소들을 구현해보자

### Reactivity

먼저 반응성에 대해 알아보면, 뷰에서 반응성 시스템은 상태를 선언적으로 작성하면 상태가 변경될 때마다 UI와 다른 계산된 값들이 자동으로 변경되는 시스템을 말한다.

이 덕분에 굉장히 간단하고 직관적으로 코드를 작성할 수 있게 해준다.

[참고 - vue 공식문서](https://vuejs.org/guide/extras/reactivity-in-depth.html)

### 시작

이번 편에서 사용할 예제는 스프레드 시트를 모델링한 객체이다.

a, b 두 값이 있고, sum 프로퍼티는 a와 b를 합한 값을 나타낸다.

```jsx
const sheet = {
  a: 10,
  b: 20,
  sum: 30,
}
```

### sum 갱신하기

sum을 갱신하기 위해서는 a 또는 b 프로퍼티의 값이 변경될 때마다 a, b를 합한 값을 저장해야 한다

```jsx
const sheet = { a: 10, b: 20, sum: 30 }

sheet.a = 15

console.log(sheet.sum) // 여전히 30

sheet.sum = sheet.a + sheet.b

console.log(sheet.sum) // 35로 업데이트됨
```

### effect

vue에선 어떤 프로퍼티의 변경에 반응하여 다른 상태를 변경하는 로직을 side effect라고 하고, 줄여서 effect라고 표현한다.

sum을 계산하는 effect를 만들어보자.

```jsx
const sumEffect = () => {
  sheet.sum = sheet.a + sheet.b
}
```

이제 시트의 a, b 값이 변경될 때마다 sumEffect를 호출하면 sum값이 업데이트된다

```jsx
sheet.b = 40

sumEffect() // sheet.sum 업데이트
```

### dep, track, trigger

effect를 여러개 관리할 수 있도록 해보자.

먼저 effect들을 저장할 dep라는 이름의 Set을 추가한다.
Set은 여러개의 effect가 중복으로 등록되는 것을 방지해준다.

```jsx
const dep = new Set()
```

그리고 dep에 effect를 등록하는 track 함수를 추가한다

```jsx
const track = (effect) => dep.add(effect)
```

마지막으로, dep에 등록된 모든 effect를 호출하는 trigger 함수를 추가한다

```jsx
const trigger = () => dep.forEach((effect) => effect())
```

이제 sumEffect뿐 만 아니라, 다른 effect도 쉽게 추가할 수 있게 되었다!

effect, track, trigger를 적용한 전체 코드는 아래와 같다

```jsx
const dep = new Set()
const track = (effect) => dep.add(effect)
const trigger = () => dep.forEach((effect) => effect())

const sheet = { a: 10, b: 20 }

const sumEffect = () => (sheet.sum = sheet.a + sheet.b)

// sumEffect 등록
track(sumEffect)

// 처음에 trigger를 호출해서 sum값을 초기화해준다
trigger()

console.log(sheet.sum) // 30

sheet.a = 20

// sum 업데이트
trigger()

console.log(sheet.sum) // 40
```

### depsMap

지금까지 구현한 코드에서는 어떤 프로퍼티가 변경되는지에 상관없이 trigger를 호출하면 모든 effect가 수행된다.

만약 sheet에 sum과 관계없는 프로퍼티가 있으면, 그 프로퍼티가 변경될 때는 sumEffect가 수행될 필요가 없다. 즉, 프로퍼티별 의존성을 관리해야 하고, 프로퍼티별 dep을 만들어야 한다는 의미가 된다.

그러므로 프로퍼티별 dep을 맵핑해주는 depsMap이라는 이름의 Map을 추가해준다.

```jsx
const depsMap = new Map()
```

이전에 작성한 track, trigger 함수를 프로퍼티 키값을 매개변수로 받아서 depsMap에 저장하도록 수정한다.

dep은 이제 track 내부에서 생성하게 된다.

```jsx
const track = (key, effect) => {
  // key 매개변수 추가
  let dep = depsMap.get(key)

  // key에 해당하는 dep이 없는 경우 Set을 새로 생성
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }

  dep.add(effect)
}

const trigger = (key) => {
  // key 매개변수 추가
  const dep = depsMap.get(key)

  if (!dep) return

  dep.forEach((effect) => effect())
}
```

track, trigger를 호출할 때 key값을 같이 넘겨주도록 한다

```jsx
track('a', sumEffect)
trigger('a')

sheet.a = 40

trigger('a')
```

### targetMap

depsMap과 비슷하게, 이번에는 여러 객체에 대한 의존성을 나누기 위해 하나의 레이어를 또 추가한다.

타겟 객체와 depsMap을 맵핑해주는 targetMap이라는 이름의 WeakMap을 추가해준다.

WeakMap은 메모리 타겟 객체에 대한 메모리 누수를 방지해준다.

```jsx
const targetMap = new WeakMap()
```

이전에 작성한 track, trigger 함수에 target 객체를 매개변수를 추가한다.

depsMap은 이제 track 내부에서 생성하게 된다.

```jsx
const track = (target, key, effect) => {
  // target 추가
  let depsMap = targetMap.get(target)

  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  let dep = depsMap.get(key)

  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }

  dep.add(effect)
}
const trigger = (target, key) => {
  // 여기도 target 추가
  const depsMap = targetMap.get(target)

  if (!depsMap) return

  const dep = depsMap.get(key)

  if (!dep) return

  dep.forEach((effect) => effect())
}
```

track, trigger를 호출할 때 타겟 객체 같이 넘겨주도록 한다

```jsx
track(sheet, 'a', sumEffect)
trigger(sheet, 'a')

sheet.a = 40

trigger(sheet, 'a')
```

이제 여러개의 반응형 객체를 만들 수 있게 되었다!

내용 중 dep, depsMap, targetMap을 추가하는 부분에서 effect를 관리하는 방식이 살짝 복잡해졌는데, 이해하기 쉽도록 그림으로 표현해보면 다음과 같다.

![](/images/030-01.png)

### 정리

Vue 반응성 시스템의 기초가 되는 track, trigger, dep, depsMap, targetMap과 같은 요소를 구현했다.

아직까진 상태가 변경될 때마다 직접 trigger를 호출해줘야 하기 때문에 반응성이라고는 찾아볼 수 없지만..
다음편에는 본격적으로 자동으로 effect가 수행되도록 시스템을 구현해 볼 것이다.
