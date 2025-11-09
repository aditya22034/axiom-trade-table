
/**
 * Very lightweight Playwright + Pixelmatch VRT.
 * Compares the local replica table vs the live Axiom page.
 */
const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')
const pixelmatch = require('pixelmatch')
const { PNG } = require('pngjs')

async function capture(page, url, selector, outPath) {
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForSelector(selector)
  const el = await page.locator(selector).first()
  await el.screenshot({ path: outPath })
}

async function pngDiff(aPath, bPath, diffPath) {
  const img1 = PNG.sync.read(fs.readFileSync(aPath))
  const img2 = PNG.sync.read(fs.readFileSync(bPath))
  const { width, height } = img1
  const diff = new PNG({ width, height })
  const mismatched = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 })
  fs.writeFileSync(diffPath, PNG.sync.write(diff))
  return mismatched
}

;(async () => {
  const outDir = path.join(__dirname, '..', 'vrt-artifacts')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

  const localShot = path.join(outDir, 'local.png')
  const remoteShot = path.join(outDir, 'remote.png')
  const diffShot = path.join(outDir, 'diff.png')


  await capture(page, 'http://localhost:3000', 'main', localShot)
  await capture(page, 'https://axiom.trade/pulse', 'main', remoteShot)

  const mismatched = await pngDiff(localShot, remoteShot, diffShot)
  console.log('Mismatched pixels:', mismatched)
  console.log('Artifacts saved to', outDir)
  await browser.close()
})().catch(e => { console.error(e); process.exit(1) })
