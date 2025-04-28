import { useNavigate } from "react-router-dom";
import Modal from "src/features/shared/components/Modal";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ShareForm from "src/features/media/components/forms/ShareForm";
import "./shared-buttons.scss";

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

      <button onClick={handleClick} className="share-button">
        <FontAwesomeIcon icon={faShare} />
      </button>
    </div>
  );
}
