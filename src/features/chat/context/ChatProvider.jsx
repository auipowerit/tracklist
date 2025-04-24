import { useEffect, useState } from "react";
import { db } from "src/config/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useChat } from "src/features/chat/hooks/useChat";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import ChatContext from "./ChatContext";

export default function ChatProvder({ children }) {
  const [chats, setChats] = useState(null);
  const [activeChatId, setActiveChatId] = useState("-1");
  const [activeChatUser, setActiveChatUser] = useState({});

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

        const fetchedChats = await Promise.all(
          doc.data().chats.map(async (chat) => {
            const user = await getUserById(chat.recipientId);
            return {
              ...chat,
              ...user,
            };
          }),
        );

        setChats(fetchedChats);
      },
    );

    return fetchUserChats;
  }, [globalUser]);

  const chatMethods = {
    chats,
    activeChatId,
    setActiveChatId,
    activeChatUser,
    setActiveChatUser,
    ...useChatMethods,
  };

  return (
    <ChatContext.Provider value={chatMethods}>{children}</ChatContext.Provider>
  );
}
