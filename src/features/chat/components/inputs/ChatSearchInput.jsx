import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "src/features/shared/components/buttons/Button";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useChatContext } from "../../context/ChatContext";
import "./chat-inputs.scss";

export default function ChatSearchInput() {
  const { globalUser, getUserById, searchByUser } = useAuthContext();
  const { chats, addChat, setActiveChatId, setActiveChatUser } =
    useChatContext();

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleSearch = async () => {
      if (isSearching) return;

      setIsSearching(true);

      try {
        if (search === "") {
          setUsers([]);
          return;
        }

        const fetchedUsers = await searchByUser(search, globalUser.uid);
        fetchedUsers.sort((a, b) => {
          return (
            globalUser.following.includes(b.uid) -
            globalUser.following.includes(a.uid)
          );
        });

        setUsers(fetchedUsers);
      } finally {
        setIsSearching(false);
      }
    };

    handleSearch();
  }, [search, isSearching]);

  async function handleSearch(e) {
    e.preventDefault();
    const input = e.target.value;

    if (input === "") {
      setUsers([]);
      return;
    }

    const fetchedUsers = await searchByUser(input, globalUser.uid);

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
      <SearchInput
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
      />
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
      <FontAwesomeIcon icon={faArrowLeft} />
    </Button>
  );
}

function SearchInput({ search, setSearch }) {
  return (
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value.trim())}
      placeholder="Search for a friend..."
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
