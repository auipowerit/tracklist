import LikeButton from "../Buttons/LikeButton";
import { getTimeSince } from "../../utils/date";
import DeleteButton from "../Buttons/DeleteButton";
import DislikeButton from "../Buttons/DislikeButton";
import { useAuthContext } from "../../context/Auth/AuthContext";

export default function ReviewCard({ review }) {
  const { globalUser } = useAuthContext();

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
        <LikeButton review={review} />
        <DislikeButton review={review} />

        {globalUser && globalUser.uid === review.userId && (
          <DeleteButton review={review} />
        )}
      </div>
    </div>
  );
}
