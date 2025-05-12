import { useEffect, useRef } from "react";
import "./list-item-card.scss";

export default function ListItemCard(props) {
  const { title, subtitle, image, index, orientation = "horizontal" } = props;

  const titleRef = useRef(null);

  useEffect(() => {
    if (orientation === "vertical") {
      titleRef.current.classList.remove("scrolling-text");
      return;
    }

    const isOverflowing =
      titleRef.current.scrollWidth > titleRef.current.parentNode.clientWidth;

    if (isOverflowing) {
      titleRef.current.classList.add("scrolling-text");
    } else {
      titleRef.current.classList.remove("scrolling-text");
    }
  }, [title, orientation]);

  return (
    <div className={`list-item list-item--${orientation}`}>
      <div className={`list-item__media list-item__media--${orientation}`}>
        {index && (
          <p className={`list-item__index list-item__index--${orientation}`}>
            {index}
          </p>
        )}
        <img
          src={image}
          className={`list-item__image list-item__image--${orientation}`}
        />
      </div>

      <div className={`list-item__info list-item__info--${orientation}`}>
        <div className="list-item__title--wrapper">
          <p ref={titleRef} className="list-item__title">
            {title}
          </p>
        </div>
        {subtitle && <p className="list-item__subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}
