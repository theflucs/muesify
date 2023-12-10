<template>
  <section v-if="tracks.length > 0" id="tracks" class="container py-5">
    <div class="row">
      <div class="col">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col" v-for="tp in tracksProperties">
                {{ formatString(tp) }}
              </th>
            </tr>
          </thead>
          <tbody class="table-striped">
            <tr v-for="(track, trackIndex) in tracks" :key="trackIndex">
              <th scope="row">{{ trackIndex + 1 }}</th>
              <td>{{ track.track.name }}</td>
              <td>{{ track.track.album.name }} - {{ track.track.album.release_date }}</td>
              <td>{{ track.added_at }}</td>
              <td>
                <i v-for="star in Array(categorizePopularity(track.track.popularity)).fill()"
                  class="bi bi-star-fill text-warning"></i>
              </td>
              <td>
                <button :disabled="track.added_by.id !== userId" @click="deleteTrack(track.track.uri)"
                  aria-label="Delete playlist track">
                  <i class="bi bi-trash3 text-danger"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="row">
      <div class="col d-flex justify-content-center">
        <button v-if="!isLoading && showSeeMoreBtn" class="btn mue-btn-yellow btn-md" @click="seeMore">
          See more...
        </button>
        <p v-if="!isLoading && !showSeeMoreBtn">No more tracks available</p>
        <div v-if="isLoading" class="spinner-border text-warning" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  </section>
  <p class="mue-yellow text-center fw-bold" v-if="!isLoading && tracks.length === 0">This playlist doesn't contain any
    tracks</p>
</template>

<script>
import { onMounted, ref, computed } from 'vue';
import { getPlaylistTracks, deletePlaylistTrack } from '@/api/services';
import { formatString, categorizePopularity } from '@/utils';

export default {
  name: 'TracksTable',
  components: {},
  props: {
    playlistId: {
      type: String,
    },
    snapshotId: {
      type: String,
    },
  },
  setup(props) {
    const playlistId = ref(props.playlistId);
    const snapshotId = ref(props.snapshotId);
    const tracks = ref([]);
    const limit = ref(5);
    const offset = ref(0);
    const showSeeMoreBtn = computed(() => tracks.value.length >= offset.value + limit.value);
    const userId = ref(localStorage.getItem('user_id'));
    const isLoading = ref(false);

    const tracksProperties = ['name', 'album', 'added_at', 'popularity', ''];

    onMounted(async () => {
      try {
        await getTracks();
      } catch (error) {
        console.error('Failed getting playlist tracks', error);
      }
    });

    const getTracks = async (more = true) => {
      isLoading.value = true;
      try {
        const res = await getPlaylistTracks(playlistId.value, limit.value, offset.value);
        if (more) {
          tracks.value.push(...res.items);
        } else {
          offset.value = res.offset
          limit.value = res.limit
          tracks.value = res.items;
        }
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    };

    const seeMore = async () => {
      offset.value += limit.value;
      try {
        await getTracks(true);
      } catch (error) {
        console.error('Error fetching more tracks:', error);
      }
    };

    const deleteTrack = async (uri) => {
      const payload = {
        playlistId: playlistId.value,
        snapshotId: snapshotId.value,
        tracksUri: [{ uri }]
      };
      try {
        await deletePlaylistTrack(payload);
        // toast success or error
        tracks.value = await getTracks();
        alert('success');
      } catch (error) {
        console.error('Failed deleting User track', error);
        alert('error');
      }
    };

    return {
      tracksProperties,
      formatString,
      categorizePopularity,
      tracks,
      showSeeMoreBtn,
      seeMore,
      userId,
      deleteTrack,
      isLoading,
    };
  },
};
</script>

<style scoped>
th,
td {
  background-color: #400073;
  color: #f7ecff;
  border: none;
}
</style>
