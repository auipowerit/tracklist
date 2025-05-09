import { useEffect, useRef } from "react";
import { Tooltip } from "react-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompactDisc, faMusic } from "@fortawesome/free-solid-svg-icons";
import { faMicrophoneLines } from "@fortawesome/free-solid-svg-icons/faMicrophoneLines";
import "./review-card-media.scss";

export default function ReviewCardMedia({ title, subtitle, category }) {
  return (
    <div className="review-card-media">
      <div className="review-card-media__header">
        <MediaIcon category={category} />
        <MediaTitle title={title} />
      </div>

      <p className="review-card-media__subtitle">{subtitle}</p>
    </div>
  );
}

function MediaIcon({ category }) {
  const icon =
    category === "track"
      ? faMusic
      : category === "album"
        ? faCompactDisc
        : faMicrophoneLines;

  function capitalizeFirstLetter(str) {
    return str[0].toUpperCase() + str.slice(1);
  }

  return (
    <div
      data-tooltip-content={capitalizeFirstLetter(category)}
      data-tooltip-id="category-tooltip"
    >
      <FontAwesomeIcon icon={icon} className="review-card-media__icon" />
      <Tooltip id="category-tooltip" place="top" type="dark" effect="float" />
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
