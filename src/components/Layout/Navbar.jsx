import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faSearch,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import { useChatContext } from "src/context/Chat/ChatContext";

export default function Navbar() {
  const navigate = useNavigate();

  const { globalUser } = useAuthContext();
  const { chats, getUnreadChatsByUserId } = useChatContext();

  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUnreadChats = async () => {
      if (!globalUser) return;
      const count = await getUnreadChatsByUserId(globalUser.uid);
      setUnreadCount(count);
    };

    fetchUnreadChats();

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [globalUser, chats]);

  function handleUserClick() {
    if (globalUser) {
      setShowDropdown(!showDropdown);
    } else {
      navigate("/authenticate");
    }
  }

  return (
    <div className="items-center bg-[#121212] py-4 text-2xl">
      <div className="m-auto flex w-3/5 items-center justify-end gap-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `mr-auto text-4xl font-bold ${isActive ? "text-green-700" : "hover:text-gray-400"} `
          }
        >
          <p>TrackList</p>
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) =>
            `text-3xl ${isActive ? "text-green-700" : "hover:text-gray-400"}`
          }
        >
          <FontAwesomeIcon icon={faSearch} />
        </NavLink>
        <div className="relative">
          <NavLink
            to="/messaging"
            className={({ isActive }) =>
              `text-3xl ${isActive ? "text-green-700" : "hover:text-gray-400"}`
            }
          >
            <FontAwesomeIcon icon={faEnvelope} />
          </NavLink>
          {unreadCount > 0 && <NotificationBadge unreadCount={unreadCount} />}
        </div>
        <div ref={dropdownRef} className="relative">
          <img
            src={globalUser?.profileUrl || "/images/default-profile-img.jpg"}
            onClick={handleUserClick}
            className="h-10 w-10 cursor-pointer rounded-full object-cover"
          />
          <div
            className={`absolute top-10 right-0 z-30 w-fit overflow-hidden rounded-lg bg-green-700 text-white transition-all duration-300 ease-in-out ${
              showDropdown
                ? "max-h-screen p-2 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <DropdownMenu
              items={[
                { label: "Profile", path: "/profile" },
                {
                  label: "Lists",
                  path: `/users/${globalUser?.username}/lists`,
                },
                {
                  label: "Friends",
                  path: `/users/${globalUser?.username}/friends`,
                },
              ]}
              onClose={() => setShowDropdown(false)}
              globalUser={globalUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationBadge({ unreadCount }) {
  return (
    <div className="absolute -top-1 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-700 text-sm font-bold text-white">
      <p>{unreadCount}</p>
    </div>
  );
}

function DropdownMenu({ items, onClose, globalUser }) {
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  async function handleLogout() {
    onClose();
    await logout();
    navigate("/authenticate", { replace: true });
  }

  return (
    <ul className="flex flex-col gap-2 px-4 py-2">
      <li>
        <p className="font-bold text-nowrap">Hi, {globalUser?.username}</p>
      </li>
      {items.map(({ label, path }) => (
        <li
          key={label}
          className="transition-all duration-150 hover:text-gray-400"
        >
          <Link to={path} onClick={onClose}>
            {label}
          </Link>
        </li>
      ))}
      <li>
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-between transition-all duration-150 hover:text-gray-400"
        >
          <p>Logout</p>
          <FontAwesomeIcon icon={faSignOut} />
        </button>
      </li>
    </ul>
  );
}
