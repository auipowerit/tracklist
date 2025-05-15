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
      followersCount: propUser.followers?.length || 0,
      followingCount: propUser.following?.length || 0,
      isFollowing: propUser.followers?.includes(globalUser?.uid) || false,
    });
  }, []);

  if (!user) {
    return;
  }

  return (
    <div className="user-card">
      <Link to={`/users/${user.username}`} className="user-card--container">
        <img
          src={user.profileUrl}
          className="user-card__image"
          alt="user profile"
        />

        <div className="user-card__info">
          <div className="user-card__header">
            <p className="user-card__displayname">{user.displayname}</p>
            <p className="user-card__username">@{user.username}</p>
          </div>

          <p className="user-card__friends">
            <span className="user-card__count">{`${user.followersCount || 0}`}</span>{" "}
            {`followers, `}
            <span className="user-card__count">{`${user.followingCount || 0}`}</span>{" "}
            {` following`}
          </p>
        </div>
      </Link>

      {globalUser && user.uid !== globalUser?.uid && (
        <FollowButton user={user} setUser={setUser} />
      )}
    </div>
  );
}
