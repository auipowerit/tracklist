import { db } from "src/config/firebase";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useAuthContext } from "src/features/auth/context/AuthContext";

export function useInbox() {
  const { addToInbox } = useAuthContext();

  async function addNotification(
    userId,
    title,
    subtitle = "",
    contextId,
    category,
  ) {
    try {
      const id = Date.now().toString();

      const inboxRef = doc(db, "inbox", userId);
      const inboxDoc = await getDoc(inboxRef);

      if (!inboxDoc.exists()) {
        await setDoc(inboxRef, {
          notifications: [
            {
              id,
              title,
              subtitle,
              contextId,
              category,
              createdAt: new Date(),
            },
          ],
        });
      } else {
        await updateDoc(doc(db, "inbox", userId), {
          notifications: arrayUnion({
            id,
            title,
            subtitle,
            contextId,
            category,
            createdAt: new Date(),
          }),
        });
      }

      await addToInbox(userId);
    } catch (error) {
      console.log(error);
    }
  }

  async function readAllNotifications(userId) {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userRef || userDoc.empty) return;

      await updateDoc(userRef, {
        notifications: 0,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteNotification(userId, notifId) {
    try {
      const inboxRef = doc(db, "inbox", userId);
      const inboxDoc = await getDoc(inboxRef);
      const notifs = inboxDoc.data().notifications;

      const index = notifs.findIndex((notif) => notif.id === notifId);

      if (index === -1) return;

      await updateDoc(inboxRef, {
        notifications: notifs.filter((_, i) => i !== index),
      });
    } catch (error) {
      console.log(error);
    }
  }

  return {
    addNotification,
    readAllNotifications,
    deleteNotification,
  };
}
