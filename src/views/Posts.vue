<template>
  <AppLayout>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div
          v-for="post in posts"
          :key="post.identifier"
          class="col-md-8 mb-3"
        >
          <div class="card video-post">
            <div class="card-header">
              <h5 class="card-title">{{ post.title }}</h5>
              <small class="text-muted">
                Posted by {{ post.user.name }} on {{ formatDate(post.created_at) }}
              </small>
            </div>
            <div class="card-body">
              <div class="container mt-5">
                <video
                  ref="videoPlayer"
                  :id="'video-' + index"
                  class="video-js"
                  controls
                  preload="auto"
                  width="600"
                  height="300"
                >
                  <source :src="post.video_url" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <p>{{ post.post_body }}</p>
              <button
                @click="toggleLikeDislike(post, 1)"
                class="btn"
                :class="likeClass(post)"
              >
                <span>{{ post.post_like_count > 0 ? post.post_like_count : 0 }} <i class="fas fa-thumbs-up"></i></span>
              </button>
              <button
                @click="toggleLikeDislike(post, 0)"
                class="btn"
                :class="dislikeClass(post)"
              >
                <span>{{ post.post_dislike_count > 0 ? post.post_dislike_count : 0 }} <i class="fas fa-thumbs-down"></i></span>
              </button>
              <div class="mt-4">
                <div class="input-group mb-3">
                  <input
                    v-model="newComment"
                    type="text"
                    class="form-control"
                    placeholder="Add a comment..."
                  />
                  <button @click="postComment(post)" class="btn btn-secondary">
                    Comment
                  </button>
                </div>
                <h6>Comments:</h6>
                <div id="commentsList" class="mb-3" style="max-height: 100px; overflow: auto">
                  <div v-for="(postComment, index) in post.post_comments" :key="index" class="comment">
                    <div class="d-grid">
                      <div class="d-flex align-items-start">
                        <span class="comment-author">{{ postComment.user.name }}:</span>
                        <span class="comment-text">{{ postComment.comment }}</span>
                      </div>
                      <div class="text-end">
                        <a href="javascript:void(0)" @click="toggleCommentLikeDislike(postComment, 1)" style="padding: 10px">
                          <i class="fas fa-thumbs-up" :class="commentLikeClass(postComment)"></i>
                        </a>
                        <a href="javascript:void(0)" @click="toggleCommentLikeDislike(postComment, 0)" style="padding: 10px">
                          <i class="fas fa-thumbs-down" :class="commentDislikeClass(postComment)"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="loading" class="text-center mb-3">Loading more posts...</div>
      <div v-if="!hasMorePosts && !loading" class="text-center mb-3">
        No more posts to load.
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

export default {
  name: "AppPosts",
  components: {
    AppLayout,
  },
  setup() {
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
      // Initialize video player only if there is a valid video player reference
      if (videoPlayer.value) {
        player = videojs(videoPlayer.value);
      }
    });

    onBeforeUnmount(() => {
      if (player) {
        player.dispose();
      }
      window.removeEventListener("scroll", onScroll); // Clean up scroll listener
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
