import { Link } from "react-router-dom";
import { ReviewStars } from "./ReviewContent";

export default function ReviewDetails({ review }) {
  return (
    <div className="review-section-details-container">
      <ReviewHeader review={review} />
      <ReviewContent review={review} />
    </div>
  );
}

function ReviewHeader({ review }) {
  return (
    <div className="review-section-header">
      <img src={review.profileUrl} />

      <div className="review-section-info-container">
        <div className="review-section-user-container">
          <p className="review-section-user-info">
            Review by{" "}
            <Link
              to={`/users/${review.username}`}
              className="review-section-username"
            >
              {review.username}
            </Link>
          </p>
          <ReviewStars rating={review.rating} />
        </div>

        <p className="review-section-date">
          {review.createdAt.toDate().toDateString()}
        </p>
      </div>
    </div>
  );
}

function ReviewContent({ review }) {
  return <p className="review-section-content">{review.content}</p>;
}
