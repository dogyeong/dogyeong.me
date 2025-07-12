---
publishedAt: 2025-07-12
thumbnail: https://res.cloudinary.com/dpefbi4ts/image/upload/v1752328558/thumb/050-thumb.png
thumbnailPlaceholder: WILL_BE_REPLACED
---

# stacking workflow

:PublishDate{:date="publishedAt"}

:PostThumbnail{:src="thumbnail" :placeholder-data-uri="thumbnailPlaceholder"}

여러 개발자가 협업하는 프로젝트에서 코드 리뷰를 잘 하는 것은 어려운 부분중에 하나다.

리뷰어 입장에서 변경사항을 이해하여 의미있는 피드백을 남기고, 리뷰를 받는 개발자는 더 빠른 진행을 위해 PR을 작게 만드는 것이 좋다.
작게 PR을 만들어서 쌓는 것을 stacked PR이라고 하고, 이렇게 개발하는 방식을 [stacking workflow](https://www.stacking.dev/)라고 부르기도 한다.

stacked PR을 만들 때 불편한 점은 trunk 브랜치에 변경사항이 생길 때마다 PR을 다시 rebase해야 한다는 점이다.

git으로 브랜치의 일부를 rebase할 때는 `git rebase --onto <upstream> <from> <to>` 명령어를 사용하면 된다.
이 명령어는 `<from>`부터 `<to>`까지의 커밋을 `<upstream>` 브랜치로 옮기는 역할을 한다.

여러개의 쌓인 브랜치를 한꺼번에 rebase할 때는 `--update-refs` 옵션을 사용하면 된다.
예를 들어 `git rebase master --update-refs` 명령어를 사용하면 현재 브랜치부터 master 브랜치까지의 모든 브랜치를 master 브랜치로 옮긴다.

이렇게 직접 stacked PR을 관리해도 되지만, [graphite](https://graphite.dev/) 같은 도구를 사용하면 stacked PR을 더 쉽게 관리할 수 있다.
