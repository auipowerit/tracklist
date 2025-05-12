import { useEffect } from "react";
import { MOBILE_WIDTH } from "src/data/const";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useChatContext } from "src/features/chat/context/ChatContext";
import {
  faPenToSquare,
  faSquareCaretLeft,
  faSquareCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import "./chat-list.scss";

export default function ChatList({ handleOpenChat }) {
  const { isCollapsed, setIsCollapsed } = useChatContext();

  useEffect(() => {
    if (isCollapsed) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [isCollapsed]);

  return (
    <div
      className={`chatlist ${isCollapsed ? "chatlist--collapsed" : "chatlist--active"}`}
    >
      {!isCollapsed && (
        <>
          <Header />
          <Chats handleOpenChat={handleOpenChat} />
        </>
      )}
      <CollapseButton />
    </div>
  );
}

function Header() {
  const { globalUser } = useAuthContext();
  const { setActiveChatId, activeChatUser, setActiveChatUser, setIsCollapsed } =
    useChatContext();

  async function handleNewChat() {
    if (!activeChatUser || !globalUser) return;
    setActiveChatId(-1);
    setActiveChatUser({});

    if (window.innerWidth <= MOBILE_WIDTH) {
      setIsCollapsed(true);
    }
  }

  return (
    <div className="chatlist__header">
      <h2>All chats</h2>
      <button
        type="button"
        onClick={handleNewChat}
        className="chatlist__compose"
      >
        <FontAwesomeIcon icon={faPenToSquare} />
      </button>
    </div>
  );
}

function Chats({ handleOpenChat }) {
  const { chats } = useChatContext();

  return (
    <div className="chatlist__chats">
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
  const { activeChatUser } = useChatContext();

  const isActive = activeChatUser.uid === chat.uid;

  const color = chat.unread > 0 ? "chatlist__unread" : "";

  const lastMessage =
    chat.lastMessage.length > 40
      ? `${chat.lastMessage.slice(0, 40)}...`
      : chat.lastMessage;

  return (
    <div
      onClick={() => handleOpenChat(chat)}
      className={`chatlist__card ${isActive ? "chatlist__card--active" : ""}`}
    >
      <div className="chatlist__user">
        <img src={chat.profileUrl} className="chatlist__image" />
        <p>{chat.username}</p>
      </div>

      <p className={color}>{lastMessage}</p>
    </div>
  );
}

function CollapseButton() {
  const { isCollapsed, setIsCollapsed } = useChatContext();
  const icon = isCollapsed ? faSquareCaretRight : faSquareCaretLeft;

  return (
    <button
      onClick={() => setIsCollapsed(!isCollapsed)}
      className={`chatlist__collapse ${isCollapsed ? "chatlist__collapse--active" : ""}`}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
}
