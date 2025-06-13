import { useEffect, useRef, useState } from "react";
import { isEmailValid } from "src/utils/form";
import Alert from "src/features/shared/components/alerts/Alert";
import Button from "src/features/shared/components/buttons/Button";
import { useAuthContext } from "../../context/AuthContext";

export default function PasswordReset({ isModalOpen, setSuccess }) {
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const { checkIfEmailExists, resetPassword } = useAuthContext();

  useEffect(() => {
    if (isModalOpen) {
      resetValues();
    }
  }, [isModalOpen]);

  const resetValues = async () => {
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

    const email = inputRef.current.value;
    await resetPassword(email);

    resetValues();
    setSuccess(true);
  };

  const validateData = async () => {
    const email = inputRef.current;

    if (!email.value) {
      setError("Please enter an email.");
      email.classList.add("form__input--invalid");
      return false;
    }

    if (!isEmailValid(email.value)) {
      setError("Please enter a valid email.");
      email.classList.add("form__input--invalid");
      return false;
    }

    if (!(await checkIfEmailExists(email.value))) {
      setError("This email does not exist.");
      email.classList.add("form__input--invalid");
      return false;
    }

    return true;
  };

  return (
    <div className="auth--container auth--container--reset">
      <h1 className="form__header">Reset your password</h1>

      <div className="auth__input--wrapper">
        <label htmlFor="reset-email">Email</label>
        <input
          ref={inputRef}
          className="auth__input"
          name="reset-email"
          type="email"
          onChange={handleChange}
        />
      </div>

      <Alert message={error} />
      <Button
        onClick={handleSubmit}
        classes="form__submit"
        ariaLabel="reset password"
      >
        Submit
      </Button>
    </div>
  );
}
