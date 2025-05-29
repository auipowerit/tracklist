import { useEffect, useState } from "react";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import Modal from "src/features/shared/components/modal/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Button from "src/features/shared/components/buttons/Button";
import SuccessAlert from "src/features/shared/components/alerts/SuccessAlert";
import GoogleSignup from "../forms/GoogleSignup";

export default function GoogleSignupButton() {
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
          <SuccessAlert
            message="Signup successful!"
            link="Go to home"
            icon={faArrowRight}
            onClick={() => {
              setIsModalOpen(false);
              window.location.reload();
            }}
          />
        </Modal>
      ) : (
        <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
          <GoogleSignup isModalOpen={isModalOpen} setSuccess={setSuccess} />
        </Modal>
      )}

      <Button
        onClick={() => setIsModalOpen(true)}
        classes="auth__google"
        ariaLabel="google signup"
      >
        <FontAwesomeIcon icon={faGoogle} className="auth__google--icon" />
        <p>Sign up with Google</p>
      </Button>
    </div>
  );
}
