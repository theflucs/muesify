<template>
  <div class="container-fluid">
    <header class="row text-light pb-0">
      <nav class="col navbar navbar-expand-lg position-sticky-top d-flex px-4">
        <div class="w-100">
          <h1>
            <RouterLink to="/" class="text-light ">Muesify</RouterLink>
          </h1>
        </div>
        <div class="flex-shrink-1">
          <i class="bi bi-person-circle"></i>
        </div>
      </nav>
    </header>
    <RouterView />
  </div>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
header {
  background-color: #400073;
}

header .bi-person-circle {
  font-size: 2rem;
}

header h1 {
  font-size: 1.5rem;
}
</style>
