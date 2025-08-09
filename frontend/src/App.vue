<script setup>
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'
const router = useRouter()
const auth = useAuthStore()
function go(path){
  router.push(path)
}
</script>

<template>
  <div>
    <nav class="nav">
      <a href="/" @click.prevent="go('/')">Landing</a>
      <a href="/dashboard" @click.prevent="go('/dashboard')">Dashboard</a>
      <a href="/roles" @click.prevent="go('/roles')">Roles</a>
      <a href="/users" @click.prevent="go('/users')">Users</a>
      <a href="/projects" @click.prevent="go('/projects')">Projects</a>
    </nav>
    <router-view />
  </div>
</template>

<style scoped>
.nav{
  display:flex;gap:12px;padding:10px;background:#f3f4f6;border-bottom:1px solid #e5e7eb
}
.nav a{color:#111827;text-decoration:none}
</style>
