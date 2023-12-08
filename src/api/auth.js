import { http } from "@/api/axios";

function generateCodeVerifier() {
    const allowedCharacters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    const minLength = 43;
    const maxLength = 128;

    // Calculate a random length within the specified range
    const length =
        Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

    // Generate a random string using the allowed characters
    let codeVerifier = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(
            Math.random() * allowedCharacters.length
        );
        codeVerifier += allowedCharacters.charAt(randomIndex);
    }

    return codeVerifier;
}

async function generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const codeChallenge = base64urlencode(hashBuffer);
    return codeChallenge;
}

function base64urlencode(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }
    const base64 = btoa(binary);
    const base64url = base64
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    return base64url;
}

export const getUserAuth = async () => {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

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
