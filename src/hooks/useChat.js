import { db } from "src/config/firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export function useChat() {
  async function getChatById(chatId) {
    try {
      console.log(chatId);
      const chatRef = doc(db, "chats", chatId);
      const chatDocSnap = await getDoc(chatRef);

      if (!chatDocSnap.exists()) return null;

      return chatDocSnap.data();
    } catch (error) {
      console.log(error);
    }
  }

  async function getChatsByUserId(userId) {
    try {
      const userChatsRef = doc(db, "userchats", userId);
      const userChatsDocSnap = await getDoc(userChatsRef);

      if (!userChatsDocSnap.exists()) return null;

      return userChatsDocSnap.data().chats;
    } catch (error) {
      console.log(error);
    }
  }

  async function addChat(currentUserId, friendId) {
    try {
      const chatRef = collection(db, "chats");
      const userChatsRef = collection(db, "userchats");

      const newChatDoc = doc(chatRef);

      await setDoc(newChatDoc, {
        messages: [],
        createdAt: new Date(),
      });

      if (!userChatsRef.doc) {
        await setDoc(doc(userChatsRef, currentUserId), {
          chats: [
            {
              chatId: newChatDoc.id,
              lastMessage: "",
              recieverId: friendId,
              updatedAt: new Date(),
            },
          ],
        });
        await setDoc(doc(userChatsRef, friendId), {
          chats: [
            {
              chatId: newChatDoc.id,
              lastMessage: "",
              recieverId: currentUserId,
              updatedAt: new Date(),
            },
          ],
        });
        return;
      }

      await updateDoc(doc(userChatsRef, friendId), {
        chats: arrayUnion({
          chatId: newChatDoc.id,
          lastMessage: "",
          recieverId: currentUserId,
          updatedAt: new Date(),
        }),
      });

      await updateDoc(doc(userChatsRef, currentUserId), {
        chats: arrayUnion({
          chatId: newChatDoc.id,
          lastMessage: "",
          recieverId: friendId,
          updatedAt: new Date(),
        }),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function sendMessage(chatId, senderId, recieverId, text) {
    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: senderId,
          text,
          createdAt: new Date(),
        }),
      });

      const userIds = [senderId, recieverId];

      userIds.forEach(async (userId) => {
        const userChatsDoc = doc(db, "userchats", userId);
        const userChatsDocSnap = await getDoc(userChatsDoc);

        if (!userChatsDocSnap.exists()) return;

        const userChatsData = userChatsDocSnap.data();
        const chatIndex = userChatsData.chats.findIndex(
          (chat) => chat.chatId === chatId,
        );

        userChatsData.chats[chatIndex].lastMessage = text;
        userChatsData.chats[chatIndex].isSeen =
          userId === recieverId ? true : false;
        userChatsData.chats[chatIndex].updatedAt = new Date();

        await updateDoc(userChatsDoc, { chats: userChatsData.chats });
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function readMessage(chatId, recieverId) {
    try {
      const userChatsDoc = doc(db, "userchats", recieverId);
      const userChatsDocSnap = await getDoc(userChatsDoc);

      if (userChatsDocSnap.empty) return;

      const userChatsData = userChatsDocSnap.data();
      const chatIndex = userChatsData.chats.findIndex(
        (chat) => chat.chatId === chatId,
      );

      userChatsData.chats[chatIndex].isSeen = true;

      await updateDoc(userChatsDoc, { chats: userChatsData.chats });
    } catch (error) {
      console.log(error);
    }
  }

  return {
    getChatById,
    getChatsByUserId,

    addChat,

    sendMessage,
    readMessage,
  };
}
