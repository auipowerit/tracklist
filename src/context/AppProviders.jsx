import AuthProvider from "./Auth/AuthProvider";
import ReviewProvider from "./Review/ReviewProvider";
import SpotifyProvider from "./Spotify/SpotifyProvider";

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <SpotifyProvider>
        <ReviewProvider>{children}</ReviewProvider>
      </SpotifyProvider>
    </AuthProvider>
  );
}
