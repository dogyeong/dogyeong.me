const path = require('path')
const fs = require('fs/promises')
const { sqip } = require('sqip')
const cache = require('./cache')

/**
 * 블로그 컨텐츠 마크다운 파일의 썸네일 이미지를 기반으로 플레이스홀더 svg uri를 생성하고
 * 해당 uri를 마크다운 파일에 추가한다.
 */
async function run() {
  const markdownFiles = await fs.readdir(path.join(__dirname, '../content/blog'))

  await Promise.allSettled(
    markdownFiles.map(async (file) => {
      try {
        const markdown = (await fs.readFile(path.join(__dirname, `../content/blog/${file}`))).toString()
        const needThumbnailPlaceholder = markdown.includes('thumbnailPlaceholder:')

        if (!needThumbnailPlaceholder) return

        const thumbnailUrlmatchResult = markdown.match(/thumbnail:[ ]?\S+/)

        if (!thumbnailUrlmatchResult) return

        const [matched] = thumbnailUrlmatchResult
        const thumbnailUrl = matched.split('thumbnail:')[1].trim()

        const { etag: cachedEtag, dataURIBase64: cachedBase64 } = (await cache.get(thumbnailUrl)) || {}
        const etag = await fetch(thumbnailUrl, { method: 'HEAD' }).then((r) => r.headers.get('etag'))

        // cache hit
        if (cachedEtag === etag) {
          const replacedMarkdown = markdown.replace(
            /thumbnailPlaceholder:[ ]?\S*/,
            `thumbnailPlaceholder: ${cachedBase64}`,
          )

          await fs.writeFile(path.join(__dirname, `../content/blog/${file}`), replacedMarkdown, {
            encoding: 'utf-8',
          })

          console.log('Using cache for', file)
          return
        }

        // cache miss
        const image = await fetch(thumbnailUrl)
        const imageEtag = image.headers.get('etag')

        const { metadata } = await sqip({
          input: Buffer.from(await image.arrayBuffer()),
          plugins: ['data-uri'],
          width: 10,
          outputFileName: file,
        })
        const refinedDataURIBase64 = metadata.dataURIBase64.replace('+xml', '')

        await cache.set(thumbnailUrl, { etag: imageEtag, dataURIBase64: refinedDataURIBase64 })

        const replacedMarkdown = markdown.replace(
          /thumbnailPlaceholder:[ ]?\S*/,
          `thumbnailPlaceholder: ${refinedDataURIBase64}`,
        )

        await fs.writeFile(path.join(__dirname, `../content/blog/${file}`), replacedMarkdown, {
          encoding: 'utf-8',
        })

        console.log('Generated placeholder for', file)
      } catch (e) {
        console.log(e)
      }
    }),
  )
}

run().then(cache.saveFile)
