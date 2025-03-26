import { useEffect, useState } from "react";
import { formatDateMDYLong } from "../../utils/date";
import ReviewStars from "../Reviews/ReviewStars";
import { useReviewContext } from "../../context/Review/ReviewContext";

export default function MediaCard({ media, onClick }) {
  const defaultDate = "01/01/2000";
  const defaultImg = "/images/default-img.jpg";

  const { getAvgRating } = useReviewContext();

  const [fetchedMedia, setFetchedMedia] = useState({
    title: "",
    subtitle: "",
    image: defaultImg,
  });
  const [rating, setRating] = useState({});

  useEffect(() => {
    const fetchMedia = async () => {
      const { avgRating, totalRatings } = await getAvgRating(media.id);

      setRating({ avgRating, totalRatings });

      setFetchedMedia({
        title: media?.name,

        subtitle: media.followers ? (
          <>
            {media?.followers?.total.toLocaleString()}
            {media?.followers?.total === 1 ? " follower" : " followers"}
          </>
        ) : (
          media.artists?.[0]?.name ||
          formatDateMDYLong(media.album?.release_date || media?.release_date) ||
          defaultDate
        ),

        image:
          media.album?.images?.[0]?.url || media.images?.[0]?.url || defaultImg,
      });
    };

    return fetchMedia;
  }, []);

  return (
    <div
      className="flex min-h-[400px] w-[300px] cursor-pointer flex-col bg-white p-2 text-black transition-all duration-200 hover:scale-110"
      onClick={onClick}
    >
      <img src={fetchedMedia.image} className="h-[300px] w-[300px]" />
      <div className="flex grow-1 flex-col justify-between gap-2 py-2 text-center">
        <p className="text-xl font-bold">{fetchedMedia.title}</p>
        <p className="text-sm font-light">{fetchedMedia.subtitle}</p>
      </div>

      {rating.avgRating > 0 && (
        <div className="flex items-center justify-center gap-1">
          <ReviewStars rating={rating.avgRating} />
          <p className="font-bold">({rating.avgRating})</p>
        </div>
      )}
    </div>
  );
}
