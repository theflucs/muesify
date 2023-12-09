<template>
  <section id="authorize-or-login" class="row d-flex text-center align-items-center vh-100">
    <div class="col-md-6 mx-auto">
      <h1 class="mue-yellow">401</h1>
      <h3 class="my-5">Sorry, you are not authorized to access this page.</h3>
      <Router-link role="buton" class="btn mue-btn-yellow pill" to="/">Authorize in App</Router-link>
    </div>
  </section>
</template>

<script>

export default {
  name: 'unauthorized',
  components: {

  },
  setup() {
  }
}
</script>
<style scoped></style>
