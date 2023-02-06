---
publishedAt: 2021-12-26
---

# Building an awesome image loading experience

:PublishDate{date="2021-12-26"}

> Kent C. Dodds의 [Building an awesome image loading experience](https://kentcdodds.com/blog/building-an-awesome-image-loading-experience)를 번역한 글입니다.

<br>

제 사이트에서 다양한 페이지(특히 블로그 포스트)들을 열 때,이미지가 흐릿하게 시작되고 로드되면 전체 이미지가 페이드인되는 것을 보셨을 겁니다. 아래는 이러한 경험을 보여주는 영상입니다.

[https://res.cloudinary.com/kentcdodds-com/video/upload/kentcdodds.com/content/blog/building-an-awesome-image-loading-experience/blurred-image-load_zzqqnt.mp4](https://res.cloudinary.com/kentcdodds-com/video/upload/kentcdodds.com/content/blog/building-an-awesome-image-loading-experience/blurred-image-load_zzqqnt.mp4)

이러한 작업을 하기 위해 제가 해야 했던 것들을 설명하고, 제가 하는 방식과 최고의 이미지 앱([unsplash.com](http://unsplash.com/))이 하는 방식을 비교해 보겠습니다.

<br>

## **Layout shift**

먼저, 이미지가 갑자기 등장해서 리플로우/레이아웃 시프트를 일으키지 않는다는 것을 알 수 있을겁니다. 사실, 저는 ["Cumulative Layout Shift"](https://web.dev/cls/)웹 바이탈 점수에서 [100점](https://metronome.sh/shared/ckucijpqg1812821isszte84muv)을 받았답니다 😊.

저는 [tailwind의 aspect-ratio 플러그인](https://github.com/tailwindlabs/tailwindcss-aspect-ratio)을 이용해 이미지가 들어가는 영역의 사이즈를 지정해줌으로써 이렇게 할 수 있었습니다(제 사이트는 tailwind를 사용하고 있습니다 😅).

TL;DR:

```html
<div class="aspect-h-4 aspect-w-3 md:aspect-w-3 md:aspect-h-2">
  <img src="..." alt="..." class="..." />
</div>
```

이것이 이미지가 로드되는 동안 레이아웃 시프트가 발생하지 않게 하는 데 필요한 전부입니다(이에 대한 자세한 내용은 **[Setting Height And Width On Images Is Important Again](https://www.smashingmagazine.com/2020/03/setting-height-width-images-important-again/)**에서 읽어보세요).

<br>

## **`sizes`, `srcset`, and Cloudinary**

이미지를 빠르게 로드하는 또 다른 중요한 부분은 필요한 크기의 이미지만 로드하도록 하는 것입니다. 만약 여러분이 600x600 정사각형의 레티나 스크린에 3000x3000 크기의 이미지를 렌더링 한다면 1800x1800 픽셀만큼 초과해서 제공하는 것입니다! (레티나는 두 배의 픽셀이 필요합니다).

이제 여기서 `img` 태그의 `sizes`, `srcset` 속성이 작용하기 시작합니다. 이 속성들을 요약해서 설명하자면, 브라우저에 다양한 화면 너비에 대한 이미지의 다른 버전(`srcset`)과 주어진 미디어 쿼리에 대해 보여져야 할 이미지의 크기(`sizes`)를 알려줄 수 있다는 것입니다. 다음은 MDN의 예입니다:

```html
<img
  src="/files/16870/new-york-skyline-wide.jpg"
  srcset="
    /files/16870/new-york-skyline-wide.jpg 3724w,
    /files/16869/new-york-skyline-4by3.jpg 1961w,
    /files/16871/new-york-skyline-tall.jpg 1060w
  "
  sizes="((min-width: 50em) and (max-width: 60em)) 50em,
              ((min-width: 30em) and (max-width: 50em)) 30em,
              (max-width: 30em) 20em"
/>
```

이것이 의미하는 것은 화면 너비가 50em에서 60em 사이일 때 이미지는 50em이 된다는 것입니다. 따라서 브라우저는 제공한 `srcset` 중에서 해당 이미지 크기에 대해 불러올 최적의 이미지를 결정할 수 있습니다. 그리고 점진적으로 향상된다는 점을 확인해보세요! 브라우저가 이러한 속성을 지원하지 않으면 평소와 같이 `src` 속성을 사용하게 됩니다.

Unsplash는 이 기능을 많이 사용하고 저도 마찬가지입니다. 하지만 이 모든 크기의 이미지를 만드는 것은 엄청난 고통이겠죠. 그래서 저는 cloudinary를 사용합니다!

제 블로그 게시물에서 `img` 태그는 다음과 같이 됩니다:

```html
<img
  title="Photo by Kari Shea"
  class="z-10 rounded-lg object-cover object-center transition-opacity"
  alt="MacBook Pro on top of brown table"
  src="https://res.cloudinary.com/kentcdodds-com/image/upload/w_1517,q_auto,f_auto,b_rgb:e6e9ee/kentcdodds.com/content/blog/how-i-built-a-modern-website-in-2021/banner_iplhop"
  srcset="
    https://res.cloudinary.com/kentcdodds-com/image/upload/w_280,q_auto,f_auto,b_rgb:e6e9ee/kentcdodds.com/content/blog/how-i-built-a-modern-website-in-2021/banner_iplhop   280w,
    https://res.cloudinary.com/kentcdodds-com/image/upload/w_560,q_auto,f_auto,b_rgb:e6e9ee/kentcdodds.com/content/blog/how-i-built-a-modern-website-in-2021/banner_iplhop   560w,
    https://res.cloudinary.com/kentcdodds-com/image/upload/w_840,q_auto,f_auto,b_rgb:e6e9ee/kentcdodds.com/content/blog/how-i-built-a-modern-website-in-2021/banner_iplhop   840w,
    https://res.cloudinary.com/kentcdodds-com/image/upload/w_1100,q_auto,f_auto,b_rgb:e6e9ee/kentcdodds.com/content/blog/how-i-built-a-modern-website-in-2021/banner_iplhop 1100w,
    https://res.cloudinary.com/kentcdodds-com/image/upload/w_1650,q_auto,f_auto,b_rgb:e6e9ee/kentcdodds.com/content/blog/how-i-built-a-modern-website-in-2021/banner_iplhop 1650w,
    https://res.cloudinary.com/kentcdodds-com/image/upload/w_2500,q_auto,f_auto,b_rgb:e6e9ee/kentcdodds.com/content/blog/how-i-built-a-modern-website-in-2021/banner_iplhop 2500w,
    https://res.cloudinary.com/kentcdodds-com/image/upload/w_2100,q_auto,f_auto,b_rgb:e6e9ee/kentcdodds.com/content/blog/how-i-built-a-modern-website-in-2021/banner_iplhop 2100w,
    https://res.cloudinary.com/kentcdodds-com/image/upload/w_3100,q_auto,f_auto,b_rgb:e6e9ee/kentcdodds.com/content/blog/how-i-built-a-modern-website-in-2021/banner_iplhop 3100w
  "
  sizes="(max-width:1023px) 80vw, (min-width:1024px) and (max-width:1620px) 67vw, 1100px"
/>
```

물론 저는 이 태그를 직접 작성하지 않습니다. 저는 이러한 props를 생성해주는 유틸리티를 가지고 있습니다.

```tsx
function getImgProps(
  imageBuilder: ImageBuilder,
  {
    widths,
    sizes,
    transformations,
  }: {
    widths: Array<number>
    sizes: Array<string>
    transformations?: TransformerOption
  },
) {
  const averageSize = Math.ceil(widths.reduce((a, s) => a + s) / widths.length)

  return {
    alt: imageBuilder.alt,
    src: imageBuilder({
      quality: 'auto',
      format: 'auto',
      ...transformations,
      resize: { width: averageSize, ...transformations?.resize },
    }),
    srcSet: widths
      .map((width) =>
        [
          imageBuilder({
            quality: 'auto',
            format: 'auto',
            ...transformations,
            resize: { width, ...transformations?.resize },
          }),
          `${width}w`,
        ].join(' '),
      )
      .join(', '),
    sizes: sizes.join(', '),
  }
}
```

그리고 다음과 같이 사용합니다:

```tsx
<img
  key={frontmatter.bannerCloudinaryId}
  title={frontmatter.bannerCredit}
  className="rounded-lg object-cover object-center"
  {...getImgProps(getImageBuilder(frontmatter.bannerCloudinaryId, getBannerAltProp(frontmatter)), {
    widths: [280, 560, 840, 1100, 1650, 2500, 2100, 3100],
    sizes: ['(max-width:1023px) 80vw', '(min-width:1024px) and (max-width:1620px) 67vw', '1100px'],
    transformations: {
      background: 'rgb:e6e9ee',
    },
  })}
/>
```

우리는 `imageBuilder`같은 것에 대해 알아볼 시간이 많이 없습니다. 이것은 단지 타입세이프한 방식으로 cloudinary URL을 생성하기 위해 [cloudinary-build-url](https://npm.im/cloudinary-build-url) 기반으로 조금 추상화한 것입니다. 제 요점은 Cloudinary를 사용하면 디바이스와 화면 크기에 적합한 크기의 이미지를 쉽게 제공할 수 있으므로 빠르게 로드하고 데이터를 절약할 수 있다는 것입니다!

<br>

## Unsplash's placeholder

만약 여기까지 하고 멈추면 사용자는 이미지가 로드되기 전까지 빈 공간을 보게 될 것입니다. 일종의 placeholder를 보여주는 것이 훨씬 좋습니다. 여러분들도 분명히 웹에서 본 적이 있을 것입니다. 저는 Medium에서 이러한 것을 처음 봤습니다.

저는 이 웹사이트의 옛 버전에서 일종의 이미지의 투사본인 인라인 SVG를 지원하는 `gatsby-plugin-sharp`를 사용했었습니다(섞어서 사용하지만, 대부분 긍적적인 결과를 보입니다).

그리고 unsplash 또한 이를 지원합니다. 이것이 잘 작동하려면 placeholder를 작고, 서버에서 렌더링하고, 인라인으로 만들어야 합니다. 만약 placeholder를 따로 로드해야 하는 경우, placeholder를 위한 placeholder가 필요합니다! 우스꽝스럽게 들리지만 이것이 실제로 Unsplash가 하는 일입니다.

[https://res.cloudinary.com/kentcdodds-com/video/upload/kentcdodds.com/content/blog/building-an-awesome-image-loading-experience/unsplash-loading_l2ekrr.mp4](https://res.cloudinary.com/kentcdodds-com/video/upload/kentcdodds.com/content/blog/building-an-awesome-image-loading-experience/unsplash-loading_l2ekrr.mp4)

여러분이 unsplash 이미지를 로드할 때 네트워크 속도에 따라 세 가지 일이 연속적으로 발생할 수 있습니다.

1. 이미지의 기본 원색이 표시됩니다. 이것은 서버에서 렌더링됩니다.
2. 이미지의 흐릿한 버전이 표시됩니다. unsplash에서 이것을 위해 [blurhash](https://blurha.sh/)를 사용하고 있는지 확실하지는 않지만 똑같은 일을하고 있습니다. 캔버스 드로잉입니다.
3. 최종 이미지가 로드됩니다\*

\*_3단계에 대해서는 나중에 조금 더 이야기하겠습니다._

실제로 이 모든 일들이 일어나지만, 맨 위에 이미지가 배치되고, 그 다음 블러 처리하는 캔버스, 그리고 배경색이 있는 `div`가 있습니다. 그런 식으로 unsplash는 가능한 한 빨리 최적의 것을 보여줍니다. 그렇기 때문에, 초기 페이지 로드 시 흐릿한 이미지가 표시되지 않을 가능성이 높지만 페이지 로드 후 주변을 탐색하다보면 다른 모든 이미지의 흐릿한 이미지를 볼 수 있고 기본 배경색이 더이상 표시되지 않게 됩니다. 그 이유는 흐린 이미지 캔버스를 표시하려면 JavaScript를 실행시켜야 하기 때문입니다.

따라서 이미지가 JavaScript보다 먼저 로드되면, JavaScript는 여러분이 실제 이미지를 보기 전에 흐릿한 이미지를 위한 캔버스를 설정할 수 없습니다. JavaScript가 먼저 로드된 경우(예: 클라이언트 측 탐색을 수행하는 경우) 배경색이 표시되지 않고 흐린 이미지만 표시됩니다.

이건 멋진 설정이며 제가 이미지 로딩 경험 작업을 할 때 영감을 얻기 위해 봤습니다. blurhash/캔버스 접근 방식의 정말 멋진 점은 이미지에 필요한 데이터의 크기가 정말 작다는 것입니다. 예를 들어, 이미지의 멋진 블러 효과를 위해 blurhash 클라이언트 라이브러리에 이것만 전달하면 됩니다: `LGFFaXYk^6#M@-5c,1J5@[or[Q6.`

![](https://res.cloudinary.com/kentcdodds-com/image/upload/f_auto,q_auto,dpr_2.0,w_1600/kentcdodds.com/content/blog/building-an-awesome-image-loading-experience/blurhash)

솔직히, 마법처럼 너무 멋진 일입니다. 🧙

여기에서의 궁극적인 목표는 전체 해상도 이미지가 로드되는 동안 사용자에게 좋은 경험을 제공하기 위해 필요한 데이터 양을 최소화하는 것입니다. 속도와 우수한 사용자 경험의 균형입니다.

<br>

## **The kentcdodds.com image placeholder**

제가 unsplash의 이미지 로딩 기술을 리버스 엔지니어링할 때 저는 unsplash의 방식을 적용할 지, 아니면 조금 다른 방식을 시도해야 하는지를 평가했습니다. 흐릿한 이미지를 렌더링하기 전에 단색 배경색으로 div를 렌더링해야 한다는 것이 정말 마음에 들지 않았습니다. 그냥 base64로 인코딩된 데이터 URL을 통해 서버에서 흐릿한 이미지를 렌더링하면 안될까요?

그래서 저는 그 방식을 시도해보기로 했습니다. 먼저 base64 데이터 URL을 자동으로 생성하는 방법을 찾아야 했습니다. 우선, 일반 크기 이미지로 생성하면 URL이 매우 커질 것입니다 (이렇게 하면 기본적으로 저의 페이지 로드를 느리게 만들어 모든 사용자 경험 향상을 무효로 만들겁니다).

그렇기 때문에 축소된 이미지에 대한 base64 데이터 URL을 생성해야 했습니다. 저는 모든 이미지에 cloudinary를 사용하기 때문에 이 작업은 정말 간단했습니다. 또한, cloudinary는 이미지에 블러와 같은 변형을 적용하는 기능이 있습니다. 즉, base64 문자열에 표시할 데이터의 양을 쉽게 줄일 수 있습니다. 그래서 다음과 같은 cloudinary URL이 생성됩니다:

```
https://res.cloudinary.com/kentcdodds-com/image/upload/w_100,q_auto,f_webp,e_blur:1000/kentcdodds.com/content/blog/how-i-built-a-modern-website-in-2021/banner_iplhop
```

그리고 이 이미지를 fetch해서 base64로 인코딩하면, 다음과 같은 결과물을 얻을 수 있습니다:

```
data:image/webp;base64,UklGRhQBAABXRUJQVlA4IAgBAAAQDQCdASpkAEMAPrFGmko7qyWhsls9U3AWCWkGcA01nlwbK5buwWRoA3koD7+5vLBXAtOMrneG2GT90JyrLz+2XeotIAEq5PL4F0N1qTRIJ7LnMa5Zcre8UaDTMRtFt14eXNoGYkhNSt0REMN2PN4FwAD+7s4jHeyE9BXykzZMxIuwC4FSp408GYxRjoczsMvwZlqrnzr4cuA6X6MspvaoVHUro1XNU1SNxrLKLjhZrJ3GmlyoorlW1L532OP9tbhOeQgFiDwE81g+CH4d16xfOjEGrpus0wYxdunoI7Nokc5fnyoAw8pKJEq6cW3Yp4rqZw9fosV61qnAN+ViAH+WOzoqC6R90AA=
```

이 URL의 길이는 blurhash 해시값의 30자 정도보다 훨씬 더 길지만, blurhash에는 이보다 더 큰 클라이언트 라이브러리도 필요하다는 점을 기억하세요. 하지만 이 점이 제가 실제로 blurhash를 사용하지 않은 이유는 아닙니다. base64 방식을 몇 개의 이미지에만 적용해도 blurhash 라이브러리 사이즈보다 더 커지게 됩니다. 따라서 unsplash와 같은 사이트에는 확실히 이점이 있습니다.

그리고 bluhash는 아마도 제 사이트에서도 값어치가 있을 것입니다. 모든 페이지 하단에 블러 처리된 추천 게시물들이 있습니다.

그렇다면 왜 blurhash를 사용하지 않았을까요? 기본 색상을 렌더링하고 싶지 않았기 때문입니다. 제 사이트에 적합하지 않고, 단색 블록을 서버사이드 렌더링해야 할 만큼 데이터 URL이 크지 않다고 생각했습니다. 우리가 캔버스를 서버에서 렌더링할 수 없다는 것은 유감입니다. 그것은 두 세계의 최고가 될 것입니다. _한숨_

그래서 실제 이미지 뒤에 base64를 렌더링했습니다. 따라서 이미지가 로드되는 동안 서버에서 렌더링된 흐릿하고 확대된 이미지가 보여지게 됩니다.

불행하게도, 이렇게 확대하게 되면 매우 픽셀화되어 보입니다.

![](https://res.cloudinary.com/kentcdodds-com/image/upload/f_auto,q_auto,dpr_2.0,w_1600/kentcdodds.com/content/blog/building-an-awesome-image-loading-experience/pixelated-placeholder)

구원은 있었습니다! 저는 이것을 base64 이미지 뒤의 DOM에 끼워넣었고, 우리는 만반의 준비를 갖췄습니다.

```html
<div class="backdrop-blur-xl"></div>
```

끝으로 CSS를 효과적으로 적용해줍니다.

```css
backdrop-filter: blur(24px);
```

그러면 우리는 멋진 블러 효과를 얻을 수 있습니다:

![](https://res.cloudinary.com/kentcdodds-com/image/upload/f_auto,q_auto,dpr_2.0,w_1600/kentcdodds.com/content/blog/building-an-awesome-image-loading-experience/blurred-placeholder)

좋습니다!

<br>

## **Fading in the image onload**

멋진 placeholder가 있었지만, 한 가지 제가 신경 쓰였던 것은 이미지가 로드되면 placeholder 대신 나타나는 것이였습니다. 이미지가 로드될 때 이미지가 placeholder 대신에 나타나서 placeholder가 실제 이미지로 바뀌는 것처럼 느껴지기를 원했습니다. 이렇게 하려면 JavaScript를 작성해야 했습니다. 이제 제 `BlurrableImage` 컴포넌트를 보여줄 때가 된 것 같습니다... 먼저 블로그 게시물 페이지에서 사용하는 방법은 다음과 같습니다.

```tsx
function BlogScreen() {
  // ...
  return (
    // ...
    <div className="col-span-full mt-10 lg:col-span-10 lg:col-start-2 lg:mt-16">
      {frontmatter.bannerCloudinaryId ? (
        <BlurrableImage
          key={frontmatter.bannerCloudinaryId}
          blurDataUrl={frontmatter.bannerBlurDataUrl}
          className="aspect-h-4 aspect-w-3 md:aspect-w-3 md:aspect-h-2"
          img={
            <img
              key={frontmatter.bannerCloudinaryId}
              title={frontmatter.bannerCredit}
              className="rounded-lg object-cover object-center"
              {...getImgProps(
                getImageBuilder(
                  frontmatter.bannerCloudinaryId,
                  frontmatter.bannerAlt ?? frontmatter.bannerCredit ?? frontmatter.title ?? 'Post banner',
                ),
                {
                  widths: [280, 560, 840, 1100, 1650, 2500, 2100, 3100],
                  sizes: [
                    '(max-width:1023px) 80vw',
                    '(min-width:1024px) and (max-width:1620px) 67vw',
                    '1100px',
                  ],
                  transformations: {
                    background: 'rgb:e6e9ee',
                  },
                },
              )}
            />
          }
        />
      ) : null}
    </div>
    // ...
  )
  // ...
}
```

그리고 다음은 `BlurrableImage` 컴포넌트입니다:

```tsx
import * as React from 'react'
import clsx from 'clsx'
import { useSSRLayoutEffect } from '~/utils/misc'

function BlurrableImage({
  img,
  blurDataUrl,
  ...rest
}: {
  img: React.ReactElement<React.ImgHTMLAttributes<HTMLImageElement>>
  blurDataUrl?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  const [visible, setVisible] = React.useState(false)
  const jsImgElRef = React.useRef<HTMLImageElement>(null)

  React.useEffect(() => {
    if (!jsImgElRef.current) return
    if (jsImgElRef.current.complete) return

    let current = true
    jsImgElRef.current.addEventListener('load', () => {
      if (!jsImgElRef.current || !current) return
      setTimeout(() => {
        setVisible(true)
      }, 0)
    })

    return () => {
      current = false
    }
  }, [])

  const jsImgEl = React.cloneElement(img, {
    // @ts-expect-error no idea 🤷‍♂️
    ref: jsImgElRef,
    className: clsx(img.props.className, 'transition-opacity', {
      'opacity-0': !visible,
    }),
  })

  return (
    <div {...rest}>
      {blurDataUrl ? (
        <>
          <img src={blurDataUrl} className={img.props.className} alt={img.props.alt} />
          <div className={clsx(img.props.className, 'backdrop-blur-xl')} />
        </>
      ) : null}
      {jsImgEl}
      <noscript>{img}</noscript>
    </div>
  )
}

export { BlurrableImage }
```

약간의 설명이 필요하겠네요... 단계별로 설명해 드리겠습니다.

첫째, props는 매우 간단합니다. 로드하려는 최종 이미지인 `img` 컴포넌트를 받습니다. 이미지가 로드되기를 기다리는 동안 이미지의 흐릿한 버전을 렌더링하기 위해 `blurDataUrl`도 전달받습니다. 그런 다음 나머지 props는 전체 내용의 컨테이너인 div에 적용됩니다. 저는 거의 종횡비에 대한 className 정도에만 사용했습니다.

중간에 있는 내용은 건너뛰고 렌더링하는 부분으로 가보겠습니다.

모든 것을 함께 유지하기 위해 래퍼 div를 렌더링합니다(특히 가로 세로 비율이 제대로 동작할 수 있도록).

그런 다음 `blurDataUrl`이 있으면 `blurDataUrl`을 이용하여 `img` 컴포넌트를 렌더링합니다. border radius 같은 것들이 올바르게 적용될 수 있도록 `className`을 상속시켜줍니다.

앞서 설명한 것처럼 이미지가 확대될 것이기 때문에 데이터 URL 이미지의 블러를 부드럽게 해주기 위해 블러 이미지 아래에 배경을 렌더링해줍니다.

그런 다음 `jsImgEl`이라고 부르는 것을 렌더링합니다. 이것은 `img` 컴포넌트의 복사본이고, 모든 작업이 완료될 때 사용자에게 보여지는 기본 이미지입니다. 페이드 인 동작을 위해 CSS를 추가할 수 있도록 복사본을 만들었습니다. 조금 뒤에 자세히 알아보겠습니다.

마지막으로, `<noscript>{img}</noscript>` 부분은 JavaScript를 비활성화할 수 있는 소수의 사용자를 위한 것입니다. 그렇지 않으면 이미지를 표시할 수 없기 때문입니다(이미지를 표시하려면 JavaScript가 필요하기 때문에). 아마 그런 사용자는 많지 않을 것입니다. 하지만 이 작업은 너무 간단하기 때문에 안 할 이유가 없겠죠?

좋습니다. 페이드 인 효과를 위해서 `jsImgEl` 컴포넌트는 보이지 않는 상태로 시작해야 합니다. 브라우저는 이미지를 로드하고 이벤트를 발생시키므로, 언제 이미지가 로드되고 로딩이 끝나는지 알려주고 업데이트를 트리거하고 페이드 인 효과를 만드는 이벤트 핸들러를 추가하기 위해 useEffect를 사용합니다.

그리고 이게 전부입니다.

## **Conclusion**

리뷰해보면, 우수한 이미지 로드 경험을 만들기 위해 몇 가지 작업을 하고 있습니다:

1. Tailwind의 aspect-ratio 플러그인을 사용하여 레이아웃 시프트 방지
2. `<img />` 속성 중 `sizes` 및 `srcset` + cloudinary 변환을 통해 필요한 크기의 이미지를 로드
3. 이미지의 더 작은 흐릿한 버전의 base64 인코딩 생성. 저는 빠른 속도를 위해 이것을 캐시하고 있습니다.
4. 전체 이미지가 로딩됐을 때 전체 이미지를 보여주기 위한 약간의 자바스크립트에 덧붙여서, 블러 이미지가 서버에서 렌더링될 수 있도록 인라인으로 렌더링

이것이 바로 이 사이트에서 멋진 이미지 로딩 경험을 제공할 수 있게 해주는 것입니다. 성능이 사용자 경험의 전부가 아니라는 점을 기억하는 것이 중요합니다. 사용자 경험은 경험에 관한 것이기도 합니다. 제가 만든 트레이드오프가 여러분들이 이 사이트를 탐색할 때 제공하고자 하는 사용자 경험과 결이 같다고 생각합니다. 여러분들이 이걸 좋아하기를 바랍니다 :)
