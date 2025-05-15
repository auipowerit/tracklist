import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DEFAULT_PROFILE_IMG } from "src/data/const";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "src/features/shared/components/buttons/Button";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import {
  faList,
  faSignOut,
  faUserCircle,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";

export default function NavProfile() {
  const { globalUser } = useAuthContext();

  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [globalUser]);

  function handleUserClick() {
    if (globalUser) {
      setShowDropdown(!showDropdown);
    } else {
      navigate("/authenticate");
    }
  }

  return (
    <div ref={dropdownRef} className="navbar__profile">
      <img
        src={globalUser?.profileUrl || DEFAULT_PROFILE_IMG}
        onClick={handleUserClick}
        className="navbar__image"
      />

      <DropdownMenu
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
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
      />
    </div>
  );
}

function DropdownMenu({ showDropdown, setShowDropdown, items }) {
  const { globalUser } = useAuthContext();

  const navigate = useNavigate();
  const { logout } = useAuthContext();

  async function handleLogout() {
    onClose();
    await logout();
    navigate("/authenticate", { replace: true });
  }

  function onClose() {
    setShowDropdown(false);
  }

  return (
    <ul className="navbar-dropdown" aria-expanded={showDropdown}>
      <li>
        <p className="navbar-dropdown__header">Hi, {globalUser?.username}</p>
      </li>
      {items.map(({ label, path, icon }) => (
        <li key={label}>
          <Link to={path} onClick={onClose} className="navbar-dropdown__item">
            <FontAwesomeIcon icon={icon} />
            <p>{label}</p>
          </Link>
        </li>
      ))}
      <li>
        <Button
          onClick={handleLogout}
          classes="navbar-dropdown__item"
          ariaLabel="logout of account"
        >
          <FontAwesomeIcon icon={faSignOut} />
          <p>Logout</p>
        </Button>
      </li>
    </ul>
  );
}
