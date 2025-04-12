import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "src/components/Loading";
import { useAuthContext } from "src/context/Auth/AuthContext";
import Login from "./Login";
import Signup from "./Signup";

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
