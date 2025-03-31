import { faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import VoteButton from "../../components/Buttons/VoteButton";
import DeleteButton from "../../components/Buttons/DeleteButton";
import { useAuthContext } from "../../context/Auth/AuthContext";
import { useReviewContext } from "../../context/Review/ReviewContext";
import { Link } from "react-router-dom";

export default function ReviewButtons({ review, onPage }) {
  const { globalUser } = useAuthContext();
  const {
    updateReviewState,
    likeReview,
    dislikeReview,
    setReviews,
    getReviews,
    deleteReview,
  } = useReviewContext();

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

      {onPage ? (
        <button className="flex items-center gap-1">
          <FontAwesomeIcon icon={faComment} />
          <p>{review?.comments.length || 0}</p>
        </button>
      ) : (
        <Link
          to={`/reviews/${review.id}`}
          className="flex items-center gap-1 transition-colors duration-150 hover:text-gray-400"
        >
          <FontAwesomeIcon icon={faComment} />
          <p>{review?.comments.length || 0}</p>
        </Link>
      )}

      {globalUser && globalUser.uid === review.userId && (
        <DeleteButton
          content={review}
          deleteContent={deleteReview}
          getContent={getReviews}
          setContent={setReviews}
        />
      )}
    </div>
  );
}
