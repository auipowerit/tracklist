import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReviewButtons from "../Home/ReviewButtons";
import ReviewStars from "../../components/Review/ReviewStars";
import { Link, useNavigate } from "react-router-dom";

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
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUserCircle} />
              <p className="text-gray-400">
                Review by{" "}
                <Link
                  to={`/users/${review.userId}`}
                  className="font-bold text-white hover:text-gray-400"
                >
                  {review.username}
                </Link>
              </p>
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
