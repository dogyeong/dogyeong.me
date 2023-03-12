const path = require('path')
const fs = require('fs/promises')
const { sqip } = require('sqip')

/**
 * 블로그 컨텐츠 마크다운 파일의 썸네일 이미지를 기반으로 플레이스홀더 svg uri를 생성하고
 * 해당 uri를 마크다운 파일에 추가한다.
 */
async function run() {
  const markdownFiles = await fs.readdir(path.join(__dirname, './content/blog'))

  await Promise.allSettled(
    markdownFiles.map(async (file) => {
      try {
        const markdown = (await fs.readFile(path.join(__dirname, `./content/blog/${file}`))).toString()

        if (!markdown.includes('thumbnailPlaceholder:')) return

        const matchResult = markdown.match(/thumbnail:[ ]?\S+/)

        if (!matchResult) return

        const [matched] = matchResult
        const imageFilePath = matched.split('thumbnail:')[1].trim()

        const { metadata } = await sqip({
          input: path.join(__dirname, './public', imageFilePath),
          plugins: ['data-uri'],
          width: 10,
        })

        const replacedMarkdown = markdown.replace(
          /thumbnailPlaceholder:[ ]?\S*/,
          `thumbnailPlaceholder: ${metadata.dataURIBase64.replace('+xml', '')}`,
        )

        await fs.writeFile(path.join(__dirname, `./content/blog/${file}`), replacedMarkdown, {
          encoding: 'utf-8',
        })

        console.log('Generated placeholder for', file)
      } catch (e) {
        console.log(e)
      }
    }),
  )
}

run()
