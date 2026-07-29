// Generates the PWA icon set as raw PNGs (coffee cup glyph on coffee-800 bg).
// Uses only Node's built-in zlib, no image/canvas dependency required.
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

const BG = [0x40, 0x2a, 0x1f] // coffee-800
const FG = [0xfa, 0xf6, 0xf1] // coffee-50

function crc32(buf) {
  let c
  const table = crc32.table || (crc32.table = (() => {
    const t = new Uint32Array(256)
    for (let n = 0; n < 256; n++) {
      c = n
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      t[n] = c >>> 0
    }
    return t
  })())
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeBuf = Buffer.from(type, 'ascii')
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0)
  return Buffer.concat([len, typeBuf, data, crcBuf])
}

function encodePNG(width, height, rgbaPixels) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(width, 0)
  ihdrData.writeUInt32BE(height, 4)
  ihdrData[8] = 8 // bit depth
  ihdrData[9] = 6 // color type RGBA
  ihdrData[10] = 0
  ihdrData[11] = 0
  ihdrData[12] = 0
  const ihdr = chunk('IHDR', ihdrData)

  const stride = width * 4
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0 // filter: none
    rgbaPixels.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride)
  }
  const idatData = zlib.deflateSync(raw, { level: 9 })
  const idat = chunk('IDAT', idatData)
  const iend = chunk('IEND', Buffer.alloc(0))
  return Buffer.concat([sig, ihdr, idat, iend])
}

// --- shape helpers -------------------------------------------------------

function roundedRectDist(px, py, cx, cy, halfW, halfH, radius) {
  const dx = Math.max(Math.abs(px - cx) - (halfW - radius), 0)
  const dy = Math.max(Math.abs(py - cy) - (halfH - radius), 0)
  return Math.sqrt(dx * dx + dy * dy) - radius
}

function ringDist(px, py, cx, cy, radius, thickness) {
  const d = Math.hypot(px - cx, py - cy)
  return Math.abs(d - radius) - thickness / 2
}

function drawIcon(size, { maskable = false } = {}) {
  const pixels = Buffer.alloc(size * size * 4)
  const s = size

  // safe zone padding for maskable icons (must fill edge-to-edge with bg)
  const pad = maskable ? s * 0.18 : s * 0.12

  const cupHalfW = (s - pad * 2) * 0.32
  const cupHalfH = (s - pad * 2) * 0.24
  const cupCx = s * 0.46
  const cupCy = s * 0.56
  const cupRadius = cupHalfH * 0.35

  const handleCx = cupCx + cupHalfW + cupHalfH * 0.35
  const handleCy = cupCy
  const handleRadius = cupHalfH * 0.55
  const handleThickness = cupHalfH * 0.32

  const saucerHalfW = cupHalfW * 1.35
  const saucerY = cupCy + cupHalfH + s * 0.02
  const saucerThickness = s * 0.03

  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      let isFg = false

      // steam: three short diagonal strokes above the cup
      for (let i = -1; i <= 1; i++) {
        const steamCx = cupCx + i * cupHalfH * 0.55
        const steamTop = cupCy - cupHalfH - s * 0.22
        const steamBottom = cupCy - cupHalfH - s * 0.06
        if (y >= steamTop && y <= steamBottom) {
          const t = (y - steamTop) / (steamBottom - steamTop)
          const wave = Math.sin(t * Math.PI * 1.5) * cupHalfH * 0.18
          if (Math.abs(x - (steamCx + wave)) < s * 0.012) isFg = true
        }
      }

      // saucer line
      if (Math.abs(y - saucerY) < saucerThickness && Math.abs(x - cupCx) < saucerHalfW) {
        isFg = true
      }

      // handle (ring)
      if (ringDist(x, y, handleCx, handleCy, handleRadius, handleThickness) < 0) isFg = true

      // cup body outline (rounded rect, stroke only)
      const d = roundedRectDist(x, y, cupCx, cupCy, cupHalfW, cupHalfH, cupRadius)
      if (d < 0 && d > -(s * 0.045)) isFg = true

      const off = (y * s + x) * 4
      const color = isFg ? FG : BG
      pixels[off] = color[0]
      pixels[off + 1] = color[1]
      pixels[off + 2] = color[2]
      pixels[off + 3] = 255
    }
  }

  return encodePNG(s, s, pixels)
}

const outDir = path.join(__dirname, '..', 'public', 'icons')
fs.mkdirSync(outDir, { recursive: true })

const targets = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'maskable-512.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180 },
]

for (const t of targets) {
  const png = drawIcon(t.size, { maskable: t.maskable })
  fs.writeFileSync(path.join(outDir, t.name), png)
  console.log('wrote', t.name)
}
