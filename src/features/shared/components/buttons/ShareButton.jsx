import { useNavigate } from "react-router-dom";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import Modal from "src/features/shared/components/modal/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ShareForm from "src/features/media/components/forms/ShareForm";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import Button from "./Button";
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

      <Button
        onClick={handleClick}
        classes="share-button"
        ariaLabel="share content"
      >
        <FontAwesomeIcon icon={faShare} />
      </Button>
    </div>
  );
}
