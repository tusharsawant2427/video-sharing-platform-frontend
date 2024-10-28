<template>
  <div>
    <div class="input-group mb-3">
      <input
        v-model="newComment"
        type="text"
        class="form-control"
        placeholder="Add a comment..."
      />
      <button @click="submitComment(post)" class="btn btn-secondary">
        Comment
      </button>
    </div>
    <h6>Comments:</h6>
    <div class="comments-list mb-3" style="max-height: 100px; overflow: auto">
      <div
        v-for="(comment, index) in post.post_comments"
        :key="index"
        class="comment"
      >
        <div class="d-grid">
          <div class="d-flex align-items-start">
            <span class="comment-author">{{ comment.user.name }}:</span>
            <span class="comment-text">{{ comment.comment }}</span>
          </div>
          <div class="text-end">
            <a
              href="javascript:void(0)"
              @click="toggleCommentLikeDislike(comment, 1)"
              style="padding: 10px"
            >
              <i
                class="fas fa-thumbs-up"
                :class="commentLikeClass(comment)"
              ></i>
            </a>
            <a
              href="javascript:void(0)"
              @click="toggleCommentLikeDislike(comment, 0)"
              style="padding: 10px"
            >
              <i
                class="fas fa-thumbs-down"
                :class="commentDislikeClass(comment)"
              ></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from "@/http";
import { ref } from "vue";

export default {
  name: "CommentSection",
  props: {
    post: Object,
  },
  setup() {
    const newComment = ref("");

    const submitComment = async (post) => {
      if (newComment.value.trim()) {
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
        newComment.value = "";
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

    const commentLikeClass = (comment) =>
      comment.is_liked == 1 ? "text-primary" : "text-dark";

    const commentDislikeClass = (comment) =>
      comment.is_liked == 0 ? "text-primary" : "text-dark";

    return {
      newComment,
      submitComment,
      toggleCommentLikeDislike,
      commentLikeClass,
      commentDislikeClass
    };
  },
};
</script>

<style>
.comment {
  margin-bottom: 1rem;
}
.comment-author {
  font-weight: bold;
}
.comment-text {
  margin-left: 1rem;
}
</style>
