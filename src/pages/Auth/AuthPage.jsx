import { useEffect, useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import { useAuthContext } from "src/context/Auth/AuthContext";
import Loading from "src/components/Loading";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const { globalUser, isLoading } = useAuthContext();

  const navigate = useNavigate();

  const [isRegistration, setIsRegistration] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (globalUser) {
      navigate("/account", { replace: true });
    }
  }, [globalUser, isLoading]);

  if (isLoading) {
    return <Loading />;
  }

  return isRegistration ? (
    <Signup setIsRegistration={setIsRegistration} />
  ) : (
    <Login setIsRegistration={setIsRegistration} />
  );
}
