<template>
  <h1>401 You are not authorized</h1>
  <p>You don't have permission to access this page.</p>
  <router-link class="btn btn-primary" to="/">Authenticate</router-link>
</template>

<script lang="ts">

export default {
  name: 'unauthorized',
  components: {

  },
  setup() {
  }
}
</script>
<style scoped></style>
