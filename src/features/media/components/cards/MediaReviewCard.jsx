import { Link } from "react-router-dom";
import { formatDateMDYLong } from "src/utils/date";
import ReviewStars from "src/features/review/components/rating/ReviewStars";
import "./media-review-card.scss";

export default function MediaReviewCard({ review }) {
  return (
    <Link to={`/reviews/${review.id}`} className="media-review">
      <Header review={review} />
      <Content review={review} />
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

function Content({ review }) {
  return (
    <p className="media-review__content">
      {review.content.length > 150
        ? `${review.content.slice(0, 150)}...`
        : review.content}
    </p>
  );
}
