import { useEffect, useRef } from "react";
import MediaIcon from "src/features/media/components/cards/MediaIcon";
import "./review-card-media.scss";

export default function ReviewCardMedia({ title, subtitle, category }) {
  return (
    <div className="review-card-media">
      <div className="review-card-media__header">
        <MediaIcon category={category} className="review-card-media__icon" />
        <MediaTitle title={title} />
      </div>

      <p className="review-card-media__subtitle">{subtitle}</p>
    </div>
  );
}

function MediaTitle({ title }) {
  const titleRef = useRef(null);

  useEffect(() => {
    const isOverflowing =
      titleRef.current.scrollWidth > titleRef.current.parentNode.clientWidth;

    if (isOverflowing) {
      titleRef.current.classList.add("scrolling-text");
    } else {
      titleRef.current.classList.remove("scrolling-text");
    }
  }, [title]);

  return (
    <div className="review-card-media__title--wrapper">
      <p ref={titleRef} className="review-card-media__title">
        {title}
      </p>
    </div>
  );
}
