import { useNavigate } from "react-router-dom";
import { faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../../../shared/components/Modal";
import ReviewForm from "../forms/ReviewForm";
import { Tooltip } from "react-tooltip";
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

  function handleClick() {
    if (!globalUser) {
      navigate("/authenticate");
      return;
    }
    setIsModalOpen(true);
  }

  return (
    <div>
      <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <ReviewForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          mediaId={mediaId}
          category={category}
        />
      </Modal>

      {showIcon ? (
        <button
          onClick={handleClick}
          data-tooltip-id="review-tooltip"
          data-tooltip-content="Review"
          className="review-btn"
        >
          <FontAwesomeIcon icon={faPencil} />
          <Tooltip id="review-tooltip" place="top" type="dark" effect="float" />
        </button>
      ) : (
        <button
          data-modal-target="default-modal"
          data-modal-toggle="default-modal"
          onClick={handleClick}
          className="add-review-btn"
        >
          <FontAwesomeIcon icon={faPlus} />
          <p>Post review</p>
        </button>
      )}
    </div>
  );
}
