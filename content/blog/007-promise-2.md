---
publishedAt: 2020-04-26
thumbnail: https://res.cloudinary.com/dpefbi4ts/image/upload/v1679722820/thumb/006-thumb.png
thumbnailPlaceholder: WILL_BE_REPLACED
---

# Promise(2) - 프로미스 활용하기

:PublishDate{:date="publishedAt"}

:PostThumbnail{:src="thumbnail" :placeholder-data-uri="thumbnailPlaceholder"}

## Promise.all

- 여러 개의 프로미스를 병렬로 처리할 때 사용한다
- 하나라도 rejected되면 Promise.all이 반환하는 프로미스도 rejected된다

```javascript
// Promise.all을 사용하지 않고 병렬로 처리하기
requestData1().then((data) => console.log(data))
requestdata2().then((data) => console.log(data))
```

```javascript
// Promise.all을 사용하여 병렬로 처리하기
Promise.all([requestData1(), requestData2()]).then([data1, data2] => {
	console.log(data1, data2);
});
```

- 연속된 then 메소드에서 앞의 then 메소드에서 사용한 변수를 참조하고 싶을 때 사용할 수도 있다

```javascript
requestData1()
  .then((data1) => {
    return requestData2(data1)
  })
  .then((data2) => {
    // 여기서 data1을 참조하고 싶다!!!
    // data1을 참조하면 에러 발생
  })
```

```javascript
requestData1().then((data1) => {
  return requestData2(data1).then((data2) => {
    // 이렇게 프로미스를 중첩하면 가능하지만, 코드가 복잡해진다
  })
})
```

```javascript
requestData1()
	.then(data1 => {
		return Promise.all([data1, requestData2(data1)]);
	})
	.then([data1, data2] => {
		// Promise.all을 사용하면 프로미스를 중첩하지 않고도 해결 가능
	});
```

## Promise.race

- 여러 개의 프로미스 중에서 가장 빨리 처리된 프로미스를 반환한다

```javascript
// Promise.race를 활용한 시간제한
// 3초안에 데이터를 받지 못하면 catch 호출

Promise.race([
	requestData(),
	new Promise((_, reject) => setTimeout(() => reject("TIME OVER"), 3000)
])
.then(data => console.log(data))
.catch(err => console.log(err))
```

## 프로미스를 활용한 데이터 캐싱

- settled 상태가 되면 그 상태를 유지하는 프로미스의 성질을 이용해서 데이터를 캐싱할 수 있다

```javascript
// 처음 getData 함수를 호출할 때만 requestData가 호출된다

let cachedPromise

function getData() {
  cachedPromise = cachedPromise || requestData()
  return cachedPromsie
}

getData().then((data) => console.log(data))
getData().then((data) => console.log(data))
```
