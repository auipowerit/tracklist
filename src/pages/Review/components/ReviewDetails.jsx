import { Link } from "react-router-dom";
import { ReviewStars } from "src/components/Review/ReviewContent";

export default function ReviewDetails({ review }) {
  return (
    <div className="details-container">
      <ReviewHeader review={review} />
      <ReviewContent review={review} />
    </div>
  );
}

function ReviewHeader({ review }) {
  return (
    <div className="header">
      <img src={review.profileUrl} />

      <div className="info-container">
        <div className="user-container">
          <p className="user-info">
            Review by{" "}
            <Link to={`/users/${review.username}`} className="username">
              {review.username}
            </Link>
          </p>
          <ReviewStars rating={review.rating} />
        </div>

        <p className="date">{review.createdAt.toDate().toDateString()}</p>
      </div>
    </div>
  );
}

function ReviewContent({ review }) {
  return <p className="content">{review.content}</p>;
}
