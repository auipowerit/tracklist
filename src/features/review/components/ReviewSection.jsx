import ReviewButtons from "./buttons/ReviewButtons";
import MediaDetails from "./MediaDetails";
import ReviewDetails from "./ReviewDetails";

export default function ReviewSection({ review }) {
  return (
    <div className="review-section-container">
      <MediaDetails review={review} />

      <div className="review-section">
        <ReviewDetails review={review} />
        <ReviewButtons review={review} showComment={false} />
      </div>
    </div>
  );
}
