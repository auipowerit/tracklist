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
    <div className={`list-item-card ${orientation}`}>
      <div className={`list-item-image ${orientation}`}>
        {index && <p>{index}</p>}
        <img src={image} />
      </div>

      <div className={`list-item-info ${orientation}`}>
        <div className="list-item-title">
          <p ref={titleRef}>{title}</p>
        </div>
        {subtitle && <p className="list-item-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}
