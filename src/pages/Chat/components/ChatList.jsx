import { useAuthContext } from "src/context/Auth/AuthContext";
import { useChatContext } from "src/context/Chat/ChatContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function ChatList(props) {
  const { activeUser, setActiveUser, setActiveChatId } = props;

  const { globalUser } = useAuthContext();
  const { chats, readMessage } = useChatContext();

  async function handleOpenChat(chat) {
    setActiveUser(chat);
    setActiveChatId(chat.chatId);
    await readMessage(chat.chatId, globalUser.uid);
  }

  async function handleNewChat() {
    if (!activeUser || !globalUser) return;
    setActiveChatId("-1");
    setActiveUser({});
  }

  return (
    <div className="flex flex-1 flex-col border-r-2 border-white bg-green-700/30">
      <Header handleNewChat={handleNewChat} />

      <Chats
        chats={chats}
        activeUser={activeUser}
        handleOpenChat={handleOpenChat}
      />
    </div>
  );
}

function Header({ handleNewChat }) {
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

function Chats({ chats, activeUser, handleOpenChat }) {
  return (
    <div className="flex flex-col overflow-y-auto">
      {chats &&
        chats.length > 0 &&
        chats.map((chat) => {
          return (
            <ChatCard
              key={chat.chatId}
              handleOpenChat={handleOpenChat}
              chat={chat}
              activeUser={activeUser}
            />
          );
        })}
    </div>
  );
}

function ChatCard({ handleOpenChat, chat, activeUser }) {
  const isActive = activeUser.uid === chat.uid;
  const color = chat.isSeen ? "text-gray-300" : "font-bold";

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
