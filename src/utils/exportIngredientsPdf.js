import { jsPDF } from 'jspdf'

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

const SITE_URL_FULL = 'https://ricettario-8614b.web.app'
const BRAND = 'Ricettario'
const SUBBRAND = 'X CIP'

function rgbParts(tuple, fb = [0, 0, 0]) {
  const a = Array.isArray(tuple) && tuple.length >= 3 ? tuple : fb
  return [Number(a[0]) || 0, Number(a[1]) || 0, Number(a[2]) || 0]
}

/**
 * Nomi ingredienti distinti da tutte le ricette, ordinati A-Z (it).
 * Nessuna ricetta, nessuna quantità.
 */
export function uniqueIngredientNamesSorted(recipes) {
  const map = new Map()
  for (const recipe of recipes) {
    for (const ing of recipe.ingredients || []) {
      const raw = (ing.name || '').trim()
      if (!raw) continue
      const key = raw.toLowerCase()
      if (!map.has(key)) map.set(key, raw)
    }
  }
  return [...map.values()].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' }))
}

/**
 * PDF: solo elenco alfabetico degli ingredienti (nessuna ricetta, nessuna quantità).
 */
export function exportIngredientsToPdf(recipes) {
  const names = uniqueIngredientNamesSorted(recipes)
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 20
  const maxW = pageW - margin * 2

  function setFill(c) {
    const [r, g, b] = rgbParts(c)
    doc.setFillColor(r, g, b)
  }
  function setDraw(c, w = 0.25) {
    const [r, g, b] = rgbParts(c)
    doc.setDrawColor(r, g, b)
    doc.setLineWidth(w)
  }
  function setText(c) {
    const [r, g, b] = rgbParts(c)
    doc.setTextColor(r, g, b)
  }

  /** Copertina */
  setFill(C.chocolate)
  doc.rect(0, 0, pageW, pageH, 'F')
  setFill([30, 26, 22])
  doc.rect(0, 0, pageW * 0.5, pageH * 0.4, 'F')

  setDraw(C.accent, 0.35)
  doc.roundedRect(11, 11, pageW - 22, pageH - 22, 2, 2, 'S')
  setDraw(C.accent, 0.12)
  doc.roundedRect(13, 13, pageW - 26, pageH - 26, 1.5, 1.5, 'S')

  setText(C.cream)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.text('Lista ingredienti', pageW / 2, 72, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  setText(C.accent)
  doc.text(SUBBRAND, pageW / 2, 82, { align: 'center' })

  setText([190, 180, 165])
  doc.setFontSize(8.5)
  doc.text('Solo nomi · ordine alfabetico · senza ricette', pageW / 2, 93, { align: 'center' })

  setDraw(C.accent, 0.18)
  doc.line(margin + 30, 102, pageW - margin - 30, 102)

  const n = names.length
  doc.setFontSize(11)
  setText(C.accent)
  doc.setFont('helvetica', 'bold')
  doc.text(
    n === 0 ? 'Nessun ingrediente' : n === 1 ? '1 ingrediente' : `${n} ingredienti`,
    pageW / 2,
    118,
    { align: 'center' }
  )

  const ty = pageH - 36
  setDraw(C.accent, 0.12)
  doc.line(margin, ty, pageW - margin, ty)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  setText(C.accent)
  doc.text(SITE_URL_FULL, pageW / 2, ty + 8, { align: 'center' })
  doc.setFontSize(7)
  setText([115, 105, 95])
  doc.text(`${BRAND} · ${SUBBRAND}`, pageW / 2, ty + 15, { align: 'center' })

  if (names.length === 0) {
    return doc.output('blob')
  }

  doc.addPage()
  let y = margin

  setFill(C.paper)
  doc.rect(0, 0, pageW, pageH, 'F')

  setFill(C.dark)
  doc.rect(0, 0, pageW, 34, 'F')
  setFill(C.accent)
  doc.rect(0, 34, pageW, 1, 'F')
  setText(C.white)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('Ingredienti', margin, 22)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  setText(C.accent)
  doc.text('Elenco unico · A → Z', margin, 30)

  y = 46

  function newPage() {
    doc.addPage()
    setFill(C.paper)
    doc.rect(0, 0, pageW, pageH, 'F')
    setFill(C.dark)
    doc.rect(0, 0, pageW, 11, 'F')
    setFill(C.accent)
    doc.rect(0, 11, pageW, 0.5, 'F')
    setText(C.white)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text('Ingredienti · segue', margin, 8)
    y = margin + 6
  }

  function needSpace(h) {
    if (y + h > pageH - 18) newPage()
  }

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10.5)
  setText(C.dark)

  let i = 0
  for (const name of names) {
    needSpace(8)
    i++
    const label = `${String(i).padStart(2, '0')}. ${name}`
    setFill(i % 2 === 0 ? [252, 250, 246] : C.paper)
    doc.roundedRect(margin - 1, y - 5, maxW + 2, 8, 1, 1, 'F')
    setDraw([235, 230, 222], 0.06)
    doc.roundedRect(margin - 1, y - 5, maxW + 2, 8, 1, 1, 'S')

    setText(C.dark)
    doc.text(label, margin + 3, y + 0.5)

    y += 10
  }

  const totalPages = doc.internal.getNumberOfPages()
  applyIngredientFooters(doc, pageW, pageH, margin, totalPages)

  return doc.output('blob')
}

function applyIngredientFooters(doc, pageW, pageH, margin, totalPages) {
  const footY = pageH - 10
  const [ar, ag, ab] = rgbParts(C.accent)
  const [mr, mg, mb] = rgbParts(C.muted)
  const [dr, dg, db] = rgbParts(C.accentDark)
  for (let i = 2; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setDrawColor(ar, ag, ab)
    doc.setLineWidth(0.12)
    doc.line(margin, footY - 4, pageW - margin, footY - 4)
    doc.setFontSize(7)
    doc.setTextColor(mr, mg, mb)
    doc.setFont('helvetica', 'normal')
    doc.text(`${BRAND} · Lista ingredienti`, margin, footY)
    doc.setTextColor(dr, dg, db)
    doc.text(SITE_URL_FULL.replace('https://', ''), pageW / 2, footY, { align: 'center' })
    doc.setTextColor(mr, mg, mb)
    doc.text(`${i} / ${totalPages}`, pageW - margin, footY, { align: 'right' })
  }
}
