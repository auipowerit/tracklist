import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "src/config/firebase";
import { formatDateDMD } from "src/utils/date";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { useChatContext } from "src/context/Chat/ChatContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";
import ChatInput from "./ChatInput";

export default function ChatWindow() {
  const { getUserById } = useAuthContext();
  const { activeChatId, activeChatUser } = useChatContext();
  const { getMediaById, getMediaLinks } = useSpotifyContext();

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

            if (message.category) {
              const media = await getMediaById(message.text, message.category);
              const mediaData = await getMediaLinks(media);
              return {
                chatId: activeChatId,
                ...message,
                username: user.username,
                profileUrl: user.profileUrl,
                media,
                mediaData,
              };
            }
            return {
              chatId: activeChatId,
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
  const chatRef = useRef();

  useLayoutEffect(() => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  return (
    <div
      ref={chatRef}
      className="flex grow-1 flex-col gap-4 overflow-y-auto mask-t-from-95% p-4"
    >
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
        className={`parent group relative flex w-fit items-start gap-2 rounded-lg px-4 pt-2 pb-4 ${isCurrentUser ? "ml-auto bg-blue-700/50" : "bg-gray-700/50"}`}
      >
        <MessageLikeButton message={message} isCurrentUser={isCurrentUser} />

        {isCurrentUser && (
          <MessageDeleteButton
            message={message}
            isCurrentUser={isCurrentUser}
          />
        )}

        <MessageImage message={message} />
        <div className="flex max-w-[200px] flex-col text-wrap">
          <MessageUsername message={message} />

          {message.media ? (
            <Link
              to={message.mediaData.titleLink}
              className="mt-2 flex flex-col items-center justify-center bg-white p-2 text-center text-black"
            >
              <img
                src={message.mediaData.image}
                className="h-40 w-40 object-cover"
              />
              <p className="w-fit font-bold">{message.mediaData.title}</p>
              <p className="text-sm">{message.mediaData.subtitle}</p>
            </Link>
          ) : (
            <p className="text-lg break-words">{message.text}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function MessageDeleteButton({ message, isCurrentUser }) {
  const { globalUser } = useAuthContext();
  const { deleteMessage, activeChatUser } = useChatContext();

  async function handleDelete() {
    if (!isCurrentUser) return;

    await deleteMessage(
      message.id,
      message.chatId,
      activeChatUser.uid,
      globalUser.uid,
    );
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className={`absolute top-1/2 -left-8 h-7 w-7 -translate-y-1/2 rounded-full bg-gray-700/50 text-gray-300 opacity-0 shadow-sm shadow-black group-hover:opacity-100`}
    >
      <FontAwesomeIcon icon={faTrash} />
    </button>
  );
}

function MessageLikeButton({ message, isCurrentUser }) {
  const { likeMessage } = useChatContext();

  async function handleLike() {
    if (isCurrentUser) return;
    await likeMessage(message.id, message.chatId, !message.isLiked);
  }

  return (
    <button
      type="button"
      onClick={handleLike}
      className={`invisible absolute -top-3 flex h-7 w-7 items-center justify-center rounded-full shadow-sm shadow-black ${
        message.isLiked
          ? "visible bg-blue-700 text-red-500"
          : !isCurrentUser && "bg-gray-700/50 text-gray-300 group-hover:visible"
      } ${isCurrentUser ? "-left-3" : "-right-3"}`}
    >
      <FontAwesomeIcon icon={faHeart} />
    </button>
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
