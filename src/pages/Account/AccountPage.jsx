import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Loading from "src/components/Loading";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";

export default function AccountPage() {
  const { loadingUser, globalUser, globalData, logout } = useAuthContext();

  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage =
    location.pathname === "/account" ||
    location.pathname === "/account/profile";

  const isActive = (page) => {
    return location.pathname.startsWith("/account/" + page);
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
    { id: "likes", LoadBundleTask: "Likes" },
    { id: "friends", LoadBundleTask: "Friends" },
  ];

  if (loadingUser) {
    return <Loading />;
  }

  return (
    <div className="mx-auto my-4 flex w-full flex-col items-center gap-4">
      <div className="flex w-3/5 items-center justify-between bg-green-700/30 px-6 py-2 text-lg text-gray-400">
        <Link
          to="profile"
          className={`flex items-center gap-2 hover:text-white ${isHomePage && "text-white"}`}
        >
          <img
            src={globalData.profileUrl}
            className="h-8 w-8 rounded-full object-cover"
          />
          <p>{globalData?.username}</p>
        </Link>

        <div className="flex items-center gap-4">
          {children.map((child) => (
            <Link
              key={child.id}
              to={child.id}
              className={`flex items-center gap-2 hover:text-white ${isActive(child.id) && "text-white"}`}
            >
              {child.LoadBundleTask}
            </Link>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 hover:text-white"
        >
          <FontAwesomeIcon icon={faSignOut} />
        </button>
      </div>

      <div className="m-auto my-6 w-3/5">
        <Outlet context={{ globalUser, globalData }} />
      </div>
    </div>
  );
}
