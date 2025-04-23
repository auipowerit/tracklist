import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";
import Modal from "src/components/Modal";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ShareForm from "../ShareForm";
import "src/styles/components/buttons.scss";

export default function ShareButton(props) {
  const { isModalOpen, setIsModalOpen, mediaId, category } = props;

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
        <ShareForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          mediaId={mediaId}
          category={category}
        />
      </Modal>

      <button
        onClick={handleClick}        
        data-tooltip-id="share-tooltip"
        data-tooltip-content="Share"
        className="share-btn"
      >
        <FontAwesomeIcon icon={faShare} />
        <Tooltip id="share-tooltip" place="top" type="dark" effect="float" />
      </button>
    </div>
  );
}
