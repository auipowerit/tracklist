import { useRef } from "react";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import AuthInput from "./AuthInput";

export default function Signup({ setIsRegistration }) {
  const { signup, usernameAvailable } = useAuthContext();

  const formRef = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(formRef.current);
    const email = formData.get("email");
    const password = formData.get("password");
    const displayname = formData.get("displayname");
    const username = formData.get("username");

    if (!(await usernameAvailable(username))) {
      console.log("Username taken!");
      return;
    }

    if (await signup(email, password, displayname, username)) {
      resetForm();
    } else {
      console.log("Failed to signup.");
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
      <AuthInput label="Email Address" name="email" type="text" />
      <AuthInput label="Password" name="password" type="password" />

      <button type="submit" className="form-submit-btn">
        Submit
      </button>
      <button onClick={() => setIsRegistration(false)} className="basic-button">
        <p>Sign in</p>
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </form>
  );
}
