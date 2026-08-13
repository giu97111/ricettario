<template>
  <div class="fade-in">
    <!-- Hero -->
    <div class="mb-12 flex items-start justify-between gap-4">
      <div>
        <h1 class="text-4xl sm:text-5xl font-black tracking-tight text-[var(--color-dark)] leading-[1.1]">
          Le tue<br />
          <span class="text-[var(--color-accent)]">ricette.</span>
        </h1>
        <p class="text-[var(--color-muted)] mt-3 text-base">
          {{ recipes.length }} ricett{{ recipes.length === 1 ? 'a' : 'e' }} nel tuo archivio
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-2 shrink-0">
        <button
          v-if="recipes.length > 0"
          @click="openExportModal"
          :disabled="exporting"
          class="inline-flex items-center gap-2 px-4 py-3 border-2 border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent-light)]/30 text-sm font-bold rounded-xl transition-all"
        >
          <svg v-if="!exporting" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span v-else class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
          Esporta PDF
        </button>
        <RouterLink
          to="/etichetta-nuova"
          class="inline-flex items-center gap-2 px-4 py-3 border-2 border-[var(--color-dark)] text-[var(--color-dark)] hover:bg-[var(--color-dark)] hover:text-white text-sm font-bold rounded-xl transition-all"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Nuova etichetta
        </RouterLink>
        <RouterLink 
          to="/nuova" 
          class="inline-flex items-center gap-2 px-5 py-3 bg-[var(--color-dark)] hover:bg-black text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuova ricetta
        </RouterLink>
      </div>
    </div>

    <!-- Search + View toggle + Category filter -->
    <div class="flex flex-col sm:flex-row gap-3 mb-8">
      <div class="relative flex-1">
        <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c0c0c0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="Cerca..."
          class="input-field !pl-11"
        />
      </div>
      
      <div class="flex gap-2">
        <!-- View toggle -->
        <div class="flex rounded-lg border border-gray-200 p-1 bg-white">
          <button
            @click="viewMode = 'grid'"
            class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            :class="viewMode === 'grid' ? 'bg-[var(--color-dark)] text-white' : 'text-gray-500 hover:text-gray-700'"
          >
            Griglia
          </button>
          <button
            @click="viewMode = 'category'"
            class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            :class="viewMode === 'category' ? 'bg-[var(--color-dark)] text-white' : 'text-gray-500 hover:text-gray-700'"
          >
            Categorie
          </button>
        </div>

        <!-- Category dropdown -->
        <div class="relative">
          <button
            @click="showCategoryDropdown = !showCategoryDropdown"
            class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium transition-colors hover:border-gray-300"
            :class="filterCategory ? 'text-[var(--color-accent)] border-[var(--color-accent)]' : 'text-gray-600'"
          >
            <span>{{ filterCategory ? getCategoryEmoji(filterCategory) + ' ' + (filterCategory || 'Senza cat.') : 'Filtra' }}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown -->
          <div
            v-if="showCategoryDropdown"
            class="absolute z-30 right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-2 max-h-80 overflow-y-auto"
          >
            <!-- Clear filter -->
            <button
              @click="filterCategory = ''; showCategoryDropdown = false"
              class="w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2"
              :class="!filterCategory ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)] font-medium' : 'text-gray-600 hover:bg-gray-50'"
            >
              <span class="w-5 text-center">✓</span>
              Tutte le categorie
            </button>
            
            <div class="border-t border-gray-100 my-1"></div>

            <!-- Categories list -->
            <button
              v-for="cat in availableCategories"
              :key="cat.name"
              @click="filterCategory = cat.name; showCategoryDropdown = false"
              class="w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2"
              :class="filterCategory === cat.name ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)] font-medium' : 'text-gray-600 hover:bg-gray-50'"
            >
              <span class="w-5 text-center">{{ getCategoryEmoji(cat.name) }}</span>
              <span class="flex-1">{{ cat.name || 'Senza categoria' }}</span>
              <span class="text-xs text-gray-400">{{ cat.count }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Click outside to close dropdown -->
    <div v-if="showCategoryDropdown" class="fixed inset-0 z-20" @click="showCategoryDropdown = false"></div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-24">
      <div class="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="filtered.length === 0" class="text-center py-24">
      <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center">
        <svg class="w-8 h-8 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-[var(--color-dark)] mb-1">
        {{ recipes.length === 0 ? 'Nessuna ricetta' : 'Nessun risultato' }}
      </h3>
      <p class="text-sm text-[var(--color-muted)] mb-8">
        {{ recipes.length === 0 ? 'Crea la tua prima ricetta per iniziare' : 'Prova una ricerca diversa' }}
      </p>
      <RouterLink v-if="recipes.length === 0" to="/nuova" class="btn-primary">
        Crea la prima ricetta
      </RouterLink>
      <button v-else-if="filterCategory" @click="filterCategory = ''" class="btn-secondary">
        Rimuovi filtro
      </button>
    </div>

    <!-- Grid view -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <RecipeCard
        v-for="(recipe, i) in filtered"
        :key="recipe.id"
        :recipe="recipe"
        :style="{ animationDelay: `${i * 50}ms` }"
        class="fade-in"
        @delete="confirmDelete"
      />
    </div>

    <!-- Category view -->
    <div v-else class="space-y-10">
      <div v-for="group in groupedByCategory" :key="group.category" class="fade-in">
        <!-- Category header -->
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-[var(--color-accent-light)] flex items-center justify-center">
            <span class="text-lg">{{ getCategoryEmoji(group.category) }}</span>
          </div>
          <div>
            <h2 class="text-lg font-bold text-[var(--color-dark)]">{{ group.category || 'Senza categoria' }}</h2>
            <p class="text-xs text-[var(--color-muted)]">{{ group.recipes.length }} ricett{{ group.recipes.length === 1 ? 'a' : 'e' }}</p>
          </div>
        </div>

        <!-- Category recipes -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <RecipeCard
            v-for="recipe in group.recipes"
            :key="recipe.id"
            :recipe="recipe"
            @delete="confirmDelete"
          />
        </div>
      </div>
    </div>

    <!-- Export PDF: scegli ricette -->
    <Teleport to="body">
      <transition name="modal">
        <div
          v-if="showExportModal"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4"
          @click.self="closeExportModal"
        >
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div class="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[min(90vh,640px)] flex flex-col overflow-hidden">
            <div class="p-6 pb-4 border-b border-black/5 shrink-0">
              <h3 class="text-lg font-bold text-[var(--color-dark)] mb-1">Esporta in PDF</h3>
              <p class="text-sm text-[var(--color-muted)]">
                Cerca e seleziona le ricette da includere nel documento.
              </p>
              <div class="relative mt-4">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c0c0c0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  v-model="exportSearch"
                  type="text"
                  placeholder="Cerca per nome, categoria, descrizione..."
                  class="input-field !pl-10 !text-sm"
                  @keydown.esc="closeExportModal"
                />
              </div>
              <div class="flex flex-wrap gap-2 mt-3">
                <button type="button" class="text-xs font-semibold text-[var(--color-accent)] hover:underline" @click="selectAllFiltered">
                  Seleziona risultati
                </button>
                <span class="text-gray-300">|</span>
                <button type="button" class="text-xs font-semibold text-gray-600 hover:underline" @click="deselectAllFiltered">
                  Deseleziona risultati
                </button>
                <span class="text-gray-300">|</span>
                <button type="button" class="text-xs font-semibold text-gray-600 hover:underline" @click="selectAllRecipes">
                  Tutte
                </button>
                <span class="text-gray-300">|</span>
                <button type="button" class="text-xs font-semibold text-gray-600 hover:underline" @click="deselectAllRecipes">
                  Nessuna
                </button>
              </div>
              <p class="text-xs text-[var(--color-muted)] mt-2">
                <strong class="text-[var(--color-dark)]">{{ selectedCount }}</strong>
                ricett{{ selectedCount === 1 ? 'a' : 'e' }} selezionat{{ selectedCount === 1 ? 'a' : 'e' }}
                <span v-if="exportSearch.trim() && exportFilteredRecipes.length !== recipes.length" class="ml-1">
                  ({{ exportFilteredRecipes.length }} in questa ricerca)
                </span>
              </p>
            </div>

            <div class="flex-1 overflow-y-auto px-6 py-3 min-h-0">
              <ul v-if="exportFilteredRecipes.length" class="space-y-1">
                <li v-for="r in exportFilteredRecipes" :key="r.id">
                  <label
                    class="flex items-start gap-3 p-3 rounded-xl border border-transparent hover:bg-[var(--color-accent-light)]/40 hover:border-[var(--color-accent)]/20 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      :checked="isExportSelected(r.id)"
                      class="mt-0.5 w-4 h-4 rounded border-gray-300 text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                      @change="toggleExportSelection(r.id)"
                    />
                    <span class="flex-1 min-w-0">
                      <span class="font-semibold text-[var(--color-dark)] text-sm block truncate">{{ r.name }}</span>
                      <span v-if="r.category" class="text-xs text-[var(--color-muted)]">{{ r.category }}</span>
                    </span>
                  </label>
                </li>
              </ul>
              <p v-else class="text-sm text-center text-[var(--color-muted)] py-8">
                Nessuna ricetta corrisponde alla ricerca. Modifica i termini o cancella il filtro.
              </p>
            </div>

            <div class="p-6 pt-4 border-t border-black/5 flex gap-3 shrink-0 bg-[#fafaf8]">
              <button type="button" class="btn-secondary flex-1 justify-center" @click="closeExportModal">
                Annulla
              </button>
              <button
                type="button"
                class="flex-1 btn-primary justify-center"
                :disabled="selectedCount === 0 || exporting"
                @click="confirmExportPdf"
              >
                <span v-if="exporting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></span>
                Genera PDF ({{ selectedCount }})
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- Delete modal -->
    <Teleport to="body">
      <transition name="modal">
        <div v-if="deleteTarget" class="fixed inset-0 z-[100] flex items-center justify-center p-4" @click.self="deleteTarget = null">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div class="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-7">
            <h3 class="text-lg font-bold text-[var(--color-dark)] mb-2">Elimina ricetta</h3>
            <p class="text-sm text-[var(--color-muted)] mb-7">
              Stai per eliminare <strong class="text-[var(--color-dark)]">{{ deleteTarget.name }}</strong>. Questa azione e' irreversibile.
            </p>
            <div class="flex gap-3">
              <button @click="deleteTarget = null" class="btn-secondary flex-1 justify-center">
                Annulla
              </button>
              <button @click="doDelete" class="flex-1 btn-primary justify-center !bg-red-600 hover:!bg-red-700">
                Elimina
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRecipesStore } from '@/stores/recipes'
import { storeToRefs } from 'pinia'
import RecipeCard from '@/components/RecipeCard.vue'
import { CATEGORIES } from '@/data/defaults'
import { exportRecipesToPdf, downloadPdf } from '@/utils/exportPdf'

