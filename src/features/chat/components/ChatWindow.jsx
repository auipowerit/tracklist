import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "src/config/firebase";
import { formatDateDMD } from "src/utils/date";
import { doc, onSnapshot } from "firebase/firestore";
import { useChatContext } from "src/features/chat/context/ChatContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { ReviewStars } from "src/features/review/components/ReviewContent";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import { useSpotifyContext } from "src/features/media/context/SpotifyContext";
import ChatInput from "./ChatInput";

export default function ChatWindow() {
  const { globalUser } = useAuthContext();
  const { activeChatId, activeChatUser } = useChatContext();
  const { getReviewById } = useReviewContext();
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
              const mediaData = getMediaLinks(review.media);

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
      },
      (error) => {
        console.log(error);
      },
    );
  }

  return (
    <div className="chatwindow">
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
    <div className="chatwindow-search">
      <input
        value={input}
        onChange={handleSearch}
        type="text"
        placeholder="Search for a friend..."
        className="chatwindow-search-input"
      />
      <div
        className={`chatwindow-search-results ${users.length > 0 && "active"}`}
      >
        {users.map((user) => (
          <button
            key={user.uid}
            type="button"
            onClick={() => handleAddUser(user.uid)}
            className="chatwindow-search-item"
          >
            <img src={user.profileUrl} />
            <div className="chatwindow-search-item-info">
              <p className="chatwindow-search-item-displayname">
                {user.displayname}
              </p>
              <p className="chatwindow-search-item-username">
                @{user.username}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Header() {
  const { activeChatUser } = useChatContext();

  return (
    <Link
      to={`/users/${activeChatUser.username}`}
      className="chatwindow-header"
    >
      {activeChatUser.displayname || "Display Name"}
    </Link>
  );
}

function Messages({ messages }) {
  const chatRef = useRef();

  useLayoutEffect(() => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  return (
    <div ref={chatRef} className="messages">
      {messages.map((message, index) => {
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
    <div className={"message-card"}>
      <MessageDate message={message} index={index} messages={messages} />

      <div
        className={`message-bubble ${isCurrentUser ? "message-user-btn" : "message-friend-btn"}`}
      >
        {isCurrentUser && (
          <MessageDeleteButton
            message={message}
            isCurrentUser={isCurrentUser}
          />
        )}

        <MessageLikeButton message={message} isCurrentUser={isCurrentUser} />

        <MessageImage message={message} />
        <div className="message-body">
          <MessageUsername message={message} />
          <MessageContent message={message} category={message.category} />
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

  return <p className="message-date">{formatDateDMD(date)}</p>;
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
    <button type="button" onClick={handleDelete} className="message-delete-btn">
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
      className={`message-like-btn ${
        message.isLiked ? "message-liked" : !isCurrentUser && "message-unliked"
      } ${isCurrentUser ? "message-user-btn" : "message-friend-btn"}`}
    >
      <FontAwesomeIcon icon={faHeart} />
    </button>
  );
}

function MessageImage({ message }) {
  return (
    <Link to={`/users/${message.username}`}>
      <img src={message.profileUrl} className="message-image" />
    </Link>
  );
}

function MessageUsername({ message }) {
  return (
    <div className="message-sender">
      <p className="message-sender-name">{message.username}</p>
      <p className="message-time">
        {message.createdAt.toDate().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}

function MessageContent({ message, category }) {
  if (category === "review") {
    return (
      <Link
        to={`/reviews/${message.review.id}`}
        className="message-content-media"
      >
        <p>
          Review by<span>@{message.review.username}</span>
        </p>
        <img src={message.mediaData.image} />
        <ReviewStars rating={message.review.rating} />
      </Link>
    );
  }

  if (category !== "") {
    return (
      <Link to={message.mediaData.titleLink} className="message-content-media">
        <img src={message.mediaData.image} />
        <p className="title">{message.mediaData.title}</p>
        <p className="subtitle">{message.mediaData.subtitle}</p>
      </Link>
    );
  }

  return <p className="message-text">{message.text}</p>;
}
