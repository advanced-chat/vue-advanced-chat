import { chromium } from 'playwright'
import http from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../storybook-static', import.meta.url))
const PORT = 6789

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
}

const safeJoin = (root, requested) => {
  const normalized = normalize(requested).replace(/^([./\\])+/, '')
  const resolved = join(root, normalized)

  if (!resolved.startsWith(root)) {
    throw new Error('path traversal blocked')
  }

  return resolved
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://localhost:${PORT}`)
    const requested = url.pathname === '/' ? 'index.html' : url.pathname
    const filePath = safeJoin(ROOT, requested)
    const stats = await stat(filePath)
    const target = stats.isDirectory() ? join(filePath, 'index.html') : filePath
    const data = await readFile(target)

    res.writeHead(200, {
      'Content-Type': MIME[extname(target)] || 'application/octet-stream',
      'Content-Length': data.length,
      'Cache-Control': 'no-store',
    })
    res.end(data)
  } catch {
    res.writeHead(404)
    res.end('not found')
  }
})

await new Promise((resolve) => server.listen(PORT, resolve))

const baseUrl = `http://localhost:${PORT}`
const indexJson = JSON.parse(await readFile(join(ROOT, 'index.json'), 'utf8'))

const storyIds = Object.values(indexJson.entries)
  .filter((entry) => entry.type === 'story')
  .map((entry) => entry.id)

const browser = await chromium.launch()

const probeStory = async (page, storyId) => {
  const consoleIssues = []
  const pageErrors = []
  const onConsole = (msg) => {
    const type = msg.type()
    if (type === 'error' || type === 'warning') {
      consoleIssues.push({ type, text: msg.text() })
    }
  }
  const onPageError = (err) => {
    pageErrors.push(err.message || String(err))
  }
  page.on('console', onConsole)
  page.on('pageerror', onPageError)

  await page.goto(`${baseUrl}/iframe.html?id=${storyId}&viewMode=story`, {
    waitUntil: 'networkidle',
  })

  const rootEl = await page.$('#storybook-root')
  const rootHtmlLen = rootEl ? (await rootEl.innerHTML()).length : 0

  page.off('console', onConsole)
  page.off('pageerror', onPageError)

  return { storyId, rootHtmlLen, consoleIssues, pageErrors }
}

const results = []
for (const id of storyIds) {
  const page = await browser.newPage({ viewport: { width: 1100, height: 720 } })
  try {
    results.push(await probeStory(page, id))
  } finally {
    await page.close()
  }
}

await browser.close()
server.close()

const errors = []
const warnings = []
const empties = []

for (const r of results) {
  if (r.pageErrors.length) {
    errors.push({ storyId: r.storyId, pageErrors: r.pageErrors })
  }
  if (r.rootHtmlLen < 50) {
    empties.push({ storyId: r.storyId, rootHtmlLen: r.rootHtmlLen })
  }
  for (const issue of r.consoleIssues) {
    if (
      issue.text.includes('axe-core') ||
      issue.text.includes('addon-controls') ||
      issue.text.includes('Failed to load resource: the server responded with a status of 404') ||
      issue.text.match(/^\[storybook\]/i)
    ) {
      continue
    }
    if (issue.type === 'error') errors.push({ storyId: r.storyId, ...issue })
    else warnings.push({ storyId: r.storyId, ...issue })
  }
}

console.log(`Probed ${results.length} stories`)
console.log(`Page errors: ${errors.filter((e) => e.pageErrors).length}`)
console.log(`Console errors: ${errors.filter((e) => e.text).length}`)
console.log(`Console warnings: ${warnings.length}`)
console.log(`Empty roots: ${empties.length}`)

if (errors.length) {
  console.error('\n--- ERRORS')
  for (const e of errors) console.error(JSON.stringify(e, null, 2))
}

if (warnings.length) {
  console.error('\n--- WARNINGS (first 20)')
  for (const w of warnings.slice(0, 20)) console.error(JSON.stringify(w, null, 2))
}

if (empties.length) {
  console.error('\n--- EMPTY ROOTS')
  for (const e of empties) console.error(JSON.stringify(e, null, 2))
}

if (errors.length || empties.length) {
  process.exit(1)
}

console.log('\nAll stories rendered without page errors or empty roots.')
