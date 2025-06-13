import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "src/features/shared/components/Loading";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import Login from "src/features/auth/components/forms/Login";
import Signup from "src/features/auth/components/forms/Signup";
import "./auth.scss";

export default function AuthPage() {
  const [isRegistration, setIsRegistration] = useState(false);

  const { globalUser, isLoading } = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (globalUser) {
      navigate(`/users/${globalUser.username}/profile`, { replace: true });
    }

    return () => setIsRegistration(false);
  }, [globalUser, isLoading]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <section className="auth">
      {isRegistration ? (
        <Signup setIsRegistration={setIsRegistration} />
      ) : (
        <Login setIsRegistration={setIsRegistration} />
      )}
    </section>
  );
}
