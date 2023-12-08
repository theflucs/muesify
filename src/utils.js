export function isAuthenticated() {
    const accessToken = localStorage.getItem("access_token");
    return accessToken !== null;
}
