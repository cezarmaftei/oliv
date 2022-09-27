import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      // route level code-splitting
      // this generates a separate chunk (Home.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("@/views/PageView.vue"),
    },
    {
      path: "/:slug",
      name: "page",
      component: () => import("@/views/PageView.vue"),
    },
    {
      path: "/meniu/:slug",
      name: "product",
      component: () => import("@/views/PageView.vue"),
    },
    {
      path: "/contul-meu/:slug",
      name: "account",
      component: () => import("@/views/PageView.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/views/NotFoundView.vue"),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 };
  },
});

export default router;
