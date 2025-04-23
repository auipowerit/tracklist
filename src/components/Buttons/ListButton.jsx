import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import Modal from "../Modal";
import ListForm from "../List/ListForm";
import "src/styles/components/buttons.scss";

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
