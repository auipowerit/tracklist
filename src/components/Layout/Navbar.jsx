import { FaUser } from "react-icons/fa";
import { useAuthContext } from "../../context/Auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const { globalUser, logout } = useAuthContext();
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
    <ul className="flex items-center gap-6 px-6 py-4 text-2xl">
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/search">Search</Link>
      </li>
      <li className="ml-auto">
        <div ref={dropdownRef} className="relative">
          <FaUser
            onClick={handleUserClick}
            className="cursor-pointer text-4xl text-green-900"
          />
          <div
            className={`absolute top-10 right-0 w-fit overflow-hidden rounded-lg bg-green-900 text-white transition-all duration-300 ease-in-out ${
              showDropdown
                ? "max-h-screen p-2 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <DropdownMenu
              items={[
                { label: "Profile", path: "/account" },
                { label: "Lists", path: "/lists" },
                { label: "Friends", path: "/friends" },
                { label: "Logout", path: "/authenticate", action: logout },
              ]}
              onClose={() => setShowDropdown(false)}
            />
          </div>
        </div>
      </li>
    </ul>
  );

  function DropdownMenu({ items, onClose }) {
    return (
      <ul className="flex flex-col gap-2 px-4 py-2">
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
