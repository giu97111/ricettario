<template>
  <div class="fade-in max-w-2xl mx-auto">
    <!-- Back -->
    <RouterLink to="/" class="btn-ghost mb-8 inline-flex">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Indietro
    </RouterLink>

    <!-- Title -->
    <div class="mb-8">
      <h1 class="text-3xl font-black tracking-tight text-[var(--color-dark)]">
        {{ isEdit ? 'Modifica' : 'Nuova ricetta' }}
      </h1>
      <p class="text-sm text-[var(--color-muted)] mt-1">{{ isEdit ? 'Aggiorna i dettagli della ricetta' : 'Compila i campi per creare una nuova ricetta' }}</p>
    </div>

    <form @submit.prevent="save" class="space-y-8">
      <!-- Name -->
      <div class="card p-6 space-y-5">
        <div class="text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-muted)] mb-1">Informazioni base</div>

        <div>
          <label class="text-sm font-medium text-[var(--color-dark)] mb-1.5 block">Nome ricetta <span class="text-red-400">*</span></label>
          <input v-model="form.name" type="text" required placeholder="es. Crostata di frutta" class="input-field" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <!-- Category with autocomplete -->
          <div class="relative">
            <label class="text-sm font-medium text-[var(--color-dark)] mb-1.5 block">Categoria</label>
            <input
              v-model="form.category"
              type="text"
              placeholder="Scrivi o seleziona..."
              class="input-field"
              @focus="showCategorySuggestions = true"
              @blur="hideCategorySuggestionsDelayed"
            />
            <div
              v-if="showCategorySuggestions && filteredCategories.length > 0"
              class="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto"
            >
              <button
                v-for="cat in filteredCategories"
                :key="cat"
                type="button"
                class="w-full text-left px-3 py-2 text-sm hover:bg-[var(--color-accent-light)] transition-colors first:rounded-t-xl last:rounded-b-xl"
                @mousedown.prevent="selectCategory(cat)"
              >
                {{ cat }}
              </button>
            </div>
          </div>
          <div>
            <label class="text-sm font-medium text-[var(--color-dark)] mb-1.5 block">Scadenza (giorni)</label>
            <input v-model.number="form.expiryDays" type="number" min="1" placeholder="365" class="input-field" />
          </div>
        </div>

        <div>
          <label class="text-sm font-medium text-[var(--color-dark)] mb-1.5 block">Descrizione</label>
          <textarea v-model="form.description" rows="2" placeholder="Breve descrizione..." class="input-field resize-none"></textarea>
        </div>
      </div>

      <!-- Ingredients -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <div class="text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-muted)]">Ingredienti</div>
          </div>
          <button type="button" @click="addIngredient" class="btn-ghost !text-[var(--color-accent)] hover:!text-[#a6854f]">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" d="M12 4v16m8-8H4" />
            </svg>
            Aggiungi
          </button>
        </div>

        <div class="space-y-3">
          <div
            v-for="(ing, idx) in form.ingredients"
            :key="idx"
            class="flex gap-2 items-center p-3 rounded-xl border border-transparent transition-colors"
            :class="form.mainIngredientIndex === idx ? 'bg-[var(--color-accent-light)] !border-[var(--color-accent)]/30' : 'bg-gray-50 hover:bg-gray-100/70'"
          >
            <!-- Radio -->
            <button
              type="button"
              @click="form.mainIngredientIndex = idx"
              class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
              :class="form.mainIngredientIndex === idx ? 'border-[var(--color-accent)] bg-[var(--color-accent)]' : 'border-gray-300'"
              title="Ingrediente principale"
            >
              <svg v-if="form.mainIngredientIndex === idx" class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="6" />
              </svg>
            </button>

            <!-- Fields -->
            <div class="flex-1 grid grid-cols-5 gap-2">
              <!-- Ingredient name with autocomplete -->
              <div class="col-span-5 sm:col-span-2 relative">
                <input
                  v-model="ing.name"
                  type="text"
                  placeholder="Ingrediente"
                  required
                  class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                  @focus="activeIngredientIdx = idx"
                  @blur="hideIngredientSuggestionsDelayed"
                  @input="onIngredientInput(idx)"
                />
                <div
                  v-if="activeIngredientIdx === idx && getIngredientSuggestions(ing.name).length > 0"
                  class="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-40 overflow-y-auto"
                >
                  <button
                    v-for="suggestion in getIngredientSuggestions(ing.name)"
                    :key="suggestion"
                    type="button"
                    class="w-full text-left px-3 py-2 text-sm hover:bg-[var(--color-accent-light)] transition-colors first:rounded-t-xl last:rounded-b-xl"
                    @mousedown.prevent="selectIngredient(idx, suggestion)"
                  >
                    {{ suggestion }}
                  </button>
                </div>
              </div>
              <input
                v-model.number="ing.quantity"
                type="number"
                step="any"
                min="0"
                placeholder="Qtà"
                required
                class="col-span-3 sm:col-span-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              />
              <select
                v-model="ing.unit"
                class="col-span-2 sm:col-span-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              >
                <option v-for="u in UNITS" :key="u" :value="u">{{ u }}</option>
              </select>
            </div>

            <!-- Remove -->
            <button
              type="button"
              @click="removeIngredient(idx)"
              class="p-1 rounded-lg text-gray-300 hover:text-red-500 transition-colors shrink-0"
              :class="{ 'invisible': form.ingredients.length === 1 }"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <p class="text-[0.6875rem] text-[var(--color-muted)] mt-3 flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-[var(--color-accent)] inline-block shrink-0"></span>
          Il cerchio pieno indica l'ingrediente principale per il calcolo proporzioni
        </p>
      </div>

      <!-- Instructions -->
      <div class="card p-6 space-y-4">
        <div class="text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-muted)]">Preparazione</div>
        <div>
          <label class="text-sm font-medium text-[var(--color-dark)] mb-1.5 block">Istruzioni</label>
          <textarea v-model="form.instructions" rows="5" placeholder="Descrivi i passaggi di preparazione..." class="input-field resize-y"></textarea>
        </div>
      </div>

      <!-- Notes -->
      <div class="card p-6 space-y-4">
        <div class="text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-muted)]">Note</div>
        <div>
          <label class="text-sm font-medium text-[var(--color-dark)] mb-1.5 block">Note sulla ricetta</label>
          <textarea v-model="form.notes" rows="3" placeholder="Appunti, varianti, suggerimenti..." class="input-field resize-y"></textarea>
        </div>
        <div>
          <label class="text-sm font-medium text-[var(--color-dark)] mb-1.5 block">Note etichetta</label>
          <input v-model="form.labelNotes" type="text" placeholder="es. Conservare in luogo fresco e asciutto" class="input-field" />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <RouterLink to="/" class="btn-secondary flex-1 justify-center">Annulla</RouterLink>
        <button type="submit" :disabled="saving" class="btn-primary flex-1 justify-center">
          <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ saving ? 'Salvataggio...' : isEdit ? 'Salva modifiche' : 'Crea ricetta' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecipesStore } from '@/stores/recipes'
