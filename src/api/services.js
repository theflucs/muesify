import { http } from "@/api/axios";
export const getUserProfile = async () => {
    try {
        const response = await http.get("me");
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getUserPlaylists = async (id) => {
    try {
        const response = await http.get(`/users/${id}/playlists`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
