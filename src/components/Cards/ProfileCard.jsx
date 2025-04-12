import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "src/context/Auth/AuthContext";

export default function ProfileCard({ user: propUser }) {
  const { globalUser, followUser, unfollowUser } = useAuthContext();
  const [user, setUser] = useState(null);

  async function handleClick() {
    user.isFollowing
      ? await unfollowUser(user.id, globalUser?.uid)
      : await followUser(user.id, globalUser?.uid);

    setUser({
      ...user,
      isFollowing: !user.isFollowing,
      followersCount: user.followersCount + (user.isFollowing ? -1 : 1),
    });
  }

  useEffect(() => {
    setUser({
      ...propUser,
      followersCount: propUser.followers.length,
      followingCount: propUser.following.length,
      isFollowing: propUser.followers.includes(globalUser?.uid),
    });
  }, []);

  if (!user) {
    return;
  }

  return (
    <div className="my-4 flex w-full items-center justify-between border-1 border-gray-500 px-2">
      <Link to={`/users/${user.username}`}>
        <div className="flex w-fit cursor-pointer items-center gap-4 p-4 text-lg">
          <img
            src={user.profileUrl}
            className="h-16 w-16 rounded-full object-cover"
          />

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <p className="font-bold">{user.displayname}</p>
              <p className="text-gray-400">@{user.username}</p>
            </div>

            <p>{user.bio}</p>
            <p className="text-sm text-gray-400">
              {`${user.followersCount || 0} followers, ${user.followingCount || 0} following`}
            </p>
          </div>
        </div>
      </Link>

      {globalUser && user.id !== globalUser?.uid && (
        <button
          onClick={() => handleClick()}
          className="h-fit w-fit rounded-2xl border-1 border-white px-4 py-2 hover:text-gray-400"
        >
          {user.isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}
    </div>
  );
}
