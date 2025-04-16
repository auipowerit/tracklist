import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "src/config/firebase";
import { formatDateDMD } from "src/utils/date";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuthContext } from "src/context/Auth/AuthContext";
import ChatInput from "./ChatInput";
import { useChatContext } from "src/context/Chat/ChatContext";

export default function ChatWindow(props) {
  const { chatId, setActiveChatId, setActiveUser, recipient } = props;

  const { getUserById } = useAuthContext();
  const { readMessage } = useChatContext();

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, [chatId, recipient]);

  async function fetchMessages() {
    if (!chatId || chatId === "-1") {
      setMessages([]);
      return;
    }

    onSnapshot(
      doc(db, "chats", chatId),
      async (doc) => {
        const messageData = await Promise.all(
          doc.data().messages.map(async (message) => {
            await readMessage(chatId, message.senderId);

            const user = await getUserById(message.senderId);
            return {
              chatId,
              ...message,
              username: user.username,
              profileUrl: user.profileUrl,
            };
          }),
        );

        setMessages(messageData);
      },
      (error) => {
        console.log(error);
      },
    );
  }

  return (
    <div className="flex flex-2 flex-col gap-2 bg-gray-900 px-4 py-4">
      {chatId === "-1" ? (
        <SearchUsers
          setActiveChatId={setActiveChatId}
          setActiveUser={setActiveUser}
        />
      ) : (
        <>
          <Header recipient={recipient} />

          <Messages messages={messages} />
          <ChatInput recipient={recipient} chatId={chatId} />
        </>
      )}
    </div>
  );
}

function Header({ recipient }) {
  return (
    <p className="border-b-1 border-gray-400 pb-4 text-2xl font-bold">
      Chatting with {recipient.displayname || "user"}
    </p>
  );
}

function SearchUsers({ setActiveChatId, setActiveUser }) {
  const { globalUser, getUserById, searchFollowingByUsername } =
    useAuthContext();
  const { chats, addChat } = useChatContext();

  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);

  async function handleSearch(e) {
    setInput(e.target.value);

    if (e.target.value === "") return;

    const fetchedUsers = await searchFollowingByUsername(input, globalUser.uid);
    setUsers(fetchedUsers);
  }

  async function handleAddUser(friendId) {
    setUsers([]);
    setInput("");

    const foundChat = chats.find((chat) => chat.recipientId === friendId);

    if (foundChat) {
      setActiveChatId(foundChat.chatId);
      setActiveUser(foundChat);
    } else {
      const chatId = await addChat(globalUser.uid, friendId);
      const recipient = await getUserById(friendId);
      setActiveChatId(chatId);
      setActiveUser(recipient);
    }
  }

  return (
    <div className="relative w-full">
      <input
        value={input}
        onChange={handleSearch}
        type="text"
        placeholder="Search for a friend..."
        className="w-full rounded-sm border-1 border-white p-2 outline-none"
      />
      <div
        className={`absolute top-10 right-0 left-0 z-10 flex flex-col bg-green-700 ${users.length > 0 && "h-fit max-h-46 overflow-auto"}`}
      >
        {users.map(({ uid, username }) => (
          <button
            key={uid}
            type="button"
            onClick={() => handleAddUser(uid)}
            className="px-2 py-1 text-start hover:bg-gray-600"
          >
            <p>{username}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function Messages({ messages }) {
  function AlwaysScrollToBottom() {
    const divRef = useRef();

    useEffect(() => {
      const parentDiv = divRef.current.parentElement;
      parentDiv.scrollTo({ top: parentDiv.scrollHeight, behavior: "smooth" });
    });

    return <div ref={divRef} />;
  }

  return (
    <div className="flex grow-1 flex-col gap-4 overflow-y-auto">
      {messages &&
        messages.length > 0 &&
        messages.map((message, index) => {
          return (
            <MessageCard
              key={message.id}
              message={message}
              index={index}
              messages={messages}
            />
          );
        })}
      <AlwaysScrollToBottom />
    </div>
  );
}

function MessageCard({ message, index, messages }) {
  const { globalUser } = useAuthContext();

  const isCurrentUser = message.senderId === globalUser.uid;

  return (
    <div className={"flex flex-col gap-1"}>
      <MessageDate message={message} index={index} messages={messages} />

      <div
        className={`flex w-fit items-center gap-2 rounded-lg px-4 py-2 ${isCurrentUser ? "ml-auto bg-blue-700/50" : "bg-gray-700/50"}`}
      >
        <MessageImage message={message} />
        <div className="flex flex-col">
          <MessageUsername message={message} />
          <p className="text-lg text-gray-300">{message.text}</p>
        </div>
      </div>
    </div>
  );
}

function MessageDate({ message, index, messages }) {
  const date = message.createdAt.toDate();

  const isDifferentDate =
    index === 0
      ? date !== new Date()
      : date.getDate() !== messages[index - 1].createdAt.toDate().getDate();

  if (!isDifferentDate) return;

  return (
    <p className="self-center py-4 text-sm text-gray-400">
      {formatDateDMD(date)}
    </p>
  );
}

function MessageImage({ message }) {
  const { globalUser } = useAuthContext();

  return (
    <Link to={`/users/${message.username}`}>
      <img
        src={message.profileUrl}
        className={`h-8 w-8 rounded-full ${message.senderId === globalUser.uid && "order-2"}`}
      />
    </Link>
  );
}

function MessageUsername({ message }) {
  return (
    <div className="flex items-center gap-2">
      <p className="font-bold">{message.username}</p>
      <p className="text-sm text-gray-400">
        {message.createdAt.toDate().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}
