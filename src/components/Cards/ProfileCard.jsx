import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function ProfileCard({ user, handleClick }) {
  return (
    <div className="my-4 flex w-full items-center justify-between border-1 border-gray-500 px-2">
      <Link to={`/users/${user.id}`}>
        <div className="flex w-fit cursor-pointer items-center gap-4 p-4 text-lg">
          <FontAwesomeIcon icon={faUserCircle} className="text-5xl" />

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <p className="font-bold">{user.displayname}</p>
              <p className="text-gray-400">@{user.username}</p>
            </div>

            <p>{user.bio}</p>
            <p className="text-sm text-gray-400">
              {`${user.followersCount} followers, ${user.followingCount} following`}
            </p>
          </div>
        </div>
      </Link>

      <button
        onClick={() => handleClick(user.isFollowing, user.id)}
        className="h-fit w-fit rounded-2xl border-1 border-white px-4 py-2 hover:text-gray-400"
      >
        {user.isFollowing ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
}
