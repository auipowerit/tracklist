import { useNavigate } from "react-router-dom";
import { faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../Modal";
import ListForm from "../List/ListForm";

export default function ListButton(props) {
  const { isModalOpen, setIsModalOpen, list, media, category } = props;

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
        <ListForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          media={media}
          category={category}
          list={list}
        />
      </Modal>

      <button
        className="flex cursor-pointer items-center gap-2 rounded-md border-2 border-white px-2 py-1 text-lg hover:text-gray-400"
        data-modal-target="default-modal"
        data-modal-toggle="default-modal"
        onClick={handleClick}
      >
        <FontAwesomeIcon icon={list ? faPen : faPlus} />
        <p>{media ? "Add to List" : list ? "Edit" : "Create List"}</p>
      </button>
    </div>
  );
}
