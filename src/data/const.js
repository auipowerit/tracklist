const DEFAULT_PROFILE_IMG = "/images/default-profile-img.jpg";
const DEFAULT_MEDIA_IMG = "/images/default-img.jpg";
const REDIRECT_URI = "http://localhost:5173/profile/callback";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

export {
  DEFAULT_PROFILE_IMG,
  DEFAULT_MEDIA_IMG,
  REDIRECT_URI,
  CLIENT_ID,
  CLIENT_SECRET,
};
