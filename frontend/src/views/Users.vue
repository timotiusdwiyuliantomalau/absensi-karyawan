<template>
  <div class="container">
    <h2>User Management (Admin only)</h2>
    <form @submit.prevent="create" class="card">
      <input v-model="form.name" placeholder="Name" />
      <input v-model="form.email" placeholder="Email" />
      <input v-model="form.password" placeholder="Password" type="password" />
      <input v-model="form.rolesText" placeholder="Roles (comma separated)" />
      <button>Create</button>
    </form>
    <div class="controls">
      <input v-model="search" placeholder="Search" @input="fetch()" />
    </div>
    <table>
      <thead><tr><th>Name</th><th>Email</th><th>Roles</th><th>Action</th></tr></thead>
      <tbody>
        <tr v-for="u in users" :key="u.id">
          <td>{{ u.name }}</td>
          <td>{{ u.email }}</td>
          <td>{{ u.roles.join(', ') }}</td>
          <td>
            <button @click="remove(u)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
const auth = useAuthStore()
const users = ref([])
const search = ref('')
const form = reactive({ name: '', email: '', password: '', rolesText: '' })
async function fetch(){
  const { data } = await axios.get('/users', { params: { search: search.value } })
  users.value = data.data
}
async function create(){
  const roles = form.rolesText.split(',').map(s=>s.trim()).filter(Boolean)
  await axios.post('/users', { name: form.name, email: form.email, password: form.password, roles })
  form.name=form.email=form.password=form.rolesText=''
  fetch()
}
async function remove(u){ await axios.delete(`/users/${u.id}`); fetch() }

onMounted(()=>{ if(auth.isAuthenticated||auth.restore()) fetch() })
</script>
<style scoped>
.container{padding:24px}
.card{display:flex;gap:8px;margin-bottom:12px}
.controls{margin:8px 0}
input{padding:6px;border:1px solid #e5e7eb;border-radius:6px}
</style>