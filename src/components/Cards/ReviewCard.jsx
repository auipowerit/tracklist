import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";
import {
  ReviewButtons,
  ReviewMediaTitle,
  ReviewStars,
  ReviewUser,
} from "../Review/ReviewContent";
import "src/styles/components/cards/review-card.scss";

export default function ReviewCard({ review }) {
  const { getMediaLinks } = useSpotifyContext();

  const navigate = useNavigate();

  const [media, setMedia] = useState({});

  useEffect(() => {
    const mediaData = getMediaLinks(review.media);
    setMedia(mediaData);
  }, []);

  return (
    <div className="review-card-container">
      <div
        onClick={() => navigate(`/reviews/${review.id}`)}
        className="review-card"
      >
        <div className="review-card-header">
          <img src={review.media.image} className="review-card-img" />

          <div className="review-card-info">
            <ReviewUser review={review} />

            <div className="review-card-rating">
              <ReviewMediaTitle
                title={media.title}
                subtitle={media.subtitle}
                category={review.category}
              />
              <ReviewStars rating={review.rating || 0} />
            </div>
          </div>
        </div>

        <p className="review-card-text">
          {review.content.length > 150
            ? `${review.content.slice(0, 150)}...`
            : review.content}
        </p>
      </div>
      <ReviewButtons review={review} showComment={true} />
    </div>
  );
}
