import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { useChatContext } from "src/context/Chat/ChatContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faSearch,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import "src/styles/layout/navbar.css";

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
    <div className="navbar">
      <div className="nav-items">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `navlink nav-logo ${isActive ? "text-green-700" : "hover:text-gray-400"} `
          }
        >
          <p>TrackList</p>
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) =>
            `navlink ${isActive ? "text-green-700" : "hover:text-gray-400"}`
          }
        >
          <FontAwesomeIcon icon={faSearch} />
        </NavLink>
        <div className="relative">
          <NavLink
            to="/messaging"
            className={({ isActive }) =>
              `navlink ${isActive ? "text-green-700" : "hover:text-gray-400"}`
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
            className="nav-profile"
          />
          <div
            className={`nav-profile-dropdown ${
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
    <div className="notification-badge">
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
    <ul className="nav-profile-dropdown-list">
      <li>
        <p className="nav-profile-dropdown-header">
          Hi, {globalUser?.username}
        </p>
      </li>
      {items.map(({ label, path }) => (
        <li key={label} className="nav-profile-dropdown-item">
          <Link to={path} onClick={onClose}>
            {label}
          </Link>
        </li>
      ))}
      <li>
        <button
          onClick={handleLogout}
          className="nav-profile-dropdown-logout nav-profile-dropdown-item"
        >
          <p>Logout</p>
          <FontAwesomeIcon icon={faSignOut} />
        </button>
      </li>
    </ul>
  );
}
