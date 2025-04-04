import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { useAuthContext } from "src/context/Auth/AuthContext";

export default function Navbar() {
  const { globalUser, globalData, logout } = useAuthContext();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  function handleUserClick() {
    if (globalUser) {
      setShowDropdown(!showDropdown);
    } else {
      navigate("/authenticate");
    }
  }

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
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `${isActive ? "text-green-700" : "hover:text-gray-400"}`
            }
          >
            Search
          </NavLink>
        </li>
        <li className="ml-auto">
          <div ref={dropdownRef} className="relative">
            <FaUser
              onClick={handleUserClick}
              className={`cursor-pointer text-4xl ${
                location.pathname.startsWith("/account")
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
                  { label: "Profile", path: "/account" },
                  { label: "Lists", path: "/account/lists" },
                  { label: "Friends", path: "/account/network" },
                  {
                    label: "Logout",
                    path: "/authenticate",
                    action: logout,
                  },
                ]}
                onClose={() => setShowDropdown(false)}
              />
            </div>
          </div>
        </li>
      </ul>
    </div>
  );

  function DropdownMenu({ items, onClose }) {
    return (
      <ul className="flex flex-col gap-2 px-4 py-2">
        <li>
          <p className="font-bold text-nowrap">Hi, {globalData?.username}</p>
        </li>
        {items.map(({ label, path, action }) => (
          <li
            key={label}
            className="transition-all duration-150 hover:text-gray-400"
          >
            <Link
              to={path}
              onClick={() => {
                if (action) action();
                onClose();
              }}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    );
  }
}
