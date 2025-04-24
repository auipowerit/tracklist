import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";
import Modal from "src/features/shared/components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { faList, faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import ListForm from "../forms/ListForm";
import "./list-buttons.scss";

export default function ListButton(props) {
  const {
    isModalOpen,
    setIsModalOpen,
    showIcon = false,
    isAdding = false,
    list,
    media,
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
        <ListForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          media={media}
          category={category}
          list={list}
          isAdding={isAdding}
        />
      </Modal>

      {showIcon ? (
        <button
          onClick={handleClick}
          className="list-save-btn"
          data-tooltip-content="Save"
          data-tooltip-id="list-tooltip"
        >
          <FontAwesomeIcon icon={faList} />
          <Tooltip id="list-tooltip" place="top" type="dark" effect="float" />
        </button>
      ) : (
        <button
          className="list-btn"
          data-modal-target="default-modal"
          data-modal-toggle="default-modal"
          onClick={handleClick}
        >
          <FontAwesomeIcon icon={isAdding ? faPlus : list ? faPen : faPlus} />
          <p>
            {isAdding ? "Add items" : list ? "List details" : "Create list"}
          </p>
        </button>
      )}
    </div>
  );
}
