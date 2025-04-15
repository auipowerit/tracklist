import { useEffect, useRef, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useChatContext } from "src/context/Chat/ChatContext";

export default function ChatPage() {
  const { globalUser, getUserById } = useAuthContext();
  const { chats, addChat, getChatById, sendMessage } = useChatContext();

  const [currentChat, setCurrentChat] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [currentMessages, setCurrentMessages] = useState([]);

  const inputRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentChat) return;

      const chatMessages = await getChatById(currentChat);

      const messageData = await Promise.all(
        chatMessages.messages.map(async (message) => {
          const user = await getUserById(message.senderId);
          return {
            ...message,
            ...user,
          };
        }),
      );
      setCurrentMessages(messageData);
    };

    fetchMessages();
  }, [currentChat]);

  async function handleOpenChat(chat) {
    setCurrentUser(chat);
    setCurrentChat(chat.chatId);
  }

  async function handleNewChat() {
    if (!currentUser || !globalUser) return;

    // await addChat(globalUser.uid, "iaSiClWA9UOfuXyeBUIAWkLP37J2");
  }

  async function handleNewMessage(e) {
    e.preventDefault();

    if (
      !currentUser ||
      !globalUser ||
      !currentChat ||
      !inputRef ||
      inputRef.current.value.trim() === ""
    )
      return;

    console.log(
      currentChat,
      globalUser.uid,
      currentUser.uid,
      inputRef.current.value,
    );

    await sendMessage(
      currentChat,
      globalUser.uid,
      currentUser.uid,
      inputRef.current.value,
    );

    inputRef.current.value = "";
  }

  return (
    <div className="m-auto flex h-full w-3/5 items-stretch border-1 border-gray-400">
      <div className="flex grow-1 flex-col border-r-2 border-white bg-green-700/30">
        <div className="flex items-center justify-between p-4 text-lg font-bold">
          <p>All chats</p>
          <button
            type="button"
            onClick={handleNewChat}
            className="cursor-pointer hover:text-gray-400"
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </div>

        <div className="flex flex-col overflow-y-auto">
          {chats &&
            chats.length > 0 &&
            chats.map((chat) => {
              return (
                <div
                  key={chat.chatId}
                  onClick={() => handleOpenChat(chat)}
                  className={`cursor-pointer px-4 py-2 hover:bg-gray-700 ${currentUser.uid === chat.uid && "bg-gray-700"}`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={chat.profileUrl}
                      className="h-7 w-7 rounded-full"
                    />
                    <p className="font-bold">{chat.username}</p>
                  </div>
                  <p className="text-gray-300">{chat.lastMessage}</p>
                </div>
              );
            })}
        </div>
      </div>
      <div className="flex grow-3 flex-col justify-between p-6">
        <p className="border-b-1 border-gray-400 pb-4 text-2xl font-bold">
          Chatting with {currentUser.username || "user"}
        </p>

        <div className="flex flex-col gap-4">
          {currentMessages &&
            currentMessages.length > 0 &&
            currentMessages.map((message, index) => {
              return (
                <div
                  key={index}
                  className={`flex flex-col gap-1 ${message.senderId === globalUser.uid && "ml-auto items-end"}`}
                >
                  <div className="flex items-center gap-2 text-2xl">
                    <img
                      src={message.profileUrl}
                      className={`h-8 w-8 rounded-full ${message.senderId === globalUser.uid && "order-2"}`}
                    />
                    <p>{message.text}</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    {message.createdAt.toDate().toLocaleString()}
                  </p>
                </div>
              );
            })}
        </div>

        <form
          onSubmit={handleNewMessage}
          className="flex items-center justify-between gap-2 rounded-lg border-1 border-gray-500 bg-gray-800 px-4 py-4 pb-8"
        >
          <input
            ref={inputRef}
            text="text"
            placeholder={`Message ${currentUser.username || "user"}...`}
            className="flex-grow outline-0"
          />
          <button
            type="submit"
            className="cursor-pointer text-gray-400 hover:text-white"
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
}