const store = useRecipesStore()
const { recipes, loading } = storeToRefs(store)

const search = ref('')
const viewMode = ref('category')
const filterCategory = ref('')
const showCategoryDropdown = ref(false)
const deleteTarget = ref(null)
const exporting = ref(false)

/** Modale export PDF */
const showExportModal = ref(false)
const exportSearch = ref('')
/** ID ricette selezionate per l'export */
const selectedExportIds = ref([])

onMounted(() => store.subscribeToRecipes())
onUnmounted(() => store.unsubscribeFromRecipes())

const availableCategories = computed(() => {
  const counts = {}
  recipes.value.forEach(r => {
    const cat = r.category || ''
    counts[cat] = (counts[cat] || 0) + 1
  })
  
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => {
      if (a.name === '') return 1
      if (b.name === '') return -1
      return a.name.localeCompare(b.name)
    })
})

const filtered = computed(() => {
  let list = recipes.value
  
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter((r) => r.name.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q))
  }
  
  if (filterCategory.value !== '') {
    list = list.filter((r) => (r.category || '') === filterCategory.value)
  }
  
  return list
})

/** Ricette filtrate nel modale export (ricerca) */
const exportFilteredRecipes = computed(() => {
  const q = exportSearch.value.trim().toLowerCase()
  if (!q) return recipes.value
  return recipes.value.filter((r) => {
    const name = (r.name || '').toLowerCase()
    const cat = (r.category || '').toLowerCase()
    const desc = (r.description || '').toLowerCase()
    return name.includes(q) || cat.includes(q) || desc.includes(q)
  })
})

