import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "src/features/shared/components/modal/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "src/features/shared/components/buttons/Button";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import SuccessAlert from "src/features/shared/components/alerts/SuccessAlert";
import {
  faArrowRight,
  faPenToSquare,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import ReviewForm from "../forms/ReviewForm";
import "./review-buttons.scss";

export default function AddReviewButton(props) {
  const {
    isModalOpen,
    setIsModalOpen,
    showIcon = false,
    mediaId,
    category,
  } = props;

  const [success, setSuccess] = useState(false);

  const { globalUser } = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    return () => setSuccess(false);
  }, [isModalOpen]);

  const handleClick = () => {
    if (!globalUser) {
      navigate("/authenticate");
      return;
    }

    setIsModalOpen(true);
  };

  const handleSuccessClick = () => {
    navigate("/home");
    setIsModalOpen(false);
  };

  return (
    <div>
      <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        {success ? (
          <SuccessAlert
            message={"Review submitted!"}
            link={"Go to reviews"}
            icon={faArrowRight}
            onClick={handleSuccessClick}
          />
        ) : (
          <ReviewForm
            isModalOpen={isModalOpen}
            mediaId={mediaId}
            category={category}
            setSuccess={setSuccess}
          />
        )}
      </Modal>

      {showIcon ? (
        <ReviewButtonIcon handleClick={handleClick} />
      ) : (
        <ReviewButtonText handleClick={handleClick} />
      )}
    </div>
  );
}

function ReviewButtonIcon({ handleClick }) {
  return (
    <Button
      onClick={handleClick}
      classes="review-button"
      ariaLabel="add review"
    >
      <FontAwesomeIcon icon={faPenToSquare} />
    </Button>
  );
}

function ReviewButtonText({ handleClick }) {
  return (
    <button
      data-modal-target="default-modal"
      data-modal-toggle="default-modal"
      onClick={handleClick}
      className="add-review-button"
      aria-label="add review"
    >
      <FontAwesomeIcon icon={faPlus} />
      <p>Review</p>
    </button>
  );
}
