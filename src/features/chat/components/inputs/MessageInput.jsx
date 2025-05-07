import { useRef } from "react";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useChatContext } from "src/features/chat/context/ChatContext";
import "./chat-inputs.scss";

export default function MessageInput() {
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

    const message = inputRef.current.value;
    inputRef.current.value = "";

    await sendMessage(
      activeChatId,
      globalUser.uid,
      activeChatUser.uid,
      message,
    );
  }

  return (
    <form
      onSubmit={handleNewMessage}
      id="chat-compose"
      className="chat-compose"
    >
      <input
        ref={inputRef}
        text="text"
        placeholder={`Message ${activeChatUser.displayname || "user"}...`}
        className="chat-compose__input"
      />
      <button type="submit" className="chat-compose__button">
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </form>
  );
}
