import { Link } from "react-router-dom";
import {
  ReviewContent,
  ReviewStars,
} from "src/features/review/components/ReviewContent";

export default function MediaReviewCard({ review }) {
  return (
    <Link to={`/reviews/${review.id}`} className="media-review-card">
      <Header review={review} />
      <ReviewContent review={review} />
    </Link>
  );
}

function Header({ review }) {
  return (
    <div className="media-review-header">
      <img src={review.profileUrl} className="media-review-img" />

      <div className="media-review-info">
        <div className="media-review-user">
          <p className="media-review-username">
            Review by <span>{review.username}</span>
          </p>
          <ReviewStars rating={review.rating} />
        </div>

        <p className="media-review-date">
          {review.createdAt.toDate().toDateString()}
        </p>
      </div>
    </div>
  );
}
