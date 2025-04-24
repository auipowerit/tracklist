import ChatProvder from "src/features/chat/context/ChatProvider";
import AuthProvider from "src/features/auth/context/AuthProvider";
import ListProvider from "src/features/list/context/ListProvider";
import ReviewProvider from "src/features/review/context/ReviewProvider";
import SpotifyProvider from "src/features/media/context/SpotifyProvider";
import CommentProvder from "src/features/comment/context/CommentProvider";

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
