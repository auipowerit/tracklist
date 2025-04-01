import { useNavigate } from "react-router-dom";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../Modal";
import { useAuthContext } from "src/context/Auth/AuthContext";
import ReviewForm from "../Review/ReviewForm";

export default function PostButton({
  isModalOpen,
  setIsModalOpen,
  mediaId,
  category,
}) {
  const { globalUser } = useAuthContext();

  const navigate = useNavigate();

  function handleClick() {
    if (!globalUser) {
      navigate("/account/authenticate");
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

      <button
        className="flex cursor-pointer items-center gap-1 rounded-md bg-green-700 px-2 py-1 hover:text-gray-400"
        data-modal-target="default-modal"
        data-modal-toggle="default-modal"
        onClick={handleClick}
      >
        <FontAwesomeIcon icon={faPlus} />
        <p>Post</p>
      </button>
    </div>
  );
}
