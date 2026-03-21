import { jsPDF } from 'jspdf'

/** Palette Ricettario X CIP (allineata a style.css) */
const C = {
  dark: [26, 26, 26],
  accent: [200, 169, 126],
  accentDark: [139, 115, 85],
  cream: [245, 239, 230],
  paper: [250, 250, 248],
  muted: [138, 138, 138],
  white: [255, 255, 255],
  chocolate: [18, 16, 14],
}

const SITE_URL = 'ricettario-8614b.web.app'
const SITE_URL_FULL = `https://${SITE_URL}`
const BRAND = 'Ricettario'
const SUBBRAND = 'X CIP'

/**
 * Esporta tutte le ricette in un PDF premium con copertina pasticceria
 */
export function exportRecipesToPdf(recipes) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 22
  const maxW = pageW - margin * 2

  function setFill(rgb) {
    doc.setFillColor(rgb[0], rgb[1], rgb[2])
  }
  function setDraw(rgb, width = 0.35) {
    doc.setDrawColor(rgb[0], rgb[1], rgb[2])
    doc.setLineWidth(width)
  }
  function setText(rgb) {
    doc.setTextColor(rgb[0], rgb[1], rgb[2])
  }

  /** Copertina — full bleed dark + oro + elementi pasticceria */
  function drawCover() {
    setFill(C.chocolate)
    doc.rect(0, 0, pageW, pageH, 'F')

    // Velatura calda (sovrapposizione rettangoli — effetto luce)
    setFill([38, 34, 30])
    doc.rect(0, 0, pageW * 0.55, pageH * 0.45, 'F')
    setFill([28, 25, 22])
    doc.rect(pageW * 0.45, 0, pageW * 0.55, pageH * 0.38, 'F')

    // Cornice doppia oro
    setDraw(C.accent, 0.4)
    doc.roundedRect(12, 12, pageW - 24, pageH - 24, 2, 2, 'S')
    setDraw(C.accent, 0.15)
    doc.roundedRect(14, 14, pageW - 28, pageH - 28, 1.5, 1.5, 'S')

    // Decorazioni “macaron” / pasticcini (cerchi)
    const mac = [
      [pageW - 38, 28, 4.5],
      [pageW - 28, 36, 3.8],
      [pageW - 46, 38, 3.2],
      [22, pageH - 48, 5],
      [32, pageH - 38, 3.5],
    ]
    for (const [x, y, r] of mac) {
      setFill(C.accent)
      doc.circle(x, y, r, 'F')
      setFill([210, 195, 170])
      doc.circle(x, y - r * 0.35, r * 0.85, 'F')
      setFill(C.accentDark)
      doc.setLineWidth(0.1)
      doc.setDrawColor(...C.accentDark)
      doc.circle(x, y, r, 'S')
    }

    // Spirali “glassa” con segmenti (bezier approssimata)
    setDraw(C.accent, 0.2)
    for (let s = 0; s < 3; s++) {
      const ox = 22 + s * 6
      const oy = 52 + s * 4
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 1.2
        const a2 = ((i + 1) / 12) * Math.PI * 1.2
        doc.line(
          ox + 18 * Math.cos(a),
          oy + 6 * Math.sin(a),
          ox + 18 * Math.cos(a2),
          oy + 6 * Math.sin(a2)
        )
      }
    }
    doc.line(pageW - 52, pageH - 62, pageW - 28, pageH - 78)
    doc.line(pageW - 48, pageH - 58, pageW - 24, pageH - 72)

    // Monogramma XC
    const boxX = pageW / 2 - 14
    const boxY = 62
    setFill(C.dark)
    doc.roundedRect(boxX, boxY, 28, 28, 4, 4, 'F')
    setDraw(C.accent, 0.3)
    doc.roundedRect(boxX, boxY, 28, 28, 4, 4, 'S')
    setText(C.white)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.text('XC', pageW / 2, boxY + 18, { align: 'center' })

    // Titolo principale
    setText(C.cream)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(28)
    doc.text(BRAND, pageW / 2, 118, { align: 'center' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    setText(C.accent)
    doc.text(SUBBRAND, pageW / 2, 128, { align: 'center' })

    doc.setFontSize(8.5)
    setText([180, 170, 155])
    doc.text('COLLEZIONE PASTICCERIA ARTIGIANALE', pageW / 2, 138, { align: 'center' })

    // Fregio centrale (linee + punto oro)
    const midY = 145
    setDraw(C.accent, 0.25)
    doc.line(margin + 35, midY, pageW / 2 - 8, midY)
    doc.line(pageW / 2 + 8, midY, pageW - margin - 35, midY)
    setFill(C.accent)
    doc.circle(pageW / 2, midY, 1.2, 'F')

    // Pattern puntinato premium (angoli)
    setFill(C.accent)
    for (let px = 0; px < 5; px++) {
      for (let py = 0; py < 4; py++) {
        doc.circle(18 + px * 4.5, pageH - 58 + py * 3.5, 0.35, 'F')
        doc.circle(pageW - 18 - px * 4.5, pageH - 58 + py * 3.5, 0.35, 'F')
      }
    }

    // Linea divisoria sottile
    setDraw(C.accent, 0.2)
    doc.line(margin + 25, 152, pageW - margin - 25, 152)

    doc.setFont('helvetica', 'italic')
    doc.setFontSize(9)
    setText([200, 190, 175])
    const tag =
      'Ricette selezionate con cura — ingredienti, preparazione e note per la tua produzione dolciaria.'
    const tagLines = doc.splitTextToSize(tag, maxW - 20)
    let ty = 160
    for (const line of tagLines) {
      doc.text(line, pageW / 2, ty, { align: 'center' })
      ty += 4.5
    }

    // Conteggio ricette
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    setText(C.accent)
    doc.text(`${recipes.length} ricett${recipes.length === 1 ? 'a' : 'e'}`, pageW / 2, ty + 10, { align: 'center' })

    // Footer sito
    ty = pageH - 38
    setDraw(C.accent, 0.15)
    doc.line(margin, ty, pageW - margin, ty)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    setText(C.accent)
    doc.text(SITE_URL_FULL, pageW / 2, ty + 8, { align: 'center' })
    doc.setFontSize(7)
    setText([120, 110, 100])
    doc.text('Documento generato dal Ricettario X CIP', pageW / 2, ty + 14, { align: 'center' })

    const now = new Date().toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
    doc.text(now, pageW / 2, ty + 20, { align: 'center' })
  }

  /** Pagina indice */
  function drawToc() {
    doc.addPage()
    setFill(C.paper)
    doc.rect(0, 0, pageW, pageH, 'F')

    // Header strip
    setFill(C.dark)
    doc.rect(0, 0, pageW, 32, 'F')
    setText(C.white)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.text('Indice', margin, 21)

    setText(C.accent)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.text(SUBBRAND, pageW - margin, 21, { align: 'right' })

    let y = 48
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    setText(C.dark)

    recipes.forEach((r, i) => {
      if (y > pageH - 28) {
        doc.addPage()
        setFill(C.paper)
        doc.rect(0, 0, pageW, pageH, 'F')
        setFill(C.dark)
        doc.rect(0, 0, pageW, 14, 'F')
        setText(C.white)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        doc.text('Indice (segue)', margin, 10)
        y = 24
      }
      const num = String(i + 1).padStart(2, '0')
      setText(C.accent)
      doc.setFont('helvetica', 'bold')
      doc.text(num, margin, y)
      setText(C.dark)
      doc.setFont('helvetica', 'normal')
      const title = r.name || 'Senza titolo'
      doc.text(title, margin + 12, y)
      setDraw([220, 215, 205], 0.1)
      doc.line(margin + 12, y + 2, pageW - margin, y + 2)
      y += 11
    })
  }

  /** Footer su tutte le pagine tranne copertina (pag. 1) */
  function applyFootersToAllPages() {
    const total = doc.internal.getNumberOfPages()
    const footY = pageH - 11
    for (let i = 2; i <= total; i++) {
      doc.setPage(i)
      setDraw(C.accent, 0.12)
      doc.line(margin, footY - 5, pageW - margin, footY - 5)
      doc.setFontSize(7)
      setText(C.muted)
      doc.setFont('helvetica', 'normal')
      doc.text(`${BRAND} · ${SUBBRAND}`, margin, footY)
      setText(C.accentDark)
      doc.text(SITE_URL_FULL, pageW / 2, footY, { align: 'center' })
      setText(C.muted)
      doc.text(`${i} / ${total}`, pageW - margin, footY, { align: 'right' })
    }
  }

  /** Barra continua su pagine successive della stessa ricetta */
  function drawRecipeContinuationHeader(recipeName, index) {
    setFill(C.dark)
    doc.rect(0, 0, pageW, 12, 'F')
    setFill(C.accent)
    doc.rect(0, 12, pageW, 0.6, 'F')
    setText(C.white)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    const short =
      (recipeName || 'Ricetta').length > 58
        ? `${(recipeName || '').slice(0, 55)}…`
        : recipeName || 'Ricetta'
    doc.text(`${short}  ·  segue`, margin, 8)
    setText(C.accent)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.text(`N. ${String(index + 1).padStart(2, '0')}`, pageW - margin, 8, { align: 'right' })
  }

  /** Pagina ricetta */
  function drawRecipe(r, index) {
    doc.addPage()

    setFill(C.paper)
    doc.rect(0, 0, pageW, pageH, 'F')

    // Band superiore elegante
    setFill(C.dark)
    doc.rect(0, 0, pageW, 42, 'F')
    setFill(C.accent)
    doc.rect(0, 42, pageW, 1.2, 'F')

    setText(C.white)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    const title = r.name || 'Senza titolo'
    const titleLines = doc.splitTextToSize(title, maxW)
    let hy = 22
    for (const line of titleLines.slice(0, 3)) {
      doc.text(line, margin, hy)
      hy += 8
    }

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    setText(C.accent)
    const cat = r.category ? r.category : 'Pasticceria'
    doc.text(cat.toUpperCase(), margin, 38)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    setText([180, 175, 170])
    doc.text(`N. ${String(index + 1).padStart(2, '0')}`, pageW - margin, 24, { align: 'right' })

    let y = 56

    function section(label) {
      y += 4
      setText(C.accentDark)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.text(label.toUpperCase(), margin, y)
      setDraw(C.accent, 0.25)
      doc.line(margin, y + 2, margin + 32, y + 2)
      y += 10
    }

    function bodyText(text, size = 10) {
      if (!text) return
      setText(C.dark)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(size)
      const lines = doc.splitTextToSize(String(text), maxW)
      for (const line of lines) {
        if (y > pageH - 28) {
          doc.addPage()
          setFill(C.paper)
          doc.rect(0, 0, pageW, pageH, 'F')
          drawRecipeContinuationHeader(r.name, index)
          y = margin + 14
        }
        doc.text(line, margin, y)
        y += size * 0.45
      }
      y += 3
    }

    if (r.description) {
      section('Presentazione')
      bodyText(r.description, 10)
    }

    section('Ingredienti')
    if (r.ingredients?.length) {
      for (const ing of r.ingredients) {
        if (y > pageH - 32) {
          doc.addPage()
          setFill(C.paper)
          doc.rect(0, 0, pageW, pageH, 'F')
          drawRecipeContinuationHeader(r.name, index)
          y = margin + 14
        }
        const qty = ing.unit === 'q.b.' ? 'q.b.' : `${ing.quantity} ${ing.unit}`
        setFill(C.cream)
        doc.roundedRect(margin - 1, y - 4.5, maxW + 2, 8, 1.5, 1.5, 'F')
        setText(C.dark)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.text(ing.name || '—', margin + 3, y)
        doc.setFont('helvetica', 'bold')
        doc.text(qty, pageW - margin - 3, y, { align: 'right' })
        y += 11
      }
    } else {
      bodyText('(nessun ingrediente elencato)', 9)
    }

    if (r.instructions) {
      section('Preparazione')
      bodyText(r.instructions, 10)
    }

    if (r.notes) {
      section('Note')
      setText(C.dark)
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(10)
      const noteLines = doc.splitTextToSize(String(r.notes), maxW - 4)
      for (const line of noteLines) {
        if (y > pageH - 28) {
          doc.addPage()
          setFill(C.paper)
          doc.rect(0, 0, pageW, pageH, 'F')
          drawRecipeContinuationHeader(r.name, index)
          y = margin + 14
        }
        doc.text(line, margin + 2, y)
        y += 4.8
      }
      doc.setFont('helvetica', 'normal')
      y += 6
    }

    if (r.expiryDays) {
      if (y > pageH - 22) {
        doc.addPage()
        setFill(C.paper)
        doc.rect(0, 0, pageW, pageH, 'F')
        drawRecipeContinuationHeader(r.name, index)
        y = margin + 14
      }
      setText(C.accentDark)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.text(`Conservazione consigliata: ${r.expiryDays} giorni`, margin, y)
    }
  }

  // Build document
  drawCover()
  if (recipes.length > 0) drawToc()
  recipes.forEach((r, i) => drawRecipe(r, i))

  applyFootersToAllPages()

  return doc.output('blob')
}

export function downloadPdf(blob, filename = 'ricettario.pdf') {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
