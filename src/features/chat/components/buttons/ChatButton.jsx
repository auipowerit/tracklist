import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { faEnvelope, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useChatContext } from "../../context/ChatContext";
import "./chat-button.scss";

export default function ChatButton({ username = "" }) {
  const { globalUser, getUserByUsername } = useAuthContext();
  const { chats, addChat, setActiveChatId, setActiveChatUser } =
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
