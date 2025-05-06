import { useEffect, useRef, useState } from "react";
import { formatDateMDYLong } from "src/utils/date";
import { DEFAULT_MEDIA_IMG } from "src/data/const";
import { ReviewStars } from "src/features/review/components/ReviewContent";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import "./media-card.scss";

export default function MediaCard(props) {
  const { media, defaultSubtitle, onClick } = props;

  const { getAvgRating } = useReviewContext();

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
            media.artists?.[0]?.name ||
            formatDateMDYLong(media.album?.release_date || media?.release_date),
          image:
            media.album?.images?.[0]?.url ||
            media.images?.[0]?.url ||
            DEFAULT_MEDIA_IMG,
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
    <div className="media-card" onClick={onClick}>
      <img
        src={fetchedMedia.data?.image || DEFAULT_MEDIA_IMG}
        className="media-card__image"
      />

      <div className="media-card__info">
        <div className="media-card__title--wrapper">
          <p ref={titleRef} className="media-card__title">{fetchedMedia.data?.title || ""}</p>
        </div>

        <p className="media-card__subtitle">
          {fetchedMedia.data?.subtitle || ""}
        </p>
      </div>

      <div className="media-card__rating">
        <p>{fetchedMedia.avgRating?.toFixed(1) || ""}</p>
        <ReviewStars rating={fetchedMedia.avgRating || 0} />
        <p>{(fetchedMedia.avgRating && `(${fetchedMedia.count})`) || ""}</p>
      </div>
    </div>
  );
}
