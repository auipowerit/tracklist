import { useEffect } from "react";
import {
  Link,
  matchPath,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Loading from "src/components/Loading";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut, faUserCircle } from "@fortawesome/free-solid-svg-icons";

export default function AccountPage() {
  const { isLoading, globalData, logout } = useAuthContext();

  const navigate = useNavigate();

  const location = useLocation();
  const isActive = (page) => {
    return matchPath("/account/" + page, location.pathname) !== null;
  };

  async function handleLogout() {
    await logout();
    navigate("/authenticate", { replace: true });
  }

  useEffect(() => {
    if (isLoading) return;

    if (!globalData) {
      navigate("/authenticate", { replace: true });
    }
  }, [globalData, isLoading]);

  const children = [
    { page: "reviews", content: "Reviews" },
    { page: "lists", content: "Lists" },
    { page: "tags", content: "Tags" },
    { page: "likes", content: "Likes" },
    { page: "followers", content: "Followers" },
    { page: "following", content: "Following" },
    { page: "settings", content: "Settings" },
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="mx-auto my-4 flex w-3/5 items-center justify-around bg-green-700/30 px-4 py-2 text-lg text-gray-400">
        <Link
          to=""
          className={`flex items-center gap-2 ${isActive("/") && "text-white"}`}
        >
          <FontAwesomeIcon icon={faUserCircle} />
          <p>{globalData?.username}</p>
        </Link>

        <div className="flex items-center gap-4">
          {children.map((child) => (
            <Link
              key={child.page}
              to={child.page}
              className={`flex items-center gap-2 ${isActive(child.page) && "text-white"}`}
            >
              {child.content}
            </Link>
          ))}
        </div>

        <button onClick={handleLogout} className="flex items-center gap-2">
          <FontAwesomeIcon icon={faSignOut} />
        </button>
      </div>

      <div className="m-auto my-6 w-3/5">
        <Outlet />
      </div>
    </div>
  );
}
