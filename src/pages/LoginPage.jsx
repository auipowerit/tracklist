import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import LoginInput from "../components/Inputs/LoginInput";
import { useAuthContext } from "../context/Auth/AuthContext";

export default function LoginPage() {
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
      resetForm();
    } else {
      console.log("failed to signup.");
    }
  }

  async function handleLogin(email, password) {
    if (await login(email, password)) {
      navigate("/");
      resetForm();
    } else {
      console.log("failed to login.");
    }
  }

  function resetForm() {
    setIsRegistration(false);
    formRef.current?.reset();
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
            <LoginInput label="First Name" name="firstname" type="text" />
            <LoginInput label="Last Name" name="lastname" type="text" />
            <LoginInput label="Username" name="username" type="text" />
          </>
        )}

        <LoginInput label="Email Address" name="email" type="text" />
        <LoginInput label="Password" name="password" type="password" />

        <button
          type="submit"
          className="m-auto self-start rounded-md bg-green-700 px-5 py-2"
        >
          Submit
        </button>
      </form>

      <button
        onClick={() => setIsRegistration(!isRegistration)}
        className="rounded-md px-4 py-2 hover:bg-green-700"
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
