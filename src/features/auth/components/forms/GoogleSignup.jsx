import { useEffect, useRef, useState } from "react";
import Alert from "src/features/shared/components/alerts/Alert";
import Button from "src/features/shared/components/buttons/Button";
import { useAuthContext } from "../../context/AuthContext";

export default function GoogleSignup({ isModalOpen, setSuccess }) {
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const { usernameAvailable, loginWithGoogle } = useAuthContext();

  useEffect(() => {
    if (isModalOpen) {
      resetValues();
    }
  }, [isModalOpen]);

  const resetValues = () => {
    setError("");
    inputRef.current.value = "";
    inputRef.current.classList.remove("form__input--invalid");
  };

  const handleChange = (e) => {
    e.target.classList.remove("form__input--invalid");
  };

  const handleSubmit = async () => {
    const isValid = await validateData();
    if (!isValid) return;

    const username = inputRef.current.value;

    if (await loginWithGoogle(setError, username)) {
      resetValues();
      setSuccess(true);
    }
  };

  const validateData = async () => {
    const username = inputRef.current;

    if (!username.value) {
      setError("Please enter a username.");
      username.classList.add("form__input--invalid");
      return false;
    }

    if (username.value.length < 6) {
      setError("Username must be at least 6 characters long.");
      username.classList.add("form__input--invalid");
      return false;
    }

    if (username.value.length > 15) {
      setError("Username cannot be longer than 15 characters.");
      username.classList.add("form__input--invalid");
      return false;
    }

    if (!(await usernameAvailable(username.value))) {
      setError("This username is already taken.");
      username.classList.add("form__input--invalid");
      return false;
    }

    return true;
  };

  return (
    <div className="auth--container auth--container--reset">
      <h1 className="form__header">Sign up with Google</h1>

      <div className="auth__input--wrapper">
        <label htmlFor="google-username">Username</label>
        <input
          ref={inputRef}
          className="auth__input"
          name="google-username"
          type="text"
          onChange={handleChange}
        />
      </div>

      <Alert message={error} />
      <Button
        onClick={handleSubmit}
        classes="form__submit"
        ariaLabel="sign up with google"
      >
        Submit
      </Button>
    </div>
  );
}
