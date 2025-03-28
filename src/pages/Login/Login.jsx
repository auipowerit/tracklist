import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthInput from "../../components/Inputs/AuthInput";
import { useAuthContext } from "../../context/Auth/AuthContext";

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
    <div className="flex flex-col items-center justify-evenly gap-6 p-4 align-middle text-2xl">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <AuthInput label="Email Address" name="email" type="text" />
        <AuthInput label="Password" name="password" type="password" />

        <button
          type="submit"
          className="m-auto self-start rounded-md bg-green-700 px-5 py-2"
        >
          Submit
        </button>
      </form>

      <button
        onClick={() => setIsRegistration(true)}
        className="flex items-center gap-2 rounded-md px-4 py-2 transition-all hover:bg-green-700"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        <p>Sign up</p>
      </button>
    </div>
  );
}
