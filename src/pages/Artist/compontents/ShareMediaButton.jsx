import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";
import Modal from "src/components/Modal";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SendMediaForm from "./SendMediaForm";

export default function ShareMediaButton(props) {
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
        <SendMediaForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          mediaId={mediaId}
          category={category}
        />
      </Modal>

      <button
        onClick={handleClick}
        className="cursor-pointer transition-all duration-300 hover:text-gray-400"
        data-tooltip-id="share-tooltip"
        data-tooltip-content="Share"
      >
        <FontAwesomeIcon icon={faShare} />
        <Tooltip id="share-tooltip" place="top" type="dark" effect="float" />
      </button>
    </div>
  );
}
