import { useState } from "react";
import { useAuthContext } from "src/context/Auth/AuthContext";

export default function FollowButton({ user, setUser }) {
  const { globalUser, followUser, unfollowUser } = useAuthContext();

  const [isFollowing, setIsFollowing] = useState(
    user.followers.includes(globalUser?.uid) || false,
  );

  async function handleClick() {
    isFollowing
      ? await unfollowUser(user.uid, globalUser?.uid)
      : await followUser(user.uid, globalUser?.uid);

    setIsFollowing(!isFollowing);

    if (!setUser) return;

    setUser({
      ...user,
      isFollowing: !user.isFollowing,
      followersCount: user.followersCount + (user.isFollowing ? -1 : 1),
    });
  }

  const color = isFollowing ? "bg-green-700" : "border-white";

  return (
    <button
      onClick={() => handleClick()}
      className={`flex h-fit w-[110px] justify-center rounded-2xl border-2 border-transparent py-1 text-lg text-white ${color}`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}
