<template>
  <AppLayout>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <PostCard
          v-for="post in posts"
          :key="post.identifier"
          :post="post"
          @like="toggleLikeDislike"
          @comment="postComment"
        />
      </div>
      <LoadingIndicator v-if="loading" />
      <NoMorePosts v-if="!hasMorePosts && !loading" />
    </div>
  </AppLayout>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import AppLayout from "../components/AppLayout.vue";
import http from "@/http";
import "video.js/dist/video-js.css";
import videojs from "video.js";
import LoadingIndicator from "./LoadingIndicator.vue";
import NoMorePosts from "./NoMorePosts.vue";
import PostCard from "./PostCard.vue";

export default {
  name: "AppPosts",
  components: {
    AppLayout,
    PostCard,
    LoadingIndicator,
    NoMorePosts,
  },
  setup(props, { emit }) {
    const posts = ref([]);
    const comments = ref([]);
    const newComment = ref("");
    const loading = ref(false);
    const hasMorePosts = ref(true);
    let page = 1;
    const videoPlayer = ref(null);
    let player = null;

    const fetchPosts = async () => {
      if (!hasMorePosts.value) return;

      loading.value = true;
      try {
        const response = await http.get(`/posts?page=${page}`);
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

    const toggleLikeDislike = async (post, liked) => {
      try {
        if (post.is_liked != liked) {
          const response = await http.post(`/posts/${post.identifier}/like`, {
            is_liked: liked,
          });
          if (post.is_liked == 1 && response.data.is_liked == 0) {
            post.post_dislike_count += 1;
            post.post_like_count += -1;
          } else if (post.is_liked == 0 && response.data.is_liked == 1) {
            post.post_dislike_count += -1;
            post.post_like_count += 1;
          } else if (response.data.is_liked == 1) {
            post.post_like_count += 1;
          } else if (response.data.is_liked == 0) {
            post.post_dislike_count += 1;
          }

          if (response.data.is_liked == 1) {
            post.is_liked = 1;
          }
          if (response.data.is_liked == 0) {
            post.is_liked = 0;
          }
        }
      } catch (error) {
        console.error("Error toggling like/dislike:", error);
      }
    };

    const toggleCommentLikeDislike = async (postComment, liked) => {
      try {
        if (postComment.is_liked != liked) {
          const response = await http.post(
            `/posts/comment/${postComment.identifier}/like`,
            {
              is_liked: liked,
            }
          );
          if (response.data.is_liked == 1) {
            postComment.is_liked = 1;
          }
          if (response.data.is_liked == 0) {
            postComment.is_liked = 0;
          }
        }
      } catch (error) {
        console.error("Error toggling like/dislike:", error);
      }
    };

    const handleComment = (comment) => {
      emit("comment", comment);
    };

    const postComment = async (post) => {
      if (newComment.value.trim()) {
        try {
          const response = await http.post(
            `/posts/${post.identifier}/comment`,
            {
              comment: newComment.value.trim(),
            }
          );
          post.post_comments.unshift(response.data);
          newComment.value = "";
        } catch (error) {
          console.error("Error posting comment:", error);
        }
      }
    };

    const formatDate = (dateString) => {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const likeDislikeIcon = (post) =>
      post.is_liked ? "fas fa-thumbs-up" : "fas fa-thumbs-down";

    const likeClass = (post) =>
      post.is_liked == 1 ? "btn-success" : "btn-default";

    const dislikeClass = (post) =>
      post.is_liked == 0 ? "btn-danger" : "btn-default";

    const commentLikeClass = (comment) =>
      comment.is_liked == 1 ? "text-primary" : "text-dark";

    const commentDislikeClass = (comment) =>
      comment.is_liked == 0 ? "text-primary" : "text-dark";

    return {
      posts,
      comments,
      newComment,
      toggleLikeDislike,
      postComment,
      loading,
      hasMorePosts,
      formatDate,
      likeDislikeIcon,
      likeClass,
      dislikeClass,
      commentLikeClass,
      commentDislikeClass,
      toggleCommentLikeDislike,
      videoPlayer,
      handleComment,
    };
  },
};
</script>

<style>
.video-post {
  max-width: 600px;
  margin: auto;
}
.comment {
  margin-bottom: 1rem;
}
.comment-author {
  font-weight: bold;
}
.comment-text {
  margin-left: 1rem;
}
.video-js {
  width: 100%;
  height: auto;
}
</style>
