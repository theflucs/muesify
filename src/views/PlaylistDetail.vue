<template>
  <section v-if="playlist" id="playlist-detail" class="container py-5">
    <div class="row">
      <div class="col-md-3 d-flex align-items-center">
        <img :src="playlist.images[0].url" class="card-img-top pb-1" :alt="`${playlist.name} cover image`">
      </div>
      <div class="col d-flex flex-column position-relative">
        <i v-if="ownsPlaylist" class="bi bi-pencil position-absolute top-0 end-0 mt-2 me-2" type="button"
          data-bs-toggle="modal" data-bs-target="#editPlaylistModal"></i>
        <!-- Modal -->
        <div class="modal fade" id="editPlaylistModal" tabindex="-1" aria-labelledby="editPlaylistModalLabel"
          aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="editPlaylistModalLabel">Edit you playlist</h1>
                <button type="button" class="btn-close close-btn" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <label for="inputPlaylistName">Name</label>
                <input type="text" id="inputPlaylistName" class="form-control form-control-lg" placeholder="Name"
                  v-model="playlistNameRef">
                <label for="textareaEditPlaylistDescription">Description</label>

                <textarea class="form-control text-area mt-2" id="textareaEditPlaylistDescription"
                  placeholder="Description" v-model="playlistDescriptionRef"></textarea>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" name="isPlaylistPublic" id="isPlaylistPublic"
                    v-model="isPublicRef" :checked="isPublicRef">
                  <label class="form-check-label" for="isPlaylistPublic">
                    Public
                  </label>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" @click="save" data-bs-dismiss="modal">Save changes</button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h4>{{ isPublicLabel }} Playlist</h4>
          <h2>{{ playlist.name.toUpperCase() }} </h2>
          <p v-if="playlist.description">{{ removeHtmlTags(playlist.description) }}</p>
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
  <TracksTable v-if="playlist" :playlistId="playlist.id" snapshotId: playlist.snapshot_id />
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getUserPlaylist, editPlaylistDetails } from '@/api/services';
import { removeHtmlTags } from '@/utils'
import TracksTable from '@/components/TracksTable.vue'

export default {
  name: 'playlist-detail',
  components: {
    TracksTable
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
    onMounted(async () => {
      try {
        playlist.value = await getPlaylist()

        playlistNameRef.value = playlist.value.name | '';
        playlistDescriptionRef.value = playlist.value.description || '';
        isPublicRef.value = playlist.public || false
      } catch (error) {
        console.error('Failed getting User tracks', error);
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
        console.error('Failed getting single playlist', error);
      }
    }

    const save = async () => {
      const payload = {
        playlistId: playlist.value.id,
        name: playlistNameRef.value,
        description: playlistDescriptionRef.value,
        public: isPublicRef.value,
      }
      console.log('payload', payload)
      try {
        await editPlaylist(payload)
        playlist.value = await getPlaylist()
      } catch (error) {
        console.error('Failed editing playlist details', error);
      }
    }

    return {
      playlist, tracks, removeHtmlTags, ownsPlaylist, isPublicLabel, getPropertyByString, playlistNameRef, playlistDescriptionRef, isPublicRef, save
    }
  }
}
</script>

<style scoped>
.bi-pencil {
  font-size: 1.5rem;
  color: #cbf55c;
}

.modal-content {
  border: 1px solid #cbf55c;
}

.modal-header,
.modal-body,
.modal-footer {
  background-color: #1e063c;
  color: #f8f9fa;
}

.close-btn {
  color: #f8f9fa;
}

.text-area {
  height: 12rem;
}
</style>
