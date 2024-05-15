---
publishedAt: 2024-05-15
thumbnail: https://res.cloudinary.com/dpefbi4ts/image/upload/v1715484201/thumb/046-thumb.png
thumbnailPlaceholder: WILL_BE_REPLACED
---

# Signals

:PublishDate{:date="publishedAt"}

:PostThumbnail{:src="thumbnail" :placeholder-data-uri="thumbnailPlaceholder"}

> 시그널이 무엇인 지 알아보고, 그 구현제 중 preact의 코드를 보면서 어떻게 구현했는 지 살펴본다.

## 시그널 이해하기

시그널을 이해하기 전에, 최근 프론트엔드 분야에서 널리 활용되고 있는 반응형 프로그래밍을 알아봐야 한다. 반응형 프로그래밍을 간단하게 표현하면 아래와 같이 표현할 수 있을 것이다.

_"상태를 변경하면 그것에 의존하는 것들이 자동으로 업데이트되는 선언적 프로그래밍 모델"_

복잡한 UI를 구성하고 변경하는 코드는 수많은 이벤트의 상호작용을 관리해야 하므로 코드의 복잡성이 올라갈 수밖에 없는데,
반응형 프로그래밍에서는 상태와 사이드 이펙트를 선언적으로 작성함으로써 UI를 간단하게 표현할 수 있도록 해준다.

간단한 예시를 한번 보자.

```tsx
let counter = 0
let double = counter * 2

const onClick = () => counter++

function render() {
  return <button onClick={onClick}>{double}</button>
}

// 버튼을 클릭하면 counter 값이 증가하고, 그에 따라 자동으로 파생된 값도 업데이트되고 렌더링도 수행
```

위 코드는 최근의 웹 프론트엔드 프레임워크를 사용할 때 작성하는 컴포넌트의 코드와 유사하다. 상태와 UI를 선언해두면, 프레임워크에서 이벤트의 전파와 그 구독 관리를 알아서 처리한다.
이를 위해 예전에는 `observer`, `stream` 같은 개념들을 활용했고 최근에는 `signal`이 많이 활용된다.

시그널을 구현한 프레임워크들의 사례를 보면서 시그널의 구성 요소를 살펴보자.
아래 코드는 간단한 카운터를 `preact`, `solid`, `preact`, `angular`로 작성한 예시다.

```tsx
// preact
const count = signal(0)

const double = computed(() => count.value * 2)

effect(() => {
  console.log(double.value)
})

function Counter() {
  const onClick = () => count.value++

  return <button onClick={onClick}>{count}</button>
}
```

```tsx
// soild
const [count, setCount] = createSignal(1)

const double = () => count() * 2

createEffect(() => {
  console.log(double())
})

function Counter() {
  const onClick = () => setCount((count) => count + 1)

  return <button onClick={onClick}>{count()}</button>
}
```

```tsx
// svelte
<script>
  let count = $state(0);

  const double = $derived(count * 2);

  $effect(() => {
    console.log(double);
  });

  const onClick = () => count++;
</script>

<button on:click={onClick}>
  {count}
</button>
```

```ts
// angular
@Component(
    template: `
        <button (click)="onClick()">{{counter()}}</button>
    `
)
export class CounterComponent {
    counter = signal(0);
    double = computed(() => this.counter() * 2);

    constructor() {
        effect(() => {
            console.log(this.double());
        });
    }

    onClick() {
        this.counter.set(this.counter() + 1);
    }
}
```

위 코드를 보면 공통적으로 보이는 요소들을 확인할 수 있다.

- root state
  - 시간에 따라 변경되는 상태값
- computed(derived) state
  - 다른 상태값에 의존하여 파생되는 값
- effect
  - 상태값의 변경에 반응해 수행되는 사이드 이펙트

## TC39 제안

