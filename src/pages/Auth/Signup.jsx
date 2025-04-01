import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import AuthInput from "src/components/Inputs/AuthInput";
import { useAuthContext } from "src/context/Auth/AuthContext";

export default function Signup({ setIsRegistration }) {
  const { signup, usernameAvailable } = useAuthContext();

  const formRef = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(formRef.current);
    const email = formData.get("email");
    const password = formData.get("password");
    const firstname = formData.get("firstname");
    const lastname = formData.get("lastname");
    const username = formData.get("username");

    if (!(await usernameAvailable(username))) {
      console.log("Username taken!");
      return;
    }

    if (await signup(email, password, firstname, lastname, username)) {
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
    <div className="flex flex-col items-center justify-evenly gap-6 p-4 align-middle text-2xl">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <AuthInput label="First Name" name="firstname" type="text" />
        <AuthInput label="Last Name" name="lastname" type="text" />
        <AuthInput label="Username" name="username" type="text" />
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
        onClick={() => setIsRegistration(false)}
        className="flex items-center gap-2 rounded-md px-4 py-2 hover:bg-green-700"
      >
        <p>Sign in</p>
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </div>
  );
}
