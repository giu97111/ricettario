<template>
  <div class="min-h-screen">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 backdrop-blur-xl bg-[#fafaf8]/80 border-b border-black/5 print:hidden">
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
        <RouterLink to="/nuova" class="btn-primary">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuova
        </RouterLink>
      </div>
    </nav>

    <!-- Content -->
    <main class="max-w-5xl mx-auto px-6 py-10">
      <RouterView v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <!-- Footer -->
    <footer class="print:hidden border-t border-black/5 py-8 mt-20">
      <div class="max-w-5xl mx-auto px-6 flex items-center justify-between">
        <span class="text-xs text-[var(--color-muted)]">Ricettario X CIP</span>
        <span class="text-xs text-[var(--color-muted)]">Fatto con cura</span>
      </div>
    </footer>
  </div>
</template>

<style>
.page-enter-active { animation: fadeIn 0.3s ease; }
.page-leave-active { animation: fadeIn 0.2s ease reverse; }
</style>
