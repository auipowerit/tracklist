import { Link, useNavigate } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { useChatContext } from "src/context/Chat/ChatContext";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ChatButton({ username = "" }) {
  const { globalUser, getUserByUsername } = useAuthContext();
  const { chats, addChat, setActiveChatId, setActiveChatUser } =
    useChatContext();

  const navigate = useNavigate();

  async function handleClick() {
    await fetchUserChat();

    navigate("/messaging");
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
    <button onClick={handleClick}>
      {username ? (
        <FaPaperPlane className="cursor-pointer text-gray-400 hover:text-white" />
      ) : (
        <FontAwesomeIcon
          icon={faEnvelope}
          className="cursor-pointer text-gray-400 hover:text-white"
        />
      )}
    </button>
  );
}
