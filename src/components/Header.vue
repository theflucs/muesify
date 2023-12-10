<template>
  <header v-if="updateAccessToken" class="row text-light pb-0">
    <nav class="col navbar navbar-expand-lg position-sticky-top d-flex px-4">
      <div class="w-100">
        <h1>
          <RouterLink to="/" class="text-light ">Muesify</RouterLink>
        </h1>
      </div>
      <div class="flex-shrink-1">
        <i class="bi bi-person-circle" type="button" data-bs-toggle="modal" data-bs-target="#profileModal"
          @click="openProfile" :profile="profile"></i>
        <ProfileModal :profile="profile" />
      </div>
    </nav>
  </header>
</template>

<script>
import ProfileModal from './ProfileModal.vue';
import { ref } from 'vue';
import { getUserProfile } from '@/api/services';

export default {
  name: 'Header',
  components: {
    ProfileModal
  },
  setup() {
    const accessToken = ref(localStorage.getItem("access_token"));
    const updateAccessToken = () => {
      accessToken.value = localStorage.getItem("access_token");
    }
    const profile = ref(null);
    console.log(accessToken.value)
    const openProfile = async () => {
      await getProfile();
    }

    const getProfile = async () => {
      if (profile.value) {
        return;
      }
      try {
        profile.value = await getUserProfile();
        console.log('profile: ', profile.value);
      } catch (error) {
        console.error('Login error:', error);
      }
    }

    return {
      openProfile,
      profile,
      updateAccessToken
    }
  }
}
</script>

<style scoped>
header {
  background-color: #400073;
}

header .bi-person-circle {
  font-size: 2rem;
}

header h1 {
  font-size: 1.5rem;
}
</style>
