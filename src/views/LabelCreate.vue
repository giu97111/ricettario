<template>
  <div class="fade-in">
    <div class="print:hidden mb-6">
      <RouterLink to="/" class="btn-ghost">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Indietro
      </RouterLink>
    </div>

    <div class="print:hidden mb-8">
      <h1 class="text-3xl font-black tracking-tight text-[var(--color-dark)] mb-1">Nuova etichetta</h1>
      <p class="text-sm text-[var(--color-muted)]">Crea un'etichetta da zero, senza salvare una ricetta.</p>
    </div>

    <!-- Form -->
    <div class="print:hidden card p-6 mb-8">
      <div class="text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-muted)] mb-5">Contenuto etichetta</div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div class="sm:col-span-2">
          <label class="text-xs font-medium text-[var(--color-muted)] mb-1.5 block">
            Titolo <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            placeholder="Es. Croissant al burro"
            class="input-field !text-sm"
            required
          />
        </div>
        <div class="sm:col-span-2">
          <label class="text-xs font-medium text-[var(--color-muted)] mb-1.5 block">Ingredienti</label>
          <textarea
            v-model="form.ingredients"
            rows="3"
            placeholder="Es. Farina, burro, zucchero, uova, lievito..."
            class="input-field !text-sm resize-y min-h-[80px]"
          />
        </div>
        <div>
          <label class="text-xs font-medium text-[var(--color-muted)] mb-1.5 block">Data produzione</label>
          <input v-model="form.productionDate" type="date" class="input-field !text-sm" />
        </div>
        <div>
          <label class="text-xs font-medium text-[var(--color-muted)] mb-1.5 block">Data scadenza</label>
          <input v-model="form.expiryDate" type="date" class="input-field !text-sm" />
        </div>
      </div>
    </div>

    <!-- Print settings -->
    <div class="print:hidden card p-6 mb-8">
      <div class="text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-muted)] mb-5">Impostazioni stampa</div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="text-xs font-medium text-[var(--color-muted)] mb-1.5 block">Formato etichetta</label>
          <select v-model="labelSize" class="input-field !text-sm">
            <option v-for="opt in labelSizeOptions" :key="opt.id" :value="opt.id">
              {{ opt.label }}
            </option>
          </select>
        </div>
        <div>
          <label class="text-xs font-medium text-[var(--color-muted)] mb-1.5 block">Numero lotto</label>
          <input v-model="lotNumber" type="text" class="input-field !text-sm !font-mono" />
        </div>
        <div>
          <label class="text-xs font-medium text-[var(--color-muted)] mb-1.5 block">Copie</label>
          <input v-model.number="labelCount" type="number" min="1" max="20" class="input-field !text-sm" />
        </div>
        <div class="flex items-end">
          <button type="button" class="btn-secondary w-full !text-sm" @click="regenerateLot">
            Rigenera lotto
          </button>
        </div>
      </div>
      <div class="rounded-xl bg-[var(--color-accent-light)] px-4 py-3 text-xs text-[#6b5a42] leading-relaxed">
        <strong class="text-[var(--color-dark)]">Nel dialogo di stampa (Windows):</strong>
        stampante Clabel, carta <strong>{{ activeSize.label }}</strong>, scala <strong>100%</strong>,
        <strong>Bianco e nero</strong>, margini zero,
        attiva <strong>«Grafica di sfondo»</strong> se l'etichetta esce bianca.
      </div>
    </div>

    <!-- Preview & actions -->
    <div id="print-area">
      <div class="print:hidden flex flex-wrap justify-center gap-4 mb-8">
        <button
          @click="doPrint"
          :disabled="!canPrint || printing"
          class="px-12 py-4 bg-[var(--color-accent)] hover:bg-[#a6854f] disabled:opacity-60 text-white text-lg font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center gap-3"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          {{ printing ? 'Preparazione…' : 'Stampa etichette' }}
        </button>
        <button
          @click="doDownload"
          :disabled="!canPrint || !previewImages.length"
          class="px-8 py-4 bg-white hover:bg-gray-50 disabled:opacity-60 text-[var(--color-dark)] text-lg font-bold rounded-2xl transition-all shadow border border-black/10 flex items-center gap-3"
        >
          Scarica PNG
        </button>
      </div>

      <div v-if="!canPrint" class="print:hidden text-center text-sm text-[var(--color-muted)] mb-6">
        Inserisci almeno il titolo per vedere l'anteprima.
      </div>

      <div v-else class="print:hidden text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-muted)] mb-4 text-center">
        Anteprima (identica alla stampa)
      </div>

      <div class="label-preview-grid">
        <img
          v-for="(preview, index) in previewImages"
          :key="index"
          :src="preview"
          :alt="`Etichetta ${index + 1}`"
          class="label-preview-img"
          :width="activeSize.w * 8"
          :height="activeSize.h * 8"
          :style="previewStyle"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { renderLabelDataUrl, downloadLabelPng, openLabelPrintWindow } from '@/utils/labelCanvas'

