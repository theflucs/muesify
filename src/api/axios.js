import axios from "axios";

export const http = axios.create({
    baseURL: "https://api.spotify.com/v1/",
});

http.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

http.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error && error.status === 401) {
            const data = {
                grant_type: refresh_token,
                refresh_token: localStorage.getItem(
                    "refresh_token",
                    refresh_token
                ),
                client_id: `${import.meta.env.VITE_CLIENT_ID}`,
            };
            return Promise.reject({ component: UnauthorizedView });
        } else {
            console.log("An error occurred. Please try again later.");
            return Promise.reject(error);
        }
    }
);

// refresh token
http.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error && error.status === 401) {
            const data = {
                grant_type: "refresh_token",
                refresh_token: localStorage.getItem("refresh_token"),
                client_id: `${import.meta.env.VITE_CLIENT_ID}`,
            };
            const body = new URLSearchParams(data);
            try {
                const res = await axios.post(
                    "https://accounts.spotify.com/api/token",
                    body
                );
                const { access_token, token_type, refresh_token } = res.data;
                localStorage.setItem("access_token", access_token);
                localStorage.setItem("token_type", token_type);
                localStorage.setItem("refresh_token", refresh_token);
                // error.response.config.headers.Authorization = `Bearer ${access_token}`
                return axios({
                    ...error.response.config,
                    headers: {
                        ...error.response.config.headers,
                        Authorization: `Bearer ${access_token}`,
                    },
                });
            } catch (error) {
                localStorage.clear();
                return Promise.reject(error);
            }
        } else {
            console.log("An error occurred. Please try again later.");
            return Promise.reject(error);
        }
    }
);
