import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../views/Landing.vue'
import Dashboard from '../views/Dashboard.vue'
import Roles from '../views/Roles.vue'
import Users from '../views/Users.vue'
import Projects from '../views/Projects.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'landing', component: Landing, meta: { public: true } },
    { path: '/dashboard', component: Dashboard },
    { path: '/roles', component: Roles },
    { path: '/users', component: Users, meta: { role: 'Administrator' } },
    { path: '/projects', component: Projects },
  ],
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.public) return next()
  if (!auth.isAuthenticated) {
    try { await auth.restore() } catch {}
  }
  if (!auth.isAuthenticated) return next({ path: '/' })
  if (to.meta.role && !auth.hasRole(to.meta.role)) return next({ path: '/' })
  next()
})

export default router