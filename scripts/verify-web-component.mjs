import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { chromium } from 'playwright'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

const html = (entrypoint, shouldAutoRegister) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="/dist/advanced-chat-components.css">
  </head>
  <body>
    <div id="events"><advanced-chat-components id="chat"></advanced-chat-components></div>
    <script type="module">
      const module = await import('${entrypoint}')
      window.importResult = {
        autoRegistered: Boolean(customElements.get(module.DEFAULT_CUSTOM_ELEMENT_TAG)),
        shouldAutoRegister: ${shouldAutoRegister},
      }
      window.advancedChatModule = module
    </script>
  </body>
</html>`

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || '/', 'http://localhost')
    if (url.pathname === '/' || url.pathname === '/core') {
      const core = url.pathname === '/core'
      response.setHeader('content-type', 'text/html; charset=utf-8')
      response.end(
        html(
          core ? '/dist/advanced-chat-components-core.js' : '/dist/advanced-chat-components.js',
          !core,
        ),
      )
      return
    }

    const requestedFile = path.resolve(root, `.${url.pathname}`)
    if (!requestedFile.startsWith(`${dist}${path.sep}`)) {
      response.statusCode = 404
      response.end('Not found')
      return
    }

    const content = await readFile(requestedFile)
    response.setHeader(
      'content-type',
      requestedFile.endsWith('.css') ? 'text/css; charset=utf-8' : 'text/javascript; charset=utf-8',
    )
    response.end(content)
  } catch (error) {
    response.statusCode = 500
    response.end(error instanceof Error ? error.message : String(error))
  }
})

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const address = server.address()
if (!address || typeof address === 'string') {
  throw new Error('Could not determine the web-component verification server port.')
}

const browser = await chromium.launch({ headless: true })

try {
  const page = await browser.newPage()
  await page.goto(`http://127.0.0.1:${address.port}/`)
  await page.waitForFunction(() => window.importResult)

  const autoRegistration = await page.evaluate(() => window.importResult)
  if (!autoRegistration.autoRegistered || !autoRegistration.shouldAutoRegister) {
    throw new Error('The default web-component entrypoint did not auto-register its tag.')
  }

  const rendered = await page.evaluate(async () => {
    const chat = document.querySelector('#chat')
    const eventContainer = document.querySelector('#events')
    let retryEvent
    eventContainer.addEventListener('retry', (event) => {
      retryEvent = event
    })

    chat.status = 'error'
    chat.statusMessage = 'Browser verification error'
    chat.retryLabel = 'Retry browser verification'

    await customElements.whenDefined('advanced-chat-components')
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    chat.querySelector('.vac-state-panel button')?.click()

    return {
      message: chat.querySelector('.vac-state-panel p')?.textContent,
      buttonCursor: getComputedStyle(chat.querySelector('.vac-state-panel button')).cursor,
      retryEvent: retryEvent
        ? {
            bubbles: retryEvent.bubbles,
            composed: retryEvent.composed,
            detail: retryEvent.detail,
          }
        : null,
    }
  })

  if (rendered.message !== 'Browser verification error' || rendered.buttonCursor !== 'pointer') {
    throw new Error('The built web component did not render with its packaged stylesheet.')
  }
  if (
    !rendered.retryEvent ||
    !rendered.retryEvent.bubbles ||
    !rendered.retryEvent.composed ||
    rendered.retryEvent.detail !== null
  ) {
    throw new Error('The built web component did not emit a delegated DOM event.')
  }

  await page.goto(`http://127.0.0.1:${address.port}/core`)
  await page.waitForFunction(() => window.importResult)
  const coreRegistration = await page.evaluate(() => {
    const before = window.importResult.autoRegistered
    window.advancedChatModule.registerAdvancedChat()
    return {
      before,
      after: Boolean(customElements.get('advanced-chat-components')),
    }
  })
  if (coreRegistration.before || !coreRegistration.after) {
    throw new Error('The core entrypoint did not preserve explicit registration semantics.')
  }

  console.log('Verified auto and explicit web-component entrypoints in Chromium.')
} finally {
  await browser.close()
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  )
}
