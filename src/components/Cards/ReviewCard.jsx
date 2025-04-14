import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";
import {
  ReviewContent,
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
      <div className="flex items-center gap-4">
        <img
          src={review.media.image}
          className="aspect-square h-36 w-36 cursor-pointer border-1 border-transparent object-cover shadow-lg hover:border-white"
          onClick={() => navigate(media.titleLink)}
        />

        <div className="flex flex-col justify-center gap-4">
          <ReviewUser review={review} />

          <div className="flex flex-col gap-4">
            <ReviewMediaTitle {...media} />
            <ReviewStars rating={review.rating || 0} />
          </div>
        </div>
      </div>

      <div className="w-4/5">
        <ReviewContent review={review} showComment={true} />
      </div>
    </div>
  );
}
