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
      const chatRefSnap = await getDoc(chatRef);

      if (!chatRefSnap.exists()) return null;

      return chatRefSnap.data();
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

      const newchatRef = doc(chatRef);

      await setDoc(newchatRef, {
        messages: [],
        createdAt: new Date(),
      });

      await addUserChat(senderId, recipientId, newchatRef.id);
      await addUserChat(recipientId, senderId, newchatRef.id);

      return newchatRef.id;
    } catch (error) {
      console.log(error);
    }
  }

  async function addUserChat(senderId, recipientId, chatId) {
    try {
      const userChatRef = doc(db, "userchats", senderId);
      const userchatRef = await getDoc(userChatRef);

      if (!userchatRef.exists()) {
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

      await Promise.all(
        [senderId, recipientId].map(async (userId) => {
          const userChatRef = doc(db, "userchats", userId);
          const userchatRef = await getDoc(userChatRef);

          if (!userchatRef.exists()) return;

          const userChatsData = userchatRef.data();
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
      const chatRef = doc(db, "chats", chatId);
      const chatDoc = await getDoc(chatRef);
      const messages = chatDoc.data().messages;

      const existingMessage = messages.find(
        (message) => message.id === messageId,
      );

      if (existingMessage) {
        await updateDoc(chatRef, {
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

  async function deleteMessage(messageId, chatId, senderId, recipientId) {
    try {
      const chatRef = doc(db, "chats", chatId);
      const chatDoc = await getDoc(chatRef);
      const messages = chatDoc.data().messages;

      const index = messages.findIndex((message) => message.id === messageId);
      if (index === -1) return;

      await updateDoc(chatRef, {
        messages: messages.filter((message) => message.id !== messageId),
      });

      // Stop if deleted message was not last message sent
      if (index !== messages.length - 1) return;

      await Promise.all(
        [senderId, recipientId].map(async (userId) => {
          const userChatsDoc = doc(db, "userchats", userId);
          const userChatsDocSnap = await getDoc(userChatsDoc);

          if (userChatsDocSnap.empty) return;

          const userChatsData = userChatsDocSnap.data();
          const chatIndex = userChatsData.chats.findIndex(
            (chat) => chat.chatId === chatId,
          );

          if (chatIndex === -1) return;

          userChatsData.chats[chatIndex].lastMessage =
            "This message was deleted.";
          userChatsData.chats[chatIndex].isSeen = true;

          await updateDoc(userChatsDoc, { chats: userChatsData.chats });
        }),
      );
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
    deleteMessage,
  };
}
