import { useRef } from "react";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useChatContext } from "src/features/chat/context/ChatContext";
import "./chat-input.scss";

export default function ChatInput() {
  const { globalUser } = useAuthContext();
  const { activeChatId, activeChatUser, sendMessage } = useChatContext();

  const inputRef = useRef(null);

  async function handleNewMessage(e) {
    e.preventDefault();

    if (
      !activeChatUser ||
      !globalUser ||
      !activeChatId ||
      inputRef?.current.value.trim() === ""
    )
      return;

    await sendMessage(
      activeChatId,
      globalUser.uid,
      activeChatUser.uid,
      inputRef.current.value,
    );

    inputRef.current.value = "";
  }

  return (
    <form
      onSubmit={handleNewMessage}
      id="chats-compose"
      className="chats-compose"
    >
      <input
        ref={inputRef}
        text="text"
        placeholder={`Message ${activeChatUser.displayname || "user"}...`}
        className="chats-compose__input"
      />
      <button type="submit" className="chats-compose__button">
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </form>
  );
}
