<template>
  <section class="mx-auto mt-8 text-center">
    <button class="btn btn-primary pill" v-if="!isAuth && !accessToken" @click="handleAuthentication">
      Auth
    </button>
    <button class="btn btn-success pill" v-if="isAuth && !accessToken" @click="handleAuthentication">
      Login
    </button>
  </section>
</template>

<script>
import { ref, reactive, computed, watchEffect } from 'vue'
import { getUserAuth, getToken } from '@/api/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'auth',
  setup() {
    const router = useRouter()
    const accessToken = ref(localStorage.getItem('access_token') !== null);
    const routeParams = reactive({
      code: null
    });
    const isAuth = computed(() => Boolean(routeParams.code));

    const handleAuthentication = async () => {
      if (isAuth.value) {
        try {
          const res = await getToken(routeParams.code);
          accessToken.value = true;
          goToHome()
        } catch (error) {
          console.error('Authentication error:', error);
        }
      } else {
        try {
          const res = await getUserAuth();
        } catch (error) {
          console.error('Authentication error:', error);
        }
      }
    }

    watchEffect(() => {
      const params = new URLSearchParams(window.location.search);
      routeParams.code = params.get('code');
    });

    const goToHome = () => {
      router.push('/home');
    };

    return {
      accessToken, isAuth, handleAuthentication, goToHome
    };
  }
}
</script>

