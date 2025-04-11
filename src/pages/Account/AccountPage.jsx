import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Loading from "src/components/Loading";
import { useAuthContext } from "src/context/Auth/AuthContext";
import NavLinks from "./components/NavLinks";
import LogoutButton from "./components/LogoutButton";

export default function AccountPage() {
  const navigate = useNavigate();

  const { loadingUser, globalUser } = useAuthContext();

  useEffect(() => {
    if (loadingUser) return;
    handleUserNotFound();
  }, [globalUser, loadingUser]);

  function handleUserNotFound() {
    if (!globalUser) {
      navigate("/authenticate", { replace: true });
    }
  }

  if (loadingUser || !globalUser) {
    return <Loading />;
  }

  return (
    <div className="mx-auto my-4 flex w-full flex-col items-center gap-4">
      <div className="flex w-3/5 items-center justify-between bg-green-700/30 px-6 py-2 text-lg text-gray-400">
        <Profile />
        <NavLinks />
        <LogoutButton />
      </div>

      <div className="m-auto my-6 w-3/5">
        <Outlet />
      </div>
    </div>
  );
}

function Profile() {
  const location = useLocation();
  const { globalUser } = useAuthContext();

  const isHomePage =
    location.pathname === "/account" ||
    location.pathname === "/account/profile";

  return (
    <Link
      to="profile"
      className={`flex items-center gap-2 hover:text-white ${isHomePage && "text-white"}`}
    >
      <img
        src={globalUser?.profileUrl}
        className="h-8 w-8 rounded-full object-cover"
      />
      <p>{globalUser?.username}</p>
    </Link>
  );
}
