import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useChatContext } from "src/features/chat/context/ChatContext";
import {
  faBell,
  faEnvelope,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import NavProfile from "./NavProfile";
import MobileNavbar from "./MobileNavbar";
import "./navbar.scss";

export default function Navbar() {
  const { globalUser } = useAuthContext();
  const { chats, getUnreadChatsByUserId } = useChatContext();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadChats = async () => {
      if (!globalUser) return;
      const count = await getUnreadChatsByUserId(globalUser.uid);
      setUnreadCount(count);
    };

    fetchUnreadChats();
  }, [globalUser, chats]);

  return (
    <div className="navbar">
      <div className="nav-items">
        <NavLogo />
        <NavItem link="/search" icon={faSearch} />

        <div className="nav-messages">
          <NavItem link="/messages" icon={faEnvelope} />
          <NotificationBadge unreadCount={unreadCount} />
        </div>

        <NavItem link="/inbox" icon={faBell} />
        <NavProfile globalUser={globalUser} />
      </div>

      <MobileNavbar />
    </div>
  );
}

function NavLogo() {
  return (
    <NavLink
      to="/home"
      className={({ isActive }) =>
        `navlink nav-logo ${isActive ? "active" : ""}`
      }
    >
      <p>TrackList</p>
    </NavLink>
  );
}

function NavItem({ link, icon }) {
  return (
    <NavLink
      to={link}
      className={({ isActive }) => `navlink ${isActive ? "active" : ""}`}
    >
      <FontAwesomeIcon icon={icon} />
    </NavLink>
  );
}

function NotificationBadge({ unreadCount }) {
  if (!unreadCount || unreadCount === 0) return;
  return <p className="notification-badge">{unreadCount}</p>;
}
