export default function DeleteButton({ type, deleteContent }) {
  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this " + type + "?")) {
      return;
    }

    await deleteContent();
  }

  return (
    <button
      className="rounded-full px-3 py-1 transition-colors duration-150 hover:bg-gray-600"
      onClick={handleDelete}
    >
      Delete
    </button>
  );
}
