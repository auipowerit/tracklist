import { Link } from "react-router-dom";
import {
  ReviewContent,
  ReviewStars,
} from "src/features/review/components/ReviewContent";
import { formatDateMDYLong } from "src/utils/date";

export default function MediaReviewCard({ review }) {
  return (
    <Link to={`/reviews/${review.id}`} className="media-review">
      <Header review={review} />
      <ReviewContent review={review} />
    </Link>
  );
}

function Header({ review }) {
  return (
    <div className="media-review__header">
      <img src={review.profileUrl} className="media-review__image" />

      <div className="media-review__info">
        <div className="media-review__user">
          <p className="media-review__username">
            Review by{" "}
            <span className="media-review--highlight">{review.username}</span>
          </p>
          <ReviewStars rating={review.rating} />
        </div>

        <p className="media-review__date">
          {formatDateMDYLong(review.createdAt.toDate())}
        </p>
      </div>
    </div>
  );
}
