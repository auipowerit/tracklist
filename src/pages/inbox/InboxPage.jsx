import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InboxList from "src/features/inbox/components/lists/InboxList";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import MobileBanner from "src/features/shared/components/banner/MobileBanner";
import "./inbox.scss";

export default function InboxPage() {
  const { loadingUser, globalUser } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = () => {
      if (loadingUser) return;

      if (!globalUser) {
        navigate("/authenticate");
        return;
      }
    };

    checkUser();
  }, [loadingUser, globalUser]);

  return (
    <section className="inbox">
      <MobileBanner title={"Notifications"} />
      <Header />
      <InboxList />
    </section>
  );
}

function Header() {
  return (
    <div className="inbox__header">
      <h1>Notifications</h1>
    </div>
  );
}
