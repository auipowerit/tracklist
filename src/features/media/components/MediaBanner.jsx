import { memo, useEffect, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import { DEFAULT_MEDIA_IMG } from "src/data/const";
import RatingBar from "src/features/review/components/RatingBar";
import { ReviewStars } from "src/features/review/components/ReviewContent";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import { useSpotifyContext } from "src/features/media/context/SpotifyContext";
import BannerButtons from "./buttons/BannerButtons";
import "./styles/media-banner.scss";

function MediaBanner({ media, category }) {
  const { getAvgRating } = useReviewContext();
  const { getMediaLinks } = useSpotifyContext();

  const [rating, setRating] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!media) return;
    fetchRating();
  }, [media]);

  async function fetchRating() {
    const { avgRating, count } = (await getAvgRating(media.id)) || {};
    setRating({ avgRating, count });

    const fetchedData = getMediaLinks(media);
    setData(fetchedData);
  }

  if (!data) return;

  return (
    <div className="media-banner-container">
      <SpotifyImage
        image={data.image}
        spotifyURL={media.external_urls.spotify}
      />
      <div className="media-banner-content">
        <Title name={data.title} subtitle={data.subtitle} />
        <Rating mediaId={media.id} rating={rating} />
      </div>
      <BannerButtons mediaId={media.id} name={data.title} category={category} />
    </div>
  );
}

function SpotifyImage({ image, spotifyURL }) {
  return (
    <div
      onClick={() => window.open(spotifyURL)}
      data-tooltip-id="media-tooltip"
      data-tooltip-content="Open in Spotify"
      className="media-banner-image"
    >
      <img src={image || DEFAULT_MEDIA_IMG} />
      <Tooltip id="media-tooltip" place="top" type="dark" effect="float" />
    </div>
  );
}

function Title({ name, subtitle }) {
  const titleRef = useRef(null);

  useEffect(() => {
    const isOverflowing =
      titleRef.current.scrollWidth > titleRef.current.parentNode.clientWidth;

    if (isOverflowing) {
      titleRef.current.classList.add("scrolling-text");
    } else {
      titleRef.current.classList.remove("scrolling-text");
    }
  }, [name]);

  return (
    <div className="media-banner-title-container">
      <div className="media-banner-title">
        <p ref={titleRef}>{name}</p>
      </div>

      <p className="media-banner-subtitle">{subtitle}</p>
    </div>
  );
}

function Rating({ mediaId, rating }) {
  return (
    <div className="media-banner-rating">
      <RatingBar mediaId={mediaId} />

      <div className="media-banner-stars">
        <p>{rating.avgRating?.toFixed(1) || ""}</p>
        <ReviewStars rating={rating.avgRating || 0} size={22} />
        <p>{(rating.avgRating && `(${rating.count})`) || ""}</p>
      </div>
    </div>
  );
}

export default memo(MediaBanner);
