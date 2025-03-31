import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReviewButtons from "../Home/ReviewButtons";
import ReviewStars from "../../components/Review/ReviewStars";

export default function Review({ review, mediaTitle, mediaSubtitle }) {
  return (
    <div className="flex items-center gap-4 border-b-1 border-white pb-4">
      <div className="flex flex-col items-center justify-center border-2 border-gray-400">
        <img src={review.media.image} className="w-64" />
        <div className="p-1 text-center">
          <p className="text-xl font-bold">{mediaTitle}</p>
          <p className="text-sm text-gray-400">{mediaSubtitle}</p>
        </div>
      </div>
      <div className="flex h-full w-full flex-col justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUserCircle} />
              <p>Review by {review.username}</p>
            </div>
            <p className="text-sm text-gray-400">
              {review.createdAt.toDate().toDateString()}
            </p>
          </div>
          <ReviewStars rating={review.rating} />
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-xl">{review.content}</p>
        </div>
        <ReviewButtons review={review} onPage={true} />
      </div>
    </div>
  );
}
