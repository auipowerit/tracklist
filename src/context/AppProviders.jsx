import AuthProvider from "./Auth/AuthProvider";
import ReviewProvider from "./Review/ReviewProvider";
import CommentProvder from "./Comment/CommentProvider";
import SpotifyProvider from "./Spotify/SpotifyProvider";
import ListProvider from "./List/ListProvider";

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ListProvider>
        <SpotifyProvider>
          <ReviewProvider>
            <CommentProvder>{children}</CommentProvder>
          </ReviewProvider>
        </SpotifyProvider>
      </ListProvider>
    </AuthProvider>
  );
}
