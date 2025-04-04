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
  const { loadingUser, globalUser, globalData, logout } = useAuthContext();

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
    if (loadingUser) return;

    if (!globalData || !globalUser) {
      navigate("/authenticate", { replace: true });
    }
  }, [globalUser, globalData, loadingUser]);

  const children = [
    { id: "reviews", LoadBundleTask: "Reviews" },
    { id: "lists", LoadBundleTask: "Lists" },
    { id: "tags", LoadBundleTask: "Tags" },
    { id: "likes", LoadBundleTask: "Likes" },
    { id: "network", LoadBundleTask: "Network" },
  ];

  if (loadingUser) {
    return <Loading />;
  }

  return (
    <div>
      <div className="mx-auto my-4 flex w-3/5 items-center justify-between bg-green-700/30 px-6 py-2 text-lg text-gray-400">
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
              key={child.id}
              to={child.id}
              className={`flex items-center gap-2 ${isActive(child.id) && "text-white"}`}
            >
              {child.LoadBundleTask}
            </Link>
          ))}
        </div>

        <button onClick={handleLogout} className="flex items-center gap-2">
          <FontAwesomeIcon icon={faSignOut} />
        </button>
      </div>

      <div className="m-auto my-6 w-3/5">
        <Outlet context={{ globalUser }} />
      </div>
    </div>
  );
}
