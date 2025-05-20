import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isEmailValid, isPasswordValid } from "src/utils/form";
import Alert from "src/features/shared/components/alerts/Alert";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "src/features/shared/components/buttons/Button";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import AuthInput from "../inputs/AuthInput";
import ForgotPasswordButton from "../buttons/ForgotPasswordButton";

export default function Login({ setIsRegistration }) {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const formRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(formRef.current);

    const email = formData.get("email");
    const password = formData.get("password");

    if (!validateData(email, password)) return;

    if (await login(email, password, setError)) {
      navigate("/");
      resetForm();
    }
  }

  function validateData() {
    const email = formRef.current.elements.email;
    const password = formRef.current.elements.password;

    if (email.value === "") {
      setError("Please enter an email.");
      email.classList.add("form__input--invalid");
      return false;
    }

    if (password.value === "") {
      setError("Please enter a password.");
      password.classList.add("form__input--invalid");
      return false;
    }

    if (!isEmailValid(email.value)) {
      setError("Please enter a valid email.");
      email.classList.add("form__input--invalid");
      return false;
    }

    if (!isPasswordValid(password.value)) {
      setError("Password must be at least 8 characters long.");
      password.classList.add("form__input--invalid");
      return false;
    }

    return true;
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
        <AuthInput label="Email" name="email" type="text" />
        <AuthInput label="Password" name="password" type="password" />

        <ForgotPasswordButton />

        <Alert message={error} />
        <Button type="submit" classes="form__submit" ariaLabel="log in">
          Submit
        </Button>
      </form>

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
    </section>
  );
}
