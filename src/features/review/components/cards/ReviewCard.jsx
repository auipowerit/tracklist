import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSpotifyContext } from "src/features/media/context/SpotifyContext";
import {
  ReviewContent,
  ReviewMediaTitle,
  ReviewStars,
  ReviewUser,
} from "src/features/review/components/ReviewContent";
import ReviewButtons from "../buttons/ReviewButtons";
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

        <ReviewContent review={review} />
      </div>
      <ReviewButtons review={review} showComment={true} />
    </div>
  );
}
