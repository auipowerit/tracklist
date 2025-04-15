import ChatProvder from "./Chat/ChatProvider";
import AuthProvider from "./Auth/AuthProvider";
import ListProvider from "./List/ListProvider";
import ReviewProvider from "./Review/ReviewProvider";
import CommentProvder from "./Comment/CommentProvider";
import SpotifyProvider from "./Spotify/SpotifyProvider";

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ListProvider>
        <SpotifyProvider>
          <ChatProvder>
            <ReviewProvider>
              <CommentProvder>{children}</CommentProvder>
            </ReviewProvider>
          </ChatProvder>
        </SpotifyProvider>
      </ListProvider>
    </AuthProvider>
  );
}
