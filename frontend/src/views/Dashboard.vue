<template>
  <div class="container">
    <h2>Dashboard (Protected)</h2>
    <p>Welcome, {{ auth.user?.name }}</p>
  </div>
</template>
<script setup>
import { useAuthStore } from '../stores/auth'
const auth = useAuthStore()
</script>
<style scoped>
.container{padding:24px}
</style>