최근 TC39에 시그널이 [제안](https://github.com/tc39/proposal-signals)되었고 `Stage 1`이 되었다.

제안자는 [Promise/A+](https://promisesaplus.com/)의 예시를 들면서, JS 생태계의 얼라인을 맞추기 위해 표준안을 제안한다고 얘기한다.
Promise도 처음에 open proposal 형태로 작성되었고, q, when.js, bluebird 같은 라이브러리를 사용하다가 ES2015에서 표준이 됐다.

## `@preact/signals` 살펴보기

preact의 시그널 소스코드는 [깃허브 저장소](https://github.com/preactjs/signals)에서 볼 수 있다.

먼저 signal과 computed가 어떻게 동작하는 지 살펴보자. signal은 생성자 함수로 작성돼있으며 defineProperty로 value 프로퍼티의 getter와 setter를 지정하는 것을 볼 수 있다.

```ts
Object.defineProperty(Signal.prototype, 'value', {
  get(this: Signal) {
    const node = addDependency(this)
    // ...
    return this._value
  },
  set(this: Signal, value) {
    if (value !== this._value) {
      // ...
      this._value = value
      // ...
    }
  },
})
```

getter에서 `addDependency`를 호출함으로써, 해당 `signal`을 현재 평가되고 있는 `computed`/`effect`의 의존성으로 추가하는 동작이 수행된다.

여기서 `computed`를 보자. `computed`도 signal을 상속받아서 구현됐기 때문에 기본 구조는 같다.
defineProperty를 호출하는 코드를 보면 값을 설정할 수 없어서 setter는 없고 getter만 있는 것을 볼 수 있다.

```ts
Object.defineProperty(Computed.prototype, 'value', {
  get(this: Computed) {
    // ...
    const node = addDependency(this)
    this._refresh()
    // ...
    return this._value
  },
})
```

getter를 보면 signal과 같이 addDependency를 호출하는 것을 보아 computed도 다른 computed/effect의 의존성이 될 수 있고,
그 후 refresh 메서드를 통해 의존성 들의 값을 확인해서 value를 업데이트한다.

```ts
Computed.prototype._refresh = function () {
  // ...

  // 기존 컨텍스트를 임시 저장
  const prevContext = evalContext

  prepareSources(this)

  // 현재 computed를 컨텍스트로 지정
  evalContext = this

  // 새로 computed 값을 계산
  const value = this._fn()

  // 계산한 값을 value로 갱신
  if (this._value !== value) {
    this._value = value
  }

  // 기존 컨텍스트를 복원
  evalContext = prevContext
  cleanupSources(this)

  return true
}
```

먼저 지금 평가되고 있는 computed를 evalContext로 지정해서 앞으로 값이 평가되는 signal과 현재 computed의 의존성 관계가 연결되도록 한다.
그리고 콜백함수 fn을 호출하여 새로운 값을 계산하고 갱신한다. 이 과정에서 signal의 값을 읽고 addDependency가 호출되어 의존성이 등록된다.
값을 갱신한 후에, 기존 컨텍스트를 복원하고 마무리한다.

다음으로 effect의 동작을 살펴보자.

effect도 computed와 약간 다르게 옵저버 패턴을 기반으로 동작한다.
effect의 콜백이 처음 수행될 때 signal의 값을 읽는 과정에서 addDependency가 호출되고, 그 내부에서 effect가 signal을 구독하도록 subscribe가 호출된다.

```ts
function addDependency(signal: Signal): Node | undefined {
  // ...
  if (evalContext._flags & TRACKING) {
    signal._subscribe(node)
  }
  // ...
}
```

subscribe가 수행되면 signal의 targets에 새로운 node가 추가되고, 해당 node와 effect가 상호참조로 연결된다.

구독이 완료된 후에 의존성의 값이 변경되면 변경된 signal의 targets를 순회하면서 notify를 호출하는 것을 확인할 수 있다.

```ts
Object.defineProperty(Signal.prototype, 'value', {
  // ...
  set(this: Signal, value) {
    if (value !== this._value) {
      // ...

      this._value = value

      // ...

      startBatch()
      try {
        for (let node = this._targets; node !== undefined; node = node._nextTarget) {
          node._target._notify()
        }
      } finally {
        endBatch()
      }
    }
  },
})
```

notify의 코드를 보면, batchedEffect에 새로 수행돼야 하는 effect를 저장하고 그 외 별다른 동작은 하지 않는 것을 확인할 수 있다.

```ts
Effect.prototype._notify = function () {
  if (!(this._flags & NOTIFIED)) {
    this._flags |= NOTIFIED
    this._nextBatchedEffect = batchedEffect
    batchedEffect = this
  }
}
```

실제로 effect의 콜백이 호출되는 곳은 startBatch, endBatch를 보면 알 수 있는데, 이렇게 함으로써 여러 signal의 변경 사항을 한 번의 업데이트로 묶어서 처리할 수 있다.

startBatch는 batchDepth를 1 증가시키기만 하고, endBatch는 batchDepth를 1 감소시킨 다음 batchDepth가 0인 경우에만 배치된 effect들을 전부 수행한다.
즉, 가장 바깥의 endBatch가 호출되어야 그 내부 effect가 수행된다.

```ts
function endBatch() {
  // ...
  while (effect !== undefined) {
    const next: Effect | undefined = effect._nextBatchedEffect
    effect._nextBatchedEffect = undefined

    // ...

    if (!(effect._flags & DISPOSED) && needsToRecompute(effect)) {
      effect._callback()
      // ...
    }
    effect = next
  }
  // ...
}
```

## 리액트에서 사용하기

signal을 리액트에서 사용할 수 있도록 [@preact/signals-react](https://github.com/preactjs/signals/tree/main/packages/react) 패키지를 제공하고 있다.
어떻게 같이 쓸 수 있는지 살펴보자.

리액트에서 사용할 수 있도록 여러 가지 방법을 제공하는데, 이 중 useSignal을 볼 것이다. useSignal은 다른 훅과 같이 사용하면 된다.

```tsx
import { useSignal } from '@preact/signals-react'

function App() {
  const count = useSignal(0)

  return <button onClick={() => count.value++}>count is {count.value}</button>
}
```

그리고 useSignal의 소스코드를 보면 단순히 signal을 메모해서 반환한다.

```ts
export function useSignal<T>(value: T): Signal<T> {
  return useMemo(() => signal<T>(value), Empty)
}
```

이렇게만 작성한다면 useSignal이 원하는 대로 동작하지 않는다. signal 값의 변화에 반응해서 컴포넌트가 리렌더링 되게 하려면
effect와 useSyncExternalStore를 활용해야 한다.

```ts
function createEffectStore(): EffectStore {
  let effectInstance!: Effect
  let endEffect: (() => void) | undefined
  let version = 0
  let onChangeNotifyReact: (() => void) | undefined

  // effect를 하나 만들고 unsubscribe 함수를 저장해둔다.
  const unsubscribe = effect(function (this: Effect) {
    effectInstance = this
  })

  // 만들어 둔 effect의 콜백을 지정한다. 해당 effect가 수행될 때 마다 리액트 컴포넌트가 리렌더링된다.
  effectInstance._callback = function () {
    version = version + 1
    if (onChangeNotifyReact) onChangeNotifyReact()
  }

  return {
    effect: effectInstance,
    subscribe(onStoreChange) {
      onChangeNotifyReact = onStoreChange

      return () => {
        version = version + 1
        onChangeNotifyReact = undefined
        unsubscribe()
      }
    },
    getSnapshot() {
      return version
    },
    start() {
      endEffect = effectInstance._start()
    },
    finish() {
      endEffect?.()
    },
  }
}

function useEffectStore() {
  const storeRef = useRef<EffectStore>()

  if (!storeRef.current) {
    storeRef.current = createEffectStore()
  }

  const store = storeRef.current
  useSyncExternalStore(store.subscribe, store.getSnapshot)
  store.start()

  return store
}

export function useSignal<T>(value: T) {
  const store = useEffectStore()
  const memoizedSignal = useMemo(() => signal<T>(value), [])

  try {
    // 값을 읽어서 의존성으로 등록
    memoizedSignal.value
    return memoizedSignal
  } finally {
    store.finish()
  }
}
```

store.start()와 store.finish() 사이에 signal의 value를 읽어서 effect의 의존성으로 등록하고,
effect의 콜백에서 onChangeNotifyReact를 호출해 리렌더링시킨다.

preact는 렌더링 최적화도 했는데, signal을 리액트 컴포넌트로 만들어서 signal을 사용한 곳만 리렌더링 시키는 방법이다.
아래 코드를 보자.

```ts
// Signal의 값을 렌더링하는 래퍼 컴포넌트
function SignalValue({ data }: { data: Signal }) {
  const store = useEffectStore()
  try {
    // 여기서 data.value를 읽으면서 store.effect의 의존성으로 등록된다
    return data.value
  } finally {
    store.finish()
  }
}

// Signal을 SignalValue 컴포넌트 타입으로 만들어서, Signal을 JSX에 바로 사용할 수 있게 만든다
Object.defineProperties(Signal.prototype, {
  $$typeof: { configurable: true, value: ReactElemType },
  type: { configurable: true, value: SignalValue },
  props: {
    configurable: true,
    get() {
      return { data: this }
    },
  },
  ref: { configurable: true, value: null },
})

export function useSignal<T>(value: T) {
  return useMemo(() => signal<T>(value), [])
}
```

useSignal 훅은 처음 상태로 되돌아가고 SignalValue라는 래퍼 컴포넌트가 추가되어 그 역할을 대신하게 되었다.
그리고 Signal의 prototype을 수정해서 리액트에서 리액트 요소로 인식하게 한다.

그래서 렌더링 코드에서 signal을 JSX에서 바로 사용하면 리액트 컴포넌트로 렌더링되고, signal 값이 변하더라도 useSignal을 호출한 컴포넌트는 리렌더링 되지 않는다.

```tsx
import { useSignal } from '@preact/signals-react'

function App() {
  const count = useSignal(0)

  // {count.value} -> {count}
  return <button onClick={() => count.value++}>count is {count}</button>
}
```

## 참고

- https://github.com/preactjs/signals
- https://github.com/tc39/proposal-signals
- https://ui.toast.com/posts/ko_20220331
- https://eisenbergeffect.medium.com/a-tc39-proposal-for-signals-f0bedd37a335
- https://junghan92.medium.com/%EB%B2%88%EC%97%AD-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-signal%EC%9D%98-%EC%A7%84%ED%99%94-4bd6a991d2f
