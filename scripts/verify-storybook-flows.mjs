import { chromium } from 'playwright'
import http from 'node:http'
import { readFile, stat, mkdir } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../storybook-static', import.meta.url))
const SCREENSHOTS = fileURLToPath(new URL('../.tmp/storybook-screenshots', import.meta.url))
const PORT = 6790

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
await mkdir(SCREENSHOTS, { recursive: true })

const baseUrl = `http://localhost:${PORT}`
const browser = await chromium.launch()

const failures = []

const goStory = async (page, id) => {
  await page.goto(`${baseUrl}/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'networkidle' })
}

const checkExists = async (page, selector, label) => {
  const el = await page.$(selector)
  if (!el) {
    failures.push(`[${label}] missing selector: ${selector}`)
    return null
  }
  return el
}

const expectVisible = async (page, selector, label) => {
  const el = await checkExists(page, selector, label)
  if (!el) return false
  const isVisible = await el.isVisible()
  if (!isVisible) {
    failures.push(`[${label}] selector not visible: ${selector}`)
    return false
  }
  return true
}

const expectMissing = async (page, selector, label) => {
  const el = await page.$(selector)
  if (el && (await el.isVisible())) {
    failures.push(`[${label}] selector unexpectedly visible: ${selector}`)
    return false
  }
  return true
}

const expectText = async (page, selector, expected, label) => {
  const el = await checkExists(page, selector, label)
  if (!el) return false
  const text = (await el.innerText()).trim()
  if (!text.includes(expected)) {
    failures.push(`[${label}] expected ${selector} to contain "${expected}", got: ${text.slice(0, 80)}`)
    return false
  }
  return true
}

const screenshot = async (page, file) => {
  await page.screenshot({ path: join(SCREENSHOTS, file), fullPage: false })
}

// ---------------- AdvancedChat: light & dark themes
{
  const page = await browser.newPage({ viewport: { width: 1100, height: 720 } })
  page.on('pageerror', (err) => failures.push(`[advanced-chat-light] ${err.message}`))
  await goStory(page, 'components-advancedchat--light-mode')

  await expectVisible(page, '.vac-card-window', 'advanced-chat-light')
  await expectVisible(page, '.vac-rooms-container', 'advanced-chat-light')
  await expectVisible(page, '.vac-col-messages', 'advanced-chat-light')
  await expectVisible(page, '.vac-room-header', 'advanced-chat-light')
  await expectVisible(page, '.vac-room-footer', 'advanced-chat-light')
  await expectText(page, '.vac-room-name', 'Alice', 'advanced-chat-light')
  await screenshot(page, 'advanced-chat-light.png')
  await page.close()
}

{
  const page = await browser.newPage({ viewport: { width: 1100, height: 720 } })
  page.on('pageerror', (err) => failures.push(`[advanced-chat-dark] ${err.message}`))
  await goStory(page, 'components-advancedchat--dark-mode')

  await expectVisible(page, '.vac-card-window', 'advanced-chat-dark')

  // Read computed background to confirm the dark theme actually applied
  const bg = await page.$eval('.vac-card-window', (el) => getComputedStyle(el).backgroundColor)
  // dark theme bg-color is #131415 = rgb(19, 20, 21)
  if (!bg.includes('19, 20, 21')) {
    failures.push(`[advanced-chat-dark] expected dark-theme background ~rgb(19, 20, 21), got ${bg}`)
  }
  await screenshot(page, 'advanced-chat-dark.png')
  await page.close()
}

// ---------------- Chat: empty / no-chat-selected / loading
{
  const page = await browser.newPage({ viewport: { width: 900, height: 600 } })
  page.on('pageerror', (err) => failures.push(`[chat-empty] ${err.message}`))
  await goStory(page, 'components-chat--empty')

  await expectText(page, '.vac-room-empty', 'No messages yet', 'chat-empty')
  await screenshot(page, 'chat-empty.png')
  await page.close()
}

{
  const page = await browser.newPage({ viewport: { width: 900, height: 600 } })
  page.on('pageerror', (err) => failures.push(`[chat-no-chat] ${err.message}`))
  await goStory(page, 'components-chat--no-chat-selected')

  await expectText(page, '.vac-room-empty', 'No chat selected', 'chat-no-chat')
  await screenshot(page, 'chat-no-chat.png')
  await page.close()
}

{
  const page = await browser.newPage({ viewport: { width: 900, height: 600 } })
  page.on('pageerror', (err) => failures.push(`[chat-loading] ${err.message}`))
  await goStory(page, 'components-chat--loading')

  await expectVisible(page, '.vac-loader-wrapper', 'chat-loading')
  await screenshot(page, 'chat-loading.png')
  await page.close()
}

// ---------------- Chat: selection mode
{
  const page = await browser.newPage({ viewport: { width: 900, height: 600 } })
  page.on('pageerror', (err) => failures.push(`[chat-selection] ${err.message}`))
  await goStory(page, 'components-chat--selection-mode')

  // selection mode adds vac-message-row-selectable class
  await expectVisible(page, '.vac-message-row-selectable', 'chat-selection')
  await page.click('.vac-message-row-selectable')
  await page.waitForSelector('.vac-message-row-selected', { state: 'visible' })
  await expectVisible(page, '.vac-room-selection', 'chat-selection')
  await screenshot(page, 'chat-selection-active.png')
  await page.close()
}

// ---------------- Chats: search filter (visual smoke)
{
  const page = await browser.newPage({ viewport: { width: 600, height: 600 } })
  page.on('pageerror', (err) => failures.push(`[chats-search] ${err.message}`))
  await goStory(page, 'components-chats--default')

  await expectText(page, '.vac-rooms-container', 'Alice', 'chats-search')
  await expectText(page, '.vac-rooms-container', 'Charlie', 'chats-search')

  await page.fill('input[type="search"]', 'Bob')
  // Vue's reactivity should now filter
  await page.waitForTimeout(50)

  const aliceVisible = await page.$('text=Alice')
  if (aliceVisible && (await aliceVisible.isVisible())) {
    failures.push('[chats-search] Alice still visible after typing "Bob"')
  }
  await expectText(page, '.vac-rooms-container', 'Bob', 'chats-search')
  await screenshot(page, 'chats-search-bob.png')
  await page.close()
}

// ---------------- Message: states
const messageStates = [
  ['default', 'message-default.png', null],
  ['own-edited', 'message-own-edited.png', '#vac-icon-pencil'],
  ['reply', 'message-reply.png', '.vac-reply-message'],
  ['audio-only', 'message-audio.png', '.vac-audio-player'],
  ['deleted', 'message-deleted.png', '.vac-message-deleted'],
  ['system', 'message-system.png', '.vac-message-system'],
  ['failure', 'message-failure.png', '.vac-failure-container'],
]

for (const [variant, file, requiredSelector] of messageStates) {
  const page = await browser.newPage({ viewport: { width: 700, height: 360 } })
  page.on('pageerror', (err) => failures.push(`[message-${variant}] ${err.message}`))
  await goStory(page, `components-message--${variant}`)

  if (requiredSelector) {
    await expectVisible(page, requiredSelector, `message-${variant}`)
  } else {
    await expectVisible(page, '.vac-message-row', `message-${variant}`)
  }
  await screenshot(page, file)
  await page.close()
}

// ---------------- ChatFooter: replying
{
  const page = await browser.newPage({ viewport: { width: 900, height: 400 } })
  page.on('pageerror', (err) => failures.push(`[footer-reply] ${err.message}`))
  await goStory(page, 'components-chatfooter--replying')

  await expectVisible(page, '.vac-room-footer', 'footer-reply')
  await expectVisible(page, '.vac-footer-reply-wrapper', 'footer-reply')
  await expectVisible(page, '.vac-footer-reply-close', 'footer-reply')

  // clicking the close should remove the reply preview
  await page.click('.vac-footer-reply-close')
  await page.waitForTimeout(50)
  await expectMissing(page, '.vac-footer-reply-wrapper', 'footer-reply')
  await screenshot(page, 'footer-reply-cancelled.png')
  await page.close()
}

// ---------------- ChatFooter: send button
{
  const page = await browser.newPage({ viewport: { width: 900, height: 400 } })
  page.on('pageerror', (err) => failures.push(`[footer-send] ${err.message}`))
  await goStory(page, 'components-chatfooter--default')

  // empty -> send button is disabled visually
  const sendBtn = await page.$('.vac-icon-textarea .vac-svg-button.vac-send-disabled')
  if (!sendBtn) {
    failures.push('[footer-send] expected .vac-send-disabled when textarea is empty')
  }

  await page.getByLabel('Type a message').fill('Hello world')
  await page.waitForTimeout(50)

  const stillDisabled = await page.$('.vac-icon-textarea .vac-svg-button.vac-send-disabled')
  if (stillDisabled) {
    failures.push('[footer-send] send button still disabled after typing')
  }
  await screenshot(page, 'footer-send-enabled.png')
  await page.close()
}

await browser.close()
server.close()

if (failures.length) {
  console.error('FAILURES:')
  for (const f of failures) console.error('  -', f)
  console.error(`\nScreenshots written to ${SCREENSHOTS}`)
  process.exit(1)
}

console.log(`OK — all flow checks passed. Screenshots in ${SCREENSHOTS}`)
