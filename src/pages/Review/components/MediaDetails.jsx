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
    <div className="flex max-w-75 min-w-75 flex-col items-center justify-center p-2">
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
      className="h-64 w-64 cursor-pointer object-cover"
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
    <div className="flex flex-col p-1 px-2 text-center">
      <Link
        to={mediaData.titleLink}
        className="max-w-100 min-w-100 overflow-hidden mask-r-from-80% mask-l-from-95% px-2"
      >
        <p
          ref={titleRef}
          className="px-2 text-lg font-bold whitespace-nowrap hover:text-gray-400"
        >
          {mediaData.title}
        </p>
      </Link>
      <Link to={mediaData.subtitleLink} className="text-sm text-gray-400">
        {mediaData.subtitle}
      </Link>
    </div>
  );
}
