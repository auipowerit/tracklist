import { useNavigate } from "react-router-dom";
import { faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../Modal";
import ReviewForm from "../Review/ReviewForm";
import { Tooltip } from "react-tooltip";
import "src/styles/components/buttons.scss";

export default function ReviewButton(props) {
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
    <div className="review-btn">
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
        >
          <FontAwesomeIcon icon={faPencil} />
          <Tooltip id="review-tooltip" place="top" type="dark" effect="float" />
        </button>
      ) : (
        <button
          data-modal-target="default-modal"
          data-modal-toggle="default-modal"
          onClick={handleClick}
        >
          <FontAwesomeIcon icon={faPlus} />
          <p>Post review</p>
        </button>
      )}
    </div>
  );
}
