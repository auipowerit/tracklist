import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useChatContext } from "src/features/chat/context/ChatContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSpotifyContext } from "src/features/media/context/SpotifyContext";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import { DEFAULT_MEDIA_IMG } from "src/data/const";
import "./share-form.scss";

export default function ShareForm(props) {
  const { isModalOpen, setIsModalOpen, mediaId, category } = props;

  const { globalUser } = useAuthContext();
  const { chats, addChat, sendMessage } = useChatContext();
  const { getReviewById } = useReviewContext();
  const { getMediaById } = useSpotifyContext();

  const [media, setMedia] = useState(null);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
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

    const fetchedMedia =
      category === "review"
        ? await getReviewById(mediaId, category)
        : await getMediaById(mediaId, category);

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

      // Send message to user after sending media
      if (message === "") return;
      await sendMessage(chatId, globalUser.uid, user.uid, message);
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
    setMessage("");
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <FormHeader category={category} />

      <div className="form-content">
        <FormImage media={media} />

        <div className="share-form-info">
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
      <FormMessage message={message} setMessage={setMessage} />
      <FormButton currentUsers={currentUsers} />
    </form>
  );
}

function FormHeader({ category }) {
  return <p className="form-header">{`Share this ${category} with friends`}</p>;
}

function FormImage({ media }) {
  return (
    <img
      src={media?.media?.image || media?.image || DEFAULT_MEDIA_IMG}
      className="form-media-img"
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
      className="form-input"
    />
  );
}

function FormUserResults({ users, handleAddUser }) {
  return (
    <div className={`share-form-user-results ${users.length > 0 && "active"}`}>
      {users.map((user) => (
        <button
          key={user.uid}
          type="button"
          onClick={() => handleAddUser(user)}
          className="share-form-user-result"
        >
          <img src={user.profileUrl} />
          <div className="share-form-user-result-info">
            <p>{user.displayname}</p>
            <span>@{user.username}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function FormUsersList({ currentUsers, setCurrentUser }) {
  function handleRemoveUser(userId) {
    setCurrentUser(currentUsers.filter((user) => user.uid !== userId));
  }

  return (
    <div className="share-form-current-users">
      {currentUsers?.map((user) => {
        return (
          <div key={user.uid} className="share-form-current-user">
            <p>@{user.username}</p>
            <button type="button" onClick={() => handleRemoveUser(user.uid)}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function FormMessage({ message, setMessage }) {
  function handleChange(e) {
    setMessage(e.target.value);
  }

  return (
    <input
      type="text"
      value={message}
      onChange={handleChange}
      placeholder="Include a message..."
      className="form-input"
    />
  );
}

function FormButton({ currentUsers }) {
  return (
    <button type="submit" className="form-submit-btn">
      <FaPaperPlane />
      <p>{`Send ${currentUsers.length > 1 ? "seperately" : ""} `}</p>
    </button>
  );
}
