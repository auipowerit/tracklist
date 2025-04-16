import { useEffect, useState } from "react";
import { db } from "src/config/firebase";
import { useChat } from "src/hooks/useChat";
import { doc, onSnapshot } from "firebase/firestore";
import ChatContext from "./ChatContext";
import { useAuthContext } from "../Auth/AuthContext";

export default function ChatProvder({ children }) {
  const [chats, setChats] = useState(null);

  const { globalUser, getUserById } = useAuthContext();
  const useChatMethods = useChat();

  useEffect(() => {
    if (!globalUser) return;

    const fetchUserChats = onSnapshot(
      doc(db, "userchats", globalUser.uid),
      async (doc) => {
        if (!doc.exists()) {
          setChats([]);
          return;
        }

        const chatData = await Promise.all(
          doc.data().chats.map(async (chat) => {
            const user = await getUserById(chat.recipientId);
            return {
              ...chat,
              ...user,
            };
          }),
        );

        setChats(chatData);
      },
    );

    return fetchUserChats;
  }, [globalUser]);

  const chatMethods = {
    chats,
    ...useChatMethods,
  };

  return (
    <ChatContext.Provider value={chatMethods}>{children}</ChatContext.Provider>
  );
}
