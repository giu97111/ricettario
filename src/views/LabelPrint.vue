<template>
  <div class="fade-in">
    <!-- Back button -->
    <div class="print:hidden mb-6">
      <RouterLink to="/" class="btn-ghost">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Indietro
      </RouterLink>
    </div>

    <!-- Settings -->
    <div v-if="recipe" class="print:hidden card p-6 mb-8">
      <div class="text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-muted)] mb-5">Impostazioni etichetta</div>
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-4">
        <div>
          <label class="text-xs font-medium text-[var(--color-muted)] mb-1.5 block">Formato etichetta</label>
          <select v-model="labelSize" class="input-field !text-sm">
            <option v-for="opt in labelSizeOptions" :key="opt.id" :value="opt.id">
              {{ opt.label }}
            </option>
          </select>
        </div>
        <div>
          <label class="text-xs font-medium text-[var(--color-muted)] mb-1.5 block">Data produzione</label>
          <input v-model="productionDate" type="date" class="input-field !text-sm" />
        </div>
        <div>
          <label class="text-xs font-medium text-[var(--color-muted)] mb-1.5 block">Scadenza (gg)</label>
          <input v-model.number="expiryDays" type="number" min="1" class="input-field !text-sm" />
        </div>
        <div>
          <label class="text-xs font-medium text-[var(--color-muted)] mb-1.5 block">Numero lotto</label>
          <input v-model="lotNumber" type="text" class="input-field !text-sm !font-mono" />
        </div>
        <div>
          <label class="text-xs font-medium text-[var(--color-muted)] mb-1.5 block">Copie</label>
          <input v-model.number="labelCount" type="number" min="1" max="20" class="input-field !text-sm" />
        </div>
      </div>
      <div class="rounded-xl bg-[var(--color-accent-light)] px-4 py-3 text-xs text-[#6b5a42] leading-relaxed">
        <strong class="text-[var(--color-dark)]">Nel dialogo di stampa (Windows):</strong>
        stampante Clabel, carta <strong>{{ activeSize.label }}</strong>, scala <strong>100%</strong>,
        <strong>Bianco e nero</strong>, margini zero,
        attiva <strong>«Grafica di sfondo»</strong> se l'etichetta esce bianca.
      </div>
    </div>

    <!-- Loading -->
    <div v-if="!recipe" class="flex justify-center py-24">
      <div class="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Print Area -->
    <div v-else id="print-area">
      <div class="print:hidden flex flex-wrap justify-center gap-4 mb-8">
        <button
          @click="doPrint"
          :disabled="printing"
          class="px-12 py-4 bg-[var(--color-accent)] hover:bg-[#a6854f] disabled:opacity-60 text-white text-lg font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center gap-3"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          {{ printing ? 'Preparazione…' : 'Stampa etichette' }}
        </button>
        <button
          @click="doDownload"
          class="px-8 py-4 bg-white hover:bg-gray-50 text-[var(--color-dark)] text-lg font-bold rounded-2xl transition-all shadow border border-black/10 flex items-center gap-3"
        >
          Scarica PNG
        </button>
      </div>

      <div class="print:hidden text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-muted)] mb-4 text-center">
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
import { useRoute } from 'vue-router'
import { useRecipesStore } from '@/stores/recipes'
import { renderLabelDataUrl, downloadLabelPng, openLabelPrintWindow } from '@/utils/labelCanvas'

const route = useRoute()
const store = useRecipesStore()

const labelSizeOptions = [
  { id: '40x30', label: '40 × 30 mm (rotolo in dotazione)', w: 40, h: 30 },
  { id: '50x30', label: '50 × 30 mm (consigliato)', w: 50, h: 30 },
  { id: '58x40', label: '58 × 40 mm (max CT221D)', w: 58, h: 40 },
]

const recipe = ref(null)
const labelCount = ref(1)
const labelSize = ref('50x30')
const printing = ref(false)
const previewImages = ref([])

const today = new Date()
const pad = (n) => String(n).padStart(2, '0')
const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`

const productionDate = ref(todayStr)
const expiryDays = ref(365)
const scaleFactor = ref(parseFloat(route.query.scale) || 1)
const lotNumber = ref('')

const activeSize = computed(() => labelSizeOptions.find((o) => o.id === labelSize.value) || labelSizeOptions[0])

const previewStyle = computed(() => ({
  width: `min(100%, ${activeSize.value.w * 8}px)`,
  aspectRatio: `${activeSize.value.w} / ${activeSize.value.h}`,
}))

function generateLotCode(recipeName) {
  const code = recipeName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 4)
    .padEnd(4, 'X')
  const dateStr = `${today.getFullYear()}${pad(today.getMonth() + 1)}${pad(today.getDate())}`
  const timeStr = `${pad(today.getHours())}${pad(today.getMinutes())}`
  return `LOT-${dateStr}-${timeStr}-${code}-001`
}

onMounted(() => {
  const r = store.getRecipeById(route.params.id)
  if (r) {
    recipe.value = r
    if (r.expiryDays) expiryDays.value = r.expiryDays
    lotNumber.value = generateLotCode(r.name)
  }
  refreshPreviews()
})

const formattedProductionDate = computed(() => {
  if (!productionDate.value) return '-'
  const [y, m, d] = productionDate.value.split('-')
  return `${d}/${m}/${y}`
})

const formattedExpiryDate = computed(() => {
  if (!productionDate.value) return '-'
  const d = new Date(productionDate.value)
  d.setDate(d.getDate() + (expiryDays.value || 0))
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
})

const ingredientsList = computed(() => {
  if (!recipe.value?.ingredients) return ''
  const sorted = [...recipe.value.ingredients]
    .filter((i) => i.unit !== 'q.b.' && i.quantity)
    .sort((a, b) => b.quantity - a.quantity)
  const qb = recipe.value.ingredients.filter((i) => i.unit === 'q.b.')
  return [...sorted, ...qb].map((i) => i.name).join(', ')
})

function shortLot(n) {
  const code = (recipe.value?.name || 'XXXX')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 4)
    .padEnd(4, 'X')
  const [y, m, d] = (productionDate.value || todayStr).split('-')
  const seq = String(n).padStart(3, '0')
  return `${code}-${d}${m}${y.slice(2)}-${seq}`
}

function buildLabelImage(copyIndex) {
  const { w, h } = activeSize.value
  return renderLabelDataUrl({
    wMm: w,
    hMm: h,
    name: recipe.value.name,
    ingredients: ingredientsList.value,
    notes: recipe.value.labelNotes || '',
    lot: shortLot(copyIndex),
    prod: formattedProductionDate.value,
    scad: formattedExpiryDate.value,
    scale: scaleFactor.value,
  })
}

function refreshPreviews() {
  if (!recipe.value) {
    previewImages.value = []
    return
  }
  previewImages.value = Array.from({ length: labelCount.value }, (_, i) => buildLabelImage(i + 1))
}

watch(
  [recipe, labelCount, labelSize, productionDate, expiryDays, lotNumber, ingredientsList, formattedProductionDate, formattedExpiryDate, scaleFactor],
  refreshPreviews,
)

function doPrint() {
  if (!recipe.value || printing.value) return
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
  if (!recipe.value || !previewImages.value.length) return
  previewImages.value.forEach((url, i) => {
    const name = (recipe.value.name || 'etichetta').replace(/[^a-z0-9]/gi, '-').toLowerCase()
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
