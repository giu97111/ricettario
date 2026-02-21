import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'ricettario-recipes'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveToStorage(recipes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes))
}

export const useRecipesStore = defineStore('recipes', () => {
  const recipes = ref(loadFromStorage())
  const loading = ref(false)
  const error = ref(null)

  watch(recipes, (val) => saveToStorage(val), { deep: true })

  function subscribeToRecipes() {
    // No-op for localStorage, data is already loaded
  }

  function unsubscribeFromRecipes() {
    // No-op for localStorage
  }

  async function addRecipe(recipeData) {
    const newRecipe = {
      ...recipeData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    recipes.value.unshift(newRecipe)
  }

  async function updateRecipe(id, recipeData) {
    const idx = recipes.value.findIndex((r) => r.id === id)
    if (idx !== -1) {
      recipes.value[idx] = {
        ...recipes.value[idx],
        ...recipeData,
        updatedAt: new Date().toISOString(),
      }
    }
  }

  async function deleteRecipe(id) {
    const idx = recipes.value.findIndex((r) => r.id === id)
    if (idx !== -1) {
      recipes.value.splice(idx, 1)
    }
  }

  function getRecipeById(id) {
    return recipes.value.find((r) => r.id === id) ?? null
  }

  return {
    recipes,
    loading,
    error,
    subscribeToRecipes,
    unsubscribeFromRecipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeById,
  }
})
