import { useEffect, useRef, useState } from "react";
import { formatDateMDYLong } from "src/utils/date";
import { ReviewStars } from "../Review/ReviewContent";
import { useReviewContext } from "src/context/Review/ReviewContext";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";
import "src/styles/components/cards/media-card.scss";

export default function MediaCard(props) {
  const { media, defaultSubtitle, onClick } = props;

  const defaultDate = "01/01/2000";

  const { getAvgRating } = useReviewContext();
  const { DEFAULT_IMG } = useSpotifyContext();

  const [fetchedMedia, setFetchedMedia] = useState({});
  const titleRef = useRef(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const { avgRating, count } = (await getAvgRating(media?.id)) || {};

        const data = {
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
            media.album?.images?.[0]?.url ||
            media.images?.[0]?.url ||
            DEFAULT_IMG,
        };

        setFetchedMedia({ avgRating, count, data });
      } catch (error) {
        console.log(error);
      }
    };

    fetchMedia();
  }, []);

  useEffect(() => {
    const isOverflowing =
      titleRef.current.scrollWidth > titleRef.current.parentNode.clientWidth;

    if (isOverflowing) {
      titleRef.current.classList.add("scrolling-text");
    } else {
      titleRef.current.classList.remove("scrolling-text");
    }
  }, [fetchedMedia]);

  return (
    <div className="media-card-container" onClick={onClick}>
      <img src={fetchedMedia.data?.image || DEFAULT_IMG} />

      <div className="media-card-info">
        <div className="title-container">
          <p ref={titleRef} className="title">
            {fetchedMedia.data?.title || ""}
          </p>
        </div>

        <p className="subtitle">
          {fetchedMedia.data?.subtitle || ""}
        </p>
      </div>

      <div className="rating">
        <p>{fetchedMedia.avgRating?.toFixed(1) || ""}</p>
        <ReviewStars rating={fetchedMedia.avgRating || 0} />
        <p>{(fetchedMedia.avgRating && `(${fetchedMedia.count})`) || ""}</p>
      </div>
    </div>
  );
}
