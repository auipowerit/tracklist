import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import SuccessMessage from "src/features/shared/components/SuccessMessage";
import {
  faArrowRight,
  faPenToSquare,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import ReviewForm from "../forms/ReviewForm";
import Modal from "src/features/shared/components/Modal";
import "./review-buttons.scss";

export default function AddReviewButton(props) {
  const {
    isModalOpen,
    setIsModalOpen,
    showIcon = false,
    mediaId,
    category,
  } = props;

  const { globalUser } = useAuthContext();
  const navigate = useNavigate();

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    return () => {
      setSuccess(false);
    };
  }, [isModalOpen]);

  function handleClick() {
    if (!globalUser) {
      navigate("/authenticate");
      return;
    }
    setIsModalOpen(true);
  }

  return (
    <div>
      {success ? (
        <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
          <SuccessMessage
            message={"Review submitted!"}
            link={"Go to reviews"}
            icon={faArrowRight}
            onClick={() => navigate("/reviews")}
          />
        </Modal>
      ) : (
        <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
          <ReviewForm
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            mediaId={mediaId}
            category={category}
            setSuccess={setSuccess}
          />
        </Modal>
      )}

      {showIcon ? (
        <button onClick={handleClick} className="review-button">
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
      ) : (
        <button
          data-modal-target="default-modal"
          data-modal-toggle="default-modal"
          onClick={handleClick}
          className="add-review-button"
        >
          <FontAwesomeIcon icon={faPlus} />
          <p>Post review</p>
        </button>
      )}
    </div>
  );
}
