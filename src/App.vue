<template>
  <div class="min-h-screen">
    <!-- Navbar -->
    <nav v-if="isAuthenticated" class="sticky top-0 z-50 backdrop-blur-xl bg-[#fafaf8]/80 border-b border-black/5 print:hidden">
      <div class="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
        <RouterLink to="/" class="flex items-center gap-3 group">
          <div class="w-8 h-8 rounded-lg bg-[var(--color-dark)] flex items-center justify-center">
            <span class="text-white text-sm font-black tracking-tighter">XC</span>
          </div>
          <div class="flex flex-col leading-none">
            <span class="text-[0.8125rem] font-bold tracking-tight text-[var(--color-dark)]">Ricettario</span>
            <span class="text-[0.625rem] font-semibold tracking-[0.15em] uppercase text-[var(--color-muted)]">X CIP</span>
          </div>
        </RouterLink>

        <div class="flex items-center gap-4">
          <RouterLink to="/nuova" class="btn-primary">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" d="M12 4v16m8-8H4" />
            </svg>
            Nuova
          </RouterLink>

          <!-- User menu -->
          <div class="relative" ref="menuRef">
            <button
              @click="showMenu = !showMenu"
              class="flex items-center gap-2 p-1 rounded-full hover:bg-black/5 transition-colors"
            >
              <div class="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white text-sm font-bold">
                {{ user?.displayName?.charAt(0)?.toUpperCase() || '?' }}
              </div>
            </button>

            <!-- Dropdown -->
            <transition name="menu">
              <div
                v-if="showMenu"
                class="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-black/10 shadow-xl py-2"
              >
                <div class="px-4 py-2 border-b border-black/5">
                  <p class="text-sm font-semibold text-[var(--color-dark)] truncate">{{ user?.displayName }}</p>
                  <p class="text-xs text-[var(--color-muted)] truncate">{{ user?.email }}</p>
                </div>
                <button
                  @click="handleLogout"
                  class="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Esci
                </button>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </nav>

    <!-- Content -->
    <main :class="isAuthenticated ? 'max-w-5xl mx-auto px-6 py-10' : ''">
      <RouterView v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <!-- Footer -->
    <footer v-if="isAuthenticated" class="print:hidden border-t border-black/5 py-8 mt-20">
      <div class="max-w-5xl mx-auto px-6 flex items-center justify-between">
        <span class="text-xs text-[var(--color-muted)]">Ricettario X CIP</span>
        <span class="text-xs text-[var(--color-muted)]">Fatto con cura</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const router = useRouter()
const authStore = useAuthStore()
const { user, isAuthenticated } = storeToRefs(authStore)

const showMenu = ref(false)
const menuRef = ref(null)

async function handleLogout() {
  showMenu.value = false
  await authStore.signOut()
  router.push('/login')
}

function handleClickOutside(e) {
  if (menuRef.value && !menuRef.value.contains(e.target)) {
    showMenu.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style>
.page-enter-active { animation: fadeIn 0.3s ease; }
.page-leave-active { animation: fadeIn 0.2s ease reverse; }

.menu-enter-active { transition: all 0.15s ease; }
.menu-leave-active { transition: all 0.1s ease; }
.menu-enter-from, .menu-leave-to { 
  opacity: 0; 
  transform: translateY(-8px) scale(0.95); 
}
</style>
