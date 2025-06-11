import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSpotifyContext } from "src/features/media/context/SpotifyContext";
import ReviewStars from "../rating/ReviewStars";
import ReviewButtons from "../buttons/ReviewButtons";
import ReviewCardMedia from "../media/ReviewCardMedia";
import { getTimeSince, getTimeSinceShort } from "src/utils/date";
import "./review-card.scss";

export default function ReviewCard({ review }) {
  const { getMediaLinks } = useSpotifyContext();

  const navigate = useNavigate();

  const [media, setMedia] = useState({});

  useEffect(() => {
    const mediaData = getMediaLinks(review.media);
    setMedia(mediaData);
  }, []);

  return (
    <div className="review-card__container">
      <div
        onClick={() => navigate(`/reviews/${review.id}`)}
        className="review-card"
      >
        <div className="review-card__header">
          <img
            src={review.media.image}
            className="review-card__image"
            alt="reviewed media"
          />

          <div className="review-card__info">
            <ReviewUser review={review} />

            <div className="review-card__rating">
              <ReviewCardMedia
                title={media.title}
                subtitle={media.subtitle}
                category={review.category}
              />

              <ReviewStars rating={review.rating} />
            </div>
          </div>
        </div>

        <ReviewContent review={review} />
      </div>

      <ReviewButtons review={review} showComment={true} />
    </div>
  );
}

function ReviewUser({ review }) {
  return (
    <div className="review-card__user__container">
      <div className="review-card__user">
        <img src={review.profileUrl} className="review-card__profile" />
        <p>@{review.username}</p>
        <p className="review-card__date review-card__date--mobile">
          {getTimeSinceShort(review.createdAt.toDate())}
        </p>
      </div>
      <p className="review-card__date">
        {getTimeSince(review.createdAt.toDate())}
      </p>
    </div>
  );
}

function ReviewContent({ review }) {
  return (
    <p className="review-card__content">
      {review.content.length > 150
        ? `${review.content.slice(0, 150)}...`
        : review.content}
    </p>
  );
}
