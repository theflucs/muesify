export function generateCodeVerifier() {
    const allowedCharacters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    const minLength = 43;
    const maxLength = 128;

    const length =
        Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

    let codeVerifier = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(
            Math.random() * allowedCharacters.length
        );
        codeVerifier += allowedCharacters.charAt(randomIndex);
    }

    return codeVerifier;
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

export async function generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const codeChallenge = base64urlencode(hashBuffer);
    return codeChallenge;
}
