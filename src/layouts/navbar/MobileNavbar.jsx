import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./mobile-navbar.scss";

export default function MobileNavbar() {
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

      <nav ref={menu} className="mobile-nav">
        <MobileNavItem link="/reviews" label="Home" />
        <MobileNavItem link="/search" label="Search" />
        <MobileNavItem link="/messaging" label="Inbox" />

        <MobileNavProfile />
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
      <div className="mobile-bar" />
    </button>
  );
}

function MobileNavItem({ link, label }) {
  return (
    <NavLink
      to={link}
      className={({ isActive }) =>
        `mobile-nav-link ${isActive ? "active" : ""}`
      }
    >
      <p>{label}</p>
    </NavLink>
  );
}

function MobileNavProfile() {
  return (
    <NavLink
      to="/profile"
      className={({ isActive }) =>
        `mobile-nav-link ${isActive ? "active" : ""}`
      }
    >
      <FontAwesomeIcon icon={faUser} />
    </NavLink>
  );
}

function Overlay({ overlay, handleClick }) {
  return (
    <div ref={overlay} onClick={handleClick} className="mobile-nav-overlay" />
  );
}
