import { createRouter, createWebHistory } from "vue-router";
import AuthView from "@/views/AuthView.vue";
import Unauthorized from "@/views/Unauthorized.vue";

const isAuthenticated = () => {
    const accessToken = localStorage.getItem("access_token");
    return accessToken !== null;
};

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
            path: "/about",
            name: "about",
            component: () => import("@/views/AboutView.vue"),
            meta: { requiresAuth: true },
        },
    ],
});

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !isAuthenticated()) {
        console.log("redirect to unauth from router");
        next("/unauthorized");
    } else {
        next();
    }
});

export default router;
