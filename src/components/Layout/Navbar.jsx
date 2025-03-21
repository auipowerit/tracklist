import { useAuthContext } from "../../context/Auth/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { globalUser, logout } = useAuthContext();

  return (
    <ul className="flex gap-6 px-6 py-4 text-2xl">
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/search">Search</Link>
      </li>
      <li className="ml-auto">
        <div>
          {globalUser ? (
            <button
              onClick={logout}
              className="rounded-md bg-green-900 px-3 py-1"
            >
              Logout
            </button>
          ) : (
            <Link
              to={"/authenticate"}
              className="rounded-md bg-green-900 px-3 py-1"
            >
              Login
            </Link>
          )}
        </div>
      </li>
    </ul>
  );
}
