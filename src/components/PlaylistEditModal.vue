<template>
  <div class="modal fade" id="editPlaylistModal" tabindex="-1" aria-labelledby="editPlaylistModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="editPlaylistModalLabel">Edit your playlist</h1>
          <button type="button" class="btn-close close-btn" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <label for="inputPlaylistName">Name</label>
          <input type="text" id="inputPlaylistName" class="form-control form-control-lg" placeholder="Name"
            v-model="playlistNameRef">
          <label for="textareaEditPlaylistDescription">Description</label>

          <textarea class="form-control text-area mt-2" id="textareaEditPlaylistDescription" placeholder="Description"
            v-model="playlistDescriptionRef"></textarea>
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
</template>

<script>
import { ref } from 'vue';
export default {
  name: 'PlaylistEditModal',
  props: {
    playlistNameRef: {
      type: String
    },
    playlistDescriptionRef: {
      type: String
    },
    isPublicRef: {
      type: Boolean
    }
  },
  emits: ["savePlaylistDetail"],
  setup(props, context) {
    const playlistNameRef = ref(props.playlistNameRef);
    const playlistDescriptionRef = ref(props.playlistDescriptionRef);
    const isPublicRef = ref(props.isPublicRef);

    const save = () => {
      context.emit('savePlaylistDetail', {
        name: playlistNameRef.value,
        description: playlistDescriptionRef.value,
        public: isPublicRef.value,
      });
    }

    return {
      playlistNameRef, playlistDescriptionRef, isPublicRef, save
    }
  }
}
</script>

<style scoped>
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
  color: #cbf55c;
  ;
}

.text-area {
  height: 12rem;
}
</style>
