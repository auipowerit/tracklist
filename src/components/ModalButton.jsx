import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "../context/Auth/AuthContext";
import Modal from "./Modal";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ReviewForm from "./Reviews/ReviewForm";
import ReviewProvider from "../context/Review/ReviewProvider";

export default function ModalButton() {
  const { isModalOpen, setIsModalOpen } = useAuthContext();

  return (
    <div>
      <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ReviewProvider>
          <ReviewForm onClose={() => setIsModalOpen(false)} />
        </ReviewProvider>
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
