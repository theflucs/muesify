<template>
  <section :id="type" class="container py-5">
    <div class="row my-3">
      <div class="col">
        <h3 class="text-center pb-4">{{ formatString(type) }}</h3>
        <div class="row gy-3">
          <div v-for="p in playlists" :key="p.id" class="col-md-3">
            <PlaylistCard :playlist="p" />
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col d-flex justify-content-center">
        <button v-if="!isLoading && showSeeMoreBtn" class="btn mue-btn-yellow btn-md" @click="seeMore">
          See more...
        </button>
        <p v-if="!isLoading && !showSeeMoreBtn">No more playlists available</p>
        <div v-if="isLoading" class="spinner-border text-warning" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  </section>
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
        console.error('Error fetching playlists:', error);
      }
    };

    return {
      type,
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
