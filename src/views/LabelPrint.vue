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
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
    </div>

    <!-- Loading -->
    <div v-if="!recipe" class="flex justify-center py-24">
      <div class="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Print Area -->
    <div v-else id="print-area">
      <!-- Print button - large and centered -->
      <div class="print:hidden flex justify-center mb-8">
        <button @click="doPrint" class="px-12 py-4 bg-[var(--color-accent)] hover:bg-[#a6854f] text-white text-lg font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center gap-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Stampa etichette
        </button>
      </div>

      <div class="print:hidden text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-muted)] mb-4 text-center">Anteprima</div>

      <div class="flex flex-wrap gap-5 justify-center">
        <div
          v-for="n in labelCount"
          :key="n"
          class="label-card bg-white border border-black/10 rounded-2xl w-80 overflow-hidden shadow-sm"
          style="page-break-inside: avoid;"
        >
          <!-- Top bar -->
          <div class="h-1 bg-gradient-to-r from-[var(--color-dark)] via-[var(--color-accent)] to-[var(--color-dark)]"></div>

          <div class="p-5">
            <!-- Brand -->
            <div class="flex items-center justify-between mb-4">
              <div class="text-[0.5625rem] font-bold tracking-[0.2em] uppercase text-[var(--color-muted)]">
                Ricettario X CIP
              </div>
              <div class="text-[0.5625rem] font-medium text-[var(--color-muted)]">
                Prodotto artigianale
              </div>
            </div>

            <!-- Product name -->
            <div class="mb-4 pb-4 border-b border-black/10">
              <div class="text-xl font-black text-[var(--color-dark)] leading-tight tracking-tight">
                {{ recipe.name }}
              </div>
              <div v-if="recipe.category" class="text-[0.625rem] font-semibold tracking-[0.1em] uppercase text-[var(--color-accent)] mt-1">
                {{ recipe.category }}
              </div>
            </div>

            <!-- Ingredients -->
            <div class="mb-4">
              <div class="text-[0.5625rem] font-bold tracking-[0.15em] uppercase text-[var(--color-muted)] mb-1.5">
                Ingredienti
              </div>
              <div class="text-[0.75rem] text-[var(--color-dark)] leading-relaxed">
                {{ ingredientsList }}
              </div>
            </div>

            <!-- Notes -->
            <div v-if="recipe.labelNotes" class="mb-4 text-[0.6875rem] text-[var(--color-muted)] italic">
              {{ recipe.labelNotes }}
            </div>

            <!-- Details grid -->
            <div class="border-t border-black/10 pt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
              <div>
                <div class="text-[0.5rem] font-bold tracking-[0.2em] uppercase text-[var(--color-muted)]">Lotto</div>
                <div class="text-[0.75rem] font-bold font-mono text-[var(--color-dark)]">{{ lotWithSeq(n) }}</div>
              </div>
              <div>
                <div class="text-[0.5rem] font-bold tracking-[0.2em] uppercase text-[var(--color-muted)]">Prodotto il</div>
                <div class="text-[0.75rem] font-semibold text-[var(--color-dark)]">{{ formattedProductionDate }}</div>
              </div>
              <div>
                <div class="text-[0.5rem] font-bold tracking-[0.2em] uppercase text-[var(--color-muted)]">Da consumarsi entro</div>
                <div class="text-[0.75rem] font-semibold text-[var(--color-dark)]">{{ formattedExpiryDate }}</div>
              </div>
              <div v-if="scaleFactor && scaleFactor !== 1">
                <div class="text-[0.5rem] font-bold tracking-[0.2em] uppercase text-[var(--color-muted)]">Scala</div>
                <div class="text-[0.75rem] font-semibold text-[var(--color-dark)]">{{ scaleFactor }}x</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRecipesStore } from '@/stores/recipes'

const route = useRoute()
const store = useRecipesStore()

const recipe = ref(null)
const labelCount = ref(1)

const today = new Date()
const pad = (n) => String(n).padStart(2, '0')
const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`

const productionDate = ref(todayStr)
const expiryDays = ref(365)
const scaleFactor = ref(parseFloat(route.query.scale) || 1)

const lotNumber = ref('')

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

function lotWithSeq(n) {
  const base = lotNumber.value.replace(/-\d+$/, '')
  return `${base}-${String(n).padStart(3, '0')}`
}

function doPrint() { window.print() }
</script>
