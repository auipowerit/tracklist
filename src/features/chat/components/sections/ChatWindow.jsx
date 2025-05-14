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
import MobileBanner from "src/features/shared/components/banner/MobileBanner";
import Messages from "../messages/Messages";
import MessageInput from "../inputs/MessageInput";
import ChatSearchInput from "../inputs/ChatSearchInput";
import "./chat-window.scss";

export default function ChatWindow() {
  const { globalUser } = useAuthContext();
  const {
    activeChatId,
    activeChatUser,
    setActiveChatId,
    isCollapsed,
    setIsCollapsed,
    readMessage,
  } = useChatContext();
  const { getReviewById } = useReviewContext();
  const { getMediaById, getMediaLinks } = useSpotifyContext();

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!activeChatId || activeChatId === -1) {
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

        const messageData = await processMessages(messages);
        setMessages(messageData);

        markAsRead();
      },
      (error) => {
        console.log(error);
      },
    );

    return () => unsubscribe();
  }, [activeChatId, activeChatUser]);

  async function processMessages(messages) {
    const messageData = await Promise.all(
      messages.map(async (message) => {
        if (!message || !globalUser) return null;

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

    return messageData;
  }

  async function markAsRead() {
    // Delay read message to allow navbar to sync unread count
    setTimeout(async () => {
      await readMessage(activeChatId, globalUser.uid);
    }, 1500);
  }

  function handleCollapse() {
    setActiveChatId(-1);
    setIsCollapsed(false);
  }

  return (
    <div
      className={`chats ${isCollapsed ? "chats--active" : "chats--collapsed"}`}
    >
      {activeChatId === -1 ? (
        <ChatSearchInput />
      ) : (
        <>
          <MobileBanner
            title={activeChatUser.displayname}
            onClick={handleCollapse}
          />
          <Header handleCollapse={handleCollapse} />
          <Messages messages={messages} />
          <MessageInput />
        </>
      )}
    </div>
  );
}

function Header({ handleCollapse }) {
  const { activeChatUser } = useChatContext();

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
