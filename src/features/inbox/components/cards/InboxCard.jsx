import { useNavigate } from "react-router-dom";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { getTimeSinceShort } from "src/utils/date";
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
      className="inbox__card"
    >
      <div className="inbox__card__info">
        <UserImage profileUrl={notification.profileUrl} />

        <div className="inbox__card__content">
          <Content notification={notification} />
          <Date createdAt={notification.createdAt} />
        </div>
      </div>

      <MediaImage image={notification.image} />
    </div>
  );
}

function UserImage({ profileUrl }) {
  return <img src={profileUrl} className="inbox__card__profile" />;
}

function Content({ notification }) {
  return (
    <>
      <p className="inbox__card__title">{notification.title}</p>

      {notification.subtitle && (
        <p className="inbox__card__subtitle">"{notification.subtitle}"</p>
      )}
    </>
  );
}

function Date({ createdAt }) {
  return (
    <p className="inbox__card__date">{getTimeSinceShort(createdAt.toDate())}</p>
  );
}

function MediaImage({ image }) {
  if (!image) return;

  return <img src={image} className="inbox__card__media" />;
}
