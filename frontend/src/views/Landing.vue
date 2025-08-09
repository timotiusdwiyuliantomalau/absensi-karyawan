<template>
  <div class="container">
    <h1>Landing Page (Public)</h1>
    <form @submit.prevent="onLogin" class="card">
      <label>Email</label>
      <input v-model="email" type="email" required />
      <label>Password</label>
      <input v-model="password" type="password" required />
      <button type="submit">Login</button>
      <p class="hint">Default: admin@example.com / password</p>
    </form>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
const auth = useAuthStore()
const router = useRouter()
const email = ref('admin@example.com')
const password = ref('password')
async function onLogin(){
  await auth.login(email.value, password.value)
  router.push('/dashboard')
}
</script>
<style scoped>
.container{padding:24px}
.card{display:flex;flex-direction:column;gap:8px;max-width:320px}
input{padding:8px;border:1px solid #e5e7eb;border-radius:6px}
button{padding:8px 12px;background:#2563eb;color:white;border:none;border-radius:6px}
.hint{font-size:12px;color:#6b7280}
</style>