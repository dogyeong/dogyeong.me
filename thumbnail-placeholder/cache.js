const fs = require('fs/promises')
const path = require('path')

const CACHE_FILE = 'thumbnail-placeholder-cache.json'

/**
 * 썸네일 플레이스홀더 캐시를 관리한다.
 * 캐시는 json 형태로 저장되며, 캐시 파일은 public 디렉토리에 저장된다.
 * 캐시 파일은 배포 시 생성되어 빌드 결과물에 추가된다. 개발 시에는 사용하지 않는다.
 *
 * 캐시 파일은 다음과 같은 형태를 가진다.
 * {
 *  "https://res.cloudinary.com/dpefbi4ts/image/upload/v1680068338/thumb/038-thumb.png": {
 *    "etag": "c039db2221ffae18f5d2d7b1d92c250d",
 *    "dataURIBase64": "data:image/svg;base64,iVBORw0KGgoAAAANSUhEUgAZeLY70wAAAABJRU5ErkJggg=="
 * }
 */
const cache = {}

const loadAlreadyExistingJson = fetch(`https://dogyeong.me/${CACHE_FILE}`)
  .then((r) => r.json())
  .then((json) => Object.assign(cache, json))
  .catch((e) => console.info('there is no cache :', e))

async function get(key) {
  await loadAlreadyExistingJson
  return cache[key]
}

async function set(key, val) {
  await loadAlreadyExistingJson
  cache[key] = val
}

function saveFile() {
  return fs.writeFile(path.join(__dirname, `../public/${CACHE_FILE}`), JSON.stringify(cache), {
    encoding: 'utf-8',
  })
}

module.exports = { get, set, saveFile }
