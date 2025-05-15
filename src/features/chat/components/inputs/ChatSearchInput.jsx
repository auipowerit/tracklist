import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "src/features/shared/components/buttons/Button";
import { faCaretSquareLeft } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useChatContext } from "../../context/ChatContext";
import "./chat-inputs.scss";

export default function ChatSearchInput() {
  const { globalUser, getUserById, searchByUsername } = useAuthContext();
  const { chats, addChat, setActiveChatId, setActiveChatUser } =
    useChatContext();

  const [users, setUsers] = useState([]);
  const inputRef = useRef(null);

  async function handleSearch(e) {
    e.preventDefault();
    const input = e.target.value;

    if (input === "") {
      setUsers([]);
      return;
    }

    const fetchedUsers = await searchByUsername(input, globalUser.uid);

    fetchedUsers.sort((a, b) => {
      return (
        globalUser.following.includes(b.uid) -
        globalUser.following.includes(a.uid)
      );
    });

    setUsers(fetchedUsers);
  }

  async function handleAddUser(friendId) {
    inputRef.current.value = "";
    setUsers([]);

    const foundChat = chats.find((chat) => chat.recipientId === friendId);

    if (foundChat) {
      setActiveChatId(foundChat.chatId);
      setActiveChatUser(foundChat);
    } else {
      const chatId = await addChat(globalUser.uid, friendId);
      const recipient = await getUserById(friendId);
      setActiveChatId(chatId);
      setActiveChatUser(recipient);
    }
  }

  return (
    <div className="chat-search">
      <CancelButton />
      <SearchInput ref={inputRef} handleSearch={handleSearch} />
      <SearchResults users={users} handleAddUser={handleAddUser} />
    </div>
  );
}

function CancelButton() {
  const { setIsCollapsed } = useChatContext();

  function handleClick() {
    setIsCollapsed(false);
  }

  return (
    <Button
      onClick={handleClick}
      classes="chat-search__cancel"
      ariaLabel="collapse chat list"
    >
      <FontAwesomeIcon icon={faCaretSquareLeft} />
    </Button>
  );
}

function SearchInput({ ref, handleSearch }) {
  return (
    <input
      type="text"
      placeholder="Search for a friend..."
      ref={ref}
      onChange={handleSearch}
      className="chat-search__input"
    />
  );
}

function SearchResults({ users, handleAddUser }) {
  return (
    <div className="chat-search__dropdown" aria-expanded={users.length > 0}>
      {users.map((user) => (
        <Button
          key={user.uid}
          onClick={() => handleAddUser(user.uid)}
          classes="chat-search__user"
          ariaLabel="add user to chat"
        >
          <img
            src={user.profileUrl}
            className="chat-search__image"
            alt="chat user profile"
          />
          <div className="chat-search__info">
            <p className="chat-search__displayname">{user.displayname}</p>
            <p className="chat-search__username">@{user.username}</p>
          </div>
        </Button>
      ))}
    </div>
  );
}
