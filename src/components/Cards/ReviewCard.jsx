import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { getTimeSince } from "../../utils/date";
import { Link, useNavigate } from "react-router-dom";
import ReviewStars from "../Review/ReviewStars";
import ReviewButtons from "../../pages/Home/ReviewButtons";
import { useSpotifyContext } from "../../context/Spotify/SpotifyContext";

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
          className="aspect-square h-32 cursor-pointer object-cover shadow-lg transition-all duration-300 hover:scale-110"
          onClick={() => navigate(media.titleLink)}
        />

        <div className="flex flex-col justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="flex cursor-pointer items-center gap-1 hover:text-gray-400">
                <FontAwesomeIcon icon={faUserCircle} />
                <p className="font-semibold">{review.username} </p>
              </div>
              <span>&#x2022;</span>
              <p className="text-sm font-light text-gray-400">
                {getTimeSince(review.createdAt.toDate())}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <Link
                to={media.titleLink}
                className="text-2xl font-bold hover:text-gray-400"
              >
                {media.title}
              </Link>
              <Link
                to={media.subtitleLink}
                className="font-light hover:text-gray-400"
              >
                {media.subtitle}
              </Link>
            </div>

            <ReviewStars rating={review.rating || 0} />
          </div>
        </div>
      </div>

      <p className="py-1 text-lg">{review.content}</p>

      <ReviewButtons review={review} onPage={false} />
    </div>
  );
}
