<template>
  <div class="fade-in">
    <!-- Hero -->
    <div class="mb-12">
      <h1 class="text-4xl sm:text-5xl font-black tracking-tight text-[var(--color-dark)] leading-[1.1]">
        Le tue<br />
        <span class="text-[var(--color-accent)]">ricette.</span>
      </h1>
      <p class="text-[var(--color-muted)] mt-3 text-base">
        {{ recipes.length }} ricett{{ recipes.length === 1 ? 'a' : 'e' }} nel tuo archivio
      </p>
    </div>

    <!-- Search + Filter -->
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
      <select v-model="filterCategory" class="input-field !w-auto min-w-[160px]">
        <option value="">Tutte</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

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
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <RecipeCard
        v-for="(recipe, i) in filtered"
        :key="recipe.id"
        :recipe="recipe"
        :style="{ animationDelay: `${i * 50}ms` }"
        class="fade-in"
        @delete="confirmDelete"
      />
    </div>

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

const store = useRecipesStore()
const { recipes, loading } = storeToRefs(store)

const search = ref('')
const filterCategory = ref('')
const deleteTarget = ref(null)

onMounted(() => store.subscribeToRecipes())
onUnmounted(() => store.unsubscribeFromRecipes())

const categories = computed(() => {
  const cats = recipes.value.map((r) => r.category).filter(Boolean)
  return [...new Set(cats)].sort()
})

const filtered = computed(() => {
  let list = recipes.value
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter((r) => r.name.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q))
  }
  if (filterCategory.value) {
    list = list.filter((r) => r.category === filterCategory.value)
  }
  return list
})

function confirmDelete(recipe) { deleteTarget.value = recipe }

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
