import "./list-item-card.scss";

export default function ListItemCard(props) {
  const { title, subtitle, image, index, orientation = 0 } = props;

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
        <p
          className={`list-item-title ${orientation === 0 && "horizontal"}`}
        >
          {title}
        </p>
        {subtitle && (
          <p className="list-item-subtitle">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
