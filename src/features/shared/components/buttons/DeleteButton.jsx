import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./shared-buttons.scss";

export default function DeleteButton({ type, deleteContent }) {
  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this " + type + "?")) {
      return;
    }

    await deleteContent();
  }

  return (
    <button className="delete-button" onClick={handleDelete}>
      <FontAwesomeIcon icon={faTrashCan} />
    </button>
  );
}
