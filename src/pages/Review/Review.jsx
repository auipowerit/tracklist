import { Link, useNavigate } from "react-router-dom";
import {
  ReviewButtons,
  ReviewStars,
} from "src/components/Review/ReviewContent";

export default function Review({ review, mediaData }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 border-b-1 border-white pb-4">
      <div className="flex flex-col items-center justify-center border-2 border-gray-400 hover:border-white">
        <img
          src={review.media.image}
          onClick={() => navigate(mediaData.titleLink)}
          className="w-64 cursor-pointer"
        />
        <div className="flex flex-col p-1 text-center">
          <Link
            to={mediaData.titleLink}
            className="text-xl font-bold hover:text-gray-400"
          >
            {mediaData.title}
          </Link>
          <Link
            to={mediaData.subtitleLink}
            className="text-sm text-gray-400 hover:text-white"
          >
            {mediaData.subtitle}
          </Link>
        </div>
      </div>
      <div className="flex h-full w-full flex-col justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex w-full items-start justify-between">
            <div className="flex items-center gap-2">
              <img src={review.profileUrl} className="h-10 w-10 rounded-full" />
              <div className="flex flex-col gap-1">
                <p className="text-gray-400">
                  Review by{" "}
                  <Link
                    to={`/users/${review.userId}`}
                    className="font-bold text-white hover:text-gray-400"
                  >
                    {review.username}
                  </Link>
                </p>
                <ReviewStars rating={review.rating} />
              </div>
            </div>
            <p className="text-sm text-gray-400">
              {review.createdAt.toDate().toDateString()}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-xl">{review.content}</p>
        </div>
        <ReviewButtons review={review} onPage={true} />
      </div>
    </div>
  );
}
