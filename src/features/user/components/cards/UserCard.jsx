import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import FollowButton from "../buttons/FollowButton";
import "./user-card.scss";

export default function UserCard({ user: propUser }) {
  const { globalUser } = useAuthContext();
  const [user, setUser] = useState(null);

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
    <div className="user-card-container">
      <Link to={`/users/${user.username}`} className="user-card">
        <img src={user.profileUrl} />

        <div className="user-card-info">
          <div className="user-card-header">
            <p className="user-card-displayname">{user.displayname}</p>
            <p className="user-card-username">@{user.username}</p>
          </div>

          <p className="user-card-bio">{user.bio}</p>
          <p className="user-card-friends">
            {`${user.followersCount || 0} followers, ${user.followingCount || 0} following`}
          </p>
        </div>
      </Link>

      {globalUser && user.uid !== globalUser?.uid && (
        <FollowButton user={user} setUser={setUser} />
      )}
    </div>
  );
}
