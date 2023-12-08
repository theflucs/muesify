import { http } from "@/api/axios";
const generateRandomString = (length) => {
    const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
};

const base64encode = async (plain) => {
    const hash = await sha256(plain);
    const base64 = btoa(String.fromCharCode(...new Uint8Array(hash)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    return base64;
};

export const getUserAuth = async () => {
    // const codeVerifier = generateRandomString(64)
    // const hashed = await sha256(codeVerifier)
    // const codeChallenge = base64encode(hashed)
    const codeVerifier = import.meta.env.VITE_AUTH_CODE_VERIFIER;
    const codeChallenge = import.meta.env.VITE_AUTH_CODE_CHALLENGE;
    const scope =
        "playlist-modify-private playlist-modify-public user-follow-modify user-follow-read user-read-email user-read-private";
    const authUrl = new URL("https://accounts.spotify.com/authorize");
    window.localStorage.setItem("code_verifier", codeVerifier);

    const params = {
        response_type: "code",
        client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        scope,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
        redirect_uri: "http://localhost:5173",
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
};

export const getToken = async (code) => {
    let codeVerifier = localStorage.getItem("code_verifier");

    const data = new URLSearchParams();
    data.append("client_id", import.meta.env.VITE_SPOTIFY_CLIENT_ID);
    data.append("grant_type", "authorization_code");
    data.append("code", code);
    data.append("redirect_uri", "http://localhost:5173");
    data.append("code_verifier", codeVerifier);
    try {
        const response = await http.post(
            "https://accounts.spotify.com/api/token",
            data
        );
        const { access_token, token_type, refresh_token } = response.data;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("token_type", token_type);
        localStorage.setItem("refresh_token", refresh_token);

        return response;
    } catch (error) {
        console.error("Error while fetching access token:", error);
        throw error;
    }
};
