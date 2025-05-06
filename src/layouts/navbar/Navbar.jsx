import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { db } from "src/config/firebase";
import { doc, onSnapshot } from "firebase/firestore";
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
  const { globalUser, getUnreadInbox } = useAuthContext();
  const { chats, getUnreadChatsByUserId } = useChatContext();

  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  useEffect(() => {
    const fetchUnreadChats = async () => {
      if (!globalUser) return;
      const count = await getUnreadChatsByUserId(globalUser.uid);
      setUnreadMessages(count);
    };

    fetchUnreadChats();
  }, [globalUser, chats]);

  useEffect(() => {
    if (!globalUser) {
      setUnreadNotifs(0);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "users", globalUser.uid),
      async () => {
        const count = await getUnreadInbox(globalUser.uid);
        setUnreadNotifs(count);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [globalUser]);

  return (
    <div className="nav">
      <div className="navbar">
        <NavLogo />
        <NavItem link="/search" icon={faSearch} />

        <div className="navbar__messages">
          <NavItem link="/messages" icon={faEnvelope} />
          <NotificationBadge unreadCount={unreadMessages} link="/messages" />
        </div>

        <div className="navbar__messages">
          <NavItem link="/inbox" icon={faBell} />
          <NotificationBadge unreadCount={unreadNotifs} link="/inbox" />
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
      to="/home"
      className={({ isActive }) =>
        `navbar__link navbar__logo ${isActive ? "active" : ""}`
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
      className={({ isActive }) => `navbar__link ${isActive ? "active" : ""}`}
    >
      <FontAwesomeIcon icon={icon} />
    </NavLink>
  );
}

function NotificationBadge({ unreadCount, link }) {
  if (!unreadCount || unreadCount === 0) return;
  return (
    <NavLink to={link}>
      <p className="navbar__badge">{unreadCount}</p>
    </NavLink>
  );
}
