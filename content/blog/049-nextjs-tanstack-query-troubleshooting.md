---
publishedAt: 2025-02-09
thumbnail: https://res.cloudinary.com/dpefbi4ts/image/upload/v1739069874/thumb/049-thumb.png
thumbnailPlaceholder: WILL_BE_REPLACED
---

# Next.js + TanStack Query 메모리 이슈 트러블슈팅

:PublishDate{:date="publishedAt"}

:PostThumbnail{:src="thumbnail" :placeholder-data-uri="thumbnailPlaceholder"}

## 배경

Next.js 앱을 개발하면서 메모리 누수를 해결했던 과정을 기록한다.

어느 날 서비스가 잠깐 중단되는 이슈가 발생했고, Next.js 서버의 메모리 사용량이 과도하게 늘어나면서 `ProcessOutOfMemory` 로그를 남기면서 죽어버리는 것이 원인으로 지목됐다.

메모리 사용 그래프를 보니 특정 날짜부터 메모리 누수가 생긴 것으로 보였고 그 날 새로운 페이지가 추가됐기 때문에 해당 페이지를 원인으로 추정했다.
![](/images/049-01.png)
위와 같이 계단식 그래프가 보인다면 메모리 누수가 생겼다고 볼 수 있다.

## 문제의 원인과 해결

로컬에서 빌드한 후, `--inspect` 플래그와 함께 실행하면 크롬 브라우저로 [Node.js 런타임을 디버깅](https://nodejs.org/ko/learn/getting-started/debugging)할 수 있다.
이 방법으로 문제가 되는 페이지를 렌더링했을 때의 메모리 변화를 관찰할 수 있다.
![](/images/049-02.png)
메모리 할당 타임라인을 관찰하던 중, 위 이미지와 같이 `Query`, `QueryCache`가 남아있는 것을 볼 수 있었다.

쿼리 캐시는 timeout에서 참조하고 있어 GC되지 않는 것으로 보였으며, 관련 [소스코드](https://github.com/TanStack/query/blob/main/packages/query-core/src/removable.ts#L14)를 확인해보니 `cacheTime`(v5는 `gcTime`)에 따라 캐시를 제거하는 타이머를 설정하는 것을 알 수 있었다.

```ts
// https://github.com/TanStack/query/blob/main/packages/query-core/src/removable.ts#L14
// cacheTime이 0보다 크고 Infinity보다 작으면, 쿼리를 캐시에서 제거하는 타이머를 설정한다.
if (isValidTimeout(this.cacheTime)) {
  this.#gcTimeout = setTimeout(() => {
    this.optionalRemove()
  }, this.cacheTime)
}
```

관련해서 검색해 보니 서버 사이드에서는 `cacheTime` 때문에 [메모리 사용량이 늘어나는 이슈](https://github.com/TanStack/query/discussions/3284)를 찾을 수 있었다.

그래서 `cacheTime`을 잘못 지정하고 있음을 알 수 있었고, 해당 부분을 수정해서 문제를 해결했다.

## 마무리

서버에서는 `QueryClient`를 요청마다 새롭게 생성해서 사용해야 한다는 점은 알고 있었다.
하지만 쿼리 캐시의 GC 관리에 주의해야 한다는 점은 인지하지 못했는데, 캐시 옵션에 주의를 기울이지 않으면 이처럼 메모리 누수를 일으킬 수 있다.
