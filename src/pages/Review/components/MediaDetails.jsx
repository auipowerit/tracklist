import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";

export default function MediaDetails({ review }) {
  const { getMediaLinks, DEFAULT_IMG } = useSpotifyContext();

  const [mediaData, setMediaData] = useState({});

  useEffect(() => {
    const fetchData = () => {
      const fetchedMedia = getMediaLinks(review?.media);
      setMediaData(fetchedMedia);
    };

    fetchData();
  }, []);

  return (
    <div className="media-container">
      <MediaImage
        image={mediaData.image || DEFAULT_IMG}
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
    <div className="media-info-container">
      <Link
        to={mediaData.titleLink}
        className="title-container"
      >
        <p
          ref={titleRef}
          className="title"
        >
          {mediaData.title}
        </p>
      </Link>
      <Link to={mediaData.subtitleLink} className="subtitle">
        {mediaData.subtitle}
      </Link>
    </div>
  );
}
