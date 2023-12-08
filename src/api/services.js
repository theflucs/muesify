import { http } from "@/api/axios";
import { GET_ME_URL, GET_PLAYLISTS_URL } from "@/api/endpoints";

export const getUserProfile = async () => {
    try {
        const response = await http.get(GET_ME_URL);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getUserPlaylists = async (id) => {
    try {
        const response = await http.get(GET_PLAYLISTS_URL(id));
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
