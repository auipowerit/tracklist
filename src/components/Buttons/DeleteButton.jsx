import "src/styles/components/buttons.scss";

export default function DeleteButton({ type, deleteContent }) {
  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this " + type + "?")) {
      return;
    }

    await deleteContent();
  }

  return (
    <button
      className="delete-btn"
      onClick={handleDelete}
    >
      Delete
    </button>
  );
}
