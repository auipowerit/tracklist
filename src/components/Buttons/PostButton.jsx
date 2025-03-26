import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../Modal";
import ReviewForm from "../Reviews/ReviewForm";
import { useReviewContext } from "../../context/Review/ReviewContext";

export default function PostButton() {
  const { setIsModalOpen } = useReviewContext();

  return (
    <div>
      <Modal onClose={() => setIsModalOpen(false)}>
        <ReviewForm />
      </Modal>

      <button
        className="flex cursor-pointer items-center gap-1 rounded-md bg-green-900 px-2 py-1 hover:text-gray-400"
        data-modal-target="default-modal"
        data-modal-toggle="default-modal"
        onClick={() => setIsModalOpen(true)}
      >
        <FontAwesomeIcon icon={faPlus} />
        <p>Post</p>
      </button>
    </div>
  );
}
