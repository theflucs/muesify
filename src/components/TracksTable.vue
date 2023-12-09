<template>
  <section v-if="tracks.length > 0" id="tracks" class="container py-5">
    <div class="row">
      <div class="col">
        <table class="table" v-if="tracks.length > 0">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col" v-for="tp in tracksProperties">
                {{ tp }}
              </th>
            </tr>
          </thead>
          <tbody class="table-striped">
            <tr v-for="(track, trackIndex) in tracks" :key="trackIndex">
              <th scope="row">{{ trackIndex + 1 }}</th>
              <td>{{ track.track.name }}</td>
              <td>{{ track.track.album.name }} - {{ track.track.album.release_date }}</td>
              <td>{{ track.added_at }}</td>
              <td>{{ track.track.popularity }}</td>
              <td><i class="bi bi-trash3" @click="deleteTrack(track.track.uri)" role="button"></i></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="row">
      <div class="col d-flex justify-content-center">
        <button class="btn mue-btn-yellow btn-md" @click="seeMore">
          See more...
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import { onMounted, ref, computed } from 'vue';
import { getPlaylistTracks, deletePlaylistTrack } from '@/api/services'

export default {
  name: 'TracksTable',
  components: {

  },
  props: {
    playlistId: {
      type: String
    },
    snapshotId: {
      type: String
    },
  },
  setup(props) {
    const playlistId = ref(props.playlistId)
    const snapshotId = ref(props.snapshotId)
    const tracks = ref([])
    const limit = ref(1);
    const offset = ref(0);
    const showSeeMoreBtn = computed(() => {
      return tracks.value.length >= offset.value + limit.value;
    });

    const tracksProperties = [
      'name', 'album', 'added_at', 'popularity', ''
    ]
    onMounted(async () => {
      try {
        await getTracks()
      } catch (error) {
        console.error('Failed getting playlist tracks', error);
      }
    });
    const getTracks = async () => {
      try {
        const res = await getPlaylistTracks(playlistId.value, limit.value, offset.value);
        tracks.value.push(...res.items);
      } catch (error) {
        console.error('Failed getting playlist tracks', error);
      }
    }

    const seeMore = async () => {
      offset.value += limit.value;
      try {
        await getTracks()
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    const deleteTrack = async (uri) => {
      const payload = {
        playlistId: playlistId.value,
        snapshotId: snapshotId.value,
        tracksUri: [{ uri }]
      }
      try {
        await deletePlaylistTrack(payload);
        // toast success or error
        tracks.value = await getTracks()
        alert('success')
      } catch (error) {
        console.error('Failed deleting User track', error);
        alert('error')
      }
    };

    return {
      tracksProperties, tracks, showSeeMoreBtn, seeMore, deleteTrack
    }
  }
}
</script>

<style scoped></style>
