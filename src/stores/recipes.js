import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/firebase/config'

export const useRecipesStore = defineStore('recipes', () => {
  const recipes = ref([])
  const loading = ref(false)
  const error = ref(null)

  let unsubscribe = null

  function subscribeToRecipes() {
    if (unsubscribe) return
    loading.value = true
    const q = query(collection(db, 'recipes'), orderBy('createdAt', 'desc'))
    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        recipes.value = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        loading.value = false
      },
      (err) => {
        error.value = err.message
        loading.value = false
        console.error('Firestore error:', err)
      }
    )
  }

  function unsubscribeFromRecipes() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  async function addRecipe(recipeData) {
    await addDoc(collection(db, 'recipes'), {
      ...recipeData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }

  async function updateRecipe(id, recipeData) {
    const ref = doc(db, 'recipes', id)
    await updateDoc(ref, {
      ...recipeData,
      updatedAt: serverTimestamp(),
    })
  }

  async function deleteRecipe(id) {
    await deleteDoc(doc(db, 'recipes', id))
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
