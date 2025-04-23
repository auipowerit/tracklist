import { useState } from "react";
import { useAuthContext } from "src/context/Auth/AuthContext";
import "src/styles/components/buttons.scss";

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

  return (
    <button
      onClick={() => handleClick()}
      className={`follow-btn ${isFollowing && "active"}`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}
