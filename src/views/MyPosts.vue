<template>
  <AppLayout>
    <div class="mt-5">
      <div class="post-grid">
        <div
          v-for="post in posts"
          :key="post.identifier"
          class="card video-post mb-2"
        >
          <div class="card-header">
            <h5 class="card-title">{{ trimText(post.title, 30) }}</h5>
            <small class="text-muted">
              Posted on {{ formatDate(post.created_at) }}
            </small>
          </div>
          <div class="card-body">
            <span
              class="badge rounded-pill mb-2"
              :class="statusClass(post.status)"
            >{{ post.display_status }}</span>
            <div class="m2-5">
              <video
                ref="videoPlayer"
                :id="'video-' + post.identifier"
                class="video-js"
                controls
                preload="auto"
                width="300"
                height="300"
              >
                <source :src="post.video_url" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div class="mt-10" style="padding: 10px; display: flex; justify-content: space-between;">
              <button class="btn btn-primary btn-sm" @click="editPost(post.identifier)">
                <span><i class="fas fa-edit"></i>Edit</span>
              </button>
              <button class="btn btn-danger btn-sm" @click="deletePost(post.identifier)">
                <span><i class="fas fa-trash"></i>Delete</span>
              </button>
            </div>
            <p>
              {{ trimText(post.post_body, 100) }}
            </p>
          </div>
        </div>
      </div>
      <div v-if="loading" class="text-center mb-3">Loading more posts...</div>
      <div v-if="!hasMorePosts && !loading" class="text-center mb-3">
        No more posts to load.
      </div>
      <div v-if="hasMorePosts && !loading" class="text-center mb-3">
        <button @click="fetchPosts" class="btn btn-primary">Load More</button>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import AppLayout from "../components/AppLayout.vue";
import http from "@/http";
import "video.js/dist/video-js.css";
import videojs from "video.js";
import router from "@/router";

export default {
  name: "MyPosts",
  components: {
    AppLayout,
  },
  setup() {
    const posts = ref([]);
    const loading = ref(false);
    const hasMorePosts = ref(true);
    let page = 1;
    const videoPlayer = ref(null);
    let player = null;

    const fetchPosts = async () => {
      if (!hasMorePosts.value) return;

      loading.value = true;
      try {
        const response = await http.get(`/posts/my-posts?page=${page}`);
        if (response.data.length > 0) {
          posts.value.push(...response.data);
          page++;
        } else {
          hasMorePosts.value = false;
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        loading.value = false;
      }
    };

    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 500 &&
        !loading.value &&
        hasMorePosts.value
      ) {
        fetchPosts();
      }
    };

    onMounted(() => {
      fetchPosts();
      window.addEventListener("scroll", onScroll);
      if (videoPlayer.value) {
        player = videojs(videoPlayer.value);
      }
    });

    onBeforeUnmount(() => {
      if (player) {
        player.dispose();
      }
      window.removeEventListener("scroll", onScroll);
    });

    const formatDate = (dateString) => {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const trimText = (text, maxLength) => {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
      }
      return text;
    };

    const editPost = (postId) => {
      router.push({ name: 'EditPost', params: { postId } });
    };

    const deletePost = async (postId) => {
      const confirmDelete = confirm("Are you sure you want to delete this post?");
      if (confirmDelete) {
        try {
          await http.delete(`/posts/my-posts/${postId}`);
          posts.value = posts.value.filter(post => post.identifier !== postId);
        } catch (error) {
          console.error("Error deleting post:", error);
        }
      }
    };

    const statusClass = (state) =>
      state == 1
        ? "text-bg-warning"
        : state == 2
        ? "text-bg-primary"
        : "text-bg-success";

    return {
      posts,
      loading,
      hasMorePosts,
      formatDate,
      trimText,
      videoPlayer,
      fetchPosts,
      statusClass,
      editPost,
      deletePost
    };
  },
};
</script>

<style>
.post-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.video-post {
  flex: 1 1 calc(44.44% - 20px);
  margin: 10px;
  max-width: 300px;
}

.video-js {
  width: 100%;
  height: auto;
}
</style>
