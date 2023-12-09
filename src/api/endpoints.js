export const AUTH_URL = "https://accounts.spotify.com/authorize";
export const LOCAL_REDIRECT_URI = "http://localhost:5173";
export const GET_TOKEN_URL = "https://accounts.spotify.com/api/token";
export const SPOTIFY_BASE_API_URL = "https://api.spotify.com/v1/";
export const ME_URL = "me";
export const PLAYLISTS_URL = (id) => `/users/${id}/playlists`;
export const PLAYLIST_URL = (id) => `/playlists/${id}`;
export const GET_PLAYLIST_TRACKS_URL = (id) => `/playlists/${id}/tracks`;
export const FEATURED_PLAYLISTS_URL = "/browse/featured-playlists";
export const DELETE_PLAYLIST_TRACKS_URL = (id) => `/playlists/${id}/tracks`;

//edit playlist details
