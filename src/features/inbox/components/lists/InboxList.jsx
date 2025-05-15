import { useEffect, useState } from "react";
import { db } from "src/config/firebase";
import { getTimeSinceDay } from "src/utils/date";
import { doc, onSnapshot } from "firebase/firestore";
import Loading from "src/features/shared/components/Loading";
import InboxCard from "src/features/inbox/components/cards/InboxCard";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useListContext } from "src/features/list/context/ListContext";
import { useInboxContext } from "src/features/inbox/context/InboxContext";
import "./inbox-list.scss";

export default function InboxList() {
  const { globalUser, getUserById } = useAuthContext();
  const { readAllNotifications } = useInboxContext();
  const { getListById } = useListContext();

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

        if (notifications.length === 0) {
          setIsLoading(false);
          return;
        }

        const inboxData = await processNotifications(notifications);

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

  async function processNotifications(notifications) {
    const inboxData = await Promise.all(
      notifications.map(async (notification) => {
        const user = await getUserById(notification.senderId);
        const timeSince = getTimeSinceDay(notification.createdAt.toDate());

        if (notification.category === "list") {
          const list = await getListById(notification.contentId);

          if (list) {
            return {
              ...notification,
              username: user.username,
              profileUrl: user.profileUrl,
              subtitle: list.name,
              timeSince,
            };
          }
        }

        return {
          ...notification,
          username: user.username,
          profileUrl: user.profileUrl,
          timeSince,
        };
      }),
    );

    // Sort by timeSince then by date
    const sortedInbox = inboxData.sort(
      (a, b) => b.timeSince - a.timeSince || b.createdAt - a.createdAt,
    );

    return sortedInbox;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (notifications.length === 0) {
    return <p className="empty__message">No notifications</p>;
  }

  return (
    <section className="inbox-list">
      {notifications.map((notification, i) => {
        // Check if timeSince is different than previous notification
        const prevTimeSince = notifications[i - 1];
        const showTimeSince =
          i === 0 || prevTimeSince.timeSince !== notification.timeSince;

        return (
          <div key={notification.id} className="inbox-list__item">
            <InboxTime
              showTimeSince={showTimeSince}
              notification={notification}
            />
            <InboxCard key={notification.id} notification={notification} />
          </div>
        );
      })}
    </section>
  );
}

function InboxTime({ showTimeSince, notification }) {
  if (!showTimeSince) return null;

  return <h2 className="inbox-list__time">{notification.timeSince}</h2>;
}
