import { http } from "@/api/axios";
import {
    ME_URL,
    PLAYLISTS_URL,
    FEATURED_PLAYLISTS_URL,
    PLAYLIST_URL,
    GET_PLAYLIST_TRACKS_URL,
    DELETE_PLAYLIST_TRACKS_URL,
    EDIT_PLAYLIST_DETAILS_URL,
} from "@/api/endpoints";

export const getUserProfile = async () => {
    try {
        const response = await http.get(ME_URL);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getUserPlaylists = async (id, limit, offset) => {
    try {
        const response = await http.get(PLAYLISTS_URL(id), {
            params: {
                limit,
                offset,
            },
        });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getFeaturedPlaylists = async (limit, offset) => {
    try {
        const response = await http.get(FEATURED_PLAYLISTS_URL, {
            params: {
                limit,
                offset,
            },
        });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getUserPlaylist = async (id) => {
    try {
        const response = await http.get(PLAYLIST_URL(id));
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getPlaylistTracks = async (id, limit, offset) => {
    try {
        const response = await http.get(GET_PLAYLIST_TRACKS_URL(id), {
            params: {
                limit,
                offset,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deletePlaylistTrack = async (payload) => {
    const { playlistId, snapshotId, tracksUri } = payload;

    const data = {
        tracks: tracksUri,
        snapshot_id: snapshotId,
    };
    console.log("data", data);
    try {
        const response = await http.delete(
            DELETE_PLAYLIST_TRACKS_URL(playlistId),
            {
                data,
            }
        );
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const editPlaylistDetails = async (payload) => {
    const { playlistId, ...additionalProperties } = payload;

    try {
        const response = await http.put(EDIT_PLAYLIST_DETAILS_URL(playlistId), {
            ...additionalProperties,
        });

        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
