import { useEffect, useRef, useState } from "react";
import { isEmailValid } from "src/utils/form";
import Alert from "src/features/shared/components/Alert";
import { useAuthContext } from "../../context/AuthContext";

export default function PasswordReset({ isModalOpen, setSuccess }) {
  const { checkIfEmailExists, resetPassword } = useAuthContext();

  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    handleModal();
  }, [isModalOpen]);

  function handleModal() {
    if (isModalOpen) resetValues();
  }

  function resetValues() {
    setError("");
    inputRef.current.value = "";
    inputRef.current.classList.remove("invalid-field");
  }

  function handleChange(e) {
    e.target.classList.remove("invalid-field");
  }

  async function handleSubmit() {
    if (!(await validateData())) return;

    const email = inputRef.current.value;

    await resetPassword(email);
    resetValues();
    setSuccess(true);
  }

  async function validateData() {
    const email = inputRef.current;

    if (!email.value) {
      setError("Please enter an email.");
      email.classList.add("invalid-field");
      return false;
    }

    if (!isEmailValid(email.value)) {
      setError("Please enter a valid email.");
      email.classList.add("invalid-field");
      return false;
    }

    if (!(await checkIfEmailExists(email.value))) {
      setError("This email does not exist.");
      email.classList.add("invalid-field");
      return false;
    }

    return true;
  }

  return (
    <div className="auth-form">
      <h1 className="form-header">Reset your password</h1>

      <div className="auth-input-container">
        <label htmlFor="reset-email">Email</label>
        <input
          ref={inputRef}
          className="auth-input"
          name="reset-email"
          type="reset-email"
          onChange={handleChange}
        />
      </div>

      <Alert message={error} />
      <button
        type="button"
        onClick={handleSubmit}
        className="form-submit-button"
      >
        Submit
      </button>
    </div>
  );
}
