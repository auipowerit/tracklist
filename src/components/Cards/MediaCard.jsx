import { useEffect, useState } from "react";
import { formatDateMDYLong } from "src/utils/date";
import ReviewStars from "../Review/ReviewStars";
import { useReviewContext } from "src/context/Review/ReviewContext";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";

export default function MediaCard(props) {
  const { media, defaultSubtitle, onClick } = props;

  const defaultDate = "01/01/2000";

  const { getAvgRating } = useReviewContext();
  const { defaultImg } = useSpotifyContext();

  const [fetchedMedia, setFetchedMedia] = useState({
    title: "",
    subtitle: "",
    image: defaultImg,
  });
  const [rating, setRating] = useState({});

  useEffect(() => {
    const fetchMedia = async () => {
      const { avgRating, count } = (await getAvgRating(media?.id)) || {};

      setRating({ avgRating, count });

      console.log("passed media:", media);

      setFetchedMedia({
        title: media?.name,

        subtitle:
          defaultSubtitle ||
          (media.followers ? (
            <>
              {media?.followers?.total.toLocaleString()}
              {media?.followers?.total === 1 ? " follower" : " followers"}
            </>
          ) : (
            media.artists?.[0]?.name ||
            formatDateMDYLong(
              media.album?.release_date || media?.release_date,
            ) ||
            defaultDate
          )),

        image:
          media.album?.images?.[0]?.url || media.images?.[0]?.url || defaultImg,
      });
    };

    return fetchMedia;
  }, []);

  return (
    <div
      className="flex h-fit w-72 cursor-pointer flex-col bg-white p-2 text-black transition-all duration-200 hover:scale-110"
      onClick={onClick}
    >
      {console.log(fetchedMedia)}
      <img src={fetchedMedia?.image || defaultImg} className="h-72" />
      <div className="flex grow-1 flex-col justify-between gap-2 py-2 text-center">
        <p className="text-xl font-bold">{fetchedMedia?.title || ""}</p>
        <p className="text-sm font-light">{fetchedMedia?.subtitle || ""}</p>
      </div>

      <div className="flex items-center justify-center gap-1">
        <p>{rating?.avgRating?.toFixed(1) || ""}</p>
        <ReviewStars rating={rating?.avgRating || 0} />
        <p>{(rating?.avgRating && `(${rating?.count})`) || ""}</p>
      </div>
    </div>
  );
}
