---
publishedAt: 2020-03-27
---

# \[IT인프라\] 02. OSI 7 Layer와 네트워크의 개념

> 본 글은 [강의영상](https://www.youtube.com/watch?v=laBzCcF1414)을 보고 정리한 글입니다.

### 네트워크 & OSI 7 Layer

- 네트워크 = 관계
- 네트워킹 = 상호작용(대화,통신)
- 두 개의 endpoint가 상호작용하기 위해서 여러 조건이 필요하다. 그 조건들을 layer형태로 정리할 수 있다
- OSI 7 Layer = 성공적인 상호작용을 위한 7가지 전제조건
  ![https://shlee0882.tistory.com/110](https://images.velog.io/images/shroad1802/post/678e5b5a-e748-4cd1-b85c-17f36a2acf19/image.png)[이미지 출처 : https://shlee0882.tistory.com/110](https://shlee0882.tistory.com/110)

---

### 컴퓨터에 구현된 OSI 7 Layer

- L7 : http
- L6 : ..
- L5 : SSL
- L4 : TCP, UDP
- L3 : IP, ARP
- L2 : Ethernet
- L1 : ..
  ![그림으로 정리](https://images.velog.io/images/shroad1802/post/4ec628d0-eb26-41f2-b824-4350afa4b7de/%E1%84%8C%E1%85%A5%E1%86%BC%E1%84%85%E1%85%B52.png)

---

### 스위치

- 스위치 = 통신할 때 목적지로 찾아갈 수 있게 해준다
- L3 스위치(라우터) = ip주소를 보고 목적지를 찾아갈 수 있게 해준다
