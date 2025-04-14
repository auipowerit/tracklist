import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useAuthContext } from "src/context/Auth/AuthContext";
import NavLinks from "./components/NavLinks";
import LogoutButton from "./components/LogoutButton";
import { useEffect, useState } from "react";
import Loading from "src/components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox, faMessage } from "@fortawesome/free-solid-svg-icons";

export default function AccountPage() {
  const navigate = useNavigate();
  const params = useParams();
  const username = params.username;

  const { getUserByUsername, loadingUser, globalUser } = useAuthContext();
  const [user, setUser] = useState(null);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setUser(null);
      setCanEdit(false);

      if (!username && loadingUser) return;

      if (!username && !globalUser) {
        navigate("/authenticate");
        return;
      }

      const fetchedUser = await getUserByUsername(
        username || globalUser?.username,
      );
      setUser(fetchedUser);

      if (fetchedUser.uid === globalUser?.uid) {
        setCanEdit(true);
      }
    };

    fetchUser();
  }, [username, loadingUser, globalUser]);

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="mx-auto my-4 flex w-full flex-col items-center gap-4">
      <div className="flex w-3/5 items-center justify-between bg-green-700/30 px-6 py-2 text-lg text-gray-400">
        <Profile user={user} />
        <NavLinks username={user.username} />
        {canEdit ? (
          <div className="flex items-center gap-4">
            <FontAwesomeIcon
              icon={faInbox}
              className="cursor-pointer text-gray-400 hover:text-white"
            />
            <LogoutButton />
          </div>
        ) : (
          <FontAwesomeIcon
            icon={faMessage}
            className="cursor-pointer text-gray-400 hover:text-white"
          />
        )}
      </div>

      <div className="m-auto my-6 w-3/5">
        <Outlet context={{ user, canEdit }} />
      </div>
    </div>
  );
}

function Profile({ user }) {
  const location = useLocation();

  const isHomePage =
    location.pathname === "/profile" ||
    location.pathname === `/users/${user.username}` ||
    location.pathname === `/users/${user.username}/profile`;

  return (
    <Link
      to={`/users/${user.username}`}
      className={`flex items-center gap-2 hover:text-white ${isHomePage && "text-white"}`}
    >
      <img
        src={user.profileUrl}
        className="h-8 w-8 rounded-full object-cover"
      />
      <p>{user.username}</p>
    </Link>
  );
}
