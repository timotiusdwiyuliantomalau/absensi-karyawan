<template>
  <div class="container">
    <h2>Projects</h2>
    <form @submit.prevent="createProject" class="card">
      <input v-model="pname" placeholder="Project name" />
      <button>Create</button>
    </form>

    <div class="controls">
      <input v-model="search" placeholder="Search" @input="fetchProjects()" />
      <select v-model="sort" @change="fetchProjects()">
        <option value="created_at">Created</option>
        <option value="name">Name</option>
      </select>
    </div>

    <div v-for="p in projects" :key="p.id" class="box">
      <h3>{{ p.name }}</h3>
      <div class="row">
        <form @submit.prevent="addTask(p)">
          <input v-model="taskTitle[p.id]" placeholder="Task title" />
          <input type="datetime-local" v-model="taskDue[p.id]" />
          <button>Add Task</button>
        </form>
        <form @submit.prevent="uploadDoc(p)">
          <input type="file" :ref="setDocRef(p.id)" accept="application/pdf" />
          <button>Upload PDF (100-500KB)</button>
        </form>
      </div>
      <ul>
        <li v-for="t in p.tasks || []" :key="t.id">
          <span>{{ t.title }} - due {{ t.due_at?.slice(0,10) }} - {{ t.is_done? 'Done':'Open' }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
const auth = useAuthStore()
const search = ref('')
const sort = ref('created_at')
const pname = ref('')
const projects = ref([])
const taskTitle = reactive({})
const taskDue = reactive({})
const docRefs = reactive({})
function setDocRef(id){ return (el)=>{ docRefs[id]=el } }
async function fetchProjects(){
  const { data } = await axios.get('/projects', { params: { search: search.value, sort: sort.value } })
  projects.value = data.data
}
async function createProject(){
  await axios.post('/projects', { name: pname.value })
  pname.value=''
  fetchProjects()
}
async function addTask(p){
  await axios.post('/tasks', { project_id: p.id, title: taskTitle[p.id], due_at: taskDue[p.id] || null })
  fetchProjects()
}
async function uploadDoc(p){
  const input = docRefs[p.id]
  const f = input?.files?.[0]
  if(!f) return
  const kb = Math.ceil(f.size/1024)
  if(kb < 100 || kb > 500){ alert('File size must be 100-500KB'); return }
  const form = new FormData()
  form.append('project_id', p.id)
  form.append('file', f)
  await axios.post('/documents', form, { headers: { 'Content-Type': 'multipart/form-data' }})
  input.value = ''
}

onMounted(()=>{ if(auth.isAuthenticated||auth.restore()) fetchProjects() })
</script>
<style scoped>
.container{padding:24px}
.card{display:flex;gap:8px;margin-bottom:12px}
.controls{display:flex;gap:8px;margin:12px 0}
.box{border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin-bottom:12px}
.row{display:flex;gap:12px}
</style>