import { Link } from "react-router-dom";
import { ReviewStars } from "src/components/Review/ReviewContent";

export default function ReviewDetails({ review }) {
  return (
    <div className="flex h-72 w-full flex-col gap-4">
      <ReviewHeader review={review} />
      <ReviewContent review={review} />
    </div>
  );
}

function ReviewHeader({ review }) {
  return (
    <div className="flex items-center gap-2">
      <img src={review.profileUrl} className="h-16 w-16 rounded-full" />

      <div className="flex w-full items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-lg text-gray-400">
            Review by{" "}
            <Link
              to={`/users/${review.username}`}
              className="font-bold text-white hover:text-gray-400"
            >
              {review.username}
            </Link>
          </p>
          <ReviewStars rating={review.rating} />
        </div>

        <p className="text-sm text-gray-400">
          {review.createdAt.toDate().toDateString()}
        </p>
      </div>
    </div>
  );
}

function ReviewContent({ review }) {
  return (
    <p className="overflow-auto mask-b-from-90% pb-2 pl-2 text-xl break-words">
      {review.content}
    </p>
  );
}
