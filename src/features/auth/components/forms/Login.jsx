import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "src/features/shared/components/Alert";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { isEmailValid, isPasswordValid } from "src/utils/form";
import AuthInput from "../inputs/AuthInput";
import ForgotPasswordButton from "../buttons/ForgotPasswordButton";

export default function Login({ setIsRegistration }) {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const formRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateData()) return;

    const email = formRef.current.elements["email"].value;
    const password = formRef.current.elements["password"].value;

    if (await login(email, password, setError)) {
      navigate("/");
      resetForm();
    }
  }

  function validateData() {
    const email = formRef.current.elements["email"];
    const password = formRef.current.elements["password"];

    if (email.value === "") {
      setError("Please enter an email.");
      email.classList.add("invalid-field");
      return false;
    }

    if (password.value === "") {
      setError("Please enter a password.");
      password.classList.add("invalid-field");
      return false;
    }

    if (!isEmailValid(email.value)) {
      setError("Please enter a valid email.");
      email.classList.add("invalid-field");
      return false;
    }

    if (!isPasswordValid(password.value)) {
      setError("Password must be at least 8 characters long.");
      password.classList.add("invalid-field");
      return false;
    }

    return true;
  }

  function resetForm() {
    setIsRegistration(false);
    formRef.current?.reset();
  }

  return (
    <div className="auth--container">
      <h1 className="auth__header">
        Log into <span className="auth__header--highlight">TrackList</span>
      </h1>

      <form ref={formRef} onSubmit={handleSubmit} className="auth__form">
        <AuthInput label="Email" name="email" type="text" />
        <AuthInput label="Password" name="password" type="password" />

        <ForgotPasswordButton />

        <Alert message={error} />
        <button type="submit" className="form__submit">
          Submit
        </button>
      </form>

      <div className="auth__button--wrapper">
        <p>Don't have an account with us?</p>
        <button
          type="button"
          onClick={() => setIsRegistration(true)}
          className="back-button auth__button auth__button--before"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="button-before" />
          <p>Sign up</p>
        </button>
      </div>
    </div>
  );
}
