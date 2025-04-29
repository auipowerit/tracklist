import { useRef, useState } from "react";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import AuthInput from "../inputs/AuthInput";
import Alert from "src/features/shared/components/Alert";
import { checkEmptyForm, isEmailValid, isPasswordValid } from "src/utils/form";

export default function Signup({ setIsRegistration }) {
  const { signup, usernameAvailable } = useAuthContext();

  const [error, setError] = useState("");
  const formRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();

    const email = formRef.current.elements["email"];
    const password = formRef.current.elements["password"];
    const displayname = formRef.current.elements["displayname"];
    const username = formRef.current.elements["username"];

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

    if (!(await usernameAvailable(username.value))) {
      setError("This username is unavailable.");
      username.classList.add("invalid-field");
      return;
    }

    if (
      await signup(
        email.value,
        password.value,
        displayname.value,
        username.value,
        setError,
      )
    ) {
      resetForm();
    }
  }

  function resetForm() {
    setIsRegistration(false);
    formRef.current?.reset();
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="auth-form">
      <AuthInput label="Display Name" name="displayname" type="text" />
      <AuthInput label="Username" name="username" type="text" />
      <AuthInput label="Email" name="email" type="text" />
      <AuthInput label="Password" name="password" type="password" />

      <Alert message={error} />
      <button type="submit" className="form-submit-button">
        Submit
      </button>
      <button
        onClick={() => setIsRegistration(false)}
        className="basic-button auth-button"
      >
        <p>Sign in</p>
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </form>
  );
}
