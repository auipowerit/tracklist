import { Link } from "react-router-dom";
import { getTimeSince } from "src/utils/date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import ReviewStars from "../Review/ReviewStars";
import ReviewButtons from "../Review/ReviewButtons";

export default function MediaReviewCard({ review }) {
  return (
    <div className="flex gap-2">
      <FontAwesomeIcon icon={faUserCircle} className="text-4xl" />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <Link
              to={`/users/${review.userId}`}
              className="font-semibold hover:text-gray-300"
            >
              {review.username}
            </Link>
            <span>&#x2022;</span>

            <p className="text-sm font-light">
              {getTimeSince(review.createdAt.toDate())}
            </p>
          </div>

          <ReviewStars rating={review.rating || 0} />
        </div>

        <div className="flex flex-col gap-1">
          <p>{review.content}</p>
          <ReviewButtons review={review} />
        </div>
      </div>
    </div>
  );
}
