import { useEffect, useState } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import Loading from "src/features/shared/components/Loading";
import ChatButton from "src/features/chat/components/ChatButton";
import NavLinks from "src/features/user/components/nav/NavLinks";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import LogoutButton from "src/features/user/components/buttons/LogoutButton";
import "./styles/account.scss";

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
    <div className="account-page-container">
      <div className="account-page-nav">
        <Profile user={user} />
        <NavLinks username={user.username} />
        {canEdit ? <LogoutButton /> : <ChatButton username={user.username} />}
      </div>

      <div className="account-page-outlet">
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
      className={`account-nav-profile-link ${isHomePage && "active"}`}
    >
      <img src={user.profileUrl} />
      <p>{user.username}</p>
    </Link>
  );
}
