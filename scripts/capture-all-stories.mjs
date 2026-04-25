import { chromium } from 'playwright'
import http from 'node:http'
import { readFile, stat, mkdir } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../storybook-static', import.meta.url))
const SHOTS = fileURLToPath(new URL('../.tmp/all-stories', import.meta.url))
const PORT = 6791

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
  if (!resolved.startsWith(root)) throw new Error('path traversal blocked')
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
await mkdir(SHOTS, { recursive: true })

const baseUrl = `http://localhost:${PORT}`
const indexJson = JSON.parse(await readFile(join(ROOT, 'index.json'), 'utf8'))
const stories = Object.values(indexJson.entries)
  .filter((entry) => entry.type === 'story')
  .map((entry) => ({
    id: entry.id,
    title: entry.title,
    name: entry.name,
  }))

const browser = await chromium.launch()

const VIEWPORTS = {
  large: { width: 1100, height: 720 },
  medium: { width: 800, height: 600 },
  small: { width: 500, height: 500 },
}

const sizeFor = (title) => {
  if (title.includes('AdvancedChat') || title.includes('/Chat')) return VIEWPORTS.large
  if (title.includes('Chats') || title.includes('Message') || title.includes('Footer'))
    return VIEWPORTS.medium
  return VIEWPORTS.small
}

let count = 0
for (const story of stories) {
  const page = await browser.newPage({ viewport: sizeFor(story.title) })
  try {
    await page.goto(`${baseUrl}/iframe.html?id=${story.id}&viewMode=story`, {
      waitUntil: 'networkidle',
    })
    // Wait for fonts/images to settle
    await page.waitForTimeout(150)
    const filename = `${story.id}.png`
    await page.screenshot({ path: join(SHOTS, filename), fullPage: true })
    count++
  } catch (err) {
    console.error(`failed: ${story.id} — ${err.message}`)
  } finally {
    await page.close()
  }
}

await browser.close()
server.close()

console.log(`Captured ${count}/${stories.length} stories to ${SHOTS}`)
