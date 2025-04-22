import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";
import {
  ReviewButtons,
  ReviewMediaTitle,
  ReviewStars,
  ReviewUser,
} from "../Review/ReviewContent";

export default function ReviewCard({ review }) {
  const { getMediaLinks } = useSpotifyContext();

  const navigate = useNavigate();

  const [media, setMedia] = useState({});

  useEffect(() => {
    const mediaData = getMediaLinks(review.media);
    setMedia(mediaData);
  }, []);

  return (
    <div className="flex flex-col gap-2 p-2">
      <div
        onClick={() => navigate(`/reviews/${review.id}`)}
        className="flex cursor-pointer flex-col gap-2 p-2 hover:bg-gray-800"
      >
        <div className="flex items-center gap-4">
          <img
            src={review.media.image}
            className="aspect-square h-36 w-36 border-1 border-transparent object-cover shadow-lg"
          />

          <div className="flex h-36 max-h-36 flex-col justify-between">
            <ReviewUser review={review} />

            <div className="flex flex-col gap-2">
              <ReviewMediaTitle
                title={media.title}
                subtitle={media.subtitle}
                category={review.category}
              />
              <ReviewStars rating={review.rating || 0} />
            </div>
          </div>
        </div>

        <p className="pr-6 text-lg break-words">
          {review.content.length > 150
            ? `${review.content.slice(0, 150)}...`
            : review.content}
        </p>
      </div>
      <ReviewButtons review={review} showComment={true} />
    </div>
  );
}