const selectedCount = computed(() => selectedExportIds.value.length)

const groupedByCategory = computed(() => {
  const groups = {}
  
  CATEGORIES.forEach(cat => {
    groups[cat] = []
  })
  groups[''] = []
  
  filtered.value.forEach(recipe => {
    const cat = recipe.category || ''
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(recipe)
  })
  
  return Object.entries(groups)
    .filter(([_, recipes]) => recipes.length > 0)
    .map(([category, recipes]) => ({ category, recipes }))
})

const CATEGORY_EMOJIS = {
  'Torte': '🎂',
  'Crostate': '🥧',
  'Biscotti': '🍪',
  'Paste frolle': '🥮',
  'Paste sfoglie': '🥐',
  'Brioche e lievitati': '🧁',
  'Creme e farciture': '🍮',
  'Mousse e bavaresi': '🧁',
  'Cioccolateria': '🍫',
  'Mignon': '🧁',
  'Gelati e sorbetti': '🍨',
  'Confetture e marmellate': '🍯',
  'Glasse e decorazioni': '✨',
  'Altro': '📦',
  '': '📋',
}

function getCategoryEmoji(category) {
  return CATEGORY_EMOJIS[category] || '📋'
}

function confirmDelete(recipe) { deleteTarget.value = recipe }

