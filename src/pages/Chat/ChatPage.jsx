import { useEffect, useState } from "react";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import { useParams } from "react-router-dom";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { useChatContext } from "src/context/Chat/ChatContext";

export default function ChatPage() {
  const { globalUser, getUserByUsername } = useAuthContext();
  const { chats, addChat } = useChatContext();

  const [activeChatId, setActiveChatId] = useState("-1");
  const [activeUser, setActiveUser] = useState({});

  const params = useParams();
  const username = params.username;

  useEffect(() => {
    fetchUserChat();
  }, [username, globalUser, chats]);

  async function fetchUserChat() {
    if (!username || !globalUser || !chats) return;

    try {
      const foundChat = chats.find((chat) => chat.username === username);
      const recipient = await getUserByUsername(username);

      if (foundChat) {
        setActiveChatId(foundChat.chatId);
        setActiveUser(recipient);
      } else {
        const chatId = await addChat(globalUser.uid, recipient.uid);
        setActiveChatId(chatId);
        setActiveUser(recipient);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="m-auto flex h-[750px] w-3/5 items-stretch">
      <ChatList
        activeUser={activeUser}
        setActiveUser={setActiveUser}
        setActiveChatId={setActiveChatId}
      />
      <ChatWindow
        chatId={activeChatId}
        setActiveChatId={setActiveChatId}
        setActiveUser={setActiveUser}
        recipient={activeUser}
      />
    </div>
  );
}
