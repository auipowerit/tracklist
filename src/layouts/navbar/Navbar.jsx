import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useChatContext } from "src/features/chat/context/ChatContext";
import { faEnvelope, faSearch } from "@fortawesome/free-solid-svg-icons";
import NavProfile from "./NavProfile";
import "./navbar.scss";
import MobileNavbar from "./MobileNavbar";

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

        <div className="nav-messaging">
          <NavItem link="/messaging" icon={faEnvelope} />
          <NotificationBadge unreadCount={unreadCount} />
        </div>
        <NavProfile globalUser={globalUser} />
      </div>

      <MobileNavbar />
    </div>
  );
}

function NavLogo() {
  return (
    <NavLink
      to="/reviews"
      className={({ isActive }) => `navlink nav-logo ${isActive && "active"}`}
    >
      <p>TrackList</p>
    </NavLink>
  );
}

function NavItem({ link, icon }) {
  return (
    <NavLink
      to={link}
      className={({ isActive }) => `navlink ${isActive && "active"}`}
    >
      <FontAwesomeIcon icon={icon} />
    </NavLink>
  );
}

function NotificationBadge({ unreadCount }) {
  if (unreadCount === 0) return;
  return <p className="notification-badge">{unreadCount}</p>;
}
