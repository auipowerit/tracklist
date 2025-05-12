import { faGear, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./user-buttons.scss";

export default function EditProfileButton({
  setIsModalOpen,
  showIcon = false,
}) {
  if (showIcon) {
    return (
      <button onClick={() => setIsModalOpen(true)} className="profile-button">
        <FontAwesomeIcon icon={faGear} />
      </button>
    );
  }

  return (
    <button onClick={() => setIsModalOpen(true)} className="basic-button">
      <FontAwesomeIcon icon={faPen} />
      <p>Edit</p>
    </button>
  );
}
