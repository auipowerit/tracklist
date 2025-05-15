import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import Loading from "src/features/shared/components/Loading";
import AccountNav from "src/features/user/components/nav/AccountNav";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import AccountMobileNav from "src/features/user/components/nav/AccountMobileNav";
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
    <section className="account">
      <AccountNav user={user} setUser={setUser} canEdit={canEdit} />
      <AccountMobileNav user={user} setUser={setUser} canEdit={canEdit} />

      <Outlet context={{ user, canEdit }} />
    </section>
  );
}
