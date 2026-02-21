<template>
  <div class="min-h-[80vh] flex items-center justify-center">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="text-center mb-10">
        <div class="w-16 h-16 rounded-2xl bg-[var(--color-dark)] flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-2xl font-black tracking-tighter">XC</span>
        </div>
        <h1 class="text-2xl font-black tracking-tight text-[var(--color-dark)]">Ricettario X CIP</h1>
        <p class="text-sm text-[var(--color-muted)] mt-1">Accedi per gestire le tue ricette</p>
      </div>

      <!-- Login card -->
      <div class="card p-8">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="text-sm font-medium text-[var(--color-dark)] mb-1.5 block">Email</label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="la-tua@email.com"
              class="input-field"
              autocomplete="email"
            />
          </div>

          <div>
            <label class="text-sm font-medium text-[var(--color-dark)] mb-1.5 block">Password</label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="input-field"
              autocomplete="current-password"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary justify-center !py-3 !rounded-xl mt-2"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ loading ? 'Accesso...' : 'Accedi' }}
          </button>
        </form>

        <p v-if="error" class="mt-4 text-sm text-red-500 text-center">{{ error }}</p>
      </div>

      <!-- Footer -->
      <p class="text-center text-xs text-[var(--color-muted)] mt-6">
        Solo gli utenti autorizzati possono accedere
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)

async function handleLogin() {
  loading.value = true
  error.value = null
  try {
    await authStore.signIn(email.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = authStore.error
  } finally {
    loading.value = false
  }
}
</script>
