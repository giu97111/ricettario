import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth'
import { auth } from '@/firebase/config'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)

  function init() {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          user.value = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          }
        } else {
          user.value = null
        }
        loading.value = false
        resolve()
      })
    })
  }

  async function signIn(email, password) {
    error.value = null
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      user.value = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || result.user.email.split('@')[0],
      }
    } catch (e) {
      if (e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
        error.value = 'Email o password non corretti'
      } else if (e.code === 'auth/too-many-requests') {
        error.value = 'Troppi tentativi. Riprova tra qualche minuto.'
      } else {
        error.value = 'Errore durante l\'accesso'
      }
      throw e
    }
  }

  async function signOut() {
    await firebaseSignOut(auth)
    user.value = null
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    init,
    signIn,
    signOut,
  }
})
