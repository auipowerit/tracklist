import { useEffect, useRef, useState } from "react";
import { isEmailValid } from "src/utils/form";
import Modal from "src/features/shared/components/Modal";
import Alert from "src/features/shared/components/Alert";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import SuccessMessage from "src/features/shared/components/SuccessMessage";
import AuthInput from "../inputs/AuthInput";
import { useAuthContext } from "../../context/AuthContext";

export default function ResetPasswordButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    return () => {
      setSuccess(false);
    };
  }, [isModalOpen]);

  return (
    <div>
      {success ? (
        <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
          <SuccessMessage
            message="Reset email sent!"
            link="Go to login"
            icon={faArrowRight}
            onClick={() => setIsModalOpen(false)}
          />
        </Modal>
      ) : (
        <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
          <ResetPasswordForm
            isModalOpen={isModalOpen}
            setSuccess={setSuccess}
          />
        </Modal>
      )}

      <div className="reset-password-container">
        <p>Forgot password?</p>
        <p onClick={() => setIsModalOpen(true)} className="reset-password-link">
          Click here
        </p>
      </div>
    </div>
  );
}

function ResetPasswordForm({ isModalOpen, setSuccess }) {
  const { checkIfEmailExists, resetPassword } = useAuthContext();

  const [error, setError] = useState("");
  const formRef = useRef(null);

  useEffect(() => {
    handleModal();
  }, [isModalOpen]);

  function handleModal() {
    if (isModalOpen) resetValues();
  }

  function resetValues() {
    setError("");
    formRef.current?.reset();
    formRef.current.elements["email"].classList.remove("invalid-field");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const email = formRef.current.elements["email"];

    if (!isEmailValid(email.value)) {
      setError("Please enter a valid email.");
      email.classList.add("invalid-field");
      return;
    }

    if (!(await checkIfEmailExists(email.value))) {
      setError("This email does not exist.");
      email.classList.add("invalid-field");
      return;
    }

    await resetPassword(email.value);
    resetValues();
    setSuccess(true);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="auth-form">
      <h1 className="form-header">Reset your password</h1>

      <AuthInput label="Email" name="email" type="email" />

      <Alert message={error} />
      <button type="submit" className="form-submit-button">
        Submit
      </button>
    </form>
  );
}
