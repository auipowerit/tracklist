import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";

export default function MediaDetails({ review }) {
  const { getMediaLinks, defaultImg } = useSpotifyContext();

  const [mediaData, setMediaData] = useState({});

  useEffect(() => {
    const fetchData = () => {
      const fetchedMedia = getMediaLinks(review?.media);
      setMediaData(fetchedMedia);
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-w-64 flex-col items-center justify-center border-1 border-gray-400 p-2 hover:border-white">
      <MediaImage image={mediaData.image || defaultImg} link={mediaData.link} />
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
  return (
    <div className="flex flex-col p-1 text-center">
      <Link
        to={mediaData.titleLink}
        className="text-xl font-bold hover:text-gray-400"
      >
        {mediaData.title}
      </Link>
      <Link
        to={mediaData.subtitleLink}
        className="text-sm text-gray-400 hover:text-white"
      >
        {mediaData.subtitle}
      </Link>
    </div>
  );
}
