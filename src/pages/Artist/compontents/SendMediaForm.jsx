import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { useChatContext } from "src/context/Chat/ChatContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";

export default function SendMediaForm(props) {
  const { isModalOpen, setIsModalOpen, mediaId, category } = props;

  const { globalUser } = useAuthContext();
  const { chats, addChat, sendMessage } = useChatContext();
  const { getMediaById } = useSpotifyContext();

  const [media, setMedia] = useState(null);
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
  const [currentUsers, setCurrentUser] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    handleModal();
    handleData();
  }, [isModalOpen]);

  function handleModal() {
    if (isModalOpen) resetValues();
  }

  async function handleData() {
    if (!globalUser || !mediaId || !category) return;

    const fetchedMedia = await getMediaById(mediaId, category);
    setMedia(fetchedMedia);

    if (!fetchedMedia) {
      resetValues();
      setIsModalOpen(false);
    }
  }

  async function handleAddUser(user) {
    setCurrentUser([...currentUsers, user]);

    setUsers([]);
    setInput("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!globalUser || !media || !category || currentUsers.length === 0) return;

    // For each added user
    currentUsers.forEach(async (user) => {
      // Find the chat between the current user and the added user
      const foundChat = chats.find((chat) => chat.recipientId === user.uid);

      // Get the chat ID of found chat or create new one
      const chatId = foundChat
        ? foundChat.chatId
        : await addChat(globalUser.uid, user.uid);

      // Send message to user with media ID and media category
      await sendMessage(chatId, globalUser.uid, user.uid, media.id, category);
    });

    resetValues();
    setIsModalOpen(false);

    // Send to messaging page
    navigate("/messaging");
  }

  function resetValues() {
    setMedia(null);
    setInput("");
    setUsers([]);
    setCurrentUser([]);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="m-auto flex w-full flex-col items-center justify-center gap-6 py-6"
    >
      <FormHeader category={category} />

      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-center gap-6">
          <FormImage media={media} />

          <div className="relative flex w-full flex-col items-center gap-2">
            <FormInput
              input={input}
              setInput={setInput}
              setUsers={setUsers}
              currentUsers={currentUsers}
            />
            <FormUserResults users={users} handleAddUser={handleAddUser} />

            <FormUsersList
              currentUsers={currentUsers}
              setCurrentUser={setCurrentUser}
            />
          </div>
        </div>
      </div>
      <FormButton />
    </form>
  );
}

function FormHeader({ category }) {
  return (
    <p className="w-full border-b-1 border-white pb-2 text-left text-2xl font-bold">
      {`Share this ${category} with friends`}
    </p>
  );
}

function FormImage({ media }) {
  const { DEFAULT_IMG } = useSpotifyContext();

  return (
    <img
      src={media?.image || DEFAULT_IMG}
      className="aspect-square h-48 object-cover shadow-lg"
    />
  );
}

function FormInput({ input, setInput, setUsers, currentUsers }) {
  const { globalUser, searchByUsername } = useAuthContext();

  async function handleSearch(e) {
    setInput(e.target.value);

    if (e.target.value === "") {
      setUsers([]);
      return;
    }

    const fetchedUsers = await searchByUsername(input, globalUser.uid);

    // Remove users that are already in the currentUsers array
    const filteredUsers = fetchedUsers.filter(
      (user) =>
        !currentUsers.some((currentUser) => currentUser.uid === user.uid),
    );

    // Sort by following first, then by username
    filteredUsers.sort((a, b) => {
      return (
        globalUser.following.includes(b.uid) -
          globalUser.following.includes(a.uid) ||
        a.username.localeCompare(b.username)
      );
    });

    setUsers(filteredUsers);
  }

  return (
    <input
      value={input}
      onChange={handleSearch}
      type="text"
      placeholder="Search for a friend..."
      className="w-full rounded-sm border-1 border-white p-2 outline-none"
    />
  );
}

function FormUserResults({ users, handleAddUser }) {
  return (
    <div
      className={`absolute top-10 right-0 left-0 z-10 flex flex-col bg-green-700 ${users.length > 0 && "h-fit max-h-46 overflow-auto"}`}
    >
      {users.map((user) => (
        <button
          key={user.uid}
          type="button"
          onClick={() => handleAddUser(user)}
          className="flex items-center gap-2 px-2 py-1 text-start hover:bg-gray-600"
        >
          <img src={user.profileUrl} className="h-10 w-10 rounded-full" />
          <div className="flex flex-col">
            <p className="font-bold">{user.displayname}</p>
            <p className="text-gray-300">@{user.username}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

function FormUsersList({ currentUsers, setCurrentUser }) {
  function handleRemoveUser(userId) {
    // Remove the user from the currentUsers array
    setCurrentUser(currentUsers.filter((user) => user.uid !== userId));
  }

  return (
    <div className="flex h-30 flex-col items-start gap-2 overflow-auto p-2">
      {currentUsers?.map((user) => {
        return (
          <div
            key={user.uid}
            className="flex items-center gap-2 rounded-sm bg-gray-700 px-2 py-1"
          >
            <p className="font-bold">@{user.username}</p>
            <button type="button" onClick={() => handleRemoveUser(user.uid)}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function FormButton() {
  return (
    <button
      type="submit"
      className="m-auto flex w-fit items-center gap-2 rounded-sm bg-green-700 px-3 py-1"
    >
      <FaPaperPlane />
      <p>Send</p>
    </button>
  );
}
