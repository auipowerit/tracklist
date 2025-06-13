import { useNavigate } from "react-router-dom";
import { MOBILE_WIDTH } from "src/data/const";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "src/features/shared/components/buttons/Button";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useChatContext } from "src/features/chat/context/ChatContext";
import { faEnvelope, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "./user-buttons.scss";

export default function ChatButton({ username = "" }) {
  const navigate = useNavigate();

  const { globalUser, getUserByUsername } = useAuthContext();
  const { chats, addChat, setActiveChatId, setActiveChatUser, setIsCollapsed } =
    useChatContext();

  const handleClick = async () => {
    await fetchUserChat();
    navigate("/messages");
  };

  const fetchUserChat = async () => {
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
  };

  return (
    <Button onClick={handleClick} classes="chat-button" ariaLabel="start chat">
      {username ? (
        <FontAwesomeIcon icon={faPaperPlane} />
      ) : (
        <FontAwesomeIcon icon={faEnvelope} />
      )}
    </Button>
  );
}
