import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSearch, faSignOut } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const navigate = useNavigate();

  const { globalUser } = useAuthContext();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  function handleUserClick() {
    if (globalUser) {
      setShowDropdown(!showDropdown);
    } else {
      navigate("/authenticate");
    }
  }

  return (
    <div className="items-center bg-[#121212] py-4 text-2xl">
      <ul className="m-auto flex w-3/5 items-center justify-evenly gap-6">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${isActive ? "text-green-700" : "hover:text-gray-400"}`
            }
          >
            <FontAwesomeIcon icon={faHome} />
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `${isActive ? "text-green-700" : "hover:text-gray-400"}`
            }
          >
            <FontAwesomeIcon icon={faSearch} />
          </NavLink>
        </li>
        <li className="ml-auto">
          <div ref={dropdownRef} className="relative">
            <FaUser
              onClick={handleUserClick}
              className={`cursor-pointer text-4xl ${
                location.pathname.startsWith("/users")
                  ? "text-green-700"
                  : "text-white hover:text-gray-400"
              }`}
            />
            <div
              className={`absolute top-10 right-0 z-30 w-fit overflow-hidden rounded-lg bg-green-700 text-white transition-all duration-300 ease-in-out ${
                showDropdown
                  ? "max-h-screen p-2 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <DropdownMenu
                items={[
                  { label: "Inbox", path: "/profile" },
                  { label: "Profile", path: "/profile" },
                  {
                    label: "Lists",
                    path: `/users/${globalUser?.username}/lists`,
                  },
                  {
                    label: "Friends",
                    path: `/users/${globalUser?.username}/friends`,
                  },
                ]}
                onClose={() => setShowDropdown(false)}
                globalUser={globalUser}
              />
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}

function DropdownMenu({ items, onClose, globalUser }) {
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  async function handleLogout() {
    onClose();
    await logout();
    navigate("/authenticate", { replace: true });
  }

  return (
    <ul className="flex flex-col gap-2 px-4 py-2">
      <li>
        <p className="font-bold text-nowrap">Hi, {globalUser?.username}</p>
      </li>
      {items.map(({ label, path }) => (
        <li
          key={label}
          className="transition-all duration-150 hover:text-gray-400"
        >
          <Link to={path} onClick={onClose}>
            {label}
          </Link>
        </li>
      ))}
      <li>
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-between transition-all duration-150 hover:text-gray-400"
        >
          <p>Logout</p>
          <FontAwesomeIcon icon={faSignOut} />
        </button>
      </li>
    </ul>
  );
}
