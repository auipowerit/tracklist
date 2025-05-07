import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./mobile-navbar.scss";

export default function MobileNavbar({ unreadMessages, unreadNotifs }) {
  const location = useLocation();

  const hamburger = useRef(null);
  const menu = useRef(null);
  const overlay = useRef(null);

  useEffect(() => {
    return () => {
      if (!hamburger.current || !menu.current) return;
      deactivate();
    };
  }, [location.pathname]);

  function handleClick() {
    if (!hamburger.current || !menu.current || !overlay.current) return;

    if (hamburger.current.classList.contains("is-active")) {
      deactivate();
    } else {
      activate();
    }
  }

  function activate() {
    hamburger.current.classList.add("is-active");
    menu.current.classList.add("is-active");
    overlay.current.classList.add("is-active");
    document.body.classList.add("lock-scroll");
  }

  function deactivate() {
    hamburger.current.classList.remove("is-active");
    menu.current.classList.remove("is-active");
    overlay.current.classList.remove("is-active");
    document.body.classList.remove("lock-scroll");
  }

  return (
    <div>
      <Hamburger hamburger={hamburger} handleClick={handleClick} />

      <nav ref={menu} className="mobile-navbar">
        <MobileNavItem link="/home" label="Home" />
        <MobileNavItem link="/search" label="Search" />

        <div className="mobile-navbar__messages">
          <MobileNavItem link="/messages" label="Chat" />
          <NotificationBadge unreadCount={unreadMessages} />
        </div>

        <div className="mobile-navbar__messages">
          <MobileNavItem link="/inbox" label="Inbox" />
          <NotificationBadge unreadCount={unreadNotifs} />
        </div>

        <MobileNavItem link="/profile" label="Profile" />
      </nav>

      <Overlay overlay={overlay} handleClick={deactivate} />
    </div>
  );
}

function Hamburger({ hamburger, handleClick }) {
  return (
    <button
      ref={hamburger}
      type="button"
      onClick={handleClick}
      className="hamburger"
    >
      <div className="hamburger__bar" />
    </button>
  );
}

function MobileNavItem({ link, label }) {
  return (
    <NavLink
      to={link}
      className={({ isActive }) =>
        `mobile-navbar__link ${isActive ? "active" : ""}`
      }
    >
      <p>{label}</p>
    </NavLink>
  );
}

function NotificationBadge({ unreadCount }) {
  if (!unreadCount || unreadCount === 0) return;
  return <p className="mobile-navbar__badge">{unreadCount}</p>;
}

function Overlay({ overlay, handleClick }) {
  return (
    <div
      ref={overlay}
      onClick={handleClick}
      className="mobile-navbar__overlay"
    />
  );
}
