import { useEffect, useState } from "react";
import { db } from "src/config/firebase";
import { DEFAULT_MEDIA_IMG } from "src/data/const";
import { doc, onSnapshot } from "firebase/firestore";
import Loading from "src/features/shared/components/Loading";
import InboxCard from "src/features/inbox/components/cards/InboxCard";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useListContext } from "src/features/list/context/ListContext";
import { useInboxContext } from "src/features/inbox/context/InboxContext";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import { useSpotifyContext } from "src/features/media/context/SpotifyContext";
import "./styles/inbox.scss";

export default function InboxPage() {
  const { globalUser, getUserById } = useAuthContext();
  const { readAllNotifications } = useInboxContext();
  const { getListById } = useListContext();
  const { getReviewById } = useReviewContext();
  const { getMediaById } = useSpotifyContext();

  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setnotifications] = useState([]);

  useEffect(() => {
    if (!globalUser) {
      setnotifications([]);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "inbox", globalUser.uid),
      async (doc) => {
        if (!doc.exists()) {
          setnotifications([]);
          setIsLoading(false);
          return;
        }

        const notifications = doc
          .data()
          .notifications.sort((a, b) => b.createdAt - a.createdAt);

        if (notifications.length === 0) return;

        const inboxData = await Promise.all(
          notifications.map(async (notification) => {
            const user = await getUserById(notification.senderId);

            if (notification.category === "review") {
              const review = await getReviewById(notification.contentId);

              if (!review || review.media.length === 0) {
                return {
                  ...notification,
                  username: user.username,
                  profileUrl: user.profileUrl,
                  image: DEFAULT_MEDIA_IMG,
                };
              }

              return {
                ...notification,
                username: user.username,
                profileUrl: user.profileUrl,
                image: review.media.images[0].url,
              };
            }

            if (notification.category === "list") {
              const list = await getListById(notification.contentId);

              if (!list || list.media.length === 0) {
                return {
                  ...notification,
                  username: user.username,
                  profileUrl: user.profileUrl,
                  image: DEFAULT_MEDIA_IMG,
                };
              }

              const media = await getMediaById(
                list.media[0].id,
                list.media[0].category,
              );

              if (!media) {
                return {
                  ...notification,
                  username: user.username,
                  profileUrl: user.profileUrl,
                  image: DEFAULT_MEDIA_IMG,
                };
              }

              return {
                ...notification,
                username: user.username,
                profileUrl: user.profileUrl,
                subtitle: list.name,
                image: media.images[0].url,
              };
            }

            return {
              ...notification,
              username: user.username,
              profileUrl: user.profileUrl,
            };
          }),
        );

        setnotifications(inboxData);
        await readAllNotifications(globalUser.uid);
        setIsLoading(false);
      },
      (error) => {
        console.log(error);
      },
    );

    return () => unsubscribe();
  }, [globalUser]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="inbox">
      <Header />
      <InboxList notifications={notifications} />
    </div>
  );
}

function Header() {
  return (
    <div className="inbox-header">
      <h1>Inbox</h1>
    </div>
  );
}

function InboxList({ notifications }) {
  if (notifications.length === 0) {
    return <p className="empty-message">No notifications</p>;
  }

  return (
    <div className="inbox-list">
      {notifications.map((notification) => {
        return <InboxCard key={notification.id} notification={notification} />;
      })}
    </div>
  );
}
