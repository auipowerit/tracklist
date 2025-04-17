import { useAuthContext } from "src/context/Auth/AuthContext";
import { useChatContext } from "src/context/Chat/ChatContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function ChatList({ handleOpenChat }) {
  return (
    <div className="flex flex-1 flex-col border-r-2 border-white bg-green-700/30">
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
    <div className="flex items-center justify-between p-4 text-lg font-bold">
      <p>All chats</p>
      <button
        type="button"
        onClick={handleNewChat}
        className="cursor-pointer hover:text-gray-400"
      >
        <FontAwesomeIcon icon={faPenToSquare} />
      </button>
    </div>
  );
}

function Chats({ handleOpenChat }) {
  const { chats } = useChatContext();

  return (
    <div className="flex flex-col overflow-y-auto">
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
      : chat.isSeen
        ? "text-gray-300"
        : "font-bold";

  return (
    <div
      onClick={() => handleOpenChat(chat)}
      className={`flex cursor-pointer flex-col gap-1 px-4 py-2 hover:bg-green-700 ${isActive && "bg-green-700"}`}
    >
      <Link
        to={`/users/${chat.username}`}
        className="flex w-fit items-center gap-2 hover:text-gray-400"
      >
        <img src={chat.profileUrl} className="h-7 w-7 rounded-full" />
        <p>{chat.username}</p>
      </Link>
      <p className={color}>
        {chat.lastMessage.length > 40
          ? `${chat.lastMessage.slice(0, 40)}...`
          : chat.lastMessage}
      </p>
    </div>
  );
}
