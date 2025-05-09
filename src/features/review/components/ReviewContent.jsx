import { useEffect, useRef } from "react";
import { Tooltip } from "react-tooltip";
import { getTimeSince } from "src/utils/date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompactDisc,
  faMicrophoneLines,
  faMusic,
  faStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./review-content.scss";

function ReviewUser({ review }) {
  return (
    <div className="review-content__user">
      <div className="review-content__user--container">
        <img src={review.profileUrl} className="review-content__user--image" />
        <p>@{review.username}</p>
      </div>
      <p className="review-content__user--date">
        {getTimeSince(review.createdAt.toDate())}
      </p>
    </div>
  );
}

function ReviewMediaTitle({ title, subtitle, category }) {
  const icon =
    category === "track"
      ? faMusic
      : category === "album"
        ? faCompactDisc
        : faMicrophoneLines;

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

  const capitalizeFirstLetter = (str) => {
    return str[0].toUpperCase() + str.slice(1);
  };

  return (
    <div className="review-content__media">
      <div className="review-content__media--container">
        <div
          data-tooltip-content={capitalizeFirstLetter(category)}
          data-tooltip-id="category-tooltip"
        >
          <FontAwesomeIcon
            icon={icon}
            className="review-content__media--icon"
          />
          <Tooltip
            id="category-tooltip"
            place="top"
            type="dark"
            effect="float"
          />
        </div>
        <div className="review-content__media--title">
          <p ref={titleRef}>{title}</p>
        </div>
      </div>

      <p className="review-content__media--subtitle">{subtitle}</p>
    </div>
  );
}

function ReviewStars({ rating = 0, size = 20 }) {
  rating = Math.round(rating * 2) / 2;

  function getStarColor(ratingValue) {
    return ratingValue <= rating ? "#ffc107" : "#94969c";
  }

  return (
    <div className="review-content__stars">
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        const isHalf = rating === ratingValue - 0.5;

        return (
          <span key={i}>
            {isHalf ? (
              <FontAwesomeIcon
                icon={faStarHalfAlt}
                size={size}
                color="#ffc107"
              />
            ) : (
              <FontAwesomeIcon
                icon={faStar}
                size={size}
                color={getStarColor(ratingValue)}
              />
            )}
          </span>
        );
      })}
    </div>
  );
}

function ReviewContent({ review }) {
  return (
    <p className="review-content__text">
      {review.content.length > 150
        ? `${review.content.slice(0, 150)}...`
        : review.content}
    </p>
  );
}

export { ReviewUser, ReviewMediaTitle, ReviewStars, ReviewContent };
