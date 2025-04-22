import { useAuthContext } from "src/context/Auth/AuthContext";
import { useChatContext } from "src/context/Chat/ChatContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function ChatList({ handleOpenChat }) {
  return (
    <div className="chatlist-container">
      <Header />
      <Chats handleOpenChat={handleOpenChat} />
    </div>
  );
}

function Header() {
  const { globalUser } = useAuthContext();
  const { setActiveChatId, activeChatUser, setActiveChatUser } =
    useChatContext();

  async function handleNewChat() {
    if (!activeChatUser || !globalUser) return;
    setActiveChatId("-1");
    setActiveChatUser({});
  }

  return (
    <div className="chatlist-header">
      <p>All chats</p>
      <button type="button" onClick={handleNewChat} className="header-btn">
        <FontAwesomeIcon icon={faPenToSquare} />
      </button>
    </div>
  );
}

function Chats({ handleOpenChat }) {
  const { chats } = useChatContext();

  return (
    <div className="chatlist">
      {chats &&
        chats.length > 0 &&
        chats.map((chat) => {
          return (
            <ChatCard
              key={chat.chatId}
              chat={chat}
              handleOpenChat={handleOpenChat}
            />
          );
        })}
    </div>
  );
}

function ChatCard({ chat, handleOpenChat }) {
  const { activeChatId, activeChatUser } = useChatContext();

  const isActive = activeChatUser.uid === chat.uid;

  const color =
    activeChatId === chat.chatId
      ? "text-gray-300"
      : chat.unread > 0
        ? "font-bold"
        : "text-gray-300";

  const lastMessage =
    chat.lastMessage.length > 40
      ? `${chat.lastMessage.slice(0, 40)}...`
      : chat.lastMessage;

  return (
    <div
      onClick={() => handleOpenChat(chat)}
      className={`chatlist-card ${isActive && "chatlist-card-active"}`}
    >
      <div className="chatlist-card-header">
        <img src={chat.profileUrl} className="h-7 w-7 rounded-full" />
        <p>{chat.username}</p>
      </div>
      <p className={color}>{lastMessage}</p>
    </div>
  );
}
