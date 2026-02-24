<template>
  <div v-if="!recipe" class="flex justify-center py-24">
    <div class="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
  </div>

  <div v-else class="fade-in max-w-2xl mx-auto">
    <!-- Back -->
    <RouterLink to="/" class="btn-ghost mb-8 inline-flex">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Ricette
    </RouterLink>

    <!-- Header -->
    <div class="flex items-start justify-between gap-4 mb-10">
      <div>
        <span v-if="recipe.category" class="tag mb-3">{{ recipe.category }}</span>
        <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-[var(--color-dark)] leading-[1.1]">
          {{ recipe.name }}
        </h1>
        <p v-if="recipe.description" class="text-[var(--color-muted)] mt-2 text-sm leading-relaxed">{{ recipe.description }}</p>
      </div>
      <div class="flex flex-col gap-2 shrink-0">
        <RouterLink :to="`/modifica/${recipe.id}`" class="btn-secondary !px-3 !py-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Modifica
        </RouterLink>
        <RouterLink 
          :to="{ name: 'label-print', params: { id: recipe.id }, query: scaleFactor !== 1 ? { scale: scaleFactor } : {} }"
          class="btn-primary !px-3 !py-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Stampa
        </RouterLink>
      </div>
    </div>

    <!-- Calculator -->
    <div class="card border-[var(--color-accent)]/20 bg-[var(--color-accent-light)]/30 p-6 mb-6">
      <div class="flex items-center gap-2.5 mb-4">
        <div class="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <div class="text-sm font-bold text-[var(--color-dark)]">Calcola proporzioni</div>
          <div class="text-xs text-[var(--color-muted)]">Modifica la quantita' dell'ingrediente principale</div>
        </div>
      </div>

      <div v-if="mainIngredient" class="flex items-end gap-4">
        <div class="flex-1">
          <label class="text-xs font-semibold text-[#8b7355] tracking-wide uppercase mb-1.5 block">
            {{ mainIngredient.name }} ({{ mainIngredient.unit }})
          </label>
          <input
            v-model.number="scaledMainQty"
            type="number"
            step="any"
            min="0"
            class="input-field !text-xl !font-bold !py-3 !border-[var(--color-accent)]/40 focus:!border-[var(--color-accent)]"
          />
        </div>
        <div class="pb-3.5 shrink-0">
          <div class="text-xs text-[var(--color-muted)] mb-0.5">Scala</div>
          <div class="text-xl font-black text-[var(--color-accent)] tabular-nums">{{ scaleFactor.toFixed(2) }}x</div>
        </div>
      </div>
      <p v-else class="text-sm text-[#8b7355] italic">Imposta un ingrediente principale per usare il calcolatore.</p>
    </div>

    <!-- Ingredients -->
    <div class="card p-6 mb-6">
      <div class="text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-muted)] mb-4">Ingredienti</div>
      <div class="space-y-0">
        <div
          v-for="(ing, idx) in recipe.ingredients"
          :key="idx"
          class="flex items-center justify-between py-3 border-b border-black/5 last:border-0"
          :class="{ 'bg-[var(--color-accent-light)]/50 -mx-3 px-3 rounded-lg': idx === recipe.mainIngredientIndex }"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-1.5 h-1.5 rounded-full shrink-0"
              :class="idx === recipe.mainIngredientIndex ? 'bg-[var(--color-accent)] w-2 h-2' : 'bg-gray-300'"
            ></div>
            <span class="text-sm font-medium text-[var(--color-dark)]">{{ ing.name }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-[var(--color-dark)] tabular-nums">
              {{ scaledQty(ing) }}
            </span>
            <span class="text-xs text-[var(--color-muted)]">{{ ing.unit }}</span>
            <span v-if="scaleFactor !== 1 && ing.unit !== 'q.b.'" class="text-[0.625rem] text-gray-300 ml-1">
              ({{ ing.quantity }})
            </span>
          </div>
        </div>
      </div>
      <div
        v-if="Object.keys(totalsByUnit).length"
        class="mt-4 pt-3 border-t border-black/5 text-[0.8rem]"
      >
        <div class="space-y-0.5">
          <div
            v-for="(total, unit) in totalsByUnit"
            :key="unit"
            class="flex items-center justify-between text-sm"
          >
            <span class="text-xs font-semibold text-[var(--color-dark)]">
              Totale {{ unit }}
            </span>
            <span class="font-bold text-[var(--color-dark)] tabular-nums">
              {{ formatTotal(total, unit) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Instructions -->
    <div v-if="recipe.instructions" class="card p-6 mb-6">
      <div class="text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-muted)] mb-4">Preparazione</div>
      <p class="text-sm text-[var(--color-dark)] whitespace-pre-line leading-relaxed">{{ recipe.instructions }}</p>
    </div>

    <!-- Notes -->
    <div v-if="recipe.notes" class="card p-6 mb-6 bg-[var(--color-accent-light)]/30 border-[var(--color-accent)]/10">
      <div class="text-xs font-semibold tracking-[0.1em] uppercase text-[#8b7355] mb-4 flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Note
      </div>
      <p class="text-sm text-[var(--color-dark)] whitespace-pre-line leading-relaxed">{{ recipe.notes }}</p>
    </div>

    <!-- Print CTA -->
    <div class="card !bg-[var(--color-dark)] p-6 flex items-center justify-between gap-4">
      <div>
        <p class="text-white font-bold text-sm">Pronta per la produzione?</p>
        <p class="text-gray-400 text-xs mt-0.5">Genera l'etichetta con lotto, date e ingredienti</p>
      </div>
      <RouterLink
        :to="{ name: 'label-print', params: { id: recipe.id }, query: scaleFactor !== 1 ? { scale: scaleFactor } : {} }"
        class="shrink-0 inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-[var(--color-dark)] font-semibold px-5 py-2.5 rounded-full text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Stampa etichetta
      </RouterLink>
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
const scaledMainQty = ref(0)

onMounted(() => {
  const r = store.getRecipeById(route.params.id)
  if (r) {
    recipe.value = r
    scaledMainQty.value = r.ingredients?.[r.mainIngredientIndex ?? 0]?.quantity ?? 0
  }
})

const mainIngredient = computed(() => {
  if (!recipe.value) return null
  return recipe.value.ingredients?.[recipe.value.mainIngredientIndex ?? 0] ?? null
})

const totalsByUnit = computed(() => {
  const totals = {}
  if (!recipe.value?.ingredients) return totals

  for (const ing of recipe.value.ingredients) {
    if (! ing.quantity || ing.unit === 'q.b.') continue
    const unit = ing.unit || ''
    const qty = Number(ing.quantity)
    if (Number.isNaN(qty)) continue
    totals[unit] = (totals[unit] || 0) + qty
  }

  return totals
})

const scaleFactor = computed(() => {
  if (!mainIngredient.value?.quantity) return 1
  return scaledMainQty.value / mainIngredient.value.quantity
})

function scaledQty(ing) {
  if (ing.unit === 'q.b.' || !ing.quantity) return ing.quantity || 'q.b.'
  if (scaleFactor.value === 1) return ing.quantity
  return +(ing.quantity * scaleFactor.value).toFixed(2)
}

function formatTotal(total, unit) {
  if (unit === 'g') {
    const kg = total / 1000
    return `${total.toFixed(0)} g (${kg.toFixed(2)} kg)`
  }
  if (unit === 'kg') {
    return `${total.toFixed(2)} kg`
  }
  if (unit === 'ml') {
    const l = total / 1000
    return `${total.toFixed(0)} ml (${l.toFixed(2)} L)`
  }
  if (unit === 'L' || unit === 'l') {
    return `${total.toFixed(2)} L`
  }
  return `${total} ${unit}`
}
</script>
