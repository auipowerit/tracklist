import { useRef } from "react";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "src/features/shared/components/buttons/Button";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useChatContext } from "src/features/chat/context/ChatContext";
import "./chat-inputs.scss";

export default function MessageInput() {
  const inputRef = useRef(null);

  const { globalUser } = useAuthContext();
  const { activeChatId, activeChatUser, sendMessage } = useChatContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !activeChatUser ||
      !globalUser ||
      !activeChatId ||
      inputRef?.current.value.trim() === ""
    ) {
      return;
    }

    const message = inputRef.current.value;
    inputRef.current.value = "";

    await sendMessage(
      activeChatId,
      globalUser.uid,
      activeChatUser.uid,
      message,
    );
  };

  return (
    <form onSubmit={handleSubmit} id="chat-compose" className="chat-compose">
      <input
        ref={inputRef}
        text="text"
        placeholder={`Message ${activeChatUser.displayname || "user"}...`}
        className="chat-compose__input"
      />
      <Button
        type="submit"
        classes="chat-compose__button"
        ariaLabel="send message"
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </Button>
    </form>
  );
}
