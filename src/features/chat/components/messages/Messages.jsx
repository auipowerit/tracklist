import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MOBILE_WIDTH } from "src/data/const";
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
    // Don't scroll to bottom if low message count
    if (messages.length < 3) return;

    // Scroll to bottom if new message comes in
    if (prevMessagLength.current >= messages.length) return;

    // Scroll to bottom for mobile and desktop
    if (window.innerWidth <= MOBILE_WIDTH) {
      window.scrollTo({
        top: document.body.scrollHeight,
      });
    } else {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }

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

  function handleClick(e) {
    // Reveal heart or delete button
    e.target.parentNode.classList.add("message__bubble--clicked");

    // Hide heart or delete button after 2 seconds
    setTimeout(() => {
      e.target.parentNode.classList.remove("message__bubble--clicked");
    }, 2000);
  }

  return (
    <div className="message">
      <MessageDate message={message} index={index} messages={messages} />

      <div
        className={`message__bubble ${isCurrentUser ? "message__bubble--user" : "message__bubble--friend"}`}
      >
        <div onClick={handleClick} className="message__bubble__overlay" />

        {isCurrentUser && !message.isDeleted && (
          <MessageDeleteButton
            message={message}
            isCurrentUser={isCurrentUser}
          />
        )}

        {!message.isDeleted && (
          <MessageLikeButton message={message} isCurrentUser={isCurrentUser} />
        )}

        <MessageImage message={message} />

        <div className="message__body">
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

  return <p className="message__date">{formatDateDMD(date)}</p>;
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
      className="message__button message__delete"
    >
      <FontAwesomeIcon icon={faTrash} />
    </button>
  );
}

function MessageLikeButton({ message, isCurrentUser }) {
  const { likeMessage } = useChatContext();

  const color = message.isLiked
    ? "message__like--liked"
    : "message__like--unliked";
  const position = isCurrentUser
    ? "message__like--user"
    : "message__like--friend";

  async function handleLike() {
    if (isCurrentUser) return;
    await likeMessage(message.id, message.chatId, !message.isLiked);
  }

  return (
    <button
      type="button"
      onClick={handleLike}
      className={`message__button message__like ${color} ${position}`}
    >
      <FontAwesomeIcon icon={faHeart} />
    </button>
  );
}

function MessageImage({ message }) {
  return (
    <Link to={`/users/${message.username}`}>
      <img src={message.profileUrl} className="message__image" />
    </Link>
  );
}

function MessageUsername({ message }) {
  return (
    <div className="message__sender">
      <p className="message__username">{message.username}</p>
      <p className="message__time">
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
      return (
        <p className="message__text message__error">Review not available</p>
      );
    }

    return (
      <Link to={`/reviews/${message.review.id}`} className="message__media">
        <p>
          Review by
          <span className="message__media--highlight">
            @{message.review.username}
          </span>
        </p>
        <img src={message.mediaData.image} className="message__media--image" />
        <ReviewStars rating={message.review.rating} />
      </Link>
    );
  }

  if (category !== "") {
    if (!message.media) {
      return (
        <p className="message__text message__error">Media not available</p>
      );
    }

    return (
      <Link to={message.mediaData.titleLink} className="message__media">
        <img src={message.mediaData.image} className="message__media--image" />
        <p className="message_media--title">{message.mediaData.title}</p>
        <p className="message__media--subtitle">{message.mediaData.subtitle}</p>
      </Link>
    );
  }

  if (message.isDeleted) {
    return <p className="message__text message__error">{message.text}</p>;
  }

  return <p className="message__text">{message.text}</p>;
}
