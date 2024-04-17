---
publishedAt: 2024-04-13
thumbnail: https://res.cloudinary.com/dpefbi4ts/image/upload/v1712978326/thumb/045-thumb.png
thumbnailPlaceholder: WILL_BE_REPLACED
---

# Datadog에 소스맵 적용하기

:PublishDate{:date="publishedAt"}

:PostThumbnail{:src="thumbnail" :placeholder-data-uri="thumbnailPlaceholder"}

제품을 개발할 때 에러나 로그를 모니터링하기 위한 도구는 거의 필수적이다. 이러한 도구를 사용하지 않는다면 서비스의 상태를 트래킹하거나 에러를 디버깅하는 것은 매우 힘들다.

방법으로는 [Datadog](https://www.datadoghq.com/ko/dg/monitor/personalized-demo-request)이나 [Sentry](https://sentry.io/welcome)같은 SaaS 제품을 많이 사용하고,
이 서비스들은 모니터링뿐 만 아니라 테스트 자동화, 커버리지 측정 등 다양한 기능들을 제공하고 있다.

모니터링 서비스에서 에러를 디버깅할 때 에러의 스택 트레이스를 볼 수 있는데, 유저의 브라우저에서 실행되는 자바스크립트가 minified된 형태라면 읽기 어려운 점이 있다.
이럴 때 [소스맵](https://web.dev/articles/source-maps)을 연결하면 원래 작성한 코드를 볼 수 있기 때문에 편하다.

이 글에서는 Datadog으로 소스맵을 업로드하는 방법에 대해 설명한다.

## 소스맵 생성 설정

앱이 빌드될 때 소스맵 파일을 생성하도록 옵션을 추가한다.

### 1. `tsconfig.json`

`sourceMap: true`를 추가

```json
{
  "compilerOptions": {
    ...
    "sourceMap": true
  },
  ...
}
```

### 2. `next.config.js`

next.js 앱이라면, `productionBrowserSourceMaps: true`도 추가한다.

```js
const nextConfig = {
  ...
  productionBrowserSourceMaps: true,
}

module.exports = nextConfig
```

## 소스맵 업로드

### 1. 소스맵 버전 지정

배포를 여러 번 하게 되면 유저들은 서로 다른 배포의 소스코드를 사용할 수 있다. 그렇기 때문에 각각의 소스코드와 로그를 정확하게 매칭하기 위해 버저닝이 필요하다.

나는 배포할 때의 배포 시간을 배포 버전으로 지정해서 사용했다. 배포할 때 젠킨스에서 도커 [build arguments](https://docs.docker.com/build/guide/build-args/)로 넘겨줬다.

```shell
sh "sudo docker build . --build-arg DATADOG_RELEASE_VERSION=\$(date -u +\"%Y%m%d.%H.%M.%S\")"
```

### 2. 소스맵 업로드 스크립트

생성한 소스맵을 Datadog으로 업로드하는 과정이 필요하다. [`@datadog/datadog-ci`](https://www.npmjs.com/package/@datadog/datadog-ci) 패키지를 사용해 업로드한다.

나는 `package.json`에 스크립트로 작성했고, 스크립트에는 업로드할 디렉토리, (데이터독에서 등록한)서비스 명 서비스, 서비스 주소의 prefix, 배포 버전을 명시해야 한다.

```json
// package.json
{
  "scripts": {
    "upload:sourcemap:datadog": "yarn dlx @datadog/datadog-ci sourcemaps upload .next/static --service=my-service --minified-path-prefix=https://example.com/_next/static"
  }
}
```

### 3. 배포 과정에 소스맵 업로드 추가

이제 앞에서 준비한 것들로 배포할 때마다 소스맵을 업로드하도록 해야 한다.

나는 `Dockerfile`에 내용을 추가했다.

```docker
# 젠킨스에서 전달받은 Argument. 기본값으로 1을 지정
ARG DATADOG_RELEASE_VERSION=1

# build할 때 NEXT_PUBLIC_DATADOG_RELEASE_VERSION 환경변수로 전달
RUN NEXT_PUBLIC_DATADOG_RELEASE_VERSION=${DATADOG_RELEASE_VERSION} yarn workspace @my/app build

# 소스맵 업로드 할 때도 배포 버전을 지정
RUN yarn workspace @my/app upload:sourcemap:datadog --release-version=${DATADOG_RELEASE_VERSION}
```

### 4. 로그에 배포 버전 지정

앞에서 지정한 `NEXT_PUBLIC_DATADOG_RELEASE_VERSION` 환경변수를 datadogLog logger 초기화할 때 버전으로 ㄴ지정한다.

```ts
const releaseVersion = process.env.NEXT_PUBLIC_DATADOG_RELEASE_VERSION

datadogLogs.init({
  ...
  version: releaseVersion,
})
```

## 소스맵 삭제

소스맵은 실제 서비스에서 노출되어서 좋을 게 없다. 그래서 Datadog에 업로드한 후에 삭제하는 과정을 추가한다.

나는 `package.json`에 `.map` 파일을 삭제하는 스크립트를 추가했다. 삭제는 [`rimraf`](https://www.npmjs.com/package/rimraf) 패키지를 사용했다.

```json
"scripts": {
	"delete:sourcemap": "yarn dlx rimraf .next/**/*.map"
}
```

## References

- [Upload JavaScript Source Maps](https://docs.datadoghq.com/ko/real_user_monitoring/guide/upload-javascript-source-maps/?tab=webpackjs)
