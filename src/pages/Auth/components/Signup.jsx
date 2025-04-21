import { useRef } from "react";
import AuthInput from "src/components/Inputs/AuthInput";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

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
    <div className="signup-container">
      <form ref={formRef} onSubmit={handleSubmit} className="signup-form">
        <AuthInput label="Display Name" name="displayname" type="text" />
        <AuthInput label="Username" name="username" type="text" />
        <AuthInput label="Email Address" name="email" type="text" />
        <AuthInput label="Password" name="password" type="password" />

        <button type="submit" className="signup-submit-btn">
          Submit
        </button>
      </form>

      <button
        onClick={() => setIsRegistration(false)}
        className="flex items-center gap-2 rounded-md px-4 py-2 hover:bg-green-700"
      >
        <p>Sign in</p>
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </div>
  );
}
