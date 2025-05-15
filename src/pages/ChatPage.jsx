import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MOBILE_WIDTH } from "src/data/const";
import ChatList from "src/features/chat/components/lists/ChatList";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useChatContext } from "src/features/chat/context/ChatContext";
import ChatWindow from "src/features/chat/components/sections/ChatWindow";
import MobileBanner from "src/features/shared/components/banner/MobileBanner";
import "./styles/chat.scss";

export default function ChatPage() {
  const { globalUser, loadingUser } = useAuthContext();
  const { setActiveChatId, setActiveChatUser, setIsCollapsed, readMessage } =
    useChatContext();

  const [mounted, setMounted] = useState(false);
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
      if (!mounted) {
        setMounted(true);
        return;
      }

      setActiveChatId(-1);
      setActiveChatUser({});
    };
  }, [loadingUser, globalUser, mounted]);

  async function handleOpenChat(chat) {
    setActiveChatUser(chat);
    setActiveChatId(chat.chatId);
    setChatWindowKey(chat.chatId);

    if (window.innerWidth <= MOBILE_WIDTH) {
      setIsCollapsed(true);
    }

    await readMessage(chat.chatId, globalUser.uid);
  }

  return (
    <section className="chat">
      <ChatList handleOpenChat={handleOpenChat} />
      <ChatWindow key={chatWindowKey} />
    </section>
  );
}
