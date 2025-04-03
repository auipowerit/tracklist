import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import ListButton from "src/components/Buttons/ListButton";
import Placeholder from "src/components/Placeholder";
import { ReviewStars } from "src/components/Review/ReviewContent";
import { useReviewContext } from "src/context/Review/ReviewContext";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";

export default function MediaBanner(props) {
  const { mediaId, spotifyURL, color, image, name, subtitle } = props;

  const { getAvgRating } = useReviewContext();
  const { defaultImg } = useSpotifyContext();

  const [rating, setRating] = useState({
    avgRating: 0,
    count: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const { avgRating, count } = (await getAvgRating(mediaId)) || {};
      setRating({ avgRating, count });
    };

    fetchData();
  }, []);

  return (
    <div
      onClick={() => window.open(spotifyURL)}
      data-tooltip-id="media-tooltip"
      data-tooltip-content="Open in Spotify"
      className="flex cursor-pointer items-center gap-4 text-center shadow-md shadow-black/50 transition-all duration-300 hover:shadow-xl hover:shadow-black/75"
      style={{ backgroundColor: color }}
    >
      <Tooltip id="media-tooltip" place="top" type="dark" effect="float" />

      <img src={image || defaultImg} className="h-64 w-64" />
      <div className="flex h-full flex-col items-center justify-center gap-4 p-2">
        <div className="m-auto flex w-80 flex-col items-center gap-1">
          {name ? (
            <p className="text-4xl font-bold">{name}</p>
          ) : (
            <Placeholder />
          )}
          {subtitle ? (
            <p className="text-gray-300">{subtitle}</p>
          ) : (
            <Placeholder />
          )}
        </div>
        <div className="mt-auto flex items-center justify-center gap-1">
          <p>{rating.avgRating?.toFixed(1) || ""}</p>
          <ReviewStars rating={rating.avgRating || 0} />
          <p>{(rating.avgRating && `(${rating.count})`) || ""}</p>
        </div>
      </div>
    </div>
  );
}
