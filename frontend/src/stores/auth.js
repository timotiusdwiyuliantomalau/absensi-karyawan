import { defineStore } from 'pinia'
import axios from 'axios'

axios.defaults.baseURL = '/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({ token: localStorage.getItem('token') || '', user: null }),
  getters: {
    isAuthenticated: (s) => !!s.token,
    roles: (s) => (s.user?.roles || []),
  },
  actions: {
    async login(email, password){
      const { data } = await axios.post('/login', { email, password })
      this.token = data.token
      localStorage.setItem('token', this.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      this.user = data.user
    },
    async restore(){
      const t = this.token
      if (!t) throw new Error('No token')
      axios.defaults.headers.common['Authorization'] = `Bearer ${t}`
      const { data } = await axios.get('/me')
      this.user = data
    },
    hasRole(role){
      return this.roles.includes(role)
    },
    async logout(){
      await axios.post('/logout')
      this.token = ''
      this.user = null
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    }
  }
})