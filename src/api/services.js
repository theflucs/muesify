import { http } from "@/api/axios";
import { ME_URL, PLAYLISTS_URL } from "@/api/endpoints";

export const getUserProfile = async () => {
    try {
        const response = await http.get(ME_URL);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getUserPlaylists = async (id) => {
    try {
        const response = await http.get(PLAYLISTS_URL(id));
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
