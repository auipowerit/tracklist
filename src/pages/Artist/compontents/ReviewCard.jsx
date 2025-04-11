import { Link } from "react-router-dom";
import {
  ReviewContent,
  ReviewStars,
} from "src/components/Review/ReviewContent";

export default function ReviewCard({ review }) {
  return (
    <div>
      {review && (
        <div className="flex flex-col gap-2">
          <Header review={review} />

          <div className="w-120">
            <ReviewContent review={review} />
          </div>
        </div>
      )}
    </div>
  );
}

function Header({ review }) {
  return (
    <div className="flex items-center gap-2">
      <img src={review.profileUrl} className="h-12 w-12 rounded-full" />

      <div className="flex w-full items-start justify-between">
        <div className="flex flex-col gap-1">
          <UserInfo review={review} />
          <ReviewStars rating={review.rating} />
        </div>

        <p className="text-sm text-gray-400">
          {review.createdAt.toDate().toDateString()}
        </p>
      </div>
    </div>
  );
}

function UserInfo({ review }) {
  return (
    <p className="text-gray-400">
      Review by{" "}
      <Link
        to={`/users/${review.userId}`}
        className="font-bold text-white hover:text-gray-400"
      >
        {review.username}
      </Link>
    </p>
  );
}
