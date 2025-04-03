import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import {
  ReviewContent,
  ReviewStars,
  ReviewUser,
} from "../Review/ReviewContent";
import Placeholder from "../Placeholder";

export default function MediaReviewCard({ review }) {
  return (
    <div className="flex gap-2">
      <FontAwesomeIcon icon={faUserCircle} className="text-4xl" />
      {review ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <ReviewUser review={review} showIcon={false} />
            <ReviewStars rating={review.rating || 0} />
          </div>

          <ReviewContent review={review} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <Placeholder />
              <Placeholder />
            </div>
            <Placeholder />
          </div>
          <Placeholder />
        </div>
      )}
    </div>
  );
}
