import { useEffect, useRef } from "react";
import "./list-item-card.scss";

export default function ListItemCard(props) {
  const { title, subtitle, image, index, orientation = 0 } = props;

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
    <div
      className={`list-item-card ${orientation === 0 ? "horizontal" : "vertical"}`}
    >
      <div className="list-item-image">
        {index && (
          <p className={` ${orientation === 0 && "horizontal"}`}>{index}</p>
        )}
        <img src={image} />
      </div>

      <div className="list-item-info">
        <div className={`list-item-title ${orientation === 0 && "horizontal"}`}>
          <p ref={titleRef}>{title}</p>
        </div>
        {subtitle && <p className="list-item-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}
