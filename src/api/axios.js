import axios from "axios";
import router from "@/router";
import { SPOTIFY_BASE_API_URL, GET_TOKEN_URL } from "@/api/endpoints";

export const http = axios.create({
    baseURL: SPOTIFY_BASE_API_URL,
});

http.interceptors.request.use(async (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

http.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            console.log("Unauthorized");
            if (localStorage.getItem("refresh_token")) {
                const data = {
                    grant_type: "refresh_token",
                    refresh_token: localStorage.getItem("refresh_token"),
                    client_id: `${import.meta.env.VITE_CLIENT_ID}`,
                };
                const body = new URLSearchParams(data);
                try {
                    const res = await axios.post(GET_TOKEN_URL, body);
                    const { access_token, token_type, refresh_token } =
                        res.data;
                    localStorage.setItem("access_token", access_token);
                    localStorage.setItem("token_type", token_type);
                    localStorage.setItem("refresh_token", refresh_token);

                    // Retry the original request with the new access token
                    error.config.headers.Authorization = `Bearer ${access_token}`;
                    return http(error.config);
                } catch (error) {
                    // Clear tokens and navigate to unauthorized page
                    localStorage.clear();
                    console.log("Error trying to refresh token");
                    router.push("/unauthorized");
                    return Promise.reject(error);
                }
            } else {
                router.push("/");
                return Promise.reject(error);
            }
        } else {
            console.log("Oops! Something went wrong.");
            return Promise.reject(error);
        }
    }
);
