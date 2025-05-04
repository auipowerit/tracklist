import { useEffect, useState } from "react";
import { db } from "src/config/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useInboxContext } from "src/features/inbox/context/InboxContext";

export default function InboxPage() {
  const { globalUser } = useAuthContext();
  const { readAllNotifications } = useInboxContext();

  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    if (!globalUser) {
      setNotifs([]);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "inbox", globalUser.uid),
      async (doc) => {
        const notifs = doc
          .data()
          .notifications.sort((a, b) => a.createdAt - b.createdAt);

        if (notifs.length === 0) return;

        const inboxData = await Promise.all(
          notifs.map(async (notif) => {
            return {
              ...notif,
            };
          }),
        );

        setNotifs(inboxData);
        await readAllNotifications(globalUser.uid);
      },
      (error) => {
        console.log(error);
      },
    );

    return () => unsubscribe();
  }, [globalUser]);

  async function handleClick(notifId) {
    await readNotification(globalUser.uid, notifId);
  }

  if (notifs.length === 0) {
    return <p className="empty-message">No notifications</p>;
  }

  return (
    <div>
      {notifs.map((notif) => {
        return (
          <div key={notif.id} onClick={() => handleClick(notif.id)}>
            <p>{notif.category}</p>
            <p>{notif.title}</p>
            <p>{notif.subtitle}</p>
            <p>{notif.contextId}</p>
          </div>
        );
      })}
    </div>
  );
}
