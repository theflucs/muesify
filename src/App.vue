<template>
  <header>
    <nav class="navbar navbar-expand-lg position-sticky-top">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
    <h1>Muesify</h1>
  </header>
  <RouterView />
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'
</script>


<style scoped></style>
