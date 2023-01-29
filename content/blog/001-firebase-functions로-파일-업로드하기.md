---
publishedAt: 2020-03-23
---

# firebase functions로 파일 업로드하기

:PublishDate{date="2020-03-23"}

## 파일을 읽을 수 없다?

이미지파일을 브라우저에서 서버로 전송하기 위해서는 폼에 `enctype="multipart/form-data"` 를 추가해서 인코딩 타입을 multipart로 해줘야 한다. 그리고 이러한 `multipart/form-data`를 서버에서 다루기 위해 node.js 에서는 `multer`라는 미들웨어를 주로 사용한다고 한다.

그래서 처음엔 `multer`로 처리를 시도했다. 하지만 계속 데이터 값이 `undefined`로 나오면서 제대로 되질 않았고, 결국 브라우저에서 이미지만 `storage`에 업로드하고, 나머지 폼 데이터를 `application/x-www-form-urlencoded` 인코딩으로 보내는 식으로 구현했다.

## 문제의 원인

그리고 며칠 뒤 비슷한 작업을 하다가 한 [stackoverflow 질문](https://stackoverflow.com/questions/47242340/how-to-perform-an-http-file-upload-using-express-on-cloud-functions-for-firebase)에서 문제의 원인을 알 수 있었다.
`cloud functions`에서는 원래 요청의 `body`를 `req.body`가 아니라 `req.rawBody`에 저장하는 것이었다. 그래서 `multer`로는 처리할 수가 없었다.

## 문제 해결

`multer`와 비슷한 역할을 하는 미들웨어인 `busBoy`를 사용하여 `req.rawBody`를 넘겨주니 정상적으로 파일을 읽을 수 있었다.

```javascript
const fileParser = (req, res, next) => {
  const busboy = new Busboy({ headers: req.headers })

  // 데이터를 담을 placeholder
  var files = {}
  req.body = {}

  // 파일 처리
  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    console.log(`File [${fieldname}] filename: ${filename}, encoding: ${encoding}, mimetype: ${mimetype}`)
    files[filename] = {
      filename,
      encoding,
      mimetype,
    }

    file.on('data', (data) => {
      console.log('File [' + fieldname + '] got ' + data.length + ' bytes')
      files[filename].buffer = Buffer.from(data)
    })
  })

  // 필드 처리
  busboy.on('field', (fieldname, value) => {
    req.body[fieldname] = value
  })

  // This callback will be invoked after all uploaded files are saved.
  busboy.on('finish', () => {
    req.files = files
    next()
  })

  // The raw bytes of the upload will be in req.rawBody.  Send it to busboy, and get
  // a callback when it's finished.
  busboy.end(req.rawBody)
}
```
