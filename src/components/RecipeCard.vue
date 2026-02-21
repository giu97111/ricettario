<template>
  <div class="card card-hover flex flex-col overflow-hidden group">
    <!-- Top accent line -->
    <div class="h-0.5 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-light)]"></div>

    <div class="p-5 flex flex-col flex-1">
      <!-- Category + actions -->
      <div class="flex items-center justify-between mb-3">
        <span v-if="recipe.category" class="tag">{{ recipe.category }}</span>
        <span v-else class="tag !bg-gray-100 !text-gray-400">Senza categoria</span>
        <div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <RouterLink :to="`/modifica/${recipe.id}`" class="btn-ghost !p-1.5" title="Modifica">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </RouterLink>
          <button @click.stop="$emit('delete', recipe)" class="btn-ghost !p-1.5 hover:!text-red-500 hover:!bg-red-50" title="Elimina">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Title + desc -->
      <RouterLink :to="`/ricetta/${recipe.id}`" class="flex-1 block">
        <h3 class="text-base font-bold text-[var(--color-dark)] leading-snug mb-1 group-hover:text-[var(--color-accent)] transition-colors">
          {{ recipe.name }}
        </h3>
        <p v-if="recipe.description" class="text-xs text-[var(--color-muted)] line-clamp-2 leading-relaxed">
          {{ recipe.description }}
        </p>
      </RouterLink>

      <!-- Footer -->
      <div class="flex items-center justify-between mt-4 pt-3 border-t border-black/5">
        <span class="text-[0.6875rem] text-[var(--color-muted)] tracking-wide">
          {{ recipe.ingredients?.length ?? 0 }} ingredienti
        </span>
        <RouterLink :to="`/ricetta/${recipe.id}`" class="text-[0.6875rem] font-semibold text-[var(--color-accent)] hover:text-[#a6854f] transition-colors tracking-wide uppercase">
          Apri
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ recipe: Object })
defineEmits(['delete'])
</script>
