import { memo, useEffect, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import { Link } from "react-router-dom";
import { DEFAULT_MEDIA_IMG } from "src/data/const";
import ReviewStars from "src/features/review/components/rating/ReviewStars";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import { useSpotifyContext } from "src/features/media/context/SpotifyContext";
import RatingBar from "./RatingBar";
import BannerButtons from "./BannerButtons";
import "./media-banner.scss";

function MediaBanner({ media, category, setActiveTab, setFilter }) {
  const [rating, setRating] = useState(null);
  const [data, setData] = useState(null);

  const { getAvgRating } = useReviewContext();
  const { getMediaLinks } = useSpotifyContext();

  const fetchRating = async () => {
    const { avgRating, count } = (await getAvgRating(media.id)) || {};
    setRating({ avgRating, count });

    const fetchedData = getMediaLinks(media);
    setData(fetchedData);
  };

  useEffect(() => {
    if (!media) return;
    fetchRating();
  }, [media]);

  if (!data || !media) {
    return;
  }

  return (
    <div className="media-banner">
      <SpotifyImage
        image={data.image}
        spotifyUrl={media.external_urls.spotify}
      />
      <div className="media-banner__content">
        <Title
          name={data.title}
          subtitle={data.subtitle}
          link={data.subtitleLink}
        />
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

function Title({ name, subtitle, link }) {
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
        <p ref={titleRef} className="media-banner__title">
          {name}
        </p>
      </div>

      <Link to={link} className="media-banner__subtitle">
        {subtitle}
      </Link>
    </div>
  );
}

function Rating({ mediaId, rating, setActiveTab, setFilter }) {
  const handleClick = () => {
    setActiveTab("reviews");
  };

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
        <p onClick={handleClick} className="media-banner__count">
          {(rating.avgRating && `(${rating.count})`) || ""}
        </p>
      </div>
    </div>
  );
}

export default memo(MediaBanner);
