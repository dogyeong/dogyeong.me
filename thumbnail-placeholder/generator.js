const path = require('path')
const fs = require('fs/promises')
const { sqip } = require('sqip')
const cache = require('./cache')
const { forEachBlogArticles } = require('./file')

/**
 * 블로그 컨텐츠 마크다운 파일의 썸네일 이미지를 기반으로 플레이스홀더 svg uri를 생성하고
 * 해당 uri를 마크다운 파일에 추가한다.
 */
run().then(cache.saveFile)

function run() {
  return forEachBlogArticles(generatePlaceholderAndWriteToMarkdown)
}

async function generatePlaceholderAndWriteToMarkdown(filename, markdown) {
  const needThumbnailPlaceholder = decidePlaceholderNeeded(markdown)

  if (!needThumbnailPlaceholder) return

  const thumbnailUrl = extractThumbnailUrlFromMarkdown(markdown)

  if (!thumbnailUrl) return

  const { etag: cachedEtag, dataURIBase64: cachedBase64 } = (await cache.get(thumbnailUrl)) || {}
  const cacheHit = await decideCacheHit(thumbnailUrl, cachedEtag)

  if (cacheHit) {
    await writePlaceholderToMarkdown(markdown, filename, cachedBase64)
    return console.log('Used cache for', filename)
  }

  const image = await fetch(thumbnailUrl)
  const imageEtag = image.headers.get('etag')

  const dataURIBase64 = await generatePlaceholderDataURI(filename, await image.arrayBuffer())

  await cache.set(thumbnailUrl, { etag: imageEtag, dataURIBase64 })
  await writePlaceholderToMarkdown(markdown, filename, dataURIBase64)

  console.log('Generated placeholder for', filename)
}

function decidePlaceholderNeeded(markdown) {
  return markdown.includes('thumbnailPlaceholder:')
}

async function decideCacheHit(thumbnailUrl, cachedEtag) {
  if (!cachedEtag) return false

  const etag = await fetch(thumbnailUrl, { method: 'HEAD' }).then((r) => r.headers.get('etag'))
  return etag === cachedEtag
}

function writePlaceholderToMarkdown(originalMarkdown, filename, placeholderDataURI) {
  const replacedMarkdown = originalMarkdown.replace(
    /thumbnailPlaceholder:[ ]?\S*/,
    `thumbnailPlaceholder: ${placeholderDataURI}`,
  )

  return fs.writeFile(path.join(__dirname, `../content/blog/${filename}`), replacedMarkdown, {
    encoding: 'utf-8',
  })
}

function extractThumbnailUrlFromMarkdown(markdown) {
  const thumbnailUrlmatchResult = markdown.match(/thumbnail:[ ]?\S+/)

  if (!thumbnailUrlmatchResult) return null

  const [matched] = thumbnailUrlmatchResult
  const thumbnailUrl = matched.split('thumbnail:')[1].trim()

  return thumbnailUrl
}

async function generatePlaceholderDataURI(filename, imageArrayBuffer) {
  const { metadata } = await sqip({
    input: Buffer.from(imageArrayBuffer),
    plugins: ['data-uri'],
    width: 10,
    outputFileName: filename,
  })
  return metadata.dataURIBase64.replace('+xml', '')
}
