<template>
  <main>
    <h1>Home</h1>
  </main>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex';
import { getUserProfile, getUserPlaylists } from '@/api/services'
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
        await getPlaylists();
      } catch (error) {
        console.error('Authentication error:', error);
      }
    })

    const getPlaylists = (async () => {
      try {
        const userId = store.state.user.id;
        const res = await getUserPlaylists(userId);
        console.log('playlists', res.items)
      } catch (error) {
        console.error('Failed getting UserPlaylists', error);
      }
    })
  }
}
</script>

<style scoped></style>
