import { jsPDF } from 'jspdf'

/** CT221D: 203 dpi ≈ 8 px/mm */
const PX_PER_MM = 8

export function mmToPx(mm) {
  return Math.round(mm * PX_PER_MM)
}

function setFont(ctx, weight, size) {
  ctx.font = `${weight} ${size}px Arial, Helvetica, sans-serif`
}

function textWidth(ctx, text) {
  return ctx.measureText(text).width
}

function fitFontSize(ctx, text, maxWidth, startSize, minSize, weight = 700) {
  let size = startSize
  while (size >= minSize) {
    setFont(ctx, weight, size)
    if (textWidth(ctx, text) <= maxWidth) return size
    size -= 1
  }
  return minSize
}

function fillText(ctx, text, x, y) {
  ctx.fillText(text, x, y)
}

function fillSemiBold(ctx, text, x, y) {
  ctx.fillText(text, x, y)
  ctx.fillText(text, x + 1, y)
}

function wrapLines(ctx, text, maxWidth) {
  if (!text) return []

  const chunks = text.includes(',')
    ? text.split(',').map((s) => s.trim()).filter(Boolean)
    : text.split(/\s+/).filter(Boolean)

  const lines = []
  let line = ''

  for (const chunk of chunks) {
    const separator = text.includes(',') ? (line ? ', ' : '') : (line ? ' ' : '')
    const candidate = `${line}${separator}${chunk}`

    if (textWidth(ctx, candidate) <= maxWidth) {
      line = candidate
      continue
    }

    if (line) lines.push(line)

    if (textWidth(ctx, chunk) <= maxWidth) {
      line = chunk
      continue
    }

    let part = ''
    for (const char of chunk) {
      const next = part + char
      if (textWidth(ctx, next) > maxWidth && part) {
        lines.push(part)
        part = char
      } else {
        part = next
      }
    }
    line = part
  }

  if (line) lines.push(line)
  return lines
}

function hasValue(value) {
  if (value == null) return false
  const text = String(value).trim()
  return text !== '' && text !== '-'
}

function drawField(ctx, { label, value, x, y, maxWidth, labelSize, valueSize, minValueSize, gapAfter }) {
  setFont(ctx, 600, labelSize)
  fillText(ctx, label, x, y)
  y += labelSize * 1.15

  const size = fitFontSize(ctx, value, maxWidth, valueSize, minValueSize, 700)
  setFont(ctx, 700, size)
  fillSemiBold(ctx, value, x, y)

  return y + size + gapAfter
}

export function renderLabelCanvas({
  wMm,
  hMm,
  name,
  ingredients,
  notes,
  lot,
  prod,
  scad,
  scale,
}) {
  const width = mmToPx(wMm)
  const height = mmToPx(hMm)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d', { alpha: false })
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = '#000000'
  ctx.textBaseline = 'top'

  const pad = Math.max(5, Math.round(Math.min(width, height) * 0.035))
  const gapSm = Math.max(3, Math.round(height * 0.014))
  const gapMd = Math.max(4, Math.round(height * 0.022))
  const gapLg = Math.max(5, Math.round(height * 0.03))
  const contentW = width - pad * 2
  const isSmall = hMm <= 30

  const labelSize = Math.max(9, Math.round(height * (isSmall ? 0.052 : 0.058)))
  const dateSize = Math.max(16, Math.round(height * (isSmall ? 0.10 : 0.105)))
  const minDateSize = Math.max(13, Math.round(height * 0.07))
  const nameSize = Math.max(14, Math.round(height * (isSmall ? 0.095 : 0.105)))
  const minNameSize = Math.max(11, Math.round(height * 0.065))
  const lotSize = Math.max(10, Math.round(height * (isSmall ? 0.05 : 0.055)))
  const ingSize = Math.max(10, Math.round(height * (isSmall ? 0.048 : 0.052)))

  const productName = (name || '').trim().toUpperCase()
  const showProd = hasValue(prod)
  const showScad = hasValue(scad)
  const showLot = hasValue(lot)
  const showScale = scale && scale !== 1
  const showIngredients = hasValue(ingredients)
  const showNotes = hasValue(notes)
  const metaCount = [showProd, showScad, showLot, showScale].filter(Boolean).length
  const bottomCount = [showIngredients, showNotes].filter(Boolean).length
  const onlyTitle = productName && metaCount === 0 && bottomCount === 0

  if (onlyTitle) {
    const maxH = height - pad * 2
    const startSize = Math.round(Math.min(maxH * 0.55, contentW * 0.22))
    const minSize = Math.max(12, Math.round(height * 0.075))
    const fittedNameSize = fitFontSize(ctx, productName, contentW, startSize, minSize, 700)
    setFont(ctx, 700, fittedNameSize)
    const y = pad + Math.max(0, (maxH - fittedNameSize) / 2)
    fillSemiBold(ctx, productName, pad, y)
    return canvas
  }

  const titleBoost = metaCount === 0 && bottomCount > 0 ? 1.18 : 1
  const topOffset = metaCount === 0 ? Math.round(height * 0.06) : Math.round(height * 0.12)
  let y = pad + topOffset

  if (productName) {
    const boostedNameSize = Math.round(nameSize * titleBoost)
    const boostedMinNameSize = Math.round(minNameSize * titleBoost)
    const fittedNameSize = fitFontSize(ctx, productName, contentW, boostedNameSize, boostedMinNameSize, 700)
    setFont(ctx, 700, fittedNameSize)
    fillSemiBold(ctx, productName, pad, y)
    y += fittedNameSize + gapLg
  }

  if (showProd) {
    y = drawField(ctx, {
      label: 'PRODOTTO IL',
      value: prod,
      x: pad,
      y,
      maxWidth: contentW,
      labelSize,
      valueSize: dateSize,
      minValueSize: minDateSize,
      gapAfter: gapMd,
    })
  }

  if (showScad) {
    y = drawField(ctx, {
      label: 'SCADENZA',
      value: scad,
      x: pad,
      y,
      maxWidth: contentW,
      labelSize,
      valueSize: Math.round(dateSize * 0.92),
      minValueSize: minDateSize,
      gapAfter: gapMd,
    })
  }

  if (showLot) {
    const lotText = lot.startsWith('LOT') ? lot : `LOT ${lot}`
    const fittedLotSize = fitFontSize(ctx, lotText, contentW, lotSize + 1, lotSize, 600)
    setFont(ctx, 600, fittedLotSize)
    fillText(ctx, lotText, pad, y)
    y += fittedLotSize + gapLg
  }

  if (showScale) {
    const scaleText = `SCALA ${scale}x`
    setFont(ctx, 600, lotSize)
    fillText(ctx, scaleText, pad, y)
    y += lotSize + gapMd
  }

  if (bottomCount > 0) {
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(pad, y)
    ctx.lineTo(width - pad, y)
    ctx.stroke()
    y += gapSm + 1
  }

  const remaining = height - pad - y
  const ingLineH = ingSize * 1.14
  const maxIngLines = showNotes
    ? Math.max(1, Math.floor(remaining / ingLineH) - 1)
    : Math.max(1, Math.floor(remaining / ingLineH))

  if (showIngredients) {
    setFont(ctx, 500, ingSize)
    const ingLines = wrapLines(ctx, ingredients, contentW)
    for (let i = 0; i < Math.min(maxIngLines, ingLines.length); i += 1) {
      fillText(ctx, ingLines[i], pad, y)
      y += ingLineH
    }
    if (ingLines.length > maxIngLines && maxIngLines > 0) {
      fillText(ctx, `${ingLines[maxIngLines - 1].slice(0, -1)}…`, pad, y - ingLineH)
    }
  }

  if (showNotes && y + ingLineH <= height - pad) {
    setFont(ctx, 500, Math.max(9, ingSize - 1))
    const noteLine = wrapLines(ctx, notes, contentW)[0] || ''
    fillText(ctx, noteLine, pad, y)
  }

  return canvas
}

