import { useEffect, useState } from "react";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { useChatContext } from "src/context/Chat/ChatContext";
import { useNavigate } from "react-router-dom";

export default function ChatPage() {
  const { globalUser, loadingUser } = useAuthContext();
  const { setActiveChatId, setActiveChatUser, readMessage } = useChatContext();

  const [chatWindowKey, setChatWindowKey] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (loadingUser) return;

      if (!globalUser) {
        navigate("/authenticate");
        return;
      }
    };

    fetchUser();
  }, [loadingUser, globalUser]);

  async function handleOpenChat(chat) {
    setActiveChatUser(chat);
    setActiveChatId(chat.chatId);
    setChatWindowKey(chat.chatId);

    await readMessage(chat.chatId, globalUser.uid);
  }

  return (
    <div className="m-auto flex h-[750px] w-3/5 items-stretch">
      <ChatList handleOpenChat={handleOpenChat} />
      <ChatWindow key={chatWindowKey} />
    </div>
  );
}
