import { useReviewContext } from "../../context/Review/ReviewContext";

export default function DeleteButton({ review }) {
  const { setReviews, getReviews, deleteReview } = useReviewContext();

  async function handleClick() {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    await deleteReview(review.id);

    // Update parent review if this is a reply
    if (review.replyingTo) {
      setReviews((prevReviews) =>
        prevReviews.map(
          (r) =>
            // If review is the parent
            r.id === review.replyingTo
              ? {
                  // Create new object with same data but reply ID filtered out
                  ...r,
                  replies: r.replies.filter((reply) => reply !== review.id),
                }
              : r, // Return unchanged
        ),
      );
    }

    // Fetch updated reviews from Firestore
    const reviewsData = await getReviews();

    // Filter out any review from useState not found in Firestore data
    setReviews((prevReviews) =>
      prevReviews.filter((r) => reviewsData.some((data) => data.id === r.id)),
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
