<template>
  <header class="text-light pb-0 px-4">
    <nav class="col navbar navbar-expand-lg position-sticky-top d-flex">
      <div class="w-100">
        <h1>
          <RouterLink to="/" class="text-light ">Muesify</RouterLink>
        </h1>
      </div>
      <div class="flex-shrink-1">
        <button type="button" class="btn border-0" :disabled="unauth" @click="openProfile"
          aria-label="Open profile modal">
          <i class="bi bi-person-circle" :class="{ 'text-white': !unauth, 'text-secondary': unauth }" type="button"
            data-bs-toggle="modal" data-bs-target="#profileModal" @click="openProfile"></i>
        </button>
        <ProfileModal :profile="profile" />
      </div>
    </nav>
  </header>

  <div v-if="unauth" class="d-flex justify-content-center">
    <div class="bg-light text-danger p-2">
      <h5 class="pt-2">You're not authorized to perform this action. Please authorize in app using the button below
      </h5>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import ProfileModal from './ProfileModal.vue';
import { getUserProfile } from '@/api/services';

export default {
  name: 'Header',
  components: {
    ProfileModal
  },
  setup() {
    const unauth = ref(false);

    const profile = ref(null);

    const openProfile = async () => {
      if (localStorage.getItem('access_token') !== null) {
        unauth.value = false;
        await getProfile();
      } else {
        unauth.value = true;
      }
    };

    const getProfile = async () => {
      if (profile.value) {
        unauth.value = false;
        return;
      }
      try {
        profile.value = await getUserProfile();
        unauth.value = false;
      } catch (error) {
      }
    };

    return {
      openProfile,
      profile,
      unauth
    };
  }
};
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
