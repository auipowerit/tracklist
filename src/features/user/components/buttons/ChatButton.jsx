import { useNavigate } from "react-router-dom";
import { MOBILE_WIDTH } from "src/data/const";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useChatContext } from "src/features/chat/context/ChatContext";
import { faEnvelope, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "./user-buttons.scss";

export default function ChatButton({ username = "" }) {
  const { globalUser, getUserByUsername } = useAuthContext();
  const { chats, addChat, setActiveChatId, setActiveChatUser, setIsCollapsed } =
    useChatContext();

  const navigate = useNavigate();

  async function handleClick() {
    await fetchUserChat();
    navigate("/messages");
  }

  async function fetchUserChat() {
    if (username === "" || !globalUser || !chats) return;

    try {
      const foundChat = chats.find((chat) => chat.username === username);
      const recipient = await getUserByUsername(username);

      if (foundChat) {
        setActiveChatId(foundChat.chatId);
        setActiveChatUser(recipient);
      } else {
        const chatId = await addChat(globalUser.uid, recipient.uid);
        setActiveChatId(chatId);
        setActiveChatUser(recipient);
      }

      if (window.innerWidth <= MOBILE_WIDTH) {
        setIsCollapsed(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <button onClick={handleClick} className="chat-button">
      {username ? (
        <FontAwesomeIcon icon={faPaperPlane} />
      ) : (
        <FontAwesomeIcon icon={faEnvelope} />
      )}
    </button>
  );
}
