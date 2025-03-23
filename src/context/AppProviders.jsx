import AuthProvider from "./Auth/AuthProvider";
import RatingProvider from "./Rating/RatingProvider";
import SpotifyProvider from "./Spotify/SpotifyProvider";

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <SpotifyProvider>
        <RatingProvider>{children}</RatingProvider>
      </SpotifyProvider>
    </AuthProvider>
  );
}
