<template>
  <div class="container">
    <h2>Role Management</h2>
    <form @submit.prevent="create">
      <input v-model="name" placeholder="New role name" />
      <button>Add</button>
    </form>
    <div class="controls">
      <input v-model="search" placeholder="Search" @input="fetch()" />
      <select v-model="sort" @change="fetch()">
        <option value="name">Name</option>
        <option value="created_at">Created</option>
      </select>
    </div>
    <table>
      <thead><tr><th>Name</th><th>Action</th></tr></thead>
      <tbody>
        <tr v-for="r in roles" :key="r.id">
          <td>
            <input v-if="editId===r.id" v-model="editName" />
            <span v-else>{{ r.name }}</span>
          </td>
          <td>
            <button v-if="editId!==r.id" @click="startEdit(r)">Edit</button>
            <button v-else @click="save(r)">Save</button>
            <button @click="remove(r)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
const auth = useAuthStore()
const roles = ref([])
const name = ref('')
const search = ref('')
const sort = ref('name')
const editId = ref(null)
const editName = ref('')
async function fetch(){
  const { data } = await axios.get('/roles', { params: { search: search.value, sort: sort.value } })
  roles.value = data.data
}
async function create(){
  if(!name.value) return
  await axios.post('/roles', { name: name.value })
  name.value=''
  fetch()
}
function startEdit(r){ editId.value = r.id; editName.value = r.name }
async function save(r){ await axios.put(`/roles/${r.id}`, { name: editName.value }); editId.value=null; fetch() }
async function remove(r){ await axios.delete(`/roles/${r.id}`); fetch() }

onMounted(()=>{ if(auth.isAuthenticated||auth.restore()) fetch() })
</script>
<style scoped>
.container{padding:24px}
.controls{display:flex;gap:10px;margin:10px 0}
input,select{padding:6px;border:1px solid #e5e7eb;border-radius:6px}
table{width:100%;border-collapse:collapse}
th,td{border-bottom:1px solid #e5e7eb;padding:8px;text-align:left}
</style>