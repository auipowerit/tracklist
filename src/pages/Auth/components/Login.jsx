import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthInput from "./AuthInput";

export default function Login({ setIsRegistration }) {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const formRef = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(formRef.current);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) return;

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
    <div className="login-container">
      <form ref={formRef} onSubmit={handleSubmit} className="login-form">
        <AuthInput label="Email Address" name="email" type="text" />
        <AuthInput label="Password" name="password" type="password" />

        <button type="submit" className="login-submit-btn">
          Submit
        </button>
      </form>

      <button
        type="button"
        onClick={() => setIsRegistration(true)}
        className="login-signup-btn"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        <p>Sign up</p>
      </button>
    </div>
  );
}
