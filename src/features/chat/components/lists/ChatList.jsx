import { useEffect } from "react";
import { DEFAULT_PROFILE_IMG, MOBILE_WIDTH } from "src/data/const";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "src/features/shared/components/buttons/Button";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useChatContext } from "src/features/chat/context/ChatContext";
import MobileBanner from "src/features/shared/components/banner/MobileBanner";
import {
  faPencil,
  faPenToSquare,
  faSquareCaretLeft,
  faSquareCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import "./chat-list.scss";

export default function ChatList({ handleOpenChat }) {
  const { isCollapsed } = useChatContext();

  useEffect(() => {
    if (isCollapsed) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [isCollapsed]);

  return (
    <section className="chatlist" aria-expanded={!isCollapsed}>
      {!isCollapsed && (
        <>
          <MobileBanner title="Messages" />
          <Header />
          <Chats handleOpenChat={handleOpenChat} />
          <NewChatButton showIcon={true} />
        </>
      )}

      <CollapseButton />
    </section>
  );
}

function Header() {
  return (
    <div className="chatlist__header">
      <h2>All chats</h2>
      <NewChatButton />
    </div>
  );
}

function NewChatButton({ showIcon = false }) {
  const { globalUser } = useAuthContext();
  const { setActiveChatId, activeChatUser, setActiveChatUser, setIsCollapsed } =
    useChatContext();

  const handleNewChat = async () => {
    if (!activeChatUser || !globalUser) return;
    setActiveChatId(-1);
    setActiveChatUser({});

    if (window.innerWidth <= MOBILE_WIDTH) {
      setIsCollapsed(true);
    }
  };

  if (showIcon) {
    return (
      <Button onClick={handleNewChat} classes="chatlist__new">
        <FontAwesomeIcon icon={faPencil} />
      </Button>
    );
  }

  return (
    <Button onClick={handleNewChat} classes="chatlist__compose">
      <FontAwesomeIcon icon={faPenToSquare} />
    </Button>
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
      className="chatlist__card"
      aria-selected={isActive}
    >
      <div className="chatlist__user">
        <img
          src={chat.profileUrl || DEFAULT_PROFILE_IMG}
          className="chatlist__image"
        />
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
    <Button
      onClick={() => setIsCollapsed(!isCollapsed)}
      classes="chatlist__collapse"
      ariaSelected={isCollapsed}
    >
      <FontAwesomeIcon icon={icon} />
    </Button>
  );
}
