export function isAuthenticated() {
    const accessToken = localStorage.getItem("access_token");
    return accessToken !== null;
}
export function formatString(string) {
    string = string.replace(/_/g, " ");

    return (
        string.charAt(0).toUpperCase() +
        string.slice(1).replace(/[A-Z]/g, (match) => ` ${match}`)
    );
}
export const removeHtmlTags = (string) => {
    const tagIndex = string.indexOf("<");
    return tagIndex !== -1 ? string.substring(0, tagIndex) : string;
};

export const categorizePopularity = (popularity) => {
    const categories = {
        noPopular: { min: 0, max: 20 },
        popular: { min: 21, max: 50 },
        veryPopular: { min: 51, max: 80 },
        hits: { min: 81, max: 100 },
    };

    for (const c in categories) {
        const { min, max } = categories[c];
        if (popularity >= min && popularity <= max) {
            // Map the popularity category to a numerical value (0 to 5)
            return mapCategoryToStars(c);
        }
    }

    // Default case
    return 0;
};

const mapCategoryToStars = (category) => {
    const starMappings = {
        noPopular: 1,
        popular: 2,
        veryPopular: 3,
        hits: 4,
        unknown: 0, // Default case
    };

    return starMappings[category] || 0;
};
