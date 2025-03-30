import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { getTimeSince } from "../../utils/date";
import { Link, useNavigate } from "react-router-dom";
import ReviewStars from "../Review/ReviewStars";
import ReviewButtons from "../../pages/Home/ReviewButtons";
import { useSpotifyContext } from "../../context/Spotify/SpotifyContext";

export default function ReviewCard({ review }) {
  const { defaultImg } = useSpotifyContext();

  const navigate = useNavigate();

  const [media, setMedia] = useState({
    title: "",
    titleLink: "",
    subtitle: "",
    subtitleLink: "",
    image: defaultImg,
  });

  useEffect(() => {
    const artist = review.media?.artists?.[0] || review.media || {};
    const artistURL = `/artists/${artist?.id}`;

    const mediaData = {
      title: review.media?.name,
      image: review.media?.images?.[0]?.url || defaultImg,
    };

    if (review.media.type === "artist") {
      mediaData.titleLink = artistURL;
    } else if (review.media.type === "album") {
      mediaData.titleLink = `${artistURL}/albums/${review.media?.id}`;
      mediaData.subtitle = review.media?.artists?.[0]?.name;
      mediaData.subtitleLink = artistURL;
    } else if (review.media.type === "track") {
      mediaData.titleLink = `${artistURL}/albums/${review.media?.album?.id}/tracks/${review.media?.id}`;
      mediaData.subtitle = review.media?.artists?.[0]?.name;
      mediaData.subtitleLink = artistURL;
      mediaData.image = review.media?.album?.images?.[0]?.url || defaultImg;
    }

    setMedia(mediaData);
  }, []);

  return (
    <div className="flex cursor-pointer flex-col gap-2 p-2 transition-colors duration-75 hover:bg-slate-800">
      <div className="flex items-center gap-4">
        <img
          src={media.image}
          className="aspect-square h-32 object-cover shadow-lg transition-all duration-300 hover:scale-110"
          onClick={() => navigate(media.titleLink)}
        />

        <div className="flex flex-col justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1 hover:text-gray-400">
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

      <ReviewButtons review={review} />
    </div>
  );
}
