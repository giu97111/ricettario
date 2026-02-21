import { createRouter, createWebHistory } from 'vue-router'
import RecipeList from '@/views/RecipeList.vue'
import RecipeDetail from '@/views/RecipeDetail.vue'
import RecipeForm from '@/views/RecipeForm.vue'
import LabelPrint from '@/views/LabelPrint.vue'

const routes = [
  { path: '/', name: 'home', component: RecipeList },
  { path: '/ricetta/:id', name: 'recipe-detail', component: RecipeDetail },
  { path: '/nuova', name: 'recipe-new', component: RecipeForm },
  { path: '/modifica/:id', name: 'recipe-edit', component: RecipeForm },
  { path: '/etichetta/:id', name: 'label-print', component: LabelPrint },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
