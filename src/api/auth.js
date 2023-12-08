import { http } from "@/api/axios";
import { generateCodeVerifier, generateCodeChallenge } from "@/api/utils";
import { AUTH_URL, LOCAL_REDIRECT_URI, GET_TOKEN_URL } from "@/api/endpoints";
import { SCOPE, CHALLENGE_METHOD, GRANT_TYPE } from "@/api/constants";

export const getUserAuth = async () => {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const scope = SCOPE;
    const authUrl = new URL(AUTH_URL);
    window.localStorage.setItem("code_verifier", codeVerifier);

    const params = {
        response_type: "code",
        client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        scope,
        code_challenge_method: CHALLENGE_METHOD,
        code_challenge: codeChallenge,
        redirect_uri: LOCAL_REDIRECT_URI,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
};

export const getToken = async (code) => {
    let codeVerifier = localStorage.getItem("code_verifier");

    const data = new URLSearchParams();
    data.append("client_id", import.meta.env.VITE_SPOTIFY_CLIENT_ID);
    data.append("grant_type", GRANT_TYPE);
    data.append("code", code);
    data.append("redirect_uri", LOCAL_REDIRECT_URI);
    data.append("code_verifier", codeVerifier);
    try {
        const response = await http.post(GET_TOKEN_URL, data);
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
