import { useEffect, useState } from "react";
import Modal from "src/features/shared/components/Modal";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import SuccessMessage from "src/features/shared/components/SuccessMessage";
import PasswordReset from "../forms/PasswordReset";

export default function ForgotPasswordButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("lock-scroll");
    }

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
          <PasswordReset isModalOpen={isModalOpen} setSuccess={setSuccess} />
        </Modal>
      )}

      <div className="reset-password-container">
        <p>Forgot password?</p>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="link reset-password-link"
        >
          Click here
        </button>
      </div>
    </div>
  );
}
