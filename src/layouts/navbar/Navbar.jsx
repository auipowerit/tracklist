import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import {
  faBell,
  faEnvelope,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import NavProfile from "./NavProfile";
import "./navbar.scss";

export default function Navbar({ unreadMessages, unreadNotifs }) {
  const { globalUser } = useAuthContext();

  return (
    <header className="nav">
      <nav className="navbar">
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
      </nav>
    </header>
  );
}

function NavLogo() {
  return (
    <NavLink
      to="/home"
      className="navbar__link navbar__logo"
      aria-current="page"
    >
      <p>TrackList</p>
    </NavLink>
  );
}

function NavItem({ link, icon }) {
  return (
    <NavLink to={link} className="navbar__link" aria-current="page">
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
