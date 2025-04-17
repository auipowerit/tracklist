import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { useChatContext } from "src/context/Chat/ChatContext";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";

export default function ChatPage() {
  const { globalUser, loadingUser } = useAuthContext();
  const { setActiveChatId, setActiveChatUser, readMessage } = useChatContext();

  const [chatWindowKey, setChatWindowKey] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = () => {
      if (loadingUser) return;

      if (!globalUser) {
        navigate("/authenticate");
        return;
      }
    };

    checkUser();

    // reset state when user leaves page
    return () => {
      setActiveChatId("-1");
      setActiveChatUser({});
    };
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
