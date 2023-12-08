<template>
  <section :id="`${type}`">
    <h2>{{ type }}</h2>
  </section>
</template>

<script>
import { onMounted, ref, computed } from 'vue'
import { getUserPlaylists, getFeaturedPlaylists } from '@/api/services'

export default {
  name: 'List',
  components: {

  },
  props: {
    type: {
      type: String,
    },
  },
  setup(props) {
    const type = ref(props.type)
    const playlists = ref([])
    const tracks = computed(() => playlists.value?.items.map(p => p.tracks));
    const featPlaylists = ref([])

    onMounted(async () => {
      if (type.value === "playlists") {
        await getPlaylists();
      }
      if (type.value === "featuredPlaylists") {
        await getFeatPlaylists();
      }
    })
    const getPlaylists = (async () => {
      try {
        playlists.value = await getUserPlaylists(localStorage.getItem("user_id"));
        console.log('playlists', playlists.value)
        console.log('tracks', tracks.value)
      } catch (error) {
        console.error('Failed getting UserPlaylists', error);
      }
    })
    const getFeatPlaylists = (async () => {
      try {
        featPlaylists.value = await getFeaturedPlaylists();
        console.log('featPlaylists', featPlaylists.value)
      } catch (error) {
        console.error('Failed getting FeaturedPlaylists', error);
      }
    })
    return {
      type, playlists, tracks, featPlaylists
    }
  }
}
</script>
<style scoped></style>
