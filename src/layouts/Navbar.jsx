import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useChatContext } from "src/features/chat/context/ChatContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faList,
  faSearch,
  faSignOut,
  faUserCircle,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import "./styles/navbar.scss";

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
          to="/reviews"
          className={({ isActive }) =>
            `navlink nav-logo ${isActive && "active"}`
          }
        >
          <p>TrackList</p>
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) => `navlink ${isActive && "active"}`}
        >
          <FontAwesomeIcon icon={faSearch} />
        </NavLink>
        <div className="nav-messaging">
          <NavLink
            to="/messaging"
            className={({ isActive }) => `navlink ${isActive && "active"}`}
          >
            <FontAwesomeIcon icon={faEnvelope} />
          </NavLink>
          {unreadCount > 0 && <NotificationBadge unreadCount={unreadCount} />}
        </div>
        <div ref={dropdownRef} className="nav-profile-dropdown-container">
          <img
            src={globalUser?.profileUrl || "/images/default-profile-image.jpg"}
            onClick={handleUserClick}
            className="nav-profile"
          />
          <DropdownMenu
            showDropdown={showDropdown}
            items={[
              { label: "Profile", path: "/profile", icon: faUserCircle },
              {
                label: "Lists",
                path: `/users/${globalUser?.username}/lists`,
                icon: faList,
              },
              {
                label: "Friends",
                path: `/users/${globalUser?.username}/friends`,
                icon: faUserGroup,
              },
            ]}
            onClose={() => setShowDropdown(false)}
            globalUser={globalUser}
          />
        </div>
      </div>
    </div>
  );
}

function NotificationBadge({ unreadCount }) {
  return <p className="notification-badge">{unreadCount}</p>;
}

function DropdownMenu({ showDropdown, items, onClose, globalUser }) {
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  async function handleLogout() {
    onClose();
    await logout();
    navigate("/authenticate", { replace: true });
  }

  return (
    <ul className={`nav-profile-dropdown ${showDropdown && "active"}`}>
      <li>
        <p className="nav-profile-dropdown-header">
          Hi, {globalUser?.username}
        </p>
      </li>
      {items.map(({ label, path, icon }) => (
        <li key={label}>
          <Link
            to={path}
            onClick={onClose}
            className="nav-profile-dropdown-item"
          >
            <FontAwesomeIcon icon={icon} />
            <p>{label}</p>
          </Link>
        </li>
      ))}
      <li>
        <button onClick={handleLogout} className="nav-profile-dropdown-item">
          <FontAwesomeIcon icon={faSignOut} />
          <p>Logout</p>
        </button>
      </li>
    </ul>
  );
}
