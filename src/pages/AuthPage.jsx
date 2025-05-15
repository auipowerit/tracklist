import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "src/features/shared/components/Loading";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import Login from "src/features/auth/components/forms/Login";
import Signup from "src/features/auth/components/forms/Signup";
import "./styles/auth.scss";

export default function AuthPage() {
  const navigate = useNavigate();

  const { globalUser, isLoading } = useAuthContext();
  const [isRegistration, setIsRegistration] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    handleUser();
  }, [globalUser, isLoading]);

  function handleUser() {
    if (globalUser) {
      navigate(`/users/${globalUser.username}/profile`, { replace: true });
    }
  }

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
