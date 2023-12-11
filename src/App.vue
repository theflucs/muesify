<template>
  <div class="container-fluid">
    <Header />
    <RouterView />
  </div>
</template>

<script>
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'

export default {
  components: {
    Header
  }
}
</script>

<style scoped></style>
