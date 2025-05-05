import { useNavigate } from "react-router-dom";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { getTimeSince } from "src/utils/date";
import "./inbox-card.scss";

export default function InboxCard({ notification }) {
  const { globalUser } = useAuthContext();
  const navigate = useNavigate();

  function handleClick(category, contentId) {
    switch (category) {
      case "user":
        navigate(`/users/${contentId}`);
        break;
      case "review":
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
    <div
      onClick={() => handleClick(notification.category, notification.contentId)}
      className="inbox-card"
    >
      <div className="inbox-card-info">
        <UserImage profileUrl={notification.profileUrl} />

        <div className="inbox-card-info-content">
          <Content notification={notification} />
          <Date createdAt={notification.createdAt} />
        </div>
      </div>

      <MediaImage image={notification.image} />
    </div>
  );
}

function UserImage({ profileUrl }) {
  return <img src={profileUrl} className="inbox-card-info-image" />;
}

function Content({ notification }) {
  return (
    <>
      <p className="inbox-card-info-content-title">{notification.title}</p>

      {notification.subtitle && (
        <p className="inbox-card-info-content-subtitle">
          "
          {notification.subtitle.length > 40
            ? notification.subtitle.slice(0, 40) + "..."
            : notification.subtitle}
          "
        </p>
      )}
    </>
  );
}

function Date({ createdAt }) {
  return (
    <p className="inbox-card-info-content-date">
      {getTimeSince(createdAt.toDate())}
    </p>
  );
}

function MediaImage({ image }) {
  if (!image) return;

  return <img src={image} className="inbox-card-image" />;
}
