<template>
  <RouterLink :to="{ name: 'playlist-detail', params: { playlistId: playlist.id } }">
    <div class="card h-100">
      <img :src="playlist.images[0].url" class="card-img-top" :alt="`Playlist ${playlist.name} image`">
      <h5 class="card-title mt-2 text-center">{{ playlist.name }}</h5>
      <div class="card-body d-flex px-2 pt-3 pb-0">
        <div class="flex-grow-1">
          <p class="m-0">Total tracks: {{ playlist.tracks.total }}</p>
        </div>
        <div>
          <RouterLink :to="{ name: 'playlist-detail', params: { playlistId: playlist.id } }" class="r-link">
            See tracks
          </RouterLink>
        </div>
      </div>
      <div class="card-footer text-center p-0">
        <a v-if="playlist.external_urls.spotify" :href="playlist.external_urls.spotify" target="_blank" role="button">
          <i class="bi bi-play-circle-fill mue-purple"></i></a>
        <p class="mb-0 mt-n1">Open in Spotify</p>
      </div>
    </div>
  </RouterLink>
</template>

<script>
import { ref, computed } from 'vue'
export default {
  name: 'PlaylistCard',
  components: {

  },
  props: {
    playlist: {
      type: Object
    }
  },
  setup(props) {
    const playlist = ref(props.playlist)
    const tracks = computed(() => playlist.value?.tracks);
    return {
      playlist, tracks
    }
  }
}
</script>

<style scoped></style>