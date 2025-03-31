import { faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import VoteButton from "../../components/Buttons/VoteButton";
import DeleteButton from "../../components/Buttons/DeleteButton";
import { useAuthContext } from "../../context/Auth/AuthContext";
import { useReviewContext } from "../../context/Review/ReviewContext";
import { Link, useNavigate } from "react-router-dom";
import { useCommentContext } from "../../context/Comment/CommentContext";

export default function ReviewButtons({ review, onPage }) {
  const { globalUser } = useAuthContext();
  const { deleteComment } = useCommentContext();
  const {
    updateReviewState,
    likeReview,
    dislikeReview,
    setReviews,
    getReviews,
    deleteReview,
  } = useReviewContext();

  const navigate = useNavigate();

  async function handleDelete() {
    const comments = review.comments;

    if (!review.id) return;

    // Delete each comment from comments db
    if (comments.length > 0) {
      await Promise.all(
        comments.map(async (comment) => {
          await deleteComment(comment);
        }),
      );
    }

    // Delete review
    await deleteReview(review.id);

    // Fetch updated review from Firestore
    const reviewData = await getReviews();

    // Filter out any reviews from useState not found in Firestore state
    setReviews((prevReviews) =>
      prevReviews.filter((r) =>
        reviewData.some((review) => review.id === r.id),
      ),
    );

    navigate("/");
  }

  return (
    <div className="ml-1 flex items-center gap-4">
      <div className="flex items-center">
        <VoteButton
          content={review}
          type="like"
          handleContent={likeReview}
          updateContent={updateReviewState}
        />
        <VoteButton
          content={review}
          type="dislike"
          handleContent={dislikeReview}
          updateContent={updateReviewState}
        />
      </div>

      {!onPage && (
        <Link
          to={`/reviews/${review.id}`}
          className="flex items-center gap-1 transition-colors duration-150 hover:text-gray-400"
        >
          <FontAwesomeIcon icon={faComment} />
          <p>{review?.comments.length || 0}</p>
        </Link>
      )}

      {globalUser && globalUser.uid === review.userId && (
        <DeleteButton type="review" deleteContent={handleDelete} />
      )}
    </div>
  );
}
