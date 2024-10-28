<template>
  <div class="col-md-8 mb-3">
    <div class="card video-post">
      <div class="card-header">
        <h5 class="card-title">{{ post.title }}</h5>
        <small class="text-muted">
          Posted by {{ post.user.name }} on {{ formatDate(post.created_at) }}
        </small>
      </div>
      <div class="card-body">
        <div class="container mt-5">
          <video ref="videoJsPlayer" class="video-js vjs-defaultskin"></video>
        </div>
        <p>{{ post.post_body }}</p>
        <div class="like-dislike-buttons" style="margin-bottom: 10px">
          <button @click="likePost" :class="likeClass(post)">
            <span
              >{{ post.post_like_count }} <i class="fas fa-thumbs-up"></i
            ></span>
          </button>
          <button @click="dislikePost" :class="dislikeClass(post)">
            <span
              >{{ post.post_dislike_count }} <i class="fas fa-thumbs-down"></i
            ></span>
          </button>
        </div>
        <CommentSection :post="post" @comment="handleComment" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import CommentSection from "./CommentSection.vue";
import videojs from "video.js";

import "video.js/dist/video-js.css";

export default {
  name: "PostCard",
  components: { CommentSection },
  props: {
    post: Object,
  },
  setup(props, { emit }) {
    const videoJsPlayer = ref(null);
    const player = ref(null);
    const videoOptions = {
      autoplay: false,
      controls: true,
      preload: true,
      fluid: true,
      sources: [
        {
          src: props.post.video_url,
          type: props.post.media_type,
        },
      ],
    };
    const formatDate = (dateString) => {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const likePost = () => {
      emit("like", props.post, 1);
    };

    const dislikePost = () => {
      emit("like", props.post, 0);
    };

    const likeClass = (post) =>
      post.is_liked ? "btn btn-sm btn-success" : "btn btn-sm btn-default";
    const dislikeClass = (post) =>
      post.is_liked === 0 ? "btn btn-sm btn-danger" : "btn btn-sm btn-default";
    onMounted(() => {
      player.value = videojs(videoJsPlayer.value, videoOptions, () => {
        player.value.log('video player ready', player.value);
      });
    });
    onBeforeUnmount(() => {
      if (player.value) {
        player.value.dispose();
      }
    });
    return {
      videoJsPlayer,
      formatDate,
      likePost,
      dislikePost,
      likeClass,
      dislikeClass,
      player,
    };
  },
};
</script>

<style>
.video-post {
  max-width: 600px;
  margin: auto;
}
</style>
