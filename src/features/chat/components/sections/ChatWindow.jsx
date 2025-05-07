import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "src/config/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { useChatContext } from "src/features/chat/context/ChatContext";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import { useSpotifyContext } from "src/features/media/context/SpotifyContext";
import ChatInput from "../inputs/ChatInput";
import Messages from "../messages/Messages";
import "./chat-window.scss";

export default function ChatWindow({ isCollapsed, setIsCollapsed }) {
  const { globalUser } = useAuthContext();
  const { activeChatId, activeChatUser, readMessage } = useChatContext();
  const { getReviewById } = useReviewContext();
  const { getMediaById, getMediaLinks } = useSpotifyContext();

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!activeChatId || activeChatId === "-1") {
      setMessages([]);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "chats", activeChatId),
      async (doc) => {
        const messages = doc
          .data()
          .messages.sort((a, b) => a.createdAt - b.createdAt);

        if (messages.length === 0) return;

        const messageData = await Promise.all(
          messages.map(async (message) => {
            // Check if message sender is current user
            const user =
              message.senderId === globalUser.uid ? globalUser : activeChatUser;

            if (message.category === "review") {
              const review = await getReviewById(message.text);
              const mediaData = getMediaLinks(review?.media);

              return {
                chatId: activeChatId,
                ...message,
                username: user.username,
                profileUrl: user.profileUrl,
                review,
                mediaData,
              };
            }

            if (message.category) {
              const media = await getMediaById(message.text, message.category);
              const mediaData = getMediaLinks(media);

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
        await readMessage(activeChatId, globalUser.uid);
      },
      (error) => {
        console.log(error);
      },
    );

    return () => unsubscribe();
  }, [activeChatId, activeChatUser]);

  return (
    <div
      className={`chats ${isCollapsed ? "chats--active" : "chats--collapsed"}`}
    >
      {activeChatId === "-1" ? (
        <SearchUsers />
      ) : (
        <>
          <Header setIsCollapsed={setIsCollapsed} />
          <Messages messages={messages} />
          <ChatInput />
        </>
      )}
    </div>
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
    <div className="chats__search">
      <input
        value={input}
        onChange={handleSearch}
        type="text"
        placeholder="Search for a friend..."
        className="chats__search-input"
      />
      <div className={`chats__search-dropdown ${users.length > 0 && "active"}`}>
        {users.map((user) => (
          <button
            key={user.uid}
            type="button"
            onClick={() => handleAddUser(user.uid)}
            className="chats__search-user"
          >
            <img src={user.profileUrl} className="chats__search-image" />
            <div className="chats__search-info">
              <p className="chats__searchdisplayname">{user.displayname}</p>
              <p className="chats__search-username">@{user.username}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Header({ setIsCollapsed }) {
  const { activeChatUser, setActiveChatId } = useChatContext();

  function handleCollapse() {
    setActiveChatId("-1");
    setIsCollapsed(false);
  }

  return (
    <div className="chats__header">
      <button
        type="button"
        onClick={handleCollapse}
        className="chats__collapse"
      >
        <FontAwesomeIcon icon={faSquareCaretLeft} />
      </button>
      <Link to={`/users/${activeChatUser.username}`}>
        <h2>{activeChatUser.displayname || "Display Name"}</h2>
      </Link>
    </div>
  );
}
