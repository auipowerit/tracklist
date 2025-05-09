import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSpotifyContext } from "src/features/media/context/SpotifyContext";
import { DEFAULT_MEDIA_IMG } from "src/data/const";
import "./media-details.scss";

export default function MediaDetails({ review }) {
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
      <MediaInfo mediaData={mediaData} />
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

function MediaInfo({ mediaData }) {
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
      <Link to={mediaData.titleLink} className="review-media__title--wrapper">
        <p ref={titleRef} className="review-media__title">
          {mediaData.title}
        </p>
      </Link>
      <Link to={mediaData.subtitleLink} className="review-media__subtitle">
        {mediaData.subtitle}
      </Link>
    </div>
  );
}
