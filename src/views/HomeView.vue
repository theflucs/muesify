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
import { useStore } from 'vuex';
import { getUserProfile } from '@/api/services'
import { isAuthenticated } from "@/utils";
import List from '@/views/List.vue'

export default {
  name: 'home',
  components: {
    List
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
        localStorage.setItem("user_id", profile.value.id);
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
