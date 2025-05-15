import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import {
  faBell,
  faEnvelope,
  faHome,
  faSearch,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import "./mobile-navbar.scss";

export default function MobileNavbar({ unreadMessages, unreadNotifs }) {
  const mobileRef = useRef();
  const location = useLocation();

  const { globalUser } = useAuthContext();

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  function handleScroll() {
    const scrollPosition = window.scrollY;

    // Check if the user is scrolling down
    if (scrollPosition > 200) {
      // Hide the mobile navbar
      mobileRef.current.classList.add("mobile-navbar--hidden");
    } else {
      // Show the mobile navbar
      mobileRef.current.classList.remove("mobile-navbar--hidden");
    }
  }

  function handleClick() {
    // Show the mobile navbar
    mobileRef.current.classList.remove("mobile-navbar--hidden");
  }

  function isActive(page) {
    return location.pathname.startsWith(`/${page}`);
  }

  return (
    <nav ref={mobileRef} onClick={handleClick} className="mobile-navbar">
      <MobileNavItem
        link="/home"
        icon={faHome}
        isActive={isActive("home") || isActive("reviews")}
      />
      <MobileNavItem
        link="/search"
        icon={faSearch}
        isActive={isActive("search")}
      />

      <div className="mobile-navbar__messages">
        <MobileNavItem
          link="/messages"
          icon={faEnvelope}
          isActive={isActive("messages")}
        />
        <NotificationBadge unreadCount={unreadMessages} />
      </div>

      <div className="mobile-navbar__messages">
        <MobileNavItem
          link="/inbox"
          icon={faBell}
          isActive={isActive("inbox")}
        />
        <NotificationBadge unreadCount={unreadNotifs} />
      </div>

      <MobileNavItem
        link={globalUser ? `/users/${globalUser.username}/reviews` : "/profile"}
        icon={faUser}
        isActive={
          isActive("profile") ||
          (globalUser && isActive(`users/${globalUser.username}`)) ||
          isActive("authenticate")
        }
      />
    </nav>
  );
}

function MobileNavItem({ link, icon, isActive }) {
  return (
    <NavLink
      to={link}
      className="mobile-navbar__link"
      aria-selected={isActive ? "true" : "false"}
    >
      <FontAwesomeIcon icon={icon} />
    </NavLink>
  );
}

function NotificationBadge({ unreadCount }) {
  if (!unreadCount || unreadCount === 0) return;
  return <p className="mobile-navbar__badge">{unreadCount}</p>;
}
