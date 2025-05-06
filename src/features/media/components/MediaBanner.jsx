import { memo, useEffect, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import { DEFAULT_MEDIA_IMG } from "src/data/const";
import RatingBar from "src/features/review/components/RatingBar";
import { ReviewStars } from "src/features/review/components/ReviewContent";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import { useSpotifyContext } from "src/features/media/context/SpotifyContext";
import BannerButtons from "./buttons/BannerButtons";
import "./styles/media-banner.scss";

function MediaBanner({ media, category, setActiveTab, setFilter }) {
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

  if (!data || !media) return;

  return (
    <div className="media-banner">
      <SpotifyImage
        image={data.image}
        spotifyUrl={media.external_urls.spotify}
      />
      <div className="media-banner__content">
        <Title name={data.title} subtitle={data.subtitle} />
        <Rating
          mediaId={media.id}
          rating={rating}
          setActiveTab={setActiveTab}
          setFilter={setFilter}
        />
      </div>
      <BannerButtons mediaId={media.id} name={data.title} category={category} />
    </div>
  );
}

function SpotifyImage({ image, spotifyUrl }) {
  return (
    <div
      onClick={() => window.open(spotifyUrl)}
      data-tooltip-id="media-tooltip"
      data-tooltip-content="Open in Spotify"
      className="media-banner__image--wrapper"
    >
      <img src={image || DEFAULT_MEDIA_IMG} className="media-banner__image" />
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
    <div className="media-banner__header">
      <div className="media-banner__title--wrapper">
        <p ref={titleRef} className="media-banner__title">{name}</p>
      </div>

      <p className="media-banner__subtitle">{subtitle}</p>
    </div>
  );
}

function Rating({ mediaId, rating, setActiveTab, setFilter }) {
  return (
    <div className="media-banner__rating">
      <RatingBar
        mediaId={mediaId}
        setActiveTab={setActiveTab}
        setFilter={setFilter}
      />

      <div className="media-banner__stars">
        <p>{rating.avgRating?.toFixed(1) || ""}</p>
        <ReviewStars rating={rating.avgRating || 0} size={22} />
        <p>{(rating.avgRating && `(${rating.count})`) || ""}</p>
      </div>
    </div>
  );
}

export default memo(MediaBanner);
