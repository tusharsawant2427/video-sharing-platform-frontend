import { createRouter, createWebHistory } from "vue-router";
import FormLogin from "@/views/users/UserLogin.vue";
import RegisterForm from "@/views/users/UserRegister.vue";
import Posts from "@/views/Posts.vue";
import CreatePost from "@/views/users/CreatePost.vue";
import EditPost from "@/views/users/EditPost.vue";
import MyPosts from "@/views/users/MyPosts.vue";
import { jwtDecode } from "jwt-decode";
import UpdateProfile from "@/views/users/UpdateProfile.vue";
import NotFound from "@/views/NotFound.vue";

const routes = [
  {
    path: "/",
    name: "Posts",
    component: Posts,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: FormLogin,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterForm,
  },
  {
    path: "/profile",
    name: "Profile",
    component: UpdateProfile,
    meta: { requiresAuth: true },
  },
  {
    path: "/my-posts/edit/:postId",
    name: "EditPost",
    component: EditPost,
    meta: { requiresAuth: true },
  },
  {
    path: "/my-posts/create",
    name: "CreatePost",
    component: CreatePost,
    meta: { requiresAuth: true },
  },
  {
    path: "/my-posts",
    name: "MyPosts",
    component: MyPosts,
    meta: { requiresAuth: true },
  },
  {
    path: '/:catchAll(.*)', // This will match any route not defined above
    name: 'NotFound',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("jwtToken"); // Check if token exists

  const isTokenValid = (token) => {
    if (!token) return false;
    try {
      const decode = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decode.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isTokenValid(token)) {
      next({ name: "Login" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
