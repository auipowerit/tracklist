import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "src/features/shared/components/Alert";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { checkEmptyForm, isEmailValid, isPasswordValid } from "src/utils/form";
import AuthInput from "../inputs/AuthInput";
import ResetPasswordButton from "../buttons/ResetPasswordButton";

export default function Login({ setIsRegistration }) {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const formRef = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const email = formRef.current.elements["email"];
    const password = formRef.current.elements["password"];

    if (checkEmptyForm(formRef)) {
      setError("Please fill out all fields.");
      return;
    }

    if (!isEmailValid(email.value)) {
      setError("Please enter a valid email.");
      email.classList.add("invalid-field");
      return;
    }

    if (!isPasswordValid(password.value)) {
      setError("Password must be at least 8 characters long.");
      password.classList.add("invalid-field");
      return;
    }

    if (await login(email.value, password.value, setError)) {
      navigate("/");
      resetForm();
    }
  }

  function resetForm() {
    setIsRegistration(false);
    formRef.current?.reset();
  }

  return (
    <div className="auth-container">
      <form ref={formRef} onSubmit={handleSubmit} className="auth-form">
        <AuthInput label="Email" name="email" type="text" />
        <AuthInput label="Password" name="password" type="password" />

        <Alert message={error} />
        <button type="submit" className="form-submit-button">
          Submit
        </button>

        <button
          type="button"
          onClick={() => setIsRegistration(true)}
          className="basic-button auth-button"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <p>Sign up</p>
        </button>
      </form>

      <ResetPasswordButton />
    </div>
  );
}
