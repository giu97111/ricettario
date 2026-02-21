import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import RecipeList from '@/views/RecipeList.vue'
import RecipeDetail from '@/views/RecipeDetail.vue'
import RecipeForm from '@/views/RecipeForm.vue'
import LabelPrint from '@/views/LabelPrint.vue'
import Login from '@/views/Login.vue'

const routes = [
  { path: '/login', name: 'login', component: Login, meta: { public: true } },
  { path: '/', name: 'home', component: RecipeList },
  { path: '/ricetta/:id', name: 'recipe-detail', component: RecipeDetail },
  { path: '/nuova', name: 'recipe-new', component: RecipeForm },
  { path: '/modifica/:id', name: 'recipe-edit', component: RecipeForm },
  { path: '/etichetta/:id', name: 'label-print', component: LabelPrint },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  if (authStore.loading) {
    await authStore.init()
  }

  if (!to.meta.public && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
