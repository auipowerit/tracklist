import { useRef, useState } from "react";
import Alert from "src/features/shared/components/alerts/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Button from "src/features/shared/components/buttons/Button";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { checkEmptyForm, isEmailValid, isPasswordValid } from "src/utils/form";
import AuthInput from "../inputs/AuthInput";

export default function Signup({ setIsRegistration }) {
  const { signup, usernameAvailable } = useAuthContext();

  const [error, setError] = useState("");
  const formRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(formRef.current);

    const displayname = formData.get("displayname");
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const repassword = formData.get("repassword");

    if (!(await validateData(email, password, repassword, username))) {
      return;
    }

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

  async function validateData(email, password, repassword, username) {
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
    <section className="auth--container">
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
        <Button type="submit" classes="form__submit" ariaLabel="sign up">
          Submit
        </Button>
      </form>
      <div className="auth__button--wrapper">
        <p>Already have an account with us?</p>
        <Button
          onClick={() => setIsRegistration(false)}
          classes="forward-button auth__button auth__button--after"
          ariaLabel="go to log in"
        >
          <p>Log in</p>
          <FontAwesomeIcon icon={faArrowRight} className="button-after" />
        </Button>
      </div>
    </section>
  );
}
