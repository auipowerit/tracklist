import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

  return (
    <div ref={mobileRef} className="mobile-navbar">
      <nav className="mobile-navbar--container" onClick={handleClick}>
        <MobileNavItem link="/home" icon={faHome} />
        <MobileNavItem link="/search" icon={faSearch} />

        <div className="mobile-navbar__messages">
          <MobileNavItem link="/messages" icon={faEnvelope} />
          <NotificationBadge unreadCount={unreadMessages} />
        </div>

        <div className="mobile-navbar__messages">
          <MobileNavItem link="/inbox" icon={faBell} />
          <NotificationBadge unreadCount={unreadNotifs} />
        </div>

        <MobileNavItem link="/profile" icon={faUser} />
      </nav>
    </div>
  );
}

function MobileNavItem({ link, icon }) {
  return (
    <NavLink
      to={link}
      className={({ isActive }) =>
        `mobile-navbar__link ${isActive ? "active" : ""}`
      }
    >
      <FontAwesomeIcon icon={icon} />
    </NavLink>
  );
}

function NotificationBadge({ unreadCount }) {
  if (!unreadCount || unreadCount === 0) return;
  return <p className="mobile-navbar__badge">{unreadCount}</p>;
}