export function renderLabelDataUrl(options) {
  return renderLabelCanvas(options).toDataURL('image/png')
}

/** Driver Clabel: PDF portrait (pagina stretta), immagine scalata alla larghezza pagina */
export function buildLabelPdfBlob({ wMm, hMm, dataUrls }) {
  const doc = new jsPDF({ unit: 'mm', format: [wMm, hMm], compress: false })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const imgW = pageW
  const imgH = (hMm / wMm) * pageW
  const y = Math.max(0, (pageH - imgH) / 2)

  dataUrls.forEach((dataUrl, index) => {
    if (index > 0) {
      doc.addPage([wMm, hMm])
    }
    doc.addImage(dataUrl, 'PNG', 0, y, imgW, imgH, undefined, 'FAST')
  })

  return doc.output('blob')
}

export function openLabelPrintPdf({ wMm, hMm, dataUrls }) {
  const blob = buildLabelPdfBlob({ wMm, hMm, dataUrls })
  const url = URL.createObjectURL(blob)
  const printWindow = window.open(url, '_blank')

  if (!printWindow) {
    URL.revokeObjectURL(url)
    return null
  }

  printWindow.addEventListener('load', () => {
    URL.revokeObjectURL(url)
  })

  return printWindow
}

export function downloadLabelPng(dataUrl, filename) {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  link.click()
}

/** Pagina minimale: una sola etichetta per pagina, niente layout dell'app */
export function openLabelPrintWindow({ wMm, hMm, dataUrls }) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    return null
  }

  const pages = dataUrls
    .map((url, index) => {
      const pageBreak = index < dataUrls.length - 1 ? 'page-break-after:always;break-after:page;' : ''
      return `<img src="${url}" alt="" style="width:${wMm}mm;height:${hMm}mm;display:block;${pageBreak}-webkit-print-color-adjust:exact;print-color-adjust:exact;">`
    })
    .join('')

  printWindow.document.open()
  printWindow.document.write(`<!DOCTYPE html>
<html lang="it"><head>
<meta charset="utf-8">
<title>Etichetta ${wMm}×${hMm} mm</title>
<style>
  @page { size: ${wMm}mm ${hMm}mm; margin: 0; }
  html, body { margin: 0; padding: 0; }
  img { margin: 0; padding: 0; border: 0; vertical-align: top; }
</style>
</head><body>${pages}</body></html>`)
  printWindow.document.close()

  const printWhenReady = () => {
    const imgs = [...printWindow.document.images]
    const ready = imgs.length
      ? Promise.all(
          imgs.map((img) =>
            img.complete && img.naturalWidth > 0
              ? Promise.resolve()
              : new Promise((resolve) => {
                  img.onload = resolve
                  img.onerror = resolve
                }),
          ),
        )
      : Promise.resolve()

    ready.then(() => setTimeout(() => printWindow.print(), 200))
  }

  if (printWindow.document.readyState === 'complete') {
    printWhenReady()
  } else {
    printWindow.onload = printWhenReady
  }

  return printWindow
}
