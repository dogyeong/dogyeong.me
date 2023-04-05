const path = require('path')
const fs = require('fs/promises')

function forEachBlogArticles(callback) {
  return fs.readdir(path.join(__dirname, '../content/blog')).then((markdownFiles) =>
    Promise.allSettled(
      markdownFiles.map(async (filename) => {
        try {
          const markdown = (await fs.readFile(path.join(__dirname, `../content/blog/${filename}`))).toString()
          return await callback(filename, markdown)
        } catch (e) {
          console.log('unexpected error while generating placeholder', e)
        }
      }),
    ),
  )
}

module.exports = { forEachBlogArticles }
