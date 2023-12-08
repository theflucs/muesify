<template>
  <main>
    <h1>Home</h1>
  </main>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex';
import { getUserProfile } from '@/api/services'
import { isAuthenticated } from "@/utils";

export default {
  name: 'home',
  components: {

  },
  setup() {
    const store = useStore()
    const profile = ref(null);

    onMounted(async () => {
      if (isAuthenticated() && store.state.user === null) {
        await getProfile();
      }
    })

    const getProfile = (async () => {
      try {
        profile.value = await getUserProfile();
        store.dispatch("setUser", profile.value);
        console.log('profile', profile.value)
      } catch (error) {
        console.error('Login error:', error);
      }
    })
    return {
      profile,
      getProfile,
    };
  }
}
</script>

<style scoped></style>
