import { useRef, useState } from "react";
import Alert from "src/features/shared/components/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { checkEmptyForm, isEmailValid, isPasswordValid } from "src/utils/form";
import AuthInput from "../inputs/AuthInput";

export default function Signup({ setIsRegistration }) {
  const { signup, usernameAvailable } = useAuthContext();

  const [error, setError] = useState("");
  const formRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!(await validateData())) return;

    const email = formRef.current.elements["email"].value;
    const password = formRef.current.elements["password"].value;
    const displayname = formRef.current.elements["displayname"].value;
    const username = formRef.current.elements["username"].value;

    if (
      await signup(
        email,
        password,
        displayname,
        username.toLowerCase(),
        setError,
      )
    ) {
      resetForm();
    }
  }

  async function validateData() {
    const email = formRef.current.elements["email"];
    const password = formRef.current.elements["password"];
    const repassword = formRef.current.elements["repassword"];
    const username = formRef.current.elements["username"];

    if (checkEmptyForm(formRef)) {
      setError("Please fill out all fields.");
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

    if (repassword.value !== password.value) {
      setError("Passwords do not match.");
      repassword.classList.add("form__input--invalid");
      return false;
    }

    if (!(await usernameAvailable(username.value))) {
      setError("This username is unavailable.");
      username.classList.add("form__input--invalid");
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
        Sign up for <span className="auth__header--highlight">TrackList</span>
      </h1>

      <form ref={formRef} onSubmit={handleSubmit} className="auth__form">
        <AuthInput label="Display Name" name="displayname" type="text" />
        <AuthInput label="Username" name="username" type="text" />
        <AuthInput label="Email" name="email" type="text" />
        <AuthInput label="Password" name="password" type="password" />
        <AuthInput
          label="Re-enter Password"
          name="repassword"
          type="repassword"
        />

        <Alert message={error} />
        <button type="submit" className="form__submit">
          Submit
        </button>
      </form>
      <div className="auth__button--wrapper">
        <p>Already have an account with us?</p>
        <button
          onClick={() => setIsRegistration(false)}
          className="forward-button auth__button auth__button--after"
        >
          <p>Log in</p>
          <FontAwesomeIcon icon={faArrowRight} className="button-after" />
        </button>
      </div>
    </div>
  );
}
