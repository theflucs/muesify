<template>
  <main>
    <section id="home-section">
      <h1>Home</h1>
      <List type="featuredPlaylists" />
      <List type="playlists" v-if="profile" />
    </section>
  </main>
</template>

<script>
import { onMounted, ref } from 'vue'
import { getUserProfile } from '@/api/services'
import { isAuthenticated } from "@/utils";
import List from '@/views/List.vue'

export default {
  name: 'home',
  components: {
    Playlists
  },
  setup() {
    const profile = ref(null);
    const userId = ref(localStorage.getItem('user_id') !== null);
    onMounted(async () => {
      if (isAuthenticated() && !profile.value) {
        await getProfile();
      }
    })

    const getProfile = (async () => {
      try {
        profile.value = await getUserProfile();
        localStorage.setItem("user_id", profile.value?.id);
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
