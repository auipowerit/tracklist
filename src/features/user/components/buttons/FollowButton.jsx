import { useState } from "react";
import Button from "src/features/shared/components/buttons/Button";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useInboxContext } from "src/features/inbox/context/InboxContext";
import "./user-buttons.scss";

export default function FollowButton({ user, setUser }) {
  const { globalUser, followUser, unfollowUser } = useAuthContext();
  const { addNotification } = useInboxContext();

  const [isFollowing, setIsFollowing] = useState(
    user.followers?.includes(globalUser?.uid) || false,
  );

  async function handleClick() {
    isFollowing
      ? await unfollowUser(user.uid, globalUser?.uid)
      : await followUser(user.uid, globalUser?.uid);

    if (!isFollowing) {
      await addNotification(
        user.uid,
        globalUser.uid,
        `${globalUser.username} started following you`,
        "",
        globalUser.username,
        "",
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
    <Button
      onClick={() => handleClick()}
      classes="follow-button"
      ariaSelected={isFollowing}
      ariaLabel={isFollowing ? "unfollow" : "follow"}
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
