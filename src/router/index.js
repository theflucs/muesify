import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated } from "@/utils";
import AuthView from "@/views/AuthView.vue";
import Unauthorized from "@/views/Unauthorized.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/unauthorized",
            name: "unauthorized",
            component: Unauthorized,
            meta: { requiresAuth: false },
        },
        {
            path: "/",
            name: "auth",
            component: AuthView,
            meta: { requiresAuth: false },
        },
        {
            path: "/home",
            name: "home",
            component: () => import("@/views/HomeView.vue"),
            meta: { requiresAuth: true },
        },
        {
            path: "/:playlistId/detail/",
            name: "playlist-detail",
            component: () => import("@/views/PlaylistDetail.vue"),
            meta: { requiresAuth: true },
        },
    ],
});

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !isAuthenticated()) {
        next("/unauthorized");
    } else {
        next();
    }
});

export default router;
