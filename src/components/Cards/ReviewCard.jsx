import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { getTimeSince } from "../../utils/date";

export default function ReviewCard({ review }) {
  return (
    <div
      key={review.id}
      className="flex cursor-pointer flex-col gap-2 p-2 transition-colors duration-75 hover:bg-slate-800"
    >
      <div className="flex flex-col gap-1">
        <div className="flex gap-2 text-sm">
          <p className="font-semibold">@{review.username}</p>
          <p className="font-light">
            {getTimeSince(review.createdAt.toDate())}
          </p>
        </div>
        <p className="text-xl">{review.content}</p>
      </div>
      <div className="ml-1 flex items-center">
        <button className="text-md flex w-12 items-center gap-1 font-light transition-all duration-150 hover:text-gray-400">
          <FontAwesomeIcon icon={faThumbsUp} />
          <p>{review.likes.length}</p>
        </button>

        <button className="text-md flex w-12 items-center gap-1 font-light transition-all duration-150 hover:text-gray-400">
          <FontAwesomeIcon icon={faThumbsDown} />
          <p>{review.dislikes.length}</p>
        </button>
      </div>
    </div>
  );
}
