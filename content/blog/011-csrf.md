---
publishedAt: 2020-12-12
thumbnail: /images/011-thumb.png
---

# CSRF

:PublishDate{date="2020-12-12"}

## csrf란?

> Cross-site request forgery, 사이트 간 요청 위조

사이트 간 요청 위조는 웹사이트 취약점 공격의 하나로, 사용자가 자신의 의지와는 무관하게 공격자가 의도한 행위를 특정 웹사이트에 요청하게 하는 공격을 말한다.

## csrf의 예시

### 1. 일반적인 csrf 공격

사용자가 로그인된 상태인 것을 이용하여 사용자가 대신 어떤 행동을 하도록 공격하는 방식

- img 태그를 이용한 방법
  사용자는 아래와 같은 html이 포함된 악의적인 사이트/이메일을 열람할 시 자신도 모르게 요청을 보내게 된다

  ```html
  <img src="https://mysite.com/user?action=set-pw&pw=1234" width="0" height="0" />
  ```

- form 을 이용한 방법
  사용자는 아래와 같은 form이 포함된 악의적인 사이트를 열람할 시 자동으로 페이스북에 광고성 글을 작성하게 된다

  ```html
  <form action="http://facebook.com/api/content" method="post">
    <input type="hidden" name="body" value="여기 가입하면 돈 10만원 드립니다." />
    <input type="submit" value="Click Me" />
  </form>
  <script>
    document.forms[0].submit()
  </script>
  ```

### 2. 로그인 csrf 공격

사용자를 해커의 계정으로 몰래 로그인시키는 방식. 그 사실을 모르는 사용자가 남긴 활동기록들은 해커의 계정에 저장된다

- form을 이용한 방법
  사용자는 아래와 같은 form이 포함된 악의적인 사이트를 열람할 시 자동으로 해커 계정으로 로그인하는 요청을 보내게 된다

  ```html
  <form method="POST" action="http://honest.site/login">
    <input type="text" name="user" value="h4ck3r" />
    <input type="password" name="pass" value="passw0rd" />
  </form>
  <script>
    document.forms[0].submit()
  </script>
  ```

## csrf 방어

csrf는 다른 사이트에서 요청을 보내는 공격이기 때문에 다른 사이트에서 오는 요청을 막거나, 올바른 사이트에서 보내는지 확인하는 수단이 필요하다

### 1. CORS 적용

CORS를 이용해서 사이트 간 요청을 불가능하게 만든다. <br>
만약에 CORS를 허용한다면, 사이드 이펙트가 없을 것으로 예상되는 OPTIONS, HEAD, GET 메소드에 대해서만 허용하는 것이 좋다.<br>
하지만 CORS는 `<script></script>` 사이에서 생성된 XMLHttpRequest 요청에만 해당되기 때문에 **위에서 예시로 든 공격을 막을 수 없다.**

### 2. referer 헤더 설정

요청을 한 페이지의 정보가 담긴 Referer 헤더 속성을 검증하여 차단하는 방법.<br>
같은 도메인 상에서 요청이 들어오지 않는다면 차단하도록 하는 방법. 일반적으로 이 방법만으로도 대부분 방어가 가능하다고 한다.

### 3. Synchronizer Token Pattern (csrf token)

랜덤한 값을 사용자의 세션에 저장하여 사용자의 모든 요청(Request)에 대하여 서버 쪽에서 검증하는 방법<br>
요청을 받을 때마다 세션에 저장된 토큰값과 요청 파라미터에서 전달되는 토큰값이 같은지 검증한다

서버 사이드 렌더링의 경우 아래와 같이 토큰값을 전달한다 (예시는 handlebar)

```html
<input type="hidden" name="_csrf" value="{{csrfToken}}" />
```

ajax를 사용하는 경우 meta태그의 값으로 전달할 수도 있다

```html
<meta name="csrf-token" content="{{csrfToken}}" />

...

<script>
  // Read the CSRF token from the <meta> tag
  var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

  // Make a request using the Fetch API
  fetch('/process', {
    credentials: 'same-origin', // <-- includes cookies in the request
    headers: {
      'CSRF-Token': token, // <-- is the csrf token as a header
    },
    method: 'POST',
    body: {
      favoriteColor: 'blue',
    },
  })
</script>
```

SPA 앱의 경우는 다음과 같이 전달할 수 있다 (예시는 angular)

```javascript
app.all('*', function (req, res) {
  res.cookie('XSRF-TOKEN', getCsrfToken())
  res.render('index')
})
```

### 4. Double Submit Cookie

Security Token 검증의 한 종류로 세션을 사용할 수 없는 환경에서 사용할 수 있는 방법. 웹브라우저의 Same Origin 정책으로 인해 자바스크립트에서 타 도메인의 쿠키 값을 확인/수정하지 못한다는 것을 이용한 방어 기법입니다.<br>
스크립트 단에서 요청 시 난수 값을 생성하여 쿠키에 저장하고 동일한 난수 값을 요청 파라미터(혹은 헤더)에도 저장하여 서버로 전송합니다. 서버단에서 쿠키의 토큰값과 파라미터의 토큰값이 일치하는지만 검사하면 됩니다.<br>
서버에 따로 토큰 값을 저장할 필요가 없어 세션을 이용한 검증보다 개발 공수가 적은 편입니다.<br>
피싱 사이트에서는 도메인이 달라 쿠키에 값을 저장하지 못하므로(Same Origin 정책) 가능한 방어 기법입니다.<br>

- 쿠키 이름이 `__Host-` 로 시작하는 것이 좋다 (보안상 추가적인 이점)

## 결론

api 서버가 분리된 리액트 환경에서는 csrf를 어떻게 방어할 수 있을까?

1. 쿠키가 없는 상태의 로그인 csrf 공격은 reCaptcha로 방어
2. 그 외의 일반 csrf는
   - Custom Header, Origin/Referer Header 체크
   - Synchronizer Token Pattern 적용

이렇게 생각했지만, api 서버에서 자바스크립트 파일을 보내주는 것이 아니라서 Synchronizer Token Pattern을 적용하기가 쉽지 않다..

- 로그인하면 csrf token을 보내주고 메모리에 저장해뒀다가 api 요청 시 같이 보내는 방법
  - 새로고침하면 토큰이 없어진다
- 앱이 처음 로딩될 때 csrf token을 요청해서 메모리에 저장하는 방법
  - api가 노출된다
- 로그인하면 쿠키로 csrf token을 보내주는 방법
  - 쿠키에서 httpOnly를 설정하면 자바스크립트로 쿠키값에 접근할 수 없다

위와 같은 문제점으로 httpOnly를 설정하지 않은 쿠키를 사용하기로 했다. 어떻게 하면 더 안전하게 할 수 있을까? 🤔

## 참조

- [CORS](https://homoefficio.github.io/2015/07/21/Cross-Origin-Resource-Sharing/)
- [understanding csrf](https://github.com/pillarjs/understanding-csrf)
- [cookie prefix](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#cookie-with-__host-prefix)
- [login form csrf](https://www.netsparker.com/web-vulnerability-scanner/vulnerabilities/cross-site-request-forgery-in-login-form/)
- [velog@dnjscksdn98](https://velog.io/@dnjscksdn98/Network-CSRF%EB%9E%80)
  <br>
