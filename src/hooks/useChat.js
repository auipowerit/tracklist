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

  async function addChat(senderId, recipientId) {
    try {
      const chatRef = collection(db, "chats");

      const newChatDoc = doc(chatRef);

      await setDoc(newChatDoc, {
        messages: [],
        createdAt: new Date(),
      });

      console.log(newChatDoc.id);

      await addUserChat(senderId, recipientId, newChatDoc.id);
      await addUserChat(recipientId, senderId, newChatDoc.id);

      return newChatDoc.id;
    } catch (error) {
      console.log(error);
    }
  }

  async function addUserChat(senderId, recipientId, chatId) {
    try {
      const userChatRef = doc(db, "userchats", senderId);
      const userChatDoc = await getDoc(userChatRef);

      if (!userChatDoc.exists()) {
        await setDoc(userChatRef, {
          chats: [
            {
              chatId,
              lastMessage: "",
              recipientId,
              isLiked: false,
              updatedAt: new Date(),
            },
          ],
        });
      } else {
        await updateDoc(doc(db, "userchats", senderId), {
          chats: arrayUnion({
            chatId,
            lastMessage: "",
            recipientId,
            isLiked: false,
            updatedAt: new Date(),
          }),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function sendMessage(chatId, senderId, recipientId, text) {
    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: senderId,
          text,
          createdAt: new Date(),
        }),
      });

      const userIds = [senderId, recipientId];

      userIds.forEach(async (userId) => {
        const userChatsRef = doc(db, "userchats", userId);
        const userChatsDoc = await getDoc(userChatsRef);

        if (!userChatsDoc.exists()) return;

        const userChatsData = userChatsDoc.data();
        const chatIndex = userChatsData.chats.findIndex(
          (chat) => chat.chatId === chatId,
        );

        if (chatIndex === -1) return;

        userChatsData.chats[chatIndex].lastMessage = text;
        userChatsData.chats[chatIndex].isSeen =
          userId === senderId ? true : false;
        userChatsData.chats[chatIndex].updatedAt = new Date();

        await updateDoc(userChatsRef, { chats: userChatsData.chats });
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function readMessage(chatId, recipientId) {
    try {
      const userChatsDoc = doc(db, "userchats", recipientId);
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