function openExportModal() {
  if (recipes.value.length === 0) return
  exportSearch.value = ''
  selectedExportIds.value = recipes.value.map((r) => r.id)
  showExportModal.value = true
}

function closeExportModal() {
  showExportModal.value = false
}

function isExportSelected(id) {
  return selectedExportIds.value.includes(id)
}

function toggleExportSelection(id) {
  const i = selectedExportIds.value.indexOf(id)
  if (i >= 0) selectedExportIds.value.splice(i, 1)
  else selectedExportIds.value.push(id)
}

function selectAllFiltered() {
  const set = new Set(selectedExportIds.value)
  exportFilteredRecipes.value.forEach((r) => set.add(r.id))
  selectedExportIds.value = [...set]
}

function deselectAllFiltered() {
  const remove = new Set(exportFilteredRecipes.value.map((r) => r.id))
  selectedExportIds.value = selectedExportIds.value.filter((id) => !remove.has(id))
}

function selectAllRecipes() {
  selectedExportIds.value = recipes.value.map((r) => r.id)
}

function deselectAllRecipes() {
  selectedExportIds.value = []
}

function confirmExportPdf() {
  if (selectedExportIds.value.length === 0) return
  const selectedSet = new Set(selectedExportIds.value)
  const ordered = recipes.value.filter((r) => selectedSet.has(r.id))
  if (ordered.length === 0) return

  exporting.value = true
  try {
    const blob = exportRecipesToPdf(ordered)
    const date = new Date().toISOString().slice(0, 10)
    downloadPdf(blob, `ricettario-${date}.pdf`)
    closeExportModal()
  } catch (err) {
    console.error('Errore export PDF:', err)
  } finally {
    exporting.value = false
  }
}

async function doDelete() {
  if (!deleteTarget.value) return
  await store.deleteRecipe(deleteTarget.value.id)
  deleteTarget.value = null
}
</script>

<style scoped>
.modal-enter-active { transition: all 0.25s ease; }
.modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .relative, .modal-leave-to .relative { transform: scale(0.95); }
</style>
