import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isEmailValid } from "src/utils/form";
import Alert from "src/features/shared/components/alerts/Alert";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "src/features/shared/components/buttons/Button";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import AuthInput from "../inputs/AuthInput";
import GoogleLoginButton from "../buttons/GoogleLoginButton";
import ForgotPasswordButton from "../buttons/ForgotPasswordButton";

export default function Login({ setIsRegistration }) {
  const { login, getUserByEmail, getUserByUsername } = useAuthContext();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const formRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(formRef.current);

    const username = formData.get("username");
    const password = formData.get("password");

    if (!validateData(username, password)) return;

    const user = await getUser();
    if (!user) return;

    if (await login(user, password, setError)) {
      navigate("/home");
      resetForm();
    }
  }

  function validateData() {
    const username = formRef.current.elements.username;
    const password = formRef.current.elements.password;

    if (username.value === "") {
      setError("Please enter a username or email.");
      username.classList.add("form__input--invalid");
      return false;
    }

    if (password.value === "") {
      setError("Please enter a password.");
      password.classList.add("form__input--invalid");
      return false;
    }

    return true;
  }

  async function getUser() {
    const username = formRef.current.elements.username;

    // If input is an email
    if (username.value.includes("@")) {
      // Validate email format
      if (!isEmailValid(username.value)) {
        setError("Please enter a valid email address.");
        username.classList.add("form__input--invalid");
        return null;
      }

      const user = await getUserByEmail(username.value);

      // If no user with that email exists, set error
      if (!user) {
        setError("Email not found.");
        username.classList.add("form__input--invalid");
        return null;
      }

      // If user exists, return the user's email
      return user.email;
    }

    const user = await getUserByUsername(username.value);

    // If no user with that username exists, set error
    if (!user) {
      setError("Username not found.");
      username.classList.add("form__input--invalid");
      return null;
    }

    // If user exists, return the user's email
    return user.email;
  }

  function resetForm() {
    setIsRegistration(false);
    formRef.current?.reset();
  }

  return (
    <section className="auth--container">
      <h1 className="auth__header">
        Log into <span className="auth__header--highlight">TrackList</span>
      </h1>

      <form ref={formRef} onSubmit={handleSubmit} className="auth__form">
        <AuthInput label="Username or Email" name="username" type="text" />
        <AuthInput label="Password" name="password" type="password" />

        <ForgotPasswordButton />

        <Alert message={error} />
        <Button type="submit" classes="form__submit" ariaLabel="log in">
          Submit
        </Button>
      </form>

      <GoogleLoginButton setError={setError} />

      <GoToSignup setIsRegistration={setIsRegistration} />
    </section>
  );
}

function GoToSignup({ setIsRegistration }) {
  return (
    <div className="auth__button--wrapper">
      <p>Don't have an account with us?</p>
      <Button
        onClick={() => setIsRegistration(true)}
        classes="back-button auth__button auth__button--before"
        ariaLabel="go to sign up"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="button-before" />
        <p>Sign up</p>
      </Button>
    </div>
  );
}
