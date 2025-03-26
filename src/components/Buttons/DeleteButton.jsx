export default function DeleteButton(props) {
  const { content, deleteContent, getContent, setContent } = props;

  async function handleClick() {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    await deleteContent(content?.id);

    // Fetch updated content from Firestore
    const contentData = await getContent();

    // Filter out any content from useState not found in Firestore data
    setContent((prevContent) =>
      prevContent.filter((c) => contentData.some((data) => data.id === c.id)),
    );
  }

  return (
    <button
      className="rounded-full px-3 py-1 transition-colors duration-150 hover:bg-gray-600"
      onClick={handleClick}
    >
      Delete
    </button>
  );
}
