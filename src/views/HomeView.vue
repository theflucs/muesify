<template>
  <main>
    <section id="home-section" class="pt-5">
      <h2 v-if="profile && sayWelcome" class="text-center">Welcome back, {{ profile.display_name }}</h2>
      <Playlists type="featuredPlaylists" />
      <Playlists type="playlists" v-if="profile" />
    </section>
  </main>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { getUserProfile } from '@/api/services'
import { isAuthenticated } from "@/utils";
import Playlists from '@/views/Playlists.vue'

export default {
  name: 'home',
  components: {
    Playlists
  },
  setup() {
    const profile = ref(null);
    onMounted(async () => {
      if (isAuthenticated() && !profile.value) {
        await getProfile();
      }
    })

    const getProfile = (async () => {
      try {
        profile.value = await getUserProfile();
        localStorage.setItem("user_id", profile.value?.id);
        localStorage.setItem("user_name", profile.value?.display_name);
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
