import AuthProvider from "./Auth/AuthProvider";
import ReviewProvider from "./Review/ReviewProvider";
import CommentProvder from "./Comment/CommentProvider";
import SpotifyProvider from "./Spotify/SpotifyProvider";

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <SpotifyProvider>
        <ReviewProvider>
          <CommentProvder>{children}</CommentProvder>
        </ReviewProvider>
      </SpotifyProvider>
    </AuthProvider>
  );
}
