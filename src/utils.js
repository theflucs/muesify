export function isAuthenticated() {
    const accessToken = localStorage.getItem("access_token");
    return accessToken !== null;
}
export function formatString(string) {
    return (
        string.charAt(0).toUpperCase() +
        string.slice(1).replace(/[A-Z]/g, (match) => ` ${match}`)
    );
}
export const removeHtmlTags = (string) => {
    const tagIndex = string.indexOf("<");
    return tagIndex !== -1 ? string.substring(0, tagIndex) : string;
};
