import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./Button";
import "./shared-buttons.scss";

export default function DeleteButton({ type, deleteContent }) {
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this " + type + "?")) {
      return;
    }

    await deleteContent();
  };

  return (
    <Button
      onClick={handleDelete}
      classes="delete-button"
      ariaLabel="delete content"
    >
      <FontAwesomeIcon icon={faTrashCan} />
    </Button>
  );
}
