import { useState } from "react";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useInboxContext } from "src/features/inbox/context/InboxContext";
import "./user-buttons.scss";

export default function FollowButton({ user, setUser }) {
  const { globalUser, followUser, unfollowUser } = useAuthContext();
  const { addNotification } = useInboxContext();

  const [isFollowing, setIsFollowing] = useState(
    user.followers.includes(globalUser?.uid) || false,
  );

  async function handleClick() {
    isFollowing
      ? await unfollowUser(user.uid, globalUser?.uid)
      : await followUser(user.uid, globalUser?.uid);

    if (!isFollowing) {
      await addNotification(
        user.uid,
        `${globalUser.username} started following you`,
        globalUser.username,
        "user",
      );
    }

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
      className={`follow-button ${isFollowing && "active"}`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}