const labelSizeOptions = [
  { id: '40x30', label: '40 × 30 mm (rotolo in dotazione)', w: 40, h: 30 },
  { id: '50x30', label: '50 × 30 mm (consigliato)', w: 50, h: 30 },
  { id: '58x40', label: '58 × 40 mm (max CT221D)', w: 58, h: 40 },
]

const form = ref({
  title: '',
  ingredients: '',
  productionDate: '',
  expiryDate: '',
})

const labelCount = ref(1)
const labelSize = ref('50x30')
const printing = ref(false)
const previewImages = ref([])
const lotNumber = ref('')

const pad = (n) => String(n).padStart(2, '0')

const activeSize = computed(() => labelSizeOptions.find((o) => o.id === labelSize.value) || labelSizeOptions[0])

const canPrint = computed(() => form.value.title.trim().length > 0)

const previewStyle = computed(() => ({
  width: `min(100%, ${activeSize.value.w * 8}px)`,
  aspectRatio: `${activeSize.value.w} / ${activeSize.value.h}`,
}))

function formatDateInput(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

function generateLotCode(name) {
  const code = (name || 'XXXX')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 4)
    .padEnd(4, 'X')
  const now = new Date()
  const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
  const timeStr = `${pad(now.getHours())}${pad(now.getMinutes())}`
  return `LOT-${dateStr}-${timeStr}-${code}-001`
}

function regenerateLot() {
  lotNumber.value = generateLotCode(form.value.title)
}

onMounted(() => {
  refreshPreviews()
})

function buildLabelImage(copyIndex) {
  const { w, h } = activeSize.value
  const lot = lotNumber.value.trim()
  return renderLabelDataUrl({
    wMm: w,
    hMm: h,
    name: form.value.title.trim(),
    ingredients: form.value.ingredients.trim(),
    notes: '',
    lot: lot || '',
    prod: formatDateInput(form.value.productionDate),
    scad: formatDateInput(form.value.expiryDate),
    scale: 1,
  })
}

function refreshPreviews() {
  if (!canPrint.value) {
    previewImages.value = []
    return
  }
  previewImages.value = Array.from({ length: labelCount.value }, (_, i) => buildLabelImage(i + 1))
}

watch(
  [form, labelCount, labelSize, lotNumber, canPrint],
  refreshPreviews,
  { deep: true },
)

function doPrint() {
  if (!canPrint.value || printing.value) return
  printing.value = true

  try {
    const { w, h } = activeSize.value
    const images = Array.from({ length: labelCount.value }, (_, i) => buildLabelImage(i + 1))
    const printWindow = openLabelPrintWindow({ wMm: w, hMm: h, dataUrls: images })

    if (!printWindow) {
      alert('Abilita i popup per stampare, oppure riprova.')
    }
  } finally {
    printing.value = false
  }
}

function doDownload() {
  if (!canPrint.value || !previewImages.value.length) return
  previewImages.value.forEach((url, i) => {
    const name = (form.value.title || 'etichetta').replace(/[^a-z0-9]/gi, '-').toLowerCase()
    downloadLabelPng(url, `${name}-${i + 1}.png`)
  })
}
</script>

<style scoped>
.label-preview-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  justify-content: center;
}

.label-preview-img {
  display: block;
  border: 2px solid #000;
  border-radius: 0.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  background: #fff;
  image-rendering: pixelated;
}
</style>
