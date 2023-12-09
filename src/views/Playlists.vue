<template>
  <section v-if="playlists.length > 1" :id="`${type}`" class="container py-5">
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
        <button class="btn mue-btn-yellow btn-md" @click="seeMore">
          See more...
        </button>
      </div>
    </div>
  </section>
</template>


<script>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router';
import { getUserPlaylists, getFeaturedPlaylists } from '@/api/services'
import { formatString, removeHtmlTags } from '@/utils'
import PlaylistCard from '@/components/PlaylistCard.vue'

export default {
  name: 'Playlists',
  components: {
    PlaylistCard
  },
  props: {
    type: {
      type: String,
    },
  },
  setup(props) {
    const route = useRoute()
    const type = ref(props.type);
    const playlists = ref([]);
    const limit = ref(4);
    const offset = ref(0);

    onMounted(async () => {
      if (type.value === "playlists") {
        await getPlaylists();
      }
      if (type.value === "featuredPlaylists") {
        await getFeatPlaylists();
      }
    });

    const getPlaylists = async () => {
      try {
        const res = await getUserPlaylists(localStorage.getItem("user_id"), limit.value, offset.value);
        playlists.value.push(...res.items);
        history.pushState(
          {},
          null,
          route.path + '?limit=' + encodeURIComponent(limit.value) + '&offset=' + encodeURIComponent(offset.value)
        )
      } catch (error) {
        console.error('Failed getting UserPlaylists', error);
      }
    };

    const getFeatPlaylists = async () => {
      try {
        const res = await getFeaturedPlaylists(limit.value, offset.value);
        playlists.value.push(...res.playlists.items);
        history.pushState(
          {},
          null,
          route.path + '?limit=' + encodeURIComponent(limit.value) + '&offset=' + encodeURIComponent(offset.value)
        )
      } catch (error) {
        console.error('Failed getting FeaturedPlaylists', error);
      }
    };

    const seeMore = async () => {
      offset.value += limit.value;

      try {
        if (type.value === "playlists") {
          await getPlaylists();
        }

        if (type.value === "featuredPlaylists") {
          await getFeatPlaylists();
        }
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    return {
      type, playlists, formatString, removeHtmlTags, seeMore
    };
  }
}
</script>
<style scoped></style>
