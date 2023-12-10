<template>
  <div class="modal fade" id="profileModal" tabindex="-1" aria-labelledby="profileModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div v-if="profile" class="modal-content">
        <div class="modal-header p-2">
          <button type="button" class="btn-close close-btn" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col">
              <p>Name: <span class="modal-data">{{ profile.display_name }}</span></p>
              <p>Email: <span class="modal-data">{{ profile.email }}</span></p>
              <p>Followers: <span class="modal-data">{{ profile.followers.total }}</span></p>
              <p class="text-uppercase">Account type: <span class="modal-data">{{ profile.product }}</span></p>
              <p>Country: <span class="modal-data">{{ profile.country }}</span></p>
            </div>
            <div class="col-md-4">
              <img :src="profile.images[0].url" class="rounded-pill float-end" alt="Profile image"
                width="`${profile.images[0].width}`" height="`${profile.images[0].height}`">
            </div>
          </div>
        </div>
        <div class="modal-footer fw-bold">
          <button type="button" class="btn btn-like" data-bs-dismiss="modal" @click="logout">Logout</button>
          <a :href="profile.uri" target="_blank" role="button" class="btn btn-like">
            Go to your profile in Spotify
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'ProfileModal',
  props: {
    profile: {
      type: Object
    }
  },
  setup(props, context) {
    const router = useRouter()
    const profile = ref(props.profile);

    watch(() => props.profile, (newProfile) => {
      profile.value = newProfile;
    });

    const logout = () => {
      localStorage.clear()
      router.push('/');
    }

    return {
      profile, logout
    };
  }
};
</script>

<style scoped>
.modal-content {
  border: 1px solid #cbf55c;
}

.modal-body,
.modal-footer {
  background-color: #400073;
  color: #f7ecff;
  font-weight: bold;
}

.modal-header {
  background-color: #cbf55c;
  border-bottom: none;
}

.modal-footer {
  border-top: none;
}

.modal-data {
  color: #cbf55c;
}

.btn-like {
  background-color: #cbf55c;
  color: #1e063c;
}

.close-btn {
  color: #cbf55c;
}
</style>
