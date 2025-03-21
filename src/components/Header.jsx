import { Link } from "react-router-dom";
import { useAuthContext } from "../context/Auth/AuthContext";

export default function Header() {
  const { globalUser, globalData, logout } = useAuthContext();

  return (
    <div className="flex items-center px-4 py-2">
      {globalUser && globalData ? (
        <>
          <p className="flex-1 text-2xl font-bold">
            Hello, {globalData.username}
          </p>
          <button
            onClick={logout}
            className="ml-auto w-fit rounded-full bg-green-900 px-4 py-2"
          >
            Logout
          </button>
        </>
      ) : (
        <Link
          className="ml-auto rounded-md bg-green-900 px-4 py-2 text-lg"
          to={"/authenticate"}
        >
          Login
        </Link>
      )}
    </div>
  );
}
