import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTimeSinceShort } from "src/utils/date";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import FollowButton from "src/features/user/components/buttons/FollowButton";
import "./inbox-card.scss";

export default function InboxCard({ notification }) {
  const { globalUser, getUserById } = useAuthContext();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      if (notification.category === "user") {
        const fetchedUser = await getUserById(notification.senderId);
        setUser(fetchedUser);
      }
    }

    fetchUser();
  }, [notification]);

  function handleClick(category, contentId) {
    switch (category) {
      case "user":
        navigate(`/users/${contentId}`);
        break;
      case "review":
      case "reply":
        navigate(`/reviews/${contentId}`);
        break;
      case "list":
        navigate(`/users/${globalUser.username}/lists/${contentId}`);
        break;
      case "follow":
        navigate(`/profile/${contentId}`);
        break;
      default:
        break;
    }
  }

  return (
    <div className="inbox-card">
      <div
        onClick={() =>
          handleClick(notification.category, notification.contentId)
        }
        className="inbox-card__info"
      >
        <UserImage profileUrl={notification.profileUrl} />

        <div className="inbox-card__content">
          <Content notification={notification} />
          <Date createdAt={notification.createdAt} />
        </div>
      </div>

      {user ? (
        <FollowButton user={user} setUser={setUser} />
      ) : (
        <MediaImage image={notification.imageUrl} />
      )}
    </div>
  );
}

function UserImage({ profileUrl }) {
  return <img src={profileUrl} className="inbox-card__profile" />;
}

function Content({ notification }) {
  return (
    <>
      <p className="inbox-card__title">
        {notification.title}
        {notification.subtitle && (
          <span className="inbox-card__subtitle">
            {" "}
            "{notification.subtitle}"
          </span>
        )}
      </p>
    </>
  );
}

function Date({ createdAt }) {
  return (
    <p className="inbox-card__date">{getTimeSinceShort(createdAt.toDate())}</p>
  );
}

function MediaImage({ image }) {
  if (image === "") return null;

  return <img src={image} className="inbox-card__media" />;
}
