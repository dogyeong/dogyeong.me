---
publishedAt: 2021-01-18
thumbnail: /images/014-thumb.png
thumbnailPlaceholder: data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMCA1Ij48ZmlsdGVyIGlkPSJwcmVmaXhfX2EiPjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjE2Ii8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzRlNjEzMCIvPjxnIGZpbGwtb3BhY2l0eT0iLjUiIGZpbHRlcj0idXJsKCNwcmVmaXhfX2EpIj48cGF0aCBmaWxsPSIjMTcwMDA0IiBkPSJtNS43IDIuNSAxOS44LTguMi0zMi4xIDI1LjNMLTQtMTUuNXoiLz48cGF0aCBmaWxsPSIjMGEwNDAwIiBkPSJtLjUgNC41LTctMjBoMjF6Ii8+PHBhdGggZmlsbD0iIzdiNWE0YSIgZD0iTTcuMi42IDggMSA1LjggNC40IDUgNHoiLz48cGF0aCBmaWxsPSIjMGQwYzA5IiBkPSJtOS41IDMuNSA2IDktMjItNnoiLz48cGF0aCBmaWxsPSIjNDY0NjJkIiBkPSJtOC41IDEuNy43LjYtMi43IDMtLjctLjZ6Ii8+PHBhdGggZmlsbD0iIzc5NjczNCIgZD0iTTUuNSAxLjV2LThsMjAtOXoiLz48cGF0aCBmaWxsPSIjNGM1OTQ2IiBkPSJtMi41IDMuNSAxIDE0IDEwIDJ6Ii8+PHBhdGggZmlsbD0iIzEyMDYwNyIgZD0ibS04LjYtMy41IDE5LjkgMTYuMkwyMS42LTMuOGwtMzMuNSAyNC4zeiIvPjwvZz48L3N2Zz4=
---

# CORS

:PublishDate{:date="publishedAt"}

:PostThumbnail{:src="thumbnail"}

동일 출처 정책은 악의적인 사이트에서 다른 사이트의 리소스에 접근하는 것을 막아주지만, 정상적인 접근까지 모두 차단해버린다. 모던 웹 어플리케이션에서는 다른 출처에 공개돼 있는 데이터를 활용하는 경우가 굉장히 많은데, SOP는 이런 경우에도 모든 요청을 차단한다.

