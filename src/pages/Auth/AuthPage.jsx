import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "src/components/Loading";
import { useAuthContext } from "src/context/Auth/AuthContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import "src/styles/pages/scss/auth.scss";

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

  return isRegistration ? (
    <Signup setIsRegistration={setIsRegistration} />
  ) : (
    <Login setIsRegistration={setIsRegistration} />
  );
}
