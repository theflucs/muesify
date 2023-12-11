<template>
  <section v-if="playlists.length > 0" :id="type" class="container">
    <div class="row my-5 d-flex flex-column align-items-end">
      <div class="col">
        <h3 class="text-center pb-4">
          <span v-if="type === 'playlists'">Your </span>{{ formatString(type) }}
        </h3>
        <h4 v-if="msg" class="text-center">{{ msg }}</h4>
      </div>
    </div>
    <div class="row gy-3">
      <div class="col-md-3" v-for="p in playlists" :key="p.id">
        <PlaylistCard :playlist="p" />
      </div>
    </div>
    <div class="row pt-3">
      <div class="col d-flex justify-content-center">
        <button type="button" v-if="!isLoading && showSeeMoreBtn" class="btn mue-btn-yellow btn-md" @click="seeMore">
          See more...
        </button>
        <div v-if="isLoading" class="spinner-border text-warning" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  </section>
  <p class="mue-yellow text-center fw-bold" v-if="!isLoading && playlists.length === 0">
    There is no {{ formatString(type) }} available
  </p>
</template>

<script>
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getUserPlaylists, getFeaturedPlaylists } from '@/api/services';
import { formatString, removeHtmlTags } from '@/utils';
import PlaylistCard from '@/components/PlaylistCard.vue';

export default {
  name: 'Playlists',
  components: {
    PlaylistCard,
  },
  props: {
    type: {
      type: String,
    },
  },
  setup(props) {
    const route = useRoute();
    const type = ref(props.type);
    const playlists = ref([]);
    const limit = ref(4);
    const offset = ref(0);
    const showSeeMoreBtn = computed(() => playlists.value.length >= offset.value + limit.value);
    const isLoading = ref(false);
    const msg = ref(null);

    onMounted(async () => {
      if (type.value === 'playlists') {
        await getPlaylists();
      }
      if (type.value === 'featuredPlaylists') {
        await getFeatPlaylists();
      }
    });

    const getPlaylists = async () => {
      isLoading.value = true;
      try {
        const res = await getUserPlaylists(localStorage.getItem('user_id'), limit.value, offset.value);
        playlists.value.push(...res.items);
        history.pushState(
          {},
          null,
          route.path + '?limit=' + encodeURIComponent(limit.value) + '&offset=' + encodeURIComponent(offset.value)
        );
      } catch (error) {
        console.error('Failed getting UserPlaylists', error);
      } finally {
        isLoading.value = false;
      }
    };

    const getFeatPlaylists = async () => {
      isLoading.value = true;
      try {
        const res = await getFeaturedPlaylists(limit.value, offset.value);
        playlists.value.push(...res.playlists.items);
        msg.value = res.message;
        history.pushState(
          {},
          null,
          route.path + '?limit=' + encodeURIComponent(limit.value) + '&offset=' + encodeURIComponent(offset.value)
        );
      } catch (error) {
        console.error('Failed getting FeaturedPlaylists', error);
      } finally {
        isLoading.value = false;
      }
    };

    const seeMore = async () => {
      offset.value += limit.value;

      try {
        if (type.value === 'playlists') {
          await getPlaylists();
        }

        if (type.value === 'featuredPlaylists') {
          await getFeatPlaylists();
        }
      } catch (error) {
        console.error('Error fetching mor playlists:', error);
      }
    };

    return {
      type,
      msg,
      playlists,
      formatString,
      removeHtmlTags,
      seeMore,
      showSeeMoreBtn,
      isLoading,
    };
  },
};
</script>

<style scoped></style>
