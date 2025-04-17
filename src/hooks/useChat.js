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
      const id = Date.now().toString();

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          id,
          senderId: senderId,
          text,
          isLiked: false,
          createdAt: new Date(),
        }),
      });

      const userIds = [senderId, recipientId];

      await Promise.all(
        userIds.map(async (userId) => {
          const userChatRef = doc(db, "userchats", userId);
          const userChatDoc = await getDoc(userChatRef);

          if (!userChatDoc.exists()) return;

          const userChatsData = userChatDoc.data();
          const chatIndex = userChatsData.chats.findIndex(
            (chat) => chat.chatId === chatId,
          );

          if (chatIndex === -1) return;

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            userId === senderId ? true : false;
          userChatsData.chats[chatIndex].updatedAt = new Date();

          await updateDoc(userChatRef, { chats: userChatsData.chats });
        }),
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function likeMessage(messageId, chatId, isLiked) {
    try {
      const chatDoc = doc(db, "chats", chatId);
      const chatData = await getDoc(chatDoc);
      const messages = chatData.data().messages;

      const existingMessage = messages.find(
        (message) => message.id === messageId,
      );

      if (existingMessage) {
        await updateDoc(chatDoc, {
          messages: messages.map((message) =>
            message.id === messageId ? { ...message, isLiked } : message,
          ),
        });
      }
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

      if (chatIndex === -1) return;

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
    likeMessage,
  };
}
