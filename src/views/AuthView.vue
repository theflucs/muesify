<template>
  <section v-if="!userId" id="authorize-or-login" class="container">
    <div class="row d-flex text-center align-items-center vh-100">
      <div class="col-md-6 mx-auto">
        <h1 v-if="!isAuth && !accessToken" class="mb-4">Welcome to Muesify</h1>
        <button type="button" class="btn mue-btn-yellow pill" v-if="!isAuth && !accessToken"
          @click="handleAuthentication">
          Authorize in App
        </button>
        <h1 v-if="isAuth && !accessToken" class="mb-4">Just one last step...</h1>
        <button type="button" class="btn mue-btn-yellow pill" v-if="isAuth && !accessToken" @click="handleAuthentication">
          Login
        </button>
      </div>
    </div>
  </section>

  <HomeView v-if="userId" />
</template>

<script>
import { ref, reactive, computed, watchEffect, provide } from 'vue'
import { getUserAuth, getToken } from '@/api/auth';
import { useRouter } from 'vue-router';
import HomeView from './HomeView.vue';

export default {
  name: 'auth',
  components: {
    HomeView
  },
  setup() {
    const router = useRouter()
    const accessToken = ref(localStorage.getItem('access_token') !== null);
    const userId = ref(localStorage.getItem('user_id') !== null);
    const routeParams = reactive({
      code: null
    });
    const isAuth = computed(() => Boolean(routeParams.code) || userId.value);

    const handleAuthentication = async () => {
      if (isAuth.value) {
        try {
          await getToken(routeParams.code);
          accessToken.value = true;
          goToHome()
        } catch (error) {
          console.error('Authentication error:', error);
        }
      } else {
        try {
          await getUserAuth();
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
      accessToken, isAuth, handleAuthentication, goToHome, userId
    };
  }
}
</script>

