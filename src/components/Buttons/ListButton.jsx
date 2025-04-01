import { useNavigate } from "react-router-dom";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../Modal";
import ListForm from "../List/ListForm";

export default function ListButton(props) {
  const { isModalOpen, setIsModalOpen, media, category } = props;

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
        <ListForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          media={media}
          category={category}
        />
      </Modal>

      <button
        className="flex cursor-pointer items-center gap-1 rounded-md bg-green-700 px-2 py-1 text-lg hover:text-gray-400"
        data-modal-target="default-modal"
        data-modal-toggle="default-modal"
        onClick={handleClick}
      >
        <FontAwesomeIcon icon={faPlus} />
        <p>{media ? "Add to List" : "Create List"}</p>
      </button>
    </div>
  );
}
