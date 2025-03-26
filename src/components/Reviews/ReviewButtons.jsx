import { useAuthContext } from "../../context/Auth/AuthContext";
import { useReviewContext } from "../../context/Review/ReviewContext";
import DeleteButton from "../Buttons/DeleteButton";
import VoteButton from "../Buttons/VoteButton";

export default function ReviewButtons({ review }) {
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
    <div className="ml-1 flex items-center">
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
