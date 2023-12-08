import { createRouter, createWebHistory } from "vue-router";
import AuthView from "@/views/AuthView.vue";
import Unauthorized from "@/views/Unauthorized.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/unauthorized",
            name: "unauthorized",
            component: Unauthorized,
        },
        {
            path: "/",
            name: "auth",
            component: AuthView,
        },
        {
            path: "/home",
            name: "home",
            component: () => import("@/views/HomeView.vue"),
        },
        {
            path: "/about",
            name: "about",
            component: () => import("@/views/AboutView.vue"),
        },
    ],
});

export default router;
