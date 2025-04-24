import { useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useChatContext } from "src/features/chat/context/ChatContext";

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
    <form onSubmit={handleNewMessage} className="chat-input-form">
      <input
        ref={inputRef}
        text="text"
        placeholder={`Message ${activeChatUser.displayname || "user"}...`}
        className="chat-input"
      />
      <button type="submit" className="chat-input-btn">
        <FaPaperPlane />
      </button>
    </form>
  );
}