import { CATEGORIES, INGREDIENTS, UNITS } from '@/data/defaults'

const route = useRoute()
const router = useRouter()
const store = useRecipesStore()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)

const showCategorySuggestions = ref(false)
const activeIngredientIdx = ref(-1)

const form = ref({
  name: '',
  category: '',
  description: '',
  expiryDays: 365,
  mainIngredientIndex: 0,
  ingredients: [{ name: '', quantity: '', unit: 'g' }],
  instructions: '',
  notes: '',
  labelNotes: '',
})

const filteredCategories = computed(() => {
  const q = form.value.category.toLowerCase()
  if (!q) return CATEGORIES
  return CATEGORIES.filter(cat => cat.toLowerCase().includes(q))
})

function getIngredientSuggestions(query) {
  if (!query || query.length < 2) return []
  const q = query.toLowerCase()
  return INGREDIENTS
    .map(i => i.name)
    .filter(name => name.toLowerCase().includes(q))
    .slice(0, 8)
}

function selectCategory(cat) {
  form.value.category = cat
  showCategorySuggestions.value = false
}

function hideCategorySuggestionsDelayed() {
  setTimeout(() => { showCategorySuggestions.value = false }, 150)
}

function onIngredientInput(idx) {
  activeIngredientIdx.value = idx
}

function selectIngredient(idx, name) {
  form.value.ingredients[idx].name = name
  activeIngredientIdx.value = -1
}

function hideIngredientSuggestionsDelayed() {
  setTimeout(() => { activeIngredientIdx.value = -1 }, 150)
}

onMounted(() => {
  if (isEdit.value) {
    const recipe = store.getRecipeById(route.params.id)
    if (recipe) {
      form.value = {
        name: recipe.name ?? '',
        category: recipe.category ?? '',
        description: recipe.description ?? '',
        expiryDays: recipe.expiryDays ?? 365,
        mainIngredientIndex: recipe.mainIngredientIndex ?? 0,
        ingredients: recipe.ingredients?.length
          ? recipe.ingredients.map((i) => ({ ...i }))
          : [{ name: '', quantity: '', unit: 'g' }],
        instructions: recipe.instructions ?? '',
        notes: recipe.notes ?? '',
        labelNotes: recipe.labelNotes ?? '',
      }
    }
  }
})

function addIngredient() {
  form.value.ingredients.push({ name: '', quantity: '', unit: 'g' })
}

function removeIngredient(idx) {
  if (form.value.ingredients.length === 1) return
  form.value.ingredients.splice(idx, 1)
  if (form.value.mainIngredientIndex >= form.value.ingredients.length) {
    form.value.mainIngredientIndex = 0
  }
}

async function save() {
  saving.value = true
  try {
    const data = { ...form.value }
    if (isEdit.value) {
      await store.updateRecipe(route.params.id, data)
    } else {
      await store.addRecipe(data)
    }
    router.push('/')
  } finally {
    saving.value = false
  }
}
</script>
