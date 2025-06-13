import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faPen } from "@fortawesome/free-solid-svg-icons";
import Button from "src/features/shared/components/buttons/Button";
import "./user-buttons.scss";

export default function EditProfileButton(props) {
  const { setIsModalOpen, showIcon = false } = props;

  if (showIcon) {
    return (
      <Button
        onClick={() => setIsModalOpen(true)}
        classes="profile-button"
        ariaLabel="edit profile"
      >
        <FontAwesomeIcon icon={faGear} />
      </Button>
    );
  }

  return (
    <Button
      onClick={() => setIsModalOpen(true)}
      classes="basic-button"
      ariaLabel="edit profile"
    >
      <FontAwesomeIcon icon={faPen} />
      <p>Edit</p>
    </Button>
  );
}
