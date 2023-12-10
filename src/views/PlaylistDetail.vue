<template>
  <section v-if="playlist" id="playlist-detail" class="container py-5">
    <div class="row">
      <div class="col-md-3 d-flex align-items-center">
        <img v-if="playlistImg" :src="playlistImg" class="card-img-top pb-1" :alt="`${playlist.name} cover image`">
      </div>
      <div class="col d-flex flex-column position-relative">
        <i v-if="ownsPlaylist" class="bi bi-pencil position-absolute top-0 end-0 mt-2 me-2" type="button"
          data-bs-toggle="modal" data-bs-target="#editPlaylistModal"></i>
        <PlaylistEditModal :playlistNameRef="playlistNameRef" :playlistDescriptionRef="playlistDescriptionRef"
          :isPublicRef="isPublicRef" @savePlaylistDetail="savePlaylistDetail" />
        <div>
          <h4>{{ isPublicLabel }} Playlist</h4>
          <h2>{{ playlist.name.toUpperCase() }} </h2>
          <p v-if="playlist.description" class="mt-5">{{ removeHtmlTags(playlist.description) }}</p>
        </div>
        <div class="d-flex mt-auto flex-row">
          <p v-if="ownsPlaylist" class="mb-0">
            <!-- to fix: external URL error no token provided !-->
            <a v-if="playlist.owner.href" :href="playlist.owner.href" target="_blank" class="hide-cursor">
              Created by {{ playlist.owner.display_name }}
            </a>
          </p>
          &nbsp;
          <p class="mb-0">Total tracks: {{ tracks.length }} </p>
          &nbsp;
          <p v-if="playlist.followers.total > 0" class="mb-0">Followers: {{ playlist.followers.total }} </p>
        </div>
      </div>

    </div>
  </section>
  <TracksTable v-if="playlist" :playlistId="playlist.id" :snapshotId="playlist.snapshot_id" />
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getUserPlaylist, editPlaylistDetails } from '@/api/services';
import { removeHtmlTags } from '@/utils'
import TracksTable from '@/components/TracksTable.vue'
import PlaylistEditModal from '@/components/PlaylistEditModal.vue';
export default {
  name: 'playlist-detail',
  components: {
    TracksTable,
    PlaylistEditModal
  },
  emits: ["clickSeeMore"],
  setup() {
    const route = useRoute();
    const { playlistId } = route.params;
    const playlist = ref(null)
    const tracks = computed(() => playlist.value?.tracks.items.map(t => t.track));
    const ownsPlaylist = computed(() => playlist.value?.owner.display_name === localStorage.getItem("user_name"))
    const playlistNameRef = ref('');
    const playlistDescriptionRef = ref('');
    const isPublicRef = ref('');
    const isPublicLabel = computed(() => playlist.value?.public ? 'Public' : 'Private');
    const playlistImg = computed(() => playlist.value?.images.length > 0 ? playlist.value.images[0].url : null);

    onMounted(async () => {
      try {
        playlist.value = await getPlaylist()
        if (playlist.value) {
          playlistNameRef.value = playlist.value.name;
          playlistDescriptionRef.value = playlist.value.description;
          isPublicRef.value = playlist.value.public
        }
      } catch (error) {
        console.error(error);
      }
    });
    const getPropertyByString = (obj, propString) => {
      const props = propString.split('.');
      return props.reduce((prev, curr) => prev && prev[curr], obj);
    }

    const getPlaylist = async () => {
      try {
        const res = await getUserPlaylist(playlistId);
        return res
      } catch (error) {
        console.error('Failed getting single playlist', error);
      }
    }
    const editPlaylist = async (payload) => {
      try {
        await editPlaylistDetails(payload);
      } catch (error) {
        console.error('Failed editing single playlist', error);
      }
    }

    const savePlaylistDetail = async (payload) => {
      const updatedPayload = {
        ...payload,
        playlistId
      };
      try {
        await editPlaylist(updatedPayload)
        playlist.value = await getPlaylist()
      } catch (error) {
        console.error('Failed editing playlist details', error);
      }
    }

    return {
      playlist, tracks, removeHtmlTags, ownsPlaylist, isPublicLabel, playlistImg, getPropertyByString, playlistNameRef, playlistDescriptionRef, isPublicRef, savePlaylistDetail
    }
  }
}
</script>

<style scoped>
.bi-pencil {
  font-size: 1.5rem;
  color: #cbf55c;
}
</style>
