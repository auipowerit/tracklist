import { useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { useChatContext } from "src/context/Chat/ChatContext";

export default function ChatInput({ recipient, chatId }) {
  const { globalUser } = useAuthContext();
  const { sendMessage } = useChatContext();

  const inputRef = useRef(null);

  async function handleNewMessage(e) {
    e.preventDefault();

    if (
      !recipient ||
      !globalUser ||
      !chatId ||
      !inputRef ||
      inputRef.current.value.trim() === ""
    )
      return;

    await sendMessage(
      chatId,
      globalUser.uid,
      recipient.uid,
      inputRef.current.value,
    );

    inputRef.current.value = "";
  }

  return (
    <form
      onSubmit={handleNewMessage}
      className="flex items-center justify-between gap-2 rounded-lg border-1 border-gray-500 bg-gray-800 p-4 pb-8"
    >
      <input
        ref={inputRef}
        text="text"
        placeholder={`Message ${recipient.displayname || "user"}...`}
        className="flex-grow outline-0"
      />
      <button
        type="submit"
        className="cursor-pointer text-gray-400 hover:text-white"
      >
        <FaPaperPlane />
      </button>
    </form>
  );
}
