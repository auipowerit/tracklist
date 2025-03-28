import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

export default function AuthPage() {
  const [isRegistration, setIsRegistration] = useState(false);

  return isRegistration ? (
    <Signup setIsRegistration={setIsRegistration} />
  ) : (
    <Login setIsRegistration={setIsRegistration} />
  );
}
