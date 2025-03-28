import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { getTimeSince } from "../../utils/date";
import ReviewStars from "../Review/ReviewStars";
import ReviewButtons from "../../pages/Home/ReviewButtons";

export default function MediaReviewCard({ review }) {
  return (
    <div className="flex gap-4">
      <FontAwesomeIcon icon={faUserCircle} className="text-4xl" />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <p className="font-semibold">{review.username}</p>
            <span>&#x2022;</span>

            <p className="text-sm font-light text-gray-400">
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
