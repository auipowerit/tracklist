import { useNavigate } from "react-router-dom";
import { faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../Modal";
import ReviewForm from "../Review/ReviewForm";
import { Tooltip } from "react-tooltip";

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
          className="cursor-pointer transition-all duration-300 hover:text-gray-400"
          data-tooltip-id="review-tooltip"
          data-tooltip-content="Review"
        >
          <FontAwesomeIcon icon={faPencil} />
          <Tooltip id="review-tooltip" place="top" type="dark" effect="float" />
        </button>
      ) : (
        <button
          className="flex cursor-pointer items-center gap-1 rounded-md border-2 border-white px-2 py-1 text-lg hover:text-gray-400"
          data-modal-target="default-modal"
          data-modal-toggle="default-modal"
          onClick={handleClick}
        >
          <FontAwesomeIcon icon={faPlus} />
          <p>Post</p>
        </button>
      )}
    </div>
  );
}
