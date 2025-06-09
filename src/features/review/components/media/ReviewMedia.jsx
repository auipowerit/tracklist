import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DEFAULT_MEDIA_IMG } from "src/data/const";
import MediaIcon from "src/features/media/components/cards/MediaIcon";
import { useSpotifyContext } from "src/features/media/context/SpotifyContext";
import "./review-media.scss";

export default function ReviewMedia({ review }) {
  const { getMediaLinks } = useSpotifyContext();

  const [mediaData, setMediaData] = useState({});

  useEffect(() => {
    const fetchData = () => {
      const fetchedMedia = getMediaLinks(review?.media);
      setMediaData(fetchedMedia);
    };

    fetchData();
  }, []);

  return (
    <div className="review-media">
      <MediaImage
        image={mediaData.image || DEFAULT_MEDIA_IMG}
        link={mediaData.titleLink}
      />
      <MediaInfo mediaData={mediaData} category={review?.category} />
    </div>
  );
}

function MediaImage({ image, link }) {
  const navigate = useNavigate();

  return (
    <img
      src={image}
      onClick={() => navigate(link)}
      className="review-media__image"
    />
  );
}

function MediaInfo({ mediaData, category }) {
  const titleRef = useRef(null);

  useEffect(() => {
    const isOverflowing =
      titleRef.current.scrollWidth > titleRef.current.parentNode.clientWidth;

    if (isOverflowing) {
      titleRef.current.classList.add("scrolling-text");
    } else {
      titleRef.current.classList.remove("scrolling-text");
    }
  }, [mediaData]);

  return (
    <div className="review-media__info">
      <div className="review-media__header">
        <MediaIcon
          category={category || "track"}
          className="review-media__icon"
        />
        <Link to={mediaData.titleLink} className="review-media__title--wrapper">
          <p ref={titleRef} className="review-media__title">
            {mediaData.title}
          </p>
        </Link>
      </div>

      <Link to={mediaData.subtitleLink} className="review-media__subtitle">
        {mediaData.subtitle}
      </Link>
    </div>
  );
}
