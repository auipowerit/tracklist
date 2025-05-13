import { db } from "src/config/firebase";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useAuthContext } from "src/features/auth/context/AuthContext";

export function useInbox() {
  const { addToInbox } = useAuthContext();

  async function addNotification(
    recipientId,
    senderId,
    title,
    subtitle,
    contentId,
    imageUrl,
    category,
  ) {
    try {
      const id = Date.now().toString();

      const inboxRef = doc(db, "inbox", recipientId);
      const inboxDoc = await getDoc(inboxRef);

      // If inbox doesn't exist, create it
      if (!inboxDoc.exists()) {
        await setDoc(inboxRef, {
          notifications: [
            {
              id,
              senderId,
              title,
              subtitle,
              contentId,
              category,
              imageUrl,
              createdAt: new Date(),
            },
          ],
        });
      } else {
        // Check if notification already exists
        const index = inboxDoc
          .data()
          .notifications.findIndex(
            (notif) =>
              notif.contentId === contentId &&
              notif.category === category &&
              notif.senderId === senderId &&
              notif.subtitle === subtitle,
          );

        // If notification already exists, update createdAt
        if (index !== -1) {
          const notifications = inboxDoc.data().notifications;
          notifications[index].createdAt = new Date();

          await updateDoc(inboxRef, {
            notifications,
          });

          await addToInbox(recipientId);
          return;
        }

        // If notification doesn't exist, add it
        await updateDoc(doc(db, "inbox", recipientId), {
          notifications: arrayUnion({
            id,
            senderId,
            title,
            subtitle,
            contentId,
            category,
            imageUrl,
            createdAt: new Date(),
          }),
        });
      }

      await addToInbox(recipientId);
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
      const notifications = inboxDoc.data().notifications;

      const index = notifications.findIndex((notif) => notif.id === notifId);

      if (index === -1) return;

      await updateDoc(inboxRef, {
        notifications: notifications.filter((_, i) => i !== index),
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
