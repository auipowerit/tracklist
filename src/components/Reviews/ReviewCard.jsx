import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import ReviewStars from "./ReviewStars";
import ReviewButtons from "./ReviewButtons";
import { getTimeSince } from "../../utils/date";

export default function ReviewCard({ review }) {
  const defaultImg = "/images/default-img.jpg";

  const [media, setMedia] = useState({
    title: "",
    subtitle: "",
    image: defaultImg,
  });

  useEffect(() => {
    const fetchMedia = () => {
      setMedia({
        title: review.media?.name,
        subtitle: review.media?.artists?.[0]?.name || "",
        image:
          review.media?.images?.[0]?.url ||
          review.media?.album?.images?.[0]?.url ||
          defaultImg,
      });
    };

    return fetchMedia;
  }, []);

  return (
    <div className="flex cursor-pointer flex-col gap-2 p-2 transition-colors duration-75 hover:bg-slate-800">
      <div className="flex items-center gap-4">
        <img src={media.image} className="h-[125px] shadow-lg shadow-black" />

        <div className="flex flex-col justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1 hover:text-gray-400">
                <FontAwesomeIcon icon={faUserCircle} />
                <p className="font-semibold">{review.username} </p>
              </div>
              <span>&#x2022;</span>
              <p className="text-sm font-light">
                {getTimeSince(review.createdAt.toDate())}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <p className="text-2xl font-bold hover:text-gray-400">
                {media.title}
              </p>
              <p className="font-light">{media.subtitle}</p>
            </div>

            <ReviewStars rating={4.5} />
          </div>
        </div>
      </div>

      <p className="py-1 text-lg">{review.content}</p>

      <ReviewButtons review={review} />
    </div>
  );
}
