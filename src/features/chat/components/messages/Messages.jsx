import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { formatDateDMD } from "src/utils/date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { ReviewStars } from "src/features/review/components/ReviewContent";
import { useChatContext } from "../../context/ChatContext";
import "./messages.scss";

export default function Messages({ messages }) {
  const chatRef = useRef();
  const prevMessagLength = useRef(messages.length);

  useLayoutEffect(() => {
    // Scroll to bottom if new message comes in
    if (prevMessagLength.current >= messages.length) return;
    chatRef.current.scrollTop = chatRef.current.scrollHeight;

    prevMessagLength.current = messages.length;
  }, [messages]);

  return (
    <div ref={chatRef} className="messages">
      {messages.map((message, index) => {
        if (!message) return null;
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
        className={`message-bubble ${isCurrentUser ? "message-user-button" : "message-friend-button"}`}
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
    <button
      type="button"
      onClick={handleDelete}
      className="message-delete-button"
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
      className={`message-like-button ${
        message.isLiked ? "message-liked" : !isCurrentUser && "message-unliked"
      } ${isCurrentUser ? "message-user-button" : "message-friend-button"}`}
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
    if (!message.review) {
      return <p className="message-text message-error">Review not available</p>;
    }

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
    if (!message.media) {
      return <p className="message-text message-error">Media not available</p>;
    }

    return (
      <Link to={message.mediaData.titleLink} className="message-content-media">
        <img src={message.mediaData.image} />
        <p className="title">{message.mediaData.title}</p>
        <p className="subtitle">{message.mediaData.subtitle}</p>
      </Link>
    );
  }

  if (message.isDeleted) {
    return <p className="message-text message-error">{message.text}</p>;
  }

  return <p className="message-text">{message.text}</p>;
}
