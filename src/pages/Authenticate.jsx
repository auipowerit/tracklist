import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import AuthInput from "../components/AuthInput";
import { useAuthContext } from "../context/Auth/AuthContext";

export default function Authenticate() {
  const { signup, usernameAvailable, login } = useAuthContext();
  const [isRegistration, setIsRegistration] = useState(false);
  const formRef = useRef(null);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(formRef.current);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) return;

    try {
      if (isRegistration) {
        await handleSignup(formData, email, password);
      } else {
        await handleLogin(email, password);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSignup(formData, email, password) {
    const firstname = formData.get("firstname");
    const lastname = formData.get("lastname");
    const username = formData.get("username");

    if (!(await usernameAvailable(username))) {
      console.log("Username taken!");
      return;
    }

    if (await signup(email, password, firstname, lastname, username)) {
      console.log("Signed up!");
    } else {
      console.log("failed to signup.");
    }
  }

  async function handleLogin(email, password) {
    if (await login(email, password)) {
      navigate("/");
    } else {
      console.log("failed to login.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-evenly gap-6 p-4 align-middle text-2xl">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        {isRegistration && (
          <>
            <AuthInput label="First Name" name="firstname" type="text" />
            <AuthInput label="Last Name" name="lastname" type="text" />
            <AuthInput label="Username" name="username" type="text" />
          </>
        )}

        <AuthInput label="Email Address" name="email" type="text" />
        <AuthInput label="Password" name="password" type="password" />

        <button
          type="submit"
          className="m-auto self-start rounded-md bg-green-900 px-5 py-2"
        >
          Submit
        </button>
      </form>

      <button
        onClick={() => setIsRegistration(!isRegistration)}
        className="rounded-md px-4 py-2 hover:bg-green-900"
      >
        {isRegistration ? (
          <p className="flex items-center gap-2">
            Sign in
            <FontAwesomeIcon icon={faArrowRight} />
          </p>
        ) : (
          <p className="flex items-center gap-2">
            <FontAwesomeIcon icon={faArrowLeft} />
            Sign up
          </p>
        )}
      </button>
    </div>
  );
}