개발자들은 이런 제한을 피해가기 위해 [JSONP](https://stackoverflow.com/questions/2067472/what-is-jsonp-and-why-was-it-created)같은 방법을 사용하기도 했지만, 곧 **CORS**가 표준적인 방법으로 등장했다.

Cross-Origin Resource Sharing(CORS)이란, 위의 동일 출처 정책으로 접근이 차단되는 리소스들을 접근할 수 있게 해주는 방법이다. 서버가 브라우저에게 **"다른 출처에서 접근 가능하다!"** 라고 말해주는 것이다.

## CORS 과정

브라우저가 요청 메세지의 `Origin` 헤더와 응답 메세지의 `Access-Control-Allow-Origin` 헤더를 비교해서 동일 출처 정책을 위반하는지를 판단한다. 단계별로 설명하면 다음과 같다.

1. 클라이언트 측에서 다른 출처로 요청을 보낼 때, 브라우저가 요청 메세지에 `Origin` 헤더를 추가한다. `Origin` 헤더는 현재 사이트의 프로토콜+호스트+포트를 나타낸다.
2. 서버측에서 요청 메세지를 받는다. 요청한 출처에서 리소스에 접근을 허락하기 위해서 `Access-Control-Allow-Origin` 응답 헤더에 허용할 Origin을 명시한다. 전부 허용하는 경우에는 `*`로 표시할 수 있다.
3. 브라우저가 서버가 보낸 응답 메세지의 `Access-Control-Allow-Origin` 헤더를 보고 적절한 지 판단한 다음, 응답 데이터를 클라이언트 사이트로 전달한다.

## CORS 요청의 종류

사실 CORS에서는 요청을 여러 종류로 나눠서 처리한다. 먼저 크게 simple request와 preflight request로 나눌 수 있다.

### Simple request

위의 CORS 과정에서 설명한 일반적인 요청이다.

### Preflighted request

이름에서 알 수 있듯이 간단한 요청이 아닌 경우에는 사전에 추가적으로 요청을 보내야 한다. 이러한 사전 요청을 Preflight request라고 한다.

그럼 먼저 어떤 요청들이 Preflight request가 필요한지 알아보자. 아래에 있는 경우 중 하나라도 일치하면 Preflight request가 필요하다.

- `GET`, `POST`, `HEAD`가 아닌 다른 메소드를 사용하는 요청
- `Accept`, `Accept-Language`, `Content-Language`외의 다른 헤더를 포함하는 요청
- `Content-Type` 헤더가 `application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain` 중 하나가 아닌 경우

Preflight request가 필요하다고 판단되면 브라우저는 본 요청을 보내기 전에 Preflight request를 먼저 수행하는데, 이 때 `OPTIONS` 메소드를 사용한다.

```markdown
OPTIONS /resource/foo
Access-Control-Request-Method: DELETE
Access-Control-Request-Headers: origin, x-requested-with
Origin: https://foo.bar.org
```

위와 같이 `OPTIONS` 요청을 보내게 되고, `Access-Control-Request-Method`에는 본 요청에 사용될 메소드, `Access-Control-Request-Headers`에는 본 요청에 사용될 헤더들을 담아서 보낸다.

서버에서는 Preflight request의 응답으로 어떤 Origin, Method들이 허용되는지 알려줘야 한다.

```markdown
HTTP/1.1 204 No Content
Connection: keep-alive
Access-Control-Allow-Origin: https://foo.bar.org
Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE
Access-Control-Max-Age: 86400
```

위와 같은 형태의 응답 메세지를 전달하게 되고, 사용된 헤더의 의미는 다음과 같다.

- `Access-Control-Allow-Origin`: CORS를 허용할 Origin을 나타낸다
- `Access-Control-Allow-Methods`: 본 요청에 어떤 메소드가 허용되는지를 나타낸다
- `Access-Control-Max-Age`: Preflight request의 응답이 얼마나 캐싱될 지를 나타낸다. 응답을 캐싱해두면 매번 Preflight request를 보낼 필요가 없다.

### Credentialed requests

일반적으로 CORS 요청에서는 개인정보 보호를 위해 쿠키를 전송하지 않는다. 하지만 요청/응답에서 추가적인 헤더를 설정해주면 쿠키를 주고받을 수 있다.

먼저 클라이언트 측에서는 쿠키를 같이 전송하도록 설정해야 한다. Fetch API를 사용할 때에는 아래와 같이 `credentials: 'include'`를 옵션에 추가하면 된다.

```javascript
fetch('https://example.com', {
  mode: 'cors',
  credentials: 'include',
})
```

서버에서는 아래와 같이 응답 헤더에 `Access-Control-Allow-Credentials: true`를 추가해야 한다. 그리고 `Access-Control-Allow-Origin` 헤더를 `*`가 아닌 직접 Origin을 명시해야 한다.

```markdown
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Credentials: true
```

## Access-Control-Expose-Headers

아직 등장하지 않은 CORS 관련 헤더가 하나 있는데, `Access-Control-Expose-Headers` 헤더다.

`Access-Control-Expose-Headers` 헤더는 브라우저가 접근할 수 있는 헤더를 명시한다. 응답 메세지의 헤더는 [XMLHttpRequest.getResponseHeader()](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getResponseHeader)로 접근할 수 가능하다.

예를 들어 `Access-Control-Expose-Headers: X-My-Custom-Header, X-Another-Custom-Header`와 같이 설정돼 있으면, 자바스크립트로 `X-My-Custom-Header`, `X-Another-Custom-Header` 2개의 헤더를 읽을 수 있다.

기본적으로 아래의 7가지 헤더는 접근 가능하다.

- Cache-Control
- Content-Language
- Content-Length
- Content-Type
- Expires
- Last-Modified
- Pragma

## 참조

- [web.dev - CORS](https://web.dev/cross-origin-resource-sharing/)
- [MDN - CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [MDN - 사전 요청](https://developer.mozilla.org/ko/docs/Glossary/Preflight_request)
- [W3C - CORS](https://www.w3.org/TR/2020/SPSD-cors-20200602/)
- [MDN - Access-Control-Expose-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers)
