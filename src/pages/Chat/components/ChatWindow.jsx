import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "src/config/firebase";
import { formatDateDMD } from "src/utils/date";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { useChatContext } from "src/context/Chat/ChatContext";
import ChatInput from "./ChatInput";

export default function ChatWindow() {
  const { globalUser, getUserById } = useAuthContext();
  const { activeChatId, activeChatUser, readMessage } = useChatContext();

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, [activeChatId, activeChatUser]);

  async function fetchMessages() {
    if (!activeChatId || activeChatId === "-1") {
      setMessages([]);
      return;
    }

    onSnapshot(
      doc(db, "chats", activeChatId),
      async (doc) => {
        const messageData = await Promise.all(
          doc.data().messages.map(async (message) => {
            const user = await getUserById(message.senderId);
            return {
              activeChatId,
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
      {activeChatId === "-1" ? (
        <SearchUsers />
      ) : (
        <>
          <Header />

          <Messages messages={messages} />
          <ChatInput />
        </>
      )}
    </div>
  );
}

function Header() {
  const { activeChatUser } = useChatContext();

  return (
    <p className="border-b-1 border-gray-400 pb-4 text-2xl font-bold">
      {activeChatUser.displayname || "Display Name"}
    </p>
  );
}

function SearchUsers() {
  const { globalUser, getUserById, searchByUsername } = useAuthContext();
  const { chats, addChat, setActiveChatId, setActiveChatUser } =
    useChatContext();

  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);

  async function handleSearch(e) {
    setInput(e.target.value);

    if (e.target.value === "") {
      setUsers([]);
      return;
    }

    const fetchedUsers = await searchByUsername(input, globalUser.uid);

    fetchedUsers.sort((a, b) => {
      return (
        globalUser.following.includes(b.uid) -
        globalUser.following.includes(a.uid)
      );
    });

    setUsers(fetchedUsers);
  }

  async function handleAddUser(friendId) {
    setUsers([]);
    setInput("");

    const foundChat = chats.find((chat) => chat.recipientId === friendId);

    if (foundChat) {
      setActiveChatId(foundChat.chatId);
      setActiveChatUser(foundChat);
    } else {
      const chatId = await addChat(globalUser.uid, friendId);
      const recipient = await getUserById(friendId);
      setActiveChatId(chatId);
      setActiveChatUser(recipient);
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
        {users.map((user) => (
          <button
            key={user.uid}
            type="button"
            onClick={() => handleAddUser(user.uid)}
            className="flex items-center gap-2 px-2 py-1 text-start hover:bg-gray-600"
          >
            <img src={user.profileUrl} className="h-10 w-10 rounded-full" />
            <div className="flex flex-col">
              <p className="font-bold">{user.displayname}</p>
              <p className="text-gray-300">@{user.username}</p>
            </div>
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
        className={`flex w-fit items-center gap-2 overflow-auto rounded-lg px-4 pt-2 pb-4 ${isCurrentUser ? "ml-auto bg-blue-700/50" : "bg-gray-700/50"}`}
      >
        <MessageImage message={message} />
        <div className="flex max-w-[400px] flex-col">
          <MessageUsername message={message} />
          <p className="text-lg">{message.text}</p>
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